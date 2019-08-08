import React from 'react';
import PropTypes from 'prop-types';
import Link from "next/link";

function BigNav(props) {
  const { category } = props;
  return (
    <>
      <div>
        <img alt="avatar" src="https://oss.biosan.cn/weichat/mine/WechatIMG1.jpeg" />
      </div>
      <nav>
        {category ? category.map(i => <Link key={i.id} href={`/category/${i.id}`}><a>{i.name}</a></Link>) : null}
      </nav>
    </>
  );
}

BigNav.propTypes = {
  category: PropTypes.array.isRequired
};

export default BigNav;
