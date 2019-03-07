import React, { Fragment } from 'react';
import { Icon, Modal, Select, Button } from 'antd';
import styles from './index.less';
import Common from '../../common/Common';
import {province} from "./geographic/province";
import {city} from "./geographic/city";
import img1 from '../../assets/1.png'
import img2 from '../../assets/2.png'
import img3 from '../../assets/3.png'
import img4 from '../../assets/4.png'
import img5 from '../../assets/5.png'
import img6 from '../../assets/6.png'
import img7 from '../../assets/7.png'
import img8 from '../../assets/8.png'

const Option = Select.Option;
const CommonUtil = new Common();

class ContainerFooter extends React.Component {
  state = {
    visible: false,
    secondCity: '',
    cities: [],
    weatherIcon: {},
  };

  componentDidMount() {
    this.setState({
      cities: city[province[0].id],
      secondCity: city[province[0].id][0].name,
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    const {onHandleOk} = this.props;
    //去掉城市名后的"市"
    let selectedCity = this.state.secondCity;
    selectedCity = selectedCity.replace('市', '');
    const city = {
      city: selectedCity,
    };
    onHandleOk(city);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleProvinceChange = value => {
    this.setState({
      cities: city[value],
      secondCity: city[value][0].name,
    });
  };

  onSecondCityChange = value => {
    this.setState({
      secondCity: value,
    });
  };

  //选择图片
  chooseImg(id) {
    switch (id) {
      case '1':
        return img1;
      case '2':
        return img2;
      case '3':
        return img3;
      case '4':
      case '5':
      case '6':
      case '8':
      case '9':
      case '10':
      case '11':
      case '12':
      case '13':
      case '20':
      case '22':
      case '23':
      case '24':
      case '25':
      case '26':
        return img4
      case '7':
        return img6;
      case '14':
      case '15':
      case '16':
      case '17':
      case '18':
      case '27':
      case '28':
      case '29':
        return img5;
      case '19':
      case '21':
      case '30':
      case '31':
      case '32':
      case '33':
        return img7;
      default:
        return img8;
    }
  }

  render() {

    const weather = this.props;

    let currentWeather = weather.weather;

    // 如果天气加载失败设置为默认值
    if(!CommonUtil.isNotNull(currentWeather)) {
      currentWeather = {
        weaid: "36",
        days: "2018-10-19",
        week: "星期五",
        cityno: "shanghai",
        citynm: "上海",
        cityid: "101020100",
        temperature: "20℃/15℃",
        humidity: "0%/0%",
        weather: "多云",
        weather_icon: "http://api.k780.com/upload/weather/d/1.gif",
        weather_icon1: "http://api.k780.com/upload/weather/n/1.gif",
        wind: "东北风",
        winp: "3-4级转4-5级",
        temp_high: "20",
        temp_low: "15",
        humi_high: "0",
        humi_low: "0",
        weatid: "2",
        weatid1: "2",
        windid: "13",
        winpid: "37",
        weather_iconid: "1",
        weather_iconid1: "1"
      }
    }

    const provinceOptions = province.map(province =>
      <Option key={province.id}>{province.name}</Option>
    )

    const cityOptions = this.state.cities.map(city =>
      <Option key={city.name}>{city.name}</Option>
    )

    return (
      <div className={styles.containFooter}>
        <div style={{ float: 'left' }}>
          <Fragment>
            2018 <Icon type="copyright" /> 智慧泊车运营平台
          </Fragment>
        </div>
        <div style={{ float: 'right', cursor: 'pointer' }}>
          <div onClick={this.showModal}>
            <img src={this.chooseImg(currentWeather.weatid)} style={{ width: 30, height: 25 }} />
            {/*<span> 上海，阴，东北风3级，温度21~25℃</span>*/}
            <span>
              {currentWeather.citynm}，{currentWeather.weather}，{currentWeather.wind}
              {currentWeather.winp}，温度{currentWeather.temperature}
            </span>
          </div>
          <Modal
            title="天气设置"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={null}
          >
            <div className={styles.weatherModal}>
              <div>
                {/*<span className={styles.cityFont}>上海</span>*/}
                <span className={styles.cityFont}>{currentWeather.citynm}</span>
              </div>
              <div>
                <img src={this.chooseImg(currentWeather.weatid)} />
              </div>
              <div>
                {/*<span>阴</span>*/}
                <span>{currentWeather.weather}</span>
              </div>
              <div>
                {/*<span>东北风3级</span>*/}
                <span>
                  {currentWeather.wind}{currentWeather.winp}
                </span>
              </div>
              <div>
                {/*<span>温度21~25℃</span>*/}
                <span>温度{currentWeather.temperature}</span>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <label>省份：</label>
              <Select
                defaultValue={province[0].id}
                style={{ width: 155 }}
                onChange={this.handleProvinceChange}
              >
                {provinceOptions}
              </Select>

              <label>城市：</label>
              <Select
                value={this.state.secondCity}
                style={{ width: 155 }}
                onChange={this.onSecondCityChange}
              >
                {cityOptions}
              </Select>
              <Button type="primary" style={{ marginLeft: 5 }} onClick={this.handleOk}>
                确定
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default ContainerFooter;
