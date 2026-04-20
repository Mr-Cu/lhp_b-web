import { ReactNode, useState } from "react";
import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context";

function LoadingView() {
  return <div className="b-screen-center">加载中</div>;
}

function ErrorView({ message }: { message: string }) {
  return <div className="b-screen-center">{message}</div>;
}

function Page({
  title,
  subtitle,
  actions,
  children
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { state } = useApp();

  if (!state) {
    return null;
  }

  return (
    <main className="b-main">
      <div className="b-topline">{state.companyLabel}</div>
      <header className="b-page-head">
        <div className="b-title-group">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="b-actions">{actions}</div>
      </header>
      <div className="b-stack">{children}</div>
    </main>
  );
}

function Shell() {
  const items = [
    { to: "/dashboard", label: "企业总览" },
    { to: "/publish", label: "任务发布" },
    { to: "/candidates", label: "候选人与面试" },
    { to: "/settlements", label: "验收与结算" },
    { to: "/issues", label: "异常工单" }
  ];

  return (
    <div className="b-shell">
      <aside className="b-sidebar">
        <div className="b-brand">
          <span className="b-brand-mark" />
          <strong>领活派企业后台</strong>
        </div>
        <span className="b-sidebar-label">工作台</span>
        <nav className="b-nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => (isActive ? "b-nav-link is-active" : "b-nav-link")}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <Outlet />
    </div>
  );
}

function StatRow({ items }: { items: { label: string; value: string }[] }) {
  return (
    <section className="b-stat-row">
      {items.map((item) => (
        <article className="b-stat-card" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}

function TagRow({ items }: { items: string[] }) {
  return (
    <section className="b-tag-row">
      {items.map((item) => (
        <article className="b-tag-card" key={item}>
          {item}
        </article>
      ))}
    </section>
  );
}

function DashboardPage() {
  const { state } = useApp();

  if (!state) {
    return null;
  }

  return (
    <Page
      actions={
        <button className="b-button b-button--solid" type="button">
          导出周报
        </button>
      }
      subtitle={state.dashboard.headerHint}
      title="企业总览"
    >
      <StatRow items={state.dashboard.stats} />
      <section className="b-grid b-grid--two">
        <article className="b-panel">
          <strong>本周转化漏斗</strong>
          <div className="b-copy-list">
            {state.dashboard.weeklyFunnel.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>
        <article className="b-panel">
          <strong>今日待办</strong>
          <ol className="b-number-list">
            {state.dashboard.todayTodos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
      </section>
      <section className="b-panel">
        <strong>关键批次进度</strong>
        <div className="b-stack-list">
          {state.dashboard.batchProgress.map((item) => (
            <article className="b-list-item" key={item}>
              {item}
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}

function PublishPage() {
  const { fillPublishQueue, publishBatch, state, submitting } = useApp();

  if (!state) {
    return null;
  }

  return (
    <Page
      actions={
        <>
          <button className="b-button b-button--outline" type="button">
            下载模板
          </button>
          <button className="b-button b-button--outline" disabled={submitting} onClick={() => void fillPublishQueue()} type="button">
            AI 补全
          </button>
          <button className="b-button b-button--solid" disabled={submitting} onClick={() => void publishBatch()} type="button">
            批量发布
          </button>
        </>
      }
      subtitle="Excel / JD 导入后，先走 AI 补全与人工校验，再统一发布。"
      title="批量发布任务"
    >
      <StatRow items={state.publish.stats} />
      <TagRow items={state.publish.tags} />
      <section className="b-panel">
        <strong>待发布任务清单</strong>
        <div className="b-stack-list">
          {state.publish.items.map((item) => (
            <article className={item.tone === "accent" ? "b-list-item b-list-item--accent" : "b-list-item"} key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.hint}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="b-panel b-panel--soft">
        <strong>流程要点</strong>
        <p>{state.publish.warning}</p>
      </section>
      <div className="b-footer-bar">
        <span>{state.publish.footer}</span>
        <span>进入人工审核 / 批量发布</span>
      </div>
    </Page>
  );
}

function CandidatesPage() {
  const { inviteCandidate, startCandidateInterview, state, submitting } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!state) {
    return null;
  }

  const activeCandidate =
    state.candidates.items.find((item) => item.id === selectedId) ?? state.candidates.items[0];

  return (
    <Page
      actions={
        <>
          <button
            className="b-button b-button--outline"
            disabled={submitting}
            onClick={() => void inviteCandidate(activeCandidate.id)}
            type="button"
          >
            批量邀约
          </button>
          <button
            className="b-button b-button--solid"
            disabled={submitting}
            onClick={() => void startCandidateInterview(activeCandidate.id)}
            type="button"
          >
            发起 AI 面试
          </button>
        </>
      }
      subtitle="按匹配度、轮次状态和证书完整度筛选候选人，并批量发起邀约或标准化面试。"
      title="候选人与面试"
    >
      <StatRow items={state.candidates.stats} />
      <TagRow items={state.candidates.tags} />
      <section className="b-panel">
        <strong>候选人列表</strong>
        <div className="b-stack-list">
          {state.candidates.items.map((item) => (
            <button
              className={item.id === activeCandidate.id ? "b-candidate is-active" : "b-candidate"}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              type="button"
            >
              <div>
                <strong>{item.title}</strong>
                <p>{item.note}</p>
              </div>
              <span>{item.score}%</span>
            </button>
          ))}
        </div>
      </section>
      <div className="b-footer-bar">
        <span>{activeCandidate.summary}</span>
        <span>{state.candidates.footer}</span>
      </div>
    </Page>
  );
}

function SettlementsPage() {
  const { processSettlements, state, submitting } = useApp();

  if (!state) {
    return null;
  }

  return (
    <Page
      actions={
        <>
          <button className="b-button b-button--outline" type="button">
            导出对账单
          </button>
          <button className="b-button b-button--solid" disabled={submitting} onClick={() => void processSettlements()} type="button">
            批量验收
          </button>
        </>
      }
      subtitle="按门店、批次或活动统一验收工时、金额与异常单。"
      title="批量验收任务"
    >
      <StatRow items={state.settlements.stats} />
      <TagRow items={state.settlements.tags} />
      <section className="b-panel">
        <strong>待验收清单</strong>
        <div className="b-stack-list">
          {state.settlements.items.map((item) => (
            <article className={item.tone === "accent" ? "b-list-item b-list-item--accent" : "b-list-item"} key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.note}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="b-panel b-panel--soft">
        <strong>流程要点</strong>
        <p>{state.settlements.riskHint}</p>
      </section>
      <div className="b-footer-bar">
        <span>{state.settlements.footer}</span>
        <span>一键批量验收 / 导出异常单</span>
      </div>
    </Page>
  );
}

function IssuesPage() {
  const { resolveIssue, state, submitting } = useApp();

  if (!state) {
    return null;
  }

  return (
    <Page
      actions={
        <button className="b-button b-button--outline" type="button">
          导出异常单
        </button>
      }
      subtitle="统一处理工时异常、缺卡、金额争议，并回推主系统或人工复核。"
      title="异常工单"
    >
      <StatRow items={state.issues.stats} />
      <TagRow items={state.issues.tags} />
      <section className="b-panel">
        <strong>异常工单列表</strong>
        <div className="b-stack-list">
          {state.issues.items.map((item) => (
            <article className={item.resolved ? "b-list-item" : "b-list-item b-list-item--accent"} key={item.id}>
              <div className="b-list-head">
                <strong>{item.title}</strong>
                <button
                  className="b-text-button"
                  disabled={submitting}
                  onClick={() => void resolveIssue(item.id)}
                  type="button"
                >
                  {item.resolved ? "已处理" : "标记处理"}
                </button>
              </div>
              <span>{item.note}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="b-panel b-panel--soft">
        <strong>处理路径</strong>
        <p>{state.issues.handleHint}</p>
      </section>
      <div className="b-footer-bar">
        <span>{state.issues.footer}</span>
        <span>批量回退 / 指派复核</span>
      </div>
    </Page>
  );
}

function AppRoutes() {
  const { error, loading } = useApp();

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  return (
    <Routes>
      <Route element={<Shell />}>
        <Route element={<Navigate replace to="/dashboard" />} index />
        <Route element={<DashboardPage />} path="dashboard" />
        <Route element={<PublishPage />} path="publish" />
        <Route element={<CandidatesPage />} path="candidates" />
        <Route element={<SettlementsPage />} path="settlements" />
        <Route element={<IssuesPage />} path="issues" />
      </Route>
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
}

export function BApp() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
