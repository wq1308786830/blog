import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import './BigNav.less';

function BigNav(props) {
  const { category } = props;
  return (
    <>
      <div>
        <img className='avatar' alt="avatar" src="https://oss.biosan.cn/weichat/mine/WechatIMG1.jpeg" />
      </div>
      <nav>
        {category &&
          category.map(i => (
            <Link key={i.id} href="/category/[id]" as={`/category/${i.id}`}>
              <a>{i.name}</a>
            </Link>
          ))}
      </nav>
    </>
  );
}

export default BigNav;

BigNav.propTypes = {
  category: PropTypes.array.isRequired
};
