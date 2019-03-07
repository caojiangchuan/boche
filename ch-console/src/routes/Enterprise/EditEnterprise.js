import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['enterprise/formSubmit'],
}))
@Form.create()
export default class EditEnterprise extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'enterprise/formSubmit',
          payload: values,
        });
      }
    });
  };
  render() {
    const { submitting } = this.props;
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

    return (
      <PageHeaderLayout
        title="新增企业"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="企业名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业名称',
                  },
                ],
              })(<Input placeholder="请输入企业名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="社会信用代码">
              {getFieldDecorator('socialCreditCode', {
                rules: [
                  {
                    required: true,
                    message: '请输入社会信用代码',
                  },
                ],
              })(<Input placeholder="请输入社会信用代码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="企业地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业地址',
                  },
                ],
              })(<Input placeholder="请输入企业地址" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系人">
              {getFieldDecorator('contacts', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系人',
                  },
                ],
              })(<Input placeholder="请输入联系人" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系电话">
              {getFieldDecorator('contactsPhone', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系电话',
                  },
                ],
              })(<Input placeholder="请输入联系电话" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="面试要求">
              <div>
                {getFieldDecorator('requireInterview', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="0">需要企业资金面试</Radio>
                    <Radio value="1">不需要企业自己面试</Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>取消</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
