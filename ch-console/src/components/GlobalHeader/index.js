import React, { PureComponent  } from 'react';
import { Menu, Icon, Modal, Form, Button, Input, Tag, Dropdown, Avatar, Divider, Tooltip, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
const FormItem = Form.Item;

@connect(({ versionManage, user, loading }) => ({
  versionManage,
  user,
  loading: (loading.models.versionManage,loading.models.user),
}))
@Form.create()
export default class GlobalHeader extends PureComponent {
  state = {
    modalVisible: false,
    displayVersion: 'none',
    displayChangePassword: 'none',
    title:'',
  };

  componentDidMount() {

  };

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }


  getNoticeData() {
    const { notices } = this.props;
    if (notices == null || notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  /**
   * 对话框确认触发
   */
  okHandle = () => {
    const { dispatch } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'user/changePassword',
          payload: {
            forms: { ...values, pwd: values.newPassword, usedpwd: values.oldPassword},
          },
          callback: (response) => {
            if(!response.success) {
              message.error('密码修改失败');
            }
          },
        });
        this.handleModalVisible(false);
      }
    });
  };

  //取消
  cancelHandle = () => {
    const {form} = this.props;
    form.resetFields();
    this.handleModalVisible(false);
    this.setState({title:'', displayChangePassword:'none', displayVersion:'none'});

  }

  /**
   * 新增修改对话框显示隐藏
   * @param flag
   */
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  /**
   * 操作
   * @param key
   */
  handleMenuClick=(key)=>{
    if(key.key==='changePassword'){
      this.handleModalVisible(true);
      this.setState({title:'修改密码', displayChangePassword:'block', displayVersion:'none'});
    }else if(key.key==='about'){
      this.handleModalVisible(true);
      const { dispatch } = this.props;
      dispatch({
        type: 'versionManage/fetch',
        payload:{},
      });
      this.setState({title:'版本信息', displayChangePassword:'none', displayVersion:'block'});
    }else if (key.key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  };

  render() {
    const {
      // system: { systemVersion },
      versionManage: {versionData},
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
    } = this.props;
    if (currentUser == null) {
      // currentUser = {};
    }
    const { getFieldDecorator} = this.props.form;
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

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
        {/*<Menu.Item>*/}
        {/*<Icon type="user" />公告设置*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item>*/}
        {/*<Icon type="user" />系统设置*/}
        {/*</Menu.Item>*/}
        <Menu.Item key="changePassword">
          <Icon type="setting" />修改密码
        </Menu.Item>
        <Menu.Item key="about">
          <Icon type="question-circle-o" />关于
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (

      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        {/*菜单折叠*/}
        <Icon className={styles.trigger} type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle}/>

        <div className={styles.right}>
          {/*<Tooltip title="使用说明">*/}
            {/*<a*/}
              {/*target="_blank"*/}
              {/*href="http://pro.ant.design/docs/getting-started"*/}
              {/*rel="noopener noreferrer"*/}
              {/*className={styles.action}*/}
            {/*>*/}
              {/*<Icon type="question-circle-o" />*/}
            {/*</a>*/}
          {/*</Tooltip>*/}

          {(
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar className={styles.avatar} src={currentUser !== null ? currentUser.logo : ""} />
                <span className={styles.name}>{currentUser !== null ? currentUser.username: ""}</span>
              </span>
            </Dropdown>
          )}
        </div>
        <div>
          <Modal
            visible={this.state.modalVisible}
            title={this.state.title}
            footer={
              this.state.displayChangePassword==='block'?
                [
                  <Button key="back" onClick={this.cancelHandle}>取消</Button>,
                  <Button key="submit" type="primary" onClick={this.okHandle}>确定</Button>,
                ] : null}
            // cancelText="取消"
            // okText="确定"
            onCancel={this.cancelHandle}
            onOk={this.okHandle}
          >
            <Form style={{display:this.state.displayChangePassword}}>
              <FormItem label="原密码" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('oldPassword',{
                  rules: [{ required: true, message: '原密码不能为空' }],
                  initialValue: "",
                })(<Input type="password"/>)}
              </FormItem>
              <FormItem label="新密码" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('newPassword',{
                  rules: [{ required: true, message: '新密码不能为空' }],
                  initialValue:  ""
                })(<Input type="password"/>)}
              </FormItem>
              <FormItem label="确认密码" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('confirmPassword',{
                  rules: [{ required: true, message: '确认密码不能为空' },{
                    validator: this.validateToNextPassword,
                  }],
                  initialValue: ""
                })(<Input type="password"/>)}
              </FormItem>
            </Form>

            <Form style={{display:this.state.displayVersion}}>
              <FormItem label="当前版本" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('version',{
                  initialValue: versionData.data===undefined ? '' : versionData.data.version
                })(<Input readOnly/>)}
              </FormItem>
              <FormItem label="发布日期" {...formItemLayout} labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('pubdate',{
                  initialValue: versionData.data===undefined ? '' : versionData.data.realsedate
                })(<Input readOnly/>)}
              </FormItem>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
