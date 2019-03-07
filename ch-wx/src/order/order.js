import React,{Component,Fragment} from 'react';
import './order.css';
import { Link } from 'react-router-dom';
import Fetch from '../fetch/fetch.js';
import Tloader from 'react-touch-loader';
import moment from 'moment';

class Order extends Component {
    constructor() {
        super();
        this.state = {
            loading: '',
            url:'impaid',
            myOrderList:[],
            tabNum:'blcok',
            tabNum2:'blcok',
            aid:0,
            loadMoreLimitNum:0,
            pageStatus:'',
            pageNum:10,
            canRefreshResolve: 1,
            listLen: 0,
            hasMore: 1,
            initializing:0,
            refreshedAt: Date.now(),
            isautoLoadMore:false,
            noMore_id:false,        //显示是否有更多
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
        this.handleClick3 = this.handleClick3.bind(this);
        document.title="订单管理";
    }
    componentWillMount(){
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.setState({
    //             listLen: 9,
    //             hasMore: 1,
    //             initializing: 2, // initialized
    //         });
    //     }, 2e3);
    // }

    refresh = (resolve, reject) => {

        this.setState({
            loadMoreLimitNum:0
        },()=>{
            this.myOrder(2,resolve)
        });
    }

    loadMore = (resolve) => {
        this.myOrder(1,resolve)
    }


    toggleCanRefresh = () => {
        const { canRefreshResolve } = this.state;

        this.setState({ canRefreshResolve: !canRefreshResolve });
    }
    myOrderList(){
        return (
            //遍历添加车辆li
            this.state.myOrderList.map((item, index) => {

                if(item) {
                    return (
                        <li key={index} className= {  (item.status==='待支付' ? 'or-wait' : 'or-finish' )+' '+( item.status==='待支付' ? this.state.tabNum :
this.state.tabNum2) } >
                            <Link to={ item.status==='待支付' ? "/wx/orderDetail?aid="+index : "/wx/paid?aid="+index } >
                                <p>
                                    {index}
                                    <span className="or-car-left">{item.type}</span>

                                <span className= {item.status==='待支付' ? 'or-car-right' : 'or-car-right2'}>
                                    <img src={item.status==='待支付' ?  require('../img/or-dzf.png') :require('../img/right.jpg') }   alt='泊车'/>
                                </span>

                                    <span className={item.status==='待支付' ? 'or-car-right' : 'or-car-right2'} >{item.status}</span>
                                </p>
                                <p className="or-car-mes or-car-mes2 "><span className="or-left">车牌号码：</span><span className="or-right">{item.carNo}</span></p>
                                <p className="or-car-mes"><span className="or-left">订单金额：</span><span className="or-right"><span className="or-money">￥</span>
                                    {item.amount}</span></p>
                                <p className="or-car-mes"><span className="or-left">泊车时间：</span><span className="or-right">{moment(item.createdDate).format('YYYY-MM-DD HH:MM:ss')}</span></p>
                                <p className="or-car-mes"><span className="or-left">泊车地点：</span><span className="or-right">{item.parkPosition}</span></p></Link>
                        </li>
                    )
                }
            })
        )
    }
    myOrder(more,resolve){
        if( !this.state.hasMore && more===1)   return false;
        const myOrderList=this.state.myOrderList;
        Fetch.post('/ch1/customer/myOrder',{
            pageSize:this.state.pageNum,
            pageNum:this.state.loadMoreLimitNum++,
            status:this.state.pageStatus
        }).then(json=>{
            //如果返回数量小于this.state.pageNum  则判断为最后一页
            if(json.code==="000000") {
                if (json.list.length < this.state.pageNum) {
                    this.setState({
                        hasMore: false,
                        noMore_id: true,
                        loading: ''
                    });
                }
                this.setState({
                    loading: ''
                });
                sessionStorage.myOrderList = JSON.stringify(json.list);
                if (more === 1) {
                    this.setState({
                        myOrderList: [...myOrderList, ...json.list],
                    })
                } else {
                    this.setState({
                        myOrderList: json.list
                    })

                }
                resolve();
            }
        }).catch(e=>{

        })
    }
    nomyOrder(more,resolve){
        if( !this.state.hasMore && more===1)   return false;
        const myOrderList=this.state.myOrderList;
        Fetch.post('/ch1/customer/myOrder',{
            pageSize:this.state.pageNum,
            pageNum:this.state.loadMoreLimitNum++,
            status:"待支付"
        }).then(json=>{
            //如果返回数量小于this.state.pageNum  则判断为最后一页
            if(json.code==="000000") {
                if (json.list.length < this.state.pageNum) {
                    this.setState({
                        hasMore: false,
                        noMore_id: true,
                        loading: ''
                    });
                }

                sessionStorage.myOrderList = JSON.stringify(json.list);
                if (more === 1) {
                    this.setState({
                        myOrderList: [...myOrderList, ...json.list],
                    })
                } else {
                    this.setState({
                        myOrderList: json.list
                    })

                }
                resolve();
            }
        }).catch(e=>{

        })
    }
    //点击全部显示全部订单
    handleClick(){
        const curul = document.getElementById('or-li');
        const curul2 = document.getElementById('or-li2');
        const curul3 = document.getElementById('or-li3');
        curul.style.borderBottom="#1890FF solid 6px"
        curul2.style.borderBottom="none"
        curul3.style.borderBottom="none"
        this.setState({
            pageStatus:"",
            noMore_id:true,
            loading:'loading'
        },()=>{
            this.refresh(2)
        });
    }
    //未完成
    handleClick2(){
        const curul = document.getElementById('or-li');
        const curul2 = document.getElementById('or-li2');
        const curul3 = document.getElementById('or-li3');
        curul2.style.borderBottom="#1890FF solid 6px"
        curul.style.borderBottom="none"
        curul3.style.borderBottom="none"
        this.setState({
            pageStatus:"待支付",
            noMore_id:true,
            loading:'loading'
        },()=>{
            this.refresh(2)
        });
    }
    handleClick3(){
        const curul = document.getElementById('or-li');
        const curul2 = document.getElementById('or-li2');
        const curul3 = document.getElementById('or-li3');
        curul3.style.borderBottom="#1890FF solid 6px"
        curul2.style.borderBottom="none"
        curul.style.borderBottom="none"
        this.setState({
            pageStatus:"已支付",
            noMore_id:true,
            loading:'loading'
        },()=>{
            this.refresh(2)
        });
    }

    componentDidMount(){
        const curul = document.getElementById('or-li');
        const curul2 = document.getElementById('or-li2');
        const curul3 = document.getElementById('or-li3');

        const searchUrl = window.location.href;
        const searchData = searchUrl.split("?");        //截取 url中的“?”,获得“?”后面的参数
        const  searchText = decodeURI(searchData[1]);
       if(searchText === "nopaid"){
           curul2.style.borderBottom="#1890FF solid 6px"
           curul.style.borderBottom="none"
           curul3.style.borderBottom="none"
           this.nomyOrder(1);
       }
       if(searchText === "allpaid"){
           curul2.style.borderBottom="none"
           curul.style.borderBottom="#1890FF solid 6px"
           curul3.style.borderBottom="none"
           this.myOrder(1);
       }

    }
    render() {
        const {
            listLen, hasMore, initializing, refreshedAt, canRefreshResolve,
        } = this.state;
        const list = [];

        if (listLen) {
            for (let i = 0; i < listLen; i++) {
                list.push((
                    <li key={i}>
                        <p>{i}</p>
                    </li>
                ));
            }
        }
        return (

            <Fragment>
                <div className={this.state.loading}></div>
                <div className="or-all">
                    <ul className="or-head" >
                        <li onClick={this.handleClick}><span className="or-bottom or-bottom2 " id='or-li'  >全部</span></li>
                        <li onClick={this.handleClick2}><span className="or-bottom " id='or-li2'>未完成</span></li>
                        <li onClick={this.handleClick3}><span className="or-bottom " id='or-li3'>已完成</span></li>
                    </ul>
                    <div className="or-con">
                        <Tloader
                            className="main"
                            onRefresh={this.refresh}
                            onLoadMore={this.loadMore}
                            hasMore={hasMore}
                            initializing={initializing}
                            autoLoadMore={this.isautoLoadMore}
                        >
                            <ul className="test-ul">
                                {this.myOrderList()}
                            </ul>
                            <div className="noMore" id={ this.state.noMore_id ? 'noMore_id' : ''}>没有更多了</div>
                        </Tloader>
                        <div className="footer">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={canRefreshResolve}
                                    onChange={this.toggleCanRefresh}
                                />
                            </label>
                        </div>

                    </div>
                </div>
            </Fragment>

        );
    }
}
export default Order

