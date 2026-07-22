const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const resolveAssetUrl = (path?: string | null | any) => {
  if (!path) return null;
  const urlString =
    typeof path === "object" ? path.url || path.avatarUrl : path;
  if (!urlString) return null;
  if (typeof urlString !== "string") return null;
  if (urlString.startsWith("http")) return urlString;
  const cleanPath = urlString.startsWith("/") ? urlString.slice(1) : urlString;
  return `${ASSET_BASE_URL}${cleanPath}`;
};

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
}
