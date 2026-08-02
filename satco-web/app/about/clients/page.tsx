import type { Metadata } from "next";
import { clients, clientsPage } from "@/content/clients";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ClientDirectory } from "@/components/about/ClientDirectory";

export const metadata: Metadata = {
  title: "Clients",
  description: clientsPage.subline,
};

/*
 * LOCKED page spec (docx comment #31): "Selected Clients" label exactly (never
 * "All Clients"); 18–24 logos, hard max 30; grid 6/3/2; grayscale; UNLINKED;
 * no animation beyond a subtle fade-in; then the searchable text directory;
 * then the verbatim disclaimer. Logos are placeholders — list not provided.
 */

const selected = clients.filter((c) => c.tier === "selected");
const directory = clients.filter((c) => c.tier === "directory").map((c) => c.name);

/*
 * Monogram for the placeholder tiles: initials of the first two significant
 * words ("Ministry of Transport" → MT). The client list is PLACEHOLDER data
 * (plan §12 Q3) — real trademarks are deliberately NOT used until the client
 * supplies the approved list and logo files; these tiles then swap 1:1 for
 * grayscale logo images.
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
    <>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About us", href: "/about" },
          { label: "Clients" },
        ]}
        title={clientsPage.title}
        headingId="clients-h"
        lead={clientsPage.subline}
      />
      <Container className="py-[clamp(3.5rem,7vw,6rem)]">
        <section aria-labelledby="sel-clients-h" className="mb-[clamp(3.5rem,6vw,5rem)]">
          <Reveal>
            <h2
              id="sel-clients-h"
              className="mb-1.5 mt-0 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-bold text-strong"
            >
              {clientsPage.selectedHeading}
            </h2>
            <p className="mb-7 mt-0 text-[14.5px] text-stone-600">{clientsPage.selectedSub}</p>
          </Reveal>
          <ul className="m-0 grid list-none grid-cols-2 gap-3.5 p-0 md:grid-cols-3 lg:grid-cols-6">
            {selected.map((client, i) => (
              <li key={client.id} aria-label={`${client.name} logo`}>
                {/* fadeOnly — locked: "no animation beyond a subtle fade-in" */}
                <Reveal fadeOnly delay={(i % 6) * 40}>
                  {/* Placeholder logo mark — swaps 1:1 for the grayscale logo
                      image when the approved files arrive. Locked: grayscale,
                      unlinked, fade-only. */}
                  <div className="flex h-[104px] flex-col items-center justify-center gap-1.5 rounded-md border border-border bg-surface p-3 text-center grayscale">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-stone-300 font-display text-[15px] font-bold tracking-[0.04em] text-stone-500"
                    >
                      {monogram(client.name)}
                    </span>
                    <span className="font-display text-[11.5px] font-semibold leading-[1.25] tracking-[0.02em] text-stone-500">
                      {client.name}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <ClientDirectory names={directory} />

        <p className="m-0 max-w-[80ch] border-t border-border pt-5 text-[12.5px] leading-[1.6] text-stone-500">
          {clientsPage.disclaimer}
        </p>
      </Container>
    </>
  );
}
