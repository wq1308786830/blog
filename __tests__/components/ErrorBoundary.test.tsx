import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, useErrorBoundary } from '@/components/ErrorBoundary';

describe('ErrorBoundary Component', () => {
  // Mock console.error to avoid cluttering test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  const ThrowError = () => {
    throw new Error('Test error');
  };

  const NormalComponent = () => <div>Normal Content</div>;

  describe('error catching', () => {
    it('should catch errors and render error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('SYSTEM_ERROR')).toBeInTheDocument();
      expect(screen.getByText(/应用程序遇到了一个错误/)).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      render(
        <ErrorBoundary fallback={<div>Custom Error UI</div>}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    });
  });

  describe('normal rendering', () => {
    it('should render children when no error', () => {
      render(
        <ErrorBoundary>
          <NormalComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal Content')).toBeInTheDocument();
    });
  });

  describe('error recovery', () => {
    it('should have retry button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText('RETRY_SYSTEM');
      expect(retryButton).toBeInTheDocument();
    });

    it('should have reload button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByText('RELOAD_PAGE');
      expect(reloadButton).toBeInTheDocument();
    });

    it('should call window.location.reload on reload button click', () => {
      // Mock window.location.reload
      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByText('RELOAD_PAGE');
      fireEvent.click(reloadButton);

      expect(reloadMock).toHaveBeenCalled();
    });
  });

  describe('error callback', () => {
    it('should call onError callback when error occurs', () => {
      const onErrorMock = vi.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalled();
    });
  });

  describe('development mode', () => {
    it('should show debug info in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const debugInfo = screen.getByText('DEBUG_INFO');
      expect(debugInfo).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('should not show debug info in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const debugInfo = screen.queryByText('DEBUG_INFO');
      expect(debugInfo).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('useErrorBoundary hook', () => {
    it('should provide captureError and resetError functions', () => {
      let hookResult: any;

      const TestComponent = () => {
        hookResult = useErrorBoundary();
        return <div>Test</div>;
      };

      render(<TestComponent />);

      expect(hookResult).toBeDefined();
      expect(hookResult.captureError).toBeInstanceOf(Function);
      expect(hookResult.resetError).toBeInstanceOf(Function);
    });
  });

  describe('cyberpunk theme', () => {
    it('should use cyberpunk styling classes', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const errorTitle = screen.getByText('SYSTEM_ERROR');
      // Check that the element has the expected class (checking for partial match due to CSS variable syntax)
      expect(errorTitle.className).toContain('text-');
      expect(errorTitle.className).toContain('primary');
    });
  });
});
