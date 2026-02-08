import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryTree } from '@/components/Category/CategoryTree';
import type { Category } from '@/types';

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('CategoryTree Component', () => {
  const mockCategory: Category = {
    id: 1,
    name: 'Main Category',
    father_id: 0,
    level: 1,
    subCategory: [
      {
        id: 2,
        name: 'Sub Category 1',
        father_id: 1,
        level: 2,
        subCategory: [
          {
            id: 3,
            name: 'Leaf 1',
            father_id: 2,
            level: 3,
            subCategory: null,
          },
          {
            id: 4,
            name: 'Leaf 2',
            father_id: 2,
            level: 3,
            subCategory: null,
          },
        ],
      },
      {
        id: 5,
        name: 'Sub Category 2',
        father_id: 1,
        level: 2,
        subCategory: null,
      },
    ],
  };

  describe('rendering category structure', () => {
    it('should render main category', () => {
      render(<CategoryTree category={mockCategory} categoryId={1} />);

      expect(screen.getByText('[Main Category]')).toBeInTheDocument();
    });

    it('should render sub categories', () => {
      render(<CategoryTree category={mockCategory} categoryId={1} />);

      // Sub Category 1 has children, so it renders with brackets
      expect(screen.getByText('[Sub Category 1]')).toBeInTheDocument();
      // Sub Category 2 is a leaf node (no children), so it renders with "> " prefix
      expect(screen.getByText('> Sub Category 2')).toBeInTheDocument();
    });

    it('should render leaf categories', () => {
      render(<CategoryTree category={mockCategory} categoryId={1} />);

      expect(screen.getByText('> Leaf 1')).toBeInTheDocument();
      expect(screen.getByText('> Leaf 2')).toBeInTheDocument();
    });
  });

  describe('active state styling', () => {
    it('should apply active styles to selected leaf', () => {
      const { container } = render(
        <CategoryTree category={mockCategory} categoryId={1} leafId={3} />
      );

      // Check if active leaf has active class
      const activeLink = container.querySelector('.text-\\[var\\(--primary\\)\\]');
      expect(activeLink).toBeInTheDocument();
    });

    it('should highlight parent category when child is active', () => {
      const { container } = render(
        <CategoryTree category={mockCategory} categoryId={1} leafId={3} />
      );

      // Parent should have border-l-4 border-[var(--primary)]
      const parentCategory = container.querySelector('.border-l-4');
      expect(parentCategory).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should generate correct links for leaf categories', () => {
      const { container } = render(
        <CategoryTree category={mockCategory} categoryId={1} />
      );

      const links = container.querySelectorAll('a[href]');
      expect(links[0]).toHaveAttribute('href', '/category/1/3');
      expect(links[1]).toHaveAttribute('href', '/category/1/4');
      expect(links[2]).toHaveAttribute('href', '/category/1/5');
    });
  });

  describe('empty states', () => {
    const emptyCategory: Category = {
      id: 1,
      name: 'Empty Category',
      father_id: 0,
      level: 1,
      subCategory: null,
    };

    it('should render category without subcategories', () => {
      render(<CategoryTree category={emptyCategory} categoryId={1} />);

      // 叶子节点渲染为链接格式：'> Name'
      expect(screen.getByText('> Empty Category')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have navigation role', () => {
      const { container } = render(
        <CategoryTree category={mockCategory} categoryId={1} />
      );

      const nav = container.querySelector('nav[role="navigation"]');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', '分类导航');
    });

    it('should have proper link semantics', () => {
      const { container } = render(
        <CategoryTree category={mockCategory} categoryId={1} />
      );

      const links = container.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('category tree structure', () => {
    it('should render nested structure correctly', () => {
      const { container } = render(
        <CategoryTree category={mockCategory} categoryId={1} />
      );

      // Check for dl, dt, dd elements
      const dl = container.querySelector('dl');
      const dt = container.querySelector('dt');
      const dd = container.querySelectorAll('dd');

      expect(dl).toBeInTheDocument();
      expect(dt).toBeInTheDocument();
      expect(dd.length).toBeGreaterThan(0);
    });
  });

  describe('hover states', () => {
    it('should have hover classes for interactive elements', () => {
      const { container } = render(
        <CategoryTree category={mockCategory} categoryId={1} />
      );

      const hoverElements = container.querySelectorAll('.hover\\:text-\\[var\\(--primary\\)\\]');
      expect(hoverElements.length).toBeGreaterThan(0);
    });
  });

  describe('deeply nested categories', () => {
    it('should handle multiple levels of nesting', () => {
      const deepNested: Category = {
        id: 1,
        name: 'Level 1',
        father_id: 0,
        level: 1,
        subCategory: [
          {
            id: 2,
            name: 'Level 2',
            father_id: 1,
            level: 2,
            subCategory: [
              {
                id: 3,
                name: 'Level 3',
                father_id: 2,
                level: 3,
                subCategory: [
                  {
                    id: 4,
                    name: 'Level 4',
                    father_id: 3,
                    level: 4,
                    subCategory: null,
                  },
                ],
              },
            ],
          },
        ],
      };

      render(<CategoryTree category={deepNested} categoryId={1} />);

      expect(screen.getByText('[Level 1]')).toBeInTheDocument();
      expect(screen.getByText('[Level 2]')).toBeInTheDocument();
      expect(screen.getByText('[Level 3]')).toBeInTheDocument();
      expect(screen.getByText('> Level 4')).toBeInTheDocument();
    });
  });
});
