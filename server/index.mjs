import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, "..");
const runtimeDir = path.join(projectDir, "local-data");
const statePath = path.join(runtimeDir, "b-state.json");
const port = Number(process.env.MOCK_PORT || 4178);
const schemaVersion = "b-web-standalone-v1";

const defaultState = {
  schemaVersion,
  companyLabel: "华东大区运营中心",
  dashboard: {
    headerHint: "集中查看企业当前任务、候选人转化、验收风险和本周待办。",
    stats: [
      { label: "进行中任务", value: "42" },
      { label: "可确认候选人", value: "26" },
      { label: "本周预计发放", value: "¥68,400" }
    ],
    weeklyFunnel: [
      "JD 导入 128 -> AI 补全 94 -> 发起面试 61 -> 双向确认 23",
      "异常提醒：展会协助批次仍有 7 人待人工介入"
    ],
    todayTodos: ["复核 9 条异常工时", "确认 11 条低置信度 JD", "跟进 6 位高匹配候选人"],
    batchProgress: [
      "轻促会协助批次 · 已发布 36 / 已确认 18 / 待验收 12",
      "商超促销批次 · 已发布 52 / 已确认 27 / 待验收 21",
      "连锁门店周末班 · 已发布 19 / 已确认 8 / 异常 3"
    ]
  },
  publish: {
    locationLabel: "华东大区运营中心",
    stats: [
      { label: "待补全 JD", value: "34" },
      { label: "待人工确认", value: "11" },
      { label: "今日已发布", value: "257" }
    ],
    tags: ["区域：全部门店", "任务类型：活动 / 促销", "状态：待发布"],
    items: [
      {
        id: "pub-1",
        title: "A 店周六大促 160 元 · 缺健康证要求 · AI 建议补全签到时间和服装要求",
        hint: "待 AI 补全",
        tone: "accent"
      },
      {
        id: "pub-2",
        title: "B 店周日全天 260 元 · 缺人数上限 · AI 建议补全联系人和验收节点",
        hint: "待 AI 补全",
        tone: "plain"
      },
      {
        id: "pub-3",
        title: "招聘会协助 2 天 300 元 · 字段完整 · 待人工复核后批量发布",
        hint: "待人工确认",
        tone: "plain"
      },
      {
        id: "pub-4",
        title: "C 店晚班 160 元 · 低置信度字段 2 项 · 已进入人工确认队列",
        hint: "待人工确认",
        tone: "plain"
      }
    ],
    warning: "先用 AI 做结构化补全，低置信度字段保留人工确认，再统一批量发布。",
    footer: "128 条待发布，其中 34 条需 AI 补全后再发"
  },
  candidates: {
    workspaceHint: "按画像、轮次状态和证书完整度批量筛选候选人。",
    stats: [
      { label: "待筛选候选人", value: "18" },
      { label: "可发起面试", value: "7" }
    ],
    tags: ["状态：待邀约 / 待面试", "证书：健康证 / 服务证"],
    items: [
      {
        id: "candidate-1",
        title: "李晨 · 匹配度 91% · 已完成画像 · 待发起 AI 面试",
        score: 91,
        note: "优先推荐至周末批次",
        summary: "可批量邀约 7 人，建议优先处理本周六待补岗需求。"
      },
      {
        id: "candidate-2",
        title: "王强 · 匹配度 88% · 首轮通过 · 待企业留言",
        score: 88,
        note: "适合继续面试",
        summary: "门店排班稳定，可进入第二轮面试。"
      },
      {
        id: "candidate-3",
        title: "张敏 · 匹配度 84% · 已上传健康证 · 可直接邀约",
        score: 84,
        note: "可直接邀约",
        summary: "可与候选人直接留言确认到岗时间。"
      }
    ],
    footer: "一键邀约 / 继续推进"
  },
  settlements: {
    workspaceHint: "任务验收与对账中心",
    stats: [
      { label: "待验收任务", value: "86" },
      { label: "异常待复核", value: "9" },
      { label: "预计发放总额", value: "¥42,600" }
    ],
    tags: ["批次：本周活动批次", "状态：待确认 / 异常", "结算方式：主系统发放"],
    items: [
      {
        id: "set-1",
        title: "王强 · 商场活动协助 · 8h · 160 元 · 正常 · 待批量验收",
        note: "正常",
        tone: "accent"
      },
      {
        id: "set-2",
        title: "李晨 · 导购促销 · 6h · 140 元 · 工时异常 · 需人工复核",
        note: "异常",
        tone: "plain"
      },
      {
        id: "set-3",
        title: "张敏 · 招聘会接待 · 7h · 155 元 · 正常 · 待推进验收",
        note: "正常",
        tone: "plain"
      }
    ],
    riskHint: "系统先聚合签退、工时和金额，正常单可一键验收，异常单转人工复核。",
    footer: "77 条可直接验收，9 条异常待人工复核"
  },
  issues: {
    workspaceHint: "异常工单处理中心",
    stats: [
      { label: "待处理异常", value: "9" },
      { label: "金额争议", value: "3" }
    ],
    tags: ["类型：工时 / 缺卡 / 金额", "状态：待确认 / 已回退"],
    items: [
      {
        id: "issue-1",
        title: "李晨 · 导购促销 · 工时 6h / 系统识别 4h · 待人工确认",
        note: "优先回看签到记录和聊天留痕",
        resolved: false
      },
      {
        id: "issue-2",
        title: "王强 · 活动协助 · 额外签约争议 20 元 · 待回推主系统",
        note: "需同步主系统",
        resolved: false
      }
    ],
    handleHint: "系统识别异常后先进入人工复核，确认结果再回推主系统或转人工仲裁。",
    footer: "9 条异常待处理，建议优先清理签约争议与缺卡记录"
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function readJsonFile(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJsonFile(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function readState() {
  await mkdir(runtimeDir, { recursive: true });

  try {
    const stored = await readJsonFile(statePath);
    if (stored?.schemaVersion === schemaVersion) {
      return stored;
    }
  } catch {}

  await writeJsonFile(statePath, defaultState);
  return clone(defaultState);
}

async function writeState(nextState) {
  await writeJsonFile(statePath, nextState);
  return nextState;
}

async function mutateState(mutator) {
  const current = await readState();
  const nextState = clone(current);
  await mutator(nextState);
  nextState.schemaVersion = schemaVersion;
  return writeState(nextState);
}

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    json(response, 400, { error: "Missing request url." });
    return;
  }

  const { pathname } = new URL(request.url, "http://127.0.0.1");

  if (request.method === "GET" && pathname === "/api/health") {
    json(response, 200, { ok: true, schemaVersion });
    return;
  }

  if (request.method === "GET" && pathname === "/api/bootstrap") {
    json(response, 200, await readState());
    return;
  }

  if (request.method === "POST" && pathname === "/api/publish/fill") {
    const nextState = await mutateState((state) => {
      state.publish.stats[0].value = "18";
      state.publish.stats[1].value = "22";
      state.publish.items = state.publish.items.map((item, index) => ({
        ...item,
        hint: index < 2 ? "待人工确认" : item.hint,
        tone: index === 0 ? "accent" : "plain"
      }));
      state.publish.warning = "低置信度字段已转人工复核，AI 补全完成项可继续进入批量发布。";
      state.publish.footer = "128 条待发布，其中 18 条仍需人工确认";
    });
    json(response, 200, nextState);
    return;
  }

  if (request.method === "POST" && pathname === "/api/publish/publish") {
    const nextState = await mutateState((state) => {
      state.publish.stats[0].value = "6";
      state.publish.stats[1].value = "9";
      state.publish.stats[2].value = "385";
      state.publish.footer = "本轮已批量发布 128 条";
    });
    json(response, 200, nextState);
    return;
  }

  if (request.method === "POST" && pathname.startsWith("/api/candidates/") && pathname.endsWith("/interview")) {
    const candidateId = pathname.split("/")[3];
    const nextState = await mutateState((state) => {
      state.candidates.items = state.candidates.items.map((item) =>
        item.id === candidateId
          ? {
              ...item,
              title: item.title
                .replace("待发起 AI 面试", "首轮面试进行中")
                .replace("可直接邀约", "已发起 AI 面试"),
              note: "已发起 AI 面试"
            }
          : item
      );
      state.candidates.footer = "一键邀约 / 持续推进";
    });
    json(response, 200, nextState);
    return;
  }

  if (request.method === "POST" && pathname.startsWith("/api/candidates/") && pathname.endsWith("/invite")) {
    const candidateId = pathname.split("/")[3];
    const nextState = await mutateState((state) => {
      state.candidates.items = state.candidates.items.map((item) =>
        item.id === candidateId
          ? {
              ...item,
              note: "已发送邀约",
              summary: "已向候选人发出邀约，可继续推进或等待确认。"
            }
          : item
      );
    });
    json(response, 200, nextState);
    return;
  }

  if (request.method === "POST" && pathname === "/api/settlements/process") {
    const nextState = await mutateState((state) => {
      state.settlements.stats[0].value = "77";
      state.settlements.stats[1].value = "9";
      state.settlements.stats[2].value = "¥42,600";
      state.settlements.items = state.settlements.items.map((item, index) =>
        index === 0
          ? {
              ...item,
              title: "王强 · 商场活动协助 · 8h · 160 元 · 已验收 · 待主系统发放",
              note: "已验收",
              tone: "accent"
            }
          : item
      );
      state.settlements.footer = "77 条可直接验收，9 条异常待人工复核";
    });
    json(response, 200, nextState);
    return;
  }

  if (request.method === "POST" && pathname.startsWith("/api/issues/") && pathname.endsWith("/resolve")) {
    const issueId = pathname.split("/")[3];
    const nextState = await mutateState((state) => {
      state.issues.items = state.issues.items.map((item) =>
        item.id === issueId ? { ...item, resolved: true, note: "已回退人工复核 / 已记录处理" } : item
      );
      state.issues.stats[0].value = String(state.issues.items.filter((item) => !item.resolved && item.id !== issueId).length);
      state.issues.footer = "异常已批量回退，建议优先清理签约争议和缺卡记录";
    });
    json(response, 200, nextState);
    return;
  }

  json(response, 404, { error: "Not found." });
});

server.listen(port, () => {
  console.log(`B web mock server running at http://127.0.0.1:${port}`);
});
