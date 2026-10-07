/** Verbatim biography paragraphs from Feedbacks/Leadership - Mr Bandar.docx.
 * OPT-05 example (Option B): the six published members keep their published
 * order, names and titles and use these bios as fallbacks. Option C renders the
 * whole document roster below (FIX-22). */
export const leadershipExampleBios: Record<string, readonly string[]> = {
  "malek-antabi": [
    "Malek Antabi is Chairman of SATCO and its founder, having established the company in 1975. Over five decades, he led SATCO as Chief Executive Officer and Chairman, building it into a leading platform across construction, industrial services, and airport infrastructure.",
    "Under his leadership, the company has delivered large-scale projects across the Kingdom, the Middle East, and Africa, supporting government programs, industrial ecosystems, and major developments. He also played a pivotal role in advancing private sector participation in the Kingdom, including the development of one of the first build–transfer–operate (BTO) airport models and early private placement investments in the telecommunications sector.",
    "Today, as Chairman, he continues to guide SATCO’s strategic direction, supporting the company’s alignment with Saudi Arabia’s Vision 2030 while overseeing its transition to the next generation of leadership.",
    "Mr. Antabi holds a Bachelor of Science in Operations Research and a Master of Business Administration from the University of California, Berkeley."
  ],
  "mohammed-maghlouth": [
    "Mohammed Al-Maghlouth is Chief Executive Officer of SATCO, bringing four decades of professional experience and a track record of leading complex, large-scale organizations across infrastructure, aviation, construction, and integrated facilities management.",
    "He joined SATCO in 2025 as President before assuming the role of Chief Executive Officer. Prior to SATCO, he served as Chief Executive Officer of MATARAT Holding Company and Riyadh Airports Company, and as Managing Director of Safari Group. Earlier in his career, he held senior leadership roles at Saudi Aramco.",
    "Mr. Al-Maghlouth holds a Bachelor of Science in Mechanical Engineering from King Fahd University of Petroleum & Minerals and has completed executive education programs at Georgetown University and Columbia University."
  ],
  "bandar-antabi": [
    "Bandar Antabi is a Partner and member of the Board of Directors of SATCO, where he leads the company’s investment activities and oversees its family office platform, with a focus on investments in technology and growth sectors.",
    "He also holds operating and leadership roles across technology-driven ventures in health tech and artificial intelligence, focused on scaling businesses across Europe, the Middle East, and Africa. Prior to his current roles, he held positions across venture capital, early-stage startups, and established technology companies in Silicon Valley, Europe, and the Middle East.",
    "He holds a Bachelor of Science in Telecommunications Engineering and a Master of Science in Management Science & Engineering from Stanford University."
  ],
  "tarek-antabi": [
    "Tarek Malek Antabi is Managing Partner at SATCO and a member of its Board of Directors. He leads the company’s Construction and Integrated Operations & Support Services divisions, overseeing operations and the development of real estate and infrastructure projects.",
    "With two decades of experience at SATCO, he headed the delivery of large-scale developments across the Kingdom, spanning construction, industrial services, and integrated operations. He combines strategic vision with operational execution to support complex, multi-disciplinary projects. Prior to joining SATCO, he worked at the Saudi Arabian General Investment Authority, now known as the Ministry of Investment.",
    "He holds a Bachelor of Science in Management Studies from Boston University."
  ],
  "tamer-antabi": [
    "Tamer Antabi is Managing Partner at SATCO and a member of its Board of Directors. He leads the company’s Airport Infrastructure & Operations Division and oversees commercial strategy and bid management across SATCO's business lines.",
    "In addition, he oversees SATCO’s PPP and development activities through SkyBridge, in partnership with its leadership team. Prior to joining SATCO, he held roles at Booz Allen Hamilton and J.P. Morgan, bringing experience across strategy consulting, capital markets, and aviation.",
    "He holds a Bachelor of Business Administration in Finance from the University of San Diego and a Master of Business Administration from INSEAD."
  ],
  "hesham-al-ghamdi": [
    "Hesham Alghamdi is Chief Executive Officer of SkyBridge, SATCO’s public–private partnerships (PPP) platform, bringing a track record of delivering project-financed infrastructure across the power, utilities, and broader PPP sectors.",
    "He was appointed Chief Executive Officer of SkyBridge in 2025. Prior to this, he served as President of Bawani Capital and as Chief Operating Officer and Managing Director of AlJomaih Energy and Water Company. Earlier in his career, he held senior leadership roles at ACWA Power Projects, including Executive Managing Officer of Rabigh Electricity Company and Chief Executive Officer of Hajr Electricity Production Company. He began his career with Schlumberger and Bechtel, and later held roles at Saudi Aramco.",
    "Mr. Alghamdi holds a Bachelor of Science in Mechanical Engineering from King Fahd University of Petroleum & Minerals."
  ],
  "walid-chiniara": [
    "Walid Chiniara is a member of the Board of Directors of SATCO and a qualified attorney with more than 45 years of international experience across leading law firms in the United States and Canada, a CAC 40 multinational in France, and a Big Four advisory firm.",
    "Over the past three decades, he has advised prominent enterprising families on governance, succession planning, and the preservation and transmission of wealth. An accredited mediator, he is widely recognized for his structured approach to complex family business transitions.",
    "Mr. Chiniara is a lecturer and published author. His book Dynastic Planning reflects more than thirty years of advisory work with families globally. In 2024, Family Capital ranked him among the leading family business advisors worldwide."
  ]
};

/** FIX-22: the full roster of Bandar's Leadership document, in document order,
 * with its names, titles and section headings verbatim. Ids match the
 * published leadership entries, so portraits added in the dashboard are reused. */
export const leadershipDocument = {
  groups: [
    { id: "chairman", heading: "Chairman", memberIds: ["malek-antabi"] },
    {
      id: "team",
      heading: "Leadership Team",
      memberIds: [
        "mohammed-maghlouth",
        "bandar-antabi",
        "tarek-antabi",
        "tamer-antabi",
        "hesham-al-ghamdi",
        "walid-chiniara",
      ],
    },
  ],
  members: {
    "malek-antabi": { name: "Malek Antabi", title: "Chairman" },
    "mohammed-maghlouth": { name: "Mohammed Abdullah Al-Maghlouth", title: "CEO" },
    "bandar-antabi": { name: "Bandar Antabi", title: "Partner · Vice Chairman · Board Member" },
    "tarek-antabi": {
      name: "Tarek Antabi",
      title: "Managing Partner, Construction & Integrated Operations · Board Member",
    },
    "tamer-antabi": { name: "Tamer Antabi", title: "Managing Partner, Airports & Bidding · Board Member" },
    "hesham-al-ghamdi": { name: "Hesham Alghamdi", title: "SkyBridge CEO" },
    "walid-chiniara": { name: "Walid S. Chiniara", title: "Board Member" },
  } as Record<string, { name: string; title: string }>,
} as const;

export const leadershipExampleCopy = {
  portraitPending: "Portrait to be supplied",
  portraitsPendingNote: "Portraits to be supplied.",
};
