export const OUTPUT_TYPE_LABELS: Record<string, string> = {
  changelog: "Changelog",
  blog_post: "Blog Post",
  twitter_post: "Twitter Post",
  linkedin_post: "LinkedIn Post",
  investor_update: "Investor Update",
};

export const WEBHOOK_EVENT_LABELS: Record<string, string> = {
  release: "Release published",
  push: "Push to default branch",
  star: "New star",
  ping: "Webhook ping",
};

export function getOutputTypeLabel(outputType: string): string {
  return OUTPUT_TYPE_LABELS[outputType] ?? outputType;
}

export function getWebhookEventLabel(eventType: string): string {
  return WEBHOOK_EVENT_LABELS[eventType] ?? eventType;
}
