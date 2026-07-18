"use client";

/* Controlled string-array repeater (add/remove/reorder). Use via RHF Controller. */
export function StringList({
  label,
  values,
  onChange,
  placeholder,
  hint,
  multiline = false,
  addLabel = "Add item",
}: {
  label?: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  addLabel?: string;
}) {
  const update = (i: number, v: string) =>
    onChange(values.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      {label && <div className="label">{label}</div>}
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-2 w-5 shrink-0 text-end text-xs text-muted">
              {i + 1}.
            </span>
            {multiline ? (
              <textarea
                className="textarea"
                rows={2}
                value={v}
                aria-label={`${label ?? "Item"} ${i + 1}`}
                placeholder={placeholder}
                onChange={(e) => update(i, e.target.value)}
              />
            ) : (
              <input
                className="input"
                value={v}
                aria-label={`${label ?? "Item"} ${i + 1}`}
                placeholder={placeholder}
                onChange={(e) => update(i, e.target.value)}
              />
            )}
            <div className="flex shrink-0 flex-col">
              <button
                type="button"
                className="btn btn-ghost px-1.5 py-0.5"
                aria-label={`Move item ${i + 1} up`}
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="btn btn-ghost px-1.5 py-0.5"
                aria-label={`Move item ${i + 1} down`}
                disabled={i === values.length - 1}
                onClick={() => move(i, 1)}
              >
                ↓
              </button>
            </div>
            <button
              type="button"
              className="btn btn-ghost mt-0.5 px-2 text-error"
              aria-label={`Remove item ${i + 1}`}
              onClick={() => remove(i)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {hint && <div className="hint">{hint}</div>}
      <button
        type="button"
        className="btn btn-secondary mt-2 text-xs"
        onClick={() => onChange([...values, ""])}
      >
        + {addLabel}
      </button>
    </div>
  );
}
