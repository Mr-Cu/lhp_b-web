import type { BState } from "./types";

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init
  });

  if (!response.ok) {
    throw new Error(`B API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getBootstrap() {
  return request<BState>("/api/bootstrap");
}

export function fillPublishQueue() {
  return request<BState>("/api/publish/fill", { method: "POST" });
}

export function publishBatch() {
  return request<BState>("/api/publish/publish", { method: "POST" });
}

export function startCandidateInterview(candidateId: string) {
  return request<BState>(`/api/candidates/${candidateId}/interview`, { method: "POST" });
}

export function inviteCandidate(candidateId: string) {
  return request<BState>(`/api/candidates/${candidateId}/invite`, { method: "POST" });
}

export function processSettlements() {
  return request<BState>("/api/settlements/process", { method: "POST" });
}

export function resolveIssue(issueId: string) {
  return request<BState>(`/api/issues/${issueId}/resolve`, { method: "POST" });
}
