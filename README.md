# 毛孩急诊官 · Pet Triage

拍张照、描述症状，30 秒判断宠物要不要去医院。输出三级就医决策：**绿色（在家观察）/ 黄色（这两天带它去看看）/ 红色（现在就走）**。产品只回答一个问题：要不要去医院。

黑客松 Demo 版，前端直连模型 API，无后端。默认 DeepSeek，provider 可切换到通义 Qwen / Gemini。

## 三步启动

1. 安装依赖
   ```bash
   npm install
   ```
2. 配置 Key：复制 `.env.example` 为 `.env`，填入你的 DeepSeek API Key（`sk-` 开头，在 https://platform.deepseek.com/ 创建）
   ```bash
   cp .env.example .env
   # 然后编辑 .env：VITE_DEEPSEEK_API_KEY=你的key
   ```
3. 启动
   ```bash
   npm run dev
   ```
   浏览器打开终端里显示的地址即可。

## 技术栈

Vite + React（单页，无路由/状态库）· Tailwind CSS · DeepSeek `deepseek-chat`（OpenAI 兼容接口）。

> 模型切换：`.env` 里 `VITE_MODEL_PROVIDER` 可选 `deepseek`（默认）/ `qwen` / `gemini`，各填对应 key。
> DeepSeek 是纯文本模型，上传的照片不会发给它（三个预置文字案例不受影响）；需要图片分诊时切到 `qwen` 或 `gemini`。
> Demo 版 Key 直接暴露在前端，仅用于黑客松演示，请勿用于生产。
