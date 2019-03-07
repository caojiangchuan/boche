import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Badge,
  Calendar,
  Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const FormItem = Form.Item;
@connect(({ customer, loading}) => ({
  customer, loading: loading.models.customer,
}))
@Form.create()
export default class TimeBoard extends PureComponent {
  state = {
    visible: false,
    content:{},
  };

  componentDidMount() {
    const { dispatch } = this.props;
  }

  showModal = () => {
    this.setState({
      visible: true,
      content:"11111111",
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  /**
   * 日期面板变化回调
   * @param value
   * @param mode
   */
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
    this.showModal();
  };
  render() {
    return (
      <PageHeaderLayout title="日历设置：  设定工作日、周末">
        <Card bordered={false}>
          <Calendar onPanelChange={this.onPanelChange} dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} onSelect={this.onSelect} />
        </Card>
        <Modal
          title="查看分时信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          content={this.state.content}></Modal>
        <div id="map" style={{ height: '0px', width: '100%' }} />
      </PageHeaderLayout>
    );
  }
}
