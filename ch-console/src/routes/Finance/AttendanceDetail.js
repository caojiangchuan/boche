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
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FinanceList.less';
import locale from "antd/lib/date-picker/locale/zh_CN";
const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const {RangePicker} = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// 连接model层的state数据，然后通过this.props.state名(namespace)访问model层的state数据,通过connect函数（来自于react-redux）
@connect(({ finance, loading }) => ({
  finance,
  loading: loading.models.finance,
}))
@Form.create()
export default class AttendanceDetail extends PureComponent {
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
      type: 'finance/fetch',
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
      type: 'finance/fetch',
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
   * 通过、驳回
   */
  handleEdit = (row, text) => {
    const { dispatch } = this.props;
    confirm({
      title: '操作提示',
      content: '确定要操作吗？',
      okText:"确定",
      cancelText:"取消",
      onOk:()=> {
        dispatch({
          type: 'finance/routeToEdit',
          payload: {id : row.Id, reviewResult: text},
          callback: () => {
            dispatch({
              type: 'finance/fetch',
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
            <FormItem label="项目名称">
              {getFieldDecorator('username')(<Select placeholder="请选择" />)}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <FormItem label="考勤周期">
              {getFieldDecorator('phone')(<RangePicker local={locale} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
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
      finance: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = [
      {
        title: '时间',
        dataIndex: 'Id',
      },
      {
        title: '姓名',
        dataIndex: 'Username',
      },
      {
        title: '项目名称',
        dataIndex: 'Name',
      },
      {
        title: '最早打卡',
        dataIndex: 'Start',
      },
      {
        title: '最晚打卡',
        dataIndex: 'End',
      },
      {
        title: '次数',
        dataIndex: 'End',
      },
      {
        title: '工作时长',
        dataIndex: 'End',
      },
      {
        title: '审批单',
        dataIndex: 'End',
      },
      {
        title: '状态',
        dataIndex: 'End',
      },
      {
        title: '校准状态',
        dataIndex: 'End',
      },

    ];
    return (
      <PageHeaderLayout title="XX8月打卡明细">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/*<div className={styles.tableListForm}>{this.renderForm()}</div>*/}
            <StandardTable
              rowKey="Id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
