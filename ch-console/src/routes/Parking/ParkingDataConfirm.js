import React, { PureComponent } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select, TreeSelect, Table, Modal, message, DatePicker, Tooltip  } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ParkingDataConfirm.less';
import { connect } from 'dva';
import Common from '../../common/Common';
const FormItem = Form.Item;
const Option = Select.Option;
const Utils = new Common();
const { RangePicker } = DatePicker;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_881793_7knt4y69gqq.js',
});

const UpdateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleUpdate,
    handleCancelModalVisible,
    selectedRows,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = fieldsValue;
      fieldsValue.id = selectedRows.id; // 添加key
      // 修改
      handleUpdate(params);
      form.resetFields();
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleCancelModalVisible();
  };

  return (
    <Modal
      title={`车牌号修正`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => cancelHandle()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车牌号">
        {form.getFieldDecorator('carno', {
          rules: [{ required: true, message: '请输车牌号' }],
          initialValue: Utils.isNotNull(selectedRows.carno) ? selectedRows.carno : '',
        })(<Input placeholder="请输车牌号" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="日期">
        <Input readOnly value={selectedRows.starttime} disabled />
      </FormItem>

    </Modal>
  );
});

@connect(({ parkingDataConfirm, loading }) => ({
  parkingDataConfirm,
  loading: loading.models.parkingDataConfirm,
}))
@Form.create()
export default class Operational extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    selectedRowIndex: '',
    formValues: {},
    parkData: {},
    videoShow: 'none',
    picShow: 'none',
    video: '',
    urlpicture: [],
    page:{
      start:1,
      limit:10,
    },
    totalCount: '',
    currentPage: 1,
  };

  componentDidMount() {
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'parkingDataConfirm/fetch',
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

    // 片区数据
    dispatch({
      type: 'parkingManage/fetch',
      payload: {page: {start: 1, limit: '',}},
      callback: (response) => {
        if (response.success && response.data.length > 0) {
          this.setState({
            parkData: response.data,
          });
        }
      }
    });
  };

  columns = [
    {
      title: '车牌号',
      dataIndex: 'carno',
    },
    {
      title: '泊入时间',
      dataIndex: 'starttime',
    },
    {
      title: '停车时长',
      // dataIndex: 'starttime',
      render: (item) => {
        const starttime = item.starttime;
        const endtime = item.endtime;
        return Utils.getTimeDiff(starttime, endtime);
      }
    },
    {
      title: '停车场',
      dataIndex: 'parkName',
    },
    {
      title: '片区编码',
      dataIndex: 'parkareaname',
    },
    {
      title: '泊位编码',
      dataIndex: 'parkpositionname',
    },
    {
      title: '是否确认',
      dataIndex: 'isconfirmed',
      width: 100,
      render: item => {
        if (Utils.isNotNull(item)) {
          if (item) {
            return <Tooltip placement="bottom" title="已确认"><div style={{textAlign: 'center'}}><IconFont type="icon-gou-right" /></div></Tooltip>
          } else {
            return <Tooltip placement="bottom" title="未确认"><div style={{textAlign: 'center'}}><IconFont type="icon-gou" /></div></Tooltip>
          }
        } else {
          // return <Tooltip placement="bottom" title="未确认"><div style={{textAlign: 'center'}}><IconFont type="icon-gou" /></div></Tooltip>
          return;
        }
      },
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      render: item => (
        <div>
          {/*<div className={styles.editButton}>*/}
            {/*<Tooltip placement="bottom" title="信息确认">*/}
              {/*<Icon type="check-circle" onClick={() => alert('确认成功')} />*/}
            {/*</Tooltip>*/}
          {/*</div>*/}
          <div className={styles.editButton}>
            <Tooltip placement="bottom" title="修正车牌号">
              <Icon type="edit" onClick={() => this.handleUpdateModalVisible(item)} />
            </Tooltip>
          </div>
          <div className={styles.editButton}>
            <Tooltip placement="bottom" title="资料">
              <Icon type="picture" onClick={() => this.playVideo(item)} />
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  /**
   * 搜索
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        page: {
          start: 1,
          limit: 10,
        },
      };

      dispatch({
        type: 'parkingDataConfirm/fetch',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });

      this.setState({
        formValues: {
          ...fieldsValue,
        },
        selectedRowIndex: '',
        selectedRows: {},
        currentPage: 1,
      });

      // form.resetFields();
    });
  };

  // 选中行
  selectRow = (record, index) => {
    this.setState({
      selectedRowIndex: index,
      selectedRows: record,
    });
  };

  // 设置选中行颜色
  setClassName = (record, index) => {
    const {selectedRowIndex} = this.state;
    return (index === selectedRowIndex ? `${styles.color}` : '')
  };

  /**
   * 双击事件
   */
  doubleClick = item => {
    this.handleUpdateModalVisible(item);
  };

  // 打开修改输入框
  handleUpdateModalVisible = (item) => {
    this.setState({
      modalVisible: true,
      selectedRows: item,
    });
  };

  // 修改操作
  handleUpdate = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'parkingDataConfirm/update',
      payload: params,
      callback: response => {
        if (response.success) {
          message.success('修改成功');
          this.getData();
        } else {
          message.error('修改失败');
        }
      }
    });

    this.setState({
      modalVisible: false,
    });
  };

  // 关闭输入框
  handleCancelModalVisible = () => {
    this.setState({
      modalVisible: false,
      // selectedRows: '',
    });
  };

  // 切换页码触发事件
  handleChange = (page) => {
    this.setState({
      // 清空选中项
      selectedRows: [],
      selectedRowIndex: '',
      videoShow: 'none',
      video: '',
      picShow: 'none',
      urlpicture: [],
      page: {
        start: page.current,
        limit: page.pageSize,
      },
      currentPage: page.current,
    }, () => {
      this.getData();
    });
  };

  // 播放视频
  playVideo = (item) =>{

    if (Utils.isNotNull(item.video)) {
      this.setState({
        videoShow: 'block',
        video: item.video,
      });
    } else {
      this.setState({
        videoShow: 'none',
        video: item.video,
      });
    }

    if (Utils.isNotNull(item.urlpicture)) {
      let urls = item.urlpicture.split(",");
      this.setState({
        picShow: 'block',
        urlpicture: urls,
      });
    } else {
      this.setState({
        picShow: 'none',
        urlpicture: [],
      });
    }

    if (!Utils.isNotNull(item.urlpicture) && !Utils.isNotNull(item.video)) {
      message.error("没有图像或视频资料");
    }

  };

  searchForm(data) {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row  gutter={{md: 24, lg: 32, xl: 48}}>
          <Col md={5} sm={7}>
            {/*<FormItem>{getFieldDecorator('parkareaid')(<Select placeholder="请选择片区编码"></Select>)}</FormItem>*/}
            <FormItem>{getFieldDecorator('parkareaid')(
              <TreeSelect
              // style={{ width: 160 }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              placeholder="请选片区编码"
              allowClear
              treeDefaultExpandAll
            >
              {Utils.loopParkArea(data)}
            </TreeSelect>)}</FormItem>
          </Col>
          <Col md={5} sm={7}>
            <FormItem>{getFieldDecorator('key')(<Input placeholder="泊位编码、姓名、车牌号" />)}</FormItem>
          </Col>
          <Col md={5} sm={7}>
            <FormItem>{getFieldDecorator('isconfirmed')(<Select placeholder="请选择状态" allowClear>
                  <Option value="0">未确认</Option>
                  <Option value="1">已确认</Option></Select>)}
            </FormItem>
          </Col>
          <Col md={5} sm={7}>
            <FormItem>{form.getFieldDecorator('dateList')(<RangePicker />)}</FormItem>
          </Col>
          <Col md={4} sm={4}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      parkingDataConfirm: { data },
      loading,
    } = this.props;
    const { modalVisible, selectedRows, currentPage } = this.state;

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: data.totalCount,
      current: currentPage,
      // pageSizeOptions: ['6', '12', '24'],
    };

    const parentMethods = {
      handleUpdate: this.handleUpdate,
      handleCancelModalVisible: this.handleCancelModalVisible,
      selectedRows: selectedRows,
    };

    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <div className={styles.container_left}>
            <div className={styles.tableListForm}>{this.searchForm(this.state.parkData)}</div>
            <div className={styles.buttonDiv}>
              <div className={styles.table}>
                <Table
                  loading={loading}
                  columns={this.columns}
                  dataSource={data.data}
                  bordered
                  pagination={pagination}
                  onChange={this.handleChange}
                  rowClassName={this.setClassName}
                  rowKey={record => record.id}
                  onRow={(record, index) => ({
                    onClick: () => this.selectRow(record, index),
                    onDoubleClick: () => {
                      this.doubleClick(record);
                    },
                  })}
                />
              </div>
              <div>
                <table className={styles.detailTable}>
                  <tbody>
                    <tr style={{height: '54px'}} key={1}>
                      <td width="20%">
                        <span>车牌号：</span>
                      </td>
                      <td width="30%">
                        <span>{Utils.isNotNull(selectedRows.carno) ? selectedRows.carno : '' }</span>
                      </td>
                      <td width="20%">
                        <span>用户姓名：</span>
                      </td>
                      <td width="30%">
                        <span>{Utils.isNotNull(selectedRows.carowner) ? selectedRows.carowner : '' }</span>
                      </td>
                    </tr>
                    <tr key={2}>
                      <td width="20%">
                        <span>日期：</span>
                      </td>
                      <td width="30%">
                        <span>{Utils.isNotNull(selectedRows.starttime) ? selectedRows.starttime : '' }</span>
                      </td>
                      <td width="20%">
                        <span>停车场：</span>
                      </td>
                      <td width="30%">
                        <span>{Utils.isNotNull(selectedRows.parkpositionname) ? selectedRows.parkpositionname : '' }</span>
                      </td>
                    </tr>
                    <tr key={3}>
                      <td width="20%">
                        <span>片区编码：</span>
                      </td>
                      <td width="30%">
                        <span>{Utils.isNotNull(selectedRows.parkareaname) ? selectedRows.parkareaname : '' }</span>
                      </td>
                      <td width="20%">
                        <span>泊位编码：</span>
                      </td>
                      <td width="30%">
                        <span>{Utils.isNotNull(selectedRows.parkpositionid) ? selectedRows.parkpositionid : '' }</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{marginTop: 74}}>
            <div className={styles.container_right} style={{display: this.state.videoShow}}>
              <div>
                <video width="100%" height="240" src={this.state.video} controls>
                  {/*<source src={this.state.video}  type="video/mp4" />*/}
                  您的浏览器不支持 HTML5 video 标签。
                </video>
              </div>

              {/*<div>*/}
              {/*<video width="100%" height="240" controls>*/}
              {/*<source src="http://www.runoob.com/try/demo_source/movie.ogg"  type="video/mp4" />*/}
              {/*您的浏览器不支持 HTML5 video 标签。*/}
              {/*</video>*/}
              {/*</div>*/}

            </div>

            <div className={styles.container_right_pic} style={{display: this.state.picShow}}>
              <div style={{display: Utils.isNotNull(this.state.urlpicture[0]) ? 'block' : 'none'}}>
                <img width="100%" height="240" src={Utils.isNotNull(this.state.urlpicture[0]) ? this.state.urlpicture[0] : ''} />
              </div>
              <div style={{display: Utils.isNotNull(this.state.urlpicture[1]) ? 'block' : 'none'}}>
                <img width="100%" height="240" src={Utils.isNotNull(this.state.urlpicture[1]) ? this.state.urlpicture[1] : ''} />
              </div>
            </div>
          </div>

        </div>
        <UpdateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
