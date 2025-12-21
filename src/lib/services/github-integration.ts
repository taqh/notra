import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { decryptToken, encryptToken } from "@/lib/crypto/token-encryption";
import { db } from "@/lib/db/drizzle";
import {
  integrationRepositories,
  integrations,
  members,
  repositoryOutputs,
} from "@/lib/db/schema";
import { createOctokit } from "../octokit";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 16);

export type IntegrationType = "github";
export type OutputType = "changelog" | "blog_post" | "tweet";

type CreateIntegrationParams = {
  organizationId: string;
  userId: string;
  token: string | null;
  displayName: string;
  type: IntegrationType;
  owner: string;
  repo: string;
};

type AddRepositoryParams = {
  integrationId: string;
  owner: string;
  repo: string;
  outputs?: Array<{
    type: OutputType;
    enabled?: boolean;
    config?: Record<string, unknown>;
  }>;
};

type ConfigureOutputParams = {
  repositoryId: string;
  outputType: OutputType;
  enabled: boolean;
  config?: Record<string, unknown>;
};

export async function validateUserOrgAccess(
  userId: string,
  organizationId: string
): Promise<boolean> {
  const member = await db.query.members.findFirst({
    where: and(
      eq(members.userId, userId),
      eq(members.organizationId, organizationId)
    ),
  });
  return !!member;
}

export async function createIntegration(params: CreateIntegrationParams) {
  const { organizationId, userId, token, displayName, type, owner, repo } =
    params;

  const hasAccess = await validateUserOrgAccess(userId, organizationId);
  if (!hasAccess) {
    throw new Error("User does not have access to this organization");
  }

  let encryptedToken: string | null = null;

  if (token) {
    const octokit = createOctokit(token);

    try {
      await octokit.request("GET /user");
    } catch (_error) {
      throw new Error("Invalid GitHub token");
    }

    encryptedToken = encryptToken(token);
  } else {
    const octokit = createOctokit();

    try {
      await octokit.request("GET /repos/{owner}/{repo}", {
        owner,
        repo,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
    } catch (_error) {
      throw new Error(
        "Unable to access repository. It may be private and require a Personal Access Token."
      );
    }
  }

  const [integration] = await db
    .insert(integrations)
    .values({
      id: nanoid(),
      organizationId,
      createdByUserId: userId,
      type,
      encryptedToken,
      displayName,
      enabled: true,
    })
    .returning();

  const [repository] = await db
    .insert(integrationRepositories)
    .values({
      id: nanoid(),
      integrationId: integration.id,
      owner,
      repo,
      enabled: true,
    })
    .returning();

  await db.insert(repositoryOutputs).values([
    {
      id: nanoid(),
      repositoryId: repository.id,
      outputType: "changelog",
      enabled: true,
      config: null,
    },
    {
      id: nanoid(),
      repositoryId: repository.id,
      outputType: "blog_post",
      enabled: false,
      config: null,
    },
    {
      id: nanoid(),
      repositoryId: repository.id,
      outputType: "tweet",
      enabled: false,
      config: null,
    },
  ]);

  return integration;
}

export function getIntegrationsByOrganization(organizationId: string) {
  return db.query.integrations.findMany({
    where: eq(integrations.organizationId, organizationId),
    with: {
      createdByUser: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      repositories: {
        with: {
          outputs: true,
        },
      },
    },
  });
}

export function getIntegrationById(integrationId: string) {
  return db.query.integrations.findFirst({
    where: eq(integrations.id, integrationId),
    with: {
      organization: true,
      createdByUser: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      repositories: {
        with: {
          outputs: true,
        },
      },
    },
  });
}

export async function getDecryptedToken(
  integrationId: string,
  userId: string
): Promise<string | null> {
  const integration = await getIntegrationById(integrationId);

  if (!integration) {
    throw new Error("Integration not found");
  }

  const hasAccess = await validateUserOrgAccess(
    userId,
    integration.organizationId
  );

  if (!hasAccess) {
    throw new Error("User does not have access to this integration");
  }

  if (!integration.encryptedToken) {
    return null;
  }

  return decryptToken(integration.encryptedToken);
}

export async function addRepository(params: AddRepositoryParams) {
  const { integrationId, owner, repo, outputs = [] } = params;

  const integration = await getIntegrationById(integrationId);
  if (!integration) {
    throw new Error("Integration not found");
  }

  const [repository] = await db
    .insert(integrationRepositories)
    .values({
      id: nanoid(),
      integrationId,
      owner,
      repo,
      enabled: true,
    })
    .returning();

  if (outputs.length > 0) {
    await db.insert(repositoryOutputs).values(
      outputs.map((output) => ({
        id: nanoid(),
        repositoryId: repository.id,
        outputType: output.type,
        enabled: output.enabled ?? true,
        config: output.config,
      }))
    );
  }

  return repository;
}

export function getRepositoryById(repositoryId: string) {
  return db.query.integrationRepositories.findFirst({
    where: eq(integrationRepositories.id, repositoryId),
    with: {
      integration: true,
      outputs: true,
    },
  });
}

export async function configureOutput(params: ConfigureOutputParams) {
  const { repositoryId, outputType, enabled, config } = params;

  const existing = await db.query.repositoryOutputs.findFirst({
    where: and(
      eq(repositoryOutputs.repositoryId, repositoryId),
      eq(repositoryOutputs.outputType, outputType)
    ),
  });

  if (existing) {
    const [updated] = await db
      .update(repositoryOutputs)
      .set({
        enabled,
        config,
      })
      .where(eq(repositoryOutputs.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(repositoryOutputs)
    .values({
      id: nanoid(),
      repositoryId,
      outputType,
      enabled,
      config,
    })
    .returning();

  return created;
}

export async function toggleIntegration(
  integrationId: string,
  enabled: boolean
) {
  const [updated] = await db
    .update(integrations)
    .set({ enabled })
    .where(eq(integrations.id, integrationId))
    .returning();

  return updated;
}

export async function toggleRepository(repositoryId: string, enabled: boolean) {
  const [updated] = await db
    .update(integrationRepositories)
    .set({ enabled })
    .where(eq(integrationRepositories.id, repositoryId))
    .returning();

  return updated;
}

export async function deleteIntegration(integrationId: string) {
  await db.delete(integrations).where(eq(integrations.id, integrationId));
}

export async function deleteRepository(repositoryId: string) {
  await db
    .delete(integrationRepositories)
    .where(eq(integrationRepositories.id, repositoryId));
}

export async function listAvailableRepositories(
  integrationId: string,
  userId: string
) {
  const token = await getDecryptedToken(integrationId, userId);

  if (!token) {
    throw new Error(
      "No access token available for this integration. Cannot list repositories."
    );
  }

  const octokit = createOctokit(token);

  const { data } = await octokit.request("GET /user/repos", {
    per_page: 100,
    sort: "updated",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return data.map((repo) => ({
    owner: repo.owner.login,
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    description: repo.description,
    url: repo.html_url,
  }));
}
