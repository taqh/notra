import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: "Chat",
};

async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { params, searchParams } = props;
  const { slug } = await params;
  const { q } = await searchParams;
  const initialQuery = typeof q === "string" ? q : undefined;

  return (
    <PageClient
      initialQuery={initialQuery}
      key={initialQuery ?? "new-chat"}
      organizationSlug={slug}
    />
  );
}

export default Page;
