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

class LineChartInfo extends React.Component {
  state = {
    data: '',
  }

  componentDidMount() {
    const {data} = this.props;
    this.setState({data:data});
  };

  render() {

    const {
      title,
      height = 390,
      padding = [40, 120, 150, 60],
      borderWidth = 2,
    } = this.props;

    const {
      data,
      titleMap = {
        y: 'y',
      },} = this.props;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'map',
      callback(row) {
        const newRow = { ...row };
        newRow[titleMap.y] = row.y;
        return newRow;
      },
    }).transform({
      type: "fold",
      fields: [titleMap.y],
      key: "key",
      value: "value"
    });
    const cols = {
      x: {
        range: [0, 1]
      }
    };
    return (
      <div>
        <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
          <Axis name="x" />
          <Tooltip />
          <Legend name="key" position="top-right" />
          <Geom type="line" position="x*value" size={borderWidth} color="key" />
        </Chart>
      </div>
    );
  }
}

export default LineChartInfo;
