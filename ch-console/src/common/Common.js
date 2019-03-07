import React from 'react';
import moment from 'moment';
import {Select,Tree, TreeSelect,Tooltip} from 'antd';
import {assetStatus, enableStatus} from '../common/Enum'
import {dataSource} from "../components/HeaderSearch";
import { isUrl } from '../utils/utils';

const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const TreeSelectNode = TreeSelect.TreeNode;

class Common {
  // 日起转换
  formatDate = text => {
    if (text != null) {
      return moment(text).format('YYYY-MM-DD HH:mm:ss');
    } else {
      return '';
    }
  };

  formatDateYMDHS = text => {
    if (text != null) {
      return moment(text).format('YYYY-MM-DD HH:mm');
    } else {
      return '';
    }
  };

  formatDateYMD = text => {
    if (text != null) {
      return moment(text).format('YYYY-MM-DD');
    } else {
      return '';
    }
  };

  // 如果根据url或者写死的数据获取下拉框内容
  dropDownOption = (source,val,name) => {
    if(this.isNotNull(source)){
      return source.map(d => <Option key={d[val]}>{d[name]}</Option>);
    }
  };

  // 判断字符串是否为空
  isNotNull = value => {
    return !/(null|undefined|^(?![\s\S]))/.test(value);
  };

  repairStatus = text => {
    if ('0' === text) {
      return '待维修';
    } else if ('1' === text) {
      return '维修中';
    } else {
      return '已维修';
    }
  };

  //params转成对应的格式
  forSearch = params => {
    let str = '';
    let header ='';
    let searchType = 'eq';
    let rangeTimePicker = '';
    // 查询类别--eq/lk
    if(params.hasOwnProperty('searchType')){
      searchType = params.searchType;
      delete params.searchType;
    }

    // 模糊查询
    if(params.hasOwnProperty('key') && this.isNotNull(params.key)){
      str = `key lk ${params.key}`;
      delete params.key;
    }

    // 时间区间查询
    if (params.hasOwnProperty('rangeTime')) {
      let rangeTime = params.rangeTime;
      let keywords = Reflect.ownKeys(rangeTime);
      if (this.isNotNull(rangeTime[keywords])) {
        rangeTimePicker = `${keywords} gt ${rangeTime[keywords][0]},${keywords} lt ${rangeTime[keywords][1]}`;
      }
      delete params.rangeTime;
    }
    if (this.isNotNull(rangeTimePicker)) {
      str = rangeTimePicker;
    }
    //时间段查询
    if(params.hasOwnProperty('dateList') && this.isNotNull(params.dateList)){
      str = `${params.startDate} gt ${params.dateList[0].format('YYYY-MM-DD')},${params.endDate} lt ${params.dateList[1].format('YYYY-MM-DD')}`
      delete params.startDate;
      delete params.endDate;
      delete params.dateList;
    }

    // 分页信息
    if(params.hasOwnProperty('page')){
      header = `start=${params.page.start}&limit=${params.page.limit}`;
      delete params.page;
    }
    // 参数
    let array = Reflect.ownKeys(params);
    if (array.length > 0) {
      for (let val of array) {
        if (this.isNotNull(params[val])) {
          str = `${val} ${searchType} ${params[val]},${str}`;
        }
      }
    }
    if(this.isNotNull(header)){
      return `${header}&filter=${str}`;
    }
    return str;
  };


  // 循环获取功能列表节点
  loop = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.name}>{this.loop(item.children)}</TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name}/>;
    });
  };

  // 循环获取功能列表节点
  loopDept = (data) => {
    if (this.isNotNull(data) && data.length > 0) {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeSelectNode value={item.id} title={item.name} key={item.id}>{this.loopDept(item.children)}</TreeSelectNode>
          );
        }
        return <TreeSelectNode value={item.id} title={item.name} key={item.id}/>;
      });
    } else {
      return null;
    }
  };

  // 循环获取停车场列表节点-父级(停车场)可选
  loopPark = (data) => {
    if (this.isNotNull(data) && data.length > 0) {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeSelectNode value={'park-'+item.id} title={item.name} key={'park-'+item.id}>{this.loopPark(item.children)}</TreeSelectNode>
          );
        }
        return <TreeSelectNode value={'position-'+item.id} title={item.name} key={'position-'+item.id} />;
      });
    } else {
      return null;
    }
  };

  // 循环获取停车场片区列表节点-父级(停车场)不可选
  loopParkArea = (data) => {
    if (this.isNotNull(data) && data.length > 0) {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeSelectNode disabled value={item.name} title={item.name} key={'park-'+item.id}>{this.loopParkArea(item.children)}</TreeSelectNode>
          );
        }
        return <TreeSelectNode value={item.id} title={item.name} key={'position-'+item.id} />;
      });
    } else {
      return null;
    }
  };


  //根据状态码获取状态值
  getStatusName =(text,array)=>{
    let name ={name:text,value:text};
    if (this.isNotNull(array)) {
      if(this.isNotNull(text)){
        name = array.filter((item)=>{
          return `${text}` === item.value;
        });
        if(name.length>0){
          return name[0].name;
        }else{
          return text;
        }
      }else{
        return text;
      }
    }
  };

  // 将树形结构转换成List集合
  treeConvertList = (root) => {
    const list = [];
    if (root) {
      const queue = root;
      while (queue.length) {
        const node = queue.shift();
        if (node.children && node.children.length) {
          queue.push(...node.children);
        }
        delete node.children;
        list.push(node);
      }
    }
    return list;
  };

  // 将数据中children长度为空的children去掉
  dataConvert = (data) => {
    for (let i = 0; i < data.length; i++) {
      let el = data[i];
      if (!(el.children.length > 0)) {
        delete el.children;
      } else {
        this.dataConvert(el.children);
      }
    }
    return data;
  };

  formatterMenu = (data, parentPath = '/', parentAuthority) => {
    return data.map(item => {
      let { path } = item;
      if (!isUrl(path)) {
        path = parentPath + item.path;
      }
      const result = {
        ...item,
        path,
        authority: item.authority || parentAuthority,
      };
      if (item.children) {
        result.children = this.formatterMenu(item.children, `${parentPath}${item.path}/`, item.authority);
      }
      return result;
    });
  };

  getTimeDiff = (starttime, endtime) => {

    if (this.isNotNull(starttime) && this.isNotNull(endtime)) {
      const date1= new Date(starttime);  //开始时间
      const date2 = new Date(endtime);    //结束时间

      let date3 = date2.getTime() - date1.getTime();   //时间差的毫秒数

      //------------------------------
      let subMinutes = Math.floor( date3/(60*1000) ); //获取总共的分钟差

      //计算出相差天数
      let days=Math.floor(date3/(24*3600*1000));

      //计算出小时数

      let leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
      let hours=Math.floor(leave1/(3600*1000));
      //计算相差分钟数
      let leave2=leave1%(3600*1000);       //计算小时数后剩余的毫秒数
      let minutes=Math.floor(leave2/(60*1000));
      //计算相差秒数
      let leave3=leave2%(60*1000);    //计算分钟数后剩余的毫秒数
      let seconds=Math.round(leave3/1000);

      let str = '';

      return (days!==0?days+"天 ":"")+(hours!==0?hours+"小时 ":"")+(minutes!==0?minutes+" 分钟":"")+(seconds!==0?seconds+" 秒":"");
    } else {
      return "";
    }
  }

  //超出长度显示部分
  overLength(text){
    if(null!=text && text.length>6){
      return <Tooltip title={text}>
        <span>{text.substring(0,6)}...</span>
      </Tooltip>
    }else {
      return text;
    }
  }

}

export default Common;
