import React,{Component,Fragment} from 'react';
import Success from './success';
import './register.css';
import Fetch from '../fetch/fetch.js';
// import GetToken from '../getToken';

class register extends Component{
    constructor(props){
        super(props);
        this.state = {
            codeTit: '获取验证码',
            codeClass: "rg_send_code",
            telVal:'',
            codeVal:'',
            rg_btn:'rg_btn',    //下一步状态
            telRegex: /^1\d{10}$/,
            divsuccess:'none',
            name:'',
            status:'',
            type:'register'

        };
        // 优化执行性能
        this.sendCode = this.sendCode.bind(this);
        this.goNext = this.goNext.bind(this);
        this.telInputChange = this.telInputChange.bind(this);
        this.codeChange = this.codeChange.bind(this);
    };
    componentDidMount(){
        document.title="发送验证码";
        const searchUrl = window.location.href;
        const searchData = searchUrl.split("?");        //截取 url中的“?”,获得“?”后面的参数
        const searchText = decodeURI(searchData[1]);
        this.state.status=searchText
        if(this.state.status==="reset"){
            this.setState({
                type:'reset'
            })
        }
    }

    render(){
        return(
            <Fragment>
                <div className="register" >
                    <ul className="rg_con clearfix">
                        <li className="clearfix">
                            <span>国家/地区</span>
                            <select className="quhao">
                                <option>中国 (+86)</option>
                                <option>1 (+1)</option>
                                <option>1 (+1)</option>
                            </select>
                            <s className="rg_s"></s>
                        </li>
                        <li className="clearfix">
                            <span>手机号码</span>
                            <input type="tel" onChange={this.telInputChange}  placeholder="填写手机号码" pattern="\d*" maxLength="11" className="rg_tel" />
                            <button className={this.state.codeClass} onClick={this.sendCode}>{this.state.codeTit}</button>
                        </li>
                        <li className="clearfix borderNo">
                            <span>验证码</span>
                            <input type="tel" onChange={this.codeChange}  placeholder="输入验证码" pattern="\d*" maxLength="6" className="rg_code" />
                        </li>
                    </ul>
                    <button className={this.state.rg_btn} onClick={this.goNext}>下一步</button>
                </div>
                <div style={{display:this.state.divsuccess}}>
                    <Success success={'绑定成功'} content={'已成功绑定手机'+this.state.telVal}/>
                </div>
            </Fragment>
        );
    }
    //绑定手机号
    telInputChange(e){
        this.setState({
            telVal: e.target.value
        }, ()=> {
            if(this.state.telRegex.test(this.state.telVal)&&this.state.codeVal){
                this.setState({
                    rg_btn: 'rg_btn act',
                })
            }
            else{
                this.setState({
                    rg_btn: 'rg_btn',
                })
            }
        })
    }
    //绑定code
    codeChange(e){
        this.setState({
            codeVal: e.target.value,
        }, ()=> {
            if(this.state.telRegex.test(this.state.telVal)&&this.state.codeVal){
                this.setState({
                    rg_btn: 'rg_btn act',
                })
            }else{
                this.setState({
                    rg_btn: 'rg_btn',
                })
            }
        })
    }
    //发送短信验证码接口
    send(){
        Fetch.post('/ch1/sendMessage',{
            mobile:this.state.telVal,
            type:this.state.type
        }).then(json =>{
            if(json.code==='000000'){

            }else if(json.code==="999999"){
                alert(json.messages)
            }
        }).catch(e=>{
            if(e.code==="999999"){
                alert(e.messages)
            }
            console.info(e);
        })
    }
    //发送验证码
    sendCode(e){
        let _this=this;
        let i = 60;

        if(_this.state.codeClass==="rg_send_code act"){
            return false;
        }
        let regex =this.state.telRegex;
        if (this.state.telVal) {
            //react使用正则表达式变量的test方法进行校验，直接使用value.match(regex)显示match未定义
            if (regex.test(this.state.telVal)) {
                //suc
            } else {
                alert('请输入正确的手机号码！');
                return false;
            }
        } else {
            alert('请输入手机号码！');
            return false;
        }


        Fetch.post('/ch1/verifyMobile/'+this.state.telVal,{
            mobile:this.state.telVal

        }).then(json=>{
            if(json.code==="000000"){
                   this.send()
                countDown();
                _this.setState({
                    codeClass:"rg_send_code act"
                });
            }else if(json.code==="400002"){
                alert("该手机号已注册，请更换手机号码")
            }
        }).catch(e=>{
alert(e.messages)
        })




//样式变成重新发送
        function countDown(e) {
            var sett= setTimeout(countDown,1000);
            i = i - 1;
            _this.setState({
                codeTit:"重新发送("+i+")"
            });
            if (i === 0) {
                _this.setState({
                    codeTit:"重新发送"
                });
                i = 60;
                _this.setState({
                    codeClass:"rg_send_code"
                });
                clearInterval(sett)
                return false;
            }

        }
    }
    //注册方法接口
   register(){

       Fetch.post('/ch1/register',{
           mobile:this.state.telVal,
           code:this.state.codeVal,
       }).then(json =>{
           if(json.code==='000000'){
               this.setState({
                   divsuccess: 'block',
               })
               sessionStorage.userinfo= JSON.stringify(json.data);//session存data数组

           }else{
               alert(json.messages)
           }
       }).catch(e=>{

           alert(e.messages)

           console.info(e);
       })
   }
   //修改手机号码方法接口
    revise(){
        Fetch.post('/ch1/customer/bind',{
            mobile:this.state.telVal,
            verifyCode:this.state.codeVal,
        }).then(json =>{
            if(json.code==='000000'){
                this.setState({
                    divsuccess: 'block',
                })
                sessionStorage.userinfo= JSON.stringify(json.data);//session存data数组

            }else{
                alert(json.messages)
            }
        }).catch(e=>{

            alert(e.messages)

            console.info(e);
        })
    }

    //下一步
    goNext(){
        let regex =this.state.telRegex;
        if (this.state.telVal) {
            //react使用正则表达式变量的test方法进行校验，直接使用value.match(regex)显示match未定义
            if (regex.test(this.state.telVal)) {
                //suc
            } else {
                alert('请输入正确的手机号码！');
                return false;
            }
        } else {
            alert('请输入手机号码！');
            return false;
        }

        if(!this.state){
            alert('请输入验证码！');
            return false;
        }
      if(this.state.status==="reset"){
          this.revise()
      }else {
          this.register()
      }

    }
}
export default register;



