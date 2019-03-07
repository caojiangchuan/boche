import React, { PureComponent } from 'react';
import { Form, Button ,Select} from 'antd';
const {Option} = Select
const FormItem = Form.Item;
@Form.create()
class UserMatchForm extends PureComponent {
  state = {  }
  handleSubmit = e =>{
    const {submit,users:{state:{selectedRowKeys}},workDays} = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var timeSlot =  this.props.timeSlot.filter(item => item.Id === values.projectTimeSlotId)[0];
        var projectAddress = this.props.address.filter(item => item.Id == values.projectAddressId)[0]
        var formData = {workDays,users: selectedRowKeys,timeSlot,projectAddress}
        submit(formData)
      }
    });
  }
  render() {
    const {close} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <Form  onSubmit={this.handleSubmit} className="login-form">
        <FormItem {...formItemLayout} label="班次">
          {getFieldDecorator('projectTimeSlotId', {
            rules: [{ required: true, message: '请选择班次!' }],
          })(
            <Select>
              {this.props.timeSlot.map((item) => <Option key={item.Id} value={item.Id}>{item.Start}-{item.End}</Option> )}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="工作地点">
          {getFieldDecorator('projectAddressId', {
            rules: [{ required: true, message: '请选择工作地点!' }],
          })(
            <Select>
              {this.props.address.map((item) => {
                return <Option key={item.Id} value={item.Id}>{item.Name}</Option>
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={close} style={{ marginLeft: 8 }}>取消</Button>
        </FormItem>
      </Form>
    );
  }
}

export default UserMatchForm;
