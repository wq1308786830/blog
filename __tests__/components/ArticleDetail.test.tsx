import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleDetail } from '@/components/ArticleDetail';
import type { Article } from '@/types';

// Mock dayjs
vi.mock('dayjs', () => ({
  default: (date: number | string) => ({
    format: (format: string) => {
      if (format === 'YYYY-MM-DD HH:mm:ss') return '2024-01-01 12:00:00';
      if (format === 'YYYY-MM-DD') return '2024-01-01';
      if (format === 'toISOString') return '2024-01-01T12:00:00.000Z';
      return date;
    },
    toISOString: () => '2024-01-01T12:00:00.000Z',
  }),
}));

// Mock ReactMarkdown and SyntaxHighlighter
vi.mock('react-markdown', () => ({
  default: ({ children, className, components }: any) => (
    <div className={className}>
      {children}
    </div>
  ),
}));

vi.mock('react-syntax-highlighter', () => ({
  Prism: {
    default: ({ children, style, language, ...props }: any) => (
      <pre data-language={language} {...props}>
        <code>{children}</code>
      </pre>
    ),
  },
}));

vi.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  oneDark: {},
}));

// Mock CSS import
vi.mock('@/app/markdown.css', () => ({}));

describe('ArticleDetail Component', () => {
  const mockArticle: Article = {
    id: 1,
    title: 'Test Article Title',
    content: '# Test Content\n\nThis is a test article.',
    date_publish: 1704067200000,
    text_type: 'markdown',
    categoryId: 1,
    createTime: '2024-01-01',
    updateTime: '2024-01-01',
  };

  describe('markdown content rendering', () => {
    it('should render article title', () => {
      render(<ArticleDetail article={mockArticle} />);

      expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    });

    it('should render article content', () => {
      render(<ArticleDetail article={mockArticle} />);

      // Content is rendered through ReactMarkdown mock
      expect(document.body.textContent).toContain('# Test Content');
      expect(document.body.textContent).toContain('This is a test article.');
    });

    it('should display publish date', () => {
      render(<ArticleDetail article={mockArticle} />);

      expect(screen.getByText(/LOG_DATE:/i)).toBeInTheDocument();
      expect(screen.getByText('2024-01-01 12:00:00')).toBeInTheDocument();
    });

    it('should display article type', () => {
      render(<ArticleDetail article={mockArticle} />);

      // Check for TYPE label using regex
      expect(screen.getByText(/TYPE:/i)).toBeInTheDocument();
      // Check that the text_type value is in the document
      expect(document.body.textContent).toContain('markdown');
    });
  });

  describe('HTML content rendering', () => {
    const htmlArticle: Article = {
      ...mockArticle,
      text_type: 'html',
      content: '<p>HTML Content</p>',
    };

    it('should render HTML content correctly', () => {
      const { container } = render(<ArticleDetail article={htmlArticle} />);
      // HTML content is rendered with dangerouslySetInnerHTML prop
      const htmlContent = container.querySelector('.leading-relaxed');

      expect(htmlContent).toBeInTheDocument();
      expect(htmlContent?.innerHTML).toContain('<p>HTML Content</p>');
    });
  });

  describe('article header', () => {
    it('should render article with proper heading level', () => {
      const { container } = render(<ArticleDetail article={mockArticle} />);
      const heading = container.querySelector('h1');

      expect(heading).toBeInTheDocument();
      // Title is displayed in original case, not uppercase
      expect(heading?.textContent).toBe('Test Article Title');
    });

    it('should display formatted date in time element', () => {
      const { container } = render(<ArticleDetail article={mockArticle} />);
      const timeElement = container.querySelector('time');

      expect(timeElement).toBeInTheDocument();
      expect(timeElement).toHaveAttribute('dateTime', '2024-01-01T12:00:00.000Z');
    });
  });

  describe('cyberpunk styling', () => {
    it('should have proper CSS classes for cyberpunk theme', () => {
      const { container } = render(<ArticleDetail article={mockArticle} />);

      const main = container.querySelector('main');
      expect(main).toHaveClass('max-w-5xl');
    });

    it('should have cyber-border on content container', () => {
      const { container } = render(<ArticleDetail article={mockArticle} />);

      const cyberBorder = container.querySelector('.cyber-border');
      expect(cyberBorder).toBeInTheDocument();
    });
  });

  describe('loading and animation states', () => {
    it('should display animated pulse indicator', () => {
      const { container } = render(<ArticleDetail article={mockArticle} />);

      const pulseElement = container.querySelector('.animate-pulse');
      expect(pulseElement).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      const { container } = render(<ArticleDetail article={mockArticle} />);

      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should have proper time element for date', () => {
      const { container } = render(<ArticleDetail article={mockArticle} />);

      const time = container.querySelector('time[dateTime]');
      expect(time).toBeInTheDocument();
    });
  });
});
