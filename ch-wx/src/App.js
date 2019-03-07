import React, { Component } from 'react';
import { BrowserRouter as Router,Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import 'whatwg-fetch';
import Fetch from './fetch/fetch.js';
import  wx from 'weixin-js-sdk';
import appStyle from './App.css';


const MyLoadingComponent = ({ isLoading, error }) => {
    if (isLoading) {
        return <div className="loading"></div>//loading 请等待....
    }
    else if (error) {
        return <div className="loading"></div>//错误页面
    }
    else {
        return null;
    }
};

const About = Loadable({
    loader: ()=> import ('./about/about'),
    loading: MyLoadingComponent
});
const View = Loadable({
    loader: ()=> import ('./view/view'),
    loading: MyLoadingComponent
});
const Person = Loadable({
    loader: ()=> import ('./person/person'),
    loading: MyLoadingComponent
});
const carMenu = Loadable({
    loader: ()=> import ('./carmanage/carMenu/carMenu'),
    loading: MyLoadingComponent
});
const Writecar = Loadable({
    loader: ()=> import ('./carmanage/writeCar/writeCar'),
    loading: MyLoadingComponent
});
const Bindingcar = Loadable({
    loader: ()=> import ('./carmanage/bindingCar/bindingCar'),
    loading: MyLoadingComponent
});
const Order = Loadable({
    loader: ()=> import ('./order/order'),
    loading: MyLoadingComponent
});
const paid = Loadable({
    loader: ()=> import ('./order/paid/paid'),
    loading: MyLoadingComponent
});

const unPaid = Loadable({
    loader: ()=> import ('./order/unPaid/unPaid'),
    loading: MyLoadingComponent
});
const  Map= Loadable({
    loader: ()=> import ('./map/map'),
    loading: MyLoadingComponent
});
const selfHlep = Loadable({
    loader: ()=> import ('./selfHlep/selfHlep'),
    loading: MyLoadingComponent
});
const Register = Loadable({
    loader: ()=> import ('./register/register'),
    loading: MyLoadingComponent
});
const Permes = Loadable({
    loader:()=>import('./person/information'),
    loading: MyLoadingComponent
});
const Addsimple = Loadable({
    loader:()=>import('./carmanage/addCar/addCar'),
    loading: MyLoadingComponent
});
const Help = Loadable({
    loader:()=>import('./about/help'),
    loading: MyLoadingComponent
});
const Protocol = Loadable({
    loader:()=>import('./about/protocol'),
    loading: MyLoadingComponent
});
const Law = Loadable({
    loader:()=>import('./about/law'),
    loading: MyLoadingComponent
});
const UnPaidCarName = Loadable({
    loader:()=>import('./order/unPaidCarName/unPaidCarName'),
    loading: MyLoadingComponent
});
const NoPaidCar = Loadable({
    loader:()=>import('./selfHlep/noPaidCar'),
    loading: MyLoadingComponent
});
const ChangeNum = Loadable({
    loader:()=>import('./person/changeNum'),
    loading: MyLoadingComponent
});



const routes = [

    { path: '/wx', component: Register, exact: true },    //注册登录
    { path: '/wx/about', component: About },                   //关于我们
    { path: '/wx/person', component: Person },                 //个人中心
    { path: '/wx/view', component: View },                         //意见反馈
    { path: '/wx/carMenu', component: carMenu },                //车辆管理列表
    { path: '/wx/writecar', component: Writecar },  //车辆信息
    { path: '/wx/bindingcar', component: Bindingcar },    //车辆信息
    { path: '/wx/order', component: Order },                      //订单管理
    { path: '/wx/paid', component: paid },                 //订单详情
    { path: '/wx/orderDetail', component: unPaid },                   //订单详情
    { path: '/wx/map', component: Map },                       //附近停车位
    { path: '/wx/self', component: selfHlep },                    //自助结费
    { path: '/wx/permes', component: Permes },               //个人中心
    { path:'/wx/addsim',component:Addsimple},               //新增车辆
    { path:'/wx/help',component:Help},                        //使用帮助
    { path:'/wx/protocol',component:Protocol},                //用户协议
    { path:'/wx/law',component:Law},                          //相关法律
    { path:'/wx/unPaidCarName',component:UnPaidCarName},                          //自主结费跳转付费页面
    { path:'/wx/noPaidCar',component:NoPaidCar},             //自主结费页面无车辆
    { path:'/wx/changeNum',component:ChangeNum},             //更改手机号页面

]



class App extends Component {

    componentWillMount() {
        document.body.style.margin = "0px";
        // 这是防止页面被拖拽
        document.body.addEventListener('touchmove', (ev) => {
            ev.preventDefault();
        });

        let data={
            url:window.location.href,
        }

        let _default_url ='http://cbre.4ait.com/zhaoshang/';
        let _default_img ='http://cbre.4ait.com/zhaoshang/images/share.jpg';
        let _default_title ='招商主城';
        let _default_desc='选品质，就选招商主城！';

        Fetch.post('/ch1/wx/portal/getJssdk',data
        ).then(json =>{
            if(json.code==='000000'){
                console.log(json.data.jsapiTicket)
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: json.data.appId, // 必填，公众号的唯一标识
                    timestamp:json.data.timestamp , // 必填，生成签名的时间戳
                    nonceStr: json.data.nonceStr, // 必填，生成签名的随机串
                    signature: json.data.signature,// 必填，签名，见附录1
                    jsApiList: [  'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'translateVoice',
                        'startRecord',
                        'stopRecord',
                        'onRecordEnd',
                        'playVoice',
                        'pauseVoice',
                        'stopVoice',
                        'uploadVoice',
                        'downloadVoice',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'scanQRCode',
                        'chooseWXPay',
                        'openProductSpecificView',
                        'addCard',
                        'chooseCard',
                        'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }

        }).catch(e=>{

            console.info(e);
        })

        wx.ready(function(){

            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

            //分享到朋友圈
            wx.onMenuShareTimeline({
                title: _default_desc, // 分享标题
                link: _default_url, // 分享链接
                imgUrl: _default_img, // 分享图标
                success: function () {

                },
                cancel: function () {

                }
            });
            //分享到朋友
            wx.onMenuShareAppMessage({
                title:  _default_title, // 分享标题
                desc: _default_desc, // 分享描述
                link:_default_url, // 分享链接
                imgUrl: _default_img, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {

                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }

            });
            //qq
            wx.onMenuShareQQ({
                title: _default_title, // 分享标题
                desc: _default_desc, // 分享描述
                link:_default_url, // 分享链接
                imgUrl: _default_img, // 分享图标
                success: function () {

                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            //weibo
            wx.onMenuShareWeibo({
                title: _default_title, // 分享标题
                desc: _default_desc, // 分享描述
                link: _default_url, // 分享链接
                imgUrl: _default_img, // 分享图标
                success: function () {

                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });


        });


    }
    componentDidMount(){
        window.alert = function(name){
            var iframe = document.createElement("IFRAME");
            iframe.style.display="none";
            iframe.setAttribute("src", 'data:text/plain,');
            document.documentElement.appendChild(iframe);
            window.frames[0].window.alert(name);
            iframe.parentNode.removeChild(iframe);
        }


    }
    render() {
        return (
            <Router >
                <div>
                    {
                        routes.map(route => (
                            <Route key={route.path} path={route.path} component={route.component}  exact={route.exact} />
                        ))
                    }
                </div>

            </Router>
        );
    }

}
export default App;

// <Route  path="/about" component={About} onEnter={this.setTitle('关于我们')} />
// <Route  path="/imgUpload" component={ImgUpload}  onEnter={this.setTitle('图片上传组件')}/>
//     <Route  path="/view" component={View} onEnter={this.setTitle('意见反馈')} />
//     <Route  path="/person" component={Person} onEnter={this.setTitle('个人中心')} />
// <Route  path="/carmanager/addcar" component={Addcar}  onEnter={this.setTitle('添加车辆')}/>
// <Route  path="/carMenu" component={Addcar}  onEnter={this.setTitle('添加车辆')}/>
// <Route  path="/carmanager/writecar" component={Writecar}  onEnter={this.setTitle('车辆信息')}/>
// <Route  path="/carmanager/bindingcar" component={Bindingcar}  onEnter={this.setTitle('车辆信息')}/>
// <Route  path="/order" component={Order}  onEnter={this.setTitle('订单管理')}/>
// <Route  path="/impaid" component={Impaid}  onEnter={this.setTitle('订单详情')}/>
// <Route  path="/paied" component={Paied}  onEnter={this.setTitle('订单详情')}/>
// <Route  path="/map" component={Map2}  onEnter={this.setTitle('附近停车位')}/>
// <Route path="/self" component={Self}/>

