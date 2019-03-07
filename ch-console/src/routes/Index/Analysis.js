import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  DatePicker,
  Tooltip,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  Field,
} from '../../components/Charts';
import ChartInfo from './ChartInfo';
import { getTimeDistance } from '../../utils/utils';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './Analysis.less';

const { TabPane } = Tabs;

@connect(({ system, loading }) => ({
  system,
  loading: loading.models.system,
}))
export default class Analysis extends Component {
  state = {
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    appPerson:0,
    todayAppPerson:0,
    lawPerson:0,
    todayLawPerson:0,
    warningCount:0,
    todayWarningCount:0,
    deviceCounts:0,
    todayDeviceCount:0,
    appCount:[],
    deviceCount:[],
  };

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'system/fetchNotice',
  //     payload: {start:0, limit:5},
  //   });
  //   let startTime = new Date();
  //   let endTime = new Date();
  //   dispatch({
  //     type: 'system/fetchDeviceCount',
  //     payload: {devicetype:'1'},
  //     callback: () => {
  //       const {
  //         system: { deviceCount },
  //       } = this.props;
  //       this.setState({appPerson:deviceCount});
  //     },
  //   });
  //   dispatch({
  //     type: 'system/fetchDeviceCount',
  //     payload: {devicetype:'1',startTime:startTime,endTime:endTime},
  //     callback: () => {
  //       const {
  //         system: { deviceCount },
  //       } = this.props;
  //       this.setState({todayAppPerson:deviceCount});
  //     },
  //   });
  //
  //   dispatch({
  //     type: 'system/fetchDeviceCount',
  //     payload: {devicetype:'2'},
  //     callback: () => {
  //       const {
  //         system: { deviceCount },
  //       } = this.props;
  //       this.setState({lawPerson:deviceCount});
  //     },
  //   });
  //   //当天执法人员新增
  //   dispatch({
  //     type: 'system/fetchDeviceCount',
  //     payload: {devicetype:'2',startTime:startTime,endTime:endTime},
  //     callback: () => {
  //       const {
  //         system: { deviceCount },
  //       } = this.props;
  //       this.setState({todayLawPerson:deviceCount});
  //     },
  //   });
  //
  //   dispatch({
  //     type: 'system/fetchDeviceCount',
  //     payload: {devicetype:'3,4,5,6'},
  //     callback: () => {
  //       const {
  //         system: { deviceCount },
  //       } = this.props;
  //       this.setState({deviceCounts:deviceCount});
  //     },
  //   });
  //
  //   //当天设备数
  //   dispatch({
  //     type: 'system/fetchDeviceCount',
  //     payload: {devicetype:'3,4,5,6',startTime:startTime,endTime:endTime},
  //     callback: () => {
  //       const {
  //         system: { deviceCount },
  //       } = this.props;
  //       this.setState({todayDeviceCount:deviceCount});
  //     },
  //   });
  //
  //   dispatch({
  //     type: 'system/fetchWarningCount',
  //     payload: {},
  //     callback: () => {
  //       const {
  //         system: { warningCount },
  //       } = this.props;
  //       this.setState({warningCount:warningCount});
  //     },
  //   });
  //
  //   //当天警告数
  //   dispatch({
  //     type: 'system/fetchWarningCount',
  //     payload: {startTime:startTime,endTime:endTime},
  //     callback: () => {
  //       const {
  //         system: { warningCount },
  //       } = this.props;
  //       this.setState({todayWarningCount:warningCount});
  //     },
  //   });
  //
  //   dispatch({
  //     type: 'system/fetchCharInfo',
  //     payload: {devicetype:'1,2'},
  //     callback: () => {
  //       const {
  //         system: { chartInfo },
  //       } = this.props;
  //       this.setState({appCount:chartInfo});
  //     },
  //   });
  //
  //   dispatch({
  //     type: 'system/fetchCharInfo',
  //     payload: {devicetype:'3,4,5,6'},
  //     callback: () => {
  //       const {
  //         system: { chartInfo },
  //       } = this.props;
  //       this.setState({deviceCount:chartInfo});
  //     },
  //   });
  // }


  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }

  render() {
    const data ={list:[{title:'这是一个充电桩',createtime:'2018-10-30'}]};

    const appCount=[{x:1,y1:1,y2:5,y3:3},{x:2,y1:3,y2:8,y3:3}];

    const deviceCount=[{x:1,y1:13,y2:34},{x:2,y1:21,y2:55}];

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="违停数"
              action={
                <Tooltip title="违停数说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={100}
              footer={<Field label="日违停数数" value={8} />}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="停车次数"
              action={
                <Tooltip title="停车次数说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={123}
              footer={<Field label="日停车次数" value={20} />}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="新增用户数"
              action={
                <Tooltip title="新增用户说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={888}
              footer={<Field label="日新增用户数" value={12} />}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="收入"
              action={
                <Tooltip title="收入说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={184}
              footer={<Field label="日收入" value={6} />}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{width:'75%'}}>
            <Card
              // loading={loading}
              bordered={false}
              // extra={iconGroup}
              style={{ marginTop: 24, minHeight: 509 }}
            >
              <Tabs>
                <TabPane tab="设备新增" key="1">
                  <Row>
                    <Col>
                      <div style={{ marginLeft:-30}}>
                        <ChartInfo data={appCount  === undefined ? [] : appCount} titleMap={{ y1: '总用户数', y2: '日新增数'}} />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="新增用户" key="2">
                  <Row>
                    <Col>
                      <div>
                        <div style={{ marginLeft:-30}}>
                          <ChartInfo data={deviceCount  === undefined ? [] : deviceCount} titleMap={{ y1: '总设备数', y2: '日新增数'}} />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="停车次数" key="3">
                  <Row>
                    <Col>
                      <div>
                        <div style={{ marginLeft:-30}}>
                          <ChartInfo data={deviceCount  === undefined ? [] : deviceCount} titleMap={{ y1: '总设备数', y2: '日新增数'}} />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="收入数" key="4">
                  <Row>
                    <Col>
                      <div>
                        <div style={{ marginLeft:-30}}>
                          <ChartInfo data={deviceCount  === undefined ? [] : deviceCount} titleMap={{ y1: '总设备数', y2: '日新增数'}} />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{width:'25%'}}>
            <Card
              // loading={loading}
              bordered={false}
              title="公告信息"
              bodyStyle={{ padding: 24 }}
              extra={<Link to="/system/notice">更多</Link>}
              style={{ marginTop: 24, minHeight: 509 }}
            >
              <div>
                <ul className={styles.rankingList}>
                  {data === undefined || data.length===0 ? [] : data.list.map((item, i) => (
                    <li key={item.title}>
                      <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                      <span>{item.title}</span>
                      <span>{item.createtime}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
