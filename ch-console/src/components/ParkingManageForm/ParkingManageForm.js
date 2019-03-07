import React from 'react';
import {Form, Input, Modal, Col, Row, DatePicker, Select} from 'antd';
import styles from '../../routes/Resource/parkingManage.less';
import Common from '../../common/Common';
import {cameraStatus, carFieldStatus} from '../../common/Enum'
import moment from 'moment';

const FormItem = Form.Item;
const Utils = new Common();

class ParkingManageForm {
  //车位新增修改
  CarFieldForm = Form.create()(props => {
    const {
      carFieldVisible,
      form,
      handleAdd,
      closeCarField,
      selectedRows,
      formType,
      updateRecord,
      areaRecord
    } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // 新增
        if (formType === 'add') {
          fieldsValue.parkareaid = areaRecord.id;
          handleAdd(fieldsValue);
        } else if (formType === 'update') {
          const params = fieldsValue;
          // 修改
          params.id = selectedRows.id;
          params.parkareaid = selectedRows.parkareaid;
          params.carno = selectedRows.carno;
          params.parktime=selectedRows.parktime;
          params.fee= selectedRows.fee;
          params.camera = selectedRows.camera;
          updateRecord(params,form);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      closeCarField();
    };

    const checkDeviceId = (rule, value, callback) => {

      if (value.length > 10) {
        callback("设备Id过长");
      } else {
        callback();
      }
    };

    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 13}};
    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={carFieldVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
            <FormItem {...formItemLayout} label="泊位">
              {form.getFieldDecorator('positionno', {
                rules: [{required: true, message: '请输入泊位'}],
                initialValue: Utils.isNotNull(selectedRows.positionno) ? selectedRows.positionno : '',
              })(<Input/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备编号">
              {form.getFieldDecorator('deviceno', {
                rules: [{required: true, message: '请输入设备编号'}, { validator: checkDeviceId }],
                initialValue: Utils.isNotNull(selectedRows.deviceno) ? selectedRows.deviceno : '',
              })(<Input/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="摄像头">
              {form.getFieldDecorator('camera', {
                rules: [{required: true, message: '请输入选择摄像头'}],
                initialValue: Utils.isNotNull(selectedRows.camera) ? `${selectedRows.camera}` : '',
              })(<Select className={styles.selectWidth}>{Utils.dropDownOption(cameraStatus, 'value', 'name')}</Select>)}
            </FormItem>
            <div style={{display:formType==='add'?'none':'block'}}>
              <FormItem {...formItemLayout} label="状态">
                {form.getFieldDecorator('status', {
                  rules: [{required: true, message: '请输入状态'}],
                  initialValue: Utils.isNotNull(selectedRows.status) ? `${selectedRows.status}` : '3',
                })(<Select
                  className={styles.selectWidth} disabled={formType === 'add'}>{Utils.dropDownOption(carFieldStatus, 'value', 'name')}</Select>)}
              </FormItem>
            </div>
      </Modal>
    );
  });


  //停车场新增修改
  ParkingForm = Form.create()(props => {
    const {
      parkingVisible,
      form,
      closeParkingVisible,
      parkingRecord,
      formType,
      handleUpdatePark,
      handParkingAdd,
      settlementList
    } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // 新增
        if (formType === 'add') {
          handParkingAdd(fieldsValue);
        } else if (formType === 'update') {
          const params = fieldsValue;
          // 修改
          params.id = parkingRecord.id;
          handleUpdatePark(params,form);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      closeParkingVisible();
    };
    const formItemLayout = {labelCol: {span: 8}, wrapperCol: {span: 10}};
    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={parkingVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <FormItem {...formItemLayout} label="停车场名称">
          {form.getFieldDecorator('name', {
            rules: [{required: true, message: '请输入停车场名称'}],
            initialValue: Utils.isNotNull(parkingRecord.name) ? parkingRecord.name : '',
          })(<Input/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="计费策略">
          {form.getFieldDecorator('parkstrategyid', {
            rules: [{required: true, message: '请选择计费策略'}],
            initialValue: Utils.isNotNull(parkingRecord.parkstrategyid) ? `${parkingRecord.parkstrategyid}`: '',
          })(<Select style={{width:196}}>{Utils.dropDownOption(settlementList, 'id', 'name')}</Select>)}
        </FormItem>
        <FormItem {...formItemLayout} label="地址">
          {form.getFieldDecorator('addr', {
            rules: [{required: true, message: '请输入停车场地址'}],
            initialValue: Utils.isNotNull(parkingRecord.addr) ? parkingRecord.addr : '',
          })(<Input/>)}
        </FormItem>
      </Modal>
    );
  });

  //停车场区域新增修改
  AreaForm = Form.create()(props => {
    const {
      areaVisible,
      form,
      addArea,
      closeAreaVisible,
      areaRecord,
      parkingRecord,
      formType,
      updateArea,
      settlementList
    } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // 新增
        if (formType === 'add') {
          fieldsValue.parkid = parkingRecord.id;
          addArea(fieldsValue,form);
        } else if (formType === 'update') {
          const params = fieldsValue;
          // 修改
          params.id = areaRecord.id;
          params.parkid = areaRecord.parkid;
          updateArea(params,form);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      closeAreaVisible();
    };
    const formItemLayout = {labelCol: {span: 8}, wrapperCol: {span: 10}};
    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={areaVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <FormItem {...formItemLayout} label="区域">
          {form.getFieldDecorator('name', {
            rules: [{required: true, message: '请输入区域'}],
            initialValue: Utils.isNotNull(areaRecord.name) ? areaRecord.name : '',
          })(<Input/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="计费策略">
          {form.getFieldDecorator('parkstrategyid', {
            rules: [{required: true, message: '请选择计费策略'}],
            initialValue: Utils.isNotNull(areaRecord.parkstrategyid) ? `${areaRecord.parkstrategyid}`: '',
          })(<Select style={{width:196}}>{Utils.dropDownOption(settlementList, 'id', 'name')}</Select>)}
        </FormItem>
      </Modal>
    );
  });
}

export default ParkingManageForm;
