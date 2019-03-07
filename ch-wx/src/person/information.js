import React,{Component,Fragment} from 'react';
import './information.css';
import '../carmanage/writeCar/writeCar.css';
import '../fetch/fetch'
import Fetch from "../fetch/fetch";
import { Link} from 'react-router-dom';


class Information extends Component{
    constructor(props) {
        super(props);
        this.state={
            wri:'wri-btn3 ',
            bd:'bd3 ',
            face:'',
            changeName:'',
            loading:'loading',
            error:''
        }
        this.saveMessage=this.saveMessage.bind(this)
        this.changeName=this.changeName.bind(this)
        this.setPhone=this.setPhone.bind(this)
        document.title="个人中心";
    }
    componentDidMount() {

       Fetch.post('/ch1/customer/getCustomer',{

       }).then(json=> {
           if (json.code === '000000') {

               this.Tel.value = json.data.mobile
               this.wxname.value = json.data.wxName
               this.trueName.value = json.data.name
               this.idcard.value = json.data.idCard
               this.Address.value = json.data.address
               this.setState({
                   face: json.data.face,
                   loading: ''
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
    //传手机号
    setPhone(){
      sessionStorage.setphone = JSON.stringify(this.Tel.value)//session存电话号码
        if(sessionStorage.setphone){
            window.location="/wx/changeNum"
        }
    }
    //更改信息显示保存框
    changeName(e){
        this.setState({
            changeName : e.target.value
        },()=>{
              this.setState({
                  wri:'wri-btn wri-btn2 ',
                  bd:'bd bd2',
              })
        })
    }

    saveMessage(){

        if(this.Tel.value===''){
            alert('手机号不能为空')
            return
        }
        if(this.wxname.value===''){
            alert('昵称不能为空')
            return
        }
        //验证手机号
        var phone = new RegExp(/^1\d{10}$/); //正则表达式
        var obj = document.getElementById("tel"); //要验证的对象
        //验证身份证
        var idcard = new RegExp(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/)
        var obj2 = document.getElementById("idcard")
        if(obj.value){
            if(!phone.test(obj.value)){ //正则验证不通过，格式不对
                alert("电话号码格式错误!");
                return false;
            }
        }
        if(obj2.value){
            if(!idcard.test(obj2.value)){
                alert("身份证格式错误")
                return false
            }
        }
             Fetch.post('/ch1/customer/updateCustomer',{
                 mobile:this.Tel.value,
                 wxName:this.wxname.value,
                 name:this.trueName.value,
                 idCard:this.idcard.value,
                 address:this.Address.value

             }).then(json=>{
                      if(json.code==='000000'){
                          window.location='/wx/person'
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

    render(){
        return(
            <Fragment>
                <div className={this.state.loading}></div>
                <div className={this.state.error}></div>
                <ul className="mes-top">
                    <li ><span  className="left">头像</span><span className="right right2"><img src={this.state.face} alt=""/></span></li>
                    <li ><span className="left">昵称</span><span className="right"><input onChange={this.changeName} type="text" placeholder="请填写昵称" className="mes-ipt" maxLength={10} alt="" ref={(wxname) => this.wxname = wxname}/> <img src={require('../img/right.jpg')} alt=""/> </span></li>
                    <li onClick={this.setPhone} ><span className="left">手机号</span><span className="right"> <input id="tel" pattern="\d*" onChange={this.changeName} type="text" placeholder="请填写手机号" className="mes-ipt" maxLength={11} ref={(Tel) => this.Tel = Tel} readOnly/> <img src={require('../img/right.jpg')} alt=""/> </span></li>
                </ul>
                <div className="mes-true">
                    <p>实名认证信息</p>
                    <ul className="mes-top mes-bottom">
                        <li ><span  className="left">姓名</span><span className="right"> <input onChange={this.changeName} type="text" placeholder="请填写真实姓名" className="mes-ipt" maxLength={8} ref={(trueName) => this.trueName = trueName} /><img src={require('../img/right.jpg')} alt="" /> </span></li>
                        <li ><span className="left">身份证号码</span><span className="right">  <input id="idcard" onChange={this.changeName} type="text" placeholder="请填写身份证号码" className="mes-ipt"  maxLength={18} ref={(idcard) => this.idcard = idcard}/><img src={require('../img/right.jpg')} alt=""/> </span></li>
                        <li ><span className="left">地址</span><span className="right">   <input onChange={this.changeName} type="text" placeholder="请填写地址" className="mes-ipt" maxLength={18} ref={(Address) => this.Address = Address} /><img src={require('../img/right.jpg')} alt=""/> </span></li>
                    </ul>

                </div>

                <div className={this.state.wri}   onClick={this.saveMessage}><span className={this.state.bd}>确认保存</span></div>
            </Fragment>
        )
    }
}

export  default Information
