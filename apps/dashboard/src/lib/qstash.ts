import { Client as WorkflowClient } from "@upstash/workflow";

const token = process.env.QSTASH_TOKEN;

if (!token) {
  throw new Error("QSTASH_TOKEN is not defined");
}

export const workflowClient = new WorkflowClient({ token });
