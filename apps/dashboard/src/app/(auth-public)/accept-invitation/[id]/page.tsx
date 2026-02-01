import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/server";
import { getInvitationById } from "@/lib/auth/actions";
import PageClient from "./page-client";
import { Loader2Icon } from "lucide-react";

function LoadingSkeleton() {
	return (
		<div className="mx-auto w-full max-w-md rounded-[24px] bg-background px-5 py-7 ring-1 ring-foreground/10">
			<div className="flex min-h-[300px] items-center justify-center">
				<Loader2Icon className="size-6 animate-spin text-muted-foreground" />
			</div>
		</div>
	);
}

export default async function InvitePage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	const { id } = params;

	return (
		<Suspense fallback={<LoadingSkeleton />}>
			<InvitePageComponent invitationId={id} />
		</Suspense>
	);
}

async function InvitePageComponent({ invitationId }: { invitationId: string }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Fetch invitation server-side to validate it exists
	const invitationData = await getInvitationById(invitationId);

	if (!invitationData) {
		notFound();
	}

	// If invitation is expired or already accepted/rejected, show error
	if (invitationData.expired || invitationData.status !== "pending") {
		return (
			<PageClient
				invitationId={invitationId}
				invitation={invitationData}
				user={session?.user ?? null}
				initialError={
					invitationData.expired
						? "This invitation has expired."
						: invitationData.status === "accepted"
							? "This invitation has already been accepted."
							: invitationData.status === "rejected"
								? "This invitation has been declined."
								: "This invitation is no longer valid."
				}
			/>
		);
	}

	return (
		<PageClient
			invitationId={invitationId}
			invitation={invitationData}
			user={session?.user ?? null}
		/>
	);
}
