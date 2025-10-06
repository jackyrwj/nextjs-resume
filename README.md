## Supabase 设置

在本地创建 `.env.local` 并填入：

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_TEST_USER_ID=your-test-user-uuid
```

注意：服务密钥仅在服务器端使用，已避免在客户端暴露。

### 数据表

在 Supabase SQL 运行：

```
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  data jsonb not null
);
```

### 归一化表结构（按项分别保存）

如果你希望每一项单独存储，使用以下结构（推荐）：

```
-- 主表：简历与个人信息
create table if not exists resumes_detailed (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  title text,
  email text,
  phone text,
  location text,
  website text,
  github text,
  linkedin text
);

-- 工作经历
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references resumes_detailed(id) on delete cascade,
  company text not null,
  position text not null,
  period text,
  order_index int default 0
);

-- 工作经历的描述条目
create table if not exists experience_bullets (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references experiences(id) on delete cascade,
  content text not null,
  order_index int default 0
);

-- 教育经历
create table if not exists educations (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references resumes_detailed(id) on delete cascade,
  school text not null,
  degree text,
  period text,
  gpa text,
  order_index int default 0
);

-- 项目经历
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references resumes_detailed(id) on delete cascade,
  name text not null,
  tech text,
  period text,
  description text,
  order_index int default 0
);

-- 技能（带分类）
create type skill_category as enum ('frontend', 'tools', 'backend', 'other');
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references resumes_detailed(id) on delete cascade,
  category skill_category not null,
  name text not null,
  order_index int default 0
);
```

注意：首次执行若 `skill_category` 已存在会报错，可先 `drop type skill_category` 再创建，或手动改为 `text` 列。

### 单用户单行结构（每个字段一列，推荐）

适合“一个用户一条记录”的场景：

```
-- 用户简历（每个用户一行）
create table if not exists user_resume (
  user_id uuid primary key,
  updated_at timestamptz default now(),

  -- 个人信息字段
  name text not null,
  title text,
  email text,
  phone text,
  location text,
  website text,
  github text,
  linkedin text,

  -- 工作经历（可根据需求增加更多列或改用 JSON）
  exp1_company text, exp1_position text, exp1_period text, exp1_desc text,
  exp2_company text, exp2_position text, exp2_period text, exp2_desc text,

  -- 教育经历
  edu1_school text, edu1_degree text, edu1_period text, edu1_gpa text,

  -- 项目经历
  proj1_name text, proj1_tech text, proj1_period text, proj1_desc text,

  -- 技能（可简化为逗号分隔或 JSON）
  skills_frontend text,
  skills_tools text,
  skills_backend text,
  skills_other text
);

-- 开启 RLS，并限制为“本人可读写”
alter table user_resume enable row level security;
create policy "owner can select" on user_resume for select using (auth.uid() = user_id);
create policy "owner can upsert" on user_resume for
  insert with check (auth.uid() = user_id),
  update using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

说明：
- 简化起见示例仅放了 2 段经历、1 段教育、1 个项目；你可以按需要扩展列或将这些部分改用 JSON 列（如 `exp jsonb`、`projects jsonb`）仍保持“单行”。
- 该结构依赖 Supabase Auth（`auth.uid()`）；若暂不启用登录，可先用服务端 Service Role 写入，后续再启用 RLS 和策略。

### 使用

开发环境启动后：
- 点击“保存到数据库”按钮，将按归一化结构写入多张表（`resumes_detailed` 及其子表）。
- 如需写入整份 JSON，可改用接口 `/api/save-resume`（保留兼容）。

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