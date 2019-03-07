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
  Table,
  Modal,
  message,
  Badge,
  Divider,
  Tabs,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FinanceList.less';
import locale from "antd/lib/date-picker/locale/zh_CN";
const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const {  MonthPicker, RangePicker} = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// 连接model层的state数据，然后通过this.props.state名(namespace)访问model层的state数据,通过connect函数（来自于react-redux）
@connect(({ finance,project,loading }) => ({
  finance, project,
  loading: (loading.models.finance, loading.models.project),
}))
@Form.create()
export default class AttendanceManage extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    display_months: 'block',
    display_days: 'none', //此状态机为display的取值
  };
  componentDidMount() {
    const { dispatch, project } = this.props;
    // 触发action触发model层的state的初始化
    //按月查询
    dispatch({
      type: 'finance/fetchAttendanceByMonth',
      payload: {startWorkDay : '2018-08-01', endWorkDay: '2018-08-30', currentPage: 1, pageSize: 10},
    });
    //按天查询
    dispatch({
      type: 'finance/fetchAttendanceByDay',
      payload: {startWorkDay : '2018-08-01', endWorkDay: '2018-08-30', currentPage: 1, pageSize: 10},
    });
    //项目信息
    dispatch({
      type: 'project/fetch',
      payload: {currentPage: 1, pageSize: 999},
      // callback: () => {
      //   const { projectList } = this.state;
      //   this.setState({
      //     projectList : project.data.list.map(pj=>pj.Name),
      // });
      // },
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
      type: 'finance/fetchAttendanceByMonth',
      payload: params,
    });
  };
  handleStandardTableChangeByDay = (pagination, filtersArg, sorter) => {
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
      type: 'finance/fetchAttendanceByDay',
      payload: params,
    });
  };
  /**
   * 查询
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'finance/fetchAttendanceByMonth',
        payload: values,
      });
    });
  };
  /**
   * Tab切换
   * @param key
   */
  handelTabs = (key)=> {
    console.log(key);
    if(key === 1){
      this.setState({
        display_months: 'block',
        display_days: 'none',
      });
    }else {
      this.setState({
        display_months: 'none',
        display_days: 'block',
      });
    }
  }
  doubleClick=(record)=>{
    console.log(record);
  };
  /**
   * 下拉框赋值
   * @param source
   */
  dropDownOption = ()=> {
    const {project} = this.props;
    return project.data.list.map(pj => <Option key={pj.Name}>{pj.Name}</Option>);
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={5}>
            <FormItem label="时间">
              {getFieldDecorator('monthDate')(<RangePicker local={locale} />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Select placeholder="请选择">{this.dropDownOption()}</Select>)}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="状态">
              {getFieldDecorator('state')(<Select placeholder="请选择"></Select>)}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入姓名"></Input>)}
            </FormItem>
          </Col>
          <Col span={4}>
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
    const { monthData } = this.props.finance;
    const { selectedRows, modalVisible } = this.state;
    // const { monthData } = this.finance.monthData;
    const columns = [
      {
        title: '时间',
        dataIndex: 'WorkMonth',
      },
      {
        title: '姓名',
        dataIndex: 'Username',
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
      },
      {
        title: '应打卡天数',
        dataIndex: 'Total',
      },
      {
        title: '正常天数',
        dataIndex: 'Normal',
      },
      {
        title: '异常天数',
        dataIndex: 'Deviant',
      },
    ];
    const dayColumns = [
      {
        title: '时间',
        dataIndex: 'WorkDay',
      },
      {
        title: '姓名',
        dataIndex: 'Username',
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
      },
      {
        title: '打卡地点',
        dataIndex: 'Address',
      },
      {
        title: '最早',
        dataIndex: 'CheckOn.Time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '最晚',
        dataIndex: 'CheckOff.Time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '工作时长',
        dataIndex: 'HasDispute',
      },
      {
        title: '状态',
        dataIndex: 'HasDispute',
        render: val => <span>{val?'异常':'正常'}</span>,
      },
      {
        title: '校准状态',
        dataIndex: 'Review',
      },
    ];
    return (
      <PageHeaderLayout>
        <Tabs defaultActiveKey="1" onChange={this.handelTabs}>
          <TabPane tab="按月统计" key="1">
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <StandardTable
                  rowKey="Id"
                  selectedRows={selectedRows}
                  loading={loading}
                  data={monthData === undefined ? [] : monthData}
                  columns={columns}
                  onChange={this.handleStandardTableChange}
                  onSelectRow={this.handleSelectRows}
                />
              </div>
            </Card>
          </TabPane>
          <TabPane tab="按日统计" key="2">
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <StandardTable
                  rowKey="Id"
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={dayColumns}
                  onChange={this.handleStandardTableChangeByDay}
                  onRow={record => ({
                    onClick: () => {
                      this.selectRow(record);
                    },
                  })}
                />
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}
