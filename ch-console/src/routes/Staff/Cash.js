import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, InputNumber, Button, Modal, message, Tabs, Table } from 'antd';
import StandardTable from '../../components/CashManageTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Common from "../../common/Common";
import { dutyStatus, employeeType } from '../../common/Enum';

import styles from './Cash.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Utils = new Common();
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CashRechargeForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, cancelModalVisible, selectedEmployeeRow, currentUser } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.employeeid = selectedEmployeeRow.id;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="现金充值"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        form.resetFields();
        cancelModalVisible();
      }}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话">
        {form.getFieldDecorator('tel', {
          initialValue: selectedEmployeeRow.tel,
        })(<Input disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('name', {
          initialValue: selectedEmployeeRow.name,
        })(<Input disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作人">
        {form.getFieldDecorator('createby', {
          initialValue: Utils.isNotNull(currentUser.name)?currentUser.name : '',
        })(<Input disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作时间">
        {form.getFieldDecorator('createtime', {
          initialValue: Utils.formatDate(new Date()),
        })(<Input disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="充值金额">
        {form.getFieldDecorator('cash', {
          rules: [{ required: true, message: '请输入充值金额', }],
        })(<InputNumber style={{width: 295}} placeholder="单位为分" min={0} />)}
      </FormItem>
      {/*<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实收金额">*/}
        {/*{form.getFieldDecorator('paidAmount', {*/}
          {/*rules: [{ required: true, message: '请输入实收金额' }],*/}
          {/*// initialValue: selectedRowsDetail.paidAmount,*/}
        {/*})(<Input placeholder="单位为分" />)}*/}
      {/*</FormItem>*/}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('note', {
          rules: [{ required: true, message: '请说点什么' }],
          // initialValue: selectedRowsDetail.desc,
        })(<Input placeholder="说点什么" />)}
      </FormItem>
    </Modal>
  );
});

const UpdateCashForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, cancelModalVisible, selectedCashDetailRow } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.id = selectedCashDetailRow.id;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  return (
    <Modal
      title="修改金额"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => cancelModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="修改金额">
        {form.getFieldDecorator('cash', {
          rules: [{ required: true, message: '请输入金额', }],
          initialValue: selectedCashDetailRow.cash,
        })(<InputNumber style={{width: 295}} placeholder="单位为分" min={0} />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ cash, loading }) => ({
  cash,
  employeeDataLoading: loading.effects['cash/fetchEmployeeCash'],
  cashDetailDataLoading: loading.effects['cash/fetchCashDetail'],
}))
@Form.create()
export default class Cash extends PureComponent {
  state = {
    cashRechargeModalVisible: false,
    cashDetailModalVisible: false,
    expandForm: false,
    cashDetailData: {
      data: [],
      totalCount: '',
    },
    // 选中的巡检人员编号
    selectedEmployeeRowKeys: '',
    // 选中的充值明细编号
    // selectedCashDetailRowKeys: '',
    selectedEmployeeRow: {},
    selectedCashDetailRow: {},
    selectedEmployeeRowIndex: '',
    selectedCashDetailRowIndex: '',
    employeeFormValues: {},
    cashDetailFormValues: {},
    formType: '',
    employeePage:{
      start:1,
      limit:10,
    },
    currentPage: 1,
    cashDetailPage: {
      start:1,
      limit:4,
    },

    currentUser: {},
  };

  componentDidMount() {
    const {dispatch} = this.props;
    this.getEmployeeData();

    let response = {};
    response = JSON.parse(sessionStorage.getItem("currentUser"));
    this.setState({
      currentUser: response,
    });
  }

  //加载数据
  getEmployeeData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'cash/fetchEmployeeCash',
      payload: {
        page:this.state.employeePage,
        ...this.state.employeeFormValues,
      },
      callback: response => {
        if(response.success) {

        } else {
          message.error('数据加载失败');
        }
      }
    });
  };

  // 选中行-选中巡检员信息表中的数据
  selectEmployeeRow = (record, index) => {
    const employeeid = record.id;
    this.setState({
      selectedEmployeeRowIndex: index,
      selectedEmployeeRow: record,
      // 设置选中的巡检人员id以供明细分页查询时使用
      selectedEmployeeRowKeys: employeeid,
      selectedCashDetailRowIndex: '',
    });
    // 查询信息
    this.getEmployeeCashDetail(employeeid);
  };

  // 设置选择样式-选中充值历史表中的数据
  setEmployeeRowClassName = (record, index) => {
    const {selectedEmployeeRowIndex} = this.state;
    return (index === selectedEmployeeRowIndex ? `${styles.color}` : '')
  };

  // 选中行-选中充值明细表中的数据
  selectCashDetailRow = (record, index) => {
    this.setState({
      selectedCashDetailRowIndex: index,
      selectedCashDetailRow: record,
      // selectedCashDetailRowKeys: record.id,
    });
  };

  // 设置选择样式-选中充值明细表中的数据
  setCashDetailRowClassName = (record, index) => {
    const {selectedCashDetailRowIndex} = this.state;
    return (index === selectedCashDetailRowIndex ? `${styles.color}` : '')
  };

  // 巡检人员信息查询
  handleEmployeeSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        page: this.state.employeePage,
      };

      dispatch({
        type: 'cash/fetchEmployeeCash',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });

      this.setState({
        employeeFormValues: {
          ...fieldsValue,
        },
        currentPage: 1,
        // 清空选中项
        selectedEmployeeRow: {},
        selectedCashDetailRow: {},
        selectedEmployeeRowIndex: '',
        selectedCashDetailRowIndex: '',
        // 充值充值明细数据
        cashDetailData:{},
      });
    });
  };

  // 充值详细信息查询
  handleCashDetailSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      // if (err) return;
      //
      // const values = {
      //   name: fieldsValue.detailName,
      //   page: this.state.page,
      // };
      //
      // this.setState({
      //   cashDetailFormValues: values,
      // });

      // dispatch({
      //   type: 'cash/fetchEmployeeCash',
      //   payload: values,
      //   callback: response => {
      //     if (!response.success) {
      //       message.error('数据查询失败');
      //     }
      //   }
      // });
    });
  };

  // 某人的详细充值明细
  getEmployeeCashDetail = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cash/fetchCashDetail',
      payload: {
        id: key,
        page: this.state.cashDetailPage,
      },
      callback: response => {
        if (!response.success) {
          message.error('数据查询失败');
        } else {
          this.setState({
            cashDetailData: response,
          })
        }
      }
    });
  };


  // 现金充值
  recharge = () => {
    if (Utils.isNotNull(this.state.selectedEmployeeRowIndex)) {
      this.cashRechargeDoubleClick(this.state.selectedEmployeeRow);
    } else {
      message.error('您还没有选择要充值的选项，请先选择');
    }
  };

  // 修改金额
  updateCash = () => {
    if (Utils.isNotNull(this.state.selectedCashDetailRowIndex)) {
      this.updateCashDoubleClick(this.state.selectedCashDetailRow);
    } else {
      message.error('您还没有选择要充值的选项，请先选择');
    }
  };

  /**
   * 双击事件-充值历史表-打开现金充值输入框
   */
  cashRechargeDoubleClick = text => {
    console.log(text);
    console.log(new Date())
    this.setState({
      cashRechargeModalVisible: true,
      selectedEmployeeRow: text,
    });
  };

  /**
   * 双击事件-充值详情表-修改金额操作-打开修改金额输入框
   */
  updateCashDoubleClick = text => {
    console.log(text);
    this.setState({
      cashDetailModalVisible: true,
      selectedEmployeeRow: text,
    });
  };

  // 关闭模态框
  cancelModalVisible = () => {
    this.setState({
      cashRechargeModalVisible: false,
      cashDetailModalVisible: false,
    });
  };

  // 进行现金充值
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cash/cashRecharge',
      payload: fields,
      callback: (response) => {
        if (response.success){
          this.setState({
            page: {
              start: 1,
              limit: this.state.employeePage.limit,
            }
          }, this.getEmployeeData);
          this.getEmployeeCashDetail(fields.employeeid);
          message.success('充值成功');
        } else {
          message.error('充值失败');
        }
      },
    });
    this.setState({
      cashRechargeModalVisible: false,
    });
  };

  // 进行金额修改操作
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cash/updateCash',
      payload: fields,
      callback: (response) => {
        if (response.success){
          this.setState({
            page: this.state.cashDetailPage,
          });
          this.getEmployeeCashDetail(this.state.selectedEmployeeRowKeys);
          this.getEmployeeData();
          message.success('修改成功');
        } else {
          message.error('充修改败');
        }
      },
    });
    this.setState({
      cashDetailModalVisible: false,
    });
  };

  // 切换页码触发事件-巡检人员表
  handleEmployeeChange = (page) => {
    this.resetSelected();
    this.setState({
      employeePage: {
        start: page.current,
        limit: page.pageSize,
      },
      currentPage: page.current,
    }, () => {
      this.getEmployeeData();
    });
  };

  // 切换页码触发事件-充值明细数据表
  handleCashDetailChange = (page) => {
    this.setState({
      // 清空选中的充值明细项
      selectedCashDetailRow: {},
      selectedCashDetailRowIndex: '',
      cashDetailPage: {
        start: page.current,
        limit: page.pageSize,
      }
    }, () => {
      this.getEmployeeCashDetail(this.state.selectedEmployeeRowKeys);
    });
  };

  // 清空所有选中项
  resetSelected = () => {
    this.setState({
      selectedEmployeeRow: {},
      selectedCashDetailRow: {},
      selectedEmployeeRowIndex: '',
      selectedCashDetailRowIndex: '',
      employeeFormValues: {},
      cashDetailFormValues: {},
      cashDetailData:{},
    });
  };

  renderSearchForm() {
    const { form } = this.props;
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };
    return (
      <Form onSubmit={this.handleEmployeeSearch}>
        <Row>
          <Col span={6}>
            <FormItem {...layout}>
              {form.getFieldDecorator('name', {})(<Input placeholder="姓名" />)}
            </FormItem>
          </Col>
          <Col span={8} style={{ marginTop: 4, marginLeft: '-4%' }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              type="primary"
              onClick={() => this.recharge()}
            >
              充值
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  renderSearchDetailForm() {
    const { form } = this.props;
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };

    return (
      <Form onSubmit={this.handleCashDetailSearch}>
        <Row>
          {/*<Col span={6}>*/}
            {/*<FormItem {...layout}>*/}
              {/*{form.getFieldDecorator('detailName', { })(<Input placeholder="姓名" />)}*/}
            {/*</FormItem>*/}
          {/*</Col>*/}
          <Col span={8} style={{ marginTop: 4 }}>
            {/*<Button type="primary" htmlType="submit">*/}
              {/*搜索*/}
            {/*</Button>*/}
            <Button
              style={{ marginLeft: 10 }}
              type="primary"
              onClick={() => this.updateCash()}
            >
              {/*修改金额{Utils.isNotNull(this.state.currentUser.name) ? `（${this.state.currentUser.name}）` : ''}*/}
              修改金额（管理员）
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      cash: { employeeCashData },
      employeeDataLoading,
      cashDetailDataLoading
    } = this.props;

    const { cashRechargeModalVisible, cashDetailModalVisible, cashDetailData, currentUser, currentPage } = this.state;

    // 人员列表
    const historyColumns = [
      {
        title: '电话',
        dataIndex: 'tel',
        width: 150,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        width: 150,
      },
      {
        title: '职务',
        dataIndex: 'title',
        width: 150,
      },
      {
        title: '在职状态',
        dataIndex: 'dutystatus',
        width: 150,
        render: (text) => {
          return Utils.getStatusName(text, dutyStatus);
        }
      },
      {
        title: '运营类型',
        dataIndex: 'type',
        width: 150,
        render: (text) => {
          return Utils.getStatusName(text, employeeType);
        }
      },
      {
        title: '余额(元)',
        dataIndex: 'cash',
        width: 150,
        // render: (text) => {
        //   return `${Utils.isNotNull(text) ? text : 0 }元`;
        // }
      },
    ];

    // 充值明细
    const detailColumns = [
      {
        title: '电话',
        dataIndex: 'tel',
        width: 150,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '操作时间',
        dataIndex: 'createtime',
        width: 200,
      },
      {
        title: '操作人',
        dataIndex: 'createby',
        width: 150,
      },
      {
        title: '充值金额(元)',
        dataIndex: 'cash',
        width: 150,
        // render: (text) => {
        //   return `${Utils.isNotNull(text) ? text : 0 }元`;
        // }
      },
      {
        title: '备注',
        dataIndex: 'note',
      },
    ];

    const employeeParentMethods = {
      handleAdd: this.handleAdd,
      cancelModalVisible: this.cancelModalVisible,
      selectedEmployeeRow: this.state.selectedEmployeeRow,
      currentUser: currentUser,
    };

    const employeePagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: employeeCashData.totalCount,
      current: currentPage,
      // pageSizeOptions: ['10', '15', '20'],
    };

    const cashDetailMethods = {
      cancelModalVisible: this.cancelModalVisible,
      selectedCashDetailRow: this.state.selectedCashDetailRow,
      handleUpdate: this.handleUpdate,
    };

    const cashDetailPagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: cashDetailData.totalCount,
      // pageSizeOptions: ['4', '8', '16'],
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.buttonDiv}>
              {/*<div className={styles.buttonFrom}>{this.renderSearchForm()}</div>*/}
              <div>{this.renderSearchForm()}</div>
              <div className={styles.table}>
                <Table
                  loading={employeeDataLoading}
                  columns={historyColumns}
                  rowKey={record => record.id}
                  dataSource={employeeCashData.data}
                  bordered
                  pagination={employeePagination}
                  onChange={this.handleEmployeeChange}
                  // scroll={{ x: 1600, y: 300 }}
                  rowClassName={this.setEmployeeRowClassName}
                  onRow={(record, index) => ({
                    onClick: () => this.selectEmployeeRow(record, index),
                    // onDoubleClick: () => {
                    //   this.cashRechargeDoubleClick(record);
                    // },
                  })}
                />
              </div>
            </div>
          </div>
          <div className={styles.tableList}>
            <Tabs type="card">
              <TabPane tab="充值明细" key="1">
                {/*<div className={styles.buttonFrom}>{this.renderSearchDetailForm()}</div>*/}
                <div>{this.renderSearchDetailForm()}</div>
                <div className={styles.table}>
                  <Table
                    loading={cashDetailDataLoading}
                    columns={detailColumns}
                    rowKey={record => record.id}
                    dataSource={cashDetailData.data}
                    bordered
                    pagination={cashDetailPagination}
                    onChange={this.handleCashDetailChange}
                    // scroll={{ x: 1600, y: 300 }}
                    rowClassName={this.setCashDetailRowClassName}
                    onRow={(record, index) => ({
                      onClick: () => this.selectCashDetailRow(record, index),
                      onDoubleClick: () => {
                        this.updateCashDoubleClick(record);
                      },
                    })}
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
        <CashRechargeForm {...employeeParentMethods} modalVisible={cashRechargeModalVisible} />
        <UpdateCashForm {...cashDetailMethods} modalVisible={cashDetailModalVisible}/>
      </PageHeaderLayout>
    );
  }
}
