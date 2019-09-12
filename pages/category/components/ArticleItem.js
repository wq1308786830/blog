import React from 'react';
import './ArticleItem.less';

function ArticleItem() {
  const str = `EllisLab have been building up to their latest release of ExpressionEngine for a while by
          sharing upcoming features through their blog. It's a given that anything EllisLab release
          will have its fair share of controversy and they have always had the adage of 'Can't do
          right for doing wrong'. …Read More`;
  return (
    <div className="article-item-wrap">
      <div>
        <p>8-29</p>
        <p>2019</p>
      </div>
      <div>
        <h3>大三大四的卡上</h3>
        <p>{str}</p>
      </div>
    </div>
  );
}

export default ArticleItem;
