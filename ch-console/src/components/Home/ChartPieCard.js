import React from 'react';
import { Card, Spin, Row, Col } from 'antd';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from 'bizcharts';
import { DataView } from '@antv/data-set';

const ChartPieCard = (props) => {

  const { title, data, total } = props;

  const { Html } = Guide;

  const titleTopLeft = (title) => {
    return (
      <span style={{color: '#000', fontWeight: 'bold'}}>{title}</span>
    )
  };

  const dv = new DataView();
  dv.source(data).transform({
    type: 'percent',
    field: 'count',
    dimension: 'item',
    as: 'percent'
  });

  let unusedPosition; // 空闲
  let usedPosition; // 占用
  let usedPositionPercent; // 占用泊位百分比

  // 取出列表中的数据
  if (dv.rows.length > 0) {
    usedPosition = dv.rows[0].count;  // 占用
    unusedPosition = dv.rows[1].count; // 空闲

    usedPositionPercent = ((usedPosition / (unusedPosition + usedPosition))* 100).toFixed(2);
  } else {
    usedPositionPercent = '0';
    unusedPosition = '0';
  }

  // 泊位占用图颜色
  let color;
  if (usedPositionPercent > 75) {
    color = '#F85A62';
  } else if(usedPositionPercent > 50) {
    color = '#40B1FC';
  }

  return (
    <Card title={titleTopLeft(title)}>

      <div>

        <div style={{float: 'left', marginTop: 10}}>
          <p>泊位总数：{total}</p>
          <p>空闲泊位数：{unusedPosition}</p>
          <p>泊位占用率：{usedPositionPercent}%</p>
        </div>

        <div style={{float: 'right'}}>
          <Chart width={200} height={120} data={dv} padding={[ 8, 0, 8, 0 ]}>
            <Coord type="theta" innerRadius={0.75} />
            <Axis name="percent" />
            <Tooltip
              showTitle={false}
              itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            />
            <Guide >
              <Html position ={[ '50%', '50%' ]} html={`<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">${usedPositionPercent}%<span style="color:#262626;font-size:1em"></span></div>`} alignX='middle' alignY='middle'/>
            </Guide>
            <Geom
              style={{ lineWidth: 1, stroke: '#fff' }}
              type="intervalStack"
              position="percent"
              color={['item' ,[color, '#F0F2F5']]}
              tooltip={['item*percent',(item, percent) => {
                percent = (percent * 100).toFixed(2) + '%';
                return {
                  name: item,
                  value: percent
                };
              }]}
            >

            </Geom>
          </Chart>
        </div>

      </div>

    </Card>
  );
};

export default ChartPieCard;
