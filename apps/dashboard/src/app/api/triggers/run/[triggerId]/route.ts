import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@notra/db/drizzle";
import { contentTriggers } from "@notra/db/schema";
import { eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{ triggerId: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { triggerId } = await params;

  const trigger = await db.query.contentTriggers.findFirst({
    where: eq(contentTriggers.id, triggerId),
  });

  if (!trigger) {
    return NextResponse.json({ error: "Trigger not found" }, { status: 404 });
  }

  if (!trigger.enabled) {
    return NextResponse.json({ status: "disabled" });
  }

  return NextResponse.json({ status: "queued", triggerId });
}
