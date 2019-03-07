import React,{Component,Fragment} from 'react';
import './bindingCar.css';
import '../writeCar/writeCar.css'
import Fetch from "../../fetch/fetch"
import Imgupload from '../../imgUpload/imgUpload';

class BindingCar extends Component{
    constructor(props){
        super(props);
        this.state={
            binvalue:'',
            bin:'bin-save bin-save2',
            binsapn:'binspan',
            bframe:'bin-frame',
            bframe2:'bin-frame',
            cid:'' ,
            color:'',
            brand:'',
            kind: '',
            default:'',
            carid:'',
            sign:'',
            Type:'',
            getcolor:'',
            loading:'loading', //
            imageList:'',           //提交的图片
            severImgUrl:'q,a,z',      //服务器端获取的图片
            error: ''

        }
        this.binchange=this.binchange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.deletebd = this.deletebd.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.color=this.color.bind(this);
        this.kind=this.kind.bind(this);
        this.brand=this.brand.bind(this);
        this.sure=this.sure.bind(this)

        document.title="车辆信息";

    }
    /*componentWillMount(){
        var getid=JSON.parse(sessionStorage.Id);//获取id
    }*/
    componentDidMount() {
        const searchUrl =window.location.href;
        const searchData =searchUrl.split("?");        //截取 url中的“?”,获得“?”后面的参数
        const  searchText =decodeURI(searchData[1]);



            Fetch.post('/ch1/customer/carDetail/'+searchText,{
            carId:searchText,

        }).then(json=>{
            if(json.code==='000000') {

                   this.Carname.value=json.data.carNo,
                    this.Brand.value=json.data.brand,
                    this.Type.value=json.data.type,
                    this.Color.value=json.data.color,
                    //    alert( this.state.severImgUrl )
                    this.setState({
                        default:json.data.isDefault,
                        loading:'',
                        severImgUrl:json.data.pic,
                    },()=>{

                    })

                if(this.state.default==="0"){
                    this.setState({
                        isToggleimg:true
                    })
                }
            }
        }).catch(e=>{
                this.setState({
                    loading: 'loading'
                })
                setInterval(
                    () => this.tick(),
                    30000
                );
        })
    }
    //常用车辆
    handleClick(){
        this.setState({
            loading:'loading'
        })
        //判断是否已存在常用车辆
        Fetch.post('/ch1/customer/existDefaultCar',{

        }).then(json=>{
            if(json.data===false) {//false 常用车辆不存在
                let submitObj = document.getElementById('closes2');
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
            if(json.data===true){ //true 常用车辆存在
                let submitObj = document.getElementById('closes2');
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
            this.setState({
                loading:'loading'
            })
        })
    }
    //车牌号码值
    binchange(e){
        this.setState({
            binvalue: e.target.value
        },()=>{
            if(this.state.binvalue){

                this.setState({
                    bin:'bin-save bin-save2',
                    binspan:'binspan binspan2'
                })
            }else{
                this.setState({
                    bin:'bin-save ',
                    binspan:'binspan '
                })
            }

        })
    }
    //颜色内容
    color(e){
        this.setState({
            color : e.target.value
        })
    }
    kind(e){
        this.setState({
            kind : e.target.value
        })
    }
    brand(e){
        this.setState({
            brand : e.target.value
        })
    }
    //解除绑定
    deletebd(){
        let submitObj = document.getElementById('closes');
        submitObj.style.display='block'
    }

    //关闭提示删除框
    close(){
        let submitObj = document.getElementById('closes');
        submitObj.style.display='none'
    }
    //点击弹窗空白部分关闭删除框
    open(){
        let submitObj = document.getElementById('closes');
        submitObj.style.display='block'
    }
    //关闭提示框
    close2(){
        let submitObj = document.getElementById('closes2');
        submitObj.style.display='none'
    }
    //点击弹窗空白部分关闭提示框
    open2(){
        let submitObj = document.getElementById('closes2');
        submitObj.style.display='block'
    }
    //点击确定
    sure(){
        this.setState({
            isToggleimg:true,
            default:'0',
        })
    }
    //保存页面接口
    save(){
        this.setState({
            loading:'loading'
        })
        const searchUrl =window.location.href;
        const searchData =searchUrl.split("?");        //截取 url中的“?”,获得“?”后面的参数
        const  searchText =decodeURI(searchData[1]);
        if(this.Carname.value){
            Fetch.post('/ch1/customer/updateCar/'+searchText,{
                id:searchText,
                carNo:this.Carname.value,
                color:this.Color.value,
                brand:this.Brand.value,
                type: this.Type.value,
                isDefault: this.state.default,
                pic:this.state.imageList
            }).then(json=>{
                if(json.code==='000000') {

                    window.location='/wx/carMenu'
                    this.setState({
                        loading:''
                    })
                }
            }).catch(e=>{
                this.setState({
                    loading: 'loading'
                })
                setInterval(
                    () => this.tick(),
                    30000
                );
            })
        }else {
            alert('请填写号码')
        }
    }
    //确定解除绑定
    delete(){
        this.setState({
            loading:'loading'
        })
        const searchUrl =window.location.href;
        const searchData =searchUrl.split("?");        //截取 url中的“?”,获得“?”后面的参数
        const  searchText =decodeURI(searchData[1]);
        Fetch.post('/ch1/customer/removeCar/'+searchText,{
            carId:searchText
        }).then(json=>{
            if(json.code==='000000'){
                this.setState({
                    loading:''
                })
                window.location='/wx/carMenu'
            }else {
                alert(json.message)
            }
        }).catch(e=>{
            this.setState({
                loading: 'loading'
            })
            setInterval(
                () => this.tick(),
                30000
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

                <div>
                    <div className={this.state.error}></div>
                    <div className={this.state.loading}></div>
                    <p className="wri-num" >请填写车牌号码</p>
                    <div className="wri-carnum"><input type="text" onChange={this.binchange} className="wri-carnum wri-carnum2" placeholder="请填写车牌号码"  maxLength={8} ref={(Carname) => this.Carname = Carname} readOnly  /></div></div>
                <div className="wri-mes">
                    <p className="wri-num">车辆信息（非必填）</p>
                    <ul className="wri-ul">
                        <li><span>品牌</span><input type="text" className="wri-li" placeholder="请填写车辆品牌" maxLength={7} onChange={this.brand} ref={(Brand) => this.Brand = Brand}/></li>
                        <li><span>型号</span><input type="text" className="wri-li" placeholder="请填写车辆型号" maxLength={7} onChange={this.kind}  ref={(Type) => this.Type = Type}/></li>
                        <li><span>颜色</span><input type="text" className="wri-li" placeholder="请填写车辆颜色" maxLength={7} onChange={this.color} ref={(Color) => this.Color = Color}/></li>
                    </ul>
                </div>
                <div className="wri-mes">
                    <p className="wri-num">车辆图片（最多三张，大小10M以下，非必填）</p>
                    <div className="wri-img">
                        {/* 上传图片组件*/}
                        <Imgupload  fileSize="10000" accepted={ this.state.severImgUrl } onChoose={(value => {
                                this.setState({
                                        imageList: value.join(',')
                                    }
                                )}
                        )}></Imgupload>

                    </div>
                </div>
                <div className="usual-car" onClick={this.handleClick}><span className="wri-left">设为常用车辆</span><span className="wri-right">  {this.state.isToggleimg ? <img src={require("../../img/gou.png")} alt="" /> : '' }</span></div>
                <div className={this.state.bin} onClick={this.save}><span className={this.state.binspan}>保存</span></div>
                <div className="bin-delete" onClick={this.deletebd}><span>解除绑定</span></div>
                {/*解绑车辆*/}
                <div className={this.state.bframe} onClick={this.close} id='closes'>
                    <div className="bin-frame-con" onClick={this.open} id='tk' >
                        <p>是否解绑所选车辆？</p>
                        <p>解除绑定的车辆将无法进行自动扣费</p>
                        <div className="del-sure" onClick={this.delete}>确定</div>
                    </div>
                </div>

                  {/*提示是否默认车辆*/}
                <div className={this.state.bframe2} onClick={this.close2} id='closes2'>
                    <div className="bin-frame-con bin-frame-con2" onClick={this.open2} id='tk' >
                        <p>{this.state.Tip}</p>

                        <div className="del-sure" onClick={this.sure}>确定</div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
export  default BindingCar
