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
  Menu,
  Modal,
  message,
  Badge,
  Divider
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './NoticeList.less';
const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// 连接model层的state数据，然后通过this.props.state名(namespace)访问model层的state数据
@connect(({ notices, loading }) => ({
  notices,
  loading: loading.models.notices,
}))
@Form.create()
export default class NoticesList extends PureComponent {
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
      type: 'notices/fetch',
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
      type: 'notices/fetch',
      payload: params,
    });
  };

  /**
   * 新增公告
   */
  handleAdd = () => {
    const { dispatch } = this.props;
    // 触发action触发model层的state的初始化
    dispatch({
      type: 'notices/add',
      payload: {},
    });
  };

  handleEdit = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    console.log(selectedRows.map(row => row.no).join(','));
    // 触发action触发model层的state的初始化
    dispatch({
      type: 'notices/routeToEdit',
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
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button style={{}} type="primary" onClick={this.handleAdd}>
                发公告
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
    const options = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="edit">修改</Menu.Item>
        <Menu.Item key="delete">删除</Menu.Item>
      </Menu>
    );
    const {
      notices: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'Id',
      },
      {
        title: '标题',
        dataIndex: 'Title',
      },
      {
        title: '时间',
        dataIndex: 'CreateTime',
      },

      {
        title: '作者',
        dataIndex: 'CreateBy',
      },
      {
        title: '状态',
        dataIndex: 'Status',
        render: val => {
          if (val === 'subscribe') {
            return '关注';
          } else if (val === 'register') {
            return '注册';
          } else if (val === 'sign') {
            return '签约';
          }
        },
      },
      {
        title: '操作',
        // render:(value, row) =>(
        //   <Dropdown overlay={options}>
        //     <Button style={{ border: 'none' }}>
        //       <Icon style={{ marginRight: 2 }} type="bars" />
        //       <Icon type="down" />
        //     </Button>
        //   </Dropdown>
        // ),
        render: (value, row) => (
          <Fragment>
            <a
              onClick={e => {
                e.preventDefault();
                this.props.dispatch({
                  type: 'notices/routeToEdit',
                  payload: row,
                });
              }}
              href=""
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={this.deleteNotice}
              href=""
            >
              删除
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
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
