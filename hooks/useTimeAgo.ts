import { useEffect, useState } from "react";
import { getTimeAgo } from "@/components/core/newsfeedcomp/postUtils";

/**
 * Returns a live "X minutes/hours/days ago" string that updates itself
 * every 60s, so long-lived tabs don't show a stale timestamp forever.
 */
export function useTimeAgo(dateString: string): string {
  const [label, setLabel] = useState(() => getTimeAgo(dateString));

  useEffect(() => {
    setLabel(getTimeAgo(dateString));
    const interval = setInterval(() => {
      setLabel(getTimeAgo(dateString));
    }, 60_000);
    return () => clearInterval(interval);
  }, [dateString]);

  return label;
}
