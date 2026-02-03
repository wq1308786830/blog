import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { TechImageModal } from '@/components/TechImageModal';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, priority, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('TechImageModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    src: '/test-image.jpg',
    alt: 'Test Image',
  };

  beforeEach(() => {
    // Clean up body before each test
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any remaining modals
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<TechImageModal {...mockProps} isOpen={false} />);

      const modal = document.querySelector('[role="dialog"]');
      expect(modal).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<TechImageModal {...mockProps} />);

      const modal = document.querySelector('[role="dialog"]');
      expect(modal).toBeInTheDocument();
    });

    it('should display image alt text in header', () => {
      render(<TechImageModal {...mockProps} />);

      expect(document.body.textContent).toContain('[Test Image]');
    });

    it('should render the image', () => {
      render(<TechImageModal {...mockProps} />);

      const image = document.querySelector('img[src="/test-image.jpg"]');
      expect(image).toBeInTheDocument();
    });
  });

  describe('portal rendering', () => {
    it('should render in portal', () => {
      render(<TechImageModal {...mockProps} />);

      const portalContent = document.body.querySelector('[role="dialog"]');
      expect(portalContent).toBeInTheDocument();
    });
  });

  describe('closing behavior', () => {
    it('should call onClose when close button is clicked', () => {
      render(<TechImageModal {...mockProps} />);

      // Find close button by its text content in document.body
      const closeButton = Array.from(document.querySelectorAll('button')).find(
        btn => btn.textContent?.includes('CLOSE_VIEWER')
      );
      expect(closeButton).toBeDefined();
      if (closeButton) {
        fireEvent.click(closeButton);
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
      }
    });

    it('should call onClose when Escape key is pressed', async () => {
      render(<TechImageModal {...mockProps} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onClose when backdrop is clicked', () => {
      render(<TechImageModal {...mockProps} />);

      // Find backdrop by its class
      const backdrop = document.querySelector('.bg-black\\/90, [class*="bg-black"]');
      expect(backdrop).toBeInTheDocument();

      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<TechImageModal {...mockProps} />);

      const modal = document.querySelector('[role="dialog"]');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should have aria-label for close button', () => {
      render(<TechImageModal {...mockProps} />);

      // Find button by aria-label
      const closeButton = document.querySelector('[aria-label="关闭图片查看器"]');
      expect(closeButton).toBeInTheDocument();
    });

    it('should have modal-title id for header', () => {
      render(<TechImageModal {...mockProps} />);

      const title = document.getElementById('modal-title');
      expect(title).toBeInTheDocument();
    });
  });

  describe('cyberpunk theme elements', () => {
    it('should display LIVE_FEED indicator', () => {
      render(<TechImageModal {...mockProps} />);

      expect(document.body.textContent).toContain('LIVE_FEED');
    });

    it('should display SYSTEM_READY status', () => {
      render(<TechImageModal {...mockProps} />);

      expect(document.body.textContent).toContain('SYSTEM_READY');
    });

    it('should display ZOOM indicator', () => {
      render(<TechImageModal {...mockProps} />);

      expect(document.body.textContent).toContain('ZOOM:');
    });

    it('should display COORDS information', () => {
      render(<TechImageModal {...mockProps} />);

      expect(document.body.textContent).toContain('COORDS:');
    });

    it('should have corner HUD decorations', () => {
      render(<TechImageModal {...mockProps} />);

      // Query from document.body since the component uses createPortal
      const cornerBorders = document.body.querySelectorAll('.border-t-2, .border-b-2, .border-l-2, .border-r-2');
      expect(cornerBorders.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('body scroll lock', () => {
    it('should lock body scroll when open', () => {
      render(<TechImageModal {...mockProps} />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should unlock body scroll when closed', () => {
      const { rerender } = render(<TechImageModal {...mockProps} />);

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<TechImageModal {...mockProps} isOpen={false} />);

      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('keyboard event listener cleanup', () => {
    it('should add and remove event listener properly', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = render(<TechImageModal {...mockProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});
