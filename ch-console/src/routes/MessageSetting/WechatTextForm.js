import React, { PureComponent } from 'react';
import { Form, Button, Select, Input} from 'antd';
const { TextArea } = Input;
import wechatNews from '../../models/wechatNews';
const {Option} = Select
const FormItem = Form.Item;
@Form.create()
class WechatTextForm extends PureComponent {
  state = {
    data:{}
   }
  handleSubmit = e =>{
    const {submit,data} = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.Id = data.Id
        submit(values)
      }
    });
  }

  componentDidMount() {
    const { data } = this.props;
    if(data.Id){
      this.props.form.setFieldsValue(data)
    }
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
        <FormItem {...formItemLayout} label="推送场景">
          {getFieldDecorator('Scenes', {
            rules: [{ required: true, message: '请选择推送场景!' }],
          })(
            <Select>
            <Option key={0} value={'注册成功'}>注册成功</Option>
            <Option key={0} value={'签约成功'}>签约成功</Option>
            <Option key={0} value={'项目申请'}>项目申请</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="消息描述">
          {getFieldDecorator('Content', {
            rules: [
              {
                required: true,
                message: '请输入消息描述',
              },
            ],
          })(<TextArea rows={4} />)}
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

export default WechatTextForm;
