import { newInquirySchema } from "@satco/shared/schemas";

import { adapters } from "@/lib/adapters";
import { notifyNewInquiry } from "@/lib/notify";
import { isRateLimited, jsonResponse, originAllowed, corsHeaders } from "@/lib/public-api";

export const runtime = "nodejs";

const RATE = { max: 5, windowMs: 10 * 60 * 1000 };

/**
 * Public contact-form endpoint. Called by the sites' ContactForm (all three
 * options). Accepts JSON or form-encoded bodies; rejects disallowed origins,
 * rate-limits per IP, swallows honeypot submissions, validates with the shared
 * zod schema, stores the inquiry in its inbox, audits, and notifies the
 * department mailbox (if configured).
 */
export function OPTIONS(request: Request): Response {
  const origin = request.headers.get("origin");
  if (!originAllowed(origin)) return jsonResponse({ error: "Origin not allowed." }, 403, origin);
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const json = (await request.json()) as unknown;
    return json && typeof json === "object" ? (json as Record<string, unknown>) : {};
  }
  const form = await request.formData();
  const out: Record<string, unknown> = {};
  form.forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
  });
  return out;
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!originAllowed(origin)) return jsonResponse({ error: "Origin not allowed." }, 403, origin);
  if (isRateLimited(request, "inquiries", RATE)) {
    return jsonResponse(
      { error: "Too many messages were sent from this connection. Please try again later." },
      429,
      origin,
    );
  }

  try {
    const body = await readBody(request);

    // Honeypot: real users never fill the hidden "website" field.
    if (typeof body.website === "string" && body.website.trim()) {
      return jsonResponse({ ok: true }, 200, origin);
    }

    const parsed = newInquirySchema.safeParse({
      name: body.name,
      email: typeof body.email === "string" ? body.email.toLowerCase() : body.email,
      organization:
        typeof body.organization === "string" && body.organization.trim()
          ? body.organization
          : undefined,
      // The site form posts the selector as "inquiry"; accept both spellings.
      inquiryType: body.inquiryType ?? body.inquiry,
      message: body.message,
    });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path[0];
      const message =
        field === "email"
          ? "Enter a valid email address."
          : field === "inquiryType"
            ? "Choose an inquiry type."
            : "Name, email and message are required.";
      return jsonResponse({ error: message, field }, 400, origin);
    }

    const submission = await adapters.submissions.createContact(parsed.data);
    await adapters.audit.append({
      actor: "public-contact-form",
      action: "inquiry.create",
      entity: "inquiry",
      entityId: submission.id,
      summary: `Received a ${submission.inquiryType} inquiry from ${submission.name}.`,
    });
    await notifyNewInquiry(submission, new URL(request.url).origin);

    return jsonResponse({ ok: true, id: submission.id }, 201, origin);
  } catch (error) {
    console.error("[inquiries] submission failed", error);
    return jsonResponse(
      { error: "We could not send your message. Please try again." },
      500,
      origin,
    );
  }
}
