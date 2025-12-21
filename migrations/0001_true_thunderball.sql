CREATE TABLE "integration_repositories" (
	"id" text PRIMARY KEY NOT NULL,
	"integration_id" text NOT NULL,
	"owner" text NOT NULL,
	"repo" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"type" text NOT NULL,
	"encrypted_token" text NOT NULL,
	"display_name" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repository_outputs" (
	"id" text PRIMARY KEY NOT NULL,
	"repository_id" text NOT NULL,
	"output_type" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"config" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "integration_repositories" ADD CONSTRAINT "integration_repositories_integration_id_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repository_outputs" ADD CONSTRAINT "repository_outputs_repository_id_integration_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."integration_repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "integrationRepositories_integrationId_idx" ON "integration_repositories" USING btree ("integration_id");--> statement-breakpoint
CREATE UNIQUE INDEX "integrationRepositories_integration_owner_repo_uidx" ON "integration_repositories" USING btree ("integration_id","owner","repo");--> statement-breakpoint
CREATE INDEX "integrations_organizationId_idx" ON "integrations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "integrations_createdByUserId_idx" ON "integrations" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "repositoryOutputs_repositoryId_idx" ON "repository_outputs" USING btree ("repository_id");--> statement-breakpoint
CREATE UNIQUE INDEX "repositoryOutputs_repository_outputType_uidx" ON "repository_outputs" USING btree ("repository_id","output_type");