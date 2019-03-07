import React, { PureComponent } from 'react';
import { Button, Col, Tabs, Form, Icon, Input, Row, Table } from 'antd';
import styles from './VersionManage.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import {message} from "antd/lib/index";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const columns = [
  {
    title: '版本号',
    dataIndex: 'version',
  },
  {
    title: '发布日期',
    dataIndex: "realsedate",
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

@connect(({ versionManage, loading }) => ({
  versionManage,
  loading: loading.models.versionManage,
}))
@Form.create()
class VersionManage extends PureComponent  {

  state = {
    selectedRows: {},
    page:{
      start:1,
      limit:10,
    },
  };

  componentDidMount() {
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'versionManage/fetch',
      payload: {
        page:this.state.page,
        ...this.state.formValues,
      },
      callback: response => {
        if(response.success) {

        } else {
          message.error('数据加载失败');
        }
      }
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        searchType: 'lk',
        page: {
          start: 1,
          limit: 10,
        },
      };

      // dispatch({
      //   type: 'member/fetch',
      //   payload: values,
      // });

      this.setState({
        formValues: fieldsValue,
      });

      this.resetSelected();
    });
  };

  selectClick = (item, index) => {
    const customerId = item.id;
    this.setState({
      selectedRows: item,
      selectedRowIndex: index,
    });

    this.getCustomerOrderDetail(customerId);
    this.getCustomerCarDetail(customerId);
  };

  // 设置选中颜色
  setClassName = (record, index) => {
    const {selectedRowIndex} = this.state;
    return (index === selectedRowIndex ? `${styles.color}` : '')
  };

  // 切换页码触发事件-会员信息表
  handleChange = (page) => {
    // console.log(page, 'page');
    this.setState({
      page: {
        start: page.current,
        limit: page.pageSize,
      }
    }, () => {
      this.getData();
    });
  };

  renderSearchForm() {
    const { form } = this.props;
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };
    return (
      <div className={styles.searchItem}>
        <Form onSubmit={this.handleSearch}>
          <Row>
            <Col span={5}>
              <FormItem {...layout}>
                {form.getFieldDecorator('key', {})(<Input placeholder="昵称、手机号" />)}
              </FormItem>
            </Col>
            <Col span={4}>
              <Button style={{ marginTop: 5, marginLeft: -40 }} type="primary" htmlType="submit">
                搜索
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  render() {
    const {
      versionManage: { versionData },
      loading,
    } = this.props;

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: versionData.totalCount,
    };

    return (
      <PageHeaderLayout>
        <div className={styles.staffDiv}>
          <div>
            <div className={styles.staffInfoTable}>
              <div>{this.renderSearchForm()}</div>
              <Table
                loading={loading}
                // rowSelection={rowSelection}
                columns={columns}
                dataSource={versionData.data}
                rowKey={record => record.createdDate}
                bordered
                pagination={pagination}
                onChange={this.handleChange}
                // scroll={{ y: 300 }}
                rowClassName={this.setClassName}
                onRow={(text, index) => ({
                  onClick: () => {
                    this.selectClick(text, index);
                  },
                })}
              />
            </div>
          </div>

        </div>
      </PageHeaderLayout>
    );
  }
}

export default VersionManage;
