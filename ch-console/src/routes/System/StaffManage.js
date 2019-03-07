import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Form, message, Table, Icon, Button, Layout, Row, Col, Input, Select, Tooltip} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './systemManage.less';
import Login from "../../components/Login";
import SystemManageFrom from '../../components/SystemManageForm/SystemManageForm';
import {dutyStatus} from "../../common/Enum";
import Common from "../../common/Common";
import {Modal} from "antd/lib/index";

const Utils = new Common();
const FormItem = Form.Item;
const {StaffForm} = new SystemManageFrom();
const {Sider, Content} = Layout;
const Option = Select.Option;

const UpdatePasswordForm = Form.create()(props => {

  const {
    modalVisible,
    form,
    handleOk,
    handleCancelModalVisible,
    selectedRowKeys,
  } = props;

  const okHandle = () => {

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = fieldsValue;
      fieldsValue.id = selectedRowKeys; // 添加key
      // 修改
      handleOk(params);
      form.resetFields();
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    handleCancelModalVisible();
  };

  return (
    <Modal
      title={`密码重置`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => cancelHandle()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('pwd', {
          rules: [{required: true, message: '请输入密码'}],
        })(<Input placeholder="请输入密码" type="password"/>)}
      </FormItem>
    </Modal>
  );
});

