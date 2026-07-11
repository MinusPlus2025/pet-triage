# 毛孩急诊官 · Pet Triage

拍张照、描述症状，30 秒判断宠物要不要去医院。输出三级就医决策：绿色（在家观察）、黄色（48 小时内就诊）、红色（立即急诊）。

黑客松 Demo 版，前端直接调用 Google Gemini API，无后端。

## 三步启动

1. 安装依赖
   ```bash
   npm install
   ```
2. 配置 Key：复制 `.env.example` 为 `.env`，填入你的 Gemini API Key
   ```bash
   cp .env.example .env
   # 然后编辑 .env：VITE_GEMINI_API_KEY=你的key
   ```
3. 启动
   ```bash
   npm run dev
   ```
   浏览器打开终端里显示的地址即可。

## 技术栈

Vite + React（单页，无路由/状态库）· Tailwind CSS · Google Gemini `gemini-2.5-flash`。

> 注意：Demo 版 Key 直接暴露在前端，仅用于黑客松演示，请勿用于生产。
