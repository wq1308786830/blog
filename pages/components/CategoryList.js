import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Collapse, Icon } from 'antd';
import './CategoryList.less';

function CategoryList(props) {
  const { id, leafId } = useRouter().query;
  const { category } = props;
  const [activeKey, setActiveKey] = useState([]);

  const customPanelStyle = {
    minWidth: '20rem',
    borderRadius: 4,
    border: 0,
    color: '#2E9286',
    overflow: 'hidden'
  };

  useEffect(() => {
    if (!leafId) {
      return;
    }
    let sub = {};
    category.forEach(c => {
      sub = c.subCategory.find(s => {
        return s.id === +leafId;
      });
      if (sub && sub.father_id) {
        setActiveKey([`${sub.father_id}`]);
      }
    });
  }, [category, leafId]);

  const onActiveChange = val => {
    setActiveKey(val);
  };

  return (
    <>
      <Collapse
        className="categories-container"
        bordered={false}
        onChange={onActiveChange}
        activeKey={activeKey}
        defaultActiveKey={activeKey}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        {category &&
          category.map(c => (
            <Collapse.Panel header={c.name} key={c.id} style={customPanelStyle}>
              {c.subCategory &&
                c.subCategory.map(s => (
                  <Link
                    key={s.id}
                    href="/category/[id]/[leafId]"
                    as={`/category/${id}/${s.id}`}
                  >
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
