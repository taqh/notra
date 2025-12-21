import type React from "react";

export type Integration = {
  id: string;
  displayName: string;
  type: string;
  enabled: boolean;
  createdAt: string;
  createdByUser?: {
    name: string;
    email: string;
  };
  repositories: Array<{
    id: string;
    owner: string;
    repo: string;
    enabled: boolean;
  }>;
};

export type IntegrationConfig = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  available: boolean;
  category: "input" | "output";
};

export type GitHubRepoInfo = {
  owner: string;
  repo: string;
  fullUrl: string;
};

export type AvailableRepo = {
  owner: string;
  name: string;
  fullName: string;
  private: boolean;
  description: string | null;
};

export type Repository = {
  id: string;
  owner: string;
  repo: string;
  enabled: boolean;
  outputs: Array<{
    id: string;
    outputType: string;
    enabled: boolean;
  }>;
};

export type AddIntegrationDialogProps = {
  organizationId?: string;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

export type AddRepositoryDialogProps = {
  integrationId: string;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

export type IntegrationCardProps = {
  integration: Integration;
  onUpdate?: () => void;
};

export type RepositoryListProps = {
  integrationId: string;
};
