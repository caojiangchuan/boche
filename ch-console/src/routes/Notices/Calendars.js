import { ITagCloudProps } from './../../components/Charts/TagCloud/index.d';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Checkbox, Modal, AutoComplete } from 'antd';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Row,
  Col,
  Badge,
  Popconfirm,
  Calendar,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import debounce from 'lodash/debounce';

const FormItem = Form.Item;
@connect(({ notices, loading }) => ({
  notices: notices,
  submitting: loading.effects['notices/formSubmit'],
}))
@Form.create()
export default class Calendars extends PureComponent {
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
      //设置修改内容
      this.props.form.setFieldsValue(this.props.notices.noticeDetail);
    }
  }
  state = {
    dataSource: [],
  };
  onSelect = value => {
    console.log('onSelect', value);
  };

  onPanelChange = (value, mode) => {
    console.log(value, mode);
  };
  getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: '上班' },
          { type: 'success', content: '立秋' },
        ]; break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ]; break;
      case 15:
        listData = [
          { type: 'warning', content: 'This is warning event' },
          { type: 'success', content: 'This is very long usual event。。....' },
          { type: 'error', content: 'This is error event 1.' },
          { type: 'error', content: 'This is error event 2.' },
          { type: 'error', content: 'This is error event 3.' },
          { type: 'error', content: 'This is error event 4.' },
        ]; break;
      default:
    }
    return listData || [];
  };
  /**
   * 自定义渲染日期单元格，返回内容会被追加到单元格
   * @param value
   * @returns {XML}
   */
  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {
          listData.map(item => (
            <li key={item.content}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))
        }
      </ul>
    );
  };
  /**
   *
   * @param value
   * @returns {number}
   */
  getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };
  /**
   * 自定义渲染月单元格，返回内容会被追加到单元格
   * @param value
   * @returns {*}
   */
  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  /**
   * 点击选择日期回调
   * @param value
   */
  onSelect = (value) => {
    console.log("calendars select");
    console.log(value);
  };
  render() {
    const {
      notices: { showModal },
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <PageHeaderLayout title="日历设置：  设定工作日、周末">
        <Card bordered={false}>
          <Calendar onPanelChange={this.onPanelChange} dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} onSelect={this.onSelect} />
        </Card>
        <div id="map" style={{ height: '0px', width: '100%' }} />
      </PageHeaderLayout>
    );
  }
}
