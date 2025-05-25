# Next.js 简历模板

一个现代化的响应式简历模板，使用 Next.js 和 Tailwind CSS 构建，支持 PDF 导出功能。

## 项目预览
https://resume.raowenjie.xyz/

![博客主页布局截图](https://i.imgur.com/TWKIaBp.png)


## ✨ 特性

- 🎨 现代化设计，支持深色渐变主题
- 📱 完全响应式，适配各种设备
- 📄 支持 PDF 导出和打印
- ⚡ 基于 Next.js 13+ 和 Tailwind CSS
- 🎯 易于自定义和扩展

## 🚀 快速开始

### 安装依赖
```bash
npm install
# 或
yarn install
```


###  启动开发服务器
```bash
npm run dev

# 或
yarn dev
```
打开 http://localhost:3000 查看效果。
安装 PDF 导出功能（可选）
```bash
npm install jspdf html2canvas
```

## 🎨 自定义

编辑 src/app/page.js 中的以下部分：
```bash
personalInfo: 个人基本信息
experience: 工作经历
education: 教育背景
skills: 技能列表
projects: 项目经历
```

## 📦 部署
```bash
Vercel 部署
npm run build
npx vercel

## 其他平台
npm run build
npm start
```


## 🛠️ 技术栈
```bash
Next.js - React 框架
Tailwind CSS - CSS 框架
Lucide React - 图标库
jsPDF - PDF 生成（可选）
html2canvas - HTML 转图片（可选）
```


### 📄 许可证
MIT License