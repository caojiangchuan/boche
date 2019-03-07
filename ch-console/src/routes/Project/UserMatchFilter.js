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
  notification,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
const {RangePicker } = DatePicker;

import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './UserMatchFilter.less';
import UserMatchForm from './UserMatchForm'

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

@connect(({customer, loading, project}) => ({
  customer,
  project,
  loading: loading.models.customer,
}))
@Form.create()
export default class UserMatchFilter extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    workDays:[]
  };

  componentDidMount() {
    const projectDetail = this.props.project.projectDetail
    var defaultValue = new moment().add(1,"days").format('YYYY-MM-DD');
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/laodOffWorkUsers',
      payload: {status:'sign',workDayFrom:defaultValue,workDayTo:defaultValue,projectId:projectDetail.Id},
    });
    this.setState({
      workDays:[defaultValue]
    })
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
    const projectDetail = this.props.project.projectDetail
    params.projectId=projectDetail.Id
    dispatch({
      type: 'customer/laodOffWorkUsers',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'customer/laodOffWorkUsers',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.status='sign'
      let values = {
        ...fieldsValue,
      };
      values.workDayFrom = moment(values.workDay[0]).format('YYYY-MM-DD')
      values.workDayTo = moment(values.workDay[1]).format('YYYY-MM-DD')
      var workDays = [moment(values.workDay[0]).format('YYYY-MM-DD')]
      var temp = moment(values.workDayFrom)
      console.error(typeof temp)
      while(temp.valueOf()<moment(values.workDayTo).valueOf()){
        temp = temp.add(1,"days");
        workDays.push(temp.format('YYYY-MM-DD'))
      }
      console.error(values)
      this.setState({
        formValues: values,
        workDays: workDays
      });
      dispatch({
        type: 'customer/laodOffWorkUsers',
        payload: {workDayFrom:values.workDayFrom,workDayTo:values.workDayTo,status:'sign'},
      });
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    var defaultValue = new moment().add(1,"days");
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={20}>
          <FormItem label="用户姓名">
            {getFieldDecorator('username')(<Input placeholder="请输入" />)}
          </FormItem>
          </Col>
          <Col md={8} sm={24}>
          <FormItem label="用户手机">
            {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
          </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.openModal}>
                匹配
              </Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={48}>
          <FormItem label="工作日期">
              {getFieldDecorator('workDay', {
                initialValue: [defaultValue,defaultValue],
                rules: [{ required: true, message: '请输入工作日' }],
              })(
                <RangePicker
                  format={"YYYY-MM-DD"}
                />
          )}
          </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }

  match = (e) => {
    e.preventDefault();
    this.setState({
      modalVisible:true
    })
  }
  submit = (formData) => {
    this.closeModal();
    this.props.doMatch(formData);
  }
  openModal = () => {
    if(this.refs.userTables.state.selectedRowKeys.length === 0){
      notification.error({
        message: '提示',
        description: '请先选择用户再进行匹配',
      });
      return;
    }
    this.setState({
      modalVisible: true
    })
  }
  closeModal = () => {
    this.refs.userTables.setState({
      selectedRowKeys:[]
    })
    this.setState({
      modalVisible: false
    })
  }
  render() {
    const { customer: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = [
      {
        title: '会员编号',
        dataIndex: 'Id',
      },
      {
        title: '姓名',
        dataIndex: 'Username',
      },
      {
        title: '电话',
        dataIndex: 'Phone',
      },
      {
        title: '证件号码',
        dataIndex: 'IdCard',
      },
      {
        title: '是否申请',
        dataIndex: 'Matched.Valid',
        render:(value)=>{
          return value?'是':'否'
        }
      },
    ];

    return (
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              ref="userTables"
              rowKey="Id"
              selectedRows={selectedRows}
              enableSelect={true}
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <Modal
            title="配置操作"
            visible={this.state.modalVisible}
            footer={null}
            onOk={this.closeModal}
            onCancel={this.closeModal}
        >
          <UserMatchForm
            close={this.closeModal}
            address={this.props.project.projectAddress}
            timeSlot={this.props.project.projectTimeSlot}
            users={this.refs.userTables}
            workDays={this.state.workDays}
            submit={this.submit}
            />
        </Modal>
        </Card>
    );
  }
}
