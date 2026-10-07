import type { Job, JobApplication, ScreeningAnswer } from "@satco/shared";
import { isJobDeadlineOpen } from "@satco/shared";

import { adapters } from "@/lib/adapters";
import {
  allowedOrigins,
  corsHeaders,
  jsonResponse,
  rateLimitExceeded,
  recordAcceptedSubmission,
} from "@/lib/public-api";

export const runtime = "nodejs";

const MAX_CV_BYTES = 5 * 1024 * 1024;
const ALLOWED_CV_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
// Only ACCEPTED applications count (lib/public-api.ts): a rejected form never
// locks a visitor — or a whole office behind one IP — out for ten minutes.
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };

const json = jsonResponse;

function text(form: FormData, key: string, maxLength: number): string {
  return String(form.get(key) ?? "").trim().slice(0, maxLength);
}

function publicJob(job: Awaited<ReturnType<typeof adapters.jobs.list>>[number]): Job {
  return Object.fromEntries(
    Object.entries(job).filter(([key]) => !["state", "hiringManager", "createdAt", "updatedAt"].includes(key)),
  ) as Job;
}

function criteriaMatch(answers: ScreeningAnswer[]): JobApplication["criteriaMatch"] {
  const required = answers.filter((answer) => answer.criteria === "required");
  if (required.length === 0) return "needs-review";
  return required.every((answer) => answer.meetsCriteria)
    ? "meets-required"
    : "missing-required";
}

export async function GET(): Promise<Response> {
  const jobs = await adapters.jobs.list();
  return Response.json({
    jobs: jobs
      .filter((job) => job.state === "published" && isJobDeadlineOpen(job.applicationDeadline))
      .map(publicJob),
  });
}

export function OPTIONS(request: Request): Response {
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins().has(origin)) {
    return json({ error: "Origin not allowed." }, 403, origin);
  }
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins().has(origin)) {
    return json({ error: "Origin not allowed." }, 403, origin);
  }
  if (await rateLimitExceeded(request, "job-applications", RATE)) {
    return json(
      { error: "Too many applications were submitted. Please try again later." },
      429,
      origin,
    );
  }

  try {
    const form = await request.formData();
    if (text(form, "website", 200)) {
      return json({ ok: true }, 200, origin);
    }

    const jobSlug = text(form, "jobSlug", 160);
    const applicantName = text(form, "applicantName", 160);
    const email = text(form, "email", 254).toLowerCase();
    const phone = text(form, "phone", 50);
    const currentCity = text(form, "currentCity", 120);
    const countryOfResidence = text(form, "countryOfResidence", 120);
    const currentJobTitle = text(form, "currentJobTitle", 160);
    const yearsExperienceRaw = text(form, "yearsExperience", 3);
    const qualification = text(form, "qualification", 160);
    const specialization = text(form, "specialization", 160);
    const currentEmployer = text(form, "currentEmployer", 160);
    const linkedinUrl = text(form, "linkedinUrl", 500);
    const noticePeriod = text(form, "noticePeriod", 120);
    const workAuthorization = text(form, "workAuthorization", 160);
    const skills = text(form, "skills", 500)
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 30);
    const coverNote = text(form, "coverNote", 3000);

    if (!jobSlug || !applicantName || !email) {
      return json({ error: "Name and email are required." }, 400, origin);
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ error: "Enter a valid email address." }, 400, origin);
    }

    const job = await adapters.jobs.get(jobSlug);
    if (!job || job.state !== "published") {
      return json({ error: "This role is no longer accepting applications." }, 404, origin);
    }
    if (!isJobDeadlineOpen(job.applicationDeadline)) {
      return json({ error: "The application deadline for this role has passed." }, 404, origin);
    }
    const yearsExperience = yearsExperienceRaw ? Number(yearsExperienceRaw) : undefined;
    if (yearsExperienceRaw && (!Number.isInteger(yearsExperience) || yearsExperience! < 0 || yearsExperience! > 70)) {
      return json({ error: "Enter years of experience as a whole number." }, 400, origin);
    }
    if (linkedinUrl) {
      try {
        new URL(linkedinUrl);
      } catch {
        return json({ error: "Enter a valid LinkedIn profile URL." }, 400, origin);
      }
    }
    if (text(form, "privacyAccepted", 10) !== "yes") {
      return json({ error: "Please confirm the recruitment privacy notice." }, 400, origin);
    }

    const screeningAnswers: ScreeningAnswer[] = (job.screeningQuestions ?? []).map((question) => {
      const answer = text(form, `screening-${question.id}`, 1000);
      const expected = question.expectedAnswer?.trim().toLowerCase();
      const normalized = answer.trim().toLowerCase();
      const meetsCriteria = expected
        ? normalized === expected
        : question.criteria === "preferred"
          ? Boolean(normalized)
          : Boolean(normalized);
      return {
        questionId: question.id,
        question: question.question,
        criteria: question.criteria,
        answer,
        meetsCriteria,
      };
    });

    let cvMediaId: string | undefined;
    const cv = form.get("cv");
    if (cv instanceof File && cv.size > 0) {
      if (cv.size > MAX_CV_BYTES) {
        return json({ error: "The CV must be 5 MB or smaller." }, 400, origin);
      }
      if (!ALLOWED_CV_TYPES.has(cv.type)) {
        return json({ error: "Upload a PDF, DOC, or DOCX CV." }, 400, origin);
      }
      const filename = cv.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
      const media = await adapters.media.add(
        {
          filename: filename || "cv.pdf",
          alt: "",
          bucket: "private-uploads",
          mimeType: cv.type,
          sizeBytes: cv.size,
          category: "cv",
          dataBase64: Buffer.from(await cv.arrayBuffer()).toString("base64"),
        },
        "public-careers-form",
      );
      cvMediaId = media.id;
    }

    const application: JobApplication = await adapters.submissions.createApplication({
      jobId: job.id,
      jobTitle: job.title,
      applicantName,
      email,
      phone: phone || undefined,
      currentCity: currentCity || undefined,
      countryOfResidence: countryOfResidence || undefined,
      currentJobTitle: currentJobTitle || undefined,
      yearsExperience,
      qualification: qualification || undefined,
      specialization: specialization || undefined,
      currentEmployer: currentEmployer || undefined,
      linkedinUrl: linkedinUrl || undefined,
      noticePeriod: noticePeriod || undefined,
      workAuthorization: workAuthorization || undefined,
      skills,
      applicationSource: "SATCO Careers website",
      cvMediaId,
      coverNote: coverNote || undefined,
      screeningAnswers,
      criteriaMatch: criteriaMatch(screeningAnswers),
    });
    await recordAcceptedSubmission(request, "job-applications", RATE);

    await adapters.audit.append({
      actor: "public-careers-form",
      action: "application.create",
      entity: "application",
      entityId: application.id,
      summary: `Received an application for ${job.title}.`,
    });

    return json({ ok: true, applicationId: application.id }, 201, origin);
  } catch (error) {
    console.error("[applications] submission failed", error);
    return json(
      { error: "We could not submit your application. Please try again." },
      500,
      origin,
    );
  }
}
