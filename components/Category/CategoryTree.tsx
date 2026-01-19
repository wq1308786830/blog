import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import type { CategoryTreeProps, Category } from '@/types';

/**
 * 单个分类链接组件 - React 19 优化
 */
const CategoryLink = memo<{
  category: Category;
  categoryId: number;
  isActive: boolean;
}>(({ category, categoryId, isActive }) => {
  const href = `/category/${categoryId}/${category.id}`;
  
  return (
    <Link
      href={href}
      className={`block py-2 px-3 text-sm font-mono transition-all border-l-2 ${
        isActive
          ? 'bg-[rgba(0,243,255,0.15)] text-[var(--primary)] border-[var(--primary)] font-semibold'
          : 'text-[var(--muted)] border-transparent hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[rgba(0,243,255,0.05)]'
      }`}
      prefetch={false} // Next.js 16 优化：按需预取
    >
      {'>'} {category.name}
    </Link>
  );
});

CategoryLink.displayName = 'CategoryLink';

/**
 * 分类组渲染组件 - React 19 优化
 */
const CategoryGroup = memo<{
  category: Category;
  categoryId: number;
  leafId?: number;
}>(({ category, categoryId, leafId }) => {
  // React 19 优化的计算属性
  const hasActiveChild = useMemo(() => 
    category.subCategory?.some((child) => child.id === leafId) ?? false,
    [category.subCategory, leafId]
  );

  return (
    <dl className="pl-3 border-l border-[rgba(255,255,255,0.05)] ml-1 my-1">
      <dt
        className={`py-2 px-2 text-sm font-bold uppercase tracking-wide bg-black/40 mb-1 ${
          hasActiveChild
            ? 'text-[var(--primary)] border-l-4 border-[var(--primary)]'
            : 'text-[var(--text)]'
        }`}
      >
        [{category.name}]
      </dt>
      {category.subCategory?.map((subCategory) => (
        <dd key={subCategory.id} className="ml-0">
          <CategoryRenderer 
            category={subCategory}
            categoryId={categoryId}
            leafId={leafId}
          />
        </dd>
      ))}
    </dl>
  );
});

CategoryGroup.displayName = 'CategoryGroup';

/**
 * 分类渲染器 - React 19 优化的递归组件
 */
const CategoryRenderer = memo<{
  category: Category;
  categoryId: number;
  leafId?: number;
}>(({ category, categoryId, leafId }) => {
  // 判断是否有子分类
  const hasSubCategories = Array.isArray(category.subCategory) && category.subCategory.length > 0;
  
  if (!hasSubCategories) {
    // 叶子节点 - 渲染链接
    const isActive = category.id === leafId;
    return (
      <CategoryLink
        category={category}
        categoryId={categoryId}
        isActive={isActive}
      />
    );
  }

  // 有子分类 - 渲染分组
  return (
    <CategoryGroup
      category={category}
      categoryId={categoryId}
      leafId={leafId}
    />
  );
});

CategoryRenderer.displayName = 'CategoryRenderer';

/**
 * React 19 优化的分类树组件
 */
export const CategoryTree = memo<CategoryTreeProps>(({ category, categoryId, leafId }) => {
  return (
    <nav role="navigation" aria-label="分类导航">
      <CategoryRenderer 
        category={category}
        categoryId={categoryId}
        leafId={leafId}
      />
    </nav>
  );
});

CategoryTree.displayName = 'CategoryTree';

// 保持向后兼容的默认导出
export default CategoryTree;
