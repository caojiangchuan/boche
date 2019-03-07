import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card, Col,
  Form, Icon, Input, Row,
  Table, Tabs,
  Select, Modal, message,
  Tooltip,
  TreeSelect
} from 'antd';
import { Map, Marker, Label, InfoWindow } from 'rc-bmap';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DeviceAsset.less';
import Common from '../../common/Common';
import {assetStatus, enableStatus} from '../../common/Enum';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const Utils = new Common();
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_881793_kypju41t9pi.js',
});

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// const BMap = window.BMap;

const markerPoint = {
  lng: 121.48,
  lat: 31.22,
};

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleUpdate, handleCancel, formType, selectedRows} = props;
  // console.log(selectedRows);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      // console.log(fieldsValue, 'fieleds');
      if (err) return;
      // 新增
      if (formType === 'add') {
        handleAdd(fieldsValue);
        form.resetFields();
      } else if (formType === 'update') {
        let params = fieldsValue;
        // 添加主键id
        params.id = selectedRows.id;
        // 修改
        handleUpdate(params);
        // form.resetFields();
      }
    });
  };
  const formItemLayout = {labelCol: {span: 7}, wrapperCol: {span: 17}};
  return (
    <Modal
      title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
      width={900}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
    >
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="设备编号">
            {form.getFieldDecorator('deviceno', {
              rules: [{required: true, message: '请输入设备编号'}],
              initialValue: Utils.isNotNull(selectedRows.deviceno) ? selectedRows.deviceno : '',
            })(<Input/>)}
          </FormItem>
        </Col>
        <Col span={10} style={{marginLeft:10}}>
          <FormItem {...formItemLayout} label="设备型号">
            {form.getFieldDecorator('devicemodel', {
              rules: [{required: true, message: '请输入设备型号'}],
              initialValue: Utils.isNotNull(selectedRows.devicemodel) ? selectedRows.devicemodel : '',
            })(<Input/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="厂商">
            {form.getFieldDecorator('manufacturer', {
              rules: [{required: true, message: '请输入厂商'}],
              initialValue: Utils.isNotNull(selectedRows.manufacturer) ? selectedRows.manufacturer : '',
            })(<Input/>)}
          </FormItem>
        </Col>
        <Col span={10} style={{marginLeft:10}}>
          <FormItem {...formItemLayout} label="资产状态">
            {form.getFieldDecorator('assetstatus', {
              rules: [
                { required: true, message: '请选择资产状态' },
              ],
              initialValue: Utils.isNotNull(selectedRows.assetstatus) ? `${selectedRows.assetstatus}` : '',
            })(
              <Select placeholder="资产状态" style={{width: 251}}>
                {Utils.dropDownOption(assetStatus, 'value', 'name')}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="设备id">
            {form.getFieldDecorator('deviceid', {
              rules: [{required: true, message: '请输入设备id'}],
              initialValue: Utils.isNotNull(selectedRows.deviceid) ? selectedRows.deviceid : '',
            })(<Input/>)}
          </FormItem>
        </Col>
        <Col span={10} style={{marginLeft:10}}>
          <FormItem {...formItemLayout} label="采购单价">
            {form.getFieldDecorator('price', {
              rules: [{required: true, message: '请输入采购单价'}],
              initialValue: Utils.isNotNull(selectedRows.price) ? selectedRows.price : '',
            })(<Input/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="维修费用">
            {form.getFieldDecorator('upkeepcost', {
              rules: [{required: true, message: '请输入维修费用'}],
              initialValue: Utils.isNotNull(selectedRows.upkeepcost) ? selectedRows.upkeepcost : '',
            })(<Input/>)}
          </FormItem>
        </Col>
        <Col span={10} style={{marginLeft:10}}>
          <FormItem {...formItemLayout} label="sos号码">
            {form.getFieldDecorator('sosnum', {
              rules: [{required: true,pattern: new RegExp(/^[0-9]\d*$/, "g"), message: '请输入sos号码'}],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/\D/g,'')
              },
              initialValue: Utils.isNotNull(selectedRows.sosnum) ? selectedRows.sosnum : '',
            })(<Input/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="左摄像头">
            {form.getFieldDecorator('leftcamera', {
              rules: [{required: true, message: '请选择做摄像头状态'}],
              initialValue: Utils.isNotNull(selectedRows.leftcamera) ? `${selectedRows.leftcamera}` : '',
            })(
              <Select placeholder="左摄像头" style={{width: 251}}>
                {Utils.dropDownOption(enableStatus, 'value', 'name')}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={10} style={{marginLeft:10}}>
          <FormItem {...formItemLayout} label="右摄像头">
            {form.getFieldDecorator('rightcamera', {
              rules: [{required: true, message: '请选择右摄像头状态'}],
              initialValue: Utils.isNotNull(selectedRows.rightcamera) ? `${selectedRows.rightcamera}` : '',
            })(
              <Select placeholder="右摄像头" style={{width: 251}}>
                {Utils.dropDownOption(enableStatus, 'value', 'name')}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="FM">
            {form.getFieldDecorator('fm', {
              rules: [{required: true, message: '请选择FM状态'}],
              initialValue: Utils.isNotNull(selectedRows.fm) ? `${selectedRows.fm}` : '',
            })(
              <Select placeholder="FM" style={{width: 251}}>
                {Utils.dropDownOption(enableStatus, 'value', 'name')}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={10} style={{marginLeft:10}}>
          <FormItem {...formItemLayout} label="蓝牙">
            {form.getFieldDecorator('bluetooth', {
              rules: [{required: true, message: '请选择蓝牙状态'}],
              initialValue: Utils.isNotNull(selectedRows.bluetooth) ? `${selectedRows.bluetooth}` : '',
            })(
              <Select placeholder="蓝牙" style={{width: 251}}>
                {Utils.dropDownOption(enableStatus, 'value', 'name')}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="WIFI">
            {form.getFieldDecorator('wifi', {
              rules: [{required: true, message: '请选择WIFI状态'}],
              initialValue: Utils.isNotNull(selectedRows.wifi) ? `${selectedRows.wifi}` : '',
            })(
              <Select placeholder="WIFI" style={{width: 251}}>
                {Utils.dropDownOption(enableStatus, 'value', 'name')}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={10} style={{marginLeft:10}}>
          {/*<FormItem {...formItemLayout} label="地址信息">*/}
            {/*{form.getFieldDecorator('address', {*/}
              {/*rules: [{required: true, message: '请选择地址状态'}],*/}
              {/*initialValue: Utils.isNotNull(selectedRows.address) ? `${selectedRows.address}` : '',*/}
            {/*})(*/}
              {/*<Select placeholder="地址信息" style={{width: 251}}>*/}
                {/*{Utils.dropDownOption(enableStatus, 'value', 'name')}*/}
              {/*</Select>*/}
            {/*)}*/}
          {/*</FormItem>*/}
          <FormItem {...formItemLayout} label="应急通信">
            {form.getFieldDecorator('crisiscomm', {
              rules: [{required: true, message: '请选择应急通信状态'}],
              initialValue: Utils.isNotNull(selectedRows.crisiscomm) ? `${selectedRows.crisiscomm}` : '',
            })(
              <Select placeholder="应急通信" style={{width: 251}}>
                {Utils.dropDownOption(enableStatus, 'value', 'name')}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="呼叫巡查">
            {form.getFieldDecorator('callpatrol', {
              rules: [{required: true, message: '请选择呼叫巡查状态'}],
              initialValue: Utils.isNotNull(selectedRows.callpatrol) ? `${selectedRows.callpatrol}` : '',
            })(
              <Select placeholder="呼叫巡查" style={{width: 251}}>
                {Utils.dropDownOption(enableStatus, 'value', 'name')}
              </Select>
            )}
          </FormItem>
        </Col>
        {/*<Col span={10} style={{marginLeft:10}}>*/}
          {/*<FormItem {...formItemLayout} label="呼叫巡查">*/}
            {/*{form.getFieldDecorator('callpatrol', {*/}
              {/*rules: [{required: true, message: '请选择呼叫巡查状态'}],*/}
              {/*initialValue: Utils.isNotNull(selectedRows.callpatrol) ? `${selectedRows.callpatrol}` : '',*/}
            {/*})(*/}
              {/*<Select placeholder="呼叫巡查" style={{width: 251}}>*/}
                {/*{Utils.dropDownOption(enableStatus, 'value', 'name')}*/}
              {/*</Select>*/}
            {/*)}*/}
          {/*</FormItem>*/}
        {/*</Col>*/}
      </Row>
    </Modal>
  );
});

@connect(({ deviceAsset, loading }) => ({
  deviceAsset,
  loading: loading.models.deviceAsset,
}))
@Form.create()
export default class ParkingOrder extends PureComponent {
  state = {
    modalVisible: false,
    devicePositionModalVisible: false,
    formType: '',
    selectedRows: {},
    formValues: {},
    parkData: [],
    position: [], // 泊位
    parkSeleced: '', // 选中的停车场
    page:{
      start:1,
      limit:10,
    },
    totalCount: '',
    divShow: 'none',
  };

  componentDidMount() {
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'deviceAsset/fetchDevice',
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

    dispatch({
      type: 'parkingManage/fetch',
      payload: {page: {start: 1, limit: '',}},
      callback: (response) => {
        if (response.success && response.data.length > 0) {
          this.setState({
            parkData: response.data,
          });
        }
      }
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const parkOrPosition = fieldsValue.parkOrPosition;
      // debugger;
      if (Utils.isNotNull(parkOrPosition)) {
        // 添加搜索项-停车场id 或 片区id
        if (parkOrPosition.indexOf("park-") !== -1) {
          // 说明是停车场
          fieldsValue.parkid = parkOrPosition.split("park-")[1];
        } else {
          // 说明是片区
          fieldsValue.areaid = parkOrPosition.split("position-")[1];
        }

        // 删除parkOrPosition属性

        delete fieldsValue.parkOrPosition;
      }

      const values = {
        ...fieldsValue,
        page: this.state.page,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'deviceAsset/fetchDevice',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        },
      });
    });
  };

  // 重置搜索框
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    }, () => {
      this.getData();
    });
  };

  // 选择添加打开输入框
  handleAddModalVisible = () => {
    this.setState({
      modalVisible: true,
      selectedRows: {},
      formType: 'add',
    });
  };

  // 退出模态框(打开添加、修改框后取消)
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      selectedRows: {},
    });
  };

  /**
   * 修改
   */
  updateRecord = (text) => {
    this.doubleClick(text);
  };

  /**
   * 双击事件
   */
  doubleClick = text => {
    // console.log(text);
    this.setState({
      modalVisible: true,
      selectedRows: text,
      formType: 'update',
    });
  };

  // 添加
  handleAdd = fields => {
    // console.log(fields, 'fields');
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceAsset/addDevice',
      payload: fields,
      callback: (response) => {
        if (response.success){
          this.setState({
            page: {
              start: 1,
              limit: this.state.page.limit,
            }
          }, this.getData);
          message.success('添加成功');
        } else {
          message.success('添加失败');
        }
      },
    });
    this.setState({
      modalVisible: false,
    });
  };

  // 修改操作
  handleUpdate = fields => {
    const { dispatch } = this.props;
    // console.log(fields, 'fields update');
    dispatch({
      type: 'deviceAsset/updateDevice',
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
    // console.log('delete', key);
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceAsset/removeDevice',
      payload: key,
      callback: (response) => {
        // console.log(response.success);
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

  // 切换页码触发事件
  handleChange = (page) => {
    // console.log(page, 'page');
    this.setState({
      page: {
        start: page.current,
        limit: page.pageSize,
      }
    }, () => {
      this.getData();
    });
  };

  // 页码大小改变触发事件
  onShowSizeChange = (current, pageSize) => {
    // console.log(current, pageSize)
  };

  // 显示地图
  handleShowPosition = (item) => {
    // console.log(item);
    this.setState({
      selectedRows: item,
      divShow: 'block',
    }, () => {
      this.setLabel(item);
    });

  };

  // 关闭地图定位显示
  handlePositionCancel = () => {
    this.setState({
      selectedRows: {},
      divShow: 'none',
    });
  };

  // 停车场下拉框改变触发
  onParkChange = (value,lable,extra) => {
    const { dispatch } = this.props;
    // console.log(value,lable,extra);
    // console.log(value.indexOf("park-") !== -1);
    // const arr =value.split("park-");
    // console.log(arr);

    if (Utils.isNotNull(value)) {
      // 选中的是停车场
      if (value.indexOf("park-") !== -1) {
        // 切割
        const parkId =value.split("park-")[1];
        // 根据停车场获取泊位信息
        dispatch({
          type: 'parkingManage/getCarFieldList',
          payload: {id: parkId, page: {start: 1, limit: ''}},
          callback: (response) => {
            if (!response.success) {
              message.error("获取泊位信息异常")
            } else {
              this.setState({
                position: response.data,
              });
            }
          },
        });
      } else {
        // 选中的是片区
        // 切割
        const positionId =value.split("position-")[1];
        // 根据停车场获取泊位信息
        dispatch({
          type: 'parkingManage/getCarFieldListByArea',
          payload: {id: positionId, page: {start: 1, limit: ''}},
          callback: (response) => {
            if (!response.success) {
              message.error("获取泊位信息异常")
            } else {
              this.setState({
                position: response.data,
              });
            }
          },
        });
      }
    } else {
      this.setState({
        position: [],
      });
    }
  };

  // 泊位下拉选项
  getOption = list => {
    if (!list || list.length < 1) {
      return (
        <Option key={0} value={0}>
          没有找到选项
        </Option>
      );
    }
    return list.map(item => (
      <Option key={item.id} value={item.id}>
        {item.positionno}
      </Option>
    ));
  };

  // 获取下拉框选项内容
  getPositionOption = () => {
    const { position } = this.state;
    return this.getOption(position);
  };

  // 文本标签
  setLabel = (item) => {

    const lng = item.lng;
    const lat = item.lat;

    const { BMap } = window;
    const map = new BMap.Map("bmap",{enableMapClick:false}); // 创建Map实例

    let point = new BMap.Point(lng,lat);
    let marker = new BMap.Marker(point);  // 创建标注
    map.centerAndZoom(point, 18); // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    let opts = {
      position : point,    // 指定文本标注所在的地理位置
      offset   : new BMap.Size(-100,-120)    //设置文本偏移量
    };

    const container = `<div>
                        <span style="color: black; font-size: 12px">设备编号：${item.deviceno}</span>
                       </div>
                       <div>
                        <span style="color: black; font-size: 12px">设备型号：${item.devicemodel}</span>
                       </div>                            
                       <div>
                        <span style="color: black; font-size: 12px">厂商：${item.manufacturer}</span>
                       </div>`;

    let label = new BMap.Label(container, opts);  // 创建文本标注对象
    label.setStyle({
      color : "blue",
      width : "200px",
      height : "85px",
      lineHeight : "22px",
      border : "1px solid #FFFFFF",
      fontFamily:"微软雅黑",
      fontSize: '14px',
      fontWeight: 'bold',
      cursor:"pointer",
      padding: '8px 0 4px 12px',
      borderRadius:"8px",
    });

    map.addOverlay(label); // 添加文本标注
    map.addOverlay(marker); // 中心点位置标注
  };

  renderSearchForm = (data) => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const layout = {};
    return (
      <div className={styles.searchItem}>
        <Form onSubmit={this.handleSearch}>
          <Row gutter={{xs: 8, sm: 16, md: 24}}>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('assetstatus', {})(
                  <Select placeholder="资产状态" allowClear>
                    {Utils.dropDownOption(assetStatus, 'value', 'name')}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem {...layout}>
                {getFieldDecorator('deviceno', {})(<Input placeholder="设备编号" />)}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator('parkOrPosition', {})(<TreeSelect
                  // style={{ width: 160 }}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                  placeholder="请选择停车场片区"
                  allowClear
                  treeDefaultExpandAll
                  onChange={this.onParkChange}
                >
                  {Utils.loopPark(data)}
                </TreeSelect>)}
              </FormItem>
            </Col>

            <Col span={3}>
              <FormItem {...layout}>
                {getFieldDecorator('position', {})(
                  <Select placeholder="泊位" allowClear showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {/*{Utils.dropDownOption(assetStatus, 'value', 'name')}*/}
                    {this.getPositionOption()}
                  </Select>
                )}
                {/*<Input placeholder="泊位" />*/}
              </FormItem>
            </Col>
            <Col span={2}>
              <Button style={{ marginTop: 5 }} type="primary" htmlType="submit">
                搜索
              </Button>
            </Col>
            <Col span={2}>
              <Button style={{ marginTop: 5 }} onClick={this.handleFormReset} type="primary">
                重置
              </Button>
            </Col>
            <Col span={2}>
              <Button style={{ marginTop: 5 }} type="primary" onClick={this.handleAddModalVisible}>
                新增
              </Button>
            </Col>
            {/*<Col span={2}>*/}
              {/*<Button style={{ marginTop: 5 }} type="primary" htmlType="submit">*/}
                {/*导入*/}
              {/*</Button>*/}
            {/*</Col>*/}
          </Row>
        </Form>
      </div>
    )
  };

  render() {
    const { deviceAsset: { data }, loading } = this.props;

    const parentMethods = {
      modalVisible: this.state.modalVisible,
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleCancel: this.handleCancel,
      formType: this.state.formType,
      selectedRows: this.state.selectedRows,
    };

    // 订单详细信息
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'deviceno',
        width: 200,
      },
      {
        title: '设备型号',
        dataIndex: 'devicemodel',
        width: 200,
      },
      {
        title: '厂商',
        dataIndex: 'manufacturer',
        width: 200,
      },
      {
        title: '资产状态',
        dataIndex: 'assetstatus',
        width: 200,
        render: (text,index)=>{
          return Utils.getStatusName(text,assetStatus)
        }
      },
      {
        title: '设备ID',
        dataIndex: 'deviceid',
        width: 200,
      },
      {
        title: '采购单价',
        dataIndex: 'price',
        width: 200,
      },
      {
        title: '维修费用',
        dataIndex: 'upkeepcost',
        width: 200,
      },
      {
        title: 'sos号码',
        dataIndex: 'sosnum',
        width: 200,
      },
      {
        title: '左摄像头',
        dataIndex: 'leftcamera',
        width: 150,
        render: (text,index)=>{
          return Utils.getStatusName(text,enableStatus)
        }
      },
      {
        title: '右摄像头',
        dataIndex: 'rightcamera',
        width: 150,
        render: (text,index)=>{
          return Utils.getStatusName(text,enableStatus)
        }
      },
      {
        title: 'FM',
        dataIndex: 'fm',
        width: 150,
        render: (text,index)=>{
          return Utils.getStatusName(text,enableStatus)
        }
      },
      {
        title: '蓝牙',
        dataIndex: 'bluetooth',
        width: 150,
        render: (text,index)=>{
          return Utils.getStatusName(text,enableStatus)
        }
      },
      {
        title: 'WIFI',
        dataIndex: 'wifi',
        width: 150,
        render: (text,index)=>{
          return Utils.getStatusName(text,enableStatus)
        }
      },
      {
        title: '地址信息',
        dataIndex: 'address',
        width: 150,
        render: (text,index)=>{
          return  Utils.getStatusName(text,enableStatus)
        }
      },
      {
        title: '应急通信',
        dataIndex: 'crisiscomm',
        width: 150,
        render: (text,index)=>{
          return Utils.getStatusName(text,enableStatus)
        }
      },
      {
        title: '呼叫巡查',
        dataIndex: 'callpatrol',
        render: (text,index)=>{
          return Utils.getStatusName(text,enableStatus)
        }
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (currentItem) => (
          <div>
            <div className={styles.editButton}>
              <Tooltip placement="bottom" title="设备位置">
                <div className="icons-list">
                  <IconFont type="icon-position" onClick={() => this.handleShowPosition(currentItem)} />
                </div>
              </Tooltip>
            </div>
            <div className={styles.editButton}>
              <Tooltip placement="bottom" title="点击修改">
                <Icon type="edit" onClick={() => this.updateRecord(currentItem)} />
              </Tooltip>
            </div>
            <div className={styles.editButton}>
              <Tooltip placement="bottom" title="点击删除">
                <Icon type="delete" onClick={() => this.deleteConfirm(currentItem.id)} />
              </Tooltip>
            </div>
          </div>
        ),
      },
    ];

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: data.totalCount,
      // pageSizeOptions: ['10', '15', '20'],
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.containerDiv}>
            <div className={styles.tabDiv}>
              <div className={styles.tabContainer}>
                <Tabs type="card">
                  <TabPane tab="智慧桩" key="1">
                    <div>
                      {this.renderSearchForm(this.state.parkData)}
                    </div>
                    <Table
                      loading={loading}
                      columns={columns}
                      rowKey={record => record.id}
                      dataSource={data.data}
                      bordered
                      pagination={pagination}
                      onChange={this.handleChange}
                      scroll={{ x: 3000 }}
                      onRow={text => ({
                        onDoubleClick: () => {
                          this.doubleClick(text);
                        },
                      })}
                    />


                    <div className={styles.divBackground} style={{ display: this.state.divShow }}>
                      <div className={styles.div1}>
                        <div className={styles.close}>
                          <span className={styles.closeButton} onClick={this.handlePositionCancel}>×</span>
                          <h2 className={styles.spanTitle}>设备位置</h2>
                        </div>
                        <div className={styles.div2}>
                          <div id="bmap" style={{ width: '100%', height:  window.innerHeight/2}} ></div>
                        </div>
                      </div>
                    </div>

                    <CreateForm {...parentMethods} />
                  </TabPane>

                  {/*<TabPane tab="充电桩" key="2">*/}

                  {/*</TabPane>*/}
                  {/*<TabPane tab="智慧柜" key="3">*/}

                  {/*</TabPane>*/}
                  {/*<TabPane tab="泊位锁" key="4">*/}

                  {/*</TabPane>*/}
                  {/*<TabPane tab="智慧闸" key="5">*/}

                  {/*</TabPane>*/}
                  {/*<TabPane tab="诱导牌" key="6">*/}

                  {/*</TabPane>*/}
                  {/*<TabPane tab="高位枪机" key="7">*/}

                  {/*</TabPane>*/}
                  {/*<TabPane tab="网络设备" key="8">*/}

                  {/*</TabPane>*/}

                </Tabs>
              </div>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
