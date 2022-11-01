'use client';

import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Category } from '@/utils/data.d';
import css from '@/styles/article.module.scss';

interface TopNavProps {
  navs: Category[];
}
function TopNav(props: TopNavProps) {
  const { navs } = props;
  const router = useRouter();

  if (!Array.isArray(navs)) {
    return null;
  }

  return (
    <section className={css.navsWrapper}>
      {navs.map((nav) => (
        <div
          key={nav.id}
          className={clsx(css.navItem, css.active)}
          onClick={() => {
            router.push(`/article/${nav.id}`);
          }}
        >
          {nav.name}
          <div className={css.activeBar} />
        </div>
      ))}
    </section>
  );
}

export default TopNav;
