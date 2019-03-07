import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, DatePicker, message, Table, Icon, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './carManage.less';
import Common from '../../common/Common';
import CarManageForm from '../../components/carManageForm/CarManageForm';
import UploadFile from '../../components/Upload/UploadFile';

const { DisobeyInfoAndUpdateForm } = new CarManageForm();
const Utils = new Common();
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const FormItem = Form.Item;

@connect(({ disobeyInfoManage, loading }) => ({
  disobeyInfoManage,
  loading: loading.models.disobeyInfoManage,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: {},
    formValues: {},
    formType: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'disobeyInfoManage/fetch',
      payload:{},
      callback:(response) =>{
        if(!response.success){
          message.error("获取信息异常");
        }
      }
    });

  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'disobeyInfoManage/fetch',
      payload: {},
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
        // updatedAt: fieldsValue.dateList && fieldsValue.dateList.valueOf(),
      };
      console.log(values, 'values');
      dispatch({
        type: 'disobeyInfoManage/fetch',
        payload: values,
        callback:(response) =>{
          if(!response.success){
            message.error("获取信息异常");
          }
        }
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

  handleAdd = fields => {
    this.props.dispatch({
      type: 'disobeyInfoManage/add',
      payload: {
        description: fields.desc,
        formType: 'add',
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
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
  deleteRecord = record => {
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {},
    });
  };
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

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="车牌号">
              {getFieldDecorator('carno')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="时间段">{getFieldDecorator('dateList')(<RangePicker />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      disobeyInfoManage: { data },
      loading,
    } = this.props;
    const { modalVisible, selectedRows, formType } = this.state;

    const columns = [
      {
        title: '车牌号',
        dataIndex: 'carno',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'tel',
        width: 150,
      },
      // {
      //   title: '停车场id',
      //   dataIndex: 'parkid',
      //   width: 150,
      // },
      {
        title: '停车场名称',
        dataIndex: 'parkname',
        width: 150,
      },
      // {
      //   title: '停车场片区id',
      //   dataIndex: 'parkareaid',
      //   width: 150,
      // },
      {
        title: '停车场片区名称',
        dataIndex: 'parkareaname',
        width: 150,
      },
      // {
      //   title: '泊位id',
      //   dataIndex: 'parkpositionid',
      //   width: 150,
      // },
      {
        title: '泊位名称',
        dataIndex: 'parkpositionname',
        width: 150,
      },
      // {
      //   title: '设备id',
      //   dataIndex: 'deviceid',
      //   width: 150,
      // },
      {
        title: '设备编号',
        dataIndex: 'deviceno',
        width: 150,
      },
      {
        title: '执法单位',
        dataIndex: 'execunit',
        width: 150,
      },
      {
        title: '违章开始日期',
        dataIndex: 'startdate',
        width: 200,
      },
      {
        title: '违章结束日期',
        dataIndex: 'enddate',
        width: 200,
      },
      {
        title: '费用',
        dataIndex: 'fee',
        width: 150,
      },
      {
        title: '巡检员名称',
        dataIndex: 'employee',
        // width: 150,
      },
      // {
      //   title: '操作',
      //   fixed: 'right',
      //   width: 100,
      //   dataIndex: 'status',
      //   render: (text, record) => {
      //     return (
      //       <div>
      //         <Icon type="edit" onClick={() => this.updateRecord(record)} /> &nbsp;&nbsp;&nbsp;<Icon
      //           type="delete"
      //           onClick={() => this.deleteRecord(record)}
      //         />
      //       </div>
      //     );
      //   },
      // },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      updateRecord: this.updateRecord,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            {/*<div className={styles.tableListOperator}>*/}
              {/*<UploadFile url={'xxxx/xxxx'} />*/}
            {/*</div>*/}
            <Table
              bordered
              loading={loading}
              dataSource={data.data}
              rowKey={record => record.id}
              columns={columns}
              scroll={{ x: 1800 }}
              // onRow={(record, index) => ({
              //   onDoubleClick: () => {
              //     this.doubleClick(record, index, this.state.page);
              //   },
              // })}
            />
          </div>
        </Card>
        <DisobeyInfoAndUpdateForm
          {...parentMethods}
          modalVisible={modalVisible}
          selectedRows={selectedRows}
          formType={formType}
        />
      </PageHeaderLayout>
    );
  }
}
