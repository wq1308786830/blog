import React from 'react';
import { Avatar, Card, Timeline } from 'antd';
import './TimeLine.less';

function TimeLineArticleList() {
  return (
    <>
      <Timeline>
        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
        <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
        <Timeline.Item
          dot={
            <div className="timeline-date">
              <p>9月1日</p>
              <p>2015年</p>
            </div>
          }
        >
          <Card style={{ width: 300, marginTop: 16 }} loading={false}>
            <Card.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="Card title"
              description="This is the description"
            />
          </Card>
        </Timeline.Item>
        <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
      </Timeline>
    </>
  );
}

export default TimeLineArticleList;
