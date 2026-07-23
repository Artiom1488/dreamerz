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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  X,
  Reply,
  Send,
  Smile,
} from "lucide-react";
import type { NewsFeedItemDto, CommentDto, User } from "@/api/request-types";
import { useUserStore } from "@/stores/user-store";
import {
  useDreamComments,
  useCreateComment,
  useLikeDream,
} from "@/api/queries";
import { PricingModal } from "@/components/reusable/PricingModal";
import { HoverUser } from "@/components/reusable/HoverUser";
import EmojiModal from "@/components/reusable/EmojiModal";
import { resolveAssetUrl } from "./postUtils";
import { useTimeAgo } from "@/hooks/useTimeAgo";

interface NewsFeedModalProps {
  post: NewsFeedItemDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
      <div className="flex-1 space-y-1 min-w-0">
        <HoverUser user={comment.user}>
          <span
            className="font-semibold text-sm cursor-pointer hover:underline"
            onClick={() => handleUserClick(comment.user.id)}
          >
            {comment.user.firstName} {comment.user.lastName}
          </span>
        </HoverUser>
        <p className="text-sm leading-snug break-words">{comment.message}</p>

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

// Shared "leave a comment" input bar.
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
    <div ref={containerRef} className="relative space-y-4">
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

export function NewsFeedModal({
  post,
  open,
  onOpenChange,
}: NewsFeedModalProps) {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const [saved, setSaved] = useState(post.isSaved);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const likeDreamMutation = useLikeDream();

  const dream = post.newsFeedDream;
  const user = post.user;
  const contributor = post.contributor;

  const [liked, setLiked] = useState(
    dream?.likedDreamsByUsers?.some((u) => u.id === currentUser?.id) || false,
  );
  const [likesCount, setLikesCount] = useState(
    dream?.likedDreamsByUsers?.length || 0,
  );

  const contributorTimeAgo = useTimeAgo(post.createdAt);
  const postTimeAgo = useTimeAgo(dream?.createdAt ?? "");

  // Comments
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<CommentDto | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: commentsData, isLoading: commentsLoading } = useDreamComments(
    dream?.id ?? "",
    { order: "DESC", page: 1, take: 50 },
    { enabled: open && !!dream?.id },
  );
  const comments = commentsData?.results || [];
  const commentCount = commentsData?.meta.commentCount || 0;

  const createCommentMutation = useCreateComment();
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  if (!dream || !user) return null;

  const progress = dream.progress || 0;
  const fulfilled = dream.amountReceived || 0;
  const received = dream.donations || 0;
  const likes = likesCount;
  const sent = 0; // API doesn't provide sent count
  const savedCount = dream.savedCount || 0;
  const isFulfilled = post.type === "FULFILL_DONATION";

  const handleUserClick = (userId: string) => {
    onOpenChange(false);
    router.push(`/profile/${userId}`);
  };

