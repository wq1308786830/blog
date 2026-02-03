import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleList } from '@/components/ArticleList';
import type { ArticleListItem } from '@/types';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('ArticleList Component', () => {
  const mockArticles: ArticleListItem[] = [
    {
      id: 1,
      title: 'Test Article 1',
      date_publish: 1704067200000,
      categoryId: 1,
      createTime: '2024-01-01',
    },
    {
      id: 2,
      title: 'Test Article 2',
      date_publish: 1704153600000,
      categoryId: 1,
      createTime: '2024-01-02',
    },
  ];

  describe('when articles exist', () => {
    it('should render article list correctly', () => {
      render(<ArticleList list={mockArticles} categoryId="1" />);

      // Check if articles are rendered
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(<ArticleList list={mockArticles} />);

      expect(screen.getByText('FILE_NAME')).toBeInTheDocument();
      expect(screen.getByText('DATE_MODIFIED')).toBeInTheDocument();
    });

    it('should render article dates correctly', () => {
      render(<ArticleList list={mockArticles} />);

      expect(screen.getByText('2024-01-01')).toBeInTheDocument();
      expect(screen.getByText('2024-01-02')).toBeInTheDocument();
    });

    it('should display total file count', () => {
      render(<ArticleList list={mockArticles} />);

      expect(screen.getByText('TOTAL_FILES: 2')).toBeInTheDocument();
    });

    it('should generate correct links with categoryId and leafId', () => {
      const { container } = render(
        <ArticleList list={mockArticles} categoryId="1" leafId="2" />
      );

      const links = container.querySelectorAll('a[href]');
      expect(links[0]).toHaveAttribute('href', '/category/1/2/article/1');
      expect(links[1]).toHaveAttribute('href', '/category/1/2/article/2');
    });
  });

  describe('when article list is empty', () => {
    it('should render empty state', () => {
      render(<ArticleList list={[]} />);

      expect(screen.getByText('NO_ARTICLES_FOUND')).toBeInTheDocument();
      expect(screen.getByText('暂无文章数据')).toBeInTheDocument();
      expect(screen.getByText('📝')).toBeInTheDocument();
    });

    it('should render empty state when list is null', () => {
      render(<ArticleList list={null as any} />);

      expect(screen.getByText('NO_ARTICLES_FOUND')).toBeInTheDocument();
    });
  });

  describe('when list is not an array', () => {
    it('should render empty state', () => {
      render(<ArticleList list={undefined as any} />);

      expect(screen.getByText('NO_ARTICLES_FOUND')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have role="list" on article container', () => {
      const { container } = render(<ArticleList list={mockArticles} />);
      const listContainer = container.querySelector('[role="list"]');

      expect(listContainer).toBeInTheDocument();
    });
  });

  describe('article styling and interaction', () => {
    it('should apply hover styles to article items', () => {
      const { container } = render(<ArticleList list={mockArticles} />);
      const articleItems = container.querySelectorAll('.group');

      expect(articleItems.length).toBe(2);
    });
  });
});
