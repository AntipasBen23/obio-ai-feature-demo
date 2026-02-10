export type DemoPerson = {
  id: string;
  name: string;
  kind: "candidate" | "employee";
  role: string;
  team: string;
};

export type DemoEvent = {
  id: string;
  ts: string; // ISO
  personId: string;
  source: "ATS" | "Email" | "WhatsApp" | "Slack" | "HRIS" | "Survey";
  lane: "hiring" | "onboarding" | "retention" | "trust";
  type:
    | "INTERVIEW_COMPLETED"
    | "NO_SHOW"
    | "OFFER_SENT"
    | "OFFER_ACCEPTED"
    | "CHECKIN_MISSED"
    | "SENTIMENT_DROP"
    | "MANAGER_FEEDBACK_GAP"
    | "ACCESS_LOG"
    | "DATA_RETENTION_UPDATED";
  title: string;
  detail?: string;
  severity: "low" | "med" | "high";
  duplicate?: boolean;
  outOfOrder?: boolean;
};

export type Signal = {
  risk: number; // 0-100
  confidence: number; // 0-1
  label: "low" | "medium" | "high";
  drivers: Array<{ label: string; weight: "low" | "med" | "high" }>;
  explanation: string;
  updatedAt: string;
};

export type Recommendation = {
  id: string;
  title: string;
  why: string;
  expectedImpact: string; // "72 → 45"
  priority: "P1" | "P2" | "P3";
};

export type Workflow = {
  id: string;
  name: string;
  state: string;
  next: string;
  retry?: string;
};

export type DemoState = {
  people: DemoPerson[];
  events: DemoEvent[];
  signalsByPersonId: Record<string, Signal>;
  recommendationsByPersonId: Record<string, Recommendation[]>;
  workflowsByPersonId: Record<string, Workflow[]>;
  stats: {
    activeWorkflows: number;
    atRisk: number;
    events24h: number;
  };
};

const isoAgo = (minsAgo: number) =>
  new Date(Date.now() - minsAgo * 60_000).toISOString();

const labelFromRisk = (risk: number): Signal["label"] =>
  risk >= 75 ? "high" : risk >= 55 ? "medium" : "low";

