import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Form, message, Table, Icon, Button, Row, Col,Modal} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './systemManage.less';
import SystemManageFrom from '../../components/SystemManageForm/SystemManageForm';

const confirm = Modal.confirm;
const {DeptForm} = new SystemManageFrom();

@connect(({deptManage,organizationManage, loading}) => ({
  deptManage,organizationManage,
  loading: (loading.models.deptManage,loading.models.organizationManage)
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: {},
    formValues: {},
    formType: '',
    // selectedRowIndex:0,
    orgRecord:{},
    deptRecord:{},
    pagination: {
      showQuickJumper: true,
      pageSize: 10,
      current:1,
      onChange:(page, pageSize)=>{this.handleChange(page, pageSize)},
      total:0,
    },
    page:{
      start:1,
      limit:10,
    },
    orgPagination:{
      pageSize: 10,
      simple:true ,
      onChange:(page, pageSize)=>{this.orgPageChange(page, pageSize)},
      total:0,
    },
    orgPage:{
      start:1,
      limit:10,
    }

  };

  componentDidMount() {
    this.initData();
  }
  //初始化数据
  initData =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'organizationManage/fetch',
      payload:{page:this.state.orgPage},
      callback:(response) =>{
        if(response.success && response.data.length>0){
          this.state.orgPagination.total = response.totalCount;
          this.setState({
            selectedRowIndex:0,
            orgRecord:response.data[0],

          },()=>{
            dispatch({
              type: 'deptManage/fetch',
              payload:{orgid:response.data[0].id,page:this.state.page},
              callback:(response)=>{
                this.setState({
                  pagination:{total:response.totalCount}
                })
                if(!response.success){
                  message.error('获取部门信息失败')
                }
              }
            });
          })
        }else{
          message.error("获取组织信息失败")
        }
      }
    });
  }

  //部门分页信息改变时触发
  handleChange = (page, pageSize)=>{
    this.setState({
      page:{
        start:page,
        limit:pageSize,
      }
    },()=>{
      this.selectRow(this.state.orgRecord,this.state.selectedRowIndex)
    })
  }

  //组织分页信息改变时触发
  orgPageChange = (page, pageSize)=>{
    this.setState({
      orgPage:{
        start:page,
        limit:pageSize,
      }
    },()=>{
      this.initData();
    })
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  handleModalVisible = (flag,record) => {
    this.setState({
      modalVisible: !!flag,
      selectedRows: {},
      formType: 'add',
      deptRecord:record,
    });
  };

//选择组织机构行
  selectRow = (record, index) => {
    if(index!=this.state.selectedRowIndex) {
      this.setState({
        page: {start: 1, limit: 10}
      },()=>{
        this.setState({
          selectedRowIndex: index,
          orgRecord:record,
          pagination:{current:this.state.page.start}
        },()=>{
          this.getDeptList(record);
        });
      })
    }else{
      this.setState({
        selectedRowIndex: index,
        orgRecord:record,
      },()=>{
        this.getDeptList(record);
      });
    }



  };
  //根据组织机构获取部门信息
  getDeptList = (record)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'deptManage/fetch',
      payload:{orgid:record.id,page:this.state.page},
      callback:(response)=>{
        this.setState({
          pagination:{total:response.totalCount}
        })
        if(!response.success){
          message.error('获取部门失败')
        }
      }
    });
  }

// 设置选中颜色
  setClassName = (record, index) => {
    const {selectedRowIndex} = this.state;
    return (index === selectedRowIndex ? `${styles.color}` : '')
  };
  /**
   * 修改
   */
  updateRecord =(record,form)=>{
    const {dispatch} = this.props;
    this.setState({
      deptRecord:record,
    })
    dispatch({
      type: 'deptManage/update',
      payload: record,
      callback: (response) => {
        if (response.success) {
          this.setState({
            modalVisible: false,
            formType: '',
          });
          this.getDeptList(this.state.orgRecord);
          message.success('修改成功');
        } else {
          this.setState({
            modalVisible: false,
            formType: '',
          });
          message.error('修改失败');
        }
        form.resetFields();
      }
    })
  }

  /**
   * 双击事件
   * @param record
   * @param index
   * @param page
   */
  doubleClick = record => {
    this.setState({
      modalVisible: true,
      selectedRows: record,
      formType: 'update',
    });
  };

  //删除部门
  deleteRecord = record=>{
    const {dispatch} = this.props;
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'deptManage/remove',
          payload: record,
          callback: (response) => {
            if (response.success) {
              this.getDeptList(this.state.orgRecord);
              message.success('删除成功');
            } else {
              message.error('删除失败');
            }
          }
        })
      },
    });
  }

  //新增部门
  handleAdd = (fields,form) => {
    this.props.dispatch({
      type: 'deptManage/add',
      payload:fields,
      callback: (response) => {
        if (response.success) {
          this.getDeptList(this.state.orgRecord);
          message.success('添加成功');
          this.setState({
            modalVisible: false,
            formType: '',
          });
        } else {
          message.error('添加失败');
          this.setState({
            modalVisible: false,
            formType: '',
          });
        }
        form.resetFields();
      }
    });
  };


  render() {
    const {
      deptManage: {data},
      organizationManage: {data:orgData},
      loading,
    } = this.props;

    const { modalVisible, selectedRows, formType,orgRecord,deptRecord } = this.state;

    const columns = [
      {
        title: '部门名称',
        dataIndex: 'name',
        width:805,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 200,
        render: (text, record) => {
          return (
            <div>
              <Icon type="edit" className={styles.cardIcon} onClick={() => this.doubleClick(record)}/> &nbsp;&nbsp;&nbsp;
              <Icon type="delete" className={styles.cardIcon} onClick={() => this.deleteRecord(record)}/> &nbsp;&nbsp;&nbsp;
              <Icon type="plus" className={styles.cardIcon} onClick={() => this.handleModalVisible(true,record)}/> &nbsp;&nbsp;&nbsp;
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
      updateRecord: this.updateRecord,
    };

    return (
      <PageHeaderLayout>
        <div>
          <Row>
            <Col span={8}>
              <Card bordered={true}>
                <div className={styles.tableList}>
                  <Table
                    bordered
                    rowKey={record => record.id}
                    pagination={this.state.orgPagination}
                    loading={loading}
                    dataSource={orgData.data}
                    columns={siderColumn}
                    rowClassName={this.setClassName}
                    onRow={(record, index) => ({
                      onClick: () => {
                        this.selectRow(record, index, true, this.state.page);
                      }
                    })}
                  />
                </div>
              </Card>
            </Col>
            <Col span={16}>
              <Card bordered={true}>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}></div>
                  <div className={styles.tableListOperator}>
                    <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                      新增
                    </Button>
                  </div>
                  <Table
                    bordered
                    rowKey={record => record.id}
                    loading={loading}
                    dataSource={data.data}
                    pagination={this.state.pagination}
                    columns={columns}
                    onRow={(record, index) => ({
                      onDoubleClick: () => {
                        this.doubleClick(record, index, this.state.page);
                      },
                    })}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <DeptForm {...parentMethods} modalVisible={modalVisible} orgData={orgData}
                  selectedRows={selectedRows} orgRecord={orgRecord} deptRecord={deptRecord} formType={formType}/>
      </PageHeaderLayout>
    );
  }
}
