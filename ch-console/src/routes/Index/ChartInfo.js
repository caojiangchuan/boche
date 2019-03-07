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

class ChartInfo extends React.Component {
  state = {
    data: '',
  }

  componentDidMount() {
    const {data} = this.props;
    this.setState({data:data});
  };

  render() {
    const {
      data,
      titleMap = {
        y1: 'y1',
        y2: 'y2',
      },} = this.props;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'map',
      callback(row) {
        const newRow = { ...row };
        newRow[titleMap.y1] = row.y1;
        newRow[titleMap.y2] = row.y2;
        return newRow;
      },
    }).transform({
      type: "fold",
      fields: [titleMap.y1, titleMap.y2],
      key: "city",
      value: "temperature"
    });
    const cols = {
      x: {
        range: [0, 1]
      }
    };
    return (
      <div>
        <Chart height={400} data={dv} scale={cols} forceFit>
          <Legend />
          <Axis name="x" />
          <Axis
            name="temperature"
            label={{
              formatter: val => `${val}`
            }}
          />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="line"
            position="x*temperature"
            size={2}
            color={"city"}
          />
          <Geom
            type="point"
            position="x*temperature"
            size={4}
            shape={"circle"}
            color={"city"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default ChartInfo;
