import React from 'react';
import { Avatar, Card } from 'antd';
import './TimeLine.less';

function TimeLineArticleList() {
  return (
    <section className="timeline-list-container">
      <Card style={{ width: 300, marginTop: 16 }} loading={false}>
        <Card.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title="Card title"
          description="This is the description"
        />
      </Card>
    </section>
  );
}

export default TimeLineArticleList;
