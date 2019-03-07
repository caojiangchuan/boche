import React,{Component,Fragment} from 'react';
import './paid.css';
import {Link} from 'react-router-dom';
import url from 'url';
import moment from 'moment';
class Paid extends Component{
    constructor(props){
        super(props);
        this.state={
                immoney:200,
                imbh:'121789101201509235667375344',
                imkind:'泊车',
                imstate:'已完成',
                impayway:'微信支付',
                imcarnum:'沪A·2344B',
                imtime:'2018-09-15 15:26:35',
                imadd:'上海市闵行区浦江镇新骏环路188号',
                impart:'浦江城市生活广场',
                imbm:'闵行浦江002',
                bwbh:'MH_PJ_002_034',
                myOrderList:{}
        }
        document.title="订单详情";
    }
    componentDidMount () {
        const query = parseInt( url.parse(this.props.location.search, true).query.aid,10 );
        console.log( JSON.parse (sessionStorage.myOrderList)[query])
        this.setState({
            myOrderList:JSON.parse (sessionStorage.myOrderList)[query]
        })
    }
    goBack =() =>{
        // window.location='/wx/order';
        window.location.href ='/wx/order?allpaid';
    }

    render(){
        return(
            <Fragment>
              <div className="im-page">
                 <p className="im-money"><span className="im-money-left">订单金额：</span><span className="im-money-right"><span className="im-space">￥</span>{this.state.myOrderList.amount}</span></p>
                 <div className="im-con">
                  <p><span className="im-left">订单编号</span><span className="im-right">{this.state.myOrderList.orderNo}</span></p>
                     <p><span className="im-left">订单类型</span><span className="im-right">{this.state.myOrderList.type}</span></p>
                     <p><span className="im-left">订单状态</span><span className="im-right">{this.state.myOrderList.status}</span></p>
                     <p><span className="im-left">支付方式</span><span className="im-right">{this.state.myOrderList.payPlatform}</span></p>
                     <p><span className="im-left">车牌号码</span><span className="im-right">{this.state.myOrderList.carNo}</span></p>
                     <p><span className="im-left">泊车时间</span><span className="im-right">{moment(this.state.myOrderList.createdDate).format('YYYY-MM-DD HH:MM:ss')}</span></p>
                     <p><span className="im-left">泊车地点</span><span className="im-right">{this.state.myOrderList.addr}</span></p>
                     <p><span className="im-left">停车场</span><span className="im-right">{this.state.myOrderList.parkName}</span></p>
                     <p><span className="im-left">片区编码</span><span className="im-right">{this.state.myOrderList.parkArea}</span></p>
                     <p><span className="im-left">泊位编号</span><span className="im-right">{this.state.myOrderList.parkPosition}</span></p>
                 </div>

              </div>
                <div className="imback" onClick={this.goBack}>返回</div>
            </Fragment>
        )
    }

}
export  default Paid
