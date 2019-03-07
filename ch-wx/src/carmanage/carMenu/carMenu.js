import React,{Component,Fragment} from 'react';
import './carMenu.css';
import { Link} from 'react-router-dom';
import Fetch from "../../fetch/fetch"

class CarMenu extends Component{
    constructor(props){
        super(props);
        this.state={
             carnum:'',
            loading:'loading',
            adshow:'usual',
            carlist:[],
            vava:"",
            error:''
        }
        document.title="添加车辆";
        this.find= this.find.bind(this)

    };
    componentDidMount(){
        //用户车辆信息查询
        Fetch.post('/ch1/customer/myCar',{

        }).then(json=>{
            if(json.code==="000000"){
                this.setState({
                    loading:'',
                    carlist:json.list
                })
                sessionStorage.setlistcar= JSON.stringify(json.list);//session存setlistcar数组

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
    cList(){
        return (
                   //遍历添加车辆li
            this.state.carlist.map((item, index) => {
                if(item.carNo) {
                    return (
                        <li  id={item.id}     key={index}  > <Link to={"/wx/bindingcar?"+item.id}><span className="addcar-img"><img
                            src={require('../../img/addcar.png')} /></span><span
                            className="carnum">{item.carNo}</span><span className={item.isDefault==="0" ? 'usual':'adhide'} >常用车辆</span><span
                            className="add-right"><img src={require('../../img/right.jpg') } alt=""/></span></Link></li>
                    )
                }
            })
        )
    }

    find(e){
        /*var id = e.target.id;
        sessionStorage.Id= JSON.stringify(id);//session存data数组
        this.props.history.push('/wx/bindingcar')*/
    }
    render(){
        return(
            <Fragment>
                <div className={this.state.loading}></div>
                <div className={this.state.error}></div>
            <ul className="car-list">
                <li><span className="head-list">车辆列表</span></li>
<div id="demo" onClick={this.find}>
                {this.cList()}
</div>
            </ul>
                <Link to='/wx/addsim'><div className="add-car" ><span className="addcar-img"><img src={require('../../img/add.png')} alt=""/></span><span className="bd-car">添加绑定车辆</span></div></Link>
            </Fragment>
        );
    }
}
export default CarMenu;
