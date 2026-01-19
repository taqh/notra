CREATE TABLE IF NOT EXISTS "content_triggers" (
  "id" text PRIMARY KEY NOT NULL,
  "organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
  "source_type" text NOT NULL,
  "source_config" jsonb NOT NULL,
  "targets" jsonb NOT NULL,
  "output_type" text NOT NULL,
  "output_config" jsonb,
  "dedupe_hash" text NOT NULL,
  "qstash_schedule_id" text,
  "enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "contentTriggers_organizationId_idx"
  ON "content_triggers" ("organization_id");

CREATE UNIQUE INDEX IF NOT EXISTS "contentTriggers_organization_dedupe_uidx"
  ON "content_triggers" ("organization_id", "dedupe_hash");
