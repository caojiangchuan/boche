import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Checkbox, Modal,AutoComplete} from 'antd';
import { Form, Input, Select, Button, Card, Row, Col, Popconfirm,Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import TimeSlotForm from './TimeSlotForm'
import debounce from 'lodash/debounce';
import Ellipsis from 'components/Ellipsis'

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const defaultCheckedList = ['周一', '周二', '周三', '周四', '周五'];
const priceOfPreHourData = [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
@connect(({ project, enterprise,loading }) => ({
  project: project,
  enterprise: enterprise,
  submitting: loading.effects['project/formSubmit'],
}))
@Form.create()
export default class EditProject extends PureComponent {
  projectAddressFormStatus='success'
  projectTimeSlotFormStatus='success'
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      var flag = true;
      if(this.props.project.projectAddress.length === 0){
        this.projectAddressFormStatus='error'
        flag = false;
      }
      if(this.props.project.projectTimeSlot.length === 0){
        this.projectTimeSlotFormStatus = 'error'
        flag = false;
      }
      if(!flag){
        return
      }
      if (!err) {
        this.props.dispatch({
          type: 'project/formSubmit',
          payload: {
            forms:{...values,Id:this.props.project.projectDetail.Id},
            address: this.props.project.projectAddress,
            timeSlot: this.props.project.projectTimeSlot
          },
        });
      }
    });
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'enterprise/fetch',
    });
    this.initMap();
    if(this.props.project.projectDetail.Id){
      this.props.form.setFieldsValue(this.props.project.projectDetail)
      this.initProjectData(this.props.project.projectDetail.Id)
    }else{
      this.clearProjectData();
    }
  }
  clearProjectData = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'project/addProjectAddress',
      payload: []
    });
    this.props.dispatch({
      type: 'project/addProjectTimeSlot',
      payload: []
    });
  }
  initProjectData = (projectId) => {
    const { dispatch } = this.props;
    dispatch({
      type:'project/loadProjectAddress',
      payload: {projectId}
    })
    dispatch({
      type:'project/loadProjectTimeSlot',
      payload: {projectId}
    })
  }
  initMap = () => {
    var map = new BMap.Map('map');
    map.centerAndZoom('上海', 12);
    var ac = new BMap.Autocomplete({
      //建立一个自动完成的对象
      input: 'suggestId',
      location: map,
    });
    var myValue;
    ac.addEventListener('onconfirm', e => {
      //鼠标点击下拉列表后的事件
      var _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      this.props.project.projectAddress.push({Name: _value.business,Detail: myValue})
      document.getElementById("suggestId").value = ""
      this.projectAddressFormStatus = 'success'
      this.props.dispatch({
        type: 'project/addProjectAddress',
        payload: this.props.project.projectAddress,
      });
    });
  };
  openModal = () => {
    this.props.dispatch({
      type: 'project/showModal',
      payload: true,
    });
  };
  closeModal = () => {
    this.props.dispatch({
      type: 'project/showModal',
      payload: false,
    });
  };

  removeAddress = (index,id) => {
   this.props.project.projectAddress.splice(index,1)
    this.props.dispatch({
      type: 'project/removeAddress',
      payload: {data:this.props.project.projectAddress,id}
    });
  }
  addTimeSlot = (data) => {
    this.props.project.projectTimeSlot.push(data)
    this.projectTimeSlotFormStatus = 'success'
    this.closeModal()
    this.props.dispatch({
      type: 'project/addProjectTimeSlot',
      payload: this.props.project.projectTimeSlot
    });
  }
  removeTimeSlot = (index,id) => {
    this.props.project.projectTimeSlot.splice(index,1)
    this.props.dispatch({
      type: 'project/removeProjectTimeSlot',
      payload: {data:this.props.project.projectTimeSlot,id}
    });
  }
   getAddressList = () => {
    var projectAddress = this.props.project.projectAddress;
    return projectAddress.map((item,index) => {
      return <div>
      <Row  key={index} gutter={20}>
                <Col className="gutter-row" span={10}>
                  <div className="gutter-box">
                    <Ellipsis lines={1} length={100}> {item.Name}</Ellipsis>
                  </div>
                </Col>
                <Col className="gutter-row" span={12}>
                  <div className="gutter-box">
                    <Ellipsis lines={1} length={100}>{item.Detail}</Ellipsis>
                  </div>
                </Col>
                <Col className="gutter-row" span={2}>
                  <div className="gutter-box">
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.removeAddress(index,item.Id)}>
                  <Icon type="delete" style={{ fontSize: 16, color: '#08c' }} />
                </Popconfirm>
                  </div>
                </Col>
              </Row>
      </div>
    })
   }
   getTimeSlotList = () => {
     return this.props.project.projectTimeSlot.map((item,index) => {
       return <Row key={index} gutter={20}>
       <Col className="gutter-row" span={10}>
         <div className="gutter-box">
           {item.Start}----{item.End}
         </div>
       </Col>
       <Col className="gutter-row" span={12}>
         <div className="gutter-box">
           不计工时: {item.Uncount}小时
         </div>
       </Col>
       <Col className="gutter-row" span={2}>
         <div className="gutter-box">
         <Popconfirm title="是否要删除此行？" onConfirm={() => this.removeTimeSlot(index,item.Id)}>
         <Icon type="delete" style={{ fontSize: 16, color: '#08c' }} />
       </Popconfirm>
         </div>
       </Col>
   </Row>
     })
   }
   state = {
    dataSource: [],
  }
  onEnterpriseChange = (value,option) => {
    console.error(option.props.children)
    console.error(this.props.form)
  }
  onSelect = (value) => {
    console.log('onSelect', value);
  }
  render() {
    const {
      project: { showModal},
      submitting,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const { dataSource } = this.state;
    return (
      <PageHeaderLayout title="新增项目">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="所属企业">
              {getFieldDecorator('EnterpriseId', {
                rules: [
                  {
                    required: true,
                    message: '请选择所属企业',
                  },
                ],
              })(
                <Select onChange={this.onEnterpriseChange}>
                  {
                    this.props.enterprise.data.list.map((item,index)=>{
                      return <Option key={index} value={item.Id}>{item.Name}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="项目名称">
              {getFieldDecorator('Name', {
                rules: [
                  {
                    required: true,
                    message: '请输入项目名称',
                  },
                ],
              })(<Input placeholder="请输入项目名称" />)}
            </FormItem>
            <FormItem
              validateStatus={this.projectAddressFormStatus}
              help={this.projectAddressFormStatus==='error'?'请添加工作地点':''} {...formItemLayout} label="工作地点">
              <Input id="suggestId" />
              {this.getAddressList()}
          </FormItem>
            <FormItem {...formItemLayout} label="用工计划">
              {getFieldDecorator('RequireQuantity', {
                rules: [
                  {
                    required: true,
                    message: '请输入用工计划',
                  },
                ],
              })(<Input type="number" placeholder="请输入用工计划" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="做休机制">
              {getFieldDecorator('WorkType', {
                rules: [
                  {
                    required: true,
                    message: '请选择做休机制',
                  },
                ],
              })(
                <Select >
                  <Option key={1} value={0}>每天工作</Option>
                  <Option key={2} value={1}>做五休二</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="时薪">
              {getFieldDecorator('PriceOfPreHour', {
                rules: [
                  {
                    required: true,
                    message: '请选择时薪',
                  },
                ],
              })(
                <Select>
                  {
                    priceOfPreHourData.map(el => <Option key={el} value={el}>{el}元/小时</Option>)
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('Status', {
                rules: [
                  {
                    required: true,
                    message: '请选择时薪',
                  },
                ],
              })(
                <Select>
                  <Option key={0} value={0}>正常</Option>
                  <Option key={1} value={1}>关闭</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              validateStatus={this.projectTimeSlotFormStatus}
              help={this.projectTimeSlotFormStatus==='error'?'请添加班次':''}
              {...formItemLayout} label="班次">
              {
                this.getTimeSlotList()
              }
              <a onClick={this.openModal}>添加</a>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>取消</Button>
            </FormItem>
          </Form>
        </Card>
        <div id="map" style={{ height: '0px', width: '100%' }} />
        <Modal
          title="添加班次"
          visible={showModal}
          onOk={this.closeModal}
          onCancel={this.closeModal}
          footer={null}
        >
        <TimeSlotForm close={this.closeModal} submit={this.addTimeSlot} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
