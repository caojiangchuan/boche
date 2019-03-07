import React, { PureComponent } from 'react';
import { Form, Input, TimePicker, Button } from 'antd';

const FormItem = Form.Item;
@Form.create()
class TimeSlotForm extends PureComponent {
  state = {  }
  handleSubmit = e =>{
    const {submit} = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        submit({Start:values.start.format('HH:mm'),End:values.end.format('HH:mm'),Uncount:values.uncount })
      }
    });
  }
  render() {
    const {close} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
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
        <FormItem {...formItemLayout} label="上班时间">
          {getFieldDecorator('start', {
            rules: [{ required: true, message: '请选择上班时间!' }],
          })(
            <TimePicker  placeholder="上班时间" format="HH:mm" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="下班时间">
          {getFieldDecorator('end', {
            rules: [{ required: true, message: '请选择下班时间!' }],
          })(
            <TimePicker  placeholder="下班时间" format="HH:mm" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="不计工时">
          {getFieldDecorator('uncount', {
            rules: [{ required: true, message: '请输入不计工时数!' }],
          })(
            <Input type="text" placeholder="不计工时时间（小时）" />
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

export default TimeSlotForm;
