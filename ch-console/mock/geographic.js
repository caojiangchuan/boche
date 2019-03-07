import {parse} from "url";

export function getWeather(req, res, u) {

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  console.log(params, 'params');
  const weather1 = {
    weaid: "1",
    days: "2018-10-17",
    week: "星期三",
    cityno: "beijing",
    citynm: "北京",
    cityid: "101010100",
    temperature: "17℃/5℃",
    humidity: "0%/0%",
    weather: "晴",
    weather_icon: "http://api.k780.com/upload/weather/d/0.gif",
    weather_icon1: "http://api.k780.com/upload/weather/n/0.gif",
    wind: "北风",
    winp: "<3级",
    temp_high: "17",
    temp_low: "5",
    humi_high: "0",
    humi_low: "0",
    weatid: "1",
    weatid1: "1",
    windid: "20",
    winpid: "395",
    weather_iconid: "0",
    weather_iconid1: "0"
  };

  const weather2 = {
    weaid: "36",
    days: "2018-10-17",
    week: "星期三",
    cityno: "shanghai",
    citynm: "上海",
    cityid: "101020100",
    temperature: "22℃/16℃",
    humidity: "0%/0%",
    weather: "多云",
    weather_icon: "http://api.k780.com/upload/weather/d/1.gif",
    weather_icon1: "http://api.k780.com/upload/weather/n/1.gif",
    wind: "北风",
    winp: "<3级",
    temp_high: "22",
    temp_low: "16",
    humi_high: "0",
    humi_low: "0",
    weatid: "2",
    weatid1: "2",
    windid: "20",
    winpid: "395",
    weather_iconid: "1",
    weather_iconid1: "1"
  };

  let result;
  if(params.city === '上海市') {
    result = weather2;
  } else {
    result = weather1;
  }


  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
