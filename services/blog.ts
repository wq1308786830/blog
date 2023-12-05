import { GET, DELETE } from './request';

export function getCategories(fatherId: any) {
  return GET('/category/getCategories', { fatherId });
}

export function getAllCategories() {
  return GET('/category/getAllCategories', null, true);
}

export function getArticleList(key: any) {
  return GET('/article/getArticleList', { key });
}

export function getArticleDetail(articleId: any) {
  return GET('/article/getArticleDetail', { articleId });
}

export function getArticleRecommendLinks(articleId: any) {
  return GET('/article/getArticleRecommendLinks', { articleId });
}

export function deleteCategory(categoryId: any) {
  return DELETE('/admin/deleteCategory', { categoryId });
}
