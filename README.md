
# 元元记账 AI (YuanYuan Ledger AI)

一款基于 Google Gemini 3 系列模型的智能记账应用。支持商品级自动拆分、语音记账、图片识别及可视化报表。

## 🚀 部署指南 (Vercel)

1. **上传到 GitHub**：将本项目所有文件上传至您的 GitHub 仓库。
2. **在 Vercel 中导入**：
   - 登录 [Vercel](https://vercel.com/)。
   - 点击 "Add New" -> "Project"，选择您的 GitHub 仓库。
3. **配置环境变量**：
   - 在部署页面的 "Environment Variables" 部分，添加以下变量：
     - `API_KEY`: 您的 Google Gemini API Key。
4. **点击 Deploy**：完成部署，即可获得您的在线记账应用。

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## ✨ 核心功能
- **AI 智能拆分**：自动识别收据中的明细（如啤酒、牛奶）并独立记录。
- **多模态录入**：支持文字描述、图片拍照、语音输入。
- **微信小程序适配**：内置存储层及 UI 适配逻辑。
- **可视化报表**：自动生成支出分布及 7 天消费趋势图。
