export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
