import { ITagCloudProps } from './../../components/Charts/TagCloud/index.d';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Checkbox, Modal, AutoComplete } from 'antd';
import { Form, Input, DatePicker, Select, Button, Card, Row, Col, Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import debounce from 'lodash/debounce';

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ notices, loading }) => ({
  notices: notices,
  submitting: loading.effects['notices/formSubmit'],
}))
@Form.create()
export default class EditNotice extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      var flag = true;
      if (!flag) {
        return;
      }
      if (!err) {
        this.props.dispatch({
          type: 'notices/formSubmit',
          payload: {
            forms: { ...values, Id: this.props.notices.noticeDetail.Id },
          },
        });
      }
    });
  };
  componentDidMount() {
    if (this.props.notices.noticeDetail.Id) {
      //填充修改内容
      this.props.form.setFieldsValue(this.props.notices.noticeDetail);
    }
  }
  state = {
    dataSource: [],
  };
  handleCancel = e => {
    console.log("11111");
  };
  render() {
    const {
      notices: { showModal },
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
      <PageHeaderLayout title="公告发布">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('Title', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题',
                  },
                ],
              })(<Input placeholder="请输入标题" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="内容">
              {getFieldDecorator('Content', {
                rules: [
                  {
                    required: true,
                    message: '请输入内容',
                  },
                ],
              })(<TextArea rows={6} placeholder="请输入内容" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="摘要">
              {getFieldDecorator('Summary', {
                rules: [
                  {
                    required: true,
                    message: '请输入摘要',
                  },
                ],
              })(<TextArea rows={4} placeholder="请输入摘要" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                发布
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={e => {
                  e.preventDefault();
                  this.props.dispatch({
                    type: 'notices/list',
                    payload: {},
                  });
                }}
              >取消</Button>
            </FormItem>
          </Form>
        </Card>
        <div id="map" style={{ height: '0px', width: '100%' }} />
      </PageHeaderLayout>
    );
  }
}
