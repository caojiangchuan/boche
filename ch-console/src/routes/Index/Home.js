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
  message,
} from 'antd';
import numeral from 'numeral';
import {
  Pie,
} from '../../components/Charts';
import LineChartInfo from '../../components/Home/LineChartInfo';
import LinesChart from '../../components/Home/LinesChart';
import IncomeChart from '../../components/Home/IncomeChart';
import ParkingChart from '../../components/Home/ParkingChart';
import ChartPieCard from '../../components/Home/ChartPieCard';
import ChartCardTop from '../../components/Home/ChartCard';
import { Link } from 'dva/router';
import moment from 'moment';
import styles from './Home.less';
import Common from '../../common/Common';

const Utils = new Common();

const { TabPane } = Tabs;

@connect(({ home, loading }) => ({
  home,
  loading: loading.models.home,
}))
export default class Analysis extends Component {
  state = {

  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 查询停车次数(当天)
    dispatch({
      type: 'home/fetchParkinghisDataByDay',
      payload: {},
      callback: (response) => {
        if(!response.success) {
          message.error('当日停车次数查询失败');
        }
      },
    });
    // 查询新增用户(当天)
    dispatch({
      type: 'home/fetchCustomersDataByDay',
      payload: {},
      callback: (response) => {
        if(!response.success) {
          message.error('当日新增用户数量查询失败');
        }
      },
    });
    // 查询违停数(最近7天)
    dispatch({
      type: 'home/fetchCarillegalparkDataByDay',
      payload: {},
      callback: (response) => {
        if(!response.success) {
          message.error('最近7日违停数量查询失败');
        }
      },
    });
    // 查询收入统计(当天)
    // dispatch({
    //   type: 'home/fetchIncomingSummaryByDay',
    //   payload: {},
    //   callback: (response) => {
    //     if(!response.success) {
    //       message.error('今日收入统计数据查询失败');
    //     }
    //   },
    // });
    // 查询停车次数，包含违停数(最近7天)
    dispatch({
      type: 'home/fetchParkinghisDataByWeek',
      payload: {},
      callback: (response) => {
        if(!response.success) {
          message.error('最近7日停车数量查询失败');
        }
      },
    });
    // 查询新增用户(最近7天)
    dispatch({
      type: 'home/fetchCustomersDataByWeek',
      payload: {},
      callback: (response) => {
        if(!response.success) {
          message.error('最近7日新增用户数量查询失败');
        }
      },
    });
    // 查询新增设备数量(最近7天)
    dispatch({
      type: 'home/fetchDeviceDataByWeek',
      payload: {},
      callback: (response) => {
        if(!response.success) {
          message.error('最近7日新增设备数量查询失败');
        }
      },
    });

    // 公告查询
    dispatch({
      type: 'home/fetchNotices',
      payload: {},
      callback: (response) => {
        if(!response.success) {
          message.error('公告信息查询失败');
        }
      },
    });

    // 收入排行榜信息
    dispatch({
      type: 'home/fetchIncomingRaning',
      payload: {},
      callback: (response) => {
        if(!response.success) {
          message.error('收入排行榜信息查询失败');
        }
      },
    });

    // 收入统计数据
    dispatch({
      type: 'home/fetchIncomingSummary',
      payload: {},
      callback: (response) => {
        if(!response.success) {
          message.error('收入统计数据查询失败');
        }
      },
    });


  }


  // 公告信息列表
  getNoteItemList = (data) => {
    if (data !== undefined || data.length !== 0) {
      return data.map((item, i) => {
        if (i < 7) {
          return (
            <li key={i}>
              <span className={i < 10 ? styles.active : ''}>{i + 1}</span>
              <span>{item.title}</span>
              <span>{item.createtime}</span>
            </li>
          )
        } else {
          return '';
        }
      });
    }
  };

  // 收入排行榜数据
  getIncomeRankingItemList = (data) => {
    if (data !== undefined || data.length !== 0) {
      return data.map((item, i) => {
        if (i < 7) {
          return (
            <li key={i}>
              <span className={i < 10 ? styles.active : ''}>{i + 1}</span>
              <span>{item.title}</span>
              <span><a style={{fontWeight: 'bold ', color: 'black'}}>￥</a>{item.income}</span>
            </li>
          )
        } else {
          return '';
        }
      });
    }
  };

