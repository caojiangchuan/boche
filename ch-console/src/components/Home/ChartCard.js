import React from 'react';
import { Card, Spin, Row, Col } from 'antd';

const ChartCard = (props) => {

  const { leftTitle, rightTitle, color, content,unit } = props;

  // title left 左边标题
  const titleTopLeft = (title) => {
    return (
      <span style={{color: '#000', fontWeight: 'bold'}}>{title}</span>
    )
  };

  // title right 右边标题
  const extra = (title, color) => {
    return (
      <span style={{color: '#fff', backgroundColor: `${color}`}}>{title}</span>
    )
  };

  return (
    <Card title={titleTopLeft(leftTitle)} extra={extra(rightTitle, color)} style={{ width: '100%', height: 144 }}>

      <div style={{textAlign: 'center', marginTop: -14}}>
        <span style={{fontSize: '38px', fontWeight: 'bold'}}>{content}</span>
        <span>({unit})</span>
      </div>

    </Card>
  );
};

export default ChartCard;
