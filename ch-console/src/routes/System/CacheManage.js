import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form,message, Table, Icon,Button} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './systemManage.less';

@connect(({ cacheManage, loading }) => ({
  cacheManage,
  loading: loading.models.cacheManage,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: {},
    formValues: {},
    formType: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cacheManage/fetch',
    });
  }

  refresh =record =>{
    console.log(record)
  }

  render() {
    const {
      cacheManage: { data },
      loading,
    } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '缓存名称',
        dataIndex: 'cacheName',
      },
      {
        title: '描述',
        dataIndex: 'describe',
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              <Icon type="sync" onClick={() => this.refresh(record)} />
            </div>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}></div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => {}}>新建</Button>
            </div>
            <Table
              bordered
              loading={loading}
              dataSource={data.list}
              columns={columns}
              onRow={(record, index) => ({
                onDoubleClick: () => {
                  this.doubleClick(record, index, this.state.page);
                },
              })}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
