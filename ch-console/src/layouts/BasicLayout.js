// import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
// import GlobalFooter from '../components/GlobalFooter';
import ContainerFooter from '../components/ContainerFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getAuthority } from '../utils/authority';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.png';
import TabController from '../components/Tabs/TabController';
import Common from '../common/Common';

const Utils = new Common();

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};

// getMenuData().forEach(getRedirect); 使用后台返回的菜单数据以前静态的数据不适用

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
  };
  getChildContext() {
    // const { location, routerData } = this.props;
    const { location, routerData, menuData } = this.props;
    return {
      location,
      // breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
      breadcrumbNameMap: getBreadcrumbNameMap(menuData, routerData),
    };
  }
  componentDidMount() {
    // debugger;
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'user/fetchCurrent',
      callback: response => {

        if (Utils.isNotNull(response)) {
          //
          this.props.dispatch(routerRedux.push('/home', 'replace'));
          // 天气查询
          this.props.dispatch({
            type: 'geographic/fetchWeather',
            payload: {
              city: '杭州',
            },
          });
        } else {
          this.props.dispatch(routerRedux.push('/user/login', 'replace'));
        }
      },
    });

    // this.props.dispatch({
    //   type: 'geographic/fetchWeather',
    // });
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '智慧泊车';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - 智慧泊车`;
    }
    return title;
  }
  getBaseRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };
  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };
  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  };
  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };
  // 天气查询
  handleWeatherSearch = city => {
    if (city) {
      this.props.dispatch({
        type: 'geographic/fetchWeather',
        payload: city,
      });
    }
  };
  render() {
    const {
      menuData,
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location,
      geographic: { weather },
    } = this.props;
    // debugger;

    const tasParams = {
      ...this.props.routerData[location.pathname],
      keys: location.pathname,
      location,
      dispatch: this.props.dispatch,
      match,
    };

    const bashRedirect = this.getBaseRedirect();

    menuData.forEach(getRedirect);

    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          // menuData={getMenuData()}
          menuData={menuData}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            {/*<Switch>*/}
              {/*{redirectData.map(item => (*/}
                {/*<Redirect key={item.from} exact from={item.from} to={item.to} />*/}
              {/*))}*/}
              {/*{getRoutes(match.path, routerData).map(item => (*/}
                {/*<Route*/}
                  {/*key={item.key}*/}
                  {/*path={item.path}*/}
                  {/*component={''}*/}
                  {/*exact={item.exact}*/}
                  {/*authority={item.authority}*/}
                  {/*redirectPath="/home"*/}
                {/*/>*/}
              {/*))}*/}
              {/*/!*<Route render={NotFound} />*!/*/}
            {/*</Switch>*/}
            <TabController {...tasParams} firstToHome={this.state.firstToHome}/>
            {/*<Redirect exact from="/" to={bashRedirect} />*/}

          </Content>
          <Footer style={{ padding: 0 }}>
            <ContainerFooter weather={weather} onHandleOk={this.handleWeatherSearch} />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global = {}, geographic, loading }) => ({
  currentUser: user.currentUser,
  menuData: user.menuData,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  geographic,
}))(BasicLayout);
