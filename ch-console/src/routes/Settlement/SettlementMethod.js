import React from 'react';
import {Button, Col, Tabs, Form, Icon, Input, Row, Table} from 'antd';
import styles from './SettlementMethod.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SettlementMethodForm from '../../components/SettlementMethod/SettlementMethodForm'
import {connect} from 'dva';
import Common from '../../common/Common';
import {message, Modal} from "antd/lib/index";

import {enableHalfHour} from '../../common/Enum'

const Utils = new Common();
const confirm = Modal.confirm;
const {SettlementForm, TimesForm, ParkingForm} = new SettlementMethodForm();
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;


@connect(({settlement,operational, loading}) => ({
  settlement,operational,
  loading: (loading.models.operational,loading.models.settlement)
}))
@Form.create()
class SettlementMethod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, //策略
      timeModalVisible: false,//时间段
      parkingVisible: false,//停车场
      timeRecord: {}, //时间段行数据
      setRecord: {}, //策略行数据
      hisRecord: {}, //策略行数据
      parkingList: [],
      formType: '',
      name: '',      //搜索框策略名
      page: {
        start: 1,
        limit: 10,
      },
      selectedRowIndex: -1,
    };
  }

  componentDidMount() {
    this.initData();
  }

  //加载策略列表
  initData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'settlement/fetch',
      payload: {name: this.state.name, page: this.state.page},
      callback: (response) => {
        this.getTimeListBySettlement(response);
      }
    });
  }

  //根据获取列表的最后一行，展示时间段信息

  getTimeListBySettlement = (response) => {
    const {dispatch} = this.props;
    if (!response.success) {
      message.error("获取策略列表失败")
    }
    //默认选择第一行
      this.setState({
        setRecord: Utils.isNotNull(response.data[0])?response.data[0]:{},
        hisRecord: Utils.isNotNull(response.data[0])?response.data[0]:{},
        selectedRowIndex: Utils.isNotNull(response.data[0]) ? response.data[0].id : -1,
      }, () => {
        dispatch({
          type: 'settlement/getTimeList',
          payload: this.state.setRecord,
          callback: (response) => {
            if (!response.success) {
              message.error('获取时段列表失败')
            }
          }
        });
      })

  }

  //选择策略后显示时段信息
  getTimeList = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'settlement/getTimeList',
      payload: record,
      callback: (response) => {
        if (!response.success) {
          message.error('获取时段列表失败')
        }
      }
    });
  }


  pageChange = (page, pageSize) => {
    const {form} = this.props;
    form.validateFields((err, fieldsValue) => {
      this.setState({
        name: fieldsValue.name,
        page: {
          start: page,
          limit: pageSize,
        }
      }, () => {
        this.initData();
      })
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      const values = {
        ...fieldsValue,
      };
      values.page = {start: 1, limit:10};
      dispatch({
        type: 'settlement/fetch',
        payload: values,
        callback: (response) => {
          this.getTimeListBySettlement(response);
        }
      });
    });
  };

  //选中计费策略，带出下面的时段信息
  selectClick(record, index) {
    const {dispatch} = this.props;
    this.setState({
      setRecord: record,
      hisRecord: record,
      selectedRowIndex: record.id,
    }, () => {
      this.getTimeList(record);
    })
  }


  // 设置选中颜色
  setClassName = (record, index) => {
    const {selectedRowIndex} = this.state;
    return (record.id === selectedRowIndex ? `${styles.color}` : '')
  };

  //打开时间段弹框
  handleTimeVisible = flag => {
    if (Utils.isNotNull(this.state.hisRecord.id)) {
      this.setState({
        timeModalVisible: !!flag,
        formType: 'add',
      })
    } else {
      message.warn('请先选择策略')
    }
  }
  //查看停车场
  handleParkingVisible = (record) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'settlement/getParkingList',
      payload: record,
      callback: (response) => {
        if (!response.success) {
          message.error('获取停车场列表失败')
        } else {
          this.setState({
            parkingVisible: true,
            parkingList:response.data,
          })
        }
      }

    })
  }

  //关闭停车场弹框
  closeParkingModal = (form) => {
    this.setState({
      parkingVisible: false,
      parkingList: [],
    })
    form.resetFields();
  }


  //添加时间段
  addTime = (fields, form) => {
    this.props.dispatch({
      type: 'settlement/addTime',
      payload: fields,
      callback: (response) => {
        if (response.success) {
          this.getTimeList(this.state.hisRecord);
          message.success('添加成功');
          this.setState({
            timeModalVisible: false,
            formType: '',
          });
        } else {
          message.error('添加失败');
          this.setState({
            timeModalVisible: false,
            formType: '',
          });
        }
        form.resetFields();
      }
    })
  }

  //策略框
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      setRecord: {},
      formType: 'add',
    });
  };

  //时间段框
  handleTimeModalVisible = flag => {
    this.setState({
      timeModalVisible: !!flag,
      timeRecord: {},
      formType: 'add',
    });
  }


  //新增策略
  handleAdd = (fields, form) => {
    this.props.dispatch({
      type: 'settlement/addSettlement',
      payload: fields,
      callback: (response) => {
        if (response.success) {
          this.initData();
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

  }

  //修改策略
  updateRecord = (record, form) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'settlement/updateSettlement',
      payload: record,
      callback: (response) => {
        if (response.success) {
          this.setState({
            modalVisible: false,
            formType: '',
          });
          this.initData();
          message.success('修改成功');
        } else {
          this.setState({
            modalVisible: false,
            formType: '',
          });
          message.error('修改失败');
        }
        form.resetFields();
      },
    })
  }

  /**
   * 删除策略
   * @param record
   */
  deleteFieldRecord = (record) => {
    const {dispatch} = this.props;
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'settlement/removeSettlement',
          payload: record,
          callback: (response) => {
            if (response.success) {
              this.initData();
              message.success('删除成功');
            } else {
              message.error('删除失败');
            }
          }
        })
      },
    });
  }

  //删除时间段
  deleteTime = (record) => {
    const {dispatch} = this.props;
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'settlement/removeTime',
          payload: record,
          callback: (response) => {
            if (response.success) {
              this.getTimeList(this.state.hisRecord);
              message.success('删除成功');
            } else {
              message.error('删除失败');
            }
          }
        })
      },
    });
  }

  //修改时间段
  updateTime = (record, form) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'settlement/updateTime',
      payload: record,
      callback: (response) => {
        if (response.success) {
          this.setState({
            timeModalVisible: false,
            formType: '',
          });
          this.getTimeList(this.state.hisRecord);
          message.success('修改成功');
        } else {
          this.setState({
            timeModalVisible: false,
            formType: '',
          });
          message.error('修改失败');
        }
        form.resetFields();
      },
    })
  }


  //双击修改策略
  doubleClick = record => {
    this.setState({
      modalVisible: true,
      setRecord: record,
      formType: 'update',
    });
  };

  //双击修改时间段
  timeDoubleClick = record => {
    this.setState({
      timeModalVisible: true,
      timeRecord: record,
      formType: 'update',
    });
  };


  renderSearchForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="策略名称" >{getFieldDecorator('name')(<Input placeholder="策略名称"/>)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button style={{marginLeft: 8}} type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 8}} type="primary" onClick={() => {this.handleModalVisible(true)}}>新增</Button>
              {/*<Button style={{marginLeft: 8}} type="primary">策略及时生效</Button>*/}
            </span>
          </Col>
        </Row>
      </Form>
    )
  }

  render() {
    const {
      settlement: {data, childData},
      loading,
    } = this.props;

    const pagination= {
      showQuickJumper: true,
      pageSize: 10,
      total:data.totalCount,
      onChange:(page, pageSize)=>{this.pageChange(page, pageSize)},
    }

    const {modalVisible, setRecord, formType, timeModalVisible, timeRecord, hisRecord, parkingVisible,parkingList} = this.state;

    const columns = [
      {
        title: '计费策略',
        dataIndex: 'name',
        align: 'center',
        width: 200
      },
      // {
      //   title: '车型',
      //   align: 'center',
      //   dataIndex: 'cartype',
      //   width: 200
      // },
      {
        title: '免费时长(分钟)',
        align: 'center',
        dataIndex: 'freeminute',
        width: 200
      },
      {
        title: '封顶费用(元)',
        align: 'center',
        dataIndex: 'topfee',
        width: 200
      }, {
        title: '结算后停车时间(分钟)',
        align: 'center',
        dataIndex: 'leaveminute',
        width: 200
      },
      {
        title: '操作',
        align: 'center',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              <Icon className={styles.cardIcon} type="edit"
                    onClick={() => this.doubleClick(record)}/>&nbsp;&nbsp;&nbsp;
              {/*<Icon className={styles.cardIcon} type="delete" onClick={() => this.deleteFieldRecord(record)}/>*/}
              <Icon className={styles.cardIcon} type="car" onClick={() => this.handleParkingVisible(record)}/>
            </div>
          );
        },
      }
    ];

