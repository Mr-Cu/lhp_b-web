export interface Stat {
  label: string;
  value: string;
}

export interface DashboardState {
  headerHint: string;
  stats: Stat[];
  weeklyFunnel: string[];
  todayTodos: string[];
  batchProgress: string[];
}

export interface PublishItem {
  id: string;
  title: string;
  hint: string;
  tone: "accent" | "plain";
}

export interface PublishState {
  locationLabel: string;
  stats: Stat[];
  tags: string[];
  items: PublishItem[];
  warning: string;
  footer: string;
}

export interface CandidateItem {
  id: string;
  title: string;
  score: number;
  note: string;
  summary: string;
}

export interface CandidatesState {
  workspaceHint: string;
  stats: Stat[];
  tags: string[];
  items: CandidateItem[];
  footer: string;
}

export interface SettlementItem {
  id: string;
  title: string;
  note: string;
  tone: "accent" | "plain";
}

export interface SettlementsState {
  workspaceHint: string;
  stats: Stat[];
  tags: string[];
  items: SettlementItem[];
  riskHint: string;
  footer: string;
}

export interface IssueItem {
  id: string;
  title: string;
  note: string;
  resolved: boolean;
}

export interface IssuesState {
  workspaceHint: string;
  stats: Stat[];
  tags: string[];
  items: IssueItem[];
  handleHint: string;
  footer: string;
}

export interface BState {
  companyLabel: string;
  dashboard: DashboardState;
  publish: PublishState;
  candidates: CandidatesState;
  settlements: SettlementsState;
  issues: IssuesState;
}
