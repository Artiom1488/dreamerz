"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Date helpers (no external date library — keeps the bundle light)  */
/* ------------------------------------------------------------------ */

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

/** Formats a Date as a local "yyyy-MM-dd" string (safe for <input type="date"> / form state). */
export function toISODateString(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Parses a "yyyy-MM-dd" string into a local Date, or undefined if invalid/empty. */
function parseISODateString(iso?: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function isSameDay(a?: Date, b?: Date) {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

type CalendarCell = { date: Date; inCurrentMonth: boolean };

/** Builds a fixed 6-week (42-cell) grid for a given month, including leading/trailing days. */
function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const leadingCount = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = leadingCount; i > 0; i--) {
    cells.push({ date: new Date(year, month, 1 - i), inCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inCurrentMonth: true });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      inCurrentMonth: false,
    });
  }
  return cells;
}

/* ------------------------------------------------------------------ */
/*  Shared trigger styling — mirrors the app's existing input look    */
/* ------------------------------------------------------------------ */

const triggerStyles =
  "h-12 w-full rounded-lg border-0 bg-slate-100 px-4 text-left text-slate-600 " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0 " +
  "transition-colors";

/* ------------------------------------------------------------------ */
/*  InlineSelect — small custom dropdown for month/year quick-jump.   */
/*  A native <select> can't be sized via CSS (the open list is drawn  */
/*  by the OS/browser), so month & year use this instead to stay      */
/*  compact and match the rest of the calendar's styling.             */
/* ------------------------------------------------------------------ */

interface InlineSelectOption<T extends string | number> {
  value: T;
  label: string;
}