const RoleDistributionForm = Form.create()(props => {

  const {
    modalVisible,
    form,
    handleOk,
    handleCancelModalVisible,
    selectedRowKeys,
    roleData,
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = fieldsValue;
      fieldsValue.id = selectedRowKeys; // 添加key
      // 修改
      handleOk(params);
      form.resetFields();
    });
  };

  const cancelHandle = () => {
    form.resetFields();
    handleCancelModalVisible();
  };

  return (
    <Modal
      title={`分配角色`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => cancelHandle()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="选择角色">
        {form.getFieldDecorator('roleid', {
          rules: [{ required: true, message: '请选择角色' }],
        })(
          <Select placeholder="请选择角色" style={{width:290}}>{Utils.dropDownOption(roleData,'value','name')}</Select>
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({staffManage, deptManage,roleManage, organizationManage, loading}) => ({
  staffManage,
  deptManage,
  roleManage,
  organizationManage,
  loading: loading.models.staffManage,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    pwdModalVisible: false,
    roleModalVisible: false,
    selectedRows: {},
    selectedRowKeys: '',
    selectedRowIndex: '',
    // 组织信息选中列
    selectedRowIndexByOrg: '',
    // 组织选中的id
    orgid: '',
    // 组织数据中选中行信息
    orgOrDeptInfo: {},
    dataStatus: '',
    formValues: {},
    formType: '',
    deptRecord: {},
    deptValue: '', // 信息修改中部门选项的值
    // 人员信息分页
    page:{
      start:1,
      limit:10,
    },
    currentPage: 1,
    // 组织分页
    orgPage:{
      start:1,
      limit:5,
    },
    totalCount: '',

    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: '',
      name: '',
      status: '',
      url: '',
    }],
  };

  componentDidMount() {
    const {dispatch} = this.props;
    // this.getData();
    this.initData();
    dispatch({
      type: 'deptManage/fetchAll',
      payload:{},
      callback:(response)=>{
        if (!response.success) {
          message.error('部门加载失败！');
        }
      }
    });

    dispatch({
      type: 'deptManage/fetch',
      payload:{},
      callback:(response)=>{
        if (!response.success) {
          message.error('部门加载失败！');
        }
      }
    });
    dispatch({
      type: 'roleManage/fetch',
      payload:{},
      callback:(response)=>{
        if (!response.success) {
          message.error('角色加载失败！');
        }
      }
    });
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'staffManage/fetch',
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

  //初始化数据
  initData =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'organizationManage/fetchOrgAndDept',
      payload: {page:this.state.orgPage},
      callback: (response) => {
        if (response.success && response.data.length > 0) {
          this.setState({
            selectedRowIndexByOrg: response.data[0].id,
            orgid: response.data[0].orgid,
            orgOrDeptInfo: response.data[0], // 默认设置第一条数据为初始状态数据
          });
          dispatch({
            type: 'staffManage/fetchByOrg',
            payload: {
              orgid: response.data[0].id,
              page: this.state.page,
            },
            callback: (response) => {
              if (!response.success) {
                message.error("加载泊位信息异常")
              }
            }
          });
        } else {
          message.error("获取组织信息异常")
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
    const { orgOrDeptInfo } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        formValues: fieldsValue,
        selectedRowIndex: '',
        selectedRowKeys: '',
        selectedRows: {},
      });

      // 搜索数据
      if (Utils.isNotNull(orgOrDeptInfo.orgid)) {
        // 选中的是部门
        this.setState({
          page: {
            start: 1,
            limit: 10,
          },
          currentPage: 1,
        }, () => {
          const params = {
            deptid: orgOrDeptInfo.id,
            ...fieldsValue
          };
          this.getStaffByDept(params);
        });
      } else {
        // 选中的是组织
        this.setState({
          page: {
            start: 1,
            limit: 10,
          },
          currentPage: 1,
        }, () => {
          const params = {
            orgid: orgOrDeptInfo.id,
            ...fieldsValue,
          };
          this.getStaffByOrg(params);
        });
      }

    });
  };

  // 新增窗口
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      selectedRows: {},
      formType: 'add',
      fileList: [],
    });
  };

  // 打开重置密码框
  handleUpdatePwdModalVisible = () => {
    if (Utils.isNotNull(this.state.selectedRowKeys)) {
      this.setState({
        pwdModalVisible: true,
      });
    } else {
      message.error('您还没有选择要修改的选项，请先选择');
    }
  };

  // 打开角色分配框
  handleRoleDistributionModalVisible = () => {
    if (Utils.isNotNull(this.state.selectedRowKeys)) {
      this.setState({
        roleModalVisible: true,
      });
    } else {
      message.error('您还没有选择要修改的选项，请先选择');
    }
  };

  // 关闭模态框
  cancelModalVisible = () => {
    this.setState({
      pwdModalVisible: false,
      roleModalVisible: false,
    });
  };

  // 选中行-员工信息列表
  selectRow = (record, index) => {
    this.setState({
      selectedRowIndex: index,
      selectedRows: record,
      selectedRowKeys: record.id,
    });
  };

  // 设置选择样式-员工信息列表
  setClassName = (record, index) => {
    const {selectedRowIndex} = this.state;
    return (index === selectedRowIndex ? `${styles.color}` : '')
  };

  // 设置选择样式-组织列表
  setClassNameByOrg = (record) => {
    const {selectedRowIndexByOrg} = this.state;
    if(record.id === selectedRowIndexByOrg && record.orgid === this.state.orgid){
      return `${styles.color}`
    }else{
      return '';
    }
  };

  // 右侧表格选中事件
  selectRowByOrg = (record) => {
    console.log(record, 'ssssss');
    const {dispatch} = this.props;
    if (Utils.isNotNull(record.orgid)) {
      // 选中的是部门
      this.setState({
        selectedRowIndexByOrg: record.id,
        orgid: record.orgid,
        formValues: {},
        orgOrDeptInfo: record,
        page: {
          start: 1,
          limit: 10,
        },
        currentPage: 1,
      }, () => {
        const params = {
          deptid: record.id,
        };
        this.getStaffByDept(params);
      });
    } else {
      // 选中的是组织
      this.setState({
        selectedRowIndexByOrg: record.id,
        orgid: record.orgid,
        formValues: {},
        orgOrDeptInfo: record,
        page: {
          start: 1,
          limit: 10,
        },
        currentPage: 1,
      }, () => {
        const params = {
          orgid: record.id,
        };
        this.getStaffByOrg(params);
      });
    }
  };

  /**
   * 双击事件
   * @param record
   * @param index
   * @param page
   */
  doubleClick = record => {
    let fileList = [];
    if (Utils.isNotNull(record.logo)) {
      fileList.push({
        uid: '1',
        name: record.name,
        status: 'done',
        url: record.logo,
      });
    }
    this.setState({
      modalVisible: true,
      selectedRows: record,
      formType: 'update',
      previewImage: record.logo,
      fileList: fileList,
    });
  };

  // 添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    this.setState({
      selectedRowIndex: '',
      selectedRowKeys: '',
      selectedRows: {},
    });
    dispatch({
      type: 'staffManage/add',
      payload: fields,
      callback: (response) => {
        if (response.success){
          this.setState({
            page: {
              start: 1,
              limit: this.state.page.limit,
            }
          }, () => {
            this.initData();
          });
          message.success('添加成功');
        } else {
          message.error('添加失败');
        }
      },
    });
    this.setState({
      modalVisible: false,
    });
  };

  /**
   * 修改框
   */
  updateRecord = (record) => {
    this.doubleClick(record);
  };

  // 修改操作
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { orgOrDeptInfo } = this.state;
    this.setState({
      selectedRowIndex: '',
      selectedRowKeys: '',
      selectedRows: {},
    });
    dispatch({
      type: 'staffManage/update',
      payload: fields,
      callback: (response) => {
        if (response.success){
          message.success('修改成功');
          if (Utils.isNotNull(orgOrDeptInfo.orgid)) {
            // 选中的是部门
            this.setState({
              page: {
                start: 1,
                limit: 10,
              },
              currentPage: 1,
            }, () => {
              const params = {
                deptid: orgOrDeptInfo.id,
              };
              this.getStaffByDept(params);
            });
          } else {
            // 选中的是组织
            this.setState({
              page: {
                start: 1,
                limit: 10,
              },
              currentPage: 1,
            }, () => {
              const params = {
                orgid: orgOrDeptInfo.id,
              };
              this.getStaffByOrg(params);
            });
          }
        } else {
          if (Utils.isNotNull(response.message)) {
            message.error(response.message);
          } else {
            message.error('修改失败');
          }
        }
      },
    });
    this.setState({
      modalVisible: false,
      selectedRows: {},
    });
  };

  // 删除框
  deleteConfirm = (key) => {
    Modal.confirm({
      title: '删除任务',
      content: '确定删除该记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleRemove(key),
    });
  };

  // 删除
  handleRemove = (key) => {
    const { dispatch } = this.props;
    const { orgOrDeptInfo } = this.state;
    this.setState({
      selectedRowIndex: '',
      selectedRowKeys: '',
      selectedRows: {},
    });
    dispatch({
      type: 'staffManage/remove',
      payload: key,
      callback: (response) => {
        if (response.success){
          message.success('删除成功');
          if (Utils.isNotNull(orgOrDeptInfo.orgid)) {
            // 选中的是部门
            this.setState({
              page: {
                start: 1,
                limit: 10,
              },
              currentPage: 1,
            }, () => {
              const params = {
                deptid: orgOrDeptInfo.id,
              };
              this.getStaffByDept(params);
            });
          } else {
            // 选中的是组织
            this.setState({
              page: {
                start: 1,
                limit: 10,
              },
              currentPage: 1,
            }, () => {
              const params = {
                orgid: orgOrDeptInfo.id,
              };
              this.getStaffByOrg(params);
            });
          }
        } else {
          message.error('删除失败');
        }
      },
    });
    this.setState({
      selectedRows: {},
    });
  };

  // 头像操作
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleImageChange = (item) => {


    // 把fileList拿出来
    let {fileList} = item;

    const status = item.file.status;
    if (status !== 'uploading') {
      this.setState({
        fileList: item.fileList,
      });
    }
    if (status === 'done') {
      // 响应结果
      const response = item.file.response;
      this.setState({
        fileList: item.fileList,
        previewImage: response.data, //设置返回路径
      });
      message.success(`${item.file.name} 文件上传成功`);
    } else if (status === 'error') {
      message.error(`${item.file.name} 文件上传失败`);
    }

    // 重新设置state
    this.setState( {fileList});
  };

  handleOnRemove = () => {
    this.setState({
      previewImage: '',
      fileList: [],
    });
  };

  // 人员信息表切换页码触发事件
  handleChange = (page) => {
    const { dispatch } = this.props;
    this.setState({
      page: {
        start: page.current,
        limit: page.pageSize,
      },
      currentPage: page.current,
    }, () => {
      if (Utils.isNotNull(this.state.orgOrDeptInfo.orgid)) {
        // 说明当前是处于部门下的人员信息分页
        const params = {
          deptid: this.state.orgOrDeptInfo.id,
        };

        this.getStaffByDept(params);
      } else {
        // 说明当前是处于组织下的人员信息分页
        const params = {
          orgid: this.state.orgOrDeptInfo.id,
        };
        this.getStaffByOrg(params);
      }
    });
    this.resetSelectedRow();
  };

  // 组织分页信息改变时触发
  orgPageChange = (page, pageSize)=>{
    this.setState({
      orgPage:{
        start:page,
        limit:pageSize,
      },
      selectedRowByOrg: '',
      orgid: '',
    },()=>{
      this.initData();
    })
  };

  // 静止登录、开通登录
  updateLoginStatus = (params) => {
    const { dispatch } = this.props;
    if (Utils.isNotNull(this.state.selectedRowKeys)) {

      dispatch({
        type: 'staffManage/updateLoginStatus',
        payload: {
          id: this.state.selectedRowKeys,
          "enablelogin":params,
        },
        callback: (response) => {
          if (response.success){
            // this.getData();
            message.success('操作成功');
          } else {
            message.error('操作失败');
          }
        },
      });
    } else {
      message.error('您还没有选择要修改的选项，请先选择');
    }
    this.resetSelectedRow();
  };

  // 重置密码
  updatePwd = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffManage/updatePwd',
      payload: params,
      callback: (response) => {
        if (response.success){
          // this.getData();
          message.success('密码重置成功');
        } else {
          message.error('密码重置失败');
        }
      },
    });

    this.resetSelectedRow();
  };

  // 分配角色
  roleDistribution = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffManage/updateRole',
      payload: params,
      callback: (response) => {
        if (response.success){
          // this.getData();
          message.success('角色分配成功');
        } else {
          message.error('角色分配失败');
        }
      },
    });

    this.resetSelectedRow();
  };

  // 重置选择行数据，清空选中项
  resetSelectedRow = () => {
    this.setState({
      // formValues: {},
      selectedRowIndex: '',
      selectedRowKeys: '',
      selectedRows: {},
      pwdModalVisible: false,
      roleModalVisible: false,
    });
  };

  // 修改信息中部门选中值
  deptChange = (value) => {
    this.setState({
      deptValue: value,
    });
  };

  // 初始化集合数据
  dataListInit = (dataList) => {
    if (Utils.isNotNull(dataList)) {
      let options = [];
      dataList.map(item => {
        const option = {
          name: `${item.name}`,
          value: `${item.id}`
        };
        options.push(option);
      });
      return options;
    } else {
      return null;
    }
  };

  // 通过组织获取人员信息
  getStaffByOrg = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffManage/fetchByOrg',
      payload: {
        page:this.state.page,
        ...params,
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

  // 通过部门获取人员信息
  getStaffByDept = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffManage/fetchByDept',
      payload: {
        page:this.state.page,
        ...params,
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

  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={5} sm={5}>
            <FormItem>{getFieldDecorator('name')(<Input placeholder="姓名"/>)}</FormItem>
          </Col>
          <Col md={19} sm={19}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>新增用户</Button>
              <Button type="primary" onClick={() => this.updateLoginStatus(true)}>开通登录</Button>
              <Button type="primary" onClick={() => this.updateLoginStatus(false)}>禁止登录</Button>
              {/*<Button type="primary" onClick={() => this.handleModalVisible(true)}>开通账号</Button>*/}
              <Button type="primary" onClick={() => this.handleUpdatePwdModalVisible()}>重置密码</Button>
              <Button type="primary" onClick={() => this.handleRoleDistributionModalVisible(true)}>分配角色</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const {
      staffManage: {staffData},
      deptManage: { deptData, data },
      roleManage: { roleData },
      organizationManage: {orgAndDeptData},
      loading,
    } = this.props;
    const {modalVisible, selectedRows, selectedRowKeys, formType} = this.state;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '头像',
        dataIndex: 'logo',
        width: 200,
        render: record => (
          <div style={{ textAlign: 'center', height: 40}}>
            <div style={{display: Utils.isNotNull(record) ? 'block' : 'none'}}>
              <img src={record} style={{ width: '36px', height: '36px', borderRadius: '40%' }} />
            </div>
          </div>
        ),
      },
      {
        title: '性别',
        dataIndex: 'sex',
        width: 200,
      },
      {
        title: '电话',
        dataIndex: 'tel',
        width: 250,
      },
      {
        title: '部门',
        dataIndex: 'deptid',
        width: 250,
        render: (text)=>{
          return Utils.getStatusName(text,this.dataListInit(deptData))
        }
      },
      {
        title: '在职状态',
        dataIndex: 'workstatus',
        width: 200,
        render: (text)=>{
          return Utils.getStatusName(text,dutyStatus)
        }
      },
      {
        title: '操作',
        fixed: 'right',
        width: 150,
        render: (record) => {
          return (
            <div>
              <div className={styles.editButton}>
                <Tooltip placement="bottom" title="点击修改">
                  <Icon type="edit" onClick={() => this.updateRecord(record)}/> &nbsp;&nbsp;&nbsp;
                </Tooltip>
              </div>
              <div className={styles.editButton}>
                <Tooltip placement="bottom" title="点击删除">
                  <Icon type="delete" onClick={() => this.deleteConfirm(record.id)}/>
                </Tooltip>
              </div>
            </div>
          );
        },
      },
    ];

    const siderColumn = [
      {
        title: '组织名称',
        dataIndex: 'name',
      }
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
      handleDeptChange: this.deptChange,
      deptData: this.dataListInit(deptData),
      deptValue: this.state.deptValue,
    };

    // 组织信息分页
    const orgPagination={
      simple:true ,
      pageSize: 5,
      total: orgAndDeptData.totalCount,
      onChange:(page, pageSize)=>{this.orgPageChange(page, pageSize)},
    }

    // 人员信息分页
    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: staffData.totalCount,
      current: this.state.currentPage,
      // pageSizeOptions: ['10', '15', '20'],
    };

    // 密码修改
    const pwdModalMethods = {
      selectedRowKeys: selectedRowKeys,
      modalVisible: this.state.pwdModalVisible,
      handleCancelModalVisible: this.cancelModalVisible,
      handleOk: this.updatePwd,
    };

    // 角色分配
    const roleModalMethods = {
      selectedRowKeys: selectedRowKeys,
      modalVisible: this.state.roleModalVisible,
      handleCancelModalVisible: this.cancelModalVisible,
      handleOk: this.roleDistribution,
      roleData: this.dataListInit(roleData.data),
    };

    // 头像处理所需参数
    const imageMethods = {
      fileList: this.state.fileList,
      previewVisible: this.state.previewVisible,
      previewImage: this.state.previewImage,
      handleImageCancel: this.handleCancel,
      handleImagePreview: this.handlePreview,
      handleImageChange: this.handleImageChange,
      handleOnRemove: this.handleOnRemove,
    };

    return (
      <PageHeaderLayout>
        <div>
          <Row>
            <Col span={6}>
              <Card bordered={true}>
                <div className={styles.tableList}>
                  <Table
                    bordered
                    // loading={loading}
                    pagination={orgPagination}
                    dataSource={orgAndDeptData.data}
                    columns={siderColumn}
                    rowKey={record => `${record.id}${record.orgid}`}
                    rowClassName={this.setClassNameByOrg}
                    onRow={(record, index) => ({
                      onClick: () => {
                        this.selectRowByOrg(record, index);
                      }
                    })}
                  />
                </div>
              </Card>
            </Col>
            <Col span={18}>
              <Card bordered={true}>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}></div>
                  <div className={styles.tableListOperator}>{this.renderSimpleForm()}</div>
                  <Table
                    bordered
                    loading={loading}
                    pagination={pagination}
                    columns={columns}
                    dataSource={staffData.data}
                    rowKey={record => record.id}
                    onChange={this.handleChange}
                    rowClassName={this.setClassName}
                    scroll={{ x: 1450 }}
                    onRow={(record, index) => ({
                      onClick: () => this.selectRow(record, index),
                      onDoubleClick: () => {
                        this.doubleClick(record);
                      },
                    })}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <StaffForm {...parentMethods} modalVisible={modalVisible} deptAllData={data} selectedRows={selectedRows} formType={formType} {...imageMethods}/>
        <UpdatePasswordForm {...pwdModalMethods} />
        <RoleDistributionForm {...roleModalMethods} />
      </PageHeaderLayout>
    );
  }
}
