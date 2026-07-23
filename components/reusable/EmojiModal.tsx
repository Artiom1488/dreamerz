"use client";

import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Smile,
  PawPrint,
  Apple,
  Trophy,
  Plane,
  Lightbulb,
  Heart,
  Flag,
  type LucideIcon,
} from "lucide-react";

interface EmojiCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  emojis: string[];
}

// Standard emoji-picker category order (Smileys & People, Animals & Nature,
// Food & Drink, Activity, Travel & Places, Objects, Symbols, Flags).
// Swap or trim the emoji lists freely - this is just a starter set.
const CATEGORIES: EmojiCategory[] = [
  {
    id: "smileys-people",
    label: "Smileys & People",
    icon: Smile,
    emojis: [
      "😀",
      "😁",
      "😆",
      "😄",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "😐",
      "😉",
      "😊",
      "😇",
      "😍",
      "🥰",
      "🤩",
      "😋",
      "😗",
      "😌",
      "😙",
      "😘",
      "🥲",
      "😜",
      "😝",
      "😛",
      "🤪",
      "🤑",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "🫡",
      "😑",
      "🤐",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
      "😔",
      "😪",
      "🤤",
      "😴",
      "😷",
      "🤒",
      "🤕",
      "🤢",
      "🤮",
      "🥵",
      "🥶",
      "😳",
      "🥺",
      "😭",
      "😱",
      "😖",
      "😩",
      "😤",
      "😡",
    ],
  },
  {
    id: "animals-nature",
    label: "Animals & Nature",
    icon: PawPrint,
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
      "🐦",
      "🐤",
      "🦆",
      "🦅",
      "🦉",
      "🦇",
      "🐺",
      "🐗",
      "🐴",
      "🌵",
      "🌲",
      "🌳",
      "🌴",
      "🌱",
      "🌿",
      "☘️",
      "🍀",
      "🍁",
      "🍂",
      "🍃",
      "🌸",
      "🌼",
    ],
  },
  {
    id: "food-drink",
    label: "Food & Drink",
    icon: Apple,
    emojis: [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶️",
      "🫑",
      "🌽",
      "🥕",
      "🍕",
      "🍔",
      "🍟",
      "🌭",
      "🥪",
      "🌮",
      "🌯",
      "🥗",
      "🍝",
      "🍜",
      "🍣",
      "🍩",
      "🍪",
    ],
  },
  {
    id: "activity",
    label: "Activity",
    icon: Trophy,
    emojis: [
      "⚽️",
      "🏀",
      "🏈",
      "⚾️",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🎱",
      "🏓",
      "🏸",
      "🥊",
      "🥋",
      "🎯",
      "🎳",
      "⛳️",
      "🏹",
      "🎣",
      "🤿",
      "🎽",
      "🛹",
      "🛼",
      "🎿",
      "🏆",
      "🥇",
      "🥈",
    ],
  },
  {
    id: "travel-places",
    label: "Travel & Places",
    icon: Plane,
    emojis: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚓",
      "🚑",
      "🚒",
      "🚲",
      "🛵",
      "🏍️",
      "✈️",
      "🚀",
      "🛸",
      "🚁",
      "⛵️",
      "🚤",
      "🚢",
      "🗽",
      "🗼",
      "🏰",
      "🏯",
      "🎡",
      "🎢",
      "🏖️",
      "🏝️",
      "🏔️",
    ],
  },
  {
    id: "objects",
    label: "Objects",
    icon: Lightbulb,
    emojis: [
      "⌚️",
      "📱",
      "💻",
      "⌨️",
      "🖥️",
      "🖨️",
      "📷",
      "📸",
      "🎥",
      "📺",
      "📻",
      "🎙️",
      "🎧",
      "⏰",
      "🔋",
      "💡",
      "🔦",
      "🕯️",
      "📚",
      "📖",
      "✏️",
      "🖊️",
      "🖌️",
      "📌",
      "📎",
      "🔒",
    ],
  },
  {
    id: "symbols",
    label: "Symbols",
    icon: Heart,
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "✨",
      "💫",
      "💥",
      "💢",
      "💦",
      "💨",
    ],
  },
  {
    id: "flags",
    label: "Flags",
    icon: Flag,
    emojis: [
      "🏁",
      "🚩",
      "🎌",
      "🏴",
      "🏳️",
      "🏳️‍🌈",
      "🏴‍☠️",
      "🇺🇳",
      "🇺🇸",
      "🇬🇧",
      "🇨🇦",
      "🇦🇺",
      "🇩🇪",
      "🇫🇷",
      "🇮🇹",
      "🇪🇸",
      "🇯🇵",
      "🇰🇷",
      "🇨🇳",
      "🇮🇳",
      "🇧🇷",
      "🇲🇽",
      "🇷🇺",
      "🇿🇦",
      "🇳🇱",
      "🇸🇪",
    ],
  },
];

interface EmojiModalProps {
  /** Called with the emoji character (e.g. "😀") when the user picks one. */
  onEmojiSelect: (emoji: string) => void;
  /**
   * Custom trigger element (e.g. your existing Smile icon button). If
   * omitted, a default Smile-icon button is rendered.
   */
  children?: React.ReactNode;
  /** Extra classes for the popover panel itself. */
  className?: string;
}

export default function EmojiModal({
  onEmojiSelect,
  children,
  className,
}: EmojiModalProps) {
  const [open, setOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Every category is rendered in one continuous list (no filtering), so
  // scrolling naturally moves from Smileys & People all the way through
  // Flags without needing to pick a category first.
  //
  // A scroll-spy keeps the active tab in sync with whatever section is
  // currently near the top of the view as the person scrolls.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topId = visible[0]?.target.getAttribute("data-category-id");
        if (topId) setActiveCategoryId(topId);
      },
      {
        root,
        // Treat a section as "active" once its header reaches the top
        // quarter of the panel, rather than only when fully in view.
        rootMargin: "0px 0px -75% 0px",
        threshold: 0,
      },
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Fresh state each time the picker opens (content remounts on open).
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setActiveCategoryId(CATEGORIES[0].id);
  }, []);

  const handleSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ?? (
          <button
            type="button"
            aria-label="Add emoji"
            className="text-muted-foreground transition hover:text-foreground"
          >
            <Smile className="h-4 w-4" />
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={`w-[368px] max-w-[92vw] overflow-hidden p-0 ${className ?? ""}`}
      >
        {/* Category tabs - clicking one scrolls to that section, it doesn't
            filter the list */}
        <div className="flex items-center justify-between border-b px-3 py-2">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                type="button"
                aria-label={category.label}
                onClick={() => scrollToCategory(category.id)}
                className={`flex items-center justify-center border-b-2 px-1.5 pb-2 pt-1 transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Continuous emoji list - every category, one after another */}
        <div ref={scrollRef} className="max-h-80 overflow-y-auto px-4 py-3">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              ref={(el) => {
                sectionRefs.current[category.id] = el;
              }}
              data-category-id={category.id}
              className="mb-4 last:mb-0"
            >
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {category.label}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {category.emojis.map((emoji, i) => (
                  <button
                    key={`${category.id}-${i}`}
                    type="button"
                    onClick={() => handleSelect(emoji)}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-xl leading-none transition hover:bg-muted"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
