import type { LeadershipPageCopy } from "@satco/shared";

import type { LeadershipMember } from "@/lib/types";
import data from "./generated/leadership.json";

/** Published leadership copy and profiles from the generated CMS snapshot. */
export const leadershipPage = data.leadershipPage as unknown as LeadershipPageCopy;
export const leadership = data.leadership as unknown as LeadershipMember[];
