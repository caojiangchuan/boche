import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Row, Table, Tabs } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ParkingOrder.less';
import {message} from "antd/lib/index";
import Common from '../../common/Common'
import {dutyStatus} from "../../common/Enum";

const Utils = new Common();
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

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

@connect(({ parkingOrder, loading }) => ({
  parkingOrder,
  parkingOrderLoading: loading.effects['parkingOrder/fetch'],
  parkingOrderDetailLoading: loading.effects['parkingOrder/fetchOrderDetail'],
}))
@Form.create()
export default class ParkingOrder extends PureComponent {
  state = {
    modalVisible: false,
    selectedRowIndex: '',
    selectedRows: [],
    orderDetail: [],
    paymentData: [], //结算信息
    formValues: {},
    page:{
      start:1,
      limit:10,
    },
    totalCount: '',
    currentPage: 1,
  };

  componentDidMount() {
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'parkingOrder/fetch',
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
  };

  /**
   * 搜索
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        page: {
          start: 1,
          limit: 10,
        },
        searchType: 'lk',
      };

      dispatch({
        type: 'parkingOrder/fetch',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });

      this.resetSelectedRow();

      this.setState({
        currentPage: 1,
        formValues: {
          ...fieldsValue,
        }
      });

    });
  };

  // 选中行
  selectRow = (record, index) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'parkingOrder/fetchOrderDetail',
      payload: record.id,
      callback: response => {
        if (!response.success) {
          message.error('数据查询失败');
        } else {
          console.log(response);
          this.setState({
            paymentData: response.data,
          });
        }
      }
    });
    const list = [];
    list.push(record);
    this.setState({
      selectedRowIndex: index,
      selectedRows: record,
      orderDetail: list,
    });
  };

  setClassName = (record, index) => {
    const {selectedRowIndex} = this.state;
    return (index === selectedRowIndex ? `${styles.color}` : '')
  };

  // 切换页码触发事件
  handleChange = (page) => {
    this.setState({
      page: {
        start: page.current,
        limit: page.pageSize,
      },
      currentPage: page.current,
    }, () => {
      this.getData();
    });
    this.resetSelectedRow();
  };

  resetSelectedRow = () => {
    this.setState({
      selectedRowIndex: '',
      orderDetail: [],
      paymentData: [],
    });
  };

  renderSearchForm() {
    const { form } = this.props;
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };
    return (
      <div className={styles.searchItem}>
        <Form onSubmit={this.handleSearch}>
          <Row>
            <Col span={6}>
              <FormItem {...layout}>
                {form.getFieldDecorator('key', {})(
                  <Input placeholder="订单号，支付号，支付平台，车牌号" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <Button style={{ marginTop: 5 }} type="primary" htmlType="submit">
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
      parkingOrder: { parkingOrderData },
      parkingOrderLoading,
      parkingOrderDetailLoading
    } = this.props;

    // 订单信息
    const orderColumns = [
      {
        title: '订单号',
        dataIndex: 'orderNo',
        width: 200,
      },
      {
        title: '车牌号',
        dataIndex: 'carNo',
        width: 200,
      },
      {
        title: '泊位编号',
        dataIndex: 'parkNo',
        width: 200,
      },
      {
        title: '泊入时间',
        dataIndex: 'createdDate',
        width: 200,
        render:Utils.formatDate
      },
      {
        title: '停车场',
        dataIndex: 'parkName',
        width: 200,
      },
      {
        title: '金额(元)',
        dataIndex: 'amount',
        width: 100,
        // render: (text) => {
        //   return `${Utils.isNotNull(text) ? text : 0 }元`;
        // }
      },
      {
        title: '订单确认',
        dataIndex: 'confirmed',
        width: 100,
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        width: 100,
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        width: 100,
      },
    ];

    // 订单详细信息
    const accountColumns = [
      {
        title: '名称',
        dataIndex: 'orderName',
        width: 200,
      },
      {
        title: '用户名称',
        dataIndex: 'customerName',
        width: 200,
      },
      {
        title: '金额(元)',
        dataIndex: 'amount',
        width: 100,
        // render: (text) => {
        //   return `${Utils.isNotNull(text) ? text : 0 }元`;
        // }
      },
      {
        title: '泊位号',
        dataIndex: 'parkNo',
        width: 150,
      },
      {
        title: '设备编号',
        dataIndex: 'deviceno',
        width: 150,
      },
      {
        title: '片区',
        dataIndex: 'parkArea',
        width: 150,
      },
      {
        title: '车牌号',
        dataIndex: 'carNo',
        width: 150,
      },
      {
        title: '停车时间',
        dataIndex: 'createdDate',
        width: 200,
        render:Utils.formatDate
      },
      {
        title: '离开时间',
        dataIndex: 'leaveDate',
        width: 150,
        render:Utils.formatDate
      },
    ];

    const settlementColumns = [
      {
        title: '支付订单号',
        dataIndex: 'transactionId',
        width: 200,
      },
      {
        title: '支付发起时间',
        dataIndex: 'createdDate',
        width: 200,
        render:Utils.formatDate
      },
      {
        title: '金额(元)',
        dataIndex: 'amount',
        width: 200,
        // render: (text) => {
        //   return `${Utils.isNotNull(text) ? text : 0 }元`;
        // }
      },
      {
        title: '支付平台',
        dataIndex: 'payPlatform',
        width: 200,
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        width: 200,
      },
    ];

    const { currentPage } = this.state;

    const pagination = {
      showQuickJumper: true,
      defaultPageSize: 10,
      total: parkingOrderData.totalCount,
      current: currentPage,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.containerDiv}>
            <div>
              <div className={styles.containerInfoTable}>
                <div>{this.renderSearchForm()}</div>
                <Table
                  loading={parkingOrderLoading}
                  // rowSelection={rowSelection}
                  columns={orderColumns}
                  dataSource={parkingOrderData.data}
                  bordered
                  pagination={pagination}
                  onChange={this.handleChange}
                  // scroll={{ x: 800, y: 300 }}
                  rowClassName={this.setClassName}
                  rowKey={record => record.id}
                  onRow={(record, index) => ({
                    onClick: () => this.selectRow(record, index),
                  })}
                />
              </div>
            </div>

            <div className={styles.tabDiv}>
              <div className={styles.tabContainer}>
                <Tabs type="card">
                  <TabPane tab="订单信息" key="1">
                    <div>
                      {/*<div className={styles.searchItem}>*/}
                        {/*<Button style={{ marginTop: 5 }} type="primary" htmlType="submit">*/}
                          {/*搜索*/}
                        {/*</Button>*/}
                      {/*</div>*/}
                    </div>
                    <Table
                      // loading={parkingOrderDetailLoading}
                      // rowSelection={rowSelection}
                      columns={accountColumns}
                      dataSource={this.state.orderDetail}
                      bordered
                      scroll={{ x: 1200, y: 300 }}
                    />
                  </TabPane>
                  <TabPane tab="结算信息" key="2">
                    <div>
                      {/*<div className={styles.searchItem}>*/}
                        {/*<Button style={{ marginTop: 5 }} type="primary" htmlType="submit">*/}
                          {/*搜索*/}
                        {/*</Button>*/}
                      {/*</div>*/}
                    </div>
                    <Table
                      loading={parkingOrderDetailLoading}
                      columns={settlementColumns}
                      dataSource={this.state.paymentData}
                      bordered
                      scroll={{ x: 1200, y: 300 }}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
