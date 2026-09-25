import type { CareersPageCopy } from "@satco/shared";

import data from "./generated/careers.json";

/*
 * Careers page copy — sourced from the generated JSON. Tone rules (docx comment
 * #42, binding): no "family", no "rockstars", no exaggerated culture claims.
 */
export const careersPage = data as unknown as CareersPageCopy;
