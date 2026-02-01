"use client";

import {
	Add01Icon,
	Delete02Icon,
	Mail01Icon,
	MoreVerticalIcon,
	Refresh01Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@notra/ui/components/ui/avatar";
import { Badge } from "@notra/ui/components/ui/badge";
import { Button } from "@notra/ui/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@notra/ui/components/ui/dropdown-menu";
import { Skeleton } from "@notra/ui/components/ui/skeleton";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@notra/ui/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Invitation } from "better-auth/plugins/organization";
import { use, useState } from "react";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/container";
import { InviteMemberModal } from "@/components/members/invite-member-modal";
import { useOrganizationsContext } from "@/components/providers/organization-provider";
import { authClient } from "@/lib/auth/client";

interface PageProps {
	params: Promise<{ slug: string }>;
}

interface Member {
	id: string;
	userId: string;
	role: string;
	user: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
	};
}

export default function MembersPage({ params }: PageProps) {
	const { slug } = use(params);
	const { getOrganization, activeOrganization } = useOrganizationsContext();
	const organization =
		activeOrganization?.slug === slug
			? activeOrganization
			: getOrganization(slug);
	const [activeTab, setActiveTab] = useState("members");
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const queryClient = useQueryClient();

	const { data: members, isLoading: membersLoading } = useQuery<Member[]>({
		queryKey: ["members", organization?.id],
		queryFn: async () => {
			if (!organization?.id) return [];
			const { data, error } = await authClient.organization.listMembers({
				query: {
					organizationId: organization.id,
				},
			});
			if (error) {
				throw new Error(error.message || "Failed to fetch members");
			}
			// Transform Better Auth member format to our Member interface
			const membersList = data?.members ?? [];
			return membersList.map((member) => ({
				id: member.id,
				userId: member.userId,
				role: member.role,
				user: {
					id: member.user.id,
					name: member.user.name,
					email: member.user.email,
					image: member.user.image ?? null,
				},
			}));
		},
		enabled: !!organization?.id,
	});

	const { data: invitations, isLoading: invitationsLoading } = useQuery<
		Invitation[]
	>({
		queryKey: ["invitations", organization?.id],
		queryFn: async () => {
			if (!organization?.id) return [];
			const { data, error } = await authClient.organization.listInvitations({
				query: {
					organizationId: organization.id,
				},
			});
			if (error) {
				throw new Error("Failed to fetch invitations");
			}
			return data ?? [];
		},
		enabled: !!organization?.id,
	});

	const pendingInvitations = invitations?.filter(
		(inv) => inv.status === "pending",
	);

	const { mutate: resendInvitation, isPending: isResending } = useMutation({
		mutationFn: async (invitation: Invitation) => {
			if (!organization?.id) {
				throw new Error("Organization not found");
			}
			const { error } = await authClient.organization.inviteMember({
				email: invitation.email,
				role: invitation.role as "member" | "admin" | "owner",
				organizationId: organization.id,
				resend: true,
			});

			if (error) {
				throw new Error(error.message || "Failed to resend invitation");
			}
		},
		onMutate: () => {
			return { toastId: toast.loading("Resending invite...") };
		},
		onSuccess: (_data, _variables, context) => {
			toast.success("Invitation resent successfully", { id: context?.toastId });
			queryClient.invalidateQueries({
				queryKey: ["invitations", organization?.id],
			});
		},
		onError: (error: Error, _variables, context) => {
			toast.error(error.message || "Failed to resend invitation", { id: context?.toastId });
		},
	});

	const { mutate: cancelInvitation, isPending: isCanceling } = useMutation({
		mutationFn: async (invitationId: string) => {
			const { error } = await authClient.organization.cancelInvitation({
				invitationId,
			});

			if (error) {
				throw new Error(error.message || "Failed to cancel invitation");
			}
		},
		onMutate: () => {
			return { toastId: toast.loading("Canceling invite...") };
		},
		onSuccess: (_data, _variables, context) => {
			toast.success("Invitation canceled successfully", { id: context?.toastId });
			queryClient.invalidateQueries({
				queryKey: ["invitations", organization?.id],
			});
		},
		onError: (error: Error, _variables, context) => {
			toast.error(error.message || "Failed to cancel invitation", { id: context?.toastId });
		},
	});

	if (!organization) {
		return (
			<PageContainer className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
				<div className="w-full space-y-6 px-4 lg:px-6">
					<div className="space-y-1">
						<Skeleton className="h-9 w-32" />
						<Skeleton className="h-5 w-64" />
					</div>
					<Skeleton className="h-64 rounded-[20px]" />
				</div>
			</PageContainer>
		);
	}

	return (
		<PageContainer className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
			<div className="w-full space-y-6 px-4 lg:px-6">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<h1 className="font-bold text-3xl tracking-tight">Members</h1>
						<p className="text-muted-foreground">
							Manage who has access to this organization
						</p>
					</div>
					<Button size="sm" onClick={() => setIsInviteModalOpen(true)}>
						<HugeiconsIcon icon={Add01Icon} className="size-4" />
						Invite Member
					</Button>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList variant="line">
						<TabsTrigger value="members">
							Members
							{members && members.length > 0 && (
								<Badge variant="secondary" className="ml-1.5">
									{members.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value="pending">
							Pending
							{pendingInvitations && pendingInvitations.length > 0 && (
								<Badge variant="secondary" className="ml-1.5">
									{pendingInvitations.length}
								</Badge>
							)}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="members" className="mt-4">
						{membersLoading ? (
							<div className="overflow-hidden rounded-lg border border-border/80">
								<table className="w-full">
									<thead>
										<tr className="bg-muted/50 border-b border-border/80">
											<th className="px-4 py-3 text-left text-sm font-medium">
												User
											</th>
											<th className="px-4 py-3 text-left text-sm font-medium">
												Email
											</th>
											<th className="px-4 py-3 text-left text-sm font-medium">
												Role
											</th>
										</tr>
									</thead>
									<tbody>
										{[1, 2, 3].map((i) => (
											<tr
												key={i}
												className="border-b border-border/80 last:border-0"
											>
												<td className="px-4 py-3">
													<div className="flex items-center gap-3">
														<Skeleton className="size-8 rounded-full" />
														<Skeleton className="h-4 w-24" />
													</div>
												</td>
												<td className="px-4 py-3">
													<Skeleton className="h-4 w-40" />
												</td>
												<td className="px-4 py-3">
													<Skeleton className="h-5 w-16 rounded-full" />
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : members && members.length > 0 ? (
							<div className="overflow-hidden rounded-lg border border-border/80">
								<table className="w-full">
									<thead>
										<tr className="bg-muted/50 border-b border-border/80">
											<th className="px-4 py-3 text-left text-sm font-medium">
												User
											</th>
											<th className="px-4 py-3 text-left text-sm font-medium">
												Email
											</th>
											<th className="px-4 py-3 text-left text-sm font-medium">
												Role
											</th>
										</tr>
									</thead>
									<tbody>
										{members.map((member) => (
											<tr
												key={member.id}
												className="border-b border-border/80 last:border-0"
											>
												<td className="px-4 py-3">
													<div className="flex items-center gap-3">
														<Avatar className="size-8">
															<AvatarImage
																alt={member.user.name}
																src={member.user.image ?? undefined}
															/>
															<AvatarFallback>
																{member.user.name.charAt(0).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<span className="font-medium text-sm">
															{member.user.name}
														</span>
													</div>
												</td>
												<td className="px-4 py-3 text-sm text-muted-foreground">
													{member.user.email}
												</td>
												<td className="px-4 py-3">
													<Badge
														variant={
															member.role === "owner" ? "default" : "secondary"
														}
													>
														{member.role.charAt(0).toUpperCase() +
															member.role.slice(1)}
													</Badge>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="bg-muted flex size-12 items-center justify-center rounded-full mb-3">
									<HugeiconsIcon
										icon={UserGroupIcon}
										className="text-muted-foreground size-6"
									/>
								</div>
								<p className="text-muted-foreground text-sm">
									No team members yet
								</p>
								<p className="text-muted-foreground text-xs">
									Invite people to collaborate on this organization
								</p>
							</div>
						)}
					</TabsContent>

					<TabsContent value="pending" className="mt-4">
						{invitationsLoading ? (
							<div className="overflow-hidden rounded-lg border border-border/80">
								<table className="w-full">
									<thead>
										<tr className="bg-muted/50 border-b border-border/80">
											<th className="px-4 py-3 text-left text-sm font-medium">
												Email
											</th>
											<th className="px-4 py-3 text-left text-sm font-medium">
												Role
											</th>
											<th className="px-4 py-3 text-left text-sm font-medium">
												Expires
											</th>
										</tr>
									</thead>
									<tbody>
										{[1, 2].map((i) => (
											<tr
												key={i}
												className="border-b border-border/80 last:border-0"
											>
												<td className="px-4 py-3">
													<Skeleton className="h-4 w-48" />
												</td>
												<td className="px-4 py-3">
													<Skeleton className="h-5 w-16 rounded-full" />
												</td>
												<td className="px-4 py-3">
													<Skeleton className="h-4 w-24" />
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : pendingInvitations && pendingInvitations.length > 0 ? (
							<div className="overflow-hidden rounded-lg border border-border/80">
								<table className="w-full">
									<thead>
										<tr className="bg-muted/50 border-b border-border/80">
											<th className="px-4 py-3 text-left text-sm font-medium">
												Email
											</th>
											<th className="px-4 py-3 text-left text-sm font-medium">
												Role
											</th>
											<th className="px-4 py-3 text-left text-sm font-medium">
												Expires
											</th>
											<th className="px-4 py-3 text-right text-sm font-medium">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{pendingInvitations.map((invitation) => (
											<tr
												key={invitation.id}
												className="border-b border-border/80 last:border-0"
											>
												<td className="px-4 py-3">
													<div className="flex items-center gap-3">
														<div className="flex size-8 items-center justify-center rounded-full bg-muted">
															<HugeiconsIcon
																icon={Mail01Icon}
																className="size-4 text-muted-foreground"
															/>
														</div>
														<span className="text-sm">{invitation.email}</span>
													</div>
												</td>
												<td className="px-4 py-3">
													<Badge variant="secondary">
														{invitation.role.charAt(0).toUpperCase() +
															invitation.role.slice(1)}
													</Badge>
												</td>
												<td className="px-4 py-3 text-sm text-muted-foreground">
													{invitation.expiresAt.toLocaleDateString()}
												</td>
												<td className="px-4 py-3">
													<div className="flex justify-end">
														<DropdownMenu>
															<DropdownMenuTrigger
																className="flex size-8 items-center justify-center rounded-md hover:bg-accent"
																disabled={isResending || isCanceling}
															>
																<HugeiconsIcon
																	className="size-4 text-muted-foreground"
																	icon={MoreVerticalIcon}
																/>
															</DropdownMenuTrigger>
															<DropdownMenuContent
																align="end"
																className="min-w-40"
															>
																<DropdownMenuItem
																	onClick={() => resendInvitation(invitation)}
																	disabled={isResending || isCanceling}
																>
																	<HugeiconsIcon
																		className="size-4"
																		icon={Refresh01Icon}
																	/>
																	Resend Invite
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem
																	onClick={() =>
																		cancelInvitation(invitation.id)
																	}
																	disabled={isResending || isCanceling}
																	variant="destructive"
																>
																	<HugeiconsIcon
																		className="size-4"
																		icon={Delete02Icon}
																	/>
																	Cancel Invite
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="bg-muted flex size-12 items-center justify-center rounded-full mb-3">
									<HugeiconsIcon
										icon={Mail01Icon}
										className="text-muted-foreground size-6"
									/>
								</div>
								<p className="text-muted-foreground text-sm">
									No pending invitations
								</p>
								<p className="text-muted-foreground text-xs">
									Invitations you send will appear here until accepted
								</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>

			<InviteMemberModal
				open={isInviteModalOpen}
				onOpenChange={setIsInviteModalOpen}
				organizationId={organization.id}
			/>
		</PageContainer>
	);
}
