import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, DatePicker, message, Table, Icon} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './carManage.less';
import Common from '../../common/Common';
import CarManageForm from '../../components/carManageForm/CarManageForm';
import {Modal} from "antd/lib/index";
import UploadFile from "../../components/Upload/UploadFile";

const { NewAndUpdateForm } = new CarManageForm();
const Utils = new Common();
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(({ carManage, loading }) => ({
  carManage,
  loading: loading.models.carManage,
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
      type: 'carManage/fetch',
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


  // 重置搜索框
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      page: {
        start: 1,
        limit: 10,
      }
    }, () => {
      this.getData();
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
        page: {
          start: 1,
          limit: 10,
        },
      };

      dispatch({
        type: 'carManage/fetch',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });

      this.setState({
        formValues: values,
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
    const { dispatch } = this.props;
    dispatch({
      type: 'carManage/add',
      payload: fields,
      callback: (response) => {
        if (response.success){
          this.setState({
            page: {
              start: 1,
              limit: 10,
            }
          }, this.getData);
          message.success('添加成功');
          this.setState({
            currentPage: 1,
            selectedRows:{},
            formValues: {},
          });
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
    dispatch({
      type: 'carManage/update',
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
  deleteRecord = key => {
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'carManage/remove',
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
              {getFieldDecorator('carno')(<Input placeholder="请输入车牌号" />)}
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
      carManage: { data },
      loading,
    } = this.props;
    const { modalVisible, selectedRows, formType, currentPage } = this.state;

    const columns = [
      {
        title: '车牌号',
        dataIndex: 'carno',
      },
      {
        title: '车架号',
        dataIndex: 'vin',
      },
      {
        title: '车型',
        dataIndex: 'model',
      },
      {
        title: '颜色',
        dataIndex: 'color',
      },
      {
        title: '品牌型号',
        dataIndex: 'brand',
      },
      {
        title: '全景图',
        dataIndex: 'image',
      },
      {
        title: '所有人',
        dataIndex: 'owner',
      },
      {
        title: '证件号码',
        dataIndex: 'idcard',
      },
      {
        title: '联系电话',
        dataIndex: 'tel',
      },
      {
        title: '车辆录入时间',
        dataIndex: 'createdate',
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
                onClick={() => this.deleteRecord(record.id)}
              />
            </div>
          );
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: data.totalCount,
      current: currentPage,
      // pageSizeOptions: ['10', '15', '20'],
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
              {/*<UploadFile url={'xxxx/xxxxx'} />*/}
            </div>
            <Table
              bordered
              loading={loading}
              dataSource={data.data}
              rowKey={record => record.id}
              columns={columns}
              pagination={pagination}
              onChange={this.handleChange}
              scroll={{ x: 1800 }}
              onRow={(record, index) => ({
                onDoubleClick: () => {
                  this.doubleClick(record, index, this.state.page);
                },
              })}
            />
          </div>
        </Card>
        <NewAndUpdateForm
          {...parentMethods}
          modalVisible={modalVisible}
          selectedRows={selectedRows}
          formType={formType}
        />
      </PageHeaderLayout>
    );
  }
}
