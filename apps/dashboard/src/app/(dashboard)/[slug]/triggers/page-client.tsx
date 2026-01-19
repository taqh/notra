"use client";

import { useMemo, useState } from "react";
import { useOrganizationsContext } from "@/components/providers/organization-provider";
import { Button } from "@notra/ui/components/ui/button";
import { Skeleton } from "@notra/ui/components/ui/skeleton";
import { Switch } from "@notra/ui/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import type { Trigger } from "@/types/triggers";
import { getOutputTypeLabel } from "@/utils/output-types";
import { QUERY_KEYS } from "@/utils/query-keys";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@notra/ui/components/ui/select";
import { AddTriggerDialog } from "./trigger-dialog";

interface PageClientProps {
  organizationSlug: string;
}

export default function PageClient({ organizationSlug }: PageClientProps) {
  const { getOrganization } = useOrganizationsContext();
  const organization = getOrganization(organizationSlug);
  const organizationId = organization?.id;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.TRIGGERS.list(organizationId ?? ""),
    queryFn: async () => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const response = await fetch(
        `/api/organizations/${organizationId}/triggers`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch triggers");
      }

      return response.json() as Promise<{ triggers: Trigger[] }>;
    },
    enabled: !!organizationId,
  });

  const updateMutation = useMutation({
    mutationFn: async (trigger: Trigger) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const response = await fetch(
        `/api/organizations/${organizationId}/triggers?triggerId=${trigger.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceType: trigger.sourceType,
            sourceConfig: trigger.sourceConfig,
            targets: trigger.targets,
            outputType: trigger.outputType,
            outputConfig: trigger.outputConfig,
            enabled: !trigger.enabled,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update trigger");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRIGGERS.list(organizationId ?? ""),
      });
    },
    onError: () => {
      toast.error("Failed to update trigger");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (triggerId: string) => {
      if (!organizationId) {
        throw new Error("Organization ID is required");
      }
      const response = await fetch(
        `/api/organizations/${organizationId}/triggers?triggerId=${triggerId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Failed to delete trigger");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRIGGERS.list(organizationId ?? ""),
      });
      toast.success("Trigger removed");
    },
    onError: () => {
      toast.error("Failed to delete trigger");
    },
  });

  const triggers = data?.triggers ?? [];
  const [sourceFilter, setSourceFilter] = useState<
    "all" | Trigger["sourceType"]
  >("all");
  const [outputFilter, setOutputFilter] = useState<
    "all" | Trigger["outputType"]
  >("all");

  const filteredTriggers = useMemo(() => {
    return triggers.filter((trigger) => {
      const matchesSource =
        sourceFilter === "all" || trigger.sourceType === sourceFilter;
      const matchesOutput =
        outputFilter === "all" || trigger.outputType === outputFilter;
      return matchesSource && matchesOutput;
    });
  }, [triggers, sourceFilter, outputFilter]);

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="w-full space-y-6 px-4 lg:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-bold text-3xl tracking-tight">Triggers</h1>
            <p className="text-muted-foreground">
              Automate content generation from repositories and schedules.
            </p>
          </div>
          <AddTriggerDialog
            organizationId={organizationId ?? ""}
            onSuccess={() =>
              queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.TRIGGERS.list(organizationId ?? ""),
              })
            }
            trigger={
              <Button size="sm" variant="outline">
                <PlusIcon className="size-4" />
                <span className="ml-1">New trigger</span>
              </Button>
            }
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : triggers.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <h3 className="font-medium text-lg">No triggers yet</h3>
            <p className="text-muted-foreground text-sm">
              Create a trigger to generate content automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Source</span>
                <Select
                  onValueChange={(value) =>
                    setSourceFilter(value as "all" | Trigger["sourceType"])
                  }
                  value={sourceFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sources</SelectItem>
                    <SelectItem value="github_webhook">
                      GitHub webhook
                    </SelectItem>
                    <SelectItem value="cron">Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Output</span>
                <Select
                  onValueChange={(value) =>
                    setOutputFilter(value as "all" | Trigger["outputType"])
                  }
                  value={outputFilter}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="All outputs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All outputs</SelectItem>
                    <SelectItem value="changelog">Changelog</SelectItem>
                    <SelectItem value="blog_post">Blog Post</SelectItem>
                    <SelectItem value="twitter_post">Twitter Post</SelectItem>
                    <SelectItem value="linkedin_post">LinkedIn Post</SelectItem>
                    <SelectItem value="investor_update">
                      Investor Update
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => {
                  setSourceFilter("all");
                  setOutputFilter("all");
                }}
                size="sm"
                type="button"
                variant="ghost"
              >
                Reset filters
              </Button>
            </div>
            {filteredTriggers.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <h3 className="font-medium text-lg">No matching triggers</h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting the filters to see more.
                </p>
              </div>
            ) : (
              filteredTriggers.map((trigger) => (
                <div
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={trigger.id}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {trigger.sourceType.replace("_", " ")}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {trigger.sourceType === "cron"
                        ? "Scheduled"
                        : `Events: ${trigger.sourceConfig.eventTypes?.join(", ") ?? "-"}`}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Output: {getOutputTypeLabel(trigger.outputType)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Targets: {trigger.targets.repositoryIds.length} repos
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={trigger.enabled}
                      onCheckedChange={() => updateMutation.mutate(trigger)}
                      size="sm"
                    />
                    <Button
                      onClick={() => deleteMutation.mutate(trigger.id)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
