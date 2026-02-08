/**
 * React 19 & Next.js 16 优化的类型定义
 */

import { ReactNode } from 'react';

// ============= 基础类型 =============

/**
 * 页面参数类型 - 支持 Next.js 16 的新路由系统
 */
export interface PageParams {
  categoryId?: string;
  leafId?: string;
  articleId?: string;
}

/**
 * 搜索参数类型
 */
export interface SearchParams {
  page?: string;
  pageSize?: string;
  keyword?: string;
}

/**
 * 页面 Props - React 19 优化
 */
export interface PageProps<T = PageParams> {
  params: Promise<T>; // Next.js 16 中 params 是 Promise
  searchParams: Promise<SearchParams>; // searchParams 也是 Promise
}

/**
 * 布局 Props
 */
export interface LayoutProps {
  children: ReactNode;
  params: Promise<PageParams>;
}

// ============= 业务类型 =============

/**
 * 分类接口
 */
export interface Category {
  readonly id: number;
  readonly name: string;
  readonly father_id: number;
  readonly level: number;
  readonly subCategory: Category[] | null;
}

/**
 * 文章列表项
 */
export interface ArticleListItem {
  readonly id: number;
  readonly title: string;
  readonly summary?: string;
  readonly categoryId: number;
  readonly createTime: string;
  readonly date_publish: number;
}

/**
 * 文章详情
 */
export interface Article {
  readonly id: number;
  readonly title: string;
  readonly content: string;
  readonly categoryId: number;
  readonly createTime: string;
  readonly updateTime: string;
  readonly date_publish: number;
  readonly text_type: string; // 改为 string 以匹配 API 响应
}

/**
 * 推荐链接
 */
export interface RecommendLink {
  readonly id: number;
  readonly title: string;
  readonly url: string;
}

// ============= API 类型 =============

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = unknown> {
  readonly data: T;
  readonly result: 'success' | 'fail';
  readonly message: string;
  readonly timestamp?: number;
}

/**
 * 分页响应
 */
export interface PaginatedData<T> {
  readonly list: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

// ============= 组件 Props 类型 =============

/**
 * 文章列表组件 Props
 */
export interface ArticleListProps {
  readonly list: ArticleListItem[];
  readonly categoryId?: string;
  readonly leafId?: string;
}

/**
 * 文章详情组件 Props
 */
export interface ArticleDetailProps {
  readonly article: Article;
}

/**
 * 分类树组件 Props
 */
export interface CategoryTreeProps {
  readonly category: Category;
  readonly categoryId: number;
  readonly leafId?: number;
}

/**
 * 技术图片模态框 Props
 */
export interface TechImageModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly src: string;
  readonly alt: string;
}

// ============= 工具类型 =============

/**
 * 提取 Promise 的类型
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * 使组件 Props 可选
 */
export type PartialProps<T> = Partial<T> & { children?: ReactNode };

/**
 * 严格的对象键类型
 */
export type StrictRecord<K extends string | number | symbol, V> = Record<K, V>;

// ============= 错误处理类型 =============

/**
 * 错误边界状态
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * 加载状态
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ============= 导出所有类型 =============
export * from '../services/types';