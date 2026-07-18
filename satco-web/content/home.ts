import type { HomeContent } from "@satco/shared";

import data from "./generated/home.json";

/** Home display copy — sourced from the generated JSON. */
export const home = data as unknown as HomeContent;
