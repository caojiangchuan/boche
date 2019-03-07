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

class Stackedcolumn extends React.Component {

  render() {

    const { data } = this.props;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      // 展开字段集
      key: "日期",
      // key字段
      value: "停车次数" // value字段
    });

    console.log(dv, 'dv');

    const padding = [40, 0, 40, 80];

    return (
      <div style={{width: '560px'}}>
        <Chart height={400} data={dv} forceFit padding={padding}>
          <Legend position="top-right" />
          <Axis name="key" />
          <Axis name="value" />
          <Tooltip />
          <Geom type="intervalStack" position="日期*停车次数" color={['name', ['#8543E0', '#F04864']]} size={40} />
        </Chart>
      </div>
    );
  }
}

export default Stackedcolumn;
