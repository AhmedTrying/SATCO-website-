import type { Metadata } from "next";
import { clients, clientsPage } from "@/content/clients";
import { Container } from "@/components/layout/Container";
import { ClientWall, type WallClient } from "@/components/about/ClientWall";

export const metadata: Metadata = {
  title: "Clients",
  description: clientsPage.subline,
};

/*
 * Clients — Option B, FIX-15 ("logo wall"), for comparison with C; A keeps
 * the 4A design (Selected Clients grid + filterable Full client list).
 *
 * FIX-15 (Tarek / Tamer, DEC-03 — replaces Bandar's Dec-2025 Clients spec, to
 * confirm): no sector filters, no sector labels, no "Sectors" count; the
 * Selected (logo) and Full (name) lists merge into ONE alphabetical list,
 * every client shown as logo + name. Entries without a logo file show a
 * monogram until one is supplied. Unlinked; searchable.
 *
 * The list is still the sample data the client has to replace (FIX-28); a
 * name in both tiers appears once, with its logo. The verbatim disclaimer
 * stays withheld, as on A (override noted in A's page).
 */
function oneList(): WallClient[] {
  const seen = new Set<string>();
  const merged: WallClient[] = [];
  // Selected first, so the record that carries the logo wins a duplicate name
  for (const c of [...clients.filter((x) => x.tier === "selected"), ...clients]) {
    const key = c.name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({ id: c.id, name: c.name, logo: c.logo });
  }
  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

const list = oneList();

export default function ClientsPage() {
  return (
    <div className="bg-[#fdfcfa]">
      <div className="border-b border-border bg-sand">
        <Container className="grid items-end gap-x-16 gap-y-8 pb-[clamp(2.5rem,5vw,3.5rem)] pt-[clamp(2.5rem,5vw,4rem)] md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <h1
              id="clients-h"
              className="m-0 font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.03em] text-strong"
            >
              {clientsPage.title}
            </h1>
            <p className="mb-0 mt-4 max-w-[60ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6] text-stone-700">
              {clientsPage.subline}
            </p>
          </div>
          {/* Derived count — never stored, so it can't drift */}
          <div className="md:text-end">
            <div className="font-display text-[clamp(3.25rem,6vw,5rem)] font-bold leading-none tracking-[-0.03em] text-bronze-700 tabular-nums">
              {list.length}
            </div>
            <div className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-stone-600">
              {clientsPage.statClientsLabel}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-[clamp(3rem,6vw,5rem)]">
        <ClientWall clients={list} />
      </Container>
    </div>
  );
}
