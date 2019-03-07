import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, DatePicker, message, Table, Icon,Modal} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './carManage.less';
import Common from '../../common/Common';
import CarManageForm from '../../components/carManageForm/CarManageForm';
import UploadFile from "../../components/Upload/UploadFile";

const { SpecialCarAndUpdateForm } = new CarManageForm();
const Utils = new Common();
const { RangePicker } = DatePicker;
const confirm = Modal.confirm;
const FormItem = Form.Item;

@connect(({ specialCarManage, loading }) => ({
  specialCarManage,
  loading: loading.models.specialCarManage,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: {},
    formValues: {},
    formType: '',
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
      type: 'specialCarManage/fetch',
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


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'specialCarManage/fetch',
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
        page: this.state.page,
      };

      dispatch({
        type: 'specialCarManage/fetch',
        payload: values,
      });

      this.setState({
        formValues: {
          ...fieldsValue,
        },
        currentPage: 1,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      selectedRows:{},
      formType: 'add',
    });
  };

  handleAdd = fields => {
    // console.log(fields, 'fields');
    const values = {
      ...fields,
      'startdate': fields['startdate'].format('YYYY-MM-DD HH:mm:ss'),
      'enddate': fields['enddate'].format('YYYY-MM-DD HH:mm:ss'),
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'specialCarManage/add',
      payload: values,
      callback: (response) => {
        if (response.success){
          this.setState({
            page: {
              start: 1,
              limit: 10,
            },
            currentPage: 1,
          }, this.getData);
          message.success('添加成功');
        } else {
          message.error('添加失败');
        }
      },
    });
    this.setState({
      modalVisible: false,
      formType: '',
    });
  };

  /**
   * 修改框
   */
  updateRecord = record => {
    this.doubleClick(record);
  };

  // 修改操作
  handleUpdate = fields => {
    const { dispatch } = this.props;
    const values = {
      ...fields,
      'startdate': fields['startdate'].format('YYYY-MM-DD HH:mm:ss'),
      'enddate': fields['enddate'].format('YYYY-MM-DD HH:mm:ss'),
    };
    dispatch({
      type: 'specialCarManage/update',
      payload: values,
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
    dispatch({
      type: 'specialCarManage/remove',
      payload: key,
      callback: (response) => {
        if (response.success){
          this.getData();
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
      },
    });
    this.setState({
      selectedRows: [],
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

  // 切换页码触发事件
  handleChange = (page) => {
    console.log(page, 'page');
    this.setState({
      page: {
        start: page.current,
        limit: page.pageSize,
      },
      currentPage: page.current,
    }, () => {
      this.getData();
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="车牌号">
              {getFieldDecorator('carNo')(<Input placeholder="请输入" />)}
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
              <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
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
      specialCarManage: { specialCarData },
      loading,
    } = this.props;
    const { modalVisible, selectedRows, formType, currentPage } = this.state;

    const columns = [
      {
        title: '车牌号',
        dataIndex: 'carno',
      },
      {
        title: '政策部门',
        dataIndex: 'dept',
      },
      {
        title: '执行日期',
        dataIndex: 'startdate',
        render:Utils.formatDate
      },
      {
        title: '终止日期',
        dataIndex: 'enddate',
        render:Utils.formatDate
      },
      {
        title: '执行费率',
        dataIndex: 'rate',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        dataIndex: 'status',
        render: (text, record) => {
          return (
            <div>
              <Icon type="edit" onClick={() => this.updateRecord(record)} /> &nbsp;&nbsp;&nbsp;<Icon
                type="delete"
                onClick={() => this.deleteConfirm(record.id)}
              />
            </div>
          );
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      updateRecord: this.handleUpdate,
    };

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: specialCarData.totalCount,
      // pageSizeOptions: ['10', '15', '20'],
      current: currentPage,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {/*<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>*/}
                {/*新建*/}
              {/*</Button>*/}
              {/*导入*/}
              {/*<UploadFile url={'xxxx/xxxxx'} />*/}
            </div>
            <Table
              bordered
              loading={loading}
              columns={columns}
              dataSource={specialCarData.data}
              rowKey={record => record.id}
              pagination={pagination}
              onChange={this.handleChange}
              onRow={(record, index) => ({
                onDoubleClick: () => {
                  this.doubleClick(record, index, this.state.page);
                },
              })}
            />
          </div>
        </Card>
        <SpecialCarAndUpdateForm
          {...parentMethods}
          modalVisible={modalVisible}
          selectedRows={selectedRows}
          formType={formType}
        />
      </PageHeaderLayout>
    );
  }
}
