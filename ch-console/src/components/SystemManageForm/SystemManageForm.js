import React from 'react';
import { Form, Input, Modal, Col, Row, DatePicker, Select, Tree, TreeSelect, Upload, Icon } from 'antd';
import Common from '../../common/Common';
import moment from 'moment';
import {city} from "../ContainerFooter/geographic/city";
import {province} from "../ContainerFooter/geographic/province";
import {dutyStatus, sexStatus} from "../../common/Enum";

const FormItem = Form.Item;
const Utils = new Common();
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
const TreeSelectNode = TreeSelect.TreeNode;

class SystemManageForm extends React.Component{
  //组织管理新增修改
  OrganizationForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      selectedRows,
      formType,
      updateRecord,
      citys,
      changeCity,
      setCityToNull
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
          params.id = selectedRows.id;
          updateRecord(params,form);
        }
      });
    };
    //根据省份选择市
    const provinceChange = value => {
        setCityToNull();
        const pro = province.filter((item)=>{
          return item.name === value
        });
        const proNo = pro[0].id;
        changeCity(city[proNo]);
    };

    const cancelHandle = () => {
      form.resetFields();
      handleModalVisible();
      changeCity([])
    };
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
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
            <FormItem {...formItemLayout} label="组织名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入组织名称' }],
                initialValue: Utils.isNotNull(selectedRows.name) ? selectedRows.name : '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="省份">
              {form.getFieldDecorator('province', {
                rules: [{ required: true, message: '请选择所在省份' }],
                initialValue: Utils.isNotNull(selectedRows.province) ? selectedRows.province : '',
              })(<Select  style={{width:250}} onChange={provinceChange}>{Utils.dropDownOption(province,'name','name')}</Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="市">
              {form.getFieldDecorator('city', {
                rules: [{ required: true, message: '请选择所在城市' }],
                initialValue: Utils.isNotNull(selectedRows.city) ? selectedRows.city : '',
              })(<Select  style={{width:250}}>{Utils.dropDownOption(citys,'name','name')}</Select>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="组织性质">
              {form.getFieldDecorator('category', {
                rules: [{ required: true, message: '请输入组织性质' }],
                initialValue: Utils.isNotNull(selectedRows.category) ? selectedRows.category : '',
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="联系电话">
              {form.getFieldDecorator('tel', {
                rules: [{ required: true, message: '请输入联系电话' }],
                initialValue: Utils.isNotNull(selectedRows.tel) ? selectedRows.tel : '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="地址">
              {form.getFieldDecorator('address', {
                rules: [{ required: true, message: '请输入地址' }],
                initialValue: Utils.isNotNull(selectedRows.address) ? selectedRows.address : '',
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <FormItem {...formItemLayout} label="主页">
              {form.getFieldDecorator('homepage', {
                rules: [{ required: true, message: '请输入主页' }],
                initialValue: Utils.isNotNull(selectedRows.homepage) ? selectedRows.homepage : '',
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem {...formItemLayout} label="组织介绍">
              {form.getFieldDecorator('descr', {
                rules: [{ required: true, message: '请输入组织介绍' }],
                initialValue: Utils.isNotNull(selectedRows.descr) ? selectedRows.descr : '',
              })(<TextArea />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  });

  // 角色管理新增修改
  RoleForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      selectedRows,
      formType,
      handleUpdate,
      handleCheck,
      checkedKeys,
      functionList
    } = props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // 新增
        if (formType === 'add') {
          fieldsValue.functionIdList = checkedKeys;
          handleAdd(fieldsValue);
        } else if (formType === 'update') {
          // 修改
          fieldsValue.id = selectedRows.id;
          fieldsValue.functionIdList = checkedKeys;
          handleUpdate(fieldsValue);
        }
      });
    };

    // generateList();

    const cancelHandle = () => {
      form.resetFields();
      handleModalVisible();
    };

    const onSelect = (selectedKeys, info) => {
      console.log('selected', selectedKeys, info);
    };

    const onCheck = (checkedKeys, info) => {
      handleCheck(checkedKeys);
      console.log('onCheck', checkedKeys, info);
    };

    const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 15 } };

    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <FormItem {...formItemLayout} label="角色名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入角色名称' }],
            initialValue: Utils.isNotNull(selectedRows.name) ? selectedRows.name : '',
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="说明">
          {form.getFieldDecorator('note', {
            rules: [{ required: true, message: '请输入说明信息' }],
            initialValue: Utils.isNotNull(selectedRows.note) ? selectedRows.note : '',
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="功能列表">
          {form.getFieldDecorator('authorityList', {
            // rules: [{required: true, message: '请选择功能'}],
            // initialValue: Utils.isNotNull(selectedRows.authorityList) ? selectedRows.authorityList : '',
          })(
            <div style={{ border: '2px solid #A6C8FF', borderRadius: '5px', maxHeight: 400, overflow: 'auto' }}>
              <Tree checkable defaultExpandAll={true} onSelect={onSelect} onCheck={onCheck} defaultCheckedKeys={checkedKeys}>
                {Utils.loop(functionList)}
              </Tree>
            </div>
          )}
        </FormItem>
      </Modal>
    );
  });


//部门新增修改
  DeptForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      selectedRows,
      formType,
      updateRecord,
      orgData,
      orgRecord,
      deptRecord,
    } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // 新增
        if (formType === 'add') {
          if(Utils.isNotNull(deptRecord)){
            fieldsValue.deptid = deptRecord.id;
          }
          handleAdd(fieldsValue,form);
        } else if (formType === 'update') {
          const params = fieldsValue;
          // 修改
          params.id = selectedRows.id;
          params.deptid = selectedRows.deptid;
          updateRecord(params,form);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      handleModalVisible();
    };
    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 15}};
    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <FormItem {...formItemLayout} label="组织名称">
          {form.getFieldDecorator('orgid', {
            rules: [{required: true, message: '请选择组织'}],
            initialValue: Utils.isNotNull(orgRecord.id) ? `${orgRecord.id}` : '',
          })(<Select disabled style={{width:290}}>{Utils.dropDownOption(orgData.data,'id','name')}</Select>)}
        </FormItem>

        <FormItem {...formItemLayout} label="部门">
          {form.getFieldDecorator('name', {
            rules: [{required: true, message: '请输入部门'}],
            initialValue: Utils.isNotNull(selectedRows.name) ? selectedRows.name : '',
          })(<Input/>)}
        </FormItem>
      </Modal>
    );
  });

  //员工新增修改
  StaffForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      handleAdd,
      handleModalVisible,
      selectedRows,
      formType,
      handleUpdate,
      deptData,
      deptAllData,

      fileList,
      previewVisible,
      previewImage,
      handleImageCancel,
      handleImagePreview,
      handleImageChange,
      handleOnRemove,
    } = props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // 新增
        if (formType === 'add') {
          fieldsValue.logo = previewImage;
          handleAdd(fieldsValue);
        } else if (formType === 'update') {
          fieldsValue.logo = previewImage;
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

    // 头像相关属性方法
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const handleCancel = () => {
      handleImageCancel();
    };

    const handlePreview = (file) => {
      handleImagePreview(file);
    };

    const handleChange = (item) => {
      handleImageChange(item);
    };

    const checkMobile = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!(/^1\d{10}$/.test(value))){
        callback("电话号码有误，请重填");
      } else {
        callback();
      }
    };

    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 15 } };
    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <FormItem {...formItemLayout} label="姓名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入姓名' },{max: 10, message: '长度不能超过10个字符'}],
            initialValue: Utils.isNotNull(selectedRows.name) ? selectedRows.name : '',
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="头像">
          <div>
            <Upload
              action="/file/v1/tmp/upload/"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              onRemove={handleOnRemove}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
            <img alt={fileList.title} style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label="性别">
          {form.getFieldDecorator('sex', {
            rules: [{ required: true, message: '请输入选择' }],
            initialValue: Utils.isNotNull(selectedRows.sex) ? selectedRows.sex : '',
          })(
            <Select placeholder="在职状态" style={{width: 295}}>
              {Utils.dropDownOption(sexStatus, 'value', 'name')}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="电话">
          {form.getFieldDecorator('tel', {
            rules: [
              { required: true, pattern: new RegExp(/^[0-9]\d*$/, "g"), message: '请输入电话号码' },
              { validator: checkMobile }
            ],
            getValueFromEvent: (event) => {
              return event.target.value.replace(/\D/g,'')
            },
            initialValue: Utils.isNotNull(selectedRows.tel) ? selectedRows.tel : '',
          })(<Input />)}
        </FormItem>
        {/*<FormItem {...formItemLayout} label="密码">*/}
          {/*{form.getFieldDecorator('pwd', {*/}
            {/*rules: [{ required: true, message: '请输入密码' }],*/}
          {/*})(<Input type="password" />)}*/}
        {/*</FormItem>*/}
        <FormItem {...formItemLayout} label="部门">
          {form.getFieldDecorator('deptid', {
            rules: [{ required: true, message: '请选择部门' }],
            initialValue: Utils.isNotNull(selectedRows.deptid) ? `${selectedRows.deptid}` : '',
          })(
            <TreeSelect
              style={{ width: 295 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择部门"
              allowClear
              treeDefaultExpandAll
            >
              {Utils.loopDept(deptAllData.data)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="在职状态">
          {form.getFieldDecorator('workstatus', {
            rules: [{ required: true, message: '请选择在职状态' }],
            initialValue: Utils.isNotNull(selectedRows.workstatus) ? `${selectedRows.workstatus}` : '',
          })(
            <Select placeholder="在职状态" style={{width: 295}}>
              {Utils.dropDownOption(dutyStatus, 'value', 'name')}
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  });

  // 公告新增修改
  NoticesForm = Form.create()(props => {
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
          // 修改
          fieldsValue.id = selectedRows.id;
          handleUpdate(fieldsValue);
        }
      });
    };

    const cancelHandle = () => {
      form.resetFields();
      handleModalVisible();
    };

    const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 15 } };

    return (
      <Modal
        title={`${formType === 'add' ? '新增信息' : '修改信息'}`}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={cancelHandle}
        maskClosable={false}
        destroyOnClose={true}
      >
        <FormItem {...formItemLayout} label="标题">
          {form.getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入标题' }],
            initialValue: Utils.isNotNull(selectedRows.title) ? selectedRows.title : '',
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="详情">
          {form.getFieldDecorator('detail', {
            rules: [{ required: true, message: '请输入详情' }],
            initialValue: Utils.isNotNull(selectedRows.detail) ? selectedRows.detail : '',
          })(<Input />)}
        </FormItem>
      </Modal>
    );
  });
}

export default SystemManageForm;
