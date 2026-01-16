import { GET, DELETE } from './request';
import type {
  BaseResponse,
  Category,
  ArticleListItem,
  Article,
  RecommendLink,
  GetCategoriesParams,
  GetArticleListParams,
  GetArticleDetailParams,
  DeleteCategoryParams,
} from './types';

/**
 * 获取子分类
 * @param params - 请求参数
 * @returns 分类列表响应
 */
export function getCategories(params: GetCategoriesParams): Promise<BaseResponse<Category[]>> {
  return GET<Category[]>('/category/getCategories', params);
}

/**
 * 获取所有分类（显示 loading）
 * @returns 所有分类列表响应
 */
export function getAllCategories(): Promise<BaseResponse<Category[]>> {
  return GET<Category[]>('/category/getAllCategories', null, true);
}

/**
 * 获取文章列表
 * @param params - 请求参数
 * @returns 文章列表响应
 */
export function getArticleList(
  params: GetArticleListParams
): Promise<BaseResponse<ArticleListItem[]>> {
  return GET<ArticleListItem[]>('/article/getArticleList', params);
}

/**
 * 获取文章详情
 * @param params - 请求参数
 * @returns 文章详情响应
 */
export function getArticleDetail(
  params: GetArticleDetailParams
): Promise<BaseResponse<Article>> {
  return GET<Article>('/article/getArticleDetail', params);
}

/**
 * 获取文章推荐链接
 * @param params - 请求参数
 * @returns 推荐链接列表响应
 */
export function getArticleRecommendLinks(
  params: GetArticleDetailParams
): Promise<BaseResponse<RecommendLink[]>> {
  return GET<RecommendLink[]>('/article/getArticleRecommendLinks', params);
}

/**
 * 删除分类
 * @param params - 请求参数
 * @returns 删除结果响应
 */
export function deleteCategory(params: DeleteCategoryParams): Promise<BaseResponse<any>> {
  return DELETE('/admin/deleteCategory', params);
}
