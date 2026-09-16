import type { HomeContent } from "@satco/shared";

import data from "./generated/home.json";

type PublishedHomeContent = Omit<HomeContent, "statBand"> & {
  statBand: Omit<HomeContent["statBand"], "groups"> & {
    /** Older published Neon bundles predate the grouped proof-card design. */
    groups?: HomeContent["statBand"]["groups"];
  };
};

const published = data as PublishedHomeContent;
const defaultStatGroups: HomeContent["statBand"]["groups"] = {
  communities: "Communities",
  aviation: "Aviation",
};

/**
 * Home display copy sourced from generated JSON. The fallback keeps builds
 * compatible with published Neon bundles created before stat groups existed.
 */
export const home: HomeContent = {
  ...published,
  statBand: {
    ...published.statBand,
    groups: published.statBand.groups ?? defaultStatGroups,
  },
};
