'use client';

import React from 'react';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import type { Category } from '@/services/data.d';
import css from '@/styles/article.module.scss';

interface TopNavProps {
  navs: Category[];
}
function TopNav(props: TopNavProps) {
  const { navs } = props;
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = pathname.split('/')[2];

  if (!Array.isArray(navs)) {
    return null;
  }

  const isActive = (navItem: any) => categoryId && navItem.id === +categoryId;
  return (
    <header className={css.navsWrapper}>
      {navs.map((nav) => (
        <div
          key={nav.id}
          className={clsx(css.navItem, isActive(nav) && css.active)}
          onClick={() => {
            router.push(`/category/${nav.id}`);
          }}
        >
          {nav.name}
          {isActive(nav) && <div className={css.activeBar} />}
        </div>
      ))}
    </header>
  );
}

export default TopNav;
