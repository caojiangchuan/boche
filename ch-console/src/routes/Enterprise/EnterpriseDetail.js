import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Radio, Button } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './EnterpriseList.less';
import StandardTable from 'components/StandardTable';
const { Description } = DescriptionList;
const RadioGroup = Radio.Group;
@connect(({ enterprise, loading }) => ({
  enterprise,
  loading: loading.models.enterprise,
}))
export default class EnterpriseDetail extends Component {
  state = {
    selectedRows: [],
  };
  componentDidMount() {
  }

  render() {
    const {
      enterprise,
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '联系人',
        dataIndex: 'Id',
      },
      {
        title: '联系电话',
        dataIndex: 'WorkDay',
      },
    ];
    return (
      <PageHeaderLayout title="企业信息">
        <Card bordered={false}>
          <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
            <Description term="企业ID">{enterprise.detail.Id}</Description>
            <Description term="企业名称">{enterprise.detail.Name}</Description>
            <Description term="社会信用代码">{enterprise.detail.SocialCreditCode}</Description>
            <Description term="企业地址">{enterprise.detail.Address}</Description>
            <Description term="联系人">{enterprise.detail.Contacts}</Description>
            <Description term="联系电话">{enterprise.detail.ContactsPhone}</Description>
            <Description term="面试要求">
              <RadioGroup onChange={this.onChange} value={enterprise.detail.RequireInterview ? 1 : 2} disabled={true}>
                <Radio value={1}>需要企业自己面试</Radio>
                <Radio value={2}>不需要企业自己面试</Radio>
              </RadioGroup>
            </Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <Button
            style={{ marginLeft: 32 }}
            type="primary"
            onClick={e => {
              e.preventDefault();
              this.props.dispatch({
                type: 'enterprise/list',
                payload: {},
              });
            }}
          >返回
          </Button>
        </Card>
        {/*<Card bordered={false} title="联系人信息">*/}
          {/*<div className={styles.tableList}>*/}
            {/*<StandardTable*/}
              {/*rowKey="Id"*/}
              {/*loading={loading}*/}
              {/*selectedRows={selectedRows}*/}
              {/*data={enterprise}*/}
              {/*columns={columns}*/}
              {/*onChange={this.handleStandardTableChange}*/}
              {/*onRow={record => ({*/}
                {/*onClick: () => {*/}
                  {/*this.selectRow(record);*/}
                {/*},*/}
              {/*})}*/}
            {/*/>*/}
          {/*</div>*/}
        {/*</Card>*/}
      </PageHeaderLayout>
    );
  }
}
