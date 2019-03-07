import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  DatePicker,
  Menu,
  Modal,
  message,
  Badge,
  Divider
} from 'antd';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
  StandardTable,
} from 'components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Delivery.less';
import locale from "antd/lib/date-picker/locale/zh_CN";
const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const salesData = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
const chartData = [];
for (let i = 0; i < 20; i += 1) {
  chartData.push({
    x: (new Date().getTime()) + (1000 * 60 * 30 * i),
    y1: Math.floor(Math.random() * 100) + 1000,
    y2: Math.floor(Math.random() * 100) + 10,
    y3: Math.floor(Math.random() * 100) + 100,
  });
}
// 连接model层的state数据，然后通过this.props.state名(namespace)访问model层的state数据
@connect(({ delivery, loading }) => ({
  delivery,
  loading: loading.models.delivery,
}))
@Form.create()
export default class ProjectManHour extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    // 触发action触发model层的state的初始化
    dispatch({
      type: 'delivery/fetch',
    });
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'delivery/fetch',
      payload: params,
    });
  };

  handleSelectRows = rows => {
    console.log(rows)
    this.setState({
      selectedRows: rows,
    });
  };
  /**
   * 新增公告
   */
  handleAdd = () => {
    const { dispatch } = this.props;
    // 触发action触发model层的state的初始化
    dispatch({
      type: 'delivery/add',
      payload: {},
    });
  };

  handleEdit = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    console.log(selectedRows.map(row => row.no).join(','));
    // 触发action触发model层的state的初始化
    dispatch({
      type: 'delivery/routeToEdit',
      payload: {selectedRows},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if(e.key==='edit'){//修改
      this.handleEdit();
    }else if(e.key==='delete'){//删除
      this.deleteNotice();
    }
  };

  /**
   * 删除公告
   */
  deleteNotice = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    console.log("========删除==========");
    console.log(selectedRows);
    if (!selectedRows) return;
    confirm({
      title: '操作提示',
      content: '确定要删除吗？',
      okText:"确定",
      cancelText:"取消",
      onOk:()=> {
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
      },
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={8} sm={24}>
            <FormItem label="项目选择">
              {getFieldDecorator('username')(<Select placeholder="请选择" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }
  render() {
    const {
      delivery: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Bar
              height={200}
              title="项目用工"
              data={salesData}
            />
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <TimelineChart
              title="项目用工趋势图"
              height={200}
              data={chartData}
              titleMap={{ y1: '用工需求', y2: '实际到岗', y3: '到岗率' }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
