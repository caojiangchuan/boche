import React, { PureComponent,Fragment } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Steps,
  Card,
  Popover,
  Badge,
  Table,
  Tooltip,
  Divider,
  Avatar,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
const { Description } = DescriptionList;
import { connect } from 'dva';
import styles from './CustomerDetail.less';

const bankColumns = [
  {
    title: '银行卡号',
    dataIndex: 'BankAccount',
    key: 'Account',
  },
  {
    title: '银行名称',
    dataIndex: 'BankName',
    key: 'BankName',
  },
  {
    title: '开户行名',
    dataIndex: 'SubBank',
    key: 'SubBank',
  },
  {
    title: '状态',
    dataIndex: 'State',
    key: 'State',
    render:() => {
      return '有效'
    }
  },
  {
    title: '操作',
    render: (value,row) => (
        <a>禁用</a>
    ),
  },
];
const contractColumns = [
  {
    title: '序号',
    dataIndex: 'Id',
    key: 'Id',
  },
  {
    title: '合同名称',
    dataIndex: 'ContractName',
    key: 'ContractName',
  },
  {
    title: '签约时间',
    dataIndex: 'SignDate',
    key: 'SignDate',
  },
  {
    title: '操作',
    render: (value,row) => (
      <a>查看</a>
    ),
  },
];
const contractData =  [
  {
    Id: '1',
    ContractName: '《三方服务协议》',
    SignDate: '2018-08-03',
  },
  {
    Id: '2',
    ContractName: '《妈妈帮会员协议》',
    SignDate: '2018-08-04',
  }
];
@connect(({customer,profile }) => ({
  profile,
  customer,
}))
class CustomerDetail extends PureComponent {
  state = {
    operationkey: 'tab1',
    showModal:false,
  };

  componentDidMount() {
  }
  getSex = (UUserCard) => {
    if(!UUserCard){
      return "未知"
    }
   UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14); //获取出生日期
   if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {   //是男则执行代码 ...
     return '男'
   } else { //是女则执行代码 ...
     return "女"
   }
   }
  getAge = (UUserCard) => {
    if(!UUserCard){
      return "未知"
    }
   //获取年龄
   var myDate = new Date();
   var month = myDate.getMonth() + 1;
   var day = myDate.getDate();
   var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
   if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
   age++;
   }
     return age;
   }

  render() {
    const {customer} = this.props;
    const bankCards = [customer.detail]
    return (
      <PageHeaderLayout>
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <DescriptionList size="large"  style={{ marginBottom: 16 }}>
            <Description term="会员ID">{customer.detail.Id}</Description>
            <Description term="OPEN_ID">{customer.detail.Openid}</Description>
            <Description term="微信昵称">{customer.detail.Nickname}</Description>
            <Description term="姓名">{customer.detail.Username}</Description>
            <Description term="身份证号">{customer.detail.IdCard}</Description>
            <Description term="手机号码">{customer.detail.Phone}</Description>
            <Description term="性别">{this.getSex(customer.detail.IdCard)}</Description>
            <Description term="年龄">{this.getAge(customer.detail.IdCard)}</Description>
            <Description term="学历">{customer.detail.EducationalBackground}</Description>
            <Description term="空闲时间">{customer.detail.IdleTime}</Description>
            <Description term="做休机制">{customer.detail.WorkDay}</Description>
            <Description term="期望区域">上海</Description>
            <Description term="家庭住址">{customer.detail.ExpectArea}</Description>
          </DescriptionList>
        </Card>

        <Card title="银行卡信息" style={{ marginBottom: 24 }} bordered={false} extra={<Button type="primary" onClick={this.showModal}>新增银行卡</Button>}>
          <div className={styles.tableList}>
            <Table
              columns={bankColumns}
              dataSource={bankCards}
            />
          </div>
        </Card>

        <Card title="合同信息" style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.tableList}>
            <Table
              columns={contractColumns}
              dataSource={contractData}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default CustomerDetail;
