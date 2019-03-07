import React,{Component,Fragment} from 'react';
import './changeNum.css'
import '../carmanage/writeCar/writeCar.css';
import { Link} from 'react-router-dom';


class  ChangeNum extends Component{
    constructor(props) {
        super(props);
        this.state={
            phone:'',
            wri:'wri-btn wri-btn2',
            bd:'bd2'
        }
        document.title="手机号"
    }
    componentDidMount(){
      //session获取电话号
        this.setState({
            phone:JSON.parse(sessionStorage.setphone)
        })
    }

    render(){
        return(
            <Fragment>
                <div className="ch-all">
             <div className="ch-phone"><img src={require('../img/phone.png') } alt="手机照片"/></div>
                    <p className="ch-nowNum">您当前绑定的手机号为</p>
                    <p className="ch-num">{this.state.phone}</p>
                    <ul className="ch-three">
                        <li>更换手机号后，当前的账户基础信息保持不变,部分权益将会失效</li>
                        <li>更换成功后原手机号码失效，请使用新手机号进行登录</li>
                        <li>只支持修改为未注册的手机号码；30天内只能修改一次手机号</li>
                    </ul>
                    <div className="ch-btn"><Link to="/wx?reset"> <div className={this.state.wri}   onClick={this.saveMessage}><span className={this.state.bd}>更改手机号</span></div></Link></div>
                </div>
            </Fragment>
        )
    }

}
export default ChangeNum
