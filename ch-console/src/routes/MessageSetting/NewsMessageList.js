import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import WechatNewsForm from './WechatNewsForm'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Popconfirm,
  Icon ,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Table.less';
import { textChangeRangeIsUnchanged } from '../../../node_modules/typescript';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

@connect(({ wechatNews, loading }) => ({
  wechatNews,
  loading: loading.models.wechatNews,
}))
@Form.create()
export default class NewsMessageList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    rowData:{}
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'wechatNews/fetch',
      payload: {}
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'wechatNews/fetch',
      payload: params,
    });
  };
  handleSubmit = (formData) => {
    this.closeModal()
    var type = "wechatNews/add"
    if(formData.Id){
      type = "wechatNews/update"
    }
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: formData,
      callback: ()=>{
        this.props.dispatch({
          type: 'wechatNews/fetch',
          payload: {},
        });
      }
    });
  }

  deleteRow = (id) => {
    this.props.dispatch({
      type: 'wechatNews/delete',
      payload: {id},
      callback: () => {
        this.props.dispatch({
          type: 'wechatNews/fetch',
          payload: {},
        });
      }
    });
  }
  closeModal = () => {
    this.setState({
      modalVisible:false,
      rowData:{}
    })
  }
  showModal = () => {
    this.setState({
      modalVisible: true
    })
  }
  getModal = () =>{
    if(this.state.modalVisible) {
      return (
        <Modal
          title="新增"
          visible={true}
          footer={null}
          onOk={this.closeModal}
          onCancel={this.closeModal}
        >
          <WechatNewsForm close={this.closeModal} data={this.state.rowData} submit={this.handleSubmit} />
        </Modal>
      )
    }
  }
  render() {
    const { wechatNews: { data }, loading } = this.props;
    const { selectedRows} = this.state;

    const columns = [
      {
        title: '序号',
        dataIndex: 'Seq',
      },
      {
        title: '推送场景',
        dataIndex: 'Scenes',
      },
      {
        title: '消息标题',
        dataIndex: 'Title',
      },
      {
        title: '消息描述',
        dataIndex: 'Description',
      },
      {
        title: '消息链接',
        dataIndex: 'Url',
      },
      {
        title: '消息图片',
        dataIndex: 'PicUrl',
      },
      {
        title: '创建时间',
        dataIndex: 'CreateTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
        title: '操作',
        fixed: 'right',
        width: 160,
        render: (value,row) => (
          <Fragment>
            <a onClick={(e) => {
              e.preventDefault()
              this.setState({
                modalVisible: true,
                rowData: row
              })
            }} href="">编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteRow(row.Id)}>
              <a href="">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="消息列表" action={<Button onClick={this.showModal} type="primary" style={{ marginLeft: '30px' }}>新增</Button>}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              rowKey="Id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {
          this.getModal()
        }
      </PageHeaderLayout>
    );
  }
}
