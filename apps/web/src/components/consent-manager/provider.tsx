"use client";

import { DevTools } from "@c15t/dev-tools/react";
import {
  ConsentBanner,
  ConsentDialog,
  type ConsentManagerOptions,
  ConsentManagerProvider,
} from "@c15t/nextjs";

import { consentTheme } from "@/lib/consent-manager/theme";
import type { ConsentManagerProviderProps } from "@/types/consent-manager";

const databuddyClientId = process.env.NEXT_PUBLIC_DATABUDDY_WEB_WEBSITE_ID;
const vercelAnalyticsScriptSrc =
  process.env.NODE_ENV === "development"
    ? "https://va.vercel-scripts.com/v1/script.debug.js"
    : "/_vercel/insights/script.js";

type ConsentScripts = NonNullable<ConsentManagerOptions["scripts"]>;
type VercelAnalyticsWindow = typeof window & {
  va?: (...params: unknown[]) => void;
  vaq?: unknown[][];
  vam?: "development" | "production";
};

function createConsentScripts(): ConsentScripts {
  const scripts: ConsentScripts = [
    {
      id: "vercel-analytics",
      src: vercelAnalyticsScriptSrc,
      category: "measurement",
      defer: true,
      attributes: {
        "data-sdkn": "@vercel/analytics/next",
        "data-sdkv": "1.6.1",
      },
      onBeforeLoad: () => {
        const vercelWindow = window as VercelAnalyticsWindow;

        vercelWindow.vam =
          process.env.NODE_ENV === "development" ? "development" : "production";
        vercelWindow.va ??= (...params: unknown[]) => {
          vercelWindow.vaq = vercelWindow.vaq ?? [];
          vercelWindow.vaq.push(params);
        };
      },
    },
  ];

  if (databuddyClientId) {
    scripts.push({
      id: "databuddy",
      src: "https://cdn.databuddy.cc/databuddy.js",
      category: "measurement",
      async: true,
      attributes: {
        crossorigin: "anonymous",
        "data-client-id": databuddyClientId,
        "data-databuddy-injected": "true",
        "data-sdk-version": "2.4.1",
        "data-track-attributes": "true",
        "data-track-errors": "true",
        "data-track-hash-changes": "true",
      },
    });
  }

  return scripts;
}

const baseOptions = {
  consentCategories: ["necessary", "measurement", "marketing"],
  scripts: createConsentScripts(),
  theme: consentTheme,
} satisfies Partial<ConsentManagerOptions>;

const consentOptions: ConsentManagerOptions =
  process.env.NODE_ENV === "production"
    ? { ...baseOptions, mode: "hosted", backendURL: "/api/c15t" }
    : { ...baseOptions, mode: "offline" };

export default function ConsentManagerClient({
  children,
}: ConsentManagerProviderProps) {
  return (
    <ConsentManagerProvider options={consentOptions}>
      <ConsentBanner />
      <ConsentDialog />
      {process.env.NODE_ENV !== "production" && <DevTools />}
      {children}
    </ConsentManagerProvider>
  );
}
