import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';

import css from './BigNav.module.scss';

function BigNav(props) {
  const { category } = props;
  return (
    <section className={css.bignavContainer}>
      <div>
        <img
          onClick={() => Router.push('/')}
          className={css.avatar}
          alt="avatar"
          src="https://oss.biosan.cn/weichat/mine/WechatIMG1.jpeg"
        />
      </div>
      <nav className={css.nav}>
        {category &&
          category.map(i => (
            <Link key={i.id} href="/category/[id]" as={`/category/${i.id}`}>
              <a>{i.name}</a>
            </Link>
          ))}
      </nav>
    </section>
  );
}

export default BigNav;

BigNav.propTypes = {
  category: PropTypes.array.isRequired
};
