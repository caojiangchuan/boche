import React from 'react';
import {Form, Input, InputNumber, Modal, Col, Row, DatePicker, Select, Tree,Table, TimePicker} from 'antd';
import Common from '../../common/Common';
import moment from 'moment';
import {enableHalfHour} from '../../common/Enum'

const FormItem = Form.Item;
const Utils = new Common();
const {TextArea} = Input;
const TreeNode = Tree.TreeNode;
const {RangePicker} = DatePicker;

class SettlementMethodForm {

  //策略
  SettlementForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      handleAdd,
      setRecord,
      formType,
      updateRecord,
      handleModalVisible
    } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // 新增
        if (formType === 'add') {
          handleAdd(fieldsValue,form);
        } else if (formType === 'update') {
          const params = fieldsValue;
          // 修改
          params.id = setRecord.id;
          updateRecord(params,form);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      handleModalVisible(false);
    };
    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 14}};
    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <FormItem {...formItemLayout} label="计费策略">
          {form.getFieldDecorator('name', {
            rules: [{required: true, message: '请输入计费策略'}],
            initialValue: Utils.isNotNull(setRecord.name) ? setRecord.name : '',
          })(<Input/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="免费时长(分钟)">
          {form.getFieldDecorator('freeminute', {
            rules: [{required: true, message: '请输入免费时长'}],
            initialValue: Utils.isNotNull(setRecord.freeminute) ? setRecord.freeminute : '',
          })(<InputNumber style={{width: 275}} placeholder="单位为分钟" min={0} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="车型">
          {form.getFieldDecorator('cartype', {
            rules: [{required: true, message: '请输入车型'}],
            initialValue: Utils.isNotNull(setRecord.cartype) ? setRecord.cartype : '',
          })(<Input/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="封顶费用(元)">
          {form.getFieldDecorator('topfee', {
            rules: [{required: true, message: '请输入封顶费用'}],
            initialValue: Utils.isNotNull(setRecord.topfee) ? setRecord.topfee : '',
          })(<InputNumber style={{width: 275}} placeholder="单位为元" min={0}/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="结算后停车时间">
          {form.getFieldDecorator('leaveminute', {
            rules: [{required: true, message: '请输入结算后停车时间'}],
            initialValue: Utils.isNotNull(setRecord.leaveminute) ? setRecord.leaveminute : '',
          })(<InputNumber style={{width: 275}} placeholder="单位为分钟" min={0}/>)}
        </FormItem>
      </Modal>
    );
  });

  // 时间段
  TimesForm = Form.create()(props => {
    const {
      timeModalVisible,
      form,
      addTime,
      handleTimeModalVisible,
      timeRecord,
      formType,
      updateTime,
      hisRecord
    } = props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;

        fieldsValue.starthour = fieldsValue['starthour'].format('HH');
        fieldsValue.endhour = fieldsValue['endhour'].format('HH');

        // 新增
        if (formType === 'add') {
          fieldsValue.strategyid = hisRecord.id;
          addTime(fieldsValue,form);
        } else if (formType === 'update') {
          // 修改
          fieldsValue.id = timeRecord.id;
          fieldsValue.strategyid = hisRecord.id;
          updateTime(fieldsValue,form);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      handleTimeModalVisible(false);
    };

    const formItemLayout = {labelCol: {span: 7}, wrapperCol: {span: 12}};

    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={timeModalVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <FormItem {...formItemLayout} label="开始时间">
          {form.getFieldDecorator('starthour', {
            rules: [{required: true, message: '请选择开始时间'}],
            // initialValue: Utils.isNotNull(timeRecord.starthour) ? timeRecord.starthour : '',
            initialValue: Utils.isNotNull(timeRecord.starthour) ? moment(timeRecord.starthour, 'HH') : '',
          })
          // (<InputNumber style={{width: 275}} placeholder="单位为分钟" min={0} />)
          (<TimePicker style={{width: 275}} format="HH" />)
          }
        </FormItem>

        <FormItem {...formItemLayout} label="结束时间">
          {form.getFieldDecorator('endhour', {
            rules: [{required: true, message: '请选择结束时间'}],
            // initialValue: Utils.isNotNull(timeRecord.endhour) ? timeRecord.endhour : '',
            initialValue: Utils.isNotNull(timeRecord.endhour) ? moment(timeRecord.endhour, 'HH') : '',
          })
          // (<InputNumber style={{width: 275}} placeholder="单位为分钟" min={0}/>)
          (<TimePicker style={{width: 275}} format="HH" />)
          }
        </FormItem>

        <FormItem {...formItemLayout} label="单价（元）">
          {form.getFieldDecorator('price', {
            rules: [{required: true, message: '请输入单价'}],
            initialValue: Utils.isNotNull(timeRecord.price) ? timeRecord.price : '',
          })(<InputNumber style={{width: 275}} placeholder="单位为元" min={0}/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="按半小时计费">
          {form.getFieldDecorator('enable30', {
            rules: [{required: true, message: '请选择是否按半小时计费'}],
            initialValue: Utils.isNotNull(timeRecord.enable30) ? `${timeRecord.enable30}` : '',
          })(<Select style={{width:275}}>{Utils.dropDownOption(enableHalfHour,'value','name')}</Select>)}
        </FormItem>
      </Modal>
    );
  });


//停车场查看
  ParkingForm = Form.create()(props => {
    const {
      parkingVisible,
      form,
      closeParkingModal,
      parkingList
    } = props;

    const columns = [ {
      title: '停车场或片区名称',
      align:'center',
      dataIndex: 'name',
    }];

    const cancelHandle = () => {
      closeParkingModal(form);
    };
    return (
      <Modal
        title={`关联的停车场`}
        visible={parkingVisible}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
      >
        <Table dataSource={parkingList} columns={columns} bordered/>
      </Modal>
    );
  });


}

export default SettlementMethodForm;
