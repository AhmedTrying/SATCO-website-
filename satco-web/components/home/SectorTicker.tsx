import { sectors } from "@/content/sectors";

/*
 * Decorative marquee ribbon of the four sector names (UCC-reference upgrade) —
 * a lead-in to the Operating Sectors grid. Purely presentational: the names are
 * the verbatim content strings repeated, so the whole strip is aria-hidden and
 * unselectable. CSS-only motion (globals.css `.ticker-track`): pauses on hover,
 * reverses under [dir="rtl"], and the reduced-motion clamp leaves it static.
 *
 * Each name+diamond pair is one tile with symmetric padding (no flex gap), so
 * the two copies tile perfectly and the -50% loop is seamless.
 */
export function SectorTicker() {
  return (
    <div
      aria-hidden="true"
      className="ticker select-none overflow-hidden border-y border-border bg-surface py-[clamp(1.1rem,2vw,1.6rem)]"
    >
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {sectors.map((sector) => (
              <span
                key={sector.slug}
                className="flex items-center whitespace-nowrap font-display text-[clamp(1.25rem,2.4vw,1.9rem)] font-bold uppercase tracking-[0.06em] text-bronze-700"
              >
                {sector.name}
                <span className="mx-[clamp(1.5rem,3.5vw,3rem)] text-[0.55em] text-bronze-300">
                  ◆
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
