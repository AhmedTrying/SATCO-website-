import type { LeadershipPageCopy } from "@satco/shared";

import type { LeadershipMember } from "@/lib/types";
import data from "./generated/leadership.json";

/* Key People & Leadership — sourced from the generated JSON (content TBD, plan §12 Q2). */
export const leadershipPage = data.leadershipPage as unknown as LeadershipPageCopy;
export const leadership = data.leadership as unknown as LeadershipMember[];
