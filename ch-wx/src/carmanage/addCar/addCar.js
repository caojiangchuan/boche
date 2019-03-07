import React, {Component, Fragment} from 'react';
import './addCar.css';
import '../writeCar/writeCar.css'
import Fetch from "../../fetch/fetch"
import '../bindingCar/bindingCar.css'
import Success from "../../register/success";
import { Link } from 'react-router-dom';


class AddCar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleagree: false,
            isToggleagrees: true,
            isToggleimg: false,
            wri: 'wri-btn wri-btn2',
            bd: 'bd2',
            carvalue: '',
            iptVal: '',
            simon: false,
            default: 1,
            EnergyCar: 1,
            loading: '',
            error: '',
            Tip: '',
            bframe: 'bin-frame',
            divsuccess: 'none',
            carname: '',
            keyboard: 'keyboard ',
            keynum: 'keyboard',
            addname: '',
            carlist: ['粤', '京', '津', '沪', '浙', '苏', '云', '辽', '黑', '湘', '皖', '新', '冀', '鲁', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '青', '藏', '川', '宁', '琼', '豫', '渝', '台', '港', '澳', '学', '警', '领'],
            carnum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            del: '2',
            numindex: '',
            num: ['','','','','','',''],
            delimg: 'car-hide',
            dim: 'sim-font',
            dim1: 'sim-font',
            len:'',
            judge:'',
        }
        this.agree = this.agree.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.new = this.new.bind(this);
        this.bdbtn = this.bdbtn.bind(this);
        this.change = this.change.bind(this);
        this.sure = this.sure.bind(this)
        this.choose = this.choose.bind(this)
        this.chooseHide = this.chooseHide.bind(this)
        this.chooseNum = this.chooseNum.bind(this)
        this.del = this.del.bind(this)
    }

    componentDidUpdate() {
        //点击input获得高亮
        var simwri = document.getElementById('simwri')
        var txts = simwri.getElementsByTagName("input")
        var j = '', w = ''
        var _this = this
        for (var i = 0; i < txts.length; i++) {
            txts[i].index = i;
            //判断长度
            txts[i].onclick = function () {
                j = this.index - 1;
                w = this.index
                _this.setState({
                    numindex: j,
                })
                for (let i = 0; i < txts.length; i++) {
                    txts[i].style.borderColor = "#999"
                }
                txts[w].style.borderColor = "#1890FF"
            }
        }

    }
    //点击选择省份
    choose() {
        this.setState({
            keyboard: 'keyboard keyboard2',
            keynum:'keyboard ',
            delimg:'car-hide',
            dim1:'sim-font border-active',
        })
    }
    //选择省名称内容
    chooseName(_this,item,index) {
        // var val = e.target.innerHTML
        let val=_this;
        let chNum=[...this.state.num];
        chNum.splice(0,1,val)
        this.setState({
            num:chNum,
            numindex:1
        },()=>{
            var simwri = document.getElementById('simwri');
            var txts = simwri.getElementsByTagName("input");
            for(let i=0; i<txts.length; i++){
                txts[i].style.borderColor="#999"
            }
            txts[this.state.numindex].style.borderColor="#1890FF"
        })
        this.state.keyboard='keyboard'
        this.state.keynum='keyboard keyboard2'
        this.state.delimg='del'
        //判断车牌的长度
        var all_input = document.getElementsByTagName("input");
        var valeng = "";
        for (var i = 0; i < all_input.length; i++) {
            valeng += all_input[i].value;
        }
        this.state.len=valeng.length

        if((this.state.len===6||this.state.len===7)&&this.state.isToggleagrees===true){
            this.setState({
                wri:'wri-btn wri-btn2',
                bd:'bd2'
            })
        }
    }
    delname

    //点击选择车牌号码
    chooseHide(e) {

        this.setState({
            numindex:e,
            keyboard: 'keyboard',
            keynum:'keyboard keyboard2',
            delimg:'del',
        },()=>{
            var simwri = document.getElementById('simwri')
            var txts = simwri.getElementsByTagName("input");
            if(this.state.simon===false){
                if(this.state.numindex<=6){
                    for(let i=0; i<txts.length; i++){
                        txts[i].style.borderColor="#999"
                    }
                    txts[this.state.numindex ].style.borderColor="#1890FF"
                }}
            if(this.state.simon===true){
                if(this.state.numindex<=7){
                    for(let i=0; i<txts.length; i++){
                        txts[i].style.borderColor="#999"
                    }
                    txts[this.state.numindex].style.borderColor="#1890FF"
                }}
        });
    }
    //选择号码内容
    chooseNum(val){
        //非新能源 6位
        if(this.state.simon===false){
            var numindex=this.state.numindex>6 ? 6 : this.state.numindex ;
        }if(this.state.simon===true){
            var numindex=this.state.numindex>7 ? 7 : this.state.numindex ;
        }
        //console.log(this.state.numindex)
        let chNum=[...this.state.num];
        chNum.splice(numindex,1,val)
//光标移动到下一位
        if(this.state.simon===false){
            numindex=numindex+1 > 6 ?6 :numindex+1
        }if(this.state.simon===true){
            numindex=numindex+1 > 7 ?7 :numindex+1
        }

        this.setState({
            num:chNum,
            numindex:numindex
        },()=>{
            // console.log(this.state.num)
            var simwri = document.getElementById('simwri')
            var txts = simwri.getElementsByTagName("input");
            if(this.state.numindex<=6){
                for(let i=0; i<txts.length; i++){
                    txts[i].style.borderColor="#999"
                }
                txts[this.state.numindex ].style.borderColor="#1890FF"
            }
            if(this.state.numindex<=7){
                for(let i=0; i<txts.length; i++){
                    txts[i].style.borderColor="#999"
                }
                txts[this.state.numindex ].style.borderColor="#1890FF"
            }
        });

    }
    //删除内容
    del(){
        let numindex=this.state.numindex;
        let chNum=[...this.state.num];
        chNum.splice(numindex,1,'')
        this.setState({
            num:chNum,
            numindex:numindex-1 <0 ? 0 : numindex-1
        },()=>{
            var simwri = document.getElementById('simwri')
            var txts = simwri.getElementsByTagName("input");
            if(this.state.numindex>=0){
                for(let i=0; i<txts.length; i++){
                    txts[i].style.borderColor="#999"
                }
                txts[this.state.numindex].style.borderColor="#1890FF"
            }
            if(this.state.numindex==0){
                this.setState({
                    keyboard: 'keyboard keyboard2',
                    keynum:'keyboard ',
                    delimg:'car-hide',
                    dim1:'sim-font border-active'
                })
            }
        });

    }
    change() {

    }
    //关闭提示删除框
    close() {
        let submitObj = document.getElementById('closes');
        submitObj.style.display = 'none'
    }
    //点击弹窗空白部分关闭删除框
    open() {
        let submitObj = document.getElementById('closes');
        submitObj.style.display = 'block'
    }
    //点击确定
    sure() {
        this.setState({
            isToggleimg: true,
            default: '0',
        })
    }
    //常用车辆
    handleClick() {
        this.setState({
            loading: 'loading'
        })
        Fetch.post('/ch1/customer/existDefaultCar', {}).then(json => {
            if (json.code === '000000') {
                if (json.data === false) {
                    let submitObj = document.getElementById('closes');
                    submitObj.style.display = 'block'
                    this.setState({

                        Tip: '是否设置该车为常用车辆',
                        loading: ''

                    })
                    if (this.state.isToggleimg) {
                        this.setState({
                            isToggleimg: false,
                            default: '1',
                            loading: ''
                        })
                        submitObj.style.display = 'none'
                    }
                }
                if (json.data === true) {
                    let submitObj = document.getElementById('closes');
                    submitObj.style.display = 'block'
                    this.setState({
                        Tip: '常用车辆已存在，是否覆盖',
                        loading: ''
                    })
                    if (this.state.isToggleimg) {
                        this.setState({
                            isToggleimg: false,
                            default: '1',
                            loading: ''
                        })
                        submitObj.style.display = 'none'
                    }
                }
            }
        }).catch(e => {
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
    //新能源
    new() {
        this.setState(prevState => ({
            isToggleagree: !prevState.isToggleagree,
            simon: !prevState.simon,
        }),()=>{
            var chNum=[...this.state.num];
            chNum.splice(7,1)//移除第七个
            if(!this.state.simon&&this.state.num[0]!==""&&this.state.num[1]!==""&&this.state.num[2]!==""&&this.state.num[3]!==""&&this.state.num[4]!==""&&this.state.num[5]!==""){
                var numindex=6;
            }else if(this.state.simon&&this.state.num[1]!==""&&this.state.num[2]!==""&&this.state.num[3]!==""&&this.state.num[4]!==""&&this.state.num[5]!==""&&this.state.num[6]!==""&&this.state.num[0]!==""){
                var numindex=7;
            }else if(this.state.numindex!==7) {
                var numindex=this.state.numindex//回到当前光标
            }else if(this.state.numindex===7&&!this.state.simon){
                var numindex=6
            }
            this.setState({
                numindex:numindex,
                keyboard: 'keyboard',
                keynum:'keyboard  keyboard2 ',
            },()=>{
                //  console.log(this.state.numindex)
                var simwri = document.getElementById('simwri')
                var txts = simwri.getElementsByTagName("input");

                if(this.state.numindex>=0&&this.state.numindex!==""){
                    for(let i=0; i<txts.length; i++){
                        txts[i].style.borderColor="#999"
                    }
                    txts[this.state.numindex].style.borderColor="#1890FF"

                }else if(this.state.numindex===""){
                    this.setState({
                        keyboard: 'keyboard keyboard2',
                        keynum:'keyboard',
                        dim1:'sim-font border-active',
                    })
                }
            })
        });
        if (!this.state.isToggleagree) {
            this.setState({
                EnergyCar: "0"
            })
        } else {
            this.setState({
                EnergyCar: "1"
            })
        }
    }
    //同意协议
    agree() {
        this.setState(prevStates => ({
            isToggleagrees: !prevStates.isToggleagrees,
        }));

        if (!this.state.simon) {
            if ( !this.state.isToggleagrees) {
                this.setState({
                    wri: 'wri-btn wri-btn2',
                    bd: 'bd2'
                })
            } else {
                this.setState({
                    wri: 'wri-btn',
                    bd: 'bd'
                })
            }
        }
        if (this.state.simon) {

            if (!this.state.isToggleagrees) {
                this.setState({
                    wri: 'wri-btn wri-btn2',
                    bd: 'bd2'
                })
            } else {
                this.setState({
                    wri: 'wri-btn',
                    bd: 'bd'
                })
            }
        }
    }
    //确定绑定
    bdbtn() {
        const list = document.getElementsByTagName("input");
        if (this.input) {
            for (var j = 0; j < list.length; j++) {
                if (list[j].type === "text") {
                    if (list[j].value === "") {
                        alert("请将车牌号填写完整");
                        return false;
                    }
                }
            }
        }
        if (!this.state.isToggleagrees) {
            alert('请勾选协议');
            return
        } else {
            this.setState({
                loading:'loading'
            })
            var all_input = document.getElementsByTagName("input");
            var val = "";
            for (var i = 0; i < all_input.length; i++) {
                val += all_input[i].value;
            }
            Fetch.post('/ch1/customer/addCar', {
                carNo: val,
                isDefault: this.state.default,
                energyCar: this.state.EnergyCar
            }).then(json => {//成功
                if (json.code === '000000') {
                    this.setState({
                        divsuccess: 'block',
                        carname: val,
                        loading:''
                    })
                }
                if (json.code === '400006') {
                    alert(json.messages)
                    this.setState({
                        loading: '',
                    })
                }
            }).catch(e => {
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
    //循环车牌亏属地
    carName() {
        return (
            this.state.carlist.map((item, index) => {
                return (
                    <li key={index}  onClick={this.chooseName.bind(this,item,index) } >{item}</li>
                )
            })
        )
    }
//循环车牌号码
    carnum(){
        return (
            this.state.carnum.map((item, index) => {
                return (
                    <li key={index}  onClick={this.chooseNum.bind(this,item,index)} >{item}</li>
                )
            })
        )
    }
    shouldComponentUpdate(){
        return true
    }
    render() {
        return (
            <Fragment>

                <div className={this.state.error}></div>
                <div className={this.state.loading}></div>
                <div className="sim-num"><p>请填写需要结费的车牌号码</p>
                    <div className="sim-con">
                        <ul className="sim-wri" onChange={this.change}  id="simwri" >
                            <li ><input id="addname"  className={this.state.dim1} maxLength={1} value={ this.state.num[0] }
                                        onClick={this.choose} readOnly/></li>
                            <li ><input    onChange={this.onChange} value={this.state.num[1] }  className={this.state.dim} maxLength={1} ref={(input) => this.input = input}
                                           onClick={this.chooseHide.bind(this,1)} readOnly/></li>
                            <li ><input   value={this.state.num[2] } className={this.state.dim} maxLength={1} ref={(input2) => this.input2 = input2}
                                          onClick={this.chooseHide.bind(this,2)} readOnly/></li>
                            <li ><input  value={this.state.num[3] } className={this.state.dim} maxLength={1} ref={(input3) => this.input3 = input3}
                                         onClick={this.chooseHide.bind(this,3)} readOnly/></li>
                            <li ><input  value={this.state.num[4] } className={this.state.dim} maxLength={1} ref={(input4) => this.input4 = input4}
                                         onClick={this.chooseHide.bind(this,4)} readOnly/></li>
                            <li ><input  value={this.state.num[5] } className={this.state.dim} maxLength={1} ref={(input5) => this.input5 = input5}
                                         onClick={this.chooseHide.bind(this,5)} readOnly/></li>
                            <li ><input  value={this.state.num[6] } className={this.state.dim} maxLength={1} ref={(input6) => this.input6 = input6}
                                         onClick={this.chooseHide.bind(this,6)} readOnly/></li>

                            {this.state.simon ? <li id="simhide"><input   readOnly value={this.state.num[7]} className={this.state.dim} maxLength={1}
                                                                          ref={(input7) => this.input7 = input7}
                                                                          onClick={this.chooseHide.bind(this,7)} />
                            </li> : ""}
                        </ul>
                    </div>
                    <div className="wri-agree add-new">
                        <div className="read" onClick={this.new}>
                            <div className="wri-sure">
                                <div className="sure-img">{this.state.isToggleagree ?
                                    <img src={require("../../img/sure.png")} alt=""/> : ""}</div>
                            </div>
                            新能源车辆
                        </div>
                    </div>
                    <div className="usual-car usual-car2" onClick={this.handleClick}><span
                        className="wri-left">设为常用车辆</span><span className="wri-right">  {this.state.isToggleimg ?
                        <img src={require("../../img/gou.png")} alt=""/> : ''}</span></div>
                    <div className="wri-agree">
                        <div className="read" onClick={this.agree}>
                            <div className="wri-sure">
                                <div className="sure-img">{this.state.isToggleagrees ?
                                    <img src={require("../../img/sure.png")} alt=""/> : ""}</div>
                            </div>
                            已阅读并同意
                        </div>
                        <Link to="/wx/protocol">《相关条款》</Link>
                    </div>
                    <div className={this.state.wri}   onClick={this.bdbtn} ><span className={this.state.bd}>确认绑定</span>
                    </div>
                </div>
                {/*提示框*/}
                <div className={this.state.bframe} onClick={this.close} id='closes'>
                    <div className="bin-frame-con bin-frame-con2" onClick={this.open} id='tk'>
                        <p>{this.state.Tip}</p>

                        <div className="del-sure" onClick={this.sure} >确定</div>
                    </div>
                </div>

                <div style={{display: this.state.divsuccess}}>
                    <Success content={'已成功绑定车辆' + this.state.carname}/>
                </div>
                <ul className={this.state.keyboard}>
                    {this.carName()}
                    <li onClick={this.delname}><img src={require('../../img/delete.png')} alt=""   /></li>
                </ul>

                <ul className={this.state.keynum}>
                    {this.carnum()}
                    <li onClick={this.del}  ><img src={require('../../img/delete.png')} alt=""  /></li>
                </ul>
            </Fragment>
        )
    }
}

export default AddCar
