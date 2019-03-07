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
@connect(({ finance,project,loading }) => ({
  finance,project,
  loading: (loading.models.finance,loading.models.project)
}))
@Form.create()
export default class AttendanceException extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    projectList:[],
  };
  componentDidMount() {
    const { dispatch, project } = this.props;
    // 触发action触发model层的state的初始化
    dispatch({
      type: 'finance/fetchAttendanceException',
    });
    console.log("=====project load========")
    dispatch({
      type: 'project/fetch',
      payload: {currentPage: 1, pageSize: 999},
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
      type: 'finance/fetchAttendanceException',
      payload: params,
    });
  };
  handleSelectRows = rows => {
    console.log(rows)
    this.setState({
      selectedRows: rows,
    });
  };
  //查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    console.log("---------")
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
        type: 'finance/fetchAttendanceException',
        payload: values,
      });
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
              type: 'finance/fetchAttendanceException',
            });
          },
        });
      },
    });
  }
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

          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('name')(<Select placeholder="请选择">{this.dropDownOption()}</Select>)}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <FormItem label="考勤周期">
              {getFieldDecorator('rangeDate')(<RangePicker local={locale} />)}
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
        title: '序号',
        dataIndex: 'Id',
      },
      {
        title: '姓名',
        dataIndex: 'Username',
      },
      {
        title: '手机号码',
        dataIndex: 'Phone',
      },
      {
        title: '异常日期',
        dataIndex: 'WorkDay',
      },
      {
        title: '项目',
        dataIndex: 'Name',
      },
      {
        title: '班次',
        dataIndex: '',
      },
      {
        title: '签到时间',
        dataIndex: 'Start',
      },
      {
        title: '签退时间',
        dataIndex: 'End',
      },
      {
        title: '操作',
        dataIndex: 'reviewResult',
        render: (value, row) => (
          <Fragment>
            <a
              onClick={(e)=>{
                e.preventDefault();
                this.handleEdit(row,'通过')
              }}
              href=""
            >
              {this.value ? "" : "通过"}
            </a>
            {this.value ? "" : <Divider type="vertical" />}
            <a
              onClick={(e)=>{
                e.preventDefault();
                this.handleEdit(row,'驳回')
              }}
              href=""
            >
              {this.value ? "" : "驳回"}
            </a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
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
