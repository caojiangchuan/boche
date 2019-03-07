import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import WechatTextForm from './WechatTextForm'
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Popconfirm,
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

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ wechatText, loading }) => ({
  wechatText,
  loading: loading.models.wechatText,
}))
@Form.create()
export default class TextMessageList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    modalTitle:'新增',
    rowData:{}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wechatText/fetch',
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
      type: 'wechatText/fetch',
      payload: params,
    });
  };

  handleSubmit = (formData) => {
    this.closeModal()
    const { dispatch } = this.props;
    var type = "wechatText/add";
    if(formData.Id){
      type = "wechatText/update"
    }
    dispatch({
      type: type,
      payload: formData,
      callback: () => {
        this.props.dispatch({
          type: 'wechatText/fetch',
          payload: {},
        });
      }
    });
  }

  deleteRow = (id) => {
    this.props.dispatch({
      type: 'wechatText/delete',
      payload: { id },
      callback: () => {
        this.props.dispatch({
          type: 'wechatText/fetch',
          payload: {},
        });
      }
    });
  }
  closeModal = () => {
    this.setState({
      modalVisible: false,
      rowData:{}
    })
  }
  showModal = () => {
    this.setState({
      modalVisible: true
    })
  }
  getModal = () =>{
    if(this.state.modalVisible){
      return (
        <Modal
          title="新增"
          visible={true}
          footer={null}
          onOk={this.closeModal}
          onCancel={this.closeModal}
        >
          <WechatTextForm data={this.state.rowData} close={this.closeModal} submit={this.handleSubmit} />
        </Modal>
      )
    }
  }
  render() {
    const { wechatText: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'Id',
      },
      {
        title: '推送场景',
        dataIndex: 'Scenes',
      },
      {
        title: '消息内容',
        dataIndex: 'Content',
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
                modalVisible:true,
                rowData:row
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
        {this.getModal()}
      </PageHeaderLayout>
    );
  }
}
