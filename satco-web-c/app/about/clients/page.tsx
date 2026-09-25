import type { Metadata } from "next";
import { clients, clientsPage } from "@/content/clients";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { ClientDirectory } from "@/components/about/ClientDirectory";

export const metadata: Metadata = {
  title: "Clients",
  description: clientsPage.subline,
};

/*
 * Clients page — 4A redesign (approved handoff, 2026-08-02): dark hero with
 * derived proof stats, hairline logo grid, filterable alphabetical directory.
 *
 * LOCKED content rules kept (docx comment #31): "Selected Clients" label
 * exactly (rendered as the section eyebrow); hard max 30 logos; grid 6/3/2
 * (the 4A prototype's 7-up is switched to 6-up so 18 marks divide evenly —
 * the handoff explicitly allows changing columns to avoid a ragged row);
 * UNLINKED; no animation beyond a subtle fade-in; searchable text directory;
 * verbatim disclaimer.
 *
 * OVERRIDE (user direction, 2026-08-02): logos render in FULL COLOR,
 * deviating from the docx-#31 grayscale lock — flag for client
 * re-confirmation. Revert = add `grayscale` to the tile div below.
 *
 * OVERRIDE (user direction, 2026-08-02): the verbatim legal disclaimer is
 * NOT rendered, deviating from docx #31 ("then the verbatim disclaimer") —
 * the copy stays in clientsPage.disclaimer; flag for client re-confirmation
 * (it is the identification-only shield for the third-party logos shown
 * above). Restore = re-render it after <ClientDirectory /> below.
 *
 * ⚠ SAMPLE DATA — PENDING CLIENT APPROVAL: the client has not supplied the
 * approved list. Selected-tier entries are real Saudi organizations chosen
 * from the placeholder directory + entities named in the approved sector
 * copy, logos sourced from Wikimedia Commons (per user direction). Directory
 * sector tags are the 4A prototype's placeholder mapping. The client must
 * approve list, mapping, and logo usage before launch.
 *
 * AA note: the 4A palette's small-text grays (#9a9384, #b3ab99) fail 4.5:1
 * on the canvas; captions/tags/count/disclaimer use the palette's darker
 * "Muted" #6b665c instead.
 */

const selected = clients.filter((c) => c.tier === "selected");
const directory = clients.filter((c) => c.tier === "directory");
const sectorCount = new Set(directory.map((c) => c.sectorTag).filter(Boolean)).size;

/*
 * Monogram fallback for entries without a logo file: initials of the first
 * two significant words ("Ministry of Transport" → MT). Selected-tier entries
 * normally carry `logo` (public-root path in src, e.g. "/logos/x.png" —
 * plain <img>, not the Picture/variants pipeline).
 */
const MINOR_WORDS = new Set(["of", "the", "for", "and", "&"]);
function monogram(name: string): string {
  const words = name.split(/\s+/).filter((w) => !MINOR_WORDS.has(w.toLowerCase()));
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

if (selected.length > 30) {
  throw new Error("Clients page: hard max of 30 selected logos exceeded (docx comment #31)");
}

export default function ClientsPage() {
  return (
    <div className="bg-[#fdfcfa]">
      {/* 1 — Dark hero: breadcrumb, title + subline, derived proof stats */}
      <div className="on-dark bg-[#191712]">
        <Container className="pb-[clamp(3rem,5.5vw,5rem)] pt-[clamp(2.25rem,4.5vw,3.5rem)]">
          <Breadcrumbs
            onDark
            className="mb-9"
            items={[
              { label: "Home", href: "/" },
              { label: "About us", href: "/about" },
              { label: clientsPage.title },
            ]}
          />
          <div className="grid items-end gap-x-20 gap-y-9 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h1
                id="clients-h"
                className="mb-[22px] mt-0 font-expanded text-[clamp(2.5rem,4.2vw,3.75rem)] font-semibold leading-[1.05] text-[#f5f1e8]"
              >
                {clientsPage.title}
              </h1>
              <p className="m-0 max-w-[560px] text-[17px] leading-[1.65] text-[#a49c8d]">
                {clientsPage.subline}
              </p>
            </div>
            {/* Derived counts — never stored, so they can't drift (4A handoff) */}
            <div className="flex gap-12 pb-1.5">
              {[
                { value: directory.length, label: clientsPage.statClientsLabel },
                { value: sectorCount, label: clientsPage.statSectorsLabel },
              ].map((stat) =>
                stat.label ? (
                  <div key={stat.label}>
                    <div className="font-expanded text-[clamp(3.25rem,5vw,4.375rem)] font-bold leading-none text-[#c9a24b] tabular-nums">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-[12px] uppercase tracking-[0.1em] text-[#8c8578]">
                      {stat.label}
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* 2 — Selected clients: hairline logo grid (1px gaps over the rule tint) */}
      <Container className="pt-[clamp(3.5rem,6vw,5.5rem)]">
        <section aria-labelledby="sel-clients-h">
          <Reveal>
            <p className="mb-3.5 mt-0 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1f]">
              {clientsPage.selectedHeading}
            </p>
            <h2
              id="sel-clients-h"
              className="mb-11 mt-0 font-expanded text-[clamp(1.5rem,2.4vw,2.125rem)] font-semibold leading-[1.15] text-[#1c1a16]"
            >
              {clientsPage.selectedTitle ?? clientsPage.selectedSub}
            </h2>
          </Reveal>
          <ul className="m-0 grid list-none grid-cols-2 gap-px border border-[#e6e1d6] bg-[#e6e1d6] p-0 md:grid-cols-3 lg:grid-cols-6">
            {selected.map((client, i) => (
              <li key={client.id} aria-label={`${client.name} logo`}>
                {/* fadeOnly — locked: "no animation beyond a subtle fade-in" */}
                <Reveal fadeOnly delay={(i % 6) * 40} className="h-full">
                  <div className="flex aspect-[3/2] h-full flex-col items-center justify-center gap-3 bg-[#fdfcfa] p-5 text-center transition-colors duration-[250ms] hover:bg-[#f4f0e7]">
                    <div className="flex h-11 w-24 items-center justify-center">
                      {client.logo ? (
                        /* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized logo asset */
                        <img
                          src={client.logo.src}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[#ddd7ca] font-display text-[15px] font-bold tracking-[0.04em] text-[#6b665c]"
                        >
                          {monogram(client.name)}
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] leading-[1.35] tracking-[0.04em] text-[#6b665c]">
                      {client.name}
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      {/* 3 — Full client list (disclaimer withheld per override note above) */}
      <Container className="pb-[clamp(3.5rem,6vw,6rem)] pt-[clamp(3.5rem,6vw,5.5rem)]">
        <div className="border-t border-[#e0dbd0] pt-14">
          <ClientDirectory
            clients={directory.map((c) => ({ name: c.name, sectorTag: c.sectorTag }))}
          />
        </div>
      </Container>
    </div>
  );
}
