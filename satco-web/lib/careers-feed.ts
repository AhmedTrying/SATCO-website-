export function careersJobsUrl(): string {
  const applicationsUrl = process.env.NEXT_PUBLIC_CAREERS_API_URL?.trim();
  if (applicationsUrl) {
    try {
      return new URL("/api/public/jobs", applicationsUrl).toString();
    } catch {
      // Use the first-party dashboard URL below.
    }
  }
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${hostname}:3100/api/public/jobs`;
    }
  }
  return "https://satco-dashboard.vercel.app/api/public/jobs";
}
