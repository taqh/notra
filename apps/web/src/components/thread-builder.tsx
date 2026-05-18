"use client";

import {
  Add01Icon,
  Cancel01Icon,
  Edit02Icon,
  Image01Icon,
  Menu02Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@notra/ui/components/ui/avatar";
import { Button } from "@notra/ui/components/ui/button";
import { cn } from "@notra/ui/lib/utils";
import {
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createEmptyPost, createSeedThread } from "@/lib/threads/posts";
import {
  AUTHOR_HANDLE_LIMIT,
  AUTHOR_NAME_LIMIT,
  THREAD_POST_LIMIT,
  type ThreadPost,
} from "@/types/threads";

const DEFAULT_AUTHOR_NAME = "Your name";
const DEFAULT_AUTHOR_HANDLE = "yourhandle";
const LEADING_AT_REGEX = /^@/;
const WHITESPACE_REGEX = /\s+/;

interface InlineEditableProps {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  prefix?: string;
  className?: string;
  ariaLabel: string;
  maxLength: number;
}

function InlineEditable({
  value,
  onChange,
  placeholder,
  prefix,
  className,
  ariaLabel,
  maxLength,
}: InlineEditableProps) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault();
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <span className="inline-flex items-center">
        {prefix && (
          <span className={cn("pointer-events-none", className)}>{prefix}</span>
        )}
        <input
          aria-label={ariaLabel}
          className={cn(
            "min-w-4 rounded-sm bg-background px-1 outline-none ring-2 ring-primary/60",
            className
          )}
          maxLength={maxLength}
          onBlur={() => setEditing(false)}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          size={Math.max(value.length, placeholder.length, 4)}
          value={value}
        />
      </span>
    );
  }

  const display = value.trim() ? value : placeholder;
  const isPlaceholder = !value.trim();
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "group/edit inline-flex max-w-full cursor-text items-center gap-1 truncate rounded-sm px-1 text-left transition-colors hover:bg-muted/70 hover:underline hover:decoration-foreground/40 hover:decoration-dashed hover:underline-offset-4 focus-visible:bg-muted/70 focus-visible:outline-none",
        className,
        isPlaceholder && "font-normal text-muted-foreground/60"
      )}
      onClick={() => setEditing(true)}
      type="button"
    >
      <span className="truncate">
        {prefix}
        {display}
      </span>
      <HugeiconsIcon
        className="size-3 shrink-0 opacity-0 transition-opacity group-hover/edit:opacity-100 group-focus-visible/edit:opacity-100"
        icon={Edit02Icon}
      />
    </button>
  );
}

