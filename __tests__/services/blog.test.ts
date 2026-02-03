import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCategories,
  getAllCategories,
  getArticleList,
  getArticleDetail,
  getArticleRecommendLinks,
  deleteCategory,
} from '@/services/blog';
import * as requestModule from '@/services/request';

// Mock request module
vi.mock('@/services/request', () => ({
  GET: vi.fn(),
  DELETE: vi.fn(),
}));

describe('Blog Service', () => {
  const GET = vi.mocked(requestModule.GET);
  const DELETE = vi.mocked(requestModule.DELETE);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should call GET with correct endpoint and params', async () => {
      GET.mockResolvedValueOnce({
        data: [],
        result: 'success',
        message: 'OK',
      });

      const params = { fatherId: 1 };
      await getCategories(params);

      expect(GET).toHaveBeenCalledWith('/category/getCategories', params);
    });

    it('should return categories data', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];

      GET.mockResolvedValueOnce({
        data: mockCategories,
        result: 'success',
        message: 'OK',
      });

      const result = await getCategories({ fatherId: 1 });

      expect(result.data).toEqual(mockCategories);
      expect(result.result).toBe('success');
    });

    it('should handle API errors', async () => {
      GET.mockResolvedValueOnce({
        data: null,
        result: 'fail',
        message: 'Error fetching categories',
      });

      const result = await getCategories({ fatherId: 1 });

      expect(result.result).toBe('fail');
      expect(result.message).toBe('Error fetching categories');
    });
  });

  describe('getAllCategories', () => {
    it('should call GET with correct endpoint and loading flag', async () => {
      GET.mockResolvedValueOnce({
        data: [],
        result: 'success',
        message: 'OK',
      });

      await getAllCategories();

      expect(GET).toHaveBeenCalledWith('/category/getAllCategories', null, true);
    });

    it('should return all categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1', subCategory: [] },
        { id: 2, name: 'Category 2', subCategory: null },
      ];

      GET.mockResolvedValueOnce({
        data: mockCategories,
        result: 'success',
        message: 'OK',
      });

      const result = await getAllCategories();

      expect(result.data).toEqual(mockCategories);
    });
  });

  describe('getArticleList', () => {
    it('should call GET with correct endpoint and params', async () => {
      GET.mockResolvedValueOnce({
        data: [],
        result: 'success',
        message: 'OK',
      });

      const params = { key: '1', page: 1, pageSize: 10 };
      await getArticleList(params);

      expect(GET).toHaveBeenCalledWith('/article/getArticleList', params);
    });

    it('should return article list', async () => {
      const mockArticles = [
        { id: 1, title: 'Article 1', date_publish: 1704067200000 },
        { id: 2, title: 'Article 2', date_publish: 1704153600000 },
      ];

      GET.mockResolvedValueOnce({
        data: mockArticles,
        result: 'success',
        message: 'OK',
      });

      const result = await getArticleList({ key: '1' });

      expect(result.data).toEqual(mockArticles);
    });

    it('should handle pagination parameters', async () => {
      GET.mockResolvedValueOnce({
        data: [],
        result: 'success',
        message: 'OK',
      });

      const params = { page: 2, pageSize: 20 };
      await getArticleList(params);

      expect(GET).toHaveBeenCalledWith('/article/getArticleList', params);
    });
  });

  describe('getArticleDetail', () => {
    it('should call GET with correct endpoint and params', async () => {
      GET.mockResolvedValueOnce({
        data: {},
        result: 'success',
        message: 'OK',
      });

      const params = { articleId: 123 };
      await getArticleDetail(params);

      expect(GET).toHaveBeenCalledWith('/article/getArticleDetail', params);
    });

    it('should return article detail', async () => {
      const mockArticle = {
        id: 123,
        title: 'Test Article',
        content: 'Article content',
        date_publish: 1704067200000,
        text_type: 'markdown',
      };

      GET.mockResolvedValueOnce({
        data: mockArticle,
        result: 'success',
        message: 'OK',
      });

      const result = await getArticleDetail({ articleId: 123 });

      expect(result.data).toEqual(mockArticle);
    });

    it('should handle string articleId', async () => {
      GET.mockResolvedValueOnce({
        data: {},
        result: 'success',
        message: 'OK',
      });

      await getArticleDetail({ articleId: '123' });

      expect(GET).toHaveBeenCalledWith('/article/getArticleDetail', { articleId: '123' });
    });
  });

  describe('getArticleRecommendLinks', () => {
    it('should call GET with correct endpoint and params', async () => {
      GET.mockResolvedValueOnce({
        data: [],
        result: 'success',
        message: 'OK',
      });

      const params = { articleId: 123 };
      await getArticleRecommendLinks(params);

      expect(GET).toHaveBeenCalledWith('/article/getArticleRecommendLinks', params);
    });

    it('should return recommend links', async () => {
      const mockLinks = [
        { id: 1, title: 'Link 1', url: 'https://example.com/1' },
        { id: 2, title: 'Link 2', url: 'https://example.com/2' },
      ];

      GET.mockResolvedValueOnce({
        data: mockLinks,
        result: 'success',
        message: 'OK',
      });

      const result = await getArticleRecommendLinks({ articleId: 123 });

      expect(result.data).toEqual(mockLinks);
    });
  });

  describe('deleteCategory', () => {
    it('should call DELETE with correct endpoint and params', async () => {
      DELETE.mockResolvedValueOnce({
        data: {},
        result: 'success',
        message: 'Category deleted',
      });

      const params = { categoryId: 1 };
      await deleteCategory(params);

      expect(DELETE).toHaveBeenCalledWith('/admin/deleteCategory', params);
    });

    it('should return delete result', async () => {
      DELETE.mockResolvedValueOnce({
        data: { deleted: true },
        result: 'success',
        message: 'Category deleted',
      });

      const result = await deleteCategory({ categoryId: 1 });

      expect(result.data.deleted).toBe(true);
      expect(result.result).toBe('success');
    });

    it('should handle delete errors', async () => {
      DELETE.mockResolvedValueOnce({
        data: null,
        result: 'fail',
        message: 'Delete failed',
      });

      const result = await deleteCategory({ categoryId: 1 });

      expect(result.result).toBe('fail');
      expect(result.message).toBe('Delete failed');
    });

    it('should handle string categoryId', async () => {
      DELETE.mockResolvedValueOnce({
        data: {},
        result: 'success',
        message: 'OK',
      });

      await deleteCategory({ categoryId: '1' });

      expect(DELETE).toHaveBeenCalledWith('/admin/deleteCategory', { categoryId: '1' });
    });
  });

  describe('type safety', () => {
    it('should properly type Category response', async () => {
      const mockCategory = {
        id: 1,
        name: 'Test',
        father_id: 0,
        level: 1,
        subCategory: null,
      };

      GET.mockResolvedValueOnce({
        data: [mockCategory],
        result: 'success',
        message: 'OK',
      });

      const result = await getCategories({});

      // Type check: data should be Category[]
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should properly type Article response', async () => {
      const mockArticle = {
        id: 1,
        title: 'Test',
        content: 'Content',
        categoryId: 1,
        createTime: '2024-01-01',
        updateTime: '2024-01-01',
        date_publish: 1704067200000,
        text_type: 'markdown',
      };

      GET.mockResolvedValueOnce({
        data: mockArticle,
        result: 'success',
        message: 'OK',
      });

      const result = await getArticleDetail({ articleId: 1 });

      // Type check: data should be Article
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('title');
    });
  });
});
