import React,{Component,Fragment} from 'react';
import '../unPaid/unPaid.css';
import {Link} from 'react-router-dom';
import Fetch from '../../fetch/fetch.js';
import  wx from 'weixin-js-sdk';
import Success from '../../register/success';
import moment from 'moment';
class UnPaidCarName extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:'loading',
            pamoney:'',
            pabh:'',
            pakind:'',
            pastate:'',
            pacarnum:'',
            patime:'',
            paaddr:'',
            papart:'',
            pabm:'',
            pabwbh:'',
            moreOrder:'pa-tip-hide',
            orderId:'',
            divsuccess:'none', //成功图层
            error:''
        }

        this.goPay=this.goPay.bind(this)
        document.title="订单详情";
    }
    componentDidMount(){

        const searchUrl =window.location.href;
        const searchData =searchUrl.split("?");        //截取 url中的“?”,获得“?”后面的参数
        const  searchText =decodeURI(searchData[1]);
        if(getUnPaidList) {
            var getUnPaidList=JSON.parse(sessionStorage.saveUnPaidList);
            this.setState({
                pamoney: getUnPaidList.amount,
                pacarnum: searchText,
                pastate: getUnPaidList.status,
                pakind: getUnPaidList.type,
                patime: moment(getUnPaidList.createdDate).format('YYYY-MM-DD HH:MM:ss'),
                paaddr: getUnPaidList.addr,
                papart: getUnPaidList.orderNo,
                pabh: getUnPaidList.parkNo,
                pabm: getUnPaidList.parkArea,
                pabwbh: getUnPaidList.parkPosition,
            })
        }else{
            this.setState({
                pacarnum: searchText,
            })
        }

        //查询最新一笔订单
        Fetch.post('/ch1/customer/myLastOrder',{
            carNo:  searchText
        }).then(json=>{
            if(json.code==="000000"){
                this.setState({
                    loading:'',
                    pamoney:json.list[0].amount,
                    pacarnum:searchText,
                    pastate: json.list[0].status,
                    pakind:json.list[0].type,
                    patime: moment(json.list[0].createdDate).format('YYYY-MM-DD HH:MM:ss'),
                    paaddr: json.list[0].addr,
                    papart: json.list[0].parkName,
                    pabh: json.list[0].orderNo,
                    pabm: json.list[0].parkArea,
                    pabwbh: json.list[0].parkPosition,
                    orderId:json.list[0].id,
                })
                console.log(this.state.orderId)

            }else {
                alert(json.message)
            }
            if(json.list.length>1){
                this.setState({
                    moreOrder: 'pa-tip pa-tip-show'
                })
            }

        }).catch(e=>{
            this.setState({
                loading: 'loading'
            })
            setInterval(
                () => this.tick(),
                10000
            );
        })
    }
    //定时器改变状态
    tick() {
        this.setState({
            loading: '',
            error: 'error'
        });
    }
    goPay(){
        const _this=this;
        Fetch.post('/ch1/pay/createOrder/'+this.state.orderId,{
            orderId:this.state.orderId
        }).then(json=>{
            if(json.code==="000000") {
                var wpparameters = json.data;

                wx.chooseWXPay({
                    appId: wpparameters.appId,
                    timestamp: wpparameters.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: wpparameters.nonceStr, // 支付签名随机串，不长于 32 位
                    package: wpparameters.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: wpparameters.paySign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        _this.setState({
                            divsuccess: 'block',
                        })
                    }
                });
            }
        }).catch(e=>{
            this.setState({
                loading: 'loading'
            })
            setInterval(
                () => this.tick(),
                10000
            );
        })
    }
    //定时器改变状态
    tick() {
        this.setState({
            loading: '',
            error: 'error'
        });
    }
    render(){
        return(
            <Fragment>

                <div className="pa-page">
                    <p className="pa-money"><span className="pa-money-left">订单金额：</span><span className="pa-money-right"><span className="pa-space">￥</span>{this.state.pamoney}</span></p>
                    <div className="pa-con">
                        <p><span className="pa-left">订单编号</span><span className="pa-right">{this.state.pabh}</span></p>
                        <p><span className="pa-left">订单类型</span><span className="pa-right">{this.state.pakind}</span></p>
                        <p><span className="pa-left">订单状态</span><span className="pa-right pa-state">{this.state.pastate}</span></p>
                        <p><span className="pa-left">车牌号码</span><span className="pa-right">{this.state.pacarnum}</span></p>
                        <p><span className="pa-left">泊车时间</span><span className="pa-right">{this.state.patime}</span></p>
                        <p><span className="pa-left">泊车地点</span><span className="pa-right">{this.state.paaddr}</span></p>
                        <p><span className="pa-left">停车场</span><span className="pa-right">{this.state.papart}</span></p>
                        <p><span className="pa-left">片区编码</span><span className="pa-right">{this.state.pabm}</span></p>
                        <p><span className="pa-left">泊位编号</span><span className="pa-right">{this.state.pabwbh}</span></p>
                    </div>

                </div>

                <div className="paback" onClick={this.goPay}>去支付</div>
                <p className={this.state.moreOrder}>温馨提示：该车辆还有其他<Link to={"/wx/order?"+"nopaid"}><span className="tip-impaid">未支付订单</span></Link>，请及时完成支付，以免对您的信用产生不良影响</p>
                <div className={this.state.loading}></div>
                <div className={this.state.error}></div>
                <div style={{display:this.state.divsuccess}}>
                    <Success success={'支付成功'} content={'订单'+this.state.pabh+'支付成功！'}/>
                </div>

            </Fragment>
        )
    }

}
export  default  UnPaidCarName
