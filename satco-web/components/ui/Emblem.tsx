/*
 * SATCO emblem traced from Images/Logo.jpg. The bronze sun and grey land
 * retain their brand colours on every background. The separate SATCO wordmark
 * adapts to its background in the surrounding component.
 */
export function Emblem({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="32 116 74 74"
      fill="none"
      aria-hidden="true"
    >
      {/* bronze sun disc, with the wave carved out of its lower-right */}
      <path
        fill="var(--bronze-800)"
        d="M103 160 C90 159 82 162 74 169 C68 175 64 179 60 180 L48 180
           C34.4 169.7 31.2 151 39.8 136.4 C48.3 121.7 66.2 115.3 82.1 121.2
           C98.1 127.1 107.5 143.5 104.4 160.3 Z"
      />
      {/* taupe land crescent tucked into the wave along the lower-right rim */}
      <path
        fill="var(--stone-600)"
        d="M102 168 C98 177.4 90 184.5 80.2 187.5 C72 187 64 187 60 187
           C70 181 80 175 88 168 C94 168 99 168 102 168 Z"
      />
    </svg>
  );
}
