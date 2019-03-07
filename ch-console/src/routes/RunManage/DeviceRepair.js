import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, DatePicker, message, Table, Icon,Modal, Tooltip,Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './deviceRepair.less';
import Common from '../../common/Common';
import {assetStatus, enableStatus, deviceRepairStatus} from "../../common/Enum";

const Utils = new Common();
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const FormItem = Form.Item;

const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleCancel, selectedRows,repaireList} = props;
  // console.log(selectedRows);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let params = fieldsValue;
      // 添加主键id
      params.id = selectedRows.id;
      // 修改
      handleUpdate(params);
      // form.resetFields();
    });
  };

   const checkAccount = (rule, value, callback) => {
    if (Utils.isNotNull(value)) {
      callback();
    } else {
      callback('电话不能为空');
    }
  };
  //校验手机号码
  const checkPhone = (rule, value, callback) => {
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))){
      callback("电话号码有误，请重填");
    }else{
      callback();
    }
  };

  // 手机号校验
  const checkMobile = (rule, value, callback) => {

    if (!value) {
      callback("手机号码不能为空");
    } else if (!(/^1\d{10}$/.test(value))){
      callback("手机号码有误，请重填");
    } else {
      callback();
    }
  };


  return (
    <Modal
      title="修改维修人员"
      width={500}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="维修人员">
      {form.getFieldDecorator('employeeid', {
        rules: [{required: true, message: '请选择维修人员'}],
        initialValue: Utils.isNotNull(selectedRows.employeeid) ? `${selectedRows.employeeid}` : '',
      })(<Select style={{width:282}} >{Utils.dropDownOption(repaireList,'id','name')}</Select>)}
    </FormItem>
      {/*<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话">*/}
        {/*{form.getFieldDecorator('tel', {*/}
          {/*rules: [*/}
            {/*{required: true, pattern: new RegExp(/^[0-9]\d*$/, "g"), message: '请输入电话'},*/}
            {/*{ validator: checkMobile }*/}
          {/*],*/}
          {/*getValueFromEvent: (event) => {*/}
            {/*return event.target.value.replace(/\D/g,'')*/}
          {/*},*/}
          {/*initialValue: Utils.isNotNull(selectedRows.tel) ? selectedRows.tel : '',*/}
        {/*})(<Input/>)}*/}
      {/*</FormItem>*/}
    </Modal>
  );
});