  const handleLike = () => {
    if (dream?.id) {
      likeDreamMutation.mutate(dream.id, {
        onSuccess: (updatedDream) => {
          const isLiked =
            updatedDream.likedDreamsByUsers?.some(
              (u: any) => u.id === currentUser?.id,
            ) || false;
          setLiked(isLiked);
          setLikesCount(updatedDream.likedDreamsByUsers?.length || 0);
        },
      });
    }
  };
  const handleSave = () => setSaved(!saved);

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Sharing post");
  };

  const handleFulfill = () => {
    if (currentUser?.balance === 0) {
      setShowPricingModal(true);
      return;
    }
    // TODO: Implement fulfill functionality
    console.log("Fulfilling dream");
  };

  const submitComment = () => {
    const trimmed = comment.trim();
    if (!trimmed || !dream) return;

    createCommentMutation.mutate(
      {
        message: trimmed,
        dreamId: dream.id,
        replyUserId: null,
        parentId: null,
      },
      {
        onSuccess: () => {
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
    if (!trimmed || !replyTo || !dream) return;

    createCommentMutation.mutate({
      message: trimmed,
      dreamId: dream.id,
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

  const renderCommentsList = () => {
    if (commentsLoading) {
      return (
        <div className="text-center text-muted-foreground py-4 text-sm">
          Loading comments...
        </div>
      );
    }
    if (comments.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-4 text-sm">
          No comments yet. Be the first to comment!
        </div>
      );
    }
    return comments.map((c) => (
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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-6xl w-[95vw] h-[90vh] md:h-auto md:max-h-[90vh] gap-0 overflow-y-auto md:overflow-hidden p-0 flex flex-col md:flex-row [&>button]:hidden">
          {/* Accessible title, visually hidden - the real header lives in the right pane */}
          <DialogTitle className="sr-only">{dream.title}</DialogTitle>

          {/* Left: image carousel */}
          <div className="relative w-full aspect-[4/3] flex-shrink-0 md:aspect-auto md:flex-1 md:min-h-0 bg-black overflow-hidden">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="absolute left-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
            >
              <X className="h-4 w-4" />
            </button>

            {dream.images && dream.images.length > 0 ? (
              <Carousel className="h-full w-full [&_[data-slot=carousel-content]]:h-full [&_[data-slot=carousel-item]]:h-full">
                <CarouselContent className="h-full ml-0">
                  {dream.images.map((image) => (
                    <CarouselItem key={image.id} className="h-full pl-0">
                      <div className="h-full w-full overflow-hidden">
                        <img
                          src={
                            resolveAssetUrl(image.url || image.avatarUrl) || ""
                          }
                          alt={dream.title}
                          className="block h-full w-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {dream.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>

          {/* Right: post details + comments */}
          <div className="flex w-full md:w-[420px] md:flex-shrink-0 flex-col md:max-h-[90vh] border-l bg-background">
            {/* FulfilledBy Header */}
            {isFulfilled && contributor && (
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-b">
                <div className="flex items-center gap-2">
                  <Avatar
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => handleUserClick(contributor.id)}
                  >
                    <AvatarImage
                      src={
                        resolveAssetUrl(contributor.mainImageUrl) || undefined
                      }
                    />
                    <AvatarFallback>
                      {contributor.firstName?.[0]}
                      {contributor.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <HoverUser user={contributor}>
                      <span
                        className="font-semibold text-sm cursor-pointer hover:underline"
                        onClick={() => handleUserClick(contributor.id)}
                      >
                        {contributor.firstName} {contributor.lastName}
                      </span>
                    </HoverUser>
                    <span className="text-sm text-muted-foreground">
                      fulfilled this dream
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {contributorTimeAgo}
                </span>
              </div>
            )}

            {/* User header */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Avatar
                  className="h-10 w-10 cursor-pointer"
                  onClick={() => handleUserClick(user.id)}
                >
                  <AvatarImage
                    src={resolveAssetUrl(user.mainImageUrl) || undefined}
                  />
                  <AvatarFallback>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <HoverUser user={user}>
                    <div
                      className="font-semibold cursor-pointer hover:underline"
                      onClick={() => handleUserClick(user.id)}
                    >
                      {user.firstName} {user.lastName}
                    </div>
                  </HoverUser>
                  <div className="text-xs text-muted-foreground">
                    {postTimeAgo}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <Button
                  variant="gradient_fill"
                  size="sm"
                  className="px-6"
                  onClick={handleFulfill}
                >
                  Fulfill
                </Button>
              </div>
            </div>

            {/* Dream content */}
            <div className="px-5 pb-4 space-y-3">
              <p className="text-sm">{dream.title}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-1.5 flex-1" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {progress}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Fulfilled {fulfilled}</span>
                  <span>Received {received}</span>
                </div>
              </div>
            </div>

            {/* Social interactions */}
            <div className="flex items-center justify-between px-5">
              <div className="flex items-center gap-5">
                <button
                  onClick={handleLike}
                  aria-label="Like"
                  className={`transition ${liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                </button>
                <button
                  aria-label="Comment"
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Send"
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={handleSave}
                aria-label="Save"
                className={`transition ${saved ? "text-blue-500" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Bookmark
                  className={`h-5 w-5 ${saved ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Stats line */}
            <div className="flex items-center gap-2 px-5 pb-3 pt-2 text-xs text-muted-foreground">
              <span>{likes} Likes</span>
              <span>•</span>
              <span>{commentCount} Comments</span>
              <span>•</span>
              <span>{sent} Sent</span>
              <span>•</span>
              <span>{savedCount} Saved</span>
            </div>

            <div className="border-t" />

            {/* Comments list */}
            <div
              ref={commentsContainerRef}
              className="md:flex-1 md:min-h-0 md:overflow-y-auto px-5 py-4 space-y-4"
            >
              {renderCommentsList()}
            </div>

            {/* Comment composer */}
            <div className="border-t px-5 py-4">
              <CommentComposer
                value={comment}
                onChange={setComment}
                onSubmit={submitComment}
                avatarUrl={resolveAssetUrl(currentUser?.mainImageUrl)}
                currentUser={currentUser}
                disabled={createCommentMutation.isPending}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PricingModal
        open={showPricingModal}
        onOpenChange={setShowPricingModal}
      />
    </>
  );
}