// 时间段信息
    const accountColumns = [
      {
        title: '开始时间(时)',
        align: 'center',
        dataIndex: 'starthour',
      },
      {
        title: '结束时间(时)',
        align: 'center',
        dataIndex: 'endhour',
      },
      {
        title: '单价(元)',
        align: 'center',
        dataIndex: 'price',
      },
      {
        title: '是否按半小时计费',
        align: 'center',
        dataIndex: 'enable30',
        render: (text, index) => {
          return Utils.getStatusName(text, enableHalfHour)
        }
      },
      {
        title: '操作',
        align: 'center',
        width: 150,
        render: (record, index) => {
          return (
            <div>
              <Icon className={styles.cardIcon} type="edit"
                    onClick={() => this.timeDoubleClick(record)}/>&nbsp;&nbsp;&nbsp;
              <Icon className={styles.cardIcon} type="delete" onClick={() => this.deleteTime(record)}/>
            </div>
          );
        },
      },
    ];


    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleTimeModalVisible: this.handleTimeModalVisible,
      updateRecord: this.updateRecord,
      addTime: this.addTime,
      updateTime: this.updateTime,
      closeParkingModal: this.closeParkingModal,
    };

    return (
      <PageHeaderLayout>
        <div>
          <div className={styles.staffInfoTable}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}></div>
            <Table
              loading={loading}
              columns={columns}
              dataSource={data.data}
              rowKey={record => record.id}
              bordered
              pagination={pagination}
              rowClassName={this.setClassName}
              onRow={(record, index) => ({
                onClick: () => {
                  this.selectClick(record, index);
                },
              })}
            />
          </div>
        </div>

        <div className={styles.tabContainer}>
          <Tabs type="card">
            <TabPane tab="明细" key="1">
              <div className={styles.tableListForm}></div>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={() => this.handleTimeVisible(true)}>新增</Button>
              </div>
              <Table
                columns={accountColumns}
                dataSource={childData.data}
                rowKey={record => record.id}
                bordered
                onChange={this.handleChange}
              />
            </TabPane>
          </Tabs>
        </div>
        <SettlementForm  {...parentMethods} modalVisible={modalVisible} setRecord={setRecord} formType={formType}/>
        <TimesForm  {...parentMethods} timeModalVisible={timeModalVisible} hisRecord={hisRecord} timeRecord={timeRecord}
                    formType={formType}/>
        <ParkingForm  {...parentMethods} parkingVisible={parkingVisible} parkingList={parkingList}/>
      </PageHeaderLayout>
    );
  }
}

export default SettlementMethod;
