/*
 * Where the contact form sends inquiries: the dashboard's public endpoint
 * (satco-admin/app/api/public/inquiries). The origin is derived the same way the
 * careers feed derives its URL (lib/careers-feed.ts): from NEXT_PUBLIC_CAREERS_API_URL
 * when set, else localhost:3100 in local dev, else the hosted dashboard.
 */

export function inquiriesUrl(): string {
  const applicationsUrl = process.env.NEXT_PUBLIC_CAREERS_API_URL?.trim();
  if (applicationsUrl) {
    try {
      return new URL("/api/public/inquiries", applicationsUrl).toString();
    } catch {
      // Use the first-party dashboard URL below.
    }
  }
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${hostname}:3100/api/public/inquiries`;
    }
  }
  return "https://satco-dashboard.vercel.app/api/public/inquiries";
}

export interface InquiryPayload {
  name: string;
  email: string;
  organization: string;
  inquiry: string;
  message: string;
  /** Honeypot — must stay empty. */
  website: string;
}

export class InquiryError extends Error {
  field?: string;
  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}

/** POST the inquiry; resolves on 2xx, throws InquiryError otherwise. */
export async function sendInquiry(payload: InquiryPayload): Promise<void> {
  let response: Response;
  try {
    response = await fetch(inquiriesUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new InquiryError("network");
  }
  if (response.ok) return;
  let body: { error?: string; field?: string } = {};
  try {
    body = (await response.json()) as typeof body;
  } catch {
    // Non-JSON error body: fall through to the generic message.
  }
  throw new InquiryError(body.error ?? "failed", body.field);
}
