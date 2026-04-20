import initialStateData from "../local-data/b-state.json";
import type { BState } from "./types";

type PersistedState = BState & {
  schemaVersion: string;
};

const schemaVersion = "b-web-standalone-v1";
const storageKey = `b-web-state:${schemaVersion}`;
const fallbackState = initialStateData as PersistedState;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function stripSchema(state: PersistedState): BState {
  const { schemaVersion: _ignored, ...nextState } = state;
  return nextState;
}

function readStoredState(): PersistedState {
  if (typeof window === "undefined") {
    return clone(fallbackState);
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed?.schemaVersion === schemaVersion) {
        return parsed;
      }
    }
  } catch {}

  const nextState = clone(fallbackState);
  window.localStorage.setItem(storageKey, JSON.stringify(nextState));
  return nextState;
}

function writeStoredState(state: PersistedState): BState {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }

  return stripSchema(clone(state));
}

function mutateState(mutator: (state: PersistedState) => void): Promise<BState> {
  const nextState = readStoredState();
  mutator(nextState);
  nextState.schemaVersion = schemaVersion;
  return Promise.resolve(writeStoredState(nextState));
}

export function getBootstrap() {
  return Promise.resolve(stripSchema(readStoredState()));
}

export function fillPublishQueue() {
  return mutateState((state) => {
    state.publish.stats[0].value = "18";
    state.publish.stats[1].value = "22";
    state.publish.items = state.publish.items.map((item, index) => ({
      ...item,
      hint: index < 2 ? "AI completed" : item.hint,
      tone: index === 0 ? "accent" : "plain"
    }));
    state.publish.warning = "Low-confidence fields were flagged for manual review before publish.";
    state.publish.footer = "128 pending tasks, 18 still require confirmation.";
  });
}

export function publishBatch() {
  return mutateState((state) => {
    state.publish.stats[0].value = "6";
    state.publish.stats[1].value = "9";
    state.publish.stats[2].value = "385";
    state.publish.footer = "The current batch of 128 tasks has been published.";
  });
}

export function startCandidateInterview(candidateId: string) {
  return mutateState((state) => {
    state.candidates.items = state.candidates.items.map((item) =>
      item.id === candidateId
        ? {
            ...item,
            title: `${item.title} / Interview started`,
            note: "AI interview started"
          }
        : item
    );
    state.candidates.footer = "Invites sent, interviews are in progress.";
  });
}

export function inviteCandidate(candidateId: string) {
  return mutateState((state) => {
    state.candidates.items = state.candidates.items.map((item) =>
      item.id === candidateId
        ? {
            ...item,
            note: "Invitation sent",
            summary: "Invitation sent and waiting for candidate confirmation."
          }
        : item
    );
  });
}

export function processSettlements() {
  return mutateState((state) => {
    state.settlements.stats[0].value = "77";
    state.settlements.stats[1].value = "9";
    state.settlements.stats[2].value = "42,600";
    state.settlements.items = state.settlements.items.map((item, index) =>
      index === 0
        ? {
            ...item,
            title: `${item.title} / Processed`,
            note: "Processed",
            tone: "accent"
          }
        : item
    );
    state.settlements.footer = "77 tasks can be settled now, 9 still require review.";
  });
}

export function resolveIssue(issueId: string) {
  return mutateState((state) => {
    state.issues.items = state.issues.items.map((item) =>
      item.id === issueId
        ? {
            ...item,
            resolved: true,
            note: "Processed and recorded locally"
          }
        : item
    );
    state.issues.stats[0].value = String(state.issues.items.filter((item) => !item.resolved).length);
    state.issues.footer = "Issues were updated locally and are ready for follow-up.";
  });
}
