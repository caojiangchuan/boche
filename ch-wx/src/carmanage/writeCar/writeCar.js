import React,{Component,Fragment} from 'react';
import './writeCar.css';
import Imgupload from '../../imgUpload/imgUpload';
import Fetch from "../../fetch/fetch"
import '../bindingCar/bindingCar.css'
import Success  from '../../register/success'


class WriteCar extends Component{
    constructor(props){
        super(props);
        this.state={
            isToggleagree:true,
            isToggleimg:false,
            wri:'wri-btn',
            bd:'bd',
            tk:"",
            carvalue:'',
            color:'',
            brand:'',
            kind: '',
            default:1,
            EnergyCar:1,
            imageList:'',   //提交的图片
            Tip:'',
            bframe:'bin-frame',
            loading:'',
            divsuccess:'none',
            error: ''

        }
        this.carchange = this.carchange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.agree= this.agree.bind(this);
        this.bdbtn= this.bdbtn.bind(this);
        this.color=this.color.bind(this);
        this.kind=this.kind.bind(this);
        this.brand=this.brand.bind(this);
        this.sure=this.sure.bind(this)


        document.title="车辆信息";

    };

    //车牌信息内容
    carchange(e){
        this.setState({
            carvalue : e.target.value
        },()=>{
            if(this.state.carvalue && this.state.isToggleagree){
                this.setState({
                    wri: 'wri-btn wri-btn2',
                    bd:'bd2'
                })
            }else{
                this.setState({
                    wri: 'wri-btn',
                    bd:'bd'
                })
            }
        })
        var numLength = document.getElementById('numLength')
        if(numLength.value.length===8){
            this.setState({
                EnergyCar: 0
            })
        }
    }
    //颜色内容
    color(e){
        this.setState({
            color : e.target.value
        })
    }
    //品牌内容
    kind(e){
        this.setState({
            kind : e.target.value
        })
    }//型号内容
    brand(e){
        this.setState({
            brand : e.target.value
        })
    }

    //常用车辆
    handleClick(){

        this.setState({
            loading:'loading'
        })
        Fetch.post('/ch1/customer/existDefaultCar',{

        }).then(json=>{
            if(json.data===false) {
                let submitObj = document.getElementById('closes');
                submitObj.style.display = 'block'
                this.setState({

                    Tip: '是否设置该车为常用车辆',
                    loading:''

                })
                if (this.state.isToggleimg) {
                    this.setState({
                        isToggleimg: false,
                        default:'1',
                        loading:''
                    })
                    submitObj.style.display = 'none'
                }
            }
            if(json.data===true){
                let submitObj = document.getElementById('closes');
                submitObj.style.display = 'block'
                this.setState({

                    Tip: '常用车辆已存在，是否覆盖',
                    loading:''
                })
                if (this.state.isToggleimg) {
                    this.setState({
                        isToggleimg: false,
                        default:'1',
                        loading:''
                    })
                    submitObj.style.display = 'none'
                }
            }

        }).catch(e=>{

        })


    }
    //同意阅读协议
    agree(){
        this.setState(prevState => ({
            isToggleagree: !prevState.isToggleagree,

        }));
        if(this.state.carvalue &&!this.state.isToggleagree){

            this.setState({
                wri: 'wri-btn wri-btn2',
                bd:'bd2'

            })

        }else {
            this.setState({
                wri: 'wri-btn',
                bd:'bd'
            })
        }
    }


    //关闭提示删除框
    close(){
        let submitObj = document.getElementById('closes');
        submitObj.style.display='none'

    }
    //点击弹窗空白部分关闭提示框
    open(){

        let submitObj = document.getElementById('closes');
        submitObj.style.display='block'


    }
    //点击确定
    sure(){
        this.setState({
            isToggleimg:true,
            default:'0',
        })
    }
    //确定绑定
    bdbtn(){


        if(!this.state.carvalue){
            alert('请输入车牌')
            return
        }
        if(!this.state.isToggleagree){
            alert('请勾选协议')
        }
        if(this.state.carvalue&&this.state.isToggleagree){

           this.setState({
               loading:'loading'
           })

          //添加车辆接口
            Fetch.post('/ch1/customer/addCar',{

                carNo:this.state.carvalue,
                color:this.state.color,
                brand:this.state.brand,
                type: this.state.kind,
                isDefault:this.state.default,
                pic:this.state.imageList,
                energyCar:this.state.EnergyCar

            }).then(json=>{//成功
                if(json.code==='000000'){
                    this.setState({
                        loading:'',
                        divsuccess:'block',

                    })
                   /* window.location='/wx/carMenu'*/
                }if(json.code==='400006'){
                    alert(json.messages)
                    this.setState({
                        loading:'',

                    })
                }
            }).catch(e=>{//失败
                this.setState({
                    loading: 'loading'
                })
                setInterval(
                    () => this.tick(),
                    30000
                );
            })


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

                <div>
                    <div className={this.state.error}></div>
                    <div className={this.state.loading}></div>
                    <p className="wri-num" >请填写车牌号码</p>
                    <div className="wri-carnum"><input type="text" onChange={this.carchange} className="wri-carnum wri-carnum2" placeholder="请填写车牌号码"  maxLength={8} id="numLength"  /></div></div>
                <div className="wri-mes">
                    <p className="wri-num">车辆信息（非必填）</p>
                    <ul className="wri-ul">
                        <li><span>品牌</span><input type="text" className="wri-li" placeholder="请填写车辆品牌" maxLength={7} onChange={this.brand}/></li>
                        <li><span>型号</span><input type="text" className="wri-li" placeholder="请填写车辆型号" maxLength={7} onChange={this.kind}/></li>
                        <li><span>颜色</span><input type="text" className="wri-li" placeholder="请填写车辆颜色" maxLength={7} onChange={this.color}/></li>
                    </ul>
                </div>
                <div className="wri-mes">
                    <p className="wri-num">车辆图片（最多三张，大小10M以下，非必填）</p>
                    <div className="wri-img">
                        {/* 上传图片组件*/}
                        <Imgupload  fileSize="10000" onChoose={(value => {
                                this.setState({
                                        imageList: value.join(',')
                                    }
                                )}
                        )}></Imgupload>
                    </div>
                </div>
                <div className="usual-car" onClick={this.handleClick}><span className="wri-left">设为常用车辆</span><span className="wri-right">  {this.state.isToggleimg ? <img src={require("../../img/gou.png")} alt="" /> : ''}</span></div>


                <div className="wri-agree" >
                    <div className="read" onClick={this.agree}><div className="wri-sure"><div className="sure-img" >{this.state.isToggleagree ? <img src={require("../../img/sure.png")} alt="" /> : ""}</div></div> 已阅读并同意</div><a href={this.state.tk} >《相关条款》</a>
                </div>
                <div className={this.state.wri} onClick={this.bdbtn}><span className={this.state.bd}>确认绑定</span></div>

                {/*提示框*/}
                <div className={this.state.bframe} onClick={this.close} id='closes'>
                    <div className="bin-frame-con bin-frame-con2" onClick={this.open} id='tk' >
                        <p>{this.state.Tip}</p>

                        <div className="del-sure" onClick={this.sure}>确定</div>
                    </div>
                </div>

                <div style={{display:this.state.divsuccess}}>
                    <Success success={'绑定成功'} content={'已成功绑定车辆'+this.state.carvalue}/>
                </div>

            </Fragment>
        )
    }
}
export default WriteCar
