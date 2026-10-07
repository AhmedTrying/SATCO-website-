"use client";

import { useEffect, useId, useRef, useState } from "react";
import { contactPage } from "@/content/contact";
import { InquiryError, sendInquiry } from "@/lib/inquiries";

/*
 * Accessible contact form. Submissions go to the dashboard's public inquiries
 * endpoint (lib/inquiries.ts → satco-admin /api/public/inquiries), which files
 * them in the inbox for the chosen inquiry type and notifies that department.
 * Success is only shown after a 2xx response; failures show a real error.
 */

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/*
 * Field chrome: stone-500 rest border (≥3:1 boundary contrast, plan §9),
 * warming toward bronze on hover/focus; the invalid state rides the
 * aria-invalid attribute the errorProps seam already sets. The global
 * :focus-visible ring stays the primary focus indicator.
 */
const fieldClass =
  "w-full rounded-sm border border-stone-500 bg-bg px-3.5 py-3 text-[15px] text-strong transition-[border-color,background-color] duration-[var(--dur-fast)] hover:border-stone-600 focus:border-bronze-700 focus:bg-surface aria-[invalid=true]:border-error";
const labelClass = "mb-1.5 block text-sm font-semibold text-strong";

export function ContactForm() {
  const id = useId();
  const f = contactPage.form;
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [inquiry, setInquiry] = useState(contactPage.inquiryOptions[0].value);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /*
   * OVERRIDE (user direction, 2026-08-02): the visible "Routes to: …" line and
   * the "Proposed routing — pending client sign-off." note (docx comment #22)
   * are no longer rendered under the inquiry select. The routesTo mapping
   * stays in content/inquiryOptions for the submission pipeline.
   */

  // Focus management runs after commit so the targets exist in the DOM
  useEffect(() => {
    const key = (["name", "email", "message"] as const).find((k) => errors[k]);
    if (key) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${key}"]`)
        ?.focus();
    }
  }, [errors]);

  useEffect(() => {
    if (sent || submitError) statusRef.current?.focus();
  }, [sent, submitError]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      organization: String(data.get("organization") ?? "").trim(),
      inquiry,
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };
    const nextErrors: Errors = {};
    if (!values.name) nextErrors.name = f.nameError;
    if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
      nextErrors.email = f.emailError;
    if (!values.message) nextErrors.message = f.messageError;
    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length > 0) {
      setSent(false);
      return;
    }
    setSending(true);
    try {
      await sendInquiry(values);
      form.reset();
      setInquiry(contactPage.inquiryOptions[0].value);
      setSent(true);
    } catch (err) {
      setSent(false);
      // Server-side field validation maps back onto the same field errors.
      if (err instanceof InquiryError && err.field === "email") {
        setErrors({ email: f.emailError });
      } else {
        setSubmitError(f.submitError);
      }
    } finally {
      setSending(false);
    }
  };

  const errorProps = (key: keyof Errors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${id}-${key}-err` : undefined,
  });

  return (
    <div>
      <h2 className="mb-[22px] mt-0 font-display text-[clamp(1.4rem,2.4vw,1.7rem)] font-bold text-strong">
        {f.heading}
      </h2>
      {sent && (
        <div
          ref={statusRef}
          role="status"
          tabIndex={-1}
          className="mb-[22px] flex items-start gap-3 rounded-md border border-[#C9DBBB] bg-[#EEF3E9] px-[18px] py-4"
        >
          <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 flex-none rounded-[50%] bg-success" />
          <p className="m-0 text-[14.5px] leading-[1.55] text-[#2F5122]">{f.successMessage}</p>
        </div>
      )}
      {submitError && (
        <div
          ref={statusRef}
          role="alert"
          tabIndex={-1}
          className="mb-[22px] flex items-start gap-3 rounded-md border border-error/40 bg-error/5 px-[18px] py-4"
        >
          <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 flex-none rounded-[50%] bg-error" />
          <p className="m-0 text-[14.5px] leading-[1.55] text-error">{submitError}</p>
        </div>
      )}
      <p className="mb-3 mt-0 text-[13px] text-stone-600">{f.requiredNote}</p>
      {/* Two-up field grid on wider screens — pure layout; field names, order,
          validation and the submit seam are untouched. */}
      <form
        ref={formRef}
        noValidate
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 sm:gap-x-5"
      >
        <div>
          <label htmlFor={`${id}-name`} className={labelClass}>
            {f.nameLabel} <span aria-hidden="true" className="text-bronze-700">*</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
            {...errorProps("name")}
          />
          {errors.name && (
            <span id={`${id}-name-err`} className="mt-1 block text-[12.5px] text-error">
              {errors.name}
            </span>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={labelClass}>
            {f.emailLabel} <span aria-hidden="true" className="text-bronze-700">*</span>
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            {...errorProps("email")}
          />
          {errors.email && (
            <span id={`${id}-email-err`} className="mt-1 block text-[12.5px] text-error">
              {errors.email}
            </span>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-org`} className={labelClass}>
            {f.orgLabel}
          </label>
          <input
            id={`${id}-org`}
            name="organization"
            type="text"
            autoComplete="organization"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-inquiry`} className={labelClass}>
            {f.inquiryLabel}
          </label>
          <div className="relative">
            <select
              id={`${id}-inquiry`}
              name="inquiry"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              className={`${fieldClass} appearance-none pe-10`}
            >
              {contactPage.inquiryOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {/* Custom chevron (decorative) — vertical-only transform, RTL-safe */}
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-stone-600"
            >
              <path d="m4 6.2 4 4 4-4" />
            </svg>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className={labelClass}>
            {f.messageLabel} <span aria-hidden="true" className="text-bronze-700">*</span>
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            required
            rows={5}
            className={`${fieldClass} resize-y`}
            {...errorProps("message")}
          />
          {errors.message && (
            <span id={`${id}-message-err`} className="mt-1 block text-[12.5px] text-error">
              {errors.message}
            </span>
          )}
        </div>
        {/* Honeypot: hidden from people and assistive tech; bots that fill it are
            silently accepted and discarded by the endpoint. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
        {/* Arrow-gap widening mirrors the ArrowLink hover signature */}
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending || undefined}
          className="inline-flex cursor-pointer items-center gap-2 justify-self-start rounded-sm border-none bg-primary px-[26px] py-3.5 text-[15px] font-semibold text-white shadow-xs transition-[background-color,gap,box-shadow] duration-[var(--dur-base)] hover:gap-3 hover:bg-primary-hover hover:shadow-md disabled:cursor-progress disabled:opacity-70 sm:col-span-2"
        >
          {sending ? f.sendingLabel : f.submitLabel}{" "}
          <span aria-hidden="true" className="rtl:-scale-x-100">
            →
          </span>
        </button>
      </form>
    </div>
  );
}
