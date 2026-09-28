/** SATCO brand mark, matching the traced emblem used by the public site. */
export function Emblem({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="32 116 74 74"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="var(--color-bronze-300)"
        d="M103 160 C90 159 82 162 74 169 C68 175 64 179 60 180 L48 180
           C34.4 169.7 31.2 151 39.8 136.4 C48.3 121.7 66.2 115.3 82.1 121.2
           C98.1 127.1 107.5 143.5 104.4 160.3 Z"
      />
      <path
        fill="var(--color-stone-400)"
        d="M102 168 C98 177.4 90 184.5 80.2 187.5 C72 187 64 187 60 187
           C70 181 80 175 88 168 C94 168 99 168 102 168 Z"
      />
    </svg>
  );
}