  render() {

    const {
      home: {
        // 停车次数(当天)
        parkinghisDataByDay,
        // 新增用户(当天)
        customersDataByDay,
        // 违停数(本周)
        carillegalparkDataByWeek,
        // 收入统计(当天)
        incomingSummaryByDay,
        // 停车次数，包含违停数(最近7天)
        parkinghisDataByWeek,
        // 新增用户(最近7天)
        customersDataByWeek,
        // 新增设备数量(最近7天)
        deviceDataByWeek,
        // 公告信息
        noticesData,
        // 收入排行榜
        incomingRaningData,
        // 收入统计数据
        incomingSummaryData,
      }
    } = this.props;

    // console.log(this.props, 'props home');

    // 公告信息数据
    const noteData ={list:[
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
      {title:'这是一个充电桩',createtime:'2018-10-30'},
    ]};

    // 收入排行数据
    const incomeNoteData ={list:[
        {title:'浦江城市生活广场地下停车场',income:'100000'},
        {title:'浦江城市生活广场地下停车场',income:'100000'},
        {title:'浦江城市生活广场地下停车场',income:'100000'},
        {title:'浦江城市生活广场地下停车场',income:'100000'},
        {title:'浦江城市生活广场地下停车场',income:'100000'},
        {title:'浦江城市生活广场地下停车场',income:'100000'},
        {title:'浦江城市生活广场地下停车场',income:'100000'},
        {title:'浦江城市生活广场地下停车场',income:'100000'},
        {title:'浦江城市生活广场地下停车场',income:'100000'},
        {title:'浦江城市生活广场地下停车场',income:'100000'},
      ]};

    // 折线图数据格式(新增设备数量，设备总量，新增用户总量，用户总量)
    // 设备新增数量、总数
    const deviceData = {
      list: [	// 设备数据列表
        {
          name: "设备总数",
          "11-20": 20,
          "11-21": 22,
          "11-22": 23,
          "11-23": 25,
          "11-24": 26,
          "11-25": 28,
          "11-26": 29,
        },
        {
          name: "新增数量",
          "11-20": 1,
          "11-21": 2,
          "11-22": 1,
          "11-23": 2,
          "11-24": 1,
          "11-25": 2,
          "11-26": 1,
        }
      ],
      date:[	 // 日期(7天)
        "11-20",
        "11-21",
        "11-22",
        "11-23",
        "11-24",
        "11-25",
        "11-26",
      ]
    };

    const customersData = {
      list: [	// 用户数据列表
        {
          name: "用户总数",
          "11-20": 50,
          "11-21": 54,
          "11-22": 60,
          "11-23": 89,
          "11-24": 91,
          "11-25": 102,
          "11-26": 109,
        },
        {
          name: "新增用户数量",
          "11-20": 4,
          "11-21": 6,
          "11-22": 11,
          "11-23": 12,
          "11-24": 11,
          "11-25": 2,
          "11-26": 7,
        }
      ],
      date:[	 // 日期(7天)
        "11-20",
        "11-21",
        "11-22",
        "11-23",
        "11-24",
        "11-25",
        "11-26",
      ]
    };

    // 停车数据
    const parkingData = {
      list: [
        {
          name: "停车次数",
          "11-20": 522,
          "11-21": 415,
          "11-22": 512,
          "11-23": 362,
          "11-24": 408,
          "11-25": 503,
          "11-26": 384,
        },
        {
          name: "违停次数",
          "11-20": 34,
          "11-21": 22,
          "11-22": 42,
          "11-23": 14,
          "11-24": 31,
          "11-25": 25,
          "11-26": 11,
        }
      ],
      date: [
        "11-20",
        "11-21",
        "11-22",
        "11-23",
        "11-24",
        "11-25",
        "11-26",
      ]
    };

    // 收入统计数据
    const incomeData = {
      list: [
        {
          name: "收入统计",
          "11-29": 522,
          "11-30": 415,
          "12-01": 512,
          "12-02": 362,
          "12-03": 408,
          "12-04": 503,
          "12-05": 384,
        },
      ],
      date: [
        "11-29",
        "11-30",
        "12-01",
        "12-02",
        "12-03",
        "12-04",
        "12-05"
      ]
    };



    // 最下层饼状图数据
    const pieData = {
      title: '浦江城市生活广场',
      total: 400,
      list: [
        { item: '占用泊位数', count: 320 },
        { item: '空闲泊位数', count: 80 },
      ],
    };

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginTop: 20, width: '25%' },
    };

    const operations = (color, title) => {
      return (
       <div style={{marginTop: 5}}>
         {/*<span style={{backgroundColor: `${color}`, color: '#FFFFFF', textAlign: 'center'}}>{title}</span>*/}
         本周
       </div>
      )
    };

    const deviceColor = ['#83C3FF', '#66EEDF'];
    const customersColor = ['#30C35C', '#65A9F1'];
    const parkingColor = ['#8543E0', '#F04864'];

    return (
      <Fragment>

        <Row gutter={24}>

          <Col xs={24} md={12} style={{width: '75%'}}>
            <Row gutter={24}>
              <Col xs={24} md={8} style={{width: '25%'}}>

                <ChartCardTop leftTitle="违规停车" rightTitle="本周" color="#FF7875"
                              content={Utils.isNotNull(carillegalparkDataByWeek.totalCount) ? carillegalparkDataByWeek.totalCount : 0}
                              unit="次"/>

              </Col>
              <Col xs={24} md={8} style={{width: '25%'}}>

                <ChartCardTop leftTitle="停车数量" rightTitle="今日" color="#5CDBD3"
                              content={Utils.isNotNull(parkinghisDataByDay.totalCount) ? parkinghisDataByDay.totalCount : 0}
                              unit="次"/>

              </Col>
              <Col xs={24} md={8} style={{width: '25%'}}>

                <ChartCardTop leftTitle="新增用户" rightTitle="今日" color="#69C0FF"
                              content={Utils.isNotNull(customersDataByDay.totalCount) ? customersDataByDay.totalCount : 0}
                              unit="个" />

              </Col>
              <Col xs={24} md={8} style={{width: '25%'}}>

                <ChartCardTop leftTitle="收入统计" rightTitle="今日" color="#FFD666"
                              content={Utils.isNotNull(incomingSummaryByDay.totalCount) ? incomingSummaryByDay.totalCount : 0}
                              unit="元" />

              </Col>

            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12} style={{width: '50%'}}>
                <Card
                  // loading={loading}
                  bordered={false}
                  // extra={iconGroup}
                  style={{ marginTop: 24, height: 390 }}
                >
                  <Tabs tabBarExtraContent={operations('#1890FF', '本周')}>
                    <TabPane tab="新增设备数量" key="1">
                      <Row>
                        <Col>
                          <div style={{ marginLeft:-30}}>
                            {/*<LinesChart data={deviceData.list === undefined ? [] : deviceData.list}*/}
                                        {/*fields={deviceData.date === undefined ? [] : deviceData.date} color={deviceColor}/>*/}
                            <LinesChart data={Utils.isNotNull(deviceDataByWeek.data.list) ? deviceDataByWeek.data.list : deviceData.list}
                                        fields={Utils.isNotNull(deviceDataByWeek.data.date) ? deviceDataByWeek.data.date : deviceData.date} color={deviceColor}/>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    {/*<TabPane tab="设备总量" key="2">*/}
                      {/*<Row>*/}
                        {/*<Col>*/}
                          {/*<div style={{ marginLeft:-30}}>*/}
                            {/*<LineChartInfo data={appCount  === undefined ? [] : appCount} titleMap={{ y: '设备总量'}} />*/}
                          {/*</div>*/}
                        {/*</Col>*/}
                      {/*</Row>*/}
                    {/*</TabPane>*/}
                  </Tabs>
                </Card>
              </Col>

              <Col xs={24} md={12} style={{width: '50%'}}>
                <Card
                  // loading={loading}
                  bordered={false}
                  // extra={iconGroup}
                  style={{ marginTop: 24, height: 390 }}
                >
                  <Tabs tabBarExtraContent={operations('#30C35C', '本周')}>
                    <TabPane tab="新增用户数量" key="1">
                      <Row>
                        <Col>
                          <div style={{ marginLeft:-30}}>
                            {/*<LineChartInfo data={appCount  === undefined ? [] : appCount} titleMap={{ y: '总用户数'}} />*/}
                            {/*<LinesChart data={customersData.list === undefined ? [] : customersData.list} */}
                                        {/*fields={customersData.date === undefined ? [] : customersData.date} color={customersColor}/>*/}
                            <LinesChart data={Utils.isNotNull(customersDataByWeek.data.list) ? customersDataByWeek.data.list : customersData.list}
                                        fields={Utils.isNotNull(customersDataByWeek.data.date) ? customersDataByWeek.data.date : customersData.date} color={customersColor}/>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    {/*<TabPane tab="用户总量" key="2">*/}
                      {/*<Row>*/}
                        {/*<Col>*/}
                          {/*<div style={{ marginLeft:-30}}>*/}
                            {/*<LineChartInfo data={appCount  === undefined ? [] : appCount} titleMap={{ y: '总用总量'}} />*/}
                          {/*</div>*/}
                        {/*</Col>*/}
                      {/*</Row>*/}
                    {/*</TabPane>*/}
                  </Tabs>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12} style={{width: '50%'}}>
                <Card
                  // loading={loading}
                  bordered={false}
                  // extra={iconGroup}
                  style={{ marginTop: 24, height: 390 }}
                >
                  <Tabs tabBarExtraContent={operations('#30C35C', '本周')}>
                    <TabPane tab="停车次数" key="1">
                      <Row>
                        <Col>
                          <div style={{ marginLeft:-30}}>
                            {/*<ParkingChart data={parkingData.list === undefined ? [] : parkingData.list}*/}
                                          {/*fields={parkingData.date === undefined ? '' : parkingData.date}/>*/}
                            <ParkingChart data={Utils.isNotNull(parkinghisDataByWeek.data.list) ? parkinghisDataByWeek.data.list : parkingData.list}
                                          fields={Utils.isNotNull(parkinghisDataByWeek.data.date) ? parkinghisDataByWeek.data.date : parkingData.date}/>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>

              <Col xs={24} md={12} style={{width: '50%'}}>
                <Card
                  // loading={loading}
                  bordered={false}
                  // extra={iconGroup}
                  style={{ marginTop: 24, height: 390 }}
                >
                  <Tabs tabBarExtraContent={operations('#30C35C', '本周')}>
                    <TabPane tab="收入统计" key="1">
                      <Row>
                        <Col>
                          <div style={{ marginLeft:-30, minWidth: 400}}>
                            <IncomeChart data={Utils.isNotNull(incomingSummaryData.data.list) ? incomingSummaryData.data.list : incomeData.list}
                                         fields={Utils.isNotNull(incomingSummaryData.data.date) ? incomingSummaryData.data.date : incomeData.date}/>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col xs={24} md={12} style={{width: '25%'}}>
            <Row gutter={24}>
              <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{width: '100%'}}>
                <Card
                  // loading={loading}
                  bordered={false}
                  title="公告信息"
                  bodyStyle={{ padding: 24 }}
                  extra={<Link to="/system/noticesManage">更多</Link>}
                  style={{ height: 474 }}
                >
                  <div>
                    <ul className={styles.rankingList}>
                      {this.getNoteItemList(Utils.isNotNull(noticesData.data) ? noticesData.data : noteData.list)}
                    </ul>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{width: '100%'}}>
                <Card
                  // loading={loading}
                  bordered={false}
                  title="收入排行榜"
                  bodyStyle={{ padding: 24 }}
                  extra={<Link to="/system/incomingRaningManage">更多</Link>}
                  style={{ marginTop: 24, height: 474 }}
                >
                  <div>
                    <ul className={styles.rankingList}>
                      {this.getIncomeRankingItemList(Utils.isNotNull(incomingRaningData.data) ? incomingRaningData.data : incomeNoteData.list)}
                    </ul>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>

        </Row>

        {/*最下方饼状图*/}
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartPieCard title="浦江城市生活广场" data={pieData.list} total={400} />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartPieCard title="浦江城市生活广场" data={pieData.list} total={400} />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartPieCard title="浦江城市生活广场" data={pieData.list} total={400} />
          </Col>

          <Col {...topColResponsiveProps}>
            <ChartPieCard title="浦江城市生活广场" data={pieData.list} total={400} />
          </Col>

        </Row>

      </Fragment>
    );
  }
}
