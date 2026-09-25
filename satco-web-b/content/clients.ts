import type { ClientsPageCopy } from "@satco/shared";

import type { Client } from "@/lib/types";
import data from "./generated/clients.json";

/*
 * Clients — sourced from the generated JSON.
 * Locked page rules (docx comment #31): "Selected Clients" grayscale grid
 * (max 30, unlinked) + searchable A–Z directory + verbatim disclaimer.
 */
export const clientsPage = data.clientsPage as unknown as ClientsPageCopy;
export const clients = data.clients as unknown as Client[];
