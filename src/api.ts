import { initialState, schemaVersion, type PersistedState } from "./static-state";
import type { BState } from "./types";

const storageKey = `b-web-state:${schemaVersion}`;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toViewState(state: PersistedState): BState {
  const { schemaVersion: _ignored, ...viewState } = state;
  return viewState;
}

function loadState(): PersistedState {
  if (typeof window === "undefined") {
    return clone(initialState);
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

  const nextState = clone(initialState);
  window.localStorage.setItem(storageKey, JSON.stringify(nextState));
  return nextState;
}

function saveState(state: PersistedState): BState {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }

  return toViewState(clone(state));
}

function mutateState(mutator: (state: PersistedState) => void): Promise<BState> {
  const nextState = loadState();
  mutator(nextState);
  nextState.schemaVersion = schemaVersion;
  return Promise.resolve(saveState(nextState));
}

export function getBootstrap() {
  return Promise.resolve(toViewState(loadState()));
}

export function fillPublishQueue() {
  return mutateState((state) => {
    state.publish.stats[0].value = "18";
    state.publish.stats[1].value = "22";
    state.publish.items = state.publish.items.map((item, index) => ({
      ...item,
      hint: index < 2 ? "Pending manual review" : item.hint,
      tone: index === 0 ? "accent" : "plain"
    }));
    state.publish.warning = "Low-confidence fields were flagged and sent to manual review before publish.";
    state.publish.footer = "128 tasks pending publish, 18 still require confirmation.";
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
            title: item.title.includes("/ interview started") ? item.title : `${item.title} / interview started`,
            note: "AI interview started"
          }
        : item
    );
    state.candidates.footer = "Invites sent and interviews are in progress.";
  });
}

export function inviteCandidate(candidateId: string) {
  return mutateState((state) => {
    state.candidates.items = state.candidates.items.map((item) =>
      item.id === candidateId
        ? {
            ...item,
            note: "Invitation sent",
            summary: "Invitation sent. Waiting for candidate confirmation."
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
            title: item.title.includes("/ processed") ? item.title : `${item.title} / processed`,
            note: "Processed",
            tone: "accent"
          }
        : item
    );
    state.settlements.footer = "77 tasks can be settled immediately, 9 still require manual review.";
  });
}

export function resolveIssue(issueId: string) {
  return mutateState((state) => {
    state.issues.items = state.issues.items.map((item) =>
      item.id === issueId
        ? {
            ...item,
            resolved: true,
            note: "Processed locally"
          }
        : item
    );
    state.issues.stats[0].value = String(state.issues.items.filter((item) => !item.resolved).length);
    state.issues.footer = "Issues were updated locally and are ready for follow-up.";
  });
}
