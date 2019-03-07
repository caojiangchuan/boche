import React,{Component,Fragment} from 'react';
import './view.css';
import Imgupload from '../imgUpload/imgUpload';
import Fetch from '../fetch/fetch.js';



class View extends Component{
    constructor(props){
        super(props);
        this.state={
            tevalue:'',
            viewbtn:'btn',
            imageList:'',
            loading:'',

        }
        this.areChange = this.areChange.bind(this);
       this.viewbtn = this.viewbtn.bind(this);
       this.email=this.email.bind(this);

        document.title="意见反馈";

    };

    //绑定textare内容
    areChange(e){
        this.setState({
            tevalue:e.target.value
        },()=>{
            if(this.state.tevalue){
              this.setState({
                  viewbtn: 'btn btn-cur',
              })
            }else{
                this.setState({
                    viewbtn: 'btn',
                })
            }
            })
    }
    email(e){
        this.setState({
            email:e.target.value,

        })
    }
    //提交按钮
    viewbtn(){

            if(!this.state.tevalue){
                alert("问题和意见栏不能为空")
                return
            }
        var reg = new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/); //正则表达式
        var obj = document.getElementById("email"); //要验证的对象

        if(obj.value){
            if(!reg.test(obj.value)){ //正则验证不通过，格式不对
                alert("邮箱格式错误!");
                return false;

            }
        }
        if(this.state.tevalue){

            Fetch.post('/ch1/customer/feedback',{
                content:this.state.tevalue,
                email:this.state.email,
                pic:this.state.imageList
            }).then(json=>{
                if(json.code==="000000") {
                    window.location="/wx/person"
                }else {

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

            /*//信息填写无误后跳转页面*/
        }




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
                <div>
                    <p className="font-s">问题和意见</p>
                    <textarea onChange={this.areChange} className="ipt-question input" placeholder="请详细描述你的问题和意见..." ></textarea>
                </div>
                <div>
                    <p className="font-s">图片添加（问题截图，大小2M以下，选填）</p>
                    <div className="add-img">
                        {/*图片上传组件*/}
                        <Imgupload onChoose={(value => {
                        console.log('=============:'+value);
                        this.setState({
                        imageList: value.join(',')
                        }
                        )}
                        )}></Imgupload>

                    </div>
                </div>
                <div>
                    <p className="font-s">邮箱（方便我们联系你，选填）</p>
                    <input type="text" className="email input" placeholder="请输入邮箱" id='email' onChange={this.email}  />
                </div>
                <div>
                     <div className={this.state.viewbtn} onClick={this.viewbtn } >提交</div>
                </div>

            </Fragment>
        );
    }}

export default View;
