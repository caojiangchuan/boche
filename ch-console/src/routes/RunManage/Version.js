import React, { PureComponent } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select, Table, Modal, message, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Version.less';
import { connect } from 'dva';
import Common from '../../common/Common';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const Utils = new Common();

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleUpdate,
    handleCancelModalVisible,
    formType,
    selectedRows,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (formType === 'add') {
        handleAdd(fieldsValue);
        form.resetFields();
      } else if (formType === 'update') {
        const params = fieldsValue;
        fieldsValue.id = selectedRows.id; // 添加key
        // 修改
        handleUpdate(params);
        form.resetFields();
      }
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleCancelModalVisible();
  };

  return (
    <Modal
      title={`${formType === 'add' ? '新增版本信息' : '修改版本信息'}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => cancelHandle()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="APP类型">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输APP类型' }],
          initialValue: Utils.isNotNull(selectedRows.name) ? selectedRows.name : '',
        })(<Input placeholder="请输APP类型" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="起效时间">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入起效时间' }],
          // initialValue: Utils.isNotNull(selectedRows.title) ? selectedRows.title : '',
        })(
          <DatePicker />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="版本号">
        {form.getFieldDecorator('dutystatus', {
          rules: [{ required: true, message: '请输入版本号' }],
          initialValue: Utils.isNotNull(selectedRows.dutystatus) ? `${selectedRows.dutystatus}` : '',
        })(
          <Input placeholder="请输入版本号"/>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否发布">
        {form.getFieldDecorator('tel', {
          rules: [{ required: true, message: '请选择是否发布' }],
          initialValue: Utils.isNotNull(selectedRows.tel) ? selectedRows.tel : '',
        })(
          <Select style={{ width: 295 }} placeholder="请选择是否发布">
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="升级描述">
        {form.getFieldDecorator('address', {
          rules: [{ required: true, message: '请输入升级描述' }],
          initialValue: Utils.isNotNull(selectedRows.address) ? selectedRows.address : '',
        })(<Input placeholder="请输入升级描述" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ version, loading }) => ({
  version,
  loading: loading.models.version,
}))
@Form.create()
export default class VersionManage extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    page:{
      start:1,
      limit:10,
    },
    totalCount: '',

  };

  componentDidMount() {
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'versionManage/fetch',
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
  }

  columns = [
    // {
    //   title: 'APP类型',
    //   dataIndex: 'appType',
    // },
    // {
    //   title: '起效时间',
    //   dataIndex: '',
    // },
    {
      title: '版本号',
      dataIndex: 'version',
    },
    {
      title: '发布日期',
      dataIndex: "realsedate",
    },
    // {
    //   title: '是否发布',
    //   dataIndex: 'title',
    // },
    // {
    //   title: '升级描述',
    //   dataIndex: 'dutystatus',
    // },
    // {
    //   title: '操作',
    //   key: 'operation',
    //   width: 100,
    //   render: item => (
    //     <div>
    //       <div className={styles.editButton}>
    //         <Icon type="edit" onClick={() => this.handleUpdateModalVisible(item)} />
    //       </div>
    //       <div className={styles.editButton}>
    //         <Icon type="delete" onClick={() => this.deleteConfirm(item)} />
    //       </div>
    //     </div>
    //   ),
    // },
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
        page: this.state.page,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'operational/fetch',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });
    });
  };

  // 打开新增信息输入框
  handleAddModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      selectedRows: '',
      fileList: [],
      formType: 'add',
    });
  };

  // 添加信息
  handleAdd = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operational/add',
      payload: params,
      callback: response => {
        if (response.success) {
          message.success('添加成功');
          this.getData();
        } else {
          message.error('添加失败');
        }
      }
    });

    this.setState({
      modalVisible: false,
    });
  };

  /**
   * 双击事件
   */
  doubleClick = item => {
    this.handleUpdateModalVisible(item);
  };

  // 打开修改输入框
  handleUpdateModalVisible = (item) => {
    this.setState({
      modalVisible: true,
      selectedRows: item,
      formType: 'update',
    });
  };

  // 修改操作
  handleUpdate = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operational/update',
      payload: params,
      callback: response => {
        if (response.success) {
          message.success('修改成功');
          this.getData();
        } else {
          message.error('修改失败');
        }
      }
    });

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
      onOk: () => this.handleRemove(currentItem.id),
    });
  };

  // 删除
  handleRemove = key => {
    const { dispatch } = this.props;
    message.success('删除成功');
    // dispatch({
    //   type: 'operational/remove',
    //   payload: key,
    //   callback: response => {
    //     if (response.success) {
    //       message.success('删除成功');
    //       this.getData();
    //     } else {
    //       message.error('删除失败');
    //     }
    //   }
    // });
    this.setState({
      selectedRows: [],
    });
  };

  // 关闭输入框
  handleCancelModalVisible = () => {
    this.setState({
      modalVisible: false,
      selectedRows: '',
      previewImage: '',
    });
  };

  // 切换页码触发事件
  handleChange = (page) => {
    this.setState({
      page: {
        start: page.current,
        limit: page.pageSize,
      }
    }, () => {
      this.getData();
    });
  };

  searchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="APP类型">
              {getFieldDecorator('name')(
                <Select placeholder="APP类型">
                  <Option value="桩APP">桩APP</Option>
                  <Option value="桩识别APP">桩识别APP</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}><FormItem label="起效时间">{getFieldDecorator('date')(<RangePicker />)}</FormItem></Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button  style={{ marginLeft: 8 }} type="primary" onClick={() => this.handleAddModalVisible(true)}>新增</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      version: { versionData },
      loading,
    } = this.props;
    const { modalVisible } = this.state;

    const pagination = {
      // showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 10,
      total: data.totalCount,
      pageSizeOptions: ['10', '15', '20'],
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleAddModalVisible,
      handleCancelModalVisible: this.handleCancelModalVisible,
      formType: this.state.formType,
      selectedRows: this.state.selectedRows,
    };

    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <div className={styles.tableListForm}>{this.searchForm()}</div>
          <div className={styles.buttonDiv}>
            <div className={styles.table}>
              <Table
                loading={loading}
                columns={this.columns}
                dataSource={versionData.data}
                bordered
                pagination={pagination}
                // scroll={{ x: 1600 }}
                onChange={this.handleChange}
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
