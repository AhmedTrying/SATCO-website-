import type { SiteContent } from "@/lib/types";

import data from "./generated/site.json";

/*
 * Site identity, contact and flags — sourced from the generated JSON the
 * dashboard publishes (kickoff §2.2). A committed snapshot ships in the repo, so
 * the site still builds if it is never republished. The cast is the trust point:
 * the JSON is validated on write by the dashboard against @satco/shared.
 */
export const site = data as unknown as SiteContent;
