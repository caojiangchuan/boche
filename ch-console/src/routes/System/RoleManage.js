import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Table, Icon, Modal, Tooltip } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './systemManage.less';
import Common from '../../common/Common';
import SystemManageForm from '../../components/SystemManageForm/SystemManageForm';

const { RoleForm } = new SystemManageForm();
const Utils = new Common();
const confirm = Modal.confirm;
const FormItem = Form.Item;

@connect(({ roleManage, functionManage, loading }) => ({
  roleManage,
  functionManage,
  loading: loading.models.roleManage,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: {},
    formValues: {},
    formType: {},
    authorityList: {},
    checkedKeys: [], // 角色功能列表选中项funcitonList
    page:{
      start:1,
      limit:10,
    },
    totalCount: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'roleManage/fetch',
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
    dispatch({
      type: 'functionManage/fetch',
    });
  }

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
        type: 'roleManage/fetch',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      selectedRows: {},
      checkedKeys: [],
      formType: 'add',
    });
  };

  // 新增
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManage/add',
      payload: fields,
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
      selectedRows: {},
      checkedKeys: [],
      formType: '',
    });
  };

  // 修改
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManage/update',
      payload: fields,
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
      selectedRows: {},
      checkedKeys: [],
      formType: '',
    });
  };

  /**
   * 修改
   */
  updateRecord = record => {
    this.doubleClick(record);
  };

  /**
   * 删除
   * @returns {*}
   */
  deleteRecord = key => {
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => this.handleRemove(key),
    });
  };

  // 删除
  handleRemove = key => {
    console.log('delete', key);
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManage/remove',
      payload: key,
      callback: response => {
        // console.log(response.success);
        if (response.success) {
          message.success('删除成功');
          this.getData();
        } else {
          message.error('删除失败');
        }
      },
    });
    this.setState({
      selectedRows: {
        data: {},
        functionList: [],
      },
    });
  };

  /**
   * 双击事件
   * @param record
   * @param index
   * @param page
   */
  doubleClick = record => {
    const id = record.id; // 获取当前选择行的id
    const { dispatch } = this.props;
    let functionList = [];
    dispatch({
      type: 'roleManage/fetchDetail',
      payload: id,
      callback: response => {
        if (response.success) {
          let functionIdList = [];
          functionList = response.data.funcitonList;
          functionList.map(item => {
            // if (Utils.isNotNull(item.parentid)) {
            //   functionIdList.push(item.id.toString());
            // }
            functionIdList.push(item.id.toString());
          });
          this.setState({
            modalVisible: true,
            selectedRows: response.data,
            formType: 'update',
            checkedKeys: functionIdList,
          });
        } else {
          message.error('数据查询失败请重试');
        }
      },
    });
  };

  handleCheck = checkedKeys => {
    console.log(checkedKeys, 'checkedKeys');
    this.setState({
      checkedKeys: checkedKeys,
    });
  };

  // 切换页码触发事件
  handleChange = (page) => {
    console.log(page, 'page');
    this.setState({
      page: {
        start: page.current,
        limit: page.pageSize,
      }
    }, () => {
      this.getData();
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入角色名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
               <Button style={{ marginLeft: 8 }}  type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      roleManage: { roleData },
      functionManage: { functionData },
      loading,
    } = this.props;

    let functionList = [];
    if (functionData.success) {
      functionList = functionData.data;
    }

    const { modalVisible, selectedRows, formType, authorityList } = this.state;

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '说明',
        dataIndex: 'note',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: text => {
          return (
            <div>
              <div className={styles.editButton}>
                <Tooltip placement="bottom" title="点击修改">
                  <Icon type="edit" onClick={() => this.updateRecord(text)} /> &nbsp;&nbsp;&nbsp;
                </Tooltip>
              </div>
              <div>
                <Tooltip placement="bottom" title="点击删除">
                  <Icon type="delete" onClick={() => this.deleteRecord(text.id)}/>
                </Tooltip>
              </div>
            </div>
          );
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      updateRecord: this.updateRecord,
      handleCheck: this.handleCheck,
    };

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: roleData.totalCount,
      // pageSizeOptions: ['10', '15', '20'],
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>

            </div>
            <Table
              bordered
              loading={loading}
              dataSource={roleData.data}
              columns={columns}
              pagination={pagination}
              rowKey={record => record.id}
              onChange={this.handleChange}
              onRow={(record, index) => ({
                onDoubleClick: () => {
                  this.doubleClick(record, index, this.state.page);
                },
              })}
            />
          </div>
        </Card>
        <RoleForm
          {...parentMethods}
          modalVisible={modalVisible}
          selectedRows={selectedRows}
          formType={formType}
          authorityList={authorityList}
          checkedKeys={this.state.checkedKeys}
          functionList={functionList}
        />
      </PageHeaderLayout>
    );
  }
}
