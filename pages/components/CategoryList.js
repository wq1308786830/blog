import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Collapse, Icon } from 'antd';
import './CategoryList.less';

function CategoryList(props) {
  const { id, category } = props;

  const customPanelStyle = {
    minWidth: '20rem',
    borderRadius: 4,
    border: 0,
    color: '#2E9286',
    overflow: 'hidden'
  };

  return (
    <>
      <Collapse
        className="categories-container"
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        {category &&
          category.map(c => (
            <Collapse.Panel header={c.name} key={c.id} style={customPanelStyle}>
              {c.subCategory &&
                c.subCategory.map(s => (
                  <Link key={s.id} href="/category/[id]/[leafId]" as={`/category/${id}/${s.id}`}>
                    <a>{s.name}</a>
                  </Link>
                ))}
            </Collapse.Panel>
          ))}
      </Collapse>
    </>
  );
}

export default CategoryList;

CategoryList.propTypes = {
  id: PropTypes.string,
  category: PropTypes.array.isRequired
};
