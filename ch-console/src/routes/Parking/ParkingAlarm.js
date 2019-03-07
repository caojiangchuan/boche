import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, DatePicker, Table, Icon, Tooltip } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ParkingAlarm.less';
import {message, Modal} from 'antd/lib/index';
import Common from '../../common/Common';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Utils = new Common();

// 停车告警

@connect(({ parkingAlarm, loading }) => ({
  parkingAlarm,
  loading: loading.models.parkingAlarm,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
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
      type: 'parkingAlarm/fetch',
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
      page: {
        start: 1,
        limit: 10,
      },
      currentPage: 1,
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

      const rangeTimeValue = fieldsValue['warntime'];
      if (Utils.isNotNull(rangeTimeValue)) {
        let warntime = [
          rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
          rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        ];
        fieldsValue.rangeTime = {
          warntime: warntime,
        }
      }

      delete fieldsValue.warntime;

      const values = {
        ...fieldsValue,
        page: {
          start: 1,
          limit: 10,
        },
      };

      // let params = Utils.forSearch(values);

      dispatch({
        type: 'parkingAlarm/fetch',
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

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      selectedRows: [],
    });
  };

  handleOk = () => {
    this.setState({
      modalVisible: false,
      selectedRows: [],
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
    const data = [];
    data.push(record);
    this.setState({
      modalVisible: true,
      selectedRows: data,
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
            <FormItem label="告警时间">{getFieldDecorator('warntime')(<RangePicker />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      parkingAlarm: { parkingAlarmData },
      loading,
    } = this.props;

    const { currentPage } = this.state;

    // console.log(this.props);
    const columns = [
      {
        title: '流水号',
        dataIndex: 'sno',
        width: 200,
      },
      {
        title: '批次编号',
        dataIndex: 'batchno',
        width: 200,
      },
      {
        title: '告警类型',
        dataIndex: 'warntype',
        width: 150,
      },
      {
        title: '告警值',
        dataIndex: 'warnvalue',
        width: 150,
      },
      {
        title: '告警等级',
        dataIndex: 'warnlevel',
        width: 150,
      },
      {
        title: '告警时间',
        dataIndex: 'warntime',
        width: 200,
      },
      {
        title: '设备类型',
        dataIndex: 'devicetype',
        // width: 150,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ cursor: 'pointer' }}>
                <Tooltip placement="bottom" title="查看详情">
                  <Icon type="profile" onClick={() => this.detailRecord(record)} />
                </Tooltip>
              </div>
            </div>
          );
        },
      },
    ];

    const detailColumns = [
      {
        title: '流水号',
        dataIndex: 'sno',
        width: 200,
      },
      {
        title: '批次编号',
        dataIndex: 'batchno',
        width: 200,
      },
      {
        title: '告警类型',
        dataIndex: 'warntype',
        width: 150,
      },
      {
        title: '告警值',
        dataIndex: 'warnvalue',
        width: 150,
      },
      {
        title: '告警等级',
        dataIndex: 'warnlevel',
        width: 150,
      },
      {
        title: '告警时间',
        dataIndex: 'warntime',
        width: 200,
      },
      {
        title: '设备类型',
        dataIndex: 'devicetype',
        // width: 150,
      },
    ];

    const parentMethods = {
      handleOk: this.handleOk,
      data: this.state.selectedRows,
      handleCancel: this.handleCancel,
      modalVisible: this.state.modalVisible,
    };

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: parkingAlarmData.totalCount,
      // pageSizeOptions: ['10', '15', '20'],
      current: currentPage,
    };

    const AlarmDetailModal = props => {
      const { modalVisible, data, handleOk, handleCancel } = props;
      // console.log(props);
      return (
        <Modal
          title="停车告警信息"
          visible={modalVisible}
          width={1200}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Table
            bordered
            pagination={false}
            dataSource={data}
            columns={detailColumns}
          />
        </Modal>
      );
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              bordered
              loading={loading}
              columns={columns}
              dataSource={parkingAlarmData.data}
              rowKey={record => record.id}
              pagination={pagination}
              onChange={this.handleChange}
              scroll={{ x: 1300 }}
              onRow={(record, index) => ({
                onDoubleClick: () => {
                  this.doubleClick(record, index, this.state.page);
                },
              })}
            />
          </div>
          <AlarmDetailModal {...parentMethods} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
