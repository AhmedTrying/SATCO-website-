import type { ContactPageCopy } from "@satco/shared";

import data from "./generated/contact.json";

/*
 * Contact page copy — sourced from the generated JSON. The inquiry-type selector
 * implements Sultan's routing proposal (comment #22), marked as a proposal in
 * the UI, pending sign-off.
 *
 * The original inline copy typed inquiryOptions[].value loosely as `string`;
 * we preserve that here so ContactForm (which stores the selection as a string)
 * is unchanged by the loader swap. The runtime values are identical.
 */
type ContactPage = Omit<ContactPageCopy, "inquiryOptions"> & {
  inquiryOptions: { value: string; label: string; routesTo: string }[];
};

export const contactPage = data as unknown as ContactPage;
