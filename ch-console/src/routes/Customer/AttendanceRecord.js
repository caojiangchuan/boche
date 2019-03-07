import { ITagCloudProps } from './../../components/Charts/TagCloud/index.d';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Table,
} from 'antd';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
class Titles extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <a style={{ marginRight: 8 }} onClick={this.toggleForm}>
          <Icon type="left" />
        </a>
        {this.props.item.date}
        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
          <Icon type="right" />
        </a>
      </div>
    );
  }
}
const data = [
  {
    name: '张三',
    date: '2018-07',
    start: [
      { 1: '9:00' },
      { 2: '9:00' },
      { 3: '9:00' },
      { 4: '9:00' },
      { 5: '9:00' },
      { 6: '9:00' },
    ],
    end: [{ 1: '15:00' }, { 2: '15:00' }, { 3: '15:00' }, { 4: '15:00' }, { 5: '15:00' }],
  },
];

const data2 = [
  {
    name: '张三',
    date: '2018-07',
    banci: '上班',
    1: '9:00',
    2: '9:00',
    3: '9:00',
    4: '9:00',
    5: '9:00',
    6: '9:00',
    work: 26,
  },
  {
    name: '张三',
    date: '2018-07',
    banci: '下班',
    1: '15:00',
    2: '15:00',
    3: '15:00',
    4: '15:00',
    5: '15:00',
    6: '15:00',
    work: 26,
  },
];

const childs = [];
const starts = [];

for (let item of data) {
  for (let i = 0; i < item.start.length; i++) {
    // childs.push({'title':i,'dataIndex':i,'key':i});
    childs.push({ title: i + 1, dataIndex: i + 1 });
    starts.push(item.start[i]);
  }
}

export default class AttendanceRecord extends PureComponent {
  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 2;
          }
          if (index === 1) {
            obj.props.rowSpan = 0;
          }

          return obj;
        },
      },
      {
        title: '班次',
        dataIndex: 'banci',
        key: 'banci',
        width: 100,
      },
      {
        title: data.map(item => {
          return <Titles item={item} />;
        }),
        dataIndex: 'date',
        children: childs,
      },
      {
        title: '本月出勤工时(小时)',
        dataIndex: 'work',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 2;
          }
          if (index === 1) {
            obj.props.rowSpan = 0;
          }

          return obj;
        },
      },
    ];

    return (
      <div>
        <div style={{ float: 'left', marginLeft: '5%' }}>
          <label>考勤周期</label>
          <DatePicker defaultValue={moment('2018/05/01', dateFormat)} format={dateFormat} />
          ---
          <DatePicker defaultValue={moment('2018/05/31', dateFormat)} format={dateFormat} />
        </div>

        <div style={{ float: 'left', marginLeft: '5%' }}>
          <Button type="primary" style={{ marginLeft: 20 }}>
            查询
          </Button>
          <Button type="primary" style={{ marginLeft: 20 }}>
            导出
          </Button>
        </div>
        <br />

        <Form style={{ marginTop: '2%' }}>
          <Table columns={columns} dataSource={data2} bordered />
        </Form>
      </div>
    );
  }
}
