import React, { PureComponent,Fragment } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import DescriptionList from 'components/DescriptionList';
const { Description } = DescriptionList;
import { connect } from 'dva';
import UserMatchFilter from './UserMatchFilter'
import {
  Button,
  DatePicker,
  Card,
  Popconfirm,
  Table,
} from 'antd';
const ButtonGroup = Button.Group;

@connect(({project,workRecord,profile, loading }) => ({
  profile,
  project,
  workRecord,
  loading: loading.effects['profile/fetchAdvanced'],
}))
class UserMatch extends PureComponent {
  state = {
    operationkey: '',
    showModal:false,
    workDay:'',
    tabs:[]
  };
  onOperationTabChange = key => {
    var projectId = this.props.match.params.projectId;
    this.setState({
      operationkey: key,
      workDay: key
    });
    this.props.dispatch({
      type: 'project/fetchMatchUser',
      payload: {projectId:projectId,workDay:key}
    });
  };
  componentDidMount() {
    var projectId = this.props.match.params.projectId;
    const { dispatch } = this.props;
    dispatch({
      type:'project/loadProjectAddress',
      payload: {projectId}
    })
    dispatch({
      type:'project/loadProjectTimeSlot',
      payload: {projectId}
    })
    var tabs = [];
    for(var i = 1;i<=7; i++){
      tabs.push(new moment().add(i,"days").format('YYYY-MM-DD'));
    }
    this.setState({
      workDay:tabs[0],
      operationkey:tabs[0],
      tabs: tabs
    })
    dispatch({
      type: 'project/fetchMatchUser',
      payload: {projectId:projectId,workDay:tabs[0]}
    });
  }
  disabledDate = (value) => {
    var today = new moment();
    if(value.valueOf()>= today){
      return false;
    }else {
      return true;
    }
  }
  onWorkDayChange = (date,dateString) => {
    this.setState({
      workDay: dateString
    })
    this.props.dispatch({
      type: 'project/fetchMatchUser',
      payload: {projectId:this.props.project.projectDetail.Id,workDay:dateString}
    });
  }
  getRightAction = () => {
    var defaultValue = new moment().add(1,"days");
    return (
      <Fragment>
      <ButtonGroup>
        <span>工作日：</span>
        <DatePicker allowClear={false} onChange={this.onWorkDayChange}  value={moment(this.state.workDay)} disabledDate={this.disabledDate} defaultValue={defaultValue} />
        <Button type="primary" style={{marginLeft:'30px'}}>返回</Button>
      </ButtonGroup>
    </Fragment>
    )
  }
  showModal = ()=> {
    this.setState({
      showModal: true
    })
  }
  closeModal = () => {
    this.props.dispatch({
      type: 'project/fetchMatchUser',
      payload: {projectId:this.props.project.projectDetail.Id,workDay:this.state.workDay}
    });
    this.setState({
      showModal: false
    })
  }
  getOperationTabList = () => {
    var operationTabList = [];
    this.state.tabs.forEach((item) =>{
      operationTabList.push({
        key: item,
        tab: item + moment(item).format('dddd')
      },)
    })
    return operationTabList
  }
  getMatchFilter = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'Id',
        key: 'Id',
      },
      {
        title: '姓名',
        dataIndex: 'Username',
        key: 'Username',
      },
      {
        title: '手机号码',
        dataIndex: 'Phone',
        key: 'Phone',
      },
      {
        title: '上班地点',
        dataIndex: 'Address',
        key: 'Address',
      },
      {
        title: '班次',
        dataIndex: 'WorkDay',
        key: 'WorkDay',
        render: (_, value) => {
          return value.Start + '--' + value.End
        }
      },
      {
        title: '操作',
        render: (value, row) => (
          <Popconfirm title="确认取消？" onConfirm={() => {
            this.props.dispatch({
              type: "workRecord/delete",
              payload: {id:row.Id},
              callback: () => {
                this.props.dispatch({
                  type: 'project/fetchMatchUser',
                  payload: { projectId: this.props.project.projectDetail.Id, workDay: this.state.workDay }
                });
              }
            })
          }}>
            <a>取消排班</a>
          </Popconfirm>
        ),
      },
    ];
    const {loading } = this.props;
      return (
        <Card title="已匹配"
          style={{ marginBottom: 24 }}
          bordered={false}
          tabList={this.getOperationTabList()}
          onTabChange={this.onOperationTabChange}
        >
        <Table
        pagination={false}
        loading={loading}
        dataSource={this.props.project.matchUser}
        columns={columns}
      />
        </Card>
      )
  }
  getMatchButton = () => {
    if(this.state.showModal){
      return <Button type="primary" onClick={this.closeModal}>匹配结果</Button>
    }else{
      return <Button type="primary" onClick={this.showModal}>匹配</Button>
    }
  }
  doMatch = (formData) => {
    var workDayFrom = formData.workDays[0];
    var workDayTo;
    if(formData.workDays.length === 1){
      workDayTo = formData.workDays[0];
    }else{
      workDayTo = formData.workDays[formData.workDays.length-1];
    }
    this.props.dispatch({
      type:'project/matchUser',
      payload: formData,
      callback: ()=>{
        this.props.dispatch({
          type: 'project/fetchMatchUser',
          payload: {projectId:this.props.project.projectDetail.Id,workDay:this.state.workDay}
        });
        this.props.dispatch({
          type: 'customer/laodOffWorkUsers',
          payload: {workDayFrom,workDayTo,status:'sign'},
        });
      }
    })
    this.setState({
      showModal: false
    })
  }
  render() {
    const projectDetail = this.props.project.projectDetail
    return (
      <PageHeaderLayout
        title={'项目名称：' + projectDetail.Name }
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={this.getRightAction()}
        // content={description}
        // extraContent={extra}
        // tabList={tabList}
      >
        <Card title="项目详情" style={{ marginBottom: 24 }} bordered={false} >
          <DescriptionList size="large"  style={{ marginBottom: 32 }}>
            <Description term="企业名称">{projectDetail.EnterpriseName}</Description>
            <Description term="项目名称">{projectDetail.Name}</Description>
            <Description term="工作日期">{this.state.workDay}</Description>
            <Description term="用工计划">{projectDetail.RequireQuantity}</Description>
            <Description term="已匹配">{this.props.project.matchUser.length}</Description>
            <Description term="未匹配">{projectDetail.RequireQuantity - this.props.project.matchUser.length}</Description>
          </DescriptionList>
        </Card>
        {this.getMatchFilter()}
        <Card
          bordered={false}
          title="用工匹配"
          style={{ marginBottom: 24 }}>
          <UserMatchFilter  doMatch={this.doMatch} workDay={this.state.workDay} />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default UserMatch;