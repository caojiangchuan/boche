import React,{Component,Fragment} from 'react';
import './selfHlep.css';
import { Link } from 'react-router-dom';
import GetToken from "../fetch/getToken";
import Fetch from '../fetch/fetch.js';
import NoPaidCar from './noPaidCar';


class SelfHlep extends Component  {
    constructor(props){
        super(props);
        this.state={
            error:'',
            loading:'loading',
            all:'all-hide',
            Carlist:[],
            Data:[],
            carName:'',
            divsuccess:'none',
        }
        document.title="自助结费";
        this.autoSettlement=this.autoSettlement.bind(this)
    }

    componentDidMount(){
        //获取Token
        GetToken(this.autoSettlement,'self');
        //判断需要结费车辆的数量
    }
    //自助结费接口
    autoSettlement(){
        let _this=this;
        var liLength = document.getElementsByTagName('li');
        Fetch.post('/ch1/autoSettlement',{

        }).then(json=>{

            if(json.code==="000000"){

               // alert(json.code)
                _this.setState({
                    Carlist:json.list,
                    Data: json.data
                })
                if(_this.state.Data!==null){

                   _this.setState({
                        carName: _this.state.Carlist[0].carNo,

                    })
                    sessionStorage.saveUnPaidList=JSON.stringify(json.data);
                    window.location="/wx/unPaidCarName?"+_this.state.carName

                }if (_this.state.Data===null&&liLength.length<2) {

                  //  window.location = "/wx/nopaidcar"
                    _this.setState({
                        divsuccess: 'block',
                        loading:''
                    })
                }if(_this.state.Data===null&&liLength.length>2){


                   _this.setState({
                        all:'self-all',
                        loading:'',
                    })}
            }else if (json.code==="400011") {
                   window.location="/wx/addsim?nocard" //跳转添加车辆
            }else {
                alert(json.message)
            }
        }).then(()=>{}).catch(e=>{
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
    bindcar(){
                 return(
                     this.state.Carlist.map(  (itme,index)=>{//获取自助结费车辆循环
                         return(
                             <li id={itme.id}     key={index} > <Link to={"/wx/unPaidCarName?"+itme.carNo}> <span className="self-border"><img src={require('../img/self.png')} alt=""/></span><span className="self-num">{itme.carNo}</span></Link></li>
                         )
                     })
                 )
    }
    render(){
        return(
             <Fragment>
                 <div className={this.state.error}></div>
                 <div className={this.state.loading}></div>
                 <div className={this.state.all} >
         <h1 className="self-h1">请选择需要结费的车辆</h1>
      <ul className="self-car" >
          {this.bindcar()}

          <li> <Link to="/wx/addsim"><span className="self-border self-border2"></span><span className="self-num">其他车辆</span></Link></li>

      </ul>
                 </div>

                 <div style={{display:this.state.divsuccess}}>
                <NoPaidCar></NoPaidCar>
            </div>

             </Fragment>
        )
}
}
export  default SelfHlep;