export default function ThreadBuilder() {
  const [posts, setPosts] = useState<ThreadPost[]>(() => createSeedThread());
  const [authorName, setAuthorName] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const textareaRefs = useRef(new Map<string, HTMLTextAreaElement>());
  const focusNextRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (authorAvatar?.startsWith("blob:")) {
        URL.revokeObjectURL(authorAvatar);
      }
    };
  }, [authorAvatar]);

  const trimmedName = authorName.trim();
  const previewName = trimmedName || DEFAULT_AUTHOR_NAME;
  const previewHandle =
    authorHandle.trim().replace(LEADING_AT_REGEX, "") || DEFAULT_AUTHOR_HANDLE;
  const avatarInitials = trimmedName
    ? trimmedName
        .split(WHITESPACE_REGEX)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "";
  const hasMultiplePosts = posts.length > 1;

  const registerTextarea = useCallback(
    (id: string) => (el: HTMLTextAreaElement | null) => {
      if (el) {
        textareaRefs.current.set(id, el);
        if (focusNextRef.current === id) {
          el.focus();
          focusNextRef.current = null;
        }
      } else {
        textareaRefs.current.delete(id);
      }
    },
    []
  );

  function updatePost(id: string, content: string) {
    setPosts((current) =>
      current.map((post) => (post.id === id ? { ...post, content } : post))
    );
  }

  function addPostAfter(id?: string) {
    const fresh = createEmptyPost();
    focusNextRef.current = fresh.id;
    setPosts((current) => {
      if (!id) {
        return [...current, fresh];
      }
      const index = current.findIndex((post) => post.id === id);
      if (index === -1) {
        return [...current, fresh];
      }
      const next = current.slice();
      next.splice(index + 1, 0, fresh);
      return next;
    });
  }

  function removePost(id: string) {
    setPosts((current) => {
      if (current.length <= 1) {
        return current.map((post) =>
          post.id === id ? { ...post, content: "" } : post
        );
      }
      return current.filter((post) => post.id !== id);
    });
  }

  function handleAvatarPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (authorAvatar?.startsWith("blob:")) {
      URL.revokeObjectURL(authorAvatar);
    }
    setAuthorAvatar(URL.createObjectURL(file));
    event.target.value = "";
  }

  function handleHandleChange(next: string) {
    setAuthorHandle(next.replace(LEADING_AT_REGEX, ""));
  }

  function handleDragStart(id: string, event: DragEvent<HTMLElement>) {
    setDragId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }

  function handleDragOver(id: string, event: DragEvent<HTMLLIElement>) {
    if (!dragId) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  }

  function handleDrop(targetId: string, event: DragEvent<HTMLLIElement>) {
    event.preventDefault();
    const sourceId = dragId ?? event.dataTransfer.getData("text/plain");
    setDragId(null);
    setDragOverId(null);
    if (!sourceId || sourceId === targetId) {
      return;
    }
    setPosts((current) => {
      const fromIndex = current.findIndex((post) => post.id === sourceId);
      const toIndex = current.findIndex((post) => post.id === targetId);
      if (fromIndex === -1 || toIndex === -1) {
        return current;
      }
      const moved = current[fromIndex];
      if (!moved) {
        return current;
      }
      const next = current.slice();
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function handleDragEnd() {
    setDragId(null);
    setDragOverId(null);
  }

  function handlePostKeyDown(
    id: string,
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      addPostAfter(id);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-5">
      <input
        accept="image/*"
        className="hidden"
        onChange={handleAvatarPick}
        ref={avatarInputRef}
        type="file"
      />

      <ol className="relative flex flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 bottom-10 left-7 w-px bg-border"
        />

        {posts.map((post, index) => {
          const isDragging = dragId === post.id;
          const isDropTarget =
            dragOverId === post.id && dragId !== null && dragId !== post.id;
          const length = post.content.length;
          const overLimit = length > THREAD_POST_LIMIT;
          const nearLimit = length > THREAD_POST_LIMIT - 20;
          let counterColor = "text-muted-foreground/70";
          if (overLimit) {
            counterColor = "text-destructive";
          } else if (nearLimit) {
            counterColor = "text-amber-500";
          }
          const isSoloEmpty = posts.length === 1 && length === 0;
          const showDelete = !isSoloEmpty;
          const showDrag = hasMultiplePosts;

          return (
            // biome-ignore lint/a11y/noNoninteractiveElementInteractions: list item acts as a drag-and-drop target; reorder is also accessible via per-item buttons
            <li
              className={cn(
                "group/post relative flex gap-3 rounded-lg px-2 py-3 transition-colors focus-within:bg-muted/50 hover:bg-muted/40",
                isDragging && "opacity-50",
                isDropTarget && "bg-primary/5 ring-1 ring-primary/40"
              )}
              key={post.id}
              onDragOver={(event) => handleDragOver(post.id, event)}
              onDrop={(event) => handleDrop(post.id, event)}
            >
              <button
                aria-label="Change avatar"
                className="group/avatar relative z-10 size-10 shrink-0 cursor-pointer rounded-full bg-background outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => avatarInputRef.current?.click()}
                type="button"
              >
                <Avatar className="size-10" size="lg">
                  {authorAvatar && (
                    <AvatarImage alt={previewName} src={authorAvatar} />
                  )}
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {avatarInitials || (
                      <HugeiconsIcon className="size-4" icon={User02Icon} />
                    )}
                  </AvatarFallback>
                </Avatar>
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-foreground/55 text-background opacity-0 transition-opacity group-hover/avatar:opacity-100 group-focus-visible/avatar:opacity-100">
                  <HugeiconsIcon className="size-4" icon={Image01Icon} />
                </span>
              </button>

              <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                  <InlineEditable
                    ariaLabel="Edit display name"
                    className="max-w-[14rem] font-sans font-semibold text-foreground text-sm leading-tight"
                    maxLength={AUTHOR_NAME_LIMIT}
                    onChange={setAuthorName}
                    placeholder={DEFAULT_AUTHOR_NAME}
                    value={authorName}
                  />
                  <InlineEditable
                    ariaLabel="Edit handle"
                    className="max-w-[10rem] font-sans text-muted-foreground text-sm leading-tight"
                    maxLength={AUTHOR_HANDLE_LIMIT}
                    onChange={handleHandleChange}
                    placeholder={DEFAULT_AUTHOR_HANDLE}
                    prefix="@"
                    value={authorHandle}
                  />
                </div>

                <textarea
                  className="field-sizing-content w-full resize-none whitespace-pre-wrap text-pretty rounded-sm bg-transparent font-sans text-[0.9375rem] text-foreground leading-relaxed outline-none placeholder:text-muted-foreground/80"
                  onChange={(event) => updatePost(post.id, event.target.value)}
                  onKeyDown={(event) => handlePostKeyDown(post.id, event)}
                  placeholder={
                    index === 0
                      ? "Write the first post…"
                      : "Continue the thread…"
                  }
                  ref={registerTextarea(post.id)}
                  rows={1}
                  value={post.content}
                />

                <span
                  className={cn(
                    "self-end font-mono text-xs tabular-nums",
                    counterColor
                  )}
                >
                  {length}/{THREAD_POST_LIMIT}
                </span>
              </div>

              <div className="absolute top-3 right-2 flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover/post:opacity-100">
                {showDrag && (
                  <button
                    aria-label={`Drag post ${index + 1}`}
                    className="flex size-7 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
                    draggable
                    onDragEnd={handleDragEnd}
                    onDragStart={(event) => handleDragStart(post.id, event)}
                    type="button"
                  >
                    <HugeiconsIcon className="size-4" icon={Menu02Icon} />
                  </button>
                )}
                {showDelete && (
                  <button
                    aria-label={`Delete post ${index + 1}`}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removePost(post.id)}
                    type="button"
                  >
                    <HugeiconsIcon className="size-3.5" icon={Cancel01Icon} />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-col-reverse items-stretch gap-3 pl-13 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="font-normal font-sans text-muted-foreground text-xs leading-5">
            Click the name, handle, or avatar to customize the author.
          </p>
          <p className="hidden font-normal font-sans text-muted-foreground/70 text-xs leading-5 sm:block">
            Shortcut: ⌘/Ctrl + Enter adds a post.
          </p>
        </div>
        <Button
          className="sm:w-auto"
          onClick={() => addPostAfter()}
          size="sm"
          type="button"
        >
          <HugeiconsIcon className="size-3.5" icon={Add01Icon} />
          <span>Add post</span>
        </Button>
      </div>
    </div>
  );
}
