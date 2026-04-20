import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  fillPublishQueue,
  getBootstrap,
  inviteCandidate,
  processSettlements,
  publishBatch,
  resolveIssue,
  startCandidateInterview
} from "./api";
import type { BState } from "./types";

interface AppContextValue {
  state: BState | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  fillPublishQueue: () => Promise<void>;
  publishBatch: () => Promise<void>;
  startCandidateInterview: (candidateId: string) => Promise<void>;
  inviteCandidate: (candidateId: string) => Promise<void>;
  processSettlements: () => Promise<void>;
  resolveIssue: (issueId: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<BState | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getBootstrap()
      .then((nextState) => {
        if (mounted) {
          setState(nextState);
        }
      })
      .catch((nextError) => {
        if (mounted) {
          setError(nextError instanceof Error ? nextError.message : "加载失败");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function run(action: () => Promise<BState>) {
    setSubmitting(true);
    setError(null);
    try {
      setState(await action());
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "请求失败");
    } finally {
      setSubmitting(false);
    }
  }

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      loading,
      submitting,
      error,
      fillPublishQueue: async () => run(() => fillPublishQueue()),
      publishBatch: async () => run(() => publishBatch()),
      startCandidateInterview: async (candidateId) => run(() => startCandidateInterview(candidateId)),
      inviteCandidate: async (candidateId) => run(() => inviteCandidate(candidateId)),
      processSettlements: async () => run(() => processSettlements()),
      resolveIssue: async (issueId) => run(() => resolveIssue(issueId))
    }),
    [state, loading, submitting, error]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
