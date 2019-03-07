import React, { PureComponent } from 'react';
import { Form, Button, Select, Input} from 'antd';
const { TextArea } = Input;
import wechatNews from '../../models/wechatNews';
const {Option} = Select
const FormItem = Form.Item;
@Form.create()
class WechatNewsForm extends PureComponent {
  state = {  }

  componentDidMount() {
    const { data } = this.props;
    if (data.Id) {
      this.props.form.setFieldsValue(data)
    }
  }
  handleSubmit = e =>{
    const {submit,data} = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.Id = data.Id
        values.Seq = parseInt(values.Seq)
        submit(values)
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
        <FormItem {...formItemLayout} label="推送场景">
          {getFieldDecorator('Scenes', {
            rules: [{ required: true, message: '请选择推送场景!' }],
          })(
            <Select>
              <Option key={0} value={'注册'}>注册</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="消息序号">
          {getFieldDecorator('Seq', {
            rules: [
              {
                required: true,
                message: '请输入消息标题',
              },
            ],
          })(<Input type="number" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="消息标题">
          {getFieldDecorator('Title', {
            rules: [
              {
                required: true,
                message: '请输入消息标题',
              },
            ],
          })(<Input type="text"  />)}
        </FormItem>
        <FormItem {...formItemLayout} label="消息链接">
          {getFieldDecorator('Url', {
            rules: [
              {
                required: true,
                message: '请输入消息链接',
              },
            ],
          })(<Input type="text"  />)}
        </FormItem>
        <FormItem {...formItemLayout} label="图片链接">
          {getFieldDecorator('PicUrl', {
            rules: [
              {
                required: true,
                message: '请输入图片链接',
              },
            ],
          })(<Input type="text" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="消息描述">
          {getFieldDecorator('Description', {
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

export default WechatNewsForm;
