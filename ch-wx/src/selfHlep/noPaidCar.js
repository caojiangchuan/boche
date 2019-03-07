import React,{Component,Fragment} from 'react';
import './noPaidCar.css'

class NoPaidCar extends Component{
    constructor(props) {
        super(props);
        this.state={

        }
        document.title="自助结费";
    }
  render(){
        return(
            <Fragment>

                <p className="no-car">暂无需要结费的车辆</p>
               <div className="no-img"><img src={require('./../img/nopaidcar.png')} alt=""/></div>

            </Fragment>
        )
  }

}
export default NoPaidCar
