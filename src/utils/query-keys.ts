export const QUERY_KEYS = {
  AUTH: {
    session: ["auth", "session"],
    organizations: ["auth", "organizations"],
    activeOrganization: ["auth", "activeOrganization"],
  },
  INTEGRATIONS: {
    all: (organizationId: string) => ["integrations", organizationId],
    detail: (integrationId: string) => ["integrations", integrationId],
    repositories: (integrationId: string) => [
      "integrations",
      integrationId,
      "repositories",
    ],
    availableRepos: (integrationId: string) => [
      "integrations",
      integrationId,
      "available-repos",
    ],
  },
} as const;
