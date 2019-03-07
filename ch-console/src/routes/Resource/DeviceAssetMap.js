import React, { PureComponent } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select, TreeSelect, Table, Modal, message, Upload, Tooltip } from 'antd';
import { Map, Marker, InfoWindow } from 'rc-bmap';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './DeviceAssetMap.less';
import { connect } from 'dva';
import Common from '../../common/Common';
import carFieldStatus from '../../common/Enum';
import {sexStatus, dutyStatus, employeeType, enableStatus} from '../../common/Enum'
import disable from '../../assets/disable.png';
import disableDis from '../../assets/disableDis.png';
import occupation from '../../assets/occupation.png';
import occupationDis from '../../assets/occupationDis.png';
import vacancy from '../../assets/vacancy.png';
import vacancyDis from '../../assets/vacancyDis.png';
import vacancyPile from '../../assets/vacancyPile.png';

const Utils = new Common();

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_881793_6spyoib1fna.js',
});
const Option = Select.Option;

// 地图坐标---上海
const markerPoint = {
  lng: 121.48,
  lat: 31.22,
};

const markerPoint1 = {
  lng: 121.56,// r.point.lng,
  lat:31.23,
};

@connect(({ deviceAsset, loading }) => ({
  deviceAsset,
  // loading: loading.effects['deviceAsset/deviceByOrg'],
}))
@Form.create()
export default class Operational extends PureComponent {

  state = {
    icon: {
      url: vacancyPile,
      size: {
        width: 18,
        height: 18,
      },
    },
    deviceData: [], // 设备数据
    markerListItem: [],
    pointLabel: '',  // 标注的Label
    pointLabelList: [],  // 标注的Label
    selectedId: '',  // 选中行的Id
    parkData: [], // 停车场片区数据

    // 标识，vacancyStatus 空闲状态
    // occupationStatus 占用状态
    // disableStatus 禁用状态
    vacancyStatus: false,
    occupationStatus: false,
    disableStatus: false,

    // 标识，用于标注展示的数据
    parkLabelData: [],

    // 标识，用于判断是否展示label标签
    labelStatus: '',
  };

