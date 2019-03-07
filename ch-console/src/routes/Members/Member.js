import React, { PureComponent } from 'react';
import { Button, Col, Tabs, Form, Icon, Input, Row, Table } from 'antd';
import styles from './Member.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import {message} from "antd/lib/index";
import Common from "../../common/Common";

const Utils = new Common();
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const columns = [
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 150,
    render: text => <a href="javascript:">{text}</a>,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 150,
    render: text => <a href="javascript:">{text}</a>,
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: 150,
  },
  {
    title: '注册日期',
    dataIndex: 'createdDate',
  },
];

// 账户信息
const accountColumns = [
  {
    title: '账户',
    dataIndex: 'account',
    width: 150,
    render: text => <a href="javascript:">{text}</a>,
  },
  {
    title: '金额(元)',
    dataIndex: 'price',
  },
  {
    title: '操作',
    width: 150,
    render: () => {
      return (
        <div
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={() => {
            console.log(this);
          }}
        >
          <Icon type="edit" theme="outlined" />
        </div>
      );
    },
  },
];

const accountData = [
  {
    key: '1',
    account: '现金账户(元)',
    price: '0',
  },
  {
    key: '2',
    account: '积分账户(元)',
    price: '0.12',
  },
];

// 某会员订单数据列表
const orderColumns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 250,
  },
  {
    title: '创建时间',
    dataIndex: 'createdDate',
    width: 200,
  },
  {
    title: '金额(元)',
    dataIndex: 'amount',
    width: 150,
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    width: 150,
  },
  {
    title: '支付状态',
    dataIndex: 'payStatus',
    width: 150,
  },
  {
    title: '车牌号',
    dataIndex: 'carNo',
    width: 200,
  },
  {
    title: '泊位编码',
    dataIndex: 'parkNo',
    width: 150,
  },
  {
    title: '停车场',
    dataIndex: 'parkName',
    width: 200,
  },
  {
    title: '片区',
    dataIndex: 'parkArea',
    width: 200,
  },
];

// 某会员车辆信息数据列表
const carColumns = [
  {
    title: '车牌号',
    dataIndex: 'carno',
    // width: 150,
  },
  {
    title: '车架号',
    dataIndex: 'vin',
    // width: 150,
  },
  {
    title: '车型',
    dataIndex: 'model',
    // width: 150,
  },
  {
    title: '颜色',
    dataIndex: 'color',
    // width: 150,
  },
  {
    title: '品牌型号',
    dataIndex: 'brand',
    // width: 150,
  },
  {
    title: '车辆图片',
    dataIndex: 'pic',
    // width: 150,
    render: recod=> {
      let url;
      if (Utils.isNotNull(recod)) {
        url = recod.split(",")[0];
      } else {
        url = "";
      }
      return (
        <div style={{textAlign: 'center', height: 40}}>
          <div style={{display: Utils.isNotNull(url) ? 'block' : 'none'}}>
            <img src={url} style={{width: '36px', height: '36px'}}/>
          </div>

        </div>
      )

    }
  }

];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

@connect(({ member, parkingOrder, carManage, loading }) => ({
  member,
  parkingOrder,
  carManage,
  loading: loading.effects['member/fetch'],
  orderDataLoading: loading.effects['parkingOrder/fetchCustomerOrder'],
  carDataLoading: loading.effects['carManage/fetchCustomerCars'],
}))
@Form.create()
class Member extends PureComponent  {

  state = {
    selectedRows: {},
    selectedRowIndex: '',
    formValues: {},
    customerOrderData: {
      data: [],
      totalCount: 0,
    },
    customerCarData: {
      data: [],
      totalCount: 0,
    },
    page:{
      start:1,
      limit:10,
    },
    orderPage: {
      start:1,
      limit:10,
    },
    carPage: {
      start:1,
      limit:10,
    },
    currentPage: 1,
  };