@connect(({ deviceRepair, loading }) => ({
  deviceRepair,
  loading: loading.models.deviceRepair,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {},
    modalVisible: false,
    selectedRows: {},
    repaireList:[],//维修人员
    page:{
      start:1,
      limit:10,
    },
    totalCount: '',
    currentPage: 1,
    repaireRecord:{},//维修人员
  };

  componentDidMount() {
    this.getData();
    // this.getRepaireList();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'deviceRepair/fetch',
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


  //获取维修员列表
  getRepaireList = ()=>{
    const {dispatch} = this.props;
    dispatch({
      type:'operational/fetch',
      payload:{page:{start:1,limit:999},type:1},
      callback:(response)=>{
        if(!response.success){
          message.error('获取维修人员列表异常')
        }else{
          this.setState({
            repaireList:response.data,
          },()=>{
            console.log(this.state.repaireList)
          })
        }
      }
    })
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
        page: this.state.page,
      };

      dispatch({
        type: 'deviceRepair/fetch',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });

      this.setState({
        formValues: {
          ...fieldsValue
        },
        currentPage: 1,
      });

    });
  };

  // 重置搜索框
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      currentPage: 1,
      page: {
        start: 1,
        limit: 10,
      },
    }, () => {
      this.getData();
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
  }

  // 退出模态框(打开添加、修改框后取消)
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      selectedRows: {},
    });
  };

  /**
   * 修改按钮
   */
  updateRecord = record => {
    this.doubleClick(record);
    this.getRepaireList();
  };

  /**
   * 双击事件
   */
  doubleClick = text => {
    this.setState({
      modalVisible: true,
      selectedRows: text,
    });
  };

  // 修改操作
  handleUpdate = fields => {
    const { dispatch } = this.props;
    // console.log(fields, 'fields update');
    dispatch({
      type: 'deviceRepair/update',
      payload: fields,
      callback: (response) => {
        if (response.success){
          this.getData();
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      },
    });
    this.setState({
      modalVisible: false,
      selectedRows: {},
    });
  };

  /**
   * 删除
   * @returns {*}
   */
  deleteRecord = record => {
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {

      },
    });
  };

  deviceRepairMessage = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceRepair/deviceRepairMessage',
      payload: {
        id: record.id,
      },
      callback: (response) => {
        if (response.success){
          this.getData();
          message.success('短信发送成功');
        } else {
          message.error('短信发送失败');
        }
      },
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={3} sm={5}>
            <FormItem>{getFieldDecorator('status')(<Select placeholder="报修状态" allowClear>{Utils.dropDownOption(deviceRepairStatus, 'value', 'name')}</Select>)}</FormItem>
          </Col>
          <Col md={3} sm={5}>
            <FormItem>{getFieldDecorator('orderno')(<Input placeholder="流水号" />)}</FormItem>
          </Col>
          <Col md={3} sm={5}>
            <FormItem>{getFieldDecorator('content')(<Input placeholder="报修内容" />)}</FormItem>
          </Col>
          <Col md={3} sm={5}>
            <FormItem>{getFieldDecorator('deviceno')(<Input placeholder="设备编号" />)}</FormItem>
          </Col>
          <Col md={3} sm={5}>
            <FormItem>{getFieldDecorator('createby')(<Input placeholder="报修人" />)}</FormItem>
          </Col>
          <Col md={3} sm={5}>
            {/*<FormItem>{getFieldDecorator('repairer')(<Select placeholder="维修人">{Utils.dropDownOption(this.state.repaireList,'name','name')}</Select>)}</FormItem>*/}
            <FormItem>{getFieldDecorator('serviceman')(<Input placeholder="维修人" />)}</FormItem>
          </Col>
          <Col md={6} sm={5}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      deviceRepair: { data },
      loading,
    } = this.props;

    const {repaireList, currentPage,repaireRecord} = this.state;

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: data.totalCount,
      // pageSizeOptions: ['10', '15', '20'],
      current: currentPage,
    };

    const parentMethods = {
      modalVisible: this.state.modalVisible,
      handleUpdate: this.handleUpdate,
      handleCancel: this.handleCancel,
      selectedRows: this.state.selectedRows,
    };

    const columns = [
      {
        title: '报修流水号',
        dataIndex: 'orderno',
      },
      {
        title: '报修状态',
        dataIndex: 'status',
        render: (text)=>{
          return Utils.getStatusName(text,deviceRepairStatus)
        }
      },
      {
        title: '报修来源',
        dataIndex: 'ordersrc',
      },
      {
        title: '报修人员',
        dataIndex: 'createby',
      },
      {
        title: '联系电话',
        dataIndex: 'creatortel',
      },
      {
        title: '报修时间',
        dataIndex: 'createtime',
        render:Utils.formatDate
      },
      {
        title: '报修内容',
        dataIndex: 'content',
      },
      {
        title: '报修图片',
        dataIndex: 'image',
        render: record => (
          <div style={{textAlign: 'center', height: 40}}>
            <div style={{display: Utils.isNotNull(record) ? 'block' : 'none'}}>
              <img src={record} style={{width: '36px', height: '36px', borderRadius: '40%'}}/>
            </div>

          </div>

        ),
      },
      {
        title: '设备编号',
        dataIndex: 'deviceno',
      },
      {
        title: '维修人员',
        dataIndex: 'serviceman',
      },
      {
        title: '维修人员电话',
        dataIndex: 'tel',
      },
      {
        title: '指派时间',
        dataIndex: 'serviceday',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        align: 'center',
        render: (text, record) => {
          return (
            <div>
              <div className={styles.editButton}>
                <Tooltip placement="bottom" title="发送报修短信">
                  <Icon className={`${!Utils.isNotNull(record.serviceman)?styles.disabledIcon:styles.abledIcon}`} type="rise" onClick={() => this.deviceRepairMessage(record)} />
                </Tooltip>
              </div>
              <div className={styles.editButton}>
                <Tooltip placement="bottom" title="修改信息">
                  <Icon type="tool" onClick={() => this.updateRecord(record)}/>
                </Tooltip>
              </div>
            </div>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              scroll={{ x: '130%' }}
              bordered
              loading={loading}
              dataSource={data.data}
              rowKey={record => record.id}
              pagination={pagination}
              onChange={this.handleChange}
              columns={columns}
            />
          </div>
        </Card>
        <UpdateForm {...parentMethods} repaireList={repaireList} />
      </PageHeaderLayout>
    );
  }
}
