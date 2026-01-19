'use client';

import React, { useEffect, memo } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

/**
 * React 19 优化的性能监控组件
 */
export const PerformanceMonitor = memo(() => {
  useEffect(() => {
    // 只在生产环境和支持 PerformanceObserver 的浏览器中运行
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return;
    }

    const metrics: PerformanceMetrics = {};

    // 监控 Web Vitals
    const observeWebVitals = () => {
      // First Contentful Paint (FCP)
      if ('PerformanceObserver' in window) {
        try {
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              metrics.fcp = fcpEntry.startTime;
              console.log('FCP:', metrics.fcp);
            }
          });
          fcpObserver.observe({ entryTypes: ['paint'] });

          // Largest Contentful Paint (LCP)
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              metrics.lcp = lastEntry.startTime;
              console.log('LCP:', metrics.lcp);
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (entry.processingStart && entry.startTime) {
                metrics.fid = entry.processingStart - entry.startTime;
                console.log('FID:', metrics.fid);
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            metrics.cls = clsValue;
            console.log('CLS:', metrics.cls);
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // 页面卸载时发送数据
          const sendMetrics = () => {
            // 这里可以发送到分析服务
            console.log('Performance Metrics:', metrics);
            
            // 示例：发送到 Google Analytics 或其他分析服务
            // gtag('event', 'web_vitals', {
            //   fcp: metrics.fcp,
            //   lcp: metrics.lcp,
            //   fid: metrics.fid,
            //   cls: metrics.cls,
            // });
          };

          // 监听页面卸载事件
          window.addEventListener('beforeunload', sendMetrics);
          
          // 监听页面隐藏事件（移动端）
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
              sendMetrics();
            }
          });

          return () => {
            fcpObserver.disconnect();
            lcpObserver.disconnect();
            fidObserver.disconnect();
            clsObserver.disconnect();
            window.removeEventListener('beforeunload', sendMetrics);
          };
        } catch (error) {
          console.warn('Performance monitoring failed:', error);
        }
      }
    };

    // 监控 Navigation Timing
    const observeNavigationTiming = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const entry = navigationEntries[0];
          metrics.ttfb = entry.responseStart - entry.requestStart;
          console.log('TTFB:', metrics.ttfb);
        }
      }
    };

    // 监控资源加载
    const observeResourceTiming = () => {
      if ('PerformanceObserver' in window) {
        try {
          const resourceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              // 监控慢资源
              if (entry.duration > 1000) {
                console.warn('Slow resource detected:', entry.name, entry.duration);
              }
            });
          });
          resourceObserver.observe({ entryTypes: ['resource'] });

          return () => {
            resourceObserver.disconnect();
          };
        } catch (error) {
          console.warn('Resource timing monitoring failed:', error);
        }
      }
    };

    // 启动监控
    const cleanup1 = observeWebVitals();
    observeNavigationTiming();
    const cleanup2 = observeResourceTiming();

    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, []);

  // 开发环境下显示性能信息
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-black/80 border border-[var(--primary)] p-2 text-xs font-mono text-[var(--primary)]">
        <div>PERF_MONITOR: ACTIVE</div>
        <div className="text-[var(--muted)]">Check console for metrics</div>
      </div>
    );
  }

  return null;
});

PerformanceMonitor.displayName = 'PerformanceMonitor';