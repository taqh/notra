import { z } from "zod";

// GitHub URL validation regex patterns
const GITHUB_URL_PATTERNS = [
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/i,
  /^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/i,
  /^([^/]+)\/([^/]+)$/,
] as const;

function isValidGitHubUrl(url: string): boolean {
  const trimmed = url.trim();
  return GITHUB_URL_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export const addIntegrationFormSchema = z.object({
  repoUrl: z
    .string()
    .min(1, "Repository URL is required")
    .refine(
      (value) => isValidGitHubUrl(value),
      "Invalid GitHub repository URL or format. Use: https://github.com/owner/repo, git@github.com:owner/repo, or owner/repo"
    ),
  token: z.string(),
});

export type AddIntegrationFormValues = z.infer<typeof addIntegrationFormSchema>;

export const addRepositoryFormSchema = z.object({
  repository: z
    .string()
    .min(1, "Please select a repository")
    .regex(/^[^/]+\/[^/]+$/, "Invalid repository format. Expected: owner/repo"),
});

export type AddRepositoryFormValues = z.infer<typeof addRepositoryFormSchema>;

export const createIntegrationRequestSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  owner: z.string().min(1, "Repository owner is required"),
  repo: z.string().min(1, "Repository name is required"),
  token: z.string().optional().nullable(),
  type: z.enum(["github"]).default("github"),
});

export type CreateIntegrationRequest = z.infer<
  typeof createIntegrationRequestSchema
>;

export const addRepositoryRequestSchema = z.object({
  owner: z.string().min(1, "Repository owner is required"),
  repo: z.string().min(1, "Repository name is required"),
  outputs: z
    .array(
      z.object({
        type: z.enum(["changelog", "blog_post", "tweet"]),
        enabled: z.boolean(),
      })
    )
    .optional()
    .default([
      { type: "changelog", enabled: true },
      { type: "blog_post", enabled: false },
      { type: "tweet", enabled: false },
    ]),
});

export type AddRepositoryRequest = z.infer<typeof addRepositoryRequestSchema>;

export const getIntegrationsQuerySchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type GetIntegrationsQuery = z.infer<typeof getIntegrationsQuerySchema>;

export const integrationIdParamSchema = z.object({
  integrationId: z.string().min(1, "Integration ID is required"),
});

export type IntegrationIdParam = z.infer<typeof integrationIdParamSchema>;

export const repositoryIdParamSchema = z.object({
  repositoryId: z.string().min(1, "Repository ID is required"),
});

export type RepositoryIdParam = z.infer<typeof repositoryIdParamSchema>;

export const updateIntegrationBodySchema = z.object({
  enabled: z.boolean(),
});

export type UpdateIntegrationBody = z.infer<typeof updateIntegrationBodySchema>;

export const updateRepositoryBodySchema = z.object({
  enabled: z.boolean(),
});

export type UpdateRepositoryBody = z.infer<typeof updateRepositoryBodySchema>;

export const configureOutputBodySchema = z.object({
  outputType: z.enum(["changelog", "blog_post", "tweet"]),
  enabled: z.boolean(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export type ConfigureOutputBody = z.infer<typeof configureOutputBodySchema>;
