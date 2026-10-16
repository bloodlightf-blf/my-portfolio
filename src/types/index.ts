// 全局数据模型类型定义
// 这些类型既用于 localStorage 模拟数据层，也用于未来无缝替换真实后端接口。

/** 时间线条目：工作经历或教育背景 */
export interface TimelineItem {
  id: string;
  type: 'experience' | 'education';
  /** 职位 / 学历名称，例如「前端工程师」「计算机科学本科」 */
  title: string;
  /** 公司 / 学校名称 */
  organization: string;
  location?: string;
  /** 开始时间，格式如 2020-07 */
  startDate: string;
  /** 结束时间，格式如 2022-03 或「至今」 */
  endDate: string;
  description: string;
}

/** 个人信息 */
export interface Profile {
  id: string;
  name: string;
  /** 职位头衔，如「资深前端工程师」 */
  title: string;
  /** 头像地址，可为空，空时前端展示姓名首字占位 */
  avatar: string;
  /** 一句话简介，展示在 Hero 区 */
  bio: string;
  /** 详细总结，展示在「关于我」 */
  summary: string;
  email: string;
  location: string;
  phone?: string;
  github: string;
  twitter: string;
  linkedin: string;
  website: string;
  resumeUrl?: string;
  /** 时间线（经历 + 教育） */
  timeline: TimelineItem[];
}

/** 技能 */
export interface Skill {
  id: string;
  name: string;
  /** 图标，使用 emoji 展示 */
  icon: string;
  /** 分类，用于前端分组展示 */
  category: string;
  /** 熟练度 0-100 */
  level: number;
}

/** 项目 */
export interface Project {
  id: string;
  title: string;
  /** 短描述，用于卡片列表 */
  description: string;
  /** 封面图地址，可为空，空时使用渐变占位 */
  cover: string;
  /** 技术标签 */
  tech: string[];
  /** 在线演示地址 */
  demoUrl: string;
  /** 源码仓库地址 */
  repoUrl: string;
  /** 是否为精选项目（前台只展示精选） */
  featured: boolean;
  /** Markdown 详细说明 */
  content: string;
  createdAt: string;
}

/** 博客文章 */
export interface BlogPost {
  id: string;
  title: string;
  /** URL 唯一标识 */
  slug: string;
  /** 摘要，用于列表页 */
  excerpt: string;
  /** Markdown 正文 */
  content: string;
  /** 封面图地址，可为空 */
  cover: string;
  tags: string[];
  /** 是否已发布（前台只展示已发布） */
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 登录请求参数 */
export interface LoginPayload {
  username: string;
  password: string;
}

/** 登录返回结果 */
export interface LoginResult {
  token: string;
}
