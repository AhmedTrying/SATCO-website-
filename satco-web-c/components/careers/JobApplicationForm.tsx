"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { Job } from "@/lib/types";
import { jobApplicationCopy as copy } from "@/content/job-application";

const fieldClass =
  "w-full rounded-sm border border-stone-500 bg-bg px-3.5 py-3 text-[15px] text-strong transition-[border-color,background-color] duration-[var(--dur-fast)] hover:border-stone-600 focus:border-bronze-700 focus:bg-surface disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "mb-1.5 block text-sm font-semibold text-strong";

function applicationEndpoint(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_CAREERS_API_URL?.trim();
  if (configured) return configured;
  if (typeof window === "undefined") return undefined;
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return `${window.location.protocol}//${window.location.hostname}:3100/api/public/job-applications`;
  }
  return "https://satco-dashboard.vercel.app/api/public/job-applications";
}

function Field({
  id,
  label,
  required,
  children,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-bronze-700">*</span>}
      </label>
      {children}
      {hint && <p className="mb-0 mt-1 text-[12.5px] text-stone-600">{hint}</p>}
    </div>
  );
}

export function JobApplicationForm({ job }: { job: Job }) {
  const id = useId();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!success) return;

    const countdown = window.setInterval(() => {
      setRedirectCountdown((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    const redirect = window.setTimeout(() => {
      router.replace("/careers/");
    }, 5000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, [router, success]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    setSuccess(false);
    const endpoint = applicationEndpoint();
    if (!endpoint) {
      setError("Online applications are temporarily unavailable.");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("jobSlug", job.slug);
    setPending(true);
    try {
      const response = await fetch(endpoint, { method: "POST", body: data });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(result.error || copy.errorMessage);
        return;
      }
      formRef.current?.reset();
      setRedirectCountdown(5);
      setSuccess(true);
    } catch {
      setError(copy.errorMessage);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-[clamp(1.4rem,3vw,2rem)] shadow-sm">
      <h2 className="mb-1 mt-0 font-display text-[clamp(1.35rem,2.4vw,1.7rem)] font-bold text-strong">{copy.formHeading}</h2>
      <p className="mb-6 mt-0 text-[13px] text-stone-600">{copy.requiredNote}</p>
      {error && <p role="alert" className="mb-6 mt-0 rounded-md border border-[#E6BCB3] bg-[#F6E0DC] px-[18px] py-3.5 text-sm text-error">{error}</p>}

      <form ref={formRef} onSubmit={onSubmit} className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 sm:gap-x-5">
        <input type="hidden" name="jobSlug" value={job.slug} />
        <div className="absolute -start-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
        <Field id={`${id}-name`} label={copy.fullNameLabel} required><input id={`${id}-name`} name="applicantName" type="text" required maxLength={160} autoComplete="name" disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-email`} label={copy.emailLabel} required><input id={`${id}-email`} name="email" type="email" required maxLength={254} autoComplete="email" disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-phone`} label={copy.phoneLabel} required><input id={`${id}-phone`} name="phone" type="tel" required maxLength={50} autoComplete="tel" disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-city`} label={copy.currentCityLabel} required><input id={`${id}-city`} name="currentCity" type="text" required maxLength={120} autoComplete="address-level2" disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-country`} label={copy.countryLabel} required><input id={`${id}-country`} name="countryOfResidence" type="text" required maxLength={120} autoComplete="country-name" disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-role`} label={copy.currentJobTitleLabel}><input id={`${id}-role`} name="currentJobTitle" type="text" maxLength={160} disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-years`} label={copy.yearsExperienceLabel} required><input id={`${id}-years`} name="yearsExperience" type="number" min="0" max="70" required disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-qualification`} label={copy.qualificationLabel} required><input id={`${id}-qualification`} name="qualification" type="text" maxLength={160} required disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-specialization`} label={copy.specializationLabel}><input id={`${id}-specialization`} name="specialization" type="text" maxLength={160} disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-employer`} label={copy.employerLabel}><input id={`${id}-employer`} name="currentEmployer" type="text" maxLength={160} disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-linkedin`} label={copy.linkedinLabel}><input id={`${id}-linkedin`} name="linkedinUrl" type="url" maxLength={500} placeholder="https://www.linkedin.com/in/…" disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-notice`} label={copy.noticePeriodLabel}><input id={`${id}-notice`} name="noticePeriod" type="text" maxLength={120} placeholder="e.g. Available now or 30 days" disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-skills`} label={copy.skillsLabel} hint={copy.skillsHint}><input id={`${id}-skills`} name="skills" type="text" maxLength={500} disabled={pending} className={fieldClass} /></Field>
        <Field id={`${id}-cv`} label={copy.cvLabel} required hint={copy.cvHint}><input id={`${id}-cv`} name="cv" type="file" required accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" disabled={pending} className={`${fieldClass} file:me-3 file:rounded-sm file:border-0 file:bg-bronze-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-bronze-900`} /></Field>

        {job.screeningQuestions?.length ? (
          <fieldset className="sm:col-span-2"><legend className={labelClass}>{copy.screeningHeading}</legend><div className="grid gap-[18px] sm:grid-cols-2">{job.screeningQuestions.map((question) => <Field key={question.id} id={`${id}-screen-${question.id}`} label={question.question} required={question.criteria === "required"}>{question.responseType === "yes-no" ? <select id={`${id}-screen-${question.id}`} name={`screening-${question.id}`} required={question.criteria === "required"} disabled={pending} className={fieldClass}><option value="">Select an answer</option><option value="Yes">Yes</option><option value="No">No</option></select> : <input id={`${id}-screen-${question.id}`} name={`screening-${question.id}`} type={question.responseType === "number" ? "number" : "text"} required={question.criteria === "required"} disabled={pending} className={fieldClass} />}</Field>)}</div></fieldset>
        ) : null}

        <div className="sm:col-span-2"><Field id={`${id}-cover`} label={copy.coverNoteLabel} hint={copy.coverNoteHint}><textarea id={`${id}-cover`} name="coverNote" rows={6} maxLength={3000} disabled={pending} className={`${fieldClass} resize-y`} /></Field></div>
        <label className="flex items-start gap-3 text-sm leading-[1.5] text-stone-700 sm:col-span-2"><input name="privacyAccepted" type="checkbox" value="yes" required disabled={pending} className="mt-1 h-4 w-4 accent-bronze-700" />{copy.privacyLabel}</label>
        <button type="submit" disabled={pending} className="inline-flex cursor-pointer items-center gap-2 justify-self-start rounded-sm border-none bg-primary px-[26px] py-3.5 text-[15px] font-semibold text-white shadow-xs transition-[background-color,gap,box-shadow] duration-[var(--dur-base)] hover:gap-3 hover:bg-primary-hover hover:shadow-md disabled:cursor-wait disabled:opacity-60 sm:col-span-2">{pending ? copy.submittingLabel : copy.submitLabel}{!pending && <span aria-hidden="true">→</span>}</button>
      </form>

      {success ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-success-title`}
          aria-describedby={`${id}-success-description`}
        >
          <div className="w-full max-w-lg rounded-lg border border-[#C9DBBB] bg-surface p-7 text-center shadow-xl sm:p-9">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF3E9] text-3xl font-bold text-[#2F5122]" aria-hidden="true">
              ✓
            </div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-bronze-700">Application received</p>
            <h2 id={`${id}-success-title`} className="mb-3 mt-0 font-display text-3xl font-bold text-strong">
              Thank you for applying
            </h2>
            <p id={`${id}-success-description`} className="mb-2 mt-0 text-base leading-[1.6] text-stone-700">
              Your application for {job.title} has been sent to the SATCO recruitment team.
            </p>
            <p className="mb-6 mt-0 text-sm text-stone-600">
              Returning you to Careers in {redirectCountdown} {redirectCountdown === 1 ? "second" : "seconds"}.
            </p>
            <button
              type="button"
              onClick={() => router.replace("/careers/")}
              className="inline-flex cursor-pointer items-center justify-center rounded-sm border-none bg-primary px-6 py-3 text-[15px] font-semibold text-white transition-colors duration-[var(--dur-base)] hover:bg-primary-hover"
            >
              View all careers now
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
