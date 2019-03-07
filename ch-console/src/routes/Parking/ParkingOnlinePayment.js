import { Button, Col, Form, Icon, Input, Row, Table, Modal, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ParkingOnlinePayment.less';
import { connect } from 'dva';
import Common from '../../common/Common';

const FormItem = Form.Item;
// const Option = Select.Option;  // 选择
const Utils = new Common();

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleUpdate,
    handleModalVisible,
    formType,
    selectedRows,
  } = props;
  // console.log(selectedRows);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // 新增
      if (formType === 'add') {
        handleAdd(fieldsValue);
        form.resetFields();
      } else if (formType === 'update') {
        const params = fieldsValue;
        // 修改
        handleUpdate(params);
        form.resetFields();
      }
    });
  };
  const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
  return (
    <Modal
      title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
      width={900}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      maskClosable={false}
      destroyOnClose={true}
    >
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="支付订单号">
            {form.getFieldDecorator('payNumber', {
              rules: [{ required: true, message: '请输入支付订单号' }],
              initialValue: Utils.isNotNull(selectedRows.payNumber) ? selectedRows.payNumber : '',
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={10} style={{ marginLeft: 10 }}>
          <FormItem {...formItemLayout} label="支付发起时间">
            {form.getFieldDecorator('paymentInitiationTime', {
              rules: [{ required: true, message: '请输入支付发起时间' }],
              initialValue: Utils.isNotNull(selectedRows.paymentInitiationTime)
                ? selectedRows.paymentInitiationTime
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="金额">
            {form.getFieldDecorator('amount', {
              rules: [{ required: true, message: '请输入订单金额' }],
              initialValue: Utils.isNotNull(selectedRows.amount) ? selectedRows.amount : '',
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={10} style={{ marginLeft: 10 }}>
          <FormItem {...formItemLayout} label="支付平台">
            {form.getFieldDecorator('payPlatform', {
              rules: [{ required: true, message: '请选择支付平台' }],
              initialValue: Utils.isNotNull(selectedRows.payPlatform)
                ? selectedRows.payPlatform
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="支付结果">
            {form.getFieldDecorator('paymentResult', {
              rules: [{ required: true, message: '请选择支付结果' }],
              initialValue: Utils.isNotNull(selectedRows.paymentResult)
                ? selectedRows.paymentResult
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={10} style={{ marginLeft: 10 }}>
          <FormItem {...formItemLayout} label="支付成功时间">
            {form.getFieldDecorator('paymentSuccessTime', {
              rules: [{ required: true, message: '请输入支付成功时间' }],
              initialValue: Utils.isNotNull(selectedRows.paymentSuccessTime)
                ? selectedRows.paymentSuccessTime
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="订单号">
            {form.getFieldDecorator('orderNumber', {
              rules: [{ required: true, message: '请输入订单号' }],
              initialValue: Utils.isNotNull(selectedRows.orderNumber)
                ? selectedRows.orderNumber
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={10} style={{ marginLeft: 10 }}>
          <FormItem {...formItemLayout} label="泊位编码">
            {form.getFieldDecorator('berthCode', {
              rules: [{ required: true, message: '请输入泊位编码' }],
              initialValue: Utils.isNotNull(selectedRows.berthCode) ? selectedRows.berthCode : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="视屏桩编码">
            {form.getFieldDecorator('videoPileCode', {
              rules: [{ required: true, message: '请输入视屏桩编码' }],
              initialValue: Utils.isNotNull(selectedRows.videoPileCode)
                ? selectedRows.videoPileCode
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={10} style={{ marginLeft: 10 }}>
          <FormItem {...formItemLayout} label="片区">
            {form.getFieldDecorator('area', {
              rules: [{ required: true, message: '请选择片区' }],
              initialValue: Utils.isNotNull(selectedRows.area) ? selectedRows.area : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="车牌号">
            {form.getFieldDecorator('licensePlateNumber', {
              rules: [{ required: true, message: '请输入车牌号' }],
              initialValue: Utils.isNotNull(selectedRows.licensePlateNumber)
                ? selectedRows.licensePlateNumber
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

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

@connect(({ parkingOnlinePayment, loading }) => ({
  parkingOnlinePayment,
  loading: loading.models.parkingOnlinePayment,
}))
@Form.create()
export default class Operational extends React.Component {
  state = {
    modalVisible: false,
    formType: '',
    selectedRowIndex: '',
    selectedRows: '',
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
      type: 'parkingOnlinePayment/fetch',
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


  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={12}>
            <FormItem label="搜索条件">
              {getFieldDecorator('key')(<Input placeholder="订单号，交易金额，泊位编码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 选中行
  selectRow = (record, index) => {
    this.setState({
      selectedRowIndex: index,
      selectedRows: record,
      selectedRowKeys: record.id,
    });
  };

  // 设置选择样式
  setClassName = (record, index) => {
    const {selectedRowIndex} = this.state;
    return (index === selectedRowIndex ? `${styles.color}` : '')
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
        type: 'parkingOnlinePayment/fetch',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });
      this.setState({
        currentPage: 1,
        formValues: {
          ...fieldsValue,
        }
      })
    });

    this.resetSelectedRow();
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      selectedRows: {},
      formType: 'add',
    });
  };

  /**
   * 修改
   */
  updateRecord = text => {
    this.doubleClick(text);
  };

  /**
   * 双击事件
   */
  doubleClick = text => {
    this.setState({
      modalVisible: true,
      selectedRows: text,
      formType: 'update',
    });
  };

  // 添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'parkingOnlinePayment/add',
      payload: {
        formItem: fields,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  // 修改操作
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'parkingOnlinePayment/update',
      payload: {
        formItem: fields,
      },
    });

    message.success('修改成功');
    this.setState({
      modalVisible: false,
    });
  };

  // 删除框
  deleteConfirm = currentItem => {
    Modal.confirm({
      title: '删除任务',
      content: '确定删除该记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleRemove(currentItem.key),
    });
  };

  // 删除
  handleRemove = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'parkingOnlinePayment/remove',
      payload: {
        key: key,
      },
      callback: () => {
        this.setState({
          selectedRows: {},
        });
      },
    });
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

  // 重置选择状态
  resetSelectedRow = () => {
    this.setState({
      selectedRowIndex: '',
      selectedRows: {},
    });
  };

  render() {
    const {
      parkingOnlinePayment: { parkingOnlinePaymentData },
      loading,
    } = this.props;
    const { modalVisible, currentPage } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      formType: this.state.formType,
      selectedRows: this.state.selectedRows,
    };

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: parkingOnlinePaymentData.totalCount,
      // pageSizeOptions: ['10', '15', '20'],
      current: currentPage,
    };

    const columns = [
      {
        title: '支付订单号',
        dataIndex: 'transactionId',
        width: 300,
      },
      {
        title: '订单号',
        dataIndex: 'orderNo',
      },
      {
        title: '支付发起时间',
        dataIndex: 'createdDate',
        width: 200,
        render: record => {
          return Utils.formatDate(record);
        }
      },
      {
        title: '金额(元)',
        dataIndex: 'amount',
        width: 100,
      },
      {
        title: '支付平台',
        dataIndex: 'payPlatform',
        width: 150,
      },
      {
        title: '支付状态',
        dataIndex: 'status',
        width: 100,
      },
      {
        title: '支付成功时间',
        dataIndex: 'lastModifiedDate',
        width: 200,
        render: record => {
          return Utils.formatDate(record);
        }
      },
      // {
      //   title: '操作',
      //   key: 'operation',
      //   fixed: 'right',
      //   width: 100,
      //   render: text => (
      //     <div>
      //       <div className={styles.editButton}>
      //         <Icon type="edit" onClick={() => this.updateRecord(text)} />
      //       </div>
      //       <div className={styles.editButton}>
      //         <Icon type="delete" onClick={() => this.deleteConfirm(text)} />
      //       </div>
      //     </div>
      //   ),
      // },
    ];

    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.buttonDiv}>
            {/*<div className={styles.buttonFrom}>*/}
              {/*<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>*/}
                {/*新增*/}
              {/*</Button>*/}
            {/*</div>*/}
            <div className={styles.table}>
              <Table
                loading={loading}
                columns={columns}
                dataSource={parkingOnlinePaymentData.data}
                // rowKey={record => record.orderNo}
                bordered
                pagination={pagination}
                onChange={this.handleChange}
                rowClassName={this.setClassName}
                onRow={(record, index) => ({
                  onClick: () => this.selectRow(record, index),
                  // onDoubleClick: () => {
                  //   this.doubleClick(record);
                  // },
                })}
              />
            </div>
          </div>
        </div>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
