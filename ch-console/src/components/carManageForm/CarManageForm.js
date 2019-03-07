import React from 'react';
import {Form, Input, Modal, Col, Row, DatePicker, Upload, Icon, InputNumber} from 'antd';
import Common from '../../common/Common';
import moment from 'moment';

const FormItem = Form.Item;
const Utils = new Common();

class CarManageForm {
  //车辆管理新增修改
  NewAndUpdateForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      selectedRows,
      formType,
      handleUpdate,
    } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // 新增
        if (formType === 'add') {
          handleAdd(fieldsValue);
        } else if (formType === 'update') {
          const params = fieldsValue;
          // 修改
          params.id = selectedRows.id;
          handleUpdate(params);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      handleModalVisible();
    };
    const formItemLayout = {labelCol: {span: 7}, wrapperCol: {span: 17}};

    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">上传全景图</div>
      </div>
    );

    // 手机号校验
    const checkMobile = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!(/^1\d{10}$/.test(value))){
        callback("手机号码有误，请重填");
      } else {
        callback();
      }
    };
    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        width={900}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="车牌号">
              {form.getFieldDecorator('carno', {
                rules: [{required: true, message: '请输入车牌号'}],
                initialValue: Utils.isNotNull(selectedRows.carno) ? selectedRows.carno : '',
              })(<Input disabled={Utils.isNotNull(selectedRows.carno) ? true : false}/>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="车架号">
              {form.getFieldDecorator('vin', {
                // rules: [{required: true, message: '请输入车架号'}],
                initialValue: Utils.isNotNull(selectedRows.vin) ? selectedRows.vin : '',
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="车型">
              {form.getFieldDecorator('model', {
                // rules: [{required: true, message: '请输入车型'}],
                initialValue: Utils.isNotNull(selectedRows.model) ? selectedRows.model : '',
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="颜色">
              {form.getFieldDecorator('color', {
                // rules: [{required: true, message: '请输入车颜色'}],
                initialValue: Utils.isNotNull(selectedRows.color) ? selectedRows.color : '',
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="品牌型号">
              {form.getFieldDecorator('brand', {
                // rules: [{required: true, message: '请输入品牌型号'}],
                initialValue: Utils.isNotNull(selectedRows.brand)
                  ? selectedRows.brand
                  : '',
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="所有人">
              {form.getFieldDecorator('owner', {
                // rules: [{required: true, message: '请输入所有人'}],
                initialValue: Utils.isNotNull(selectedRows.owner) ? selectedRows.owner : '',
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="证件号码">
              {form.getFieldDecorator('idcard', {
                // rules: [{required: true, message: '请输入证件号码'}],
                initialValue: Utils.isNotNull(selectedRows.idcard) ? selectedRows.idcard : '',
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="联系电话">
              {form.getFieldDecorator('tel', {
                rules: [
                  {
                  // required: true,
                  pattern: new RegExp(/^[0-9]\d*$/, "g"), message: '请输入联系电话'
                  },
                  { validator: checkMobile }
                  ],
                getValueFromEvent: (event) => {
                  return event.target.value.replace(/\D/g,'')
                },
                initialValue: Utils.isNotNull(selectedRows.tel) ? selectedRows.tel : '',
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="全景图">
              {form.getFieldDecorator('image')(<Upload listType="picture-card">{uploadButton}</Upload>)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  });
// 特种车辆新增修改
  SpecialCarAndUpdateForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      selectedRows,
      formType,
      updateRecord,
    } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // 新增
        if (formType === 'add') {
          handleAdd(fieldsValue);
        } else if (formType === 'update') {
          const params = fieldsValue;
          // 修改
          params.id = selectedRows.id;
          updateRecord(params);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      handleModalVisible();
    };
    const formItemLayout = {labelCol: {span: 8}, wrapperCol: {span: 10}};
    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <FormItem {...formItemLayout} label="车牌号">
          {form.getFieldDecorator('carno', {
            rules: [{required: true, message: '请输入车牌号'}],
            initialValue: Utils.isNotNull(selectedRows.carno) ? selectedRows.carno : '',
          })(<Input/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="政策部门">
          {form.getFieldDecorator('dept', {
            rules: [{required: true, message: '请输入政策部门'}],
            initialValue: Utils.isNotNull(selectedRows.dept) ? selectedRows.dept : '',
          })(<Input/>)}
        </FormItem>

        <FormItem {...formItemLayout} label="执行日期">
          {form.getFieldDecorator('startdate', {
            rules: [{required: true, message: '请输入执行日期'},],
            initialValue: Utils.isNotNull(selectedRows.startdate) ? moment(selectedRows.startdate) : moment()
          })(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="终止日期">
          {form.getFieldDecorator('enddate', {
            rules: [{required: true, message: '请输入终止日期'}],
            initialValue: Utils.isNotNull(selectedRows.enddate) ? moment(selectedRows.enddate) : moment()
          })(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="执行费率">
          {form.getFieldDecorator('rate', {
            rules: [{required: true, message: '请输入执行费率'}],
            initialValue: Utils.isNotNull(selectedRows.rate) ? selectedRows.rate : '',
          })(<InputNumber style={{width: 195}} min={0} />)}
        </FormItem>
      </Modal>
    );
  });

  DisobeyInfoAndUpdateForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      selectedRows,
      formType,
      updateRecord,
    } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // 新增
        if (formType === 'add') {
          handleAdd(fieldsValue);
        } else if (formType === 'update') {
          const params = fieldsValue;
          // 修改
          params.id = selectedRows.id;
          updateRecord(params);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      handleModalVisible();
    };
    const formItemLayout = {labelCol: {span: 8}, wrapperCol: {span: 16}};
    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={modalVisible}
        width={900}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="车牌号">
              {form.getFieldDecorator('carNo', {
                rules: [{required: true, message: '请输入车牌号'}],
                initialValue: Utils.isNotNull(selectedRows.carNo) ? selectedRows.carNo : '',
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="车主身份证">
              {form.getFieldDecorator('idCard', {
                rules: [{required: true, message: '请输入车主身份证'}],
                initialValue: Utils.isNotNull(selectedRows.idCard) ? selectedRows.idCard : '',
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="违章内容">
              {form.getFieldDecorator('content', {
                rules: [{required: true, message: '请输入违章内容'}],
                initialValue: Utils.isNotNull(selectedRows.content) ? selectedRows.content : '',
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="路段信息">
              {form.getFieldDecorator('roadInfo', {
                rules: [{required: true, message: '请输入路段信息'}],
                initialValue: Utils.isNotNull(selectedRows.roadInfo) ? selectedRows.roadInfo : '',
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="执法单位">
              {form.getFieldDecorator('lawDept', {
                rules: [{required: true, message: '请输入执法单位'}],
                initialValue: Utils.isNotNull(selectedRows.lawDept)
                  ? selectedRows.lawDept
                  : '',
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="罚款">
              {form.getFieldDecorator('fine', {
                rules: [{required: true, message: '请输入罚款金额'}],
                initialValue: Utils.isNotNull(selectedRows.fine) ? selectedRows.fine : '',
              })(<InputNumber style={{width: 237}} placeholder="单位为元" min={0} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="执法人">
              {form.getFieldDecorator('lawEnforcers', {
                rules: [{required: true, message: '请输入执法人'}],
                initialValue: Utils.isNotNull(selectedRows.lawEnforcers) ? selectedRows.lawEnforcers : '',
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="违章日期">
              {form.getFieldDecorator('inLawDate', {
                rules: [{required: true, message: '请输入违章日期'}],
                initialValue: Utils.isNotNull(selectedRows.inLawDate) ? moment(selectedRows.inLawDate, 'YYYY-MM-DD HH:mm:ss') : ''
              })(<DatePicker style={{width: 240}} format="YYYY-MM-DD HH:mm:ss"
                             showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}/>)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  });
}

export default CarManageForm;
