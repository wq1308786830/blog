import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Collapse, Icon } from 'antd';

function CategoryList(props) {
  const { category } = props;

  const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden'
  };

  return (
    <>
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        {category &&
          category.map(c => (
            <Collapse.Panel header={c.name} key={c.id} style={customPanelStyle}>
              {c.subCategory &&
                c.subCategory.map(s => (
                  <Link key={s.id} href="/category/[id]" as={`/category/${s.id}`}>
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
  category: PropTypes.array.isRequired
};
