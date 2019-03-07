import React,{Component,Fragment} from 'react';
import './unPaid.css';

import url from 'url';
import Fetch from '../../fetch/fetch.js';
import  wx from 'weixin-js-sdk';
import Success from '../../register/success';
import moment from 'moment';
class UnPaid extends Component{
    constructor(props){
        super(props);
        this.state={
            pamoney:200,
            pabh:'121789101201509235667375344',
            pakind:'泊车',
            pastate:'未完成',
            pacarnum:'沪A·2344B',
            patime:'2018-09-15 15:26:35',
            paadd:'上海市闵行区浦江镇新骏环路188号',
            papart:'浦江城市生活广场',
            pabm:'闵行浦江002',
            pabwbh:'MpaH_PJ_002_034',
            myOrderList:{},
            orderId:0,
            divsuccess:'none', //成功图层
            loading:'',
            error: '',
        }
        document.title="订单详情";
        this.goPay = this.goPay.bind(this);
    }
    componentDidMount () {
        const query = parseInt( url.parse(this.props.location.search, true).query.aid,10 );
        console.log( JSON.parse (sessionStorage.myOrderList)[query])
        this.setState({
            myOrderList:JSON.parse (sessionStorage.myOrderList)[query],
            orderId:JSON.parse (sessionStorage.myOrderList)[query].id
        })
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
                        // alert('支付成功')
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
                <div className={this.state.loading}></div>
                <div className={this.state.error}></div>
                <div className="pa-page">
                    <p className="pa-money"><span className="pa-money-left">订单金额：</span><span className="pa-money-right"><span className="pa-space">￥</span>{this.state.myOrderList.amount}</span></p>
                    <div className="pa-con">
                        <p><span className="pa-left">订单编号</span><span className="pa-right">{this.state.myOrderList.orderNo}</span></p>
                        <p><span className="pa-left">订单类型</span><span className="pa-right">{this.state.myOrderList.type}</span></p>
                        <p><span className="pa-left">订单状态</span><span className="pa-right pa-state">{this.state.myOrderList.status}</span></p>
                        <p><span className="pa-left">车牌号码</span><span className="pa-right">{this.state.myOrderList.carNo}</span></p>
                        <p><span className="pa-left">泊车时间</span><span className="pa-right">{moment(this.state.myOrderList.createdDate).format('YYYY-MM-DD HH:MM:ss')}</span></p>
                        <p><span className="pa-left">泊车地点</span><span className="pa-right">{this.state.myOrderList.addr}</span></p>
                        <p><span className="pa-left">停车场</span><span className="pa-right">{this.state.myOrderList.parkName}</span></p>
                        <p><span className="pa-left">片区编码</span><span className="pa-right">{this.state.myOrderList.parkArea}</span></p>
                        <p><span className="pa-left">泊位编号</span><span className="pa-right">{this.state.myOrderList.parkPosition}</span></p>
                    </div>

                </div>

                <div className="paback" onClick={this.goPay}>去支付</div>

                <div style={{display:this.state.divsuccess}}>
                    <Success success={'支付成功'} content={'订单'+this.state.myOrderList.orderNo+'支付成功！'}/>
                </div>

            </Fragment>
        )
    }

}
export  default  UnPaid
