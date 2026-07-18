import type { CertificationsPageCopy } from "@satco/shared";

import type { Certification, Classification, License } from "@/lib/types";
import data from "./generated/certifications.json";

/* Classifications, Licenses & Certifications — sourced from the generated JSON. */
export const certificationsPage =
  data.certificationsPage as unknown as CertificationsPageCopy;
export const classifications = data.classifications as unknown as Classification[];
export const licenses = data.licenses as unknown as License[];
export const certifications = data.certifications as unknown as Certification[];
