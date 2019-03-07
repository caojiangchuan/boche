import React,{Component,Fragment} from 'react';
import { Link} from 'react-router-dom';
import './register.css';

class Success extends Component{
    constructor(props){
        super(props);
        this.state = {
            index:'/wx/person',
            judge:'',
            back:'返回首页'
        };

    };
    componentDidMount(){

        const searchUrl = window.location.href;
        const searchData = searchUrl.split("?");        //截取 url中的“?”,获得“?”后面的参数
        const searchText = decodeURI(searchData[1]);
        this.state.judge=searchText
        if(this.state.judge==="nocard"){
            this.setState({
                index: '/wx/self',
                back:'返回自助结费'
            })
        }
    }

    render(){
        const { content } = this.props;
        const { success } = this.props;

        return(
            <Fragment>
                <div className="register_suc">
                    <img src={require('./suc.jpg')} className="rsc_img" alt=""/>
                    <p className="rsc_p1">{success}</p>
                    <p className="rsc_p2">{content}</p>
                    <Link to={this.state.index}><button className="goIndex">{this.state.back}</button></Link>
                </div>
            </Fragment>
        );
    }

}
export default Success;



