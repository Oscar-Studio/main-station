# main-station

Oscar Studio 的主站（oscarstudio.cn），Vite + React 19 + TypeScript 单页应用。

## 开发

```bash
npm install
npm run dev          # 本地开发（http://localhost:5173）
npm run build        # 产出 dist/
npm run preview      # 本地预览构建产物
```

## 部署

main 分支是源码，部署走 `gh-pages` 分支（首次部署需要在仓库 Settings →
Pages 中把 Source 切换到 `gh-pages`，CNAME 由 `public/CNAME` 提供）。

```bash
npm run deploy       # 等价于：先 build，再把 dist/ 推到 gh-pages 分支
```

## 目录结构

```
main-station/
├── public/                      静态资源（CNAME、favicon、logo）
├── src/
│   ├── main.tsx                 React 入口
│   ├── App.tsx                  顶层布局
│   ├── components/              Navbar / Hero / ToolSection / Footer / BackToTop
│   ├── i18n/                    zh / en 翻译 + Context Provider
│   └── styles/global.css
├── index.html                   Vite 入口 HTML（挂载 #root 并直引 CDN 脚本）
├── vite.config.ts
└── package.json
```

## 关键依赖

- `react` / `react-dom` — UI
- `@samasante/liquid-glass` — 玻璃材质效果（替代旧版 WebGL 自实现）
- `gh-pages` — 把 `dist/` 推到 `gh-pages` 分支

## 外部脚本

`index.html` 保留两个 CDN 脚本直引（不在 React 树内）：

- `https://ai.oscarstudio.cn/opilot.js` + `opilot.css` — Opilot 面板（⌘K）
- `https://api.oscarstudio.cn/user-button.js` — 用户登录按钮；`App.tsx` 在挂载后动态注入（SDK 由 API 仓库 `public/` 静态托管）