  componentDidMount() {
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    // dispatch({
    //   type: 'deviceAsset/fetchDeviceByOrg',
    //   payload: {
    //     // page:this.state.page,
    //     // ...this.state.formValues,
    //     orgid: 104,
    //   },
    //   callback: response => {
    //     if(response.success) {
    //       const markerListItem = this.getMarkerListItem(response.data);
    //       this.setState({
    //         markerListItem: markerListItem,
    //         deviceData: response.data,
    //       });
    //     } else {
    //       message.error('数据加载失败');
    //     }
    //   }
    // });
    dispatch({
      type: 'deviceAsset/fetchDeviceToMap',
      payload: {},
      callback: response => {
        if(response.success) {
          const markerListItem = this.getMarkerListItem(response.data);
          this.setState({
            markerListItem: markerListItem,
            deviceData: response.data,
            parkLabelData: response.data,
          });
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

  // 点击标注响应事件
  handleIconClick = (e, item) => {
    console.log(e);
    const labelStatus = this.state.labelStatus;
    if (item.id === labelStatus) {
      this.clearMarkerLabel();
      this.setState({
        labelStatus: '',
        selectedId: '',
      });
    } else {
      this.setLable(item);
      this.setState({
        labelStatus: item.id,
        selectedId: '',
      });
    }
  };

  // 获取标注信息
  getMarkerListItem = (data) => {
     const mapList = data.map((item) => {
        return <Marker
          enableMassClear={false}
          key={item.id}
          point={{ lng : item.lng, lat:  item.lat}}
          icon={this.state.icon}
          shadow={null}
          // raiseOnDrag={null}
          events={{
            click: (e) => {
              this.handleIconClick(e, item);
            }
          }}
        />
      });
    return mapList;
  };

  setClassName = (trId) => {
    const {selectedId} = this.state;
    return (trId === selectedId ? `${styles.color}` : '')
  };

  // table 数据
  getTableData = (deviceData) => {
    if (deviceData.length > 0) {
      const data = deviceData.map((item, index) => {
        return (
          <tr id={`tr${index+1}`} key={item.id} style={{cursor: 'pointer'}} onClick={() => {this.selectedDevice(item,`tr${index+1}` )}} className={this.setClassName(`tr${index+1}`)}>
            <td style={{width: 111, height: 30}}>
              <span style={{color: '#000', fontSize: 14}}>
                {item.deviceno}
              </span>
            </td>
            <td>
              {/*<span style={{color: '#4AA8FF'}}>*/}
                {/*{'空闲'}*/}
              {/*</span>*/}
              {this.getTableSpanLabel(item.leftPosition)}
            </td>
            <td>
              {/*<span style={{color: '#F5323D'}}>*/}
                {/*{'占用'}*/}
              {/*</span>*/}
              {this.getTableSpanLabel(item.rightPosition)}
            </td>
          </tr>
        )
      });
      return data;
    } else {
      return (
        <tr>
          <td colSpan="3">暂无数据</td>
        </tr>
      )
    }
  };

  // 点击空闲泊位图标
  handleVacancyIconClick = () => {
    console.log('空闲');
    const data = this.state.deviceData;
    const { vacancyStatus } = this.state;
    const map= this.map.map;
    // if(Utils.isNotNull(this.state.pointLabelList)){
    //   // 清除地图上已存在标注
    //   this.clearMarkerLabel();
    //   this.setState({
    //     selectedId: '',
    //   });
    // }else{
    //   // 清除地图上已存在标注
    //   this.clearMarkerLabel();
    //   const markerLabel = data.map(item => {
    //     if (item.leftPosition.status === "3" || item.rightPosition.status === "3") {
    //       return this.setLable(item);
    //     }
    //   });
    //   this.setState({
    //     pointLabelList: markerLabel,
    //     selectedId: '',
    //   });
    // }
    let parkLabelData = [];
    const markerLabel = data.map(item => {
      if (item.leftPosition.status === "3" || item.rightPosition.status === "3") {
        parkLabelData.push(item);
      }
    });
    // 清除地图上的标注信息
    this.clearMarkerLabel();
    // 如果当前空闲状态是选中的则置灰，且删除所有空闲数据
    if (vacancyStatus) {
      this.setState({
        parkLabelData: [],
        vacancyStatus: false,
        occupationStatus: false,
        disableStatus: false,
        selectedId: '',
      });
    } else {
      this.setState({
        parkLabelData: parkLabelData,
        vacancyStatus: true,
        occupationStatus: false,
        disableStatus: false,
        selectedId: '',
      });
    }

  };

  // 点击占用泊位图标
  handleOccupationIconClick = () => {
    console.log('占用');
    const data = this.state.deviceData;
    const { occupationStatus } = this.state;
    // 清除地图上已存在标注
    // if(Utils.isNotNull(this.state.pointLabelList)){
    //   // 清除地图上已存在标注
    //   this.clearMarkerLabel();
    //   this.setState({
    //     selectedId: '',
    //   });
    // }else{
    //   this.clearMarkerLabel();
    //   // 添加标注
    //   const markerLabel = data.map(item => {
    //     if (item.leftPosition.status === "2" || item.rightPosition.status === "2") {
    //       return this.setLable(item);
    //     }
    //   });
    //
    //   this.setState({
    //     pointLabelList: markerLabel,
    //     selectedId: '',
    //   });
    // }

    let parkLabelData = [];
    const markerLabel = data.map(item => {
      if (item.leftPosition.status === "2" || item.rightPosition.status === "2") {
        parkLabelData.push(item);
      }
    });
    // 清除地图上的标注信息
    this.clearMarkerLabel();
    // 如果当前占用状态是选中的则置灰，且删除所有占用数据
    if (occupationStatus) {
      this.setState({
        parkLabelData: [],
        vacancyStatus: false,
        occupationStatus: false,
        disableStatus: false,
        selectedId: '',
      });
    } else {
      this.setState({
        parkLabelData: parkLabelData,
        vacancyStatus: false,
        occupationStatus: true,
        disableStatus: false,
        selectedId: '',
      });
    }

  };

  // 点击禁用泊位图标
  handleDisableIconClick = () => {
    console.log('禁用');
    const data = this.state.deviceData;
    const { disableStatus } = this.state;
    // if(Utils.isNotNull(this.state.pointLabelList)){
    //   // 清除地图上已存在标注
    //   this.clearMarkerLabel();
    //   this.setState({
    //     selectedId: '',
    //   });
    // }else {
    //   // 清除地图上已存在标注
    //   this.clearMarkerLabel();
    //
    //   // 添加标注
    //   const markerLabel = data.map(item => {
    //     if (item.leftPosition.status === "4" || item.rightPosition.status === "4") {
    //       return this.setLable(item);
    //     }
    //   });
    //
    //   this.setState({
    //     pointLabelList: markerLabel,
    //     selectedId: '',
    //   });
    // }

    let parkLabelData = [];
    const markerLabel = data.map(item => {
      if (item.leftPosition.status === "4" || item.rightPosition.status === "4") {
        parkLabelData.push(item);
      }
    });
    // 清除地图上的标注信息
    this.clearMarkerLabel();
    // 如果当前禁用状态是选中的则置灰，且删除所有禁用数据
    if (disableStatus) {
      this.setState({
        parkLabelData: [],
        vacancyStatus: false,
        occupationStatus: false,
        disableStatus: false,
        selectedId: '',
      });
    } else {
      this.setState({
        parkLabelData: parkLabelData,
        vacancyStatus: false,
        occupationStatus: false,
        disableStatus: true,
        selectedId: '',
      });
    }

  };

  // 选择设备列表中某一行
  selectedDevice = (item, trId) => {
    this.setState({
      selectedId: trId,
    });
    console.log(item, 'item', trId, 'e');
    this.setLable(item, false, true);
  };

  // 文本标签
  setLable = (item, isClickIcon, isPosition) => {
    console.log(isClickIcon);

    const lng = item.lng;
    const lat = item.lat;

    const map=this.map.map;
    const BMap=window.BMap;
    let point = new BMap.Point(lng,lat);
    // 是否设置中心位置
    if (isPosition) {
      map.centerAndZoom(point, 16);
    }
    let opts = {
      position : point,    // 指定文本标注所在的地理位置
      offset   : new BMap.Size(-75,-100)    //设置文本偏移量
    };

    const container = `<div>
                        <span style="color: black; font-size: 12px">${item.deviceno}</span>
                       </div>
                       <div>
                        <span style="color: black; font-size: 12px">左泊位：${this.getSpanLabel(item.leftPosition).toString()}</span>
                       </div>                            
                       <div>
                        <span style="color: black; font-size: 12px">右泊位：${this.getSpanLabel(item.rightPosition).toString()}</span>
                       </div>`

    let label = new BMap.Label(container, opts);  // 创建文本标注对象
    label.setStyle({
      color : "blue",
      width : "144px",
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

    if (!isClickIcon) {
      // 不是点击图标
      // 清除上一个标注
      this.clearMarkerLabel();
      // 添加标注
      map.addOverlay(label);

      this.setState({
        pointLabel: label,
      });
    } else {
      // 点击图标，显示标注
      map.addOverlay(label);
    }

    return label;
  };

  // 清除地图上的标注
  clearMarkerLabel = (isClickIcon) => {
    const { pointLabel, pointLabelList } = this.state;
    const map = this.map.map;
    // 清除标注
    if (pointLabelList.length > 0) {
      pointLabelList.map(item => {
        map.removeOverlay(item);
      });
    }
    if (Utils.isNotNull(pointLabel)) {
      map.removeOverlay(pointLabel);
    }

    if (!isClickIcon) {
      map.clearOverlays();
      this.setState({
        pointLabelList: [],
      });
    }
  };

  // 获取标签展示信息
  getSpanLabel = (item) => {
    let spanLabel;
    // const kongxian = `<span style="color: #4AA8FF;">空闲</span>`;
    // const zhanyong = `<span>${item.carno}</span>`;
    // const jinyong = `<span style="color: #F5323D;">禁用</span>`;

    if (Utils.isNotNull(item)) {
      switch (item.status) {
        case "1":
          spanLabel = `<span style="color: #F5323D;">禁用</span>`;
          break;
        case "2":
          spanLabel = `<span>${item.carno}</span>`;
          break;
        case "3":
          spanLabel = `<span style="color: #4AA8FF;">空闲</span>`;
          break;
        default:
          spanLabel = `<span style="color: #4AA8FF;">空闲</span>`;
      }
    } else {
      spanLabel = `<span></span>`;
    }

    return spanLabel;
  };

  // 获取表格展示信息
  getTableSpanLabel = (item) => {
    let spanLabel;
    const kongxian = <span style={{color: '#4AA8FF'}}>空闲</span>;
    const zhanyong = <span style={{color: '#FCB76E'}}>占用</span>;
    const jinyong = <span style={{color: '#F5323D'}}>禁用</span>;
    const kong = <span style={{color: '#000000'}}></span>;
    if (Utils.isNotNull(item)) {
      switch (item.status) {
        case "1":
          spanLabel = jinyong;
          break;
        case "2":
          spanLabel = zhanyong;
          break;
        case "3":
          spanLabel = kongxian;
          break;
        default:
          spanLabel = kongxian;
      }
    } else {
      spanLabel = kong;
    }
    return spanLabel;
  };

  // 停车场下拉框改变触发
  onParkChange = (value,lable,extra) => {
    const { dispatch } = this.props;
    console.log(value,lable,extra);

    // 清除地图上的标注信息
    this.clearMarkerLabel();
    // 清除选中项
    this.setState({
      selectedId: '',
    });

    // 如果value不为空，按选中的停车场或片区进行查询
    if (Utils.isNotNull(value)) {
      // 选中的是停车场
      if (value.indexOf("park-") !== -1) {
        // 切割
        const parkId =value.split("park-")[1];

        console.log('停车场Id：' + parkId);
        // 根据停车场获取泊位信息
        dispatch({
          type: 'deviceAsset/fetchDeviceToMap',
          payload: {
            page: {
              start: 1,
              limit: '',
            },
            parkid: parkId,
          },
          callback: response => {
            if(response.success) {
              const markerListItem = this.getMarkerListItem(response.data);
              this.setState({
                markerListItem: markerListItem,
                deviceData: response.data,
                parkLabelData: response.data,
                vacancyStatus: false,
                occupationStatus: false,
                disableStatus: false,
              });
            } else {
              message.error('数据加载失败');
            }
          }
        });
      } else {
        // 选中的是片区
        // 切割
        const areaid =value.split("position-")[1];

        console.log('片区Id：' + areaid);
        // 根据片区获取泊位信息
        dispatch({
          type: 'deviceAsset/fetchDeviceToMap',
          payload: {
            page: {
              start: 1,
              limit: '',
            },
            areaid: areaid,
          },
          callback: response => {
            if(response.success) {
              const markerListItem = this.getMarkerListItem(response.data);
              this.setState({
                markerListItem: markerListItem,
                deviceData: response.data,
                parkLabelData: response.data,
                vacancyStatus: false,
                occupationStatus: false,
                disableStatus: false,
              });
            } else {
              message.error('数据加载失败');
            }
          }
        });
      }
    } else {
      this.getData();
    }
  };

  render() {
    // 设备数据
    // const { deviceAsset: { deviceDataByOrg } } = this.props;
    const { parkLabelData, vacancyStatus, occupationStatus, disableStatus } = this.state;

    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <div className={styles.map}>
            <Map ref={ ref => this.map = ref } ak="WAeVpuoSBH4NswS30GNbCRrlsmdGB5Gv" center={markerPoint} zoom={12} scrollWheelZoom={true} massClear={false} >
              {this.getMarkerListItem(parkLabelData)}
            </Map>
          </div>
          <div>
            <div className={styles.divIcon}>
              <div className={styles.divIconImg}>
                <Tooltip placement="bottom" title="空闲">
                  <img style={{width: 40, height: 40}} src={vacancyStatus ? vacancy : vacancyDis} onClick={() => this.handleVacancyIconClick()} />
                </Tooltip>
              </div>
              <div className={styles.divIconImg}>
                <Tooltip placement="bottom" title="占用">
                  <img style={{width: 40, height: 40}} src={occupationStatus ? occupation : occupationDis} onClick={() => this.handleOccupationIconClick()} />
                </Tooltip>
              </div>
              <div className={styles.divIconImg}>
                <Tooltip placement="bottom" title="禁用">
                  <img style={{width: 40, height: 40}} src={disableStatus ? disable : disableDis} onClick={() => this.handleDisableIconClick()} />
                </Tooltip>
              </div>
            </div>
            <div className={styles.divC}>
              <div>
                <div className={styles.divFont}>
                  <span style={{fontSize: 18, color: '#151515'}}>
                    设备列表
                  </span>
                </div>

                <div className={styles.divSelect}>
                  {/*<Select placeholder="请选择停车场片区 " style={{width: 208}}>*/}
                    {/*<Option value="1">A区</Option>*/}
                    {/*<Option value="2">B区</Option>*/}
                    {/*<Option value="3">C区</Option>*/}
                  {/*</Select>*/}
                  <TreeSelect
                    style={{ width: 208 }}
                    dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                    placeholder="请选择停车场片区"
                    allowClear
                    treeDefaultExpandAll
                    onChange={this.onParkChange}
                  >
                    {Utils.loopPark(this.state.parkData)}
                  </TreeSelect>
                </div>

                <div className={styles.divTable}>

                  <table border="1" className={styles.deviceTable}>
                    <thead className={styles.deviceTableThead}>
                      <tr>
                        <th rowSpan="2" style={{width: 111}}>
                          <div>设备编号</div>
                        </th>
                        <th colSpan="2">
                          <div>状态</div>
                        </th>
                      </tr>
                      <tr>
                        <th>
                          <div>左</div>
                        </th>
                        <th>
                          <div>右</div>
                        </th>
                      </tr>
                    </thead>
                  </table>

                  <div>
                    <table border="1" className={styles.deviceTable}>
                      <tbody>
                      {/*<tr>*/}
                      {/*<td>001</td>*/}
                      {/*<td>空闲</td>*/}
                      {/*<td>占用</td>*/}
                      {/*</tr>*/}
                      {/*<tr>*/}
                      {/*<td>002</td>*/}
                      {/*<td>空闲</td>*/}
                      {/*<td>占用</td>*/}
                      {/*</tr>*/}
                      {/*<tr>*/}
                      {/*<td>003</td>*/}
                      {/*<td>空闲</td>*/}
                      {/*<td>占用</td>*/}
                      {/*</tr>*/}

                      {this.getTableData(parkLabelData)}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
