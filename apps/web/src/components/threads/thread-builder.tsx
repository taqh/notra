"use client";

import {
  Add01Icon,
  Cancel01Icon,
  DragDropVerticalIcon,
  Image01Icon,
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
import { InlineEditable } from "./inline-editable";

const DEFAULT_AUTHOR_NAME = "Your name";
const DEFAULT_AUTHOR_HANDLE = "yourhandle";
const LEADING_AT_REGEX = /^@/;
const WHITESPACE_REGEX = /\s+/;
const THREAD_POST_SELECTOR = "[data-thread-post-id]";

function getAddPostShortcut() {
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");
  return isMac ? "⌘ + Enter" : "Ctrl + Enter";
}

export default function ThreadBuilder() {
  const [posts, setPosts] = useState<ThreadPost[]>(() => createSeedThread());
  const [authorName, setAuthorName] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const completedDropRef = useRef(false);
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
  const addPostShortcut = getAddPostShortcut();
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
    completedDropRef.current = false;
    setDragId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }

  function movePost(sourceId: string, targetId: string) {
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

  function getPostIdFromY(clientY: number, list = listRef.current) {
    if (!list) {
      return null;
    }
    const items = Array.from(
      list.querySelectorAll<HTMLElement>(THREAD_POST_SELECTOR)
    );
    let closestId: string | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const item of items) {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(clientY - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestId = item.dataset.threadPostId ?? null;
      }
    }

    return closestId;
  }

  function handleDragOver(event: DragEvent<HTMLOListElement>) {
    if (!dragId) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const targetId = getPostIdFromY(event.clientY, event.currentTarget);
    if (targetId && dragOverId !== targetId) {
      setDragOverId(targetId);
    }
  }

  function handleTargetDragOver(id: string, event: DragEvent<HTMLElement>) {
    if (!dragId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  }

  function handleTargetDrop(targetId: string, event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    const sourceId = dragId ?? event.dataTransfer.getData("text/plain");
    setDragId(null);
    setDragOverId(null);
    if (!(sourceId && targetId) || sourceId === targetId) {
      return;
    }
    completedDropRef.current = true;
    movePost(sourceId, targetId);
  }

  function handleDrop(event: DragEvent<HTMLOListElement>) {
    event.preventDefault();
    const sourceId = dragId ?? event.dataTransfer.getData("text/plain");
    const targetId = dragOverId ?? getPostIdFromY(event.clientY);
    setDragId(null);
    setDragOverId(null);
    if (!(sourceId && targetId) || sourceId === targetId) {
      return;
    }
    completedDropRef.current = true;
    movePost(sourceId, targetId);
  }

  function handleDragEnd(sourceId: string, event: DragEvent<HTMLElement>) {
    if (completedDropRef.current) {
      completedDropRef.current = false;
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const targetId = dragOverId ?? getPostIdFromY(event.clientY);
    setDragId(null);
    setDragOverId(null);
    if (targetId && sourceId !== targetId) {
      movePost(sourceId, targetId);
    }
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
    <div className="mx-auto w-full max-w-2xl p-3 sm:p-5">
      <input
        accept="image/*"
        className="hidden"
        onChange={handleAvatarPick}
        ref={avatarInputRef}
        type="file"
      />

      <p className="mb-5 text-center font-normal font-sans text-muted-foreground text-xs leading-5">
        Click the name, handle, or avatar to customize the author.
      </p>

      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: list handles native drag-and-drop targets; reorder controls remain keyboard accessible */}
      <ol
        className="relative flex flex-col gap-2"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={listRef}
      >
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
          const showConnector = index < posts.length - 1;

          return (
            <li
              className={cn(
                "group/post relative flex gap-3 rounded-xl p-3 transition-colors focus-within:bg-muted/50 hover:bg-muted/40",
                isDragging && "opacity-50",
                isDropTarget && "bg-primary/5 ring-1 ring-primary/40"
              )}
              data-thread-post-id={post.id}
              key={post.id}
            >
              {showConnector && (
                <div
                  aria-hidden
                  className="-translate-x-1/2 pointer-events-none absolute top-13 bottom-[-1.375rem] left-8 w-px bg-border"
                  data-thread-connector
                />
              )}

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

              <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
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

              {/* biome-ignore lint/a11y/noStaticElementInteractions: controls rail is part of the native drag-and-drop target area */}
              {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: controls rail catches drops released outside the card body */}
              <div
                className="-right-18 absolute top-3 flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover/post:opacity-100"
                onDragOver={(event) => handleTargetDragOver(post.id, event)}
                onDrop={(event) => handleTargetDrop(post.id, event)}
              >
                {showDrag && (
                  <button
                    aria-label={`Drag post ${index + 1}`}
                    className="flex size-7 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
                    draggable
                    onDragEnd={(event) => handleDragEnd(post.id, event)}
                    onDragStart={(event) => handleDragStart(post.id, event)}
                    type="button"
                  >
                    <HugeiconsIcon
                      className="size-4"
                      icon={DragDropVerticalIcon}
                    />
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

      <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-col sm:items-center sm:justify-between">
        <Button
          className="sm:w-auto"
          onClick={() => addPostAfter()}
          size="sm"
          type="button"
        >
          <HugeiconsIcon className="size-3.5" icon={Add01Icon} />
          <span>Add post</span>
        </Button>
        <p className="hidden font-normal font-sans text-muted-foreground/70 text-xs leading-5 sm:block">
          <span suppressHydrationWarning>{addPostShortcut}</span> when an input
          is focused adds a post.
        </p>
      </div>
    </div>
  );
}
