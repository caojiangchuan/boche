import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Form, message, Table, Icon, Button, Layout, Row, Col, Input, Switch, List, Tag, Tooltip} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './parkingManage.less';
import Login from "../../components/Login";
import ParkingManageForm from '../../components/ParkingManageForm/ParkingManageForm';
import {Chart, Axis, Geom, Coord, Legend, Label} from 'bizcharts';
import * as BizCharts from 'bizcharts';
import DataSet from '@antv/data-set';
import Common from '../../common/Common';
import {Modal} from "antd/lib/index";
import {cameraStatus,carFieldStatus} from '../../common/Enum'

const Search = Input.Search;
const confirm = Modal.confirm;
const Utils = new Common();
const FormItem = Form.Item;
const {CarFieldForm, ParkingForm, AreaForm} = new ParkingManageForm();

@connect(({parkingManage,settlement, loading}) => ({
  parkingManage,
  settlement,
  loading: (loading.models.parkingManage,loading.models.settlement)
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    parkingVisible: false,
    carFieldVisible: false,
    areaVisible: false,
    areaRecord: {},
    parkingRecord: {},//停车场行
    selectedRows: {},
    formValues: {},
    formType: '',
    selectedRowIndex: '',
    parkId:'',//标识左边列表选中的是谁
    showList: false,
    current:1,
    settlementList:[],
    // 饼状图泊位数据
    positionData: {
      unused: 0,
      used: 0,
      ban: 0
    },
    //泊位分页
    page:{
      start:1,
      limit:12,
    },
    //停车场分页
    parkingPage:{
      start:1,
      limit:10,
    },

};

  componentDidMount() {
    this.initData();
  }

  //初始化数据
  initData =(name)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'parkingManage/fetch',
      payload: {name:name,page:this.state.parkingPage},
      callback: (response) => {
        if (response.success && response.data.length > 0) {
          this.setState({
            selectedRowIndex: response.data[0].id,
            parkingRecord: response.data[0],
            parkId:response.data[0].parkid,
          })
          dispatch({
            type: Utils.isNotNull(this.state.areaRecord.id)?'parkingManage/getCarFieldListByArea':'parkingManage/getCarFieldList',
            payload: {id: Utils.isNotNull(this.state.areaRecord.id)?this.state.areaRecord.id:Utils.isNotNull(this.state.parkingRecord.id)?this.state.parkingRecord.id:response.data[0].id,page:this.state.page},
            callback: (response) => {
              if (!response.success) {
                message.error("加载泊位信息异常")
              }
            }
          });
          dispatch({
            type: Utils.isNotNull(this.state.areaRecord.id)?'parkingManage/getAreaPositionStatusCount':'parkingManage/getParkPositionStatusCount',
            payload: {id: Utils.isNotNull(this.state.areaRecord.id)?this.state.areaRecord.id:Utils.isNotNull(this.state.parkingRecord.id)?this.state.parkingRecord.id:response.data[0].id},
            callback: (response) => {
              if (!response.success) {
                message.error("加载泊位状态数据异常");
              } else {
                this.setState({
                  positionData: response.data, // 设置泊位状态数据
                });
              }
            }
          });
        } else if(!response.success) {
          message.error("获取停车场列表异常")
        }
      }
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    if(Utils.isNotNull(this.state.areaRecord.parkid)) {
      this.setState({
        carFieldVisible: !!flag,
        selectedRows: {},
        formType: 'add',
      });
    }else{
      message.warn('请先选择片区')
    }
  };
  closeCarField =()=>{
    this.setState({
      carFieldVisible: false,
      selectedRows: {},
      formType: 'add',
    });
  }

//选择停车场行
  selectRow = (record) => {
    const {dispatch,form} = this.props;
    if(record.id!==this.state.selectedRowIndex){
      this.state.page.start=1;
      form.resetFields();
    }
    let fields ='';
    form.validateFields((err, fieldsValue) => {
      fields = fieldsValue.key;
    });
    //如果是点击停车场
    if(!Utils.isNotNull(record.parkid)) {
      if((this.state.page.start!==1 && Utils.isNotNull(record.parkid))|| Utils.isNotNull(fields)){
        if(Utils.isNotNull(fields)){
          this.setState({
            page:{start:1,limit:12}
          })
        }
        this.setState({
          current:1,
        })
      }else{
        this.setState({
          current:this.state.page.start,
        })
      }
      this.setState({
        parkingRecord: record,
        selectedRowIndex: record.id,
        parkId: record.parkid,
        areaRecord:{},
      }, () => {
        dispatch({
          type: 'parkingManage/getCarFieldList',
          payload: {id: record.id, page: this.state.page,key:fields},
          callback: (response) => {
            if (!response.success) {
              message.error("获取泊位信息异常")
            }
          }
        });
        dispatch({
          type: 'parkingManage/getParkPositionStatusCount',
          payload: {id: record.id},
          callback: (response) => {
            if (!response.success) {
              message.error("获取泊位状态数据异常");
            } else {
              this.setState({
                positionData: response.data, // 设置泊位状态数据
              });
            }
          }
        });
      });
    }else{
      if((this.state.page.start!==1 && !Utils.isNotNull(record.parkid))|| Utils.isNotNull(fields)){
        if(Utils.isNotNull(fields)){
          this.setState({
            page:{start:1,limit:12}
          })
        }
        this.setState({
          current:1,
        })
      }else{
        this.setState({
          current:this.state.page.start,
        })
      }
      this.setState({
        areaRecord: record,
        selectedRowIndex: record.id,
        parkId: record.parkid,
      }, () => {
        dispatch({
          type: 'parkingManage/getCarFieldListByArea',
          payload: {id:record.id, page: this.state.page,key:fields},
          callback: (response) => {
            if (!response.success) {
              message.error("获取泊位信息异常")
            }
          }
        });
        dispatch({
          type: 'parkingManage/getAreaPositionStatusCount',
          payload: {id: record.id, page: this.state.page,key:fields},
          callback: (response) => {
            if (!response.success) {
              message.error("获取泊位状态数据异常");
            } else {
              this.setState({
                positionData: response.data,
              });
            }
          }
        });
      });
    }

  };

  //选择车位行
  selectCarFieldRow = (record, index, page) => {
    const {dispatch} = this.props;
    this.setState({
      selectCarRow: record.id,
    });
  };


// 设置选中颜色停车场
  setClassName = (record, index) => {
    const {selectedRowIndex} = this.state;
    if(record.id === selectedRowIndex && record.parkid === this.state.parkId){
      return `${styles.color}`
    }else{
      return '';
    }
  };

  // 设置选中颜色车位
  setCarFieldName = (record, index) => {
    const {selectCarRow} = this.state;
    return (record.id === selectCarRow ? `${styles.color}` : '')
  };
  /**
   * 修改泊位信息
   */
  updateRecord = (record, form) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'parkingManage/updateField',
      payload: record,
      callback: (response) => {
        if (response.success) {
          this.setState({
            carFieldVisible: false,
            formType: '',
          });
          this.selectRow(this.state.parkingRecord);
          message.success('修改成功');
        } else {
          this.setState({
            carFieldVisible: false,
            formType: '',
          });
          message.error('修改失败,'+response.message);
        }
        form.resetFields();
      }
    })
  }

  /**
   * 删除车位信息
   */
  deleteRecord = (record) => {
    const {dispatch} = this.props;
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'parkingManage/removeField',
          payload: record,
          callback: (response) => {
            if (response.success) {
              this.selectRow(this.state.parkingRecord);
              message.success('删除成功');
            } else {
              message.error('删除失败');
            }
          }
        })

      },
    });
  }

  // 修改状态提示框
  changeStatusConfirm = record => {
    Modal.confirm({
      title: '切换状态',
      content: '确定切换当前泊位状态？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.changeStatus(record),
    });
  };

  // 修改状态
  changeStatus =(record)=>{
    const {dispatch} = this.props;
    if(record.status===3){
      record.status=4;
    }else {
      record.status=3;
    }
    confirm({
      title: '操作提示',
      content: '确定要执行操作吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'parkingManage/updateParkPositionStatus',
          payload: {
            id: record.id,
            status: record.status,
          },
          callback: (response) => {
            if (response.success) {
              this.setState({
                carFieldVisible: false,
                formType: '',
              });
              this.selectRow(this.state.parkingRecord);
              message.success('切换成功');
            } else {
              this.setState({
                carFieldVisible: false,
                formType: '',
              });
              message.error('切换失败');
            }
          }
        })
      }
    });
  }

  /**
   * 双击事件
   * @param record
   * @param index
   * @param page
   */
  doubleClick = record => {
    // 占用时不允许修改
    // if (record.status !== 2) {
    //   this.setState({
    //     carFieldVisible: true,
    //     selectedRows: record,
    //     formType: 'update',
    //   });
    // }
    this.setState({
      carFieldVisible: true,
      selectedRows: record,
      formType: 'update',
    });
  };

  //分页信息改变时触发
  handleChange = (page, pageSize)=>{
    this.setState({
      page:{
        start:page,
        limit:pageSize,
      },
      current:page,
    },()=>{
      this.selectRow(Utils.isNotNull(this.state.areaRecord.id)?this.state.areaRecord:this.state.parkingRecord)
    })
}

