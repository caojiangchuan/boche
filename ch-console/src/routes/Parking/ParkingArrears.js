import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, DatePicker, Table, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ParkingArrears.less';
import {message, Modal} from 'antd/lib/index';
import Common from '../../common/Common';

const Utils = new Common();
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const AeerarageDeatailModal = props => {
  const { memberDetail, modalVisible, handleOk, handleCancel, selectedRows } = props;
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 200,
      render: record => {
        return Utils.isNotNull(record) ? record : '无';
      },
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 200,
      render: record => {
        return Utils.isNotNull(record) ? record : '无';
      },
    },
  ];

  return (
    <div>
      <Modal
        title="信息"
        visible={modalVisible}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <div>
          <div>
            当前用户：<span style={{ fontWeight: 8 }}>{Utils.isNotNull(selectedRows.name) ? selectedRows.name : ''}</span>
          </div>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;手机号：</span>
            <span style={{ fontWeight: 8 }}>{Utils.isNotNull(selectedRows.mobile) ? selectedRows.mobile : ''}</span>
          </div>
        </div>
        <div>
          <Table columns={columns} dataSource={memberDetail} pagination={false} />
        </div>
        <div style={{marginTop: 10, padding: '10px 16px', textAlign: 'right', borderRadius: '0 0 4px 4px'}}>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={handleOk} style={{marginLeft: 10}} type="primary">短信催缴</Button>
        </div>
      </Modal>
    </div>
  );
};

// 欠费催缴

@connect(({ parkingArrears, member, loading }) => ({
  parkingArrears,
  member,
  loading: loading.models.parkingArrears,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: {},
    memberDetail: [],
    selectOrderInfo: {},
    formValues: {
      key: '',
      startDate: '',
      endDate: '',
    },
    formType: '',
    currentPage: 1,
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
    const {dispatch} = this.props;
    let page = `?start=${this.state.page.start}&limit=${this.state.page.limit}`;
    dispatch({
      type: 'parkingArrears/fetch',
      payload: {
        page: page,
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

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      page: {
        start: 1,
        limit: this.state.page.limit,
      },
    });
    this.getData();
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

      const timeValue = fieldsValue['dateList'];
      if (Utils.isNotNull(timeValue)) {
        let startDate = timeValue[0].format('YYYY-MM-DD HH:mm:ss');
        let endDate = timeValue[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.startDate = startDate;
        fieldsValue.endDate = endDate;
        delete fieldsValue.dateList;
      } else {
        fieldsValue.startDate = '';
        fieldsValue.endDate = '';
        delete fieldsValue.dateList;
      }

      let page = `?start=1&limit=${this.state.page.limit}`;
      const values = {
        ...fieldsValue,
        page: page,
      };

      dispatch({
        type: 'parkingArrears/fetch',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });

      this.setState({
        formValues: {
          ...fieldsValue,
        },
        currentPage: 1,
        page: {
          start: 1,
          limit: this.state.page.limit,
        }
      });

    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      selectedRows: {},
      memberDetail: [],
      selectOrderInfo: {},
    });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const selectedOrderNo = this.state.selectOrderInfo.orderNo;
    if (Utils.isNotNull(selectedOrderNo)){
      dispatch({
        type: 'parkingArrears/messageArrears',
        payload: {
          orderNo: selectedOrderNo,
        },
        callback: response => {
          if (response.success) {
            message.success('催缴成功');
          } else {
            message.error('催缴失败');
          }
        }
      });
    } else {
      message.error('该订单的订单号为空，请联系管理员查询')
    }
    this.setState({
      modalVisible: false,
    });
  };

  /**
   * 查看详情
   */
  detailRecord = record => {
    this.doubleClick(record);
  };

  /**
   * 双击事件
   */
  doubleClick = record => {
    const { dispatch } = this.props;
    let data =[];
    let customerId = record.customerId;
    dispatch({
      type: 'member/fetchDetail',
      payload: customerId,
      callback: response => {
        if (!response.success) {
          message.error('数据查询失败');
        } else {
          if (Utils.isNotNull(response.data)) {
            data.push(response.data);
            this.setState({
              modalVisible: true,
              memberDetail: data,
              selectedRows: response.data,
              selectOrderInfo: record,
            });
          } else {
            message.error('暂无数据');
          }
        }
      }
    });
  };

  // 切换页码触发事件
  handleChange = (page) => {
    this.setState({
      currentPage: page.current,
      page: {
        start: page.current,
        limit: page.pageSize,
      }
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
            <FormItem label="关键字">
              {getFieldDecorator('key')(<Input placeholder="订单号，用户名，收费员" />)}
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      parkingArrears: { parkingArrearsData },
      loading,
    } = this.props;

    const columns = [
      {
        title: '订单流水号',
        dataIndex: 'orderNo',
        width: 250,
      },
      {
        title: '用户名',
        dataIndex: 'customerName',
        width: 100,
      },
      {
        title: '总金额(元)',
        dataIndex: 'amount',
        width: 150,
      },
      {
        title: '应收金额(元)',
        dataIndex: 'ysAmount',
        width: 150,
      },
      {
        title: '实收金额(元)',
        dataIndex: 'ssAmount',
        width: 150,
      },
      {
        title: '收费员',
        dataIndex: 'parkKeeper',
        width: 150,
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'note',
        width: 300,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        width: 200,
        render: record => {
          return Utils.formatDate(record);
        },
      },
      {
        title: '离开时间',
        dataIndex: 'leaveDate',
        width: 200,
        render: record => {
          return Utils.formatDate(record);
        },
      },
      {
        title: '是否确认',
        dataIndex: 'confirmed',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ cursor: 'pointer' }}>
                <Icon type="profile" onClick={() => this.detailRecord(record)} />
              </div>
            </div>
          );
        },
      },
    ];

    const parentMethods = {
      handleOk: this.handleOk,
      selectedRows: this.state.selectedRows,
      memberDetail: this.state.memberDetail,
      handleCancel: this.handleCancel,
      modalVisible: this.state.modalVisible,
    };

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      // pageSizeOptions: ['10', '15', '20'],
      total: parkingArrearsData.totalCount,
      current: this.state.currentPage,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              bordered
              loading={loading}
              dataSource={parkingArrearsData.data}
              rowKey={record => record.id}
              columns={columns}
              pagination={pagination}
              onChange={this.handleChange}
              scroll={{ x: 2000 }}
              onRow={text => ({
                onDoubleClick: () => {
                  this.doubleClick(text);
                },
              })}
            />
          </div>
          <AeerarageDeatailModal {...parentMethods} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
