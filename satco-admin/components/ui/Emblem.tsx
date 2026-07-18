/* Compact SATCO emblem — sun over horizon (bronze), for the sidebar header. */
export function Emblem({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="14" r="7" fill="var(--color-bronze-400)" />
      <rect x="4" y="23" width="24" height="1.6" rx="0.8" fill="var(--color-stone-300)" />
      <rect x="7" y="26.5" width="18" height="1.4" rx="0.7" fill="var(--color-stone-400)" />
    </svg>
  );
}
