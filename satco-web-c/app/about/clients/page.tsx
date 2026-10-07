import type { Metadata } from "next";
import { clients, clientsPage } from "@/content/clients";
import { ClientIndex, type IndexClient } from "@/components/about/ClientIndex";

export const metadata: Metadata = {
  title: "Clients",
  description: clientsPage.subline,
};

/*
 * Clients — Option C, FIX-15 ("A–Z index"), for comparison with B; A keeps
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
function oneList(): IndexClient[] {
  const seen = new Set<string>();
  const merged: IndexClient[] = [];
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
      <ClientIndex clients={list} />
    </div>
  );
}