//停车场分页
  parkingPageChange = (page, pageSize)=>{
    this.setState({
      parkingPage:{
        start:page,
        limit:pageSize,
      },
      parkingRecord:{},
      selectedRowIndex:'',
    },()=>{
     this.initData();
    })
  }

  //新增车位
  handleAdd = fields => {
    this.props.dispatch({
      type: 'parkingManage/addParkingField',
      payload: fields,
      callback: (response) => {
        if (response.success) {
          this.selectRow(this.state.areaRecord);
          message.success('添加成功');
          this.setState({
            carFieldVisible: false,
            formType: '',
          });
        } else {
          message.error('添加失败,'+response.message);
          this.setState({
            carFieldVisible: false,
            formType: '',
          });
        }
      }
    });
  };

  /**
   * 搜索车位
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      this.selectRow(Utils.isNotNull(this.state.areaRecord.id)?this.state.areaRecord:this.state.parkingRecord)
    });
  };

  //切换页面展示模式为列表还是卡片
  changeList = () => {
    this.setState({
      showList: !this.state.showList
    })
  }

  //新增停车场弹框
  handleParkingVisible = () => {
    this.setState({
      parkingVisible: true,
      formType: 'add',
      parkingRecord: {}

    })
    this.getSettlement();

  }
  closeParkingVisible=()=>{
    this.setState({
      parkingVisible: false,
      formType: 'add',
      parkingRecord: {}

    })
  }
  //获取策略
  getSettlement =()=>{
    const{dispatch} = this.props;
    //获取计费策略
    dispatch({
      type:'settlement/fetch',
      payload:{},
      callback:(response)=>{
        if(!response.success){
          message.error('获取策略列表失败');
        }else{
          this.setState({
            settlementList:response.data
          })
        }
      }
    })
  }

  //新增停车场
  handParkingAdd = fields => {
    this.props.dispatch({
      type: 'parkingManage/addPark',
      payload: fields,
      callback: (response) => {
        if (response.success) {
        //重新加载数据
          message.success('添加成功');
          this.setState({
            parkingVisible: false,
            formType: '',
            parkingRecord:{},
            selectedRowIndex:'',
          },()=>{
            this.initData();
          });
        } else {
          message.error('添加失败');
          this.setState({
            parkingVisible: false,
            formType: '',
          });
        }
      }
    });
  }


    //打开修改停车场弹框
    updateParking = (record) => {
        this.setState({
          parkingRecord:record,
          parkingVisible: true,
          formType: 'update',
        })
      this.getSettlement();
    }
    //更新停车场
    handleUpdatePark =(fields,form) =>{
      const {dispatch} = this.props;
      dispatch({
        type: 'parkingManage/updatePark',
        payload: fields,
        callback: (response) => {
          if (response.success) {
            this.setState({
              parkingVisible: false,
              formType: '',
              areaRecord:{}
            },()=>{
              this.initData()
            });
            message.success('修改成功');
          } else {
            this.setState({
              parkingVisible: false,
              formType: '',
            });
            message.error('修改失败');
          }
          form.resetFields();
        }
      })
    }

    //删除停车场
    deleteParking = (record) => {
      const {dispatch} = this.props;
        confirm({
          title: '操作提示',
          content: '确定要执行操作吗？',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'parkingManage/removePark',
              payload: record,
              callback: (response) => {
                if (response.success) {
                  this.setState({
                    parkingRecord:{},
                    selectedRowIndex:'',
                  },()=>{
                    this.initData();
                  })
                  message.success('删除成功');
                } else {
                  message.error('删除失败');
                }
              }
            })
          },
        });
    }

    //打开片区弹框
    handleAreaVisible = record => {
      this.setState({
        areaVisible: true,
        formType: 'add',
        parkingRecord:record,
        areaRecord: {}
      },()=>{
        this.getSettlement()
      })
    }

  closeAreaVisible=()=>{
    this.setState({
      areaVisible: false,
      formType: 'add',
      areaRecord: {}
    })
  }

    addArea =(fields,form)=>{
      this.props.dispatch({
        type: 'parkingManage/addArea',
        payload: fields,
        callback: (response) => {
          if (response.success) {
            //重新加载数据
            this.initData();
            message.success('添加成功');
            this.setState({
              areaVisible: false,
              formType: '',
            });
          } else {
            message.error('添加失败');
            this.setState({
              areaVisible: false,
              formType: '',
            });
          }
          form.resetFields();
        }
      });

    }

    /**
     * 更新片区信息
     * @param record
     */
    updateFieldRecord = (record) => {
      this.setState({
        areaVisible: true,
        formType: 'update',
        areaRecord: record

      },()=>{
        this.getSettlement();
      })
    }
    updateArea =(fields,form)=>{
      const {dispatch} = this.props;
      dispatch({
        type: 'parkingManage/updateArea',
        payload: fields,
        callback: (response) => {
          if (response.success) {
            this.setState({
              areaVisible: false,
              formType: '',
            },()=>{
              this.initData()
            });
            message.success('修改成功');
          } else {
            this.setState({
              areaVisible: false,
              formType: '',
            });
            message.error('修改失败');
          }
          form.resetFields();
        }
      })
    }

    /**
     * 删除片区信息
     * @param record
     */
    delArea = (record) => {
      const {dispatch} = this.props;
      confirm({
        title: '操作提示',
        content: '确定要执行操作吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          dispatch({
            type: 'parkingManage/delArea',
            payload: record,
            callback: (response) => {
              if (response.success) {
                this.setState({
                  parkingRecord:{},
                  selectedRowIndex:'',
                  areaRecord:{},
                },()=>{
                  this.initData();
                })
                message.success('删除成功');
              } else {
                message.error('删除失败');
              }
            }
          })
        },
      });
    }


    //车位搜索框
    renderSimpleForm()
    {
      const {getFieldDecorator} = this.props.form;
      return (
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row>
            <Col md={5} sm={5}>
              <FormItem>{getFieldDecorator('key')(<Input placeholder="车牌号、泊位"/>)}</FormItem>
            </Col>
            <Col md={19} sm={19}>
              {/*<span className={styles.submitButtons}>*/}
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>新增</Button>
              <Switch defaultChecked checkedChildren="卡片" unCheckedChildren="列表"
                      style={{marginLeft: '60%', marginTop: 0}}
                      onChange={this.changeList}/>
              {/*</span>*/}
            </Col>
          </Row>
        </Form>
      );
    }

    //停车场搜索框

    renderParkingForm()
    {
      return (
        <Row>
          <Col span={17} md={12} lg={16}>
            <Search onSearch={value => this.initData(value)}/>
            </Col><Col  span={7} md={12} lg={8}>
            <Button type="primary" className={styles.bottomStyle} onClick={() => this.handleParkingVisible(true)}>新增</Button>
          </Col>
        </Row>
      );
    }



    /**
     * 卡片列表 泊位状态 2-占用，3-空闲，4-禁用
     * @returns {*}
     */
    cardList(data, loading)
    {
      //泊位分页
      const pagination= {
        showQuickJumper: true,
        pageSize: 12,
        current:this.state.current,
        total:data.totalCount,
        onChange:(page, pageSize)=>{this.handleChange(page, pageSize)},
      }
      return (
        <List
          grid={{gutter: 24, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 6}}
          dataSource={data.data}
          loading={loading}
          pagination={Utils.isNotNull(data.data)?pagination:''}
          renderItem={item => (
            <List.Item>
              <Card style={{width: 180, height: 220, fontSize: 13}}
                    title={<Tag
                      style={{
                        color: 'white',
                        backgroundColor: `${item.status === 3 ? '#4DB39E' : item.status === 2 ? '#FF5722' : '#C23531'}`
                      }}>{`${item.status === 3 ? '空闲' : item.status === 2 ? '占用' : '禁用'}`}</Tag>}>
                <p style={{lineHeight: 1}}>{`泊位：${Utils.isNotNull(item.positionno)?item.positionno: ''}`}</p>
                <p style={{lineHeight: 1}}>{`车牌：${Utils.isNotNull(item.carno)?item.carno:''}`}</p>
                <p style={{lineHeight: 1}}>{`时长：${Utils.isNotNull(item.parktime)?`${item.parktime} 分钟`:''}`}</p>
                <p style={{lineHeight: 1}}>{`费用：${Utils.isNotNull(item.fee)?`${item.fee} 元`:''}`}</p>
                <p style={{lineHeight: 1,display:item.status===3?'block':'none'}}>
                  <Tooltip placement="bottom" title="编辑">
                    <Icon className={[styles.cardIcon,styles.iconInterval]} theme="twoTone" type="edit" onClick={() => this.doubleClick(item)}/>
                  </Tooltip>
                  <Tooltip placement="bottom" title="删除">
                    <Icon className={[styles.cardIcon,styles.iconInterval]} type="delete" theme={'twoTone'} twoToneColor={'#eb2f96'} onClick={() => this.deleteRecord(item)}/>
                  </Tooltip>
                  <Tooltip placement="bottom" title="禁用泊位">
                    <Icon className={[styles.cardIcon,styles.iconInterval]} theme="twoTone" twoToneColor={'#52c41a'} type={'unlock'} onClick={() => this.changeStatus(item)}/>
                  </Tooltip>
                </p>

                <p style={{lineHeight: 1,display:item.status===4?'block':'none'}}>
                  <Tooltip placement="bottom" title="编辑">
                    <Icon className={[styles.cardIcon,styles.iconInterval]} theme="twoTone" type="edit" onClick={() => this.doubleClick(item)}/>
                  </Tooltip>
                  <Tooltip placement="bottom" title="删除">
                    <Icon className={[styles.cardIcon,styles.iconInterval]} type="delete" theme={'twoTone'} twoToneColor={'#eb2f96'} onClick={() => this.deleteRecord(item)}/>
                  </Tooltip>
                  <Tooltip placement="bottom" title="取消禁用">
                    <Icon className={[styles.cardIcon,styles.iconInterval]} theme="twoTone" twoToneColor={'red'} type={'lock'}  onClick={() => this.changeStatus(item)}/>
                  </Tooltip>
                </p>

                <p style={{lineHeight: 1,display:item.status===2?'block':'none'}}>
                  {/*<Tooltip placement="bottom" title="编辑">*/}
                    {/*<Icon className={[styles.cardIcon,styles.iconInterval]} theme="twoTone" type="edit" onClick={() => this.doubleClick(item)}/>*/}
                  {/*</Tooltip>*/}
                  <Tooltip placement="bottom" title="删除">
                    <Icon className={[styles.cardIcon,styles.iconInterval]} type="delete" theme={'twoTone'} twoToneColor={'#eb2f96'} onClick={() => this.deleteRecord(item)}/>
                  </Tooltip>
                </p>
              </Card>
            </List.Item>
          )}
        />
      );
    }

    /**
     * table列表 泊位状态 2-占用，3-空闲，4-禁用
     * @param data
     * @param loading
     */
    tableList(data, loading)
    {
      //泊位分页
      const pagination= {
        showQuickJumper: true,
        pageSize: 12,
        current:this.state.current,
        total:data.totalCount,
        onChange:(page, pageSize)=>{this.handleChange(page, pageSize)},
      }
      const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: '泊位编号',
          dataIndex: 'positionno',
        },
        {
          title: '状态',
          dataIndex: 'status',
          render:(text,index)=>{
            return Utils.getStatusName(text,carFieldStatus)
          }
        },
        {
          title: '车牌',
          dataIndex: 'carno',
        },
        {
          title: '停车费用',
          dataIndex: 'fee',
          render: (text, record) => {
            return `${Utils.isNotNull(text)?`￥${text} 元`:''}`
          }
        },
        {
          title: '停车时长',
          dataIndex: 'parktime',
          render: (text, record) => {
            return `${Utils.isNotNull(text)?`${text} 分钟`:''}`
          }
        },
        {
          title: '设备ID',
          dataIndex: 'deviceid'
        },
        {
          title: '摄像头',
          dataIndex: 'camera',
          render:(text,index)=>{
            return Utils.getStatusName(text,cameraStatus)
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (text, record) => {
            return (
              <div>
                <div style={{display:record.status===3 || record.status===4?'block':'none'}}>
                  <Tooltip placement="bottom" title="编辑">
                    <Icon className={styles.cardIcon} type="edit" onClick={() => this.doubleClick(record)}/> &nbsp;&nbsp;&nbsp;
                  </Tooltip>
                  <Tooltip placement="bottom" title="删除">
                    <Icon type="delete" className={styles.cardIcon} onClick={() => this.deleteRecord(record)}/>
                  </Tooltip>
                </div>
                <div style={{display:record.status===2?'block':'none'}}>
                  <Tooltip placement="bottom" title="删除">
                    <Icon type="delete" className={styles.cardIcon} onClick={() => this.deleteRecord(record)}/>
                  </Tooltip>
                </div>
              </div>
            );
          },
        },
      ];
      return (
        <Table
          bordered
          loading={loading}
          dataSource={data.data}
          rowKey={record => record.id}
          columns={columns}
          rowClassName={this.setCarFieldName}
          pagination={Utils.isNotNull(data.data)?pagination:''}
          onRow={(record, index) => ({
            onClick: () => {
              this.selectCarFieldRow(record, index, true, this.state.page);
            },
            onDoubleClick: () => {
              this.doubleClick(record, index, this.state.page);
            }
          })}
        />
      )
    }

    /**
     * 饼状图
     * @returns {*}
     */
    analysis()
    {
      // 泊位状态数据
      const positionData = this.state.positionData;
      const {DataView} = DataSet;
      const data = [
        {item: '未使用', count: positionData.unused},
        {item: '已使用', count: positionData.used},
        {item: '禁止', count: positionData.ban},
      ];
      const dv = new DataView();
      dv.source(data).transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        // as: 'percent'
      });
      // const cols = {
      //   percent: {
      //     formatter: val => {
      //       // val = val * 100 + "%";
      //       return val;
      //     }
      //   }
      // };

      return (
        <Chart height={120} data={dv} padding={[-5, 0, 0, -400]}>
          <Coord type='theta' radius={0.75}/>
          <Axis name="count"/>
          <BizCharts.Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />

          <Geom
            type="intervalStack"
            position="count"
            color={['item' ,['#4DB39E', '#FF5722', '#C23531']]}
            tooltip={['item*count', (item, count) => {
              // percent = percent;
              return {
                name: item,
                value: count
              };
            }]}
            style={{lineWidth: 1, stroke: '#fff'}}
          >
            <Label
              content='count'
              offset={-20}
              textStyle={{
                rotate: 0,
                textAlign: "center",
                fontSize:10,
                // shadowBlur: 2,
                shadowColor: "rgba(0, 0, 0, .45)"
              }}
              formatter={(val, item) => {
              const name = item.point.item;
              const value = item.point.count;
              return value===0?'':name}}
            />
          </Geom>
        </Chart>
      );
    }

    render()
    {
      let {
        parkingManage: {data, carList},
        loading,
      } = this.props;
      if(JSON.stringify(data.data)==='[]'){
        carList=[]
      }
      const {parkingVisible, selectedRows, formType, showList, carFieldVisible, parkingRecord, areaVisible, areaRecord,settlementList} = this.state;


      const sliderColumn = [
        {
          title: '名称',
          dataIndex: 'name',
          render:Utils.overLength
        }, {
          title: '操作',
          width: 100,
          render: (text, record) => {
            return (
              <div>
                <div hidden={Utils.isNotNull(record.parkid) ? false : true} className={styles.alignCenter}>
                  <Icon className={styles.cardIcon} type="edit" onClick={() => this.updateFieldRecord(record)}/>&nbsp;&nbsp;&nbsp;
                  <Icon className={styles.cardIcon} type="delete" onClick={() => this.delArea(record)}/>
                </div>
                <div hidden={Utils.isNotNull(record.parkid) ? true : false} className={styles.alignCenter}>
                  <Icon className={styles.cardIcon} type="plus-circle" onClick={() => this.handleAreaVisible(record)}/>&nbsp;&nbsp;&nbsp;
                  <Icon className={styles.cardIcon} type="edit" onClick={() => this.updateParking(record)}/>&nbsp;&nbsp;&nbsp;
                  <Icon className={styles.cardIcon} type="delete" onClick={() => this.deleteParking(record)}/>
                </div>
              </div>
            );
          },
        },
      ];

      const parentMethods = {
        handleAdd: this.handleAdd,
        handleModalVisible: this.handleModalVisible,
        updateRecord: this.updateRecord,
        handleParkingVisible: this.handleParkingVisible,
        handleAreaVisible: this.handleAreaVisible,
        handParkingAdd:this.handParkingAdd,
        handleUpdatePark:this.handleUpdatePark,
        addArea:this.addArea,
        closeAreaVisible:this.closeAreaVisible,
        updateArea:this.updateArea,
        closeCarField:this.closeCarField,
        closeParkingVisible:this.closeParkingVisible,

      };
      //泊位分页
      const parkingPagination={
        simple:true ,
        pageSize: 10,
        total:data.totalCount,
        onChange:(page, pageSize)=>{this.parkingPageChange(page, pageSize)},
      }

      return (
        <PageHeaderLayout>
          <div>
            <Row>
              <Col span={7}>
                <Card bordered={true}>
                  <div className={styles.tableList}>
                    <div className={styles.tableListOperator}>{this.renderParkingForm()}</div>
                    <div className={styles.tableList}>
                      <Table
                        bordered
                        rowKey={record => `${record.id}${record.parkid}`}
                        loading={loading}
                        dataSource={data.data}
                        columns={sliderColumn}
                        pagination={parkingPagination}
                        rowClassName={this.setClassName}
                        onRow={(record, index) => ({
                          onClick: () => {
                            this.selectRow(record, index, true, this.state.page);
                          },
                        })}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={17}>
                <Card bordered={true}>
                  <div className={styles.tableList}>
                    <div className={styles.tableListForm}></div>
                    <div>{this.analysis()}</div>
                    <div className={styles.tableListOperator}>{this.renderSimpleForm()}</div>
                    {showList ? this.tableList(carList, loading) : this.cardList(carList, loading)}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
          <CarFieldForm {...parentMethods} carFieldVisible={carFieldVisible} parkingRecord={parkingRecord}
                        selectedRows={selectedRows} formType={formType}  areaRecord={areaRecord}/>
          <ParkingForm {...parentMethods} parkingVisible={parkingVisible} parkingRecord={parkingRecord}
                       formType={formType} settlementList={settlementList}/>
          <AreaForm {...parentMethods} settlementList={settlementList} areaVisible={areaVisible} areaRecord={areaRecord} parkingRecord={parkingRecord} formType={formType}/>
        </PageHeaderLayout>
      );
    }
  }
