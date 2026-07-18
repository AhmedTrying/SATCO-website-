"use client";

import type { ReactNode } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

/* Compact, react-hook-form-friendly field wrappers used across all editors. */

export function FieldRow({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label?: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: FieldError;
  children: ReactNode;
}) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="label">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <div className="hint">{hint}</div>}
      {error && <div className="field-error">{error.message || "Required"}</div>}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  error,
  registration,
  id,
  placeholder,
  type = "text",
}: {
  label?: string;
  hint?: ReactNode;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  id?: string;
  placeholder?: string;
  type?: string;
}) {
  const inputId = id ?? registration.name;
  return (
    <FieldRow label={label} htmlFor={inputId} hint={hint} error={error}>
      <input
        id={inputId}
        className="input"
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        {...registration}
      />
    </FieldRow>
  );
}

export function TextArea({
  label,
  hint,
  error,
  registration,
  id,
  rows = 4,
  placeholder,
}: {
  label?: string;
  hint?: ReactNode;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  id?: string;
  rows?: number;
  placeholder?: string;
}) {
  const inputId = id ?? registration.name;
  return (
    <FieldRow label={label} htmlFor={inputId} hint={hint} error={error}>
      <textarea
        id={inputId}
        className="textarea"
        rows={rows}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        {...registration}
      />
    </FieldRow>
  );
}

export function NumberInput({
  label,
  hint,
  error,
  registration,
  id,
  placeholder,
}: {
  label?: string;
  hint?: ReactNode;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  id?: string;
  placeholder?: string;
}) {
  const inputId = id ?? registration.name;
  return (
    <FieldRow label={label} htmlFor={inputId} hint={hint} error={error}>
      <input
        id={inputId}
        className="input"
        type="number"
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        {...registration}
      />
    </FieldRow>
  );
}

export function Toggle({
  label,
  hint,
  registration,
  id,
}: {
  label: string;
  hint?: ReactNode;
  registration: UseFormRegisterReturn;
  id?: string;
}) {
  const inputId = id ?? registration.name;
  return (
    <label htmlFor={inputId} className="flex cursor-pointer items-start gap-2.5 py-1">
      <input id={inputId} type="checkbox" className="mt-0.5 h-4 w-4" {...registration} />
      <span>
        <span className="block text-sm font-medium text-strong">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function SelectInput({
  label,
  error,
  registration,
  id,
  options,
  hint,
}: {
  label?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  id?: string;
  options: { value: string; label: string }[];
  hint?: ReactNode;
}) {
  const inputId = id ?? registration.name;
  return (
    <FieldRow label={label} htmlFor={inputId} hint={hint} error={error}>
      <select id={inputId} className="select" {...registration}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldRow>
  );
}
