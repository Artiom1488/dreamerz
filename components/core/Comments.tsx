"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  Fragment,
} from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDreamComments, useCreateComment } from "@/api/queries";
import { useUserStore } from "@/stores/user-store";
import type { CommentDto, User } from "@/api/request-types";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { MessageCircle, Reply, Send, Smile } from "lucide-react";
import { HoverUser } from "@/components/reusable/HoverUser";
import EmojiModal from "@/components/reusable/EmojiModal";

interface CommentsProps {
  dreamId: string;
  currentUserAvatarUrl?: string | null;
  compact?: boolean;
  onOpenModal?: () => void;
}

interface CommentItemProps {
  comment: CommentDto;
  currentUser: User | null;
  onReply: (comment: CommentDto) => void;
  replyingToId: string | null;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}

const resolveAssetUrl = (path?: string | null | any) => {
  if (!path) return null;
  const urlString =
    typeof path === "object" ? path.url || path.avatarUrl : path;
  if (!urlString) return null;
  if (typeof urlString !== "string") return null;
  if (urlString.startsWith("http")) return urlString;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}${urlString.startsWith("/") ? urlString.slice(1) : urlString}`;
};

const AVATAR_COL = 44; // 32px avatar (h-8 w-8) + 12px gap = per-depth indent

interface FlatRow {
  comment: CommentDto;
  depth: number;
  parentId: string | null;
}

// Walks the comment + its (recursively) expanded children into a single flat
// list, tracking nesting depth and each row's direct parent id. Only
// descends into a node's children if that node's id is in `expanded`.
function flattenThread(
  comment: CommentDto,
  depth: number,
  parentId: string | null,
  expanded: Set<string>,
): FlatRow[] {
  const rows: FlatRow[] = [{ comment, depth, parentId }];
  if (expanded.has(comment.id) && comment.children?.length) {
    for (const child of comment.children) {
      rows.push(...flattenThread(child, depth + 1, comment.id, expanded));
    }
  }
  return rows;
}

function CommentRow({
  row,
  avatarRef,
  currentUser,
  onReply,
  isReplying,
  replyText,
  setReplyText,
  onSubmitReply,
  onCancelReply,
  onToggleReplies,
}: {
  row: FlatRow;
  avatarRef: (el: HTMLDivElement | null) => void;
  currentUser: User | null;
  onReply: (comment: CommentDto) => void;
  isReplying: boolean;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  onToggleReplies: () => void;
}) {
  const router = useRouter();
  const { comment, depth } = row;
  const timeAgo = useTimeAgo(comment.createdAt);
  const userAvatarUrl = resolveAssetUrl(comment.user.mainImageUrl);
  const replyInputRef = useRef<HTMLInputElement>(null);

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  // Autofocus the reply field the moment this row opens for reply, so the
  // person can start typing right away without an extra click.
  useEffect(() => {
    if (isReplying) replyInputRef.current?.focus();
  }, [isReplying]);

  // The API's `repliesCount` can be out of sync with the actual `children`
  // array it returns (e.g. it isn't bumped when a reply is created). Trust
  // the real array length when children was included, and only fall back
  // to repliesCount otherwise.
  const repliesCount = comment.children?.length ?? comment.repliesCount ?? 0;

  return (
    <div
      className="flex items-start gap-3"
      style={{ marginLeft: depth * AVATAR_COL }}
    >
      <div ref={avatarRef} className="flex-shrink-0">
        <Avatar
          className="h-8 w-8 relative z-10 cursor-pointer"
          onClick={() => handleUserClick(comment.user.id)}
        >
          <AvatarImage src={userAvatarUrl ?? undefined} />
          <AvatarFallback>
            {comment.user.firstName?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <HoverUser user={comment.user}>
          <div
            className="font-semibold text-sm cursor-pointer hover:underline"
            onClick={() => handleUserClick(comment.user.id)}
          >
            {comment.user.firstName} {comment.user.lastName}
          </div>
        </HoverUser>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm">{comment.message}</p>
        </div>

        {/* Reply to indicator */}
        {comment.replyUser && (
          <div className="text-xs text-muted-foreground">
            Replying to{" "}
            <span className="font-medium">
              {comment.replyUser.firstName} {comment.replyUser.lastName}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          <button
            onClick={() => onReply(comment)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Reply className="h-3 w-3" />
            Reply
          </button>
          {repliesCount > 0 && (
            <button
              onClick={onToggleReplies}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <MessageCircle className="h-3 w-3" />
              {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="flex items-center gap-2 pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={resolveAssetUrl(currentUser?.mainImageUrl) ?? undefined}
              />
              <AvatarFallback>
                {currentUser?.firstName?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="relative flex-1">
              <Input
                ref={replyInputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSubmitReply();
                  if (e.key === "Escape") onCancelReply();
                }}
                placeholder={`Reply to ${comment.user.firstName}...`}
                className="h-8 rounded-full bg-muted pr-12 text-sm"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                <button
                  type="button"
                  onClick={onCancelReply}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={onSubmitReply}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Shared "leave a comment" input bar - used both in the compact card and
// inside the full-screen modal, so the two never drift out of sync.
function CommentComposer({
  value,
  onChange,
  onSubmit,
  avatarUrl,
  currentUser,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  avatarUrl?: string | null;
  currentUser: User | null;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEmojiSelect = (emoji: string) => {
    onChange(value + emoji);
    // Refocus the input after emoji selection so user can press Enter to send
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl ?? undefined} />
        <AvatarFallback>
          {currentUser?.firstName?.[0]?.toUpperCase() ?? "U"}
        </AvatarFallback>
      </Avatar>

      <div className="relative flex-1">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          placeholder="Leave a comment.."
          className="h-10 rounded-full bg-muted pr-16"
          disabled={disabled}
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          <EmojiModal onEmojiSelect={handleEmojiSelect}>
            <button
              type="button"
              aria-label="Add emoji"
              className="text-muted-foreground transition hover:text-foreground"
            >
              <Smile className="h-4 w-4" />
            </button>
          </EmojiModal>
          <button
            type="button"
            onClick={onSubmit}
            aria-label="Post comment"
            className="text-muted-foreground transition hover:text-foreground"
            disabled={disabled}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  currentUser,
  onReply,
  replyingToId,
  replyText,
  setReplyText,
  onSubmitReply,
  onCancelReply,
}: CommentItemProps) {
  // Which comment ids (root or nested) currently have their replies open.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // Center points of every visible avatar, measured from the DOM so the
  // connector line is pixel-accurate regardless of comment text wrapping,
  // open reply boxes, etc. Indexed by position in `rows`, matching
  // avatarEls.current 1:1.
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  // Indexed by row position (matching `rows` 1:1), not by comment id. This
  // avoids any chance of a stale/duplicate id causing a ref or measured
  // point to be looked up under the wrong key.
  const avatarEls = useRef<Array<HTMLDivElement | null>>([]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Memoized on `comment` + `expanded` only - flattenThread() builds a new
  // array every call, so without this the identity changes every render,
  // which (via measure's dependency below) retriggers the layout effect and
  // setPoints on every render, causing an infinite update loop.
  const rows = useMemo(
    () => flattenThread(comment, 0, null, expanded),
    [comment, expanded],
  );

  // Trim/pad the ref array to match the current row count whenever rows
  // change, so stale slots from a previous (longer) rows array can't leak
  // into the new measurement pass.
  if (avatarEls.current.length !== rows.length) {
    avatarEls.current = rows.map((_, i) => avatarEls.current[i] ?? null);
  }

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerBox = container.getBoundingClientRect();
    const next: { x: number; y: number }[] = [];
    for (let i = 0; i < rows.length; i++) {
      const el = avatarEls.current[i];
      if (!el) {
        next.push(undefined as unknown as { x: number; y: number });
        continue;
      }
      const box = el.getBoundingClientRect();
      next[i] = {
        x: box.left - containerBox.left + box.width / 2,
        y: box.top - containerBox.top + box.height / 2,
      };
    }
    setPoints((prev) => {
      const sameShape =
        prev.length === next.length &&
        next.every((b, i) => {
          const a = prev[i];
          return a && b && a.x === b.x && a.y === b.y;
        });
      return sameShape ? prev : next;
    });
  }, [rows]);

  useLayoutEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    return () => ro.disconnect();
  }, [measure, replyingToId, replyText]);

  // Row position lookup for parent connectors - each row's parentId maps to
  // the array index of that parent within the same `rows` list, so the
  // connector always reads the point for the row actually rendered right
  // above it in the tree, never a stale id-keyed entry.
  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r, i) => map.set(r.comment.id, i));
    return map;
  }, [rows]);

  return (
    <div ref={containerRef} className="relative space-y-3">
      {/* Connector overlay: each reply's line kinks from its own direct
          parent's avatar position - not always from the root - so a
          reply-to-a-reply branches off its immediate parent's row, and that
          parent's own line still traces back to whatever it replied to.
          Looked up by row index, never by id, so a stale/duplicate id can't
          route a line to the wrong avatar. */}
      <svg
        className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {rows.map((r, i) => {
          if (r.parentId === null) return null;
          const parentIndex = indexById.get(r.parentId);
          if (parentIndex === undefined) return null;
          const parentPoint = points[parentIndex];
          const p = points[i];
          if (!parentPoint || !p) return null;

          const radius = Math.min(
            20,
            Math.abs(p.y - parentPoint.y),
            Math.abs(p.x - parentPoint.x),
          );
          const bendY = p.y - radius;
          const runX = parentPoint.x + radius;
          const d =
            radius > 1
              ? `M ${parentPoint.x} ${parentPoint.y} V ${bendY} Q ${parentPoint.x} ${p.y} ${runX} ${p.y} H ${p.x}`
              : `M ${parentPoint.x} ${parentPoint.y} V ${p.y} H ${p.x}`;

          return (
            <path
              key={r.comment.id}
              d={d}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      {rows.map((row, i) => (
        <Fragment key={row.comment.id}>
          <CommentRow
            row={row}
            avatarRef={(el) => {
              avatarEls.current[i] = el;
            }}
            currentUser={currentUser}
            onReply={onReply}
            isReplying={row.comment.id === replyingToId}
            replyText={replyText}
            setReplyText={setReplyText}
            onSubmitReply={onSubmitReply}
            onCancelReply={onCancelReply}
            onToggleReplies={() => toggleExpanded(row.comment.id)}
          />
        </Fragment>
      ))}
    </div>
  );
}

export default function Comments({
  dreamId,
  currentUserAvatarUrl,
  compact = false,
  onOpenModal,
}: CommentsProps) {
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<CommentDto | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const currentUser = useUserStore((state) => state.user);

  // Fetch comments for this dream
  const { data: commentsData, isLoading: commentsLoading } = useDreamComments(
    dreamId,
    { order: "DESC", page: 1, take: 50 },
  );
  const comments = commentsData?.results || [];
  const commentCount = commentsData?.meta.commentCount || 0;

  const createCommentMutation = useCreateComment();
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  const submitComment = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    createCommentMutation.mutate(
      {
        message: trimmed,
        dreamId: dreamId,
        replyUserId: null,
        parentId: null,
      },
      {
        onSuccess: () => {
          // Scroll to top to see the new comment
          if (commentsContainerRef.current) {
            commentsContainerRef.current.scrollTop = 0;
          }
        },
      },
    );

    setComment("");
  };

  const submitReply = () => {
    const trimmed = replyText.trim();
    if (!trimmed || !replyTo) return;

    createCommentMutation.mutate({
      message: trimmed,
      dreamId: dreamId,
      replyUserId: replyTo.user.id,
      parentId: replyTo.id,
    });

    setReplyText("");
    setReplyTo(null);
  };

  const handleReply = (comment: CommentDto) => {
    setReplyTo(comment);
    setReplyText("");
  };

  // Shared between the compact card list and the full-screen modal, so
  // replying/expanding/etc. behaves identically in both places.
  const renderCommentsList = () => {
    if (commentsLoading) {
      return (
        <div className="text-center text-muted-foreground py-4">
          Loading comments...
        </div>
      );
    }
    if (comments.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-4">
          No comments yet. Be the first to comment!
        </div>
      );
    }
    // In compact mode, show only the last comment
    const commentsToRender = compact ? [comments[0]] : comments;
    return commentsToRender.map((c) => (
      <CommentItem
        key={c.id}
        comment={c}
        currentUser={currentUser}
        onReply={handleReply}
        replyingToId={replyTo?.id ?? null}
        replyText={replyText}
        setReplyText={setReplyText}
        onSubmitReply={submitReply}
        onCancelReply={() => setReplyTo(null)}
      />
    ));
  };

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <h2 className="text-base font-semibold">Comments ({commentCount})</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Comments List */}
          <div
            ref={commentsContainerRef}
            className={`${compact ? "max-h-32" : "max-h-96"} overflow-y-auto space-y-4 pr-2`}
          >
            {renderCommentsList()}
          </div>

          {/* Opens the full comment thread in a bigger, easier-to-use view */}
          {commentCount > 0 && (
            <button
              type="button"
              onClick={
                onOpenModal ? onOpenModal : () => setShowAllComments(true)
              }
              className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Read all {commentCount}{" "}
              {commentCount === 1 ? "comment" : "comments"}
            </button>
          )}

          {/* Comment Input */}
          <div className="pt-2 border-t">
            <CommentComposer
              value={comment}
              onChange={setComment}
              onSubmit={submitComment}
              avatarUrl={currentUserAvatarUrl}
              currentUser={currentUser}
              disabled={createCommentMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Full-screen comments modal, opened via "Read all N comments" */}
      <Dialog open={showAllComments} onOpenChange={setShowAllComments}>
        <DialogContent className="flex h-[90vh] w-[95vw] !max-w-5xl flex-col gap-0 p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>Comments ({commentCount})</DialogTitle>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {renderCommentsList()}
          </div>

          <div className="border-t px-6 py-4">
            <CommentComposer
              value={comment}
              onChange={setComment}
              onSubmit={submitComment}
              avatarUrl={currentUserAvatarUrl}
              currentUser={currentUser}
              disabled={createCommentMutation.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
