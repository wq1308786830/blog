import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';

interface ArticleListProps {
  list: any[];
  categoryId?: string;
  leafId?: string;
}
function ArticleList(props: ArticleListProps) {
  const { categoryId, leafId, list } = props;

  return (
    <div className="w-full">
        <div className="flex justify-between border-b border-[var(--border)] pb-2 mb-4 text-xs font-mono text-[var(--muted)] uppercase">
            <span>FILE_NAME</span>
            <span>DATE_MODIFIED</span>
        </div>
      <div className="space-y-2">
        {list.map((article) => (
          <div key={article.id} className="group flex items-center justify-between p-3 border border-transparent hover:border-[var(--primary)] hover:bg-[rgba(0,243,255,0.03)] transition-all cursor-pointer">
            <Link
              href={`/category/${categoryId}${leafId ? `/${leafId}` : ''}/article/${article.id}`}
              className="font-mono text-[var(--text)] group-hover:text-[var(--primary)] hover:underline decoration-[var(--primary)] underline-offset-4 decoration-1 transition-colors flex-1"
            >
              {article.title}
            </Link>
            <span className="text-xs font-mono text-[var(--muted)] group-hover:text-[var(--primary)]">
                {dayjs(article.date_publish).format('YYYY-MM-DD')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
const defaultProps = {
  categoryId: '',
  leafId: '',
};
ArticleList.defaultProps = defaultProps;

export default ArticleList;
