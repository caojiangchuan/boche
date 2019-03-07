import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import Common from '../../common/Common';

const Utils = new Common();

class Basiccolumn extends React.Component {
  render() {

    const { data, fields } = this.props;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    let fieldsValue;
    if (Utils.isNotNull(fields)) {
      fieldsValue = fields;
    } else {
      fieldsValue = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
    }

    dv.transform({
      type: "fold",
      fields: fieldsValue,
      // 展开字段集
      key: "日期",
      // key字段
      value: "收入统计" // value字段
    });

    const scale = {
      sales:{
        type:"linear",
        tickInterval:20,
      },
    }

    const padding = [40, 0, 140, 100];

    return (
      <div style={{width: '100%'}} scale={scale}>
        <Chart height={390} data={dv} padding={padding} forceFit>
          <Legend position="top-right" />
          <Axis name="key" />
          <Axis name="value" />
          <Tooltip />
          <Geom position="日期*收入统计"  color={['name', ['#FFC53D']]} />
        </Chart>
      </div>
    );
  }
}

export default Basiccolumn;