export function seedDemoState(): DemoState {
  const people: DemoPerson[] = [
    {
      id: "p1",
      name: "Marcus Adeyemi",
      kind: "employee",
      role: "Warehouse Ops Lead",
      team: "Frontline Ops",
    },
    {
      id: "p2",
      name: "Ana Ribeiro",
      kind: "employee",
      role: "Team Supervisor",
      team: "Customer Support",
    },
    {
      id: "p3",
      name: "Diego Santos",
      kind: "candidate",
      role: "Shift Manager",
      team: "Retail Ops",
    },
  ];

  const events: DemoEvent[] = [
    {
      id: "e1",
      ts: isoAgo(18),
      personId: "p1",
      source: "Slack",
      lane: "retention",
      type: "SENTIMENT_DROP",
      title: "Engagement signal dipped",
      detail:
        "Response rate fell across 3 check-ins; language shifted from proactive → minimal.",
      severity: "high",
    },
    {
      id: "e2",
      ts: isoAgo(55),
      personId: "p1",
      source: "Survey",
      lane: "retention",
      type: "MANAGER_FEEDBACK_GAP",
      title: "Manager feedback missing (2 weeks)",
      detail:
        "No documented 1:1 notes; peer feedback indicates workload creep.",
      severity: "med",
    },
    {
      id: "e3",
      ts: isoAgo(75),
      personId: "p2",
      source: "HRIS",
      lane: "onboarding",
      type: "CHECKIN_MISSED",
      title: "60-day check-in missed",
      detail: "Scheduled check-in not completed; auto-reschedule pending.",
      severity: "med",
      outOfOrder: true,
    },
    {
      id: "e4",
      ts: isoAgo(64),
      personId: "p2",
      source: "Email",
      lane: "onboarding",
      type: "CHECKIN_MISSED",
      title: "60-day check-in missed",
      detail:
        "Duplicate signal from email reminder workflow (safe to dedupe).",
      severity: "low",
      duplicate: true,
    },
    {
      id: "e5",
      ts: isoAgo(120),
      personId: "p3",
      source: "ATS",
      lane: "hiring",
      type: "INTERVIEW_COMPLETED",
      title: "Interview completed",
      detail: "Structured interview finished; scoring pending.",
      severity: "low",
    },
    {
      id: "e6",
      ts: isoAgo(165),
      personId: "p3",
      source: "WhatsApp",
      lane: "hiring",
      type: "NO_SHOW",
      title: "Candidate no-show flagged",
      detail: "Candidate missed scheduled slot; outreach retry created.",
      severity: "high",
    },
    {
      id: "e7",
      ts: isoAgo(240),
      personId: "p3",
      source: "Email",
      lane: "hiring",
      type: "OFFER_SENT",
      title: "Offer sent",
      detail: "Offer delivered; awaiting acceptance.",
      severity: "med",
    },
    {
      id: "e8",
      ts: isoAgo(15),
      personId: "p1",
      source: "HRIS",
      lane: "trust",
      type: "ACCESS_LOG",
      title: "Record accessed",
      detail: "Role=HRBP viewed employee profile.",
      severity: "low",
    },
    {
      id: "e9",
      ts: isoAgo(10),
      personId: "p1",
      source: "HRIS",
      lane: "trust",
      type: "DATA_RETENTION_UPDATED",
      title: "Retention policy updated",
      detail: "PII retention set to 180 days for chat transcripts.",
      severity: "low",
    },
  ];

  const signalsByPersonId: Record<string, Signal> = {
    p1: {
      risk: 78,
      confidence: 0.72,
      label: labelFromRisk(78),
      drivers: [
        { label: "Missed/short responses", weight: "high" },
        { label: "Manager feedback gap", weight: "med" },
        { label: "Workload drift", weight: "med" },
        { label: "Schedule friction", weight: "low" },
      ],
      explanation:
        "Signals suggest disengagement building over the last 14 days. Intervene with manager 1:1 + workload reset to reduce near-term attrition risk.",
      updatedAt: isoAgo(12),
    },
    p2: {
      risk: 58,
      confidence: 0.64,
      label: labelFromRisk(58),
      drivers: [
        { label: "Check-in missed", weight: "med" },
        { label: "Ramp pacing variance", weight: "med" },
        { label: "Low training completion", weight: "low" },
      ],
      explanation:
        "Onboarding signals indicate uneven ramp. A structured check-in + targeted training can stabilize performance and reduce drift.",
      updatedAt: isoAgo(40),
    },
    p3: {
      risk: 66,
      confidence: 0.6,
      label: labelFromRisk(66),
      drivers: [
        { label: "No-show pattern", weight: "high" },
        { label: "Slow response latency", weight: "med" },
        { label: "Offer aging", weight: "low" },
      ],
      explanation:
        "Hiring workflow shows reliability risk. Apply a tighter reschedule window and confirm availability before proceeding.",
      updatedAt: isoAgo(70),
    },
  };

  const recommendationsByPersonId: Record<string, Recommendation[]> = {
    p1: [
      {
        id: "r1",
        title: "Schedule manager 1:1 within 48 hours",
        why: "Closes the feedback gap and surfaces blockers early.",
        expectedImpact: "78 → 55",
        priority: "P1",
      },
      {
        id: "r2",
        title: "Do a workload reset + shift preference check",
        why: "High-performing frontline leads often churn from silent overload.",
        expectedImpact: "78 → 60",
        priority: "P2",
      },
    ],
    p2: [
      {
        id: "r3",
        title: "Auto-reschedule check-in + send a guided agenda",
        why: "Missed check-ins correlate with uneven ramp and confidence drop.",
        expectedImpact: "58 → 45",
        priority: "P2",
      },
    ],
    p3: [
      {
        id: "r4",
        title: "Send a 2-step confirmation message (availability + intent)",
        why: "Reduces no-shows and filters low-intent candidates fast.",
        expectedImpact: "66 → 50",
        priority: "P1",
      },
      {
        id: "r5",
        title: "Create a 24-hour offer expiry + quick call fallback",
        why: "Prevents offer aging and forces a decisive next step.",
        expectedImpact: "66 → 52",
        priority: "P2",
      },
    ],
  };

  const workflowsByPersonId: Record<string, Workflow[]> = {
    p1: [
      {
        id: "w1",
        name: "Retention Early-Warning",
        state: "Escalated",
        next: "Manager 1:1 scheduled",
        retry: "in 6h",
      },
    ],
    p2: [
      {
        id: "w2",
        name: "Onboarding 30/60/90",
        state: "Awaiting 60-day check-in",
        next: "Reschedule + agenda send",
      },
    ],
    p3: [
      {
        id: "w3",
        name: "Hiring Pipeline",
        state: "Interview done, reliability check",
        next: "Availability confirmation",
        retry: "in 2h",
      },
    ],
  };

  const activeWorkflows = Object.values(workflowsByPersonId).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  const atRisk = Object.values(signalsByPersonId).filter(
    (s) => s.risk >= 65 && s.confidence >= 0.6
  ).length;

  const now = Date.now();
  const events24h = events.filter(
    (e) => now - new Date(e.ts).getTime() <= 24 * 60 * 60 * 1000
  ).length;

  return {
    people,
    events,
    signalsByPersonId,
    recommendationsByPersonId,
    workflowsByPersonId,
    stats: { activeWorkflows, atRisk, events24h },
  };
}
