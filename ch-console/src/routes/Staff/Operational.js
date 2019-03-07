import React, {PureComponent} from 'react';
import {Button, Col, Form, Icon, Input, Row, Select, Table, Modal, message, Upload, Tooltip} from 'antd';
import {Map, Marker} from 'rc-bmap';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Operational.less';
import {connect} from 'dva';
import Common from '../../common/Common';
import {sexStatus, dutyStatus, employeeType, enableStatus, assetStatus} from '../../common/Enum'
import {Tree, TreeSelect} from "antd/lib/index";

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const Utils = new Common();

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleUpdate,
    handleCancelModalVisible,
    formType,
    selectedRows,

    fileList,
    previewVisible,
    previewImage,
    handleImageCancel,
    handleImagePreview,
    handleImageChange,
    handleOnRemove,
    parkList,
    deptList
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (formType === 'add') {
        fieldsValue.logo = previewImage;
        handleAdd(fieldsValue,form);
      } else if (formType === 'update') {
        const params = fieldsValue;
        fieldsValue.id = selectedRows.id; // 添加key
        fieldsValue.logo = previewImage;
        // 修改
        handleUpdate(params,form);
      }
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleCancelModalVisible();
  };

  const handleCancel = () => {
    handleImageCancel();
  };

  const handlePreview = (file) => {
    handleImagePreview(file);
  };

  const handleChange = (item) => {
    handleImageChange(item);
  };

  const uploadButton = (
    <div>
      <Icon type="plus"/>
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  // 手机号校验
  const checkMobile = (rule, value, callback) => {

    if (!value) {
      callback();
    } else if (!(/^1\d{10}$/.test(value))){
      callback("电话号码有误，请重填");
    } else {
      callback();
    }
  };

  const formItemLayout = {labelCol: {span: 9}, wrapperCol: {span: 15}};
  return (
    <Modal
      title={`${formType === 'add' ? '新增运营人员信息' : '修改运营人员信息'}`}
      width={900}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => cancelHandle()}
    >
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="姓名">
            {form.getFieldDecorator('name', {
              rules: [{required: true, message: '请输入姓名'},{max: 10, message: '长度不能超过10个字符'}],
              initialValue: Utils.isNotNull(selectedRows.name) ? selectedRows.name : '',
            })(<Input/>)}
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem {...formItemLayout} label="性别">
            {form.getFieldDecorator('sex', {
              rules: [{required: true, message: '请选择性别'}],
              initialValue: Utils.isNotNull(selectedRows.sex) ? `${selectedRows.sex}` : '',
            })(<Select style={{width: 221}}>{Utils.dropDownOption(sexStatus, 'value', 'name')}</Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="身份证号">
            {form.getFieldDecorator('idcard', {
              rules: [{ required: true, message: '请输入身份证号' }],
              initialValue: Utils.isNotNull(selectedRows.idcard) ? `${selectedRows.idcard}` : '',
            })(<Input/>)}
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem {...formItemLayout} label="昵称">
            {form.getFieldDecorator('nickname', {
              rules: [{required: true, message: '请输入昵称'}],
              initialValue: Utils.isNotNull(selectedRows.nickname) ? `${selectedRows.nickname}` : '',
            })(<Input/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="职务">{form.getFieldDecorator('title', {
            rules: [{
              required: true,
              message: '请输入职务'
            }], initialValue: Utils.isNotNull(selectedRows.title) ? selectedRows.title : '',
          })(<Input/>)}</FormItem>
        </Col>
        <Col span={10}>
          <FormItem {...formItemLayout} label="在职状态">{form.getFieldDecorator('dutystatus', {
            rules: [{required: true, message: '请选择在职状态'}],
            initialValue: Utils.isNotNull(selectedRows.dutystatus) ? `${selectedRows.dutystatus}` : '',
          })(<Select style={{width: 221}}>{Utils.dropDownOption(dutyStatus, 'value', 'name')}</Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row>

        <Col span={10}>
          <FormItem {...formItemLayout} label="电话">
            {form.getFieldDecorator('tel', {
              rules: [
                {required: true, pattern: new RegExp(/^[0-9]\d*$/, "g"), message: '电话号码不能为空'},
                { validator: checkMobile }
              ],
              getValueFromEvent: (event) => {
                return event.target.value.replace(/\D/g,'')
              },
              initialValue: Utils.isNotNull(selectedRows.tel) ? selectedRows.tel : '',
            })(<Input/>)}
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem {...formItemLayout} label="联系地址">{form.getFieldDecorator('address', {
            rules: [{required: true, message: '请输入联系地址'}],
            initialValue: Utils.isNotNull(selectedRows.address) ? selectedRows.address : '',
          })(<Input/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="运营类型">{form.getFieldDecorator('type', {
            rules: [{required: true, message: '请选择运营类型'}],
            initialValue: Utils.isNotNull(selectedRows.type) ? `${selectedRows.type}` : '',
          })(<Select style={{width: 221}}>{Utils.dropDownOption(employeeType, 'value', 'name')}</Select>)}
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem {...formItemLayout} label="停车场">{form.getFieldDecorator('parkid', {
            rules: [{required: true, message: '请选择停车场'}],
            initialValue: Utils.isNotNull(selectedRows.parkid) ? `${selectedRows.parkid}` : '',
          })(<Select style={{width: 221}}>{Utils.dropDownOption(parkList, 'id', 'name')}</Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <FormItem {...formItemLayout} label="部门">
            {form.getFieldDecorator('deptid', {
              rules: [{ required: true, message: '请选择部门' }],
              initialValue: Utils.isNotNull(selectedRows.deptid) ? `${selectedRows.deptid}` : '',
            })(
              <TreeSelect
                style={{ width: 221 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择部门"
                allowClear
                treeDefaultExpandAll
              >
                {Utils.loopDept(deptList)}
              </TreeSelect>
            )}
          </FormItem>
        </Col>

        <Col span={10}>
          <FormItem {...formItemLayout} label="头像">
            <Upload
              action="/file/v1/tmp/upload/"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              onRemove={handleOnRemove}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
              <img alt={fileList.title} style={{width: '100%'}} src={previewImage}/>
            </Modal>
          </FormItem>
        </Col>

      </Row>
    </Modal>
  );
});

// 地图坐标---上海
const markerPoint = {
  lng: 121.48,
  lat: 31.22,
};

@connect(({operational,parkingManage,deptManage, loading}) => ({
  operational,parkingManage,deptManage,
  loading:(loading.models.parkingManage,loading.models.deptManage,loading.models.operational)
}))
@Form.create()
export default class Operational extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    page: {
      start: 1,
      limit: 10,
    },
    totalCount: '',
    currentPage: 1,

    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: '',
      name: '',
      status: '',
      url: '',
    }],
    parkList: [],//停车场列表
    deptList: [],//部门列表
  };

  componentDidMount() {
    this.getParkAndDeptList();
    this.getData();
  }

  //加载数据
  getData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'operational/fetch',
      payload: {
        page: this.state.page,
        ...this.state.formValues,
      },
      callback: response => {
        if (!response.success) {
          message.error('数据加载失败');
        }
      }
    });
  }

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '头像',
      dataIndex: 'logo',
      render: record => (
        <div style={{textAlign: 'center', height: 40}}>
          <div style={{display: Utils.isNotNull(record) ? 'block' : 'none'}}>
            <img src={record} style={{width: '36px', height: '36px', borderRadius: '40%'}}/>
          </div>

        </div>

      ),
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '身份证号',
      dataIndex: 'idcard',
    },
    {
      title: '联系地址',
      dataIndex: 'address',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '职务',
      dataIndex: 'title',
    },
    {
      title:'停车场',
      dataIndex:'parkName',
      // render:(text,index)=>{
      //   return Utils.getStatusName(text,this.state.parkList)
      // }
    },
    {
      title: '在职状态',
      dataIndex: 'dutystatus',
      render: (text, index) => {
        return Utils.getStatusName(text, dutyStatus)
      }
    },
    {
      title: '电话',
      dataIndex: 'tel',
    },
    {
      title: '运营类型',
      dataIndex: 'type',
      render: (text, index) => {
        return Utils.getStatusName(text, employeeType)
      }
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: item => (
        <div>
          <div className={styles.editButton}>
            <Tooltip placement="bottom" title="点击修改">
              <Icon type="edit" onClick={() => this.handleUpdateModalVisible(item)}/>
            </Tooltip>
          </div>
          <div className={styles.editButton}>
            <Tooltip placement="bottom" title="点击删除">
              <Icon type="delete" onClick={() => this.deleteConfirm(item)}/>
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

    const {dispatch, form} = this.props;

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
        type: 'operational/fetch',
        payload: values,
        callback: response => {
          if (!response.success) {
            message.error('数据查询失败');
          }
        }
      });

      this.setState({
        formValues: {
          ...fieldsValue
        },
        currentPage: 1,
      });
    });
  };

  // 打开新增信息输入框
  handleAddModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      selectedRows: '',
      fileList: [],
      formType: 'add',
    },()=>{
      this.getParkAndDeptList();
    });
  };

  //获取停车场和部门列表
  getParkAndDeptList = ()=>{
    const{dispatch} = this.props;
    dispatch({
      type:'parkingManage/getParkList',
      callback:(response)=>{
        if(response.success){
          this.setState({
            parkList:response.data
          })
        }else{
          message.error('获取停车场失败')
        }
      }
    })
    //获取部门列表
    dispatch({
      type:'deptManage/fetch',
      payload:{},
      callback:(response)=>{
        if(response.success){
          this.setState({
            deptList:response.data
          })
        }else{
          message.error('获取部门列表失败')
        }
      }
    })
}

  // 添加信息
  handleAdd = (params,form) => {
    const {dispatch} = this.props;
    this.setState({
      modalVisible: false,
    });
    dispatch({
      type: 'operational/add',
      payload: params,
      callback: response => {
        if (response.success) {
          message.success('添加成功');
          this.setState({
            page: {
              start: 1,
              limit: 10,
            },
            currentPage: 1,
            formValues: {},
          }, () => {
            this.getData();
          });
        } else {
          message.error('添加失败');
        }
      }
    });
    form.resetFields();
  };

  /**
   * 双击事件
   */
  doubleClick = item => {
    this.handleUpdateModalVisible(item);
  };

  // 打开修改输入框
  handleUpdateModalVisible = (item) => {
    let fileList = [];
    if (Utils.isNotNull(item.logo)) {
      fileList.push({
        uid: '1',
        name: item.name,
        status: 'done',
        url: item.logo,
      });
    }
    this.setState({
      modalVisible: true,
      selectedRows: item,
      formType: 'update',
      previewImage: item.logo,
      fileList: fileList,
    },()=>{
      this.getParkAndDeptList();
    });
  };

  // 修改操作
  handleUpdate = (params,form) => {
    const {dispatch} = this.props;
      this.setState({
        modalVisible: false,
      });
    dispatch({
      type: 'operational/update',
      payload: params,
      callback: response => {
        if (response.success) {
          message.success('修改成功');
          this.setState({
            page: {
              start: this.state.currentPage,
              limit: 10,
            },
            formValues: {},
          }, () => {
            this.getData();
          });
        } else {
          message.error('修改失败');
        }
      }
    });
    form.resetFields();
  };

  // 删除框
  deleteConfirm = currentItem => {
    Modal.confirm({
      title: '删除任务',
      content: '确定删除该记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleRemove(currentItem.id),
    });
  };

  // 删除
  handleRemove = key => {
    const {dispatch} = this.props;
    dispatch({
      type: 'operational/remove',
      payload: key,
      callback: response => {
        if (response.success) {
          message.success('删除成功');
          this.setState({
            page: {
              start: 1,
              limit: 10,
            },
            currentPage: 1,
            formValues: {},
          }, () => {
            this.getData();
          });
        } else {
          message.error('删除失败');
        }
      }
    });
    this.setState({
      selectedRows: [],
    });
  };

  // 关闭输入框
  handleCancelModalVisible = () => {
    this.setState({
      modalVisible: false,
      selectedRows: '',
      previewImage: '',
    });
  };

  // 头像操作
  handleCancel = () => this.setState({previewVisible: false});

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleImageChange = (item) => {


    // 把fileList拿出来
    let {fileList} = item;

    const status = item.file.status;
    if (status !== 'uploading') {
      this.setState({
        fileList: item.fileList,
      });
    }
    if (status === 'done') {
      // 响应结果
      const response = item.file.response;
      this.setState({
        fileList: item.fileList,
        previewImage: response.data, //设置返回路径
      });
      message.success(`${item.file.name} 文件上传成功`);
    } else if (status === 'error') {
      message.error(`${item.file.name} 文件上传失败`);
    }

    // 重新设置state
    this.setState({fileList});
  };

  handleOnRemove = () => {
    this.setState({
      previewImage: '',
      fileList: [],
    });
  };

  // 切换页码触发事件
  handleChange = (page) => {
    this.setState({
      page: {
        start: page.current,
        limit: page.pageSize,
      },
      currentPage: page.current,
    }, () => {
      this.getData();
    });
  };


  searchForm() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6}>
            <FormItem label="关键字">
              {getFieldDecorator('name')(<Input placeholder="姓名"/>)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="关键字">
              {getFieldDecorator('tel')(<Input placeholder="手机号"/>)}
            </FormItem>
          </Col>
          <Col md={6}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
              查询
              </Button>
            </span>
            <Button style={{marginLeft: 10}} type="primary" onClick={() => this.handleAddModalVisible(true)}>
              新增
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      operational: {data},
      loading,
    } = this.props;
    const {modalVisible,parkList,deptList, currentPage} = this.state;

    const pagination = {
      showQuickJumper: true,
      // showSizeChanger: true,
      defaultPageSize: 10,
      total: data.totalCount,
      current: currentPage,
      // pageSizeOptions: ['10', '15', '20'],
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleAddModalVisible,
      handleCancelModalVisible: this.handleCancelModalVisible,
      formType: this.state.formType,
      selectedRows: this.state.selectedRows,
      parkList: this.state.parkList,
      deptList: this.state.deptList,
    };

    const imageMethods = {
      fileList: this.state.fileList,
      previewVisible: this.state.previewVisible,
      previewImage: this.state.previewImage,
      handleImageCancel: this.handleCancel,
      handleImagePreview: this.handlePreview,
      handleImageChange: this.handleImageChange,
      handleOnRemove: this.handleOnRemove,
    }

    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <div className={styles.tableListForm}>{this.searchForm()}</div>
          <div className={styles.buttonDiv}>
            {/*<div className={styles.buttonFrom}>*/}
              {/*<Button icon="plus" type="primary" onClick={() => this.handleAddModalVisible(true)}>*/}
                {/*新建*/}
              {/*</Button>*/}
              {/*<Button*/}
                {/*type="primary"*/}
                {/*style={{marginLeft: 10}}*/}
                {/*onClick={() => alert('显示巡检员轨迹')}*/}
              {/*>*/}
                {/*显示轨迹*/}
              {/*</Button>*/}
            {/*</div>*/}
            <div className={styles.table}>
              <Table
                loading={loading}
                columns={this.columns}
                dataSource={data.data}
                bordered
                pagination={pagination}
                rowKey={record => record.id}
                scroll={{ x: 1600 }}
                onChange={this.handleChange}
                onRow={text => ({
                  onDoubleClick: () => {
                    this.doubleClick(text);
                  },
                })}
              />
            </div>
          </div>
          <div className={styles.map} style={{display: 'none'}}>
            <Map ak="WAeVpuoSBH4NswS30GNbCRrlsmdGB5Gv" center={markerPoint} zoom={18}>
              <Marker point={markerPoint}/>
            </Map>
          </div>
        </div>
        <CreateForm {...parentMethods} {...imageMethods} deptList={deptList} parkList={parkList} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
