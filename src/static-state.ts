import type { BState } from "./types";

export type PersistedState = BState & {
  schemaVersion: string;
};

export const schemaVersion = "b-web-static-v1";

export const initialState: PersistedState = {
  schemaVersion,
  companyLabel: "East Region Operations Center",
  dashboard: {
    headerHint: "Track active tasks, candidate flow, settlement risk, and weekly priorities.",
    stats: [
      { label: "Active tasks", value: "42" },
      { label: "Ready candidates", value: "26" },
      { label: "Weekly payout", value: "68,400" }
    ],
    weeklyFunnel: [
      "JD import 128 -> AI completion 94 -> interview 61 -> confirmed 23",
      "Manual review still required for 7 event support candidates"
    ],
    todayTodos: [
      "Review 9 abnormal shifts",
      "Confirm 11 low-confidence JD fields",
      "Follow up with 6 high-match candidates"
    ],
    batchProgress: [
      "Campus support batch: posted 36 / confirmed 18 / waiting settlement 12",
      "Retail promo batch: posted 52 / confirmed 27 / waiting settlement 21",
      "Weekend store batch: posted 19 / confirmed 8 / abnormal 3"
    ]
  },
  publish: {
    locationLabel: "East Region Operations Center",
    stats: [
      { label: "Pending JD fill", value: "34" },
      { label: "Pending review", value: "11" },
      { label: "Published today", value: "257" }
    ],
    tags: ["Region: all stores", "Task type: event / promo", "Status: pending publish"],
    items: [
      {
        id: "pub-1",
        title: "Store A weekend promo / 160 per day / missing health certificate notes",
        hint: "Needs AI completion",
        tone: "accent"
      },
      {
        id: "pub-2",
        title: "Store B full-day promo / 260 per day / staffing count incomplete",
        hint: "Needs AI completion",
        tone: "plain"
      },
      {
        id: "pub-3",
        title: "Campus event support / 2 days / 300 total / content complete",
        hint: "Pending manual review",
        tone: "plain"
      },
      {
        id: "pub-4",
        title: "Store C evening shift / 160 per day / 2 low-confidence fields",
        hint: "Pending manual review",
        tone: "plain"
      }
    ],
    warning: "Run AI completion first, then keep low-confidence fields for manual confirmation before batch publish.",
    footer: "128 tasks pending publish, 34 still require AI completion."
  },
  candidates: {
    workspaceHint: "Filter candidates by fit score, round status, and document completeness.",
    stats: [
      { label: "Pending screening", value: "18" },
      { label: "Ready for interview", value: "7" }
    ],
    tags: ["Status: pending invite / interview", "Docs: health certificate / service card"],
    items: [
      {
        id: "candidate-1",
        title: "Li Chen / match 91% / profile complete / waiting AI interview",
        score: 91,
        note: "Top priority for this weekend batch",
        summary: "7 candidates are ready for invitation. Prioritize weekend demand first."
      },
      {
        id: "candidate-2",
        title: "Wang Qiang / match 88% / round 1 passed / waiting employer feedback",
        score: 88,
        note: "Suitable for the next interview round",
        summary: "Stable schedule match. Can move into the second round."
      },
      {
        id: "candidate-3",
        title: "Zhang Min / match 84% / certificate uploaded / ready to invite",
        score: 84,
        note: "Can be invited directly",
        summary: "Candidate can be contacted directly to confirm start time."
      }
    ],
    footer: "One-click invite / continue pipeline"
  },
  settlements: {
    workspaceHint: "Unified workspace for acceptance and payout verification.",
    stats: [
      { label: "Pending settlement", value: "86" },
      { label: "Abnormal pending review", value: "9" },
      { label: "Expected payout", value: "42,600" }
    ],
    tags: ["Batch: this week", "Status: pending confirm / abnormal", "Method: main payroll"],
    items: [
      {
        id: "set-1",
        title: "Wang Qiang / event support / 8h / 160 / normal / waiting batch settlement",
        note: "Normal",
        tone: "accent"
      },
      {
        id: "set-2",
        title: "Li Chen / retail promo / 6h / 140 / abnormal hours / manual review needed",
        note: "Abnormal",
        tone: "plain"
      },
      {
        id: "set-3",
        title: "Zhang Min / campus event reception / 7h / 155 / normal / waiting verification",
        note: "Normal",
        tone: "plain"
      }
    ],
    riskHint: "Aggregate sign-in, hours, and payout first. Normal items can be settled in batch, abnormal ones go to manual review.",
    footer: "77 tasks can be settled immediately, 9 still require manual review."
  },
  issues: {
    workspaceHint: "Central workspace for abnormal work orders.",
    stats: [
      { label: "Pending issues", value: "9" },
      { label: "Amount disputes", value: "3" }
    ],
    tags: ["Type: hours / missing clock / amount", "Status: pending confirm / returned"],
    items: [
      {
        id: "issue-1",
        title: "Li Chen / retail promo / worked 6h but system recognized 4h",
        note: "Review sign-in record and chat history first",
        resolved: false
      },
      {
        id: "issue-2",
        title: "Wang Qiang / event support / extra contract dispute 20",
        note: "Needs sync back to the main system",
        resolved: false
      }
    ],
    handleHint: "System-detected exceptions go through manual review before being synced back to the main system.",
    footer: "9 issues pending handling. Clear contract disputes and missing clock records first."
  }
};
