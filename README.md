# 领活派 B 端企业后台前端

这是领活派第一版的 B 端独立前端项目。

当前项目特点：

- 独立 `package.json`
- 独立 `vite.config.ts`
- 独立 `tsconfig.json`
- 独立 `server/index.mjs`
- 独立 `scripts/dev.mjs`

## 技术栈

- React 18
- TypeScript
- Vite 5
- React Router 6

## 本地运行

安装依赖：

```bash
pnpm install
```

启动前端和本地 mock：

```bash
pnpm dev
```

仅启动前端：

```bash
pnpm run dev:app
```

仅启动 mock server：

```bash
pnpm run dev:mock
```

## 构建

```bash
pnpm build
```

## 路由

- `#/dashboard`
- `#/publish`
- `#/candidates`
- `#/settlements`
- `#/issues`

## API

当前项目只调用本项目自己的 mock server。

### 健康检查

- `GET /api/health`

### 页面数据与动作

- `GET /api/bootstrap`
- `POST /api/publish/fill`
- `POST /api/publish/publish`
- `POST /api/candidates/:id/interview`
- `POST /api/candidates/:id/invite`
- `POST /api/settlements/process`
- `POST /api/issues/:id/resolve`

## 目录说明

- [src](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src)：前端源码
- [server/index.mjs](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/server/index.mjs)：B 端独立 mock server
- [scripts/dev.mjs](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/scripts/dev.mjs)：本地启动脚本
- [package.json](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/package.json)：项目依赖与脚本

## 当前业务范围

当前 B 端主要覆盖：

- 企业总览
- 批量发布任务
- 候选人与面试
- 批量验收任务
- 异常工单

当前重点是企业批量处理流程，不再包含旧 demo 那种多段 Agent 工作台式流程页面。
