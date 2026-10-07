/*
 * Inquiry notifications — tell a department mailbox when a new inquiry lands in
 * its inbox, so nobody has to watch the dashboard.
 *
 * Recipients come from env, one variable per inquiry type, with a shared fallback:
 *   INQUIRY_NOTIFY_PARTNERSHIPS=bd@satco.sa
 *   INQUIRY_NOTIFY_OPPORTUNITIES=bd@satco.sa
 *   INQUIRY_NOTIFY_PROCUREMENT=procurement@satco.sa
 *   INQUIRY_NOTIFY_CAREERS=hr@satco.sa
 *   INQUIRY_NOTIFY_GENERAL=info@satco.sa
 *   INQUIRY_NOTIFY_DEFAULT=info@satco.sa          (used when a type has no entry)
 *
 * Delivery uses Resend's HTTP API (free tier, no SDK) when RESEND_API_KEY and
 * NOTIFY_FROM are set; otherwise the notification is logged and skipped. Never
 * throws — a mail failure must not fail the public form submission.
 */

import type { ContactSubmission } from "@satco/shared";

import { INQUIRY_LABELS } from "./routing";

const RESEND_URL = "https://api.resend.com/emails";

export function recipientsFor(inquiryType: ContactSubmission["inquiryType"]): string[] {
  const specific = process.env[`INQUIRY_NOTIFY_${inquiryType.toUpperCase()}`];
  const raw = specific?.trim() || process.env.INQUIRY_NOTIFY_DEFAULT?.trim() || "";
  return raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyNewInquiry(
  submission: ContactSubmission,
  dashboardOrigin?: string,
): Promise<void> {
  const to = recipientsFor(submission.inquiryType);
  const label = INQUIRY_LABELS[submission.inquiryType];
  const subject = `New website inquiry (${label}) from ${submission.name}`;
  const link = dashboardOrigin
    ? `${dashboardOrigin.replace(/\/+$/, "")}/inquiries/${submission.inquiryType}`
    : undefined;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.NOTIFY_FROM?.trim();
  if (to.length === 0 || !apiKey || !from) {
    console.log(
      `[notify] ${subject} — ${to.length === 0 ? "no recipients configured" : "email delivery not configured"}; skipped.`,
    );
    return;
  }

  const lines = [
    `Inquiry type: ${label}`,
    `From: ${submission.name} <${submission.email}>`,
    submission.organization ? `Organization: ${submission.organization}` : null,
    `Received: ${submission.createdAt}`,
    "",
    submission.message,
    "",
    link ? `Open in the dashboard: ${link}` : null,
  ].filter((line): line is string => line !== null);

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: submission.email,
        subject,
        text: lines.join("\n"),
        html: `<pre style="font:14px/1.5 system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(lines.join("\n"))}</pre>`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      console.error(`[notify] Resend rejected the email (HTTP ${response.status}).`);
    }
  } catch (error) {
    console.error("[notify] email delivery failed", error);
  }
}