  componentDidMount() {
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/fetch',
      payload: {
        page:this.state.page,
        ...this.state.formValues,
      },
      callback: response => {
        if(response.success) {

        } else {
          message.error('数据加载失败');
        }
      }
    });
    // 每次重新加载会员信息进行重置所有选中项
    this.resetSelected();
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        searchType: 'lk',
        page: {
          start: 1,
          limit: 10,
        },
      };

      dispatch({
        type: 'member/fetch',
        payload: values,
      });

      this.setState({
        formValues: fieldsValue,
        currentPage: 1,
      });

      this.resetSelected();
    });
  };

  selectClick = (item, index) => {
    const customerId = item.id;
    this.setState({
      selectedRows: item,
      selectedRowIndex: index,
    });

    this.getCustomerOrderDetail(customerId);
    this.getCustomerCarDetail(customerId);
  };

  // 设置选中颜色
  setClassName = (record, index) => {
    const {selectedRowIndex} = this.state;
    return (index === selectedRowIndex ? `${styles.color}` : '')
  };

  // 切换页码触发事件-会员信息表
  handleChange = (page) => {
    console.log(page, 'page');
    this.setState({
      page: {
        start: page.current,
        limit: page.pageSize,
      },
      currentPage: page.current,
    }, () => {
      this.getData();
    });
  };

  // 切换页码触发事件-订单明细表
  handleChangeOrderDataPage = (page) => {

    const customerId = this.state.selectedRows.id;

    console.log(page, 'page');
    this.setState({
      orderPage: {
        start: page.current,
        limit: page.pageSize,
      },
    }, () => {
      this.getCustomerOrderDetail(customerId);
    });
  };

  // 切换页码触发事件-车辆信息表
  handleChangeCarDataPage = (page) => {

    const customerId = this.state.selectedRows.id;

    console.log(page, 'page');
    this.setState({
      carPage: {
        start: page.current,
        limit: page.pageSize,
      },
    }, () => {
      this.getCustomerCarDetail(customerId);
    });
  };

  // 某人的订单明细
  getCustomerOrderDetail = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'parkingOrder/fetchCustomerOrder',
      payload: {
        customerId: key,
        page: this.state.orderPage,
      },
      callback: response => {
        if (!response.success) {
          message.error('订单数据查询失败');
        } else {
          this.setState({
            customerOrderData: response,
          })
        }
      }
    });
  };

  // 某人的车辆信息
  getCustomerCarDetail = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'member/fetchCustomerCars',
      payload: {
        customerId: key,
        page: this.state.carPage,
      },
      callback: response => {
        if (!response.success) {
          message.error('车辆数据查询失败');
        } else {
          this.setState({
            customerCarData: response,
          })
        }
      }
    });
  };

  // 重置选中项
  resetSelected = () => {
    this.setState({
      selectedRows: {},
      selectedRowIndex: '',
      customerOrderData: {
        data: [],
        totalCount: 0,
      },
      customerCarData: {
        data: [],
        totalCount: 0,
      },
      orderPage: {
        start:1,
        limit:10,
      },
      carPage: {
        start:1,
        limit:10,
      },
    });
  };

  renderSearchForm() {
    const { form } = this.props;
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };
    return (
      <div className={styles.searchItem}>
        <Form onSubmit={this.handleSearch}>
          <Row>
            <Col span={5}>
              <FormItem {...layout}>
                {form.getFieldDecorator('key', {})(<Input placeholder="昵称、手机号" />)}
              </FormItem>
            </Col>
            <Col span={4}>
              <Button style={{ marginTop: 5, marginLeft: -40 }} type="primary" htmlType="submit">
                搜索
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  render() {
    const {
      member: { memberData },
      loading,
      orderDataLoading,
      carDataLoading
    } = this.props;

    const { customerOrderData, customerCarData, currentPage } = this.state;

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: memberData.totalCount,
      current: currentPage,
      // pageSizeOptions: ['4', '8', '12'],
    };

    const orderPagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: customerOrderData.totalCount,
      // pageSizeOptions: ['4', '8', '12'],
    };

    const carPagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: customerCarData.totalCount,
      // pageSizeOptions: ['4', '8', '12'],
    };

    return (
      <PageHeaderLayout>
        <div className={styles.staffDiv}>
          <div>
            <div className={styles.staffInfoTable}>
              <div>{this.renderSearchForm()}</div>
              <Table
                loading={loading}
                // rowSelection={rowSelection}
                columns={columns}
                dataSource={memberData.data}
                rowKey={record => record.createdDate}
                bordered
                pagination={pagination}
                onChange={this.handleChange}
                // scroll={{ y: 300 }}
                rowClassName={this.setClassName}
                onRow={(text, index) => ({
                  onClick: () => {
                    this.selectClick(text, index);
                  },
                })}
              />
            </div>
          </div>

          <div className={styles.tabDiv}>
            <div className={styles.tabContainer}>
              <Tabs type="card">
                {/*<TabPane tab="账户信息" key="1">*/}
                  {/*<div>{this.renderSearchForm()}</div>*/}
                  {/*<Table*/}
                    {/*columns={accountColumns}*/}
                    {/*dataSource={this.state.selectedRows}*/}
                    {/*bordered*/}
                    {/*pagination={this.state.pagination}*/}
                    {/*onChange={this.handleChange}*/}
                    {/*scroll={{ y: 200 }}*/}
                  {/*/>*/}
                {/*</TabPane>*/}
                <TabPane tab="订单明细" key="2">
                  {/*<div>{this.renderSearchForm()}</div>*/}
                  <Table
                    // rowSelection={rowSelection}
                    loading={orderDataLoading}
                    columns={orderColumns}
                    dataSource={customerOrderData.data}
                    bordered
                    pagination={orderPagination}
                    onChange={this.handleChangeOrderDataPage}
                  />
                </TabPane>
                <TabPane tab="车辆信息" key="3">
                  {/*<div>{this.renderSearchForm()}</div>*/}
                  <Table
                    // rowSelection={rowSelection}
                    loading={carDataLoading}
                    columns={carColumns}
                    dataSource={customerCarData.data}
                    bordered
                    pagination={carPagination}
                    onChange={this.handleChangeCarDataPage}
                  />
                </TabPane>

                {/*<TabPane tab="优惠券" key="4">*/}
                  {/*<div>{this.renderSearchForm()}</div>*/}
                  {/*<Table*/}
                    {/*// rowSelection={rowSelection}*/}
                    {/*columns={columns}*/}
                    {/*dataSource={data.list}*/}
                    {/*bordered*/}
                    {/*pagination={this.state.pagination}*/}
                    {/*onChange={this.handleChange}*/}
                    {/*scroll={{ y: 300 }}*/}
                  {/*/>*/}
                {/*</TabPane>*/}
              </Tabs>
            </div>
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default Member;
