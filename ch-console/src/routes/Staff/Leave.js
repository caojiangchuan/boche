import { Button, Col, Form, Icon, Input, Row, Table, Modal, message, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Leave.less';
import { connect } from 'dva';
import Common from '../../common/Common';
import React from "react";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
          <FormItem {...formItemLayout} label="请假人">
            {form.getFieldDecorator('leavePeople', {
              rules: [{ required: true, message: '请输选择请假人' }],
              initialValue: Utils.isNotNull(selectedRows.leavePeople) ? selectedRows.leavePeople : '',
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={10} style={{ marginLeft: 10 }}>
          <FormItem {...formItemLayout} label="开始时间">
            {form.getFieldDecorator('startTime', {
              rules: [{ required: true, message: '请输入开始时间' }],
              initialValue: Utils.isNotNull(selectedRows.startTime)
                ? selectedRows.startTime
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="结束时间">
            {form.getFieldDecorator('endTime', {
              rules: [{ required: true, message: '请输入结束时间' }],
              initialValue: Utils.isNotNull(selectedRows.endTime) ? selectedRows.endTime : '',
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={10} style={{ marginLeft: 10 }}>
          <FormItem {...formItemLayout} label="请假时长">
            {form.getFieldDecorator('leaveTime', {
              rules: [{ required: true, message: '请输入请假时长' }],
              initialValue: Utils.isNotNull(selectedRows.leaveTime)
                ? selectedRows.leaveTime
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="请假类型">
            {form.getFieldDecorator('leaveType', {
              rules: [{ required: true, message: '请选择请假类型' }],
              initialValue: Utils.isNotNull(selectedRows.leaveType)
                ? selectedRows.leaveType
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={10} style={{ marginLeft: 10 }}>
          <FormItem {...formItemLayout} label="审核人">
            {form.getFieldDecorator('approvePeople', {
              rules: [{ required: true, message: '请选择审核人' }],
              initialValue: Utils.isNotNull(selectedRows.approvePeople)
                ? selectedRows.approvePeople
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="审核时间">
            {form.getFieldDecorator('approveTime', {
              rules: [{ required: true, message: '请输入审核时间' }],
              initialValue: Utils.isNotNull(selectedRows.approveTime)
                ? selectedRows.approveTime
                : '',
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={10} style={{ marginLeft: 10 }}>
          <FormItem {...formItemLayout} label="审核结果">
            {form.getFieldDecorator('result', {
              rules: [{ required: true, message: '请输入审核结果' }],
              initialValue: Utils.isNotNull(selectedRows.result) ? selectedRows.result : '',
            })(<Input />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="代班人">
            {form.getFieldDecorator('substitute', {
              rules: [{ required: true, message: '请输入代班人' }],
              initialValue: Utils.isNotNull(selectedRows.substitute)
                ? selectedRows.substitute
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

@connect(({ leave, loading }) => ({
  leave,
  loading: loading.models.leave,
}))
@Form.create()
export default class Leave extends React.Component {
  state = {
    modalVisible: false,
    formType: '',
    selectedRows: '',
    formValues: {},
    pagination: {
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 4,
      pageSizeOptions: ['4', '8', '12'],
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'leave/fetch',
    });
  }

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ xs: 8, sm: 16, md: 24}}>
            <Col md={6} sm={12}>
              <FormItem label="姓名">
                {getFieldDecorator('name')(<Input placeholder="姓名" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="时间段">{getFieldDecorator('dateList')(<RangePicker />)}</FormItem>
            </Col>
            <Col>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  columns = [
    {
      title: '请假人',
      dataIndex: 'leavePeople',
      width: 150,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 200,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
    },
    {
      title: '请假时长',
      dataIndex: 'leaveTime',
      width: 150,
    },
    {
      title: '请假类型',
      dataIndex: 'leaveType',
      width: 100,
    },
    {
      title: '审核人',
      dataIndex: 'approvePeople',
      width: 150,
    },
    {
      title: '审核时间',
      dataIndex: 'approveTime',
      width: 200,
    },
    {
      title: '审核结果',
      dataIndex: 'result',
      width: 150,
    },
    {
      title: '代班人',
      dataIndex: 'substitute',
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: text => (
        <div>
          <div className={styles.editButton}>
            <Icon type="edit" onClick={() => this.updateRecord(text)} />
          </div>
          <div className={styles.editButton}>
            <Icon type="delete" onClick={() => this.deleteConfirm(text)} />
          </div>
        </div>
      ),
    },
  ];

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
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'leave/fetch',
        payload: values,
      });
    });
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
      type: 'leave/add',
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
      type: 'leave/update',
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
      type: 'leave/remove',
      payload: {
        key: key,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
    message.success('删除成功');
  };

  render() {
    const {
      leave: { data },
      loading,
    } = this.props;
    console.log(data);
    const { modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      formType: this.state.formType,
      selectedRows: this.state.selectedRows,
    };

    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.buttonDiv}>
            <div className={styles.buttonFrom}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>

              <Button type="primary" onClick={() => this.handleModalVisible(true)} style={{marginLeft: 8}}>
                审核
              </Button>
            </div>
            <div className={styles.table}>
              <Table
                loading={loading}
                rowSelection={rowSelection}
                columns={this.columns}
                dataSource={data.list}
                bordered
                pagination={this.state.pagination}
                onChange={this.handleChange}
                scroll={{ x: 1800, y: 400 }}
                onRow={text => ({
                  onDoubleClick: () => {
                    this.doubleClick(text);
                  },
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
