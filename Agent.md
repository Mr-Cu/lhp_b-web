# B Web Agent.md

本文档只针对 [b-web](/C:/Users/79483/Documents/GitHub/casual_labor/b-web) 生效。

## 项目定位

这是领活派第一版 B 端企业后台前端。

它是一个完全独立的项目，不应再依赖根目录旧结构，也不应再与 C 端共享：

- 运行入口
- mock server
- 构建脚本
- API 层

## 真实入口

- [package.json](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/package.json)
- [src/main.tsx](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/main.tsx)
- [src/app.tsx](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/app.tsx)
- [src/context.tsx](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/context.tsx)
- [src/api.ts](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/api.ts)
- [src/styles.css](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/styles.css)
- [server/index.mjs](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/server/index.mjs)
- [scripts/dev.mjs](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/scripts/dev.mjs)

## 修改约束

1. 不要把 API 改回 `/api/b/*` 这种共享命名空间。
2. 不要重新依赖根目录的 `server/`、`scripts/` 或 `package.json`。
3. 页面里的动态数据必须通过 [src/api.ts](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/api.ts) 请求本项目 mock server。
4. 左侧导航是当前后台的统一骨架，补页面时要保持一致。

## 页面范围

当前项目包含：

- 企业总览
- 批量发布任务
- 候选人与面试
- 批量验收任务
- 异常工单

## 开发常见点

### 改页面时优先看

- [src/app.tsx](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/app.tsx)
- [src/styles.css](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/styles.css)

### 改状态与接口时优先看

- [src/context.tsx](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/context.tsx)
- [src/api.ts](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/src/api.ts)
- [server/index.mjs](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/server/index.mjs)

### 改构建或启动时优先看

- [package.json](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/package.json)
- [vite.config.ts](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/vite.config.ts)
- [scripts/dev.mjs](/C:/Users/79483/Documents/GitHub/casual_labor/b-web/scripts/dev.mjs)
