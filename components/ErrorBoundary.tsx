'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import type { ErrorBoundaryState } from '@/types';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * React 19 优化的错误边界组件
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 记录错误到错误报告服务
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 调用自定义错误处理函数
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 自定义降级 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-mono text-[var(--primary)] mb-4">
              SYSTEM_ERROR
            </h1>
            <p className="text-[var(--muted)] mb-6">
              应用程序遇到了一个错误。请刷新页面或稍后重试。
            </p>
            <div className="space-y-2">
              <button
                onClick={this.handleRetry}
                className="w-full px-6 py-3 bg-[var(--primary)] text-black font-mono uppercase tracking-widest hover:bg-[var(--accent)] transition-colors"
              >
                RETRY_SYSTEM
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 border border-[var(--muted)] text-[var(--muted)] font-mono uppercase tracking-widest hover:border-[var(--text)] hover:text-[var(--text)] transition-colors"
              >
                RELOAD_PAGE
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-[var(--muted)] font-mono text-sm">
                  DEBUG_INFO
                </summary>
                <pre className="mt-2 p-4 bg-black/50 border border-[var(--border)] text-xs text-[var(--muted)] overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 函数式错误边界 Hook（React 19 实验性功能）
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

/**
 * 异步错误边界组件
 */
export function AsyncErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary)]" />
          </div>
        }
      >
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}