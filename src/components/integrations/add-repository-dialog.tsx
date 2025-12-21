"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { isValidElement, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  AddRepositoryDialogProps,
  AvailableRepo,
} from "@/types/integrations";
import { QUERY_KEYS } from "@/utils/query-keys";
import {
  type AddRepositoryFormValues,
  addRepositoryFormSchema,
} from "@/utils/schemas/integrations";

export function AddRepositoryDialog({
  integrationId,
  onSuccess,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: AddRepositoryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const queryClient = useQueryClient();

  const { data: availableRepos = [], isLoading: loadingRepos } = useQuery({
    queryKey: QUERY_KEYS.INTEGRATIONS.availableRepos(integrationId),
    queryFn: async () => {
      const response = await fetch(
        `/api/integrations/${integrationId}/repositories`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }
      return response.json() as Promise<AvailableRepo[]>;
    },
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: async (values: AddRepositoryFormValues) => {
      const [owner, repo] = values.repository.split("/");

      const response = await fetch(
        `/api/integrations/${integrationId}/repositories`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner,
            repo,
            outputs: [
              { type: "changelog", enabled: true },
              { type: "blog_post", enabled: false },
              { type: "tweet", enabled: false },
            ],
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add repository");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTEGRATIONS.repositories(integrationId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INTEGRATIONS.detail(integrationId),
      });
      toast.success("Repository added successfully");
      setOpen(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      repository: "",
    },
    onSubmit: ({ value }) => {
      // Validate with Zod before submitting
      const validationResult = addRepositoryFormSchema.safeParse(value);
      if (!validationResult.success) {
        return;
      }
      mutation.mutate(validationResult.data);
    },
  });

  const triggerElement =
    trigger && isValidElement(trigger) ? (
      <DialogTrigger render={trigger as React.ReactElement} />
    ) : null;

  return (
    <>
      {triggerElement}
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Repository</DialogTitle>
            <DialogDescription>
              Select a repository from your GitHub account to enable
              integrations.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="space-y-4 py-4">
              <form.Field
                name="repository"
                validators={{
                  onChange: addRepositoryFormSchema.shape.repository,
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel>Repository</FieldLabel>
                    {loadingRepos ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <>
                        <select
                          className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          disabled={mutation.isPending}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          value={field.state.value}
                        >
                          <option value="">Select a repository...</option>
                          {availableRepos.map((repo) => (
                            <option key={repo.fullName} value={repo.fullName}>
                              {repo.fullName} {repo.private ? "(Private)" : ""}
                            </option>
                          ))}
                        </select>
                        {field.state.meta.errors.length > 0 ? (
                          <p className="mt-1 text-destructive text-sm">
                            {typeof field.state.meta.errors[0] === "string"
                              ? field.state.meta.errors[0]
                              : String(field.state.meta.errors[0])}
                          </p>
                        ) : null}
                      </>
                    )}
                  </Field>
                )}
              </form.Field>
            </div>
            <DialogFooter>
              <DialogCancel disabled={mutation.isPending}>Cancel</DialogCancel>
              <form.Subscribe selector={(state) => [state.canSubmit]}>
                {([canSubmit]) => (
                  <DialogAction
                    disabled={!canSubmit || mutation.isPending || loadingRepos}
                    onClick={(e) => {
                      e.preventDefault();
                      form.handleSubmit();
                    }}
                    type="button"
                  >
                    {mutation.isPending ? "Adding..." : "Add Repository"}
                  </DialogAction>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