function InlineSelect<T extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: {
  value: T;
  options: InlineSelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  React.useEffect(() => {
    if (open) {
      listRef.current
        ?.querySelector<HTMLElement>('[data-selected="true"]')
        ?.scrollIntoView({ block: "center" });
    }
  }, [open]);

  const selectedLabel = options.find((opt) => opt.value === value)?.label ?? "";

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-full items-center justify-between gap-1 rounded-md bg-slate-100 px-2 text-sm text-slate-600 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 top-[calc(100%+0.25rem)] z-50 max-h-48 w-full min-w-[88px] overflow-y-auto rounded-lg border border-slate-100 bg-white p-1 shadow-[0_8px_30px_rgba(15,15,20,0.12)] animate-in fade-in-0 zoom-in-95 duration-100"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  isSelected
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DatePicker                                                        */
/* ------------------------------------------------------------------ */

export interface DatePickerProps {
  /** Selected date as "yyyy-MM-dd" (matches native <input type="date"> and typical form schemas). */
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Earliest selectable date, "yyyy-MM-dd". */
  minDate?: string;
  /** Latest selectable date, "yyyy-MM-dd". */
  maxDate?: string;
}

export const DatePicker = React.memo(
  React.forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
    {
      value,
      onChange,
      onBlur,
      name,
      id,
      placeholder = "Select a date",
      disabled,
      className,
      minDate,
      maxDate,
    },
    forwardedRef,
  ) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const [popoverLayout, setPopoverLayout] = React.useState<{
      placement: "top" | "bottom";
      maxHeight?: number;
    }>({ placement: "bottom" });

    React.useImperativeHandle(
      forwardedRef,
      () => triggerRef.current as HTMLButtonElement,
    );

    const selectedDate = React.useMemo(
      () => parseISODateString(value),
      [value],
    );
    const minD = React.useMemo(() => parseISODateString(minDate), [minDate]);
    const maxD = React.useMemo(() => parseISODateString(maxDate), [maxDate]);

    const [viewDate, setViewDate] = React.useState<Date>(
      () => selectedDate ?? new Date(),
    );

    // Re-sync the visible month to the selected value each time the popover opens,
    // so re-opening always shows the relevant month instead of wherever it was last left.
    React.useEffect(() => {
      if (open) setViewDate(selectedDate ?? new Date());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Decide whether the calendar opens below or above the trigger, based on
    // actual available space — so it never spills past the visible edge of
    // whatever container it sits in (a card, a modal, the viewport, etc.).
    React.useLayoutEffect(() => {
      if (!open) return;

      function updateLayout() {
        const trigger = triggerRef.current;
        const popover = popoverRef.current;
        if (!trigger || !popover) return;

        const triggerRect = trigger.getBoundingClientRect();
        const gap = 8;
        const spaceBelow = window.innerHeight - triggerRect.bottom - gap;
        const spaceAbove = triggerRect.top - gap;
        const popoverHeight = popover.offsetHeight;

        const placement: "top" | "bottom" =
          popoverHeight > spaceBelow && spaceAbove > spaceBelow
            ? "top"
            : "bottom";
        const available = placement === "top" ? spaceAbove : spaceBelow;

        setPopoverLayout({
          placement,
          maxHeight:
            popoverHeight > available ? Math.max(available, 220) : undefined,
        });
      }

      updateLayout();
      window.addEventListener("resize", updateLayout);
      window.addEventListener("scroll", updateLayout, true);
      return () => {
        window.removeEventListener("resize", updateLayout);
        window.removeEventListener("scroll", updateLayout, true);
      };
    }, [open]);

    // Close on outside click.
    React.useEffect(() => {
      if (!open) return;
      function handlePointerDown(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handlePointerDown);
      return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [open]);

    // Close on Escape, return focus to trigger.
    React.useEffect(() => {
      if (!open) return;
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const grid = React.useMemo(
      () => buildMonthGrid(year, month),
      [year, month],
    );

    const isDisabledDate = React.useCallback(
      (date: Date) => {
        if (minD && startOfDay(date) < startOfDay(minD)) return true;
        if (maxD && startOfDay(date) > startOfDay(maxD)) return true;
        return false;
      },
      [minD, maxD],
    );

    const handleSelect = React.useCallback(
      (date: Date) => {
        if (isDisabledDate(date)) return;
        onChange?.(toISODateString(date));
        setOpen(false);
        triggerRef.current?.focus();
      },
      [isDisabledDate, onChange],
    );

    const goToMonth = React.useCallback((delta: number) => {
      setViewDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
      );
    }, []);

    const yearOptions = React.useMemo(() => {
      const upper = maxD?.getFullYear() ?? new Date().getFullYear() + 10;
      const lower = minD?.getFullYear() ?? upper - 120;
      const years: number[] = [];
      for (let y = upper; y >= lower; y--) years.push(y);
      return years;
    }, [minD, maxD]);

    const displayLabel = selectedDate
      ? selectedDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : placeholder;

    return (
      <div ref={containerRef} className="relative w-full">
        <button
          ref={triggerRef}
          type="button"
          id={id}
          name={name}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onBlur={onBlur}
          className={cn(
            triggerStyles,
            "relative flex items-center pr-10 disabled:cursor-not-allowed disabled:opacity-60",
            !selectedDate && "text-slate-400",
            className,
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </button>

        {open && (
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Choose a date"
            style={
              popoverLayout.maxHeight
                ? { maxHeight: popoverLayout.maxHeight, overflowY: "auto" }
                : undefined
            }
            className={cn(
              "absolute left-0 z-50 w-full min-w-[280px] rounded-2xl",
              "border border-slate-100 bg-white p-3 shadow-[0_8px_30px_rgba(15,15,20,0.12)]",
              "animate-in fade-in-0 zoom-in-95 duration-150",
              popoverLayout.placement === "bottom"
                ? "top-[calc(100%+0.5rem)] origin-top-left"
                : "bottom-[calc(100%+0.5rem)] origin-bottom-left",
            )}
          >
            {/* Header: month + year quick-jump, avoids tedious arrow-clicking for e.g. birth dates */}
            <div className="mb-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                aria-label="Previous month"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <InlineSelect
                ariaLabel="Month"
                className="min-w-0 flex-1"
                value={month}
                options={MONTH_LABELS.map((label, idx) => ({
                  value: idx,
                  label,
                }))}
                onChange={(idx) => setViewDate(new Date(year, idx, 1))}
              />

              <InlineSelect
                ariaLabel="Year"
                className="w-[88px] shrink-0"
                value={year}
                options={yearOptions.map((y) => ({
                  value: y,
                  label: String(y),
                }))}
                onChange={(y) => setViewDate(new Date(y, month, 1))}
              />

              <button
                type="button"
                onClick={() => goToMonth(1)}
                aria-label="Next month"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekday labels */}
            <div className="mb-0.5 grid grid-cols-7">
              {WEEKDAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="flex h-6 items-center justify-center text-[11px] font-medium text-slate-400"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div role="grid" className="grid grid-cols-7">
              {grid.map(({ date, inCurrentMonth }) => {
                const selected = isSameDay(date, selectedDate);
                const today = isSameDay(date, new Date());
                const disabledDay = isDisabledDate(date);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    role="gridcell"
                    aria-selected={selected}
                    disabled={disabledDay}
                    onClick={() => handleSelect(date)}
                    className={cn(
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                      inCurrentMonth ? "text-slate-700" : "text-slate-300",
                      !disabledDay && !selected && "hover:bg-slate-100",
                      today && !selected && "ring-1 ring-inset ring-slate-300",
                      selected && "bg-slate-900 text-white hover:bg-slate-900",
                      disabledDay &&
                        "cursor-not-allowed opacity-40 hover:bg-transparent",
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }),
);
