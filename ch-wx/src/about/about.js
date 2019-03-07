import React,{Component,Fragment} from 'react';
import './about.css';
import { Link} from 'react-router-dom';

class About extends Component{
    constructor(props){
        super(props);
        this.state={

        }
        document.title="关于我们";

    };
    render(){
        return(
            <Fragment>
                <div className="about-head">
                    <div className="about-logo"><img src={require('../img/boche.png')} alt=""/></div>
                    <p className="about-name">智慧泊车</p>
                    <p className="about-vsi">V1.0</p>
                </div>
                    <ul className="about">
                        <Link to="/wx/help"> <li ><span  className="left">使用帮助</span><span className="ab-right"><img src={require('../img/right.jpg')} alt="" /></span></li></Link>
                        <Link to="/wx/protocol"><li ><span className="left">用户协议</span><span className="ab-right">  <img src={require('../img/right.jpg')} alt="" /> </span></li></Link>
                        <Link to="/wx/law"><li ><span className="left">相关法律与隐私政策</span><span className="ab-right">  <img src={require('../img/right.jpg')} alt="" /> </span></li></Link>
                    </ul>

            </Fragment>
        );
    }}
export default About;
