# 扫雷 — Win7 复刻版

Windows 7 经典扫雷的 Web 复刻，使用 TypeScript + Vite 构建，零框架依赖。

## 在线体验

https://你的项目名.pages.dev

## 功能

- 🖱️ 经典交互：左键翻开、右键标旗、问号标记
- ⚡ Chord 翻开：左+右键同时按下快速翻开
- 📱 移动端适配：点按翻开、长按标旗、双击数字格触发 Chord
- 😊😎😵 笑脸三态 + 点击重置
- ⏱️ 计时器与地雷计数器
- 💣 失败显示地雷位置，错误标记打 ❌
- 📊 统计面板：胜率、最佳时间、连胜（localStorage 持久化）
- 🎛️ 三级预设难度 + 自定义难度
- 🎨 Aero 风格 3D 凸起格子

## 技术栈

| 维度 | 选择 |
|------|------|
| 语言 | TypeScript (strict) |
| 构建 | Vite |
| 样式 | CSS Modules |
| 测试 | Vitest |
| 运行时 | 零依赖，原生 DOM |

## 本地运行

```bash
npm install
npm run dev     # 开发模式，支持热更新
npm run build   # 生产构建 → dist/
npm test        # 运行测试
```

## 部署到 Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist
```

## 架构

```
src/
├── core/        # 纯逻辑：地雷、数字、flood、胜负
├── state/       # 状态机 + 游戏状态
├── ui/          # DOM 渲染 + 事件处理
├── storage/     # localStorage 统计
└── assets/      # CSS Modules
```

## 许可证

MIT
