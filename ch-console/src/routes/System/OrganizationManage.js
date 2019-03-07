import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, Card, Form, Input, Button, DatePicker, message, Table, Icon, Modal} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './systemManage.less';
import Common from '../../common/Common';
import SystemManageForm from "../../components/SystemManageForm/SystemManageForm";
import {province} from "../../components/ContainerFooter/geographic/province";
import {city} from "../../components/ContainerFooter/geographic/city";

const {OrganizationForm} = new SystemManageForm();
const Utils = new Common();
const {RangePicker} = DatePicker;
const confirm = Modal.confirm;
const FormItem = Form.Item;

@connect(({organizationManage, loading}) => ({
  organizationManage,
  loading: loading.models.organizationManage,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: {},
    formValues: {},
    formType: '',
    citys:[],//城市
    page:{
      start:1,
      limit:10,
    },
  };

  componentDidMount() {
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch,form} = this.props;
    this.state.formValues.page = this.state.page;
    dispatch({
      type: 'organizationManage/fetch',
      payload:this.state.formValues,
      callback:(response)=>{
        if(!response.success){
          message.error('获取组织信息失败')
          this.state.pagination.total = 1;
        }
      }
    });
  }

  //分页信息改变时触发
  handleChange = (page, pageSize)=>{
    this.setState({
      page:{
        start:page,
        limit:pageSize,
      }
    },()=>{
      this.getData();
    })
  }

  //切换城市
  changeCity =array =>{
    this.setState({
      citys:array,
    })
  }

  /**
   * 搜索
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      this.setState({
        formValues: fieldsValue,
        page:{start:1,limit:10}
      },()=>{
        this.getData();
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

  //新增组织
  handleAdd = (fields, form) => {
    this.state.page = {start:1,limit:10}
    this.props.dispatch({
      type: 'organizationManage/add',
      payload: fields,
      callback: (response) => {
        if (response.success) {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
            formType: '',
          },()=>{
            this.getData();
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

  /**
   * 修改
   */
  updateRecord = (record,form) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'organizationManage/update',
      payload: record,
      callback: (response) => {
        if (response.success) {
          this.setState({
            modalVisible: false,
            formType: '',
          });
          this.getData();
          message.success('修改成功');
        } else {
          this.setState({
            modalVisible: false,
            formType: '',
          });
          message.error('添加失败');
        }
        form.resetFields();
      }
    })

  };

  /**
   * 删除
   * @returns {*}
   */
  deleteRecord = record => {
    const {dispatch} = this.props;
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'organizationManage/remove',
          payload: record,
          callback: (response) => {
            if (response.success) {
              this.getData();
              message.success('删除成功');
            } else {
              message.error('删除失败');
            }
          }
        })
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
    //根据record获取city
    this.getCity(record);
    this.setState({
      modalVisible: true,
      selectedRows: record,
      formType: 'update',
    });
  };

  //获取城市下拉
  getCity=(record)=>{
    if(Utils.isNotNull(record.province)) {
      const pro = province.filter((item) => {
        return item.name === record.province
      });
      if(pro.length>0){
        const proNo = pro[0].id;
        this.setState({
          citys: city[proNo],
        })
      }
    }
  }

  //修改省时，把市置空
  setCityToNull =()=>{
    this.state.selectedRows.city='';
  }



  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="组织名称">
              {getFieldDecorator('name')(<Input placeholder="请输入组织名称"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} type="primary" onClick={() => this.handleModalVisible(true)}>新增</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      organizationManage: {data},
      loading,
    } = this.props;

    const {modalVisible, selectedRows, formType,citys} = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '组织名称',
        dataIndex: 'name',
      },
      {
        title: '省',
        dataIndex: 'province',
      },
      {
        title: '市',
        dataIndex: 'city',
      },
      {
        title: '组织性质',
        dataIndex: 'category',
      },
      {
        title: '联系电话',
        dataIndex: 'tel',
      },
      {
        title: '联系地址',
        dataIndex: 'address',
      },
      {
        title: '主页',
        dataIndex: 'homepage',
      },
      {
        title: '组织介绍',
        dataIndex: 'descr',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              <Icon type="edit" className={styles.cardIcon} onClick={() => this.doubleClick(record)}/> &nbsp;&nbsp;&nbsp;
              <Icon type="delete" className={styles.cardIcon} onClick={() => this.deleteRecord(record)}
            />
            </div>
          );
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      updateRecord: this.updateRecord,
      changeCity:this.changeCity,
      setCityToNull:this.setCityToNull,
    };
    const pagination= {
      showQuickJumper: true,
      pageSize: 10,
      total:data.totalCount,
      onChange:(page, pageSize)=>{this.handleChange(page, pageSize)},
    }

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>

            </div>
            <Table
              bordered
              rowKey={record => record.id}
              loading={loading}
              dataSource={data.data}
              pagination={pagination}
              columns={columns}
              onRow={(record, index) => ({
                onDoubleClick: () => {
                  this.doubleClick(record, index, this.state.page);
                },
              })}
            />
          </div>
        </Card>
        <OrganizationForm
          {...parentMethods}
          modalVisible={modalVisible}
          selectedRows={selectedRows}
          formType={formType}
          citys={citys}
        />
      </PageHeaderLayout>
    );
  }
}
