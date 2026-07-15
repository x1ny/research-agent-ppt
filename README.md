# 公文写作 Agent · 技术探索 PPT

基于 React + Vite + Tailwind CSS 的内部技术分享演示稿（1920×1080 缩放舞台）。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 键盘操作

| 按键 | 行为 |
|------|------|
| → / ↓ / PageDown / Space | 下一页 |
| ← / ↑ / PageUp | 上一页 |
| Home | 第一页 |
| End | 最后一页 |

也可点击右侧圆点跳转。

## 技术栈

- Vite + React + TypeScript
- Tailwind CSS v4：全局令牌与底色在 `src/index.css`；幻灯片样式写在各 `Slide*.tsx` 内
- 共享 UI：`src/components/ui/`（SlideShell、Eyebrow、Chip 等）
