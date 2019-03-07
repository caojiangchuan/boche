import React ,{Component}from 'react';
import './person.css';
import { Link} from 'react-router-dom';
import Fetch from '../fetch/fetch.js';
import GetToken from '../fetch/getToken';

class  Person extends Component{

    constructor(props){
        super(props);
        this.state={
            name:'',
            tel:'',
            face:'',
            loading:'loading',
            error:''
        };
        document.title="个人中心";
        this.getSavet=this.getSavet.bind(this);

    }

    getSavet(){
        const _this=this;
        Fetch.post('/ch1/customer/getCustomer' ).then(json =>{
            if(json.code==='000000'){

                _this.setState({
                    loading:'',
                    tel: json.data.mobile,
                    name: json.data.wxName,
                    face: json.data.face
                },()=>{
                       sessionStorage.tel= JSON.stringify(this.state.tel);
                       sessionStorage.name= JSON.stringify(this.state.name);
                      sessionStorage.face= JSON.stringify(this.state.face);
                    })
            }
        }).catch(e=>{
           // alert(e.messages)
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
    componentDidMount(){
        //获取Token
        GetToken(this.getSavet,'person');
    }
    //跳转车辆管理
    jumpToAboutPage(){

        this.props.history.push({
            pathname: '/wx/carMenu',
            state: { fromDashboard: true }
        })
    }
    //跳转关于我们
    add(){

        this.props.history.push({
            pathname: '/wx/about',
            state: { fromDashboard: true }
        })
    }
    //跳转意见反馈
    add1(){

        this.props.history.push({
            pathname: '/wx/view',
            state: { fromDashboard: true }
        })
    }
    //跳转订单管理
    add2(){


    }

    render(){
        return(

            <div className="pr-bg">
                <div className={this.state.error}></div>
                <div className={this.state.loading}></div>
                <Link to="/wx/permes">  <div className="top">
                     <div className="head"><img src={this.state.face} alt=""/></div>
                    <div className="mes">
                        <p>{this.state.name}</p>
                        <p>{this.state.tel}</p>
                    </div>
                </div></Link>

                <ul className="list">
                    <li onClick={()=>this.jumpToAboutPage()}><span className="icon"><img src={require('../img/page-1.png')} alt=""/></span>车辆管理<span className="pe-right"><img src={require('../img/right.jpg')} alt=""/></span></li>
                    <Link  to={"/wx/order?"+"allpaid"}> <li onClick={()=>this.add2()}><span className="icon"><img src={require('../img/page-2.png')} alt=""/></span>订单管理<span className="pe-right"><img src={require('../img/right.jpg')} alt=""/></span></li></Link>
                    <li onClick={()=>this.add1()}><span className="icon"><img src={require('../img/page-3.png')} alt=""/></span>意见反馈<span className="pe-right"><img src={require('../img/right.jpg')} alt=""/></span></li>
                    <li onClick={()=>this.add()}><span className="icon"><img src={require('../img/page-4.png')} alt=""/></span>关于我们<span className="pe-right"><img src={require('../img/right.jpg')} alt=""/></span></li>
                </ul>
            </div>

        )
    }
}

export default Person;
