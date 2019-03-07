import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
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
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './ProjectList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

@connect(({project, loading }) => ({
  project,
  loading: loading.models.project,
}))
@Form.create()
export default class ProjectList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    var params = this.props.location.params;
    var formData = {}
    if(params){
      formData.enterpriseName = params.Name
    }
    const { dispatch } = this.props;
    this.props.form.setFieldsValue(formData)
    dispatch({
      type: 'project/fetch',
      payload: formData
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
      type: 'project/fetch',
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
      type: 'project/fetch',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'project/fetch',
        payload: values,
      });
    });
  };
  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/add',
      payload: {},
    });
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="企业名称">
              {getFieldDecorator('enterpriseName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 32 }} type="primary" onClick={this.handleAdd}>
                新增
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
    const { project: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: '项目ID',
        dataIndex: 'Id',
      },
      {
        title: '项目名称',
        dataIndex: 'Name',
      },
      {
        title: '企业名称',
        dataIndex: 'EnterpriseName',
      },
      {
        title: '用工计划',
        dataIndex: 'RequireQuantity',
      },
      {
        title: '时薪',
        dataIndex: 'PriceOfPreHour',
        render:(value)=>{
          return value + '元/小时'
        }
      },
      {
        title: '状态',
        dataIndex: 'Status',
        render:(status)=>{
          if(status == 0){
            return '正常'
          }else {
            return '关闭'
          }
        }
      },
      {
        title: '创建时间',
        dataIndex: 'CreateTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
        title: '操作',
        fixed: 'right',
        width: 160,
        render: (value,row) => (
          <Fragment>
            <a onClick={(e) => {
              e.preventDefault()
              this.props.dispatch({
                type: 'project/routeToEdit',
                payload: row,
              });
            }} href="">编辑</a>
            <Divider type="vertical" />
            <a onClick={(e)=>{
              e.preventDefault()
              this.props.dispatch({
                type: 'project/routeToUserMatch',
                payload: row,
              });
            }} href="">排班</a>
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
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
