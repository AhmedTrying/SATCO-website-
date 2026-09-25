import type { CompanyContent } from "@satco/shared";

import data from "./generated/company.json";

/** Company Information (verbatim docx copy) — sourced from the generated JSON. */
export const company = data as unknown as CompanyContent;
