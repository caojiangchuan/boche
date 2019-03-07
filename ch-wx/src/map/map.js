import React, { Component } from 'react';
import {Map, Marker,DrivingRoute} from 'react-bmap';
import { Link} from 'react-router-dom';
import  './map.css';
import park from '../img/park.png';
import Fetch from '../fetch/fetch.js';
import GetToken from '../fetch/getToken';

// , NavigationControl, InfoWindow,MapTypeControl,ScaleControl,OverviewMapControl,MarkerList,
class Map2 extends Component {
    constructor(props) {
        super(props);
        document.title = '附近停车位';
        this.state = {
            //模拟数据
            markerData: [],
            tmap:'',
            inputValue: 0,
            endL:'',
            myPosition:{
                lng: 121.56550385306,// r.point.lng,
                lat:31.233779664837// r.point.lat
            },
            myIcon:{},
            myLb:{},
            range:null,     //两点距离

        };

        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.getPark = this.getPark.bind(this);
       // this.click = this.click.bind(this);
    }

    getPark(){
        const  _this=this;
        // alert( typeof  this.state.markerData)
        Fetch.post('/ch1/park',{
            lng:this.state.myPosition.lng,
            lat:this.state.myPosition.lat,
        }).then(json=>{
            _this.setState({
                markerData:json.list
            })
        }).catch(e=>{
            this.setState({
                loading: 'loading'
            })
            setInterval(
                () => this.tick(),
                10000
            );
        })
    }
    componentDidMount(){

        const _this=this;
        const map=this.map.map;
        const BMap=window.BMap;

        let iconUrl= new BMap.Icon( park , new BMap.Size(36, 36), {
            imageOffset: new BMap.Size(0, 0),
            anchor: new BMap.Size(18, 22),
            imageSize: new BMap.Size(36,36)
        })

        this.setState({
            icoonUrl:iconUrl
        })
        //转换成百度坐标
        // const x = 121.56502;
        // const y = 31.234281;
        // const ggPoint = new BMap.Point(x,y);
        //
        // const  translateCallback = function (data){
        //     if(data.status === 0) {
        //         var marker = new BMap.Marker(data.points[0]);
        //         map.addOverlay(marker);
        //         var label = new BMap.Label("转换后的百度坐标（正确）",{offset:new BMap.Size(20,-10)});
        //         label.setStyle({
        //             fontSize : "24px",
        //         });
        //
        //         marker.setLabel(label); //添加百度label
        //         map.setCenter(data.points[0]);
        //     }
        // }

        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            // alert(this.getStatus())
            if(this.getStatus() === 0){
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
               // alert('您的位置：'+r.point.lng+','+r.point.lat);
                _this.setState({
                    myPosition:{
                        lng: r.point.lng,// 121.56550385306,// r.point.lng,
                        lat: r.point.lat // 31.233779664837// r.point.lat
                    }
                },()=>{
                    //获取token
                    GetToken(_this.getPark,'map');
                })
            }
            else {
               // alert('failed'+this.getStatus());
            }
        },{enableHighAccuracy: true,maximumAge:0})

        // setTimeout(function(){
        //     var convertor = new BMap.Convertor();
        //     var pointArr = [];
        //     pointArr.push(ggPoint);
        //     convertor.translate(pointArr, 1, 5, translateCallback)
        // }, 1000);


    }

    getTodoListItem() {
        return (
            this.state.markerData.map((item, index) => {
            //    console.log(item.lng)
              //  console.log(item.lat)
                return (
                    <Marker
                        enableMassClear={false}
                        key={index}
                        position={{ lng : item.lng, lat:  item.lat}}
                        icon={this.state.icoonUrl}
                        events={{
                            click:this.handleButtonClick
                        }}
                    />

                )
            })
        )
    }
    //点击P 导航
    handleButtonClick(e) {
       // console.log(e)
        const  _e=e;
        this.setState({
            inputValue:1,
            endL:e.target.point
        })

        const _this=this;
        const map=this.map.map;
        const BMap=window.BMap;

        map.clearOverlays()

        let pointA = new BMap.Point(this.state.myPosition.lng ,this.state.myPosition.lat);

        let pointB = new BMap.Point(this.state.endL.lng,this.state.endL.lat);  // 创建点坐标B--

        var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
        driving.search(pointA, pointB);
        driving.setSearchCompleteCallback(function(e){
            console.log(e)

            _this.setState({
                range:( e.taxiFare.distance /1000).toFixed(1)
            },()=>{
                var myLabel = new BMap.Label("<a style='color:'#333';text-decoration:none' target='_blank' href='#'>距离："+ _this.state.range +"公里</a>",     //为lable填写内容   空闲泊位：2个
                    {offset:new BMap.Size(-130,-80),                  //label的偏移量，为了让label的中心显示在点上
                        position:_e.target.point});                                //label的位置
                myLabel.setStyle({                                   //给label设置样式
                    color:"#333",
                    fontSize:"24px",               //字号
                    border:"0",                    //边
                    height:"40px",                //高度
                    width:"260px",                 //宽
                    textAlign:"center",            //文字水平居中显示
                    lineHeight:"40px",            //行高，文字垂直居中显示
                    background:"#ffffff",    //背景图片
                    cursor:"pointer",
                    borderRadius:"15px"
                });
                myLabel.setTitle("");               //为label添加鼠标提示
                map.addOverlay(myLabel);
            })

        })


    }

    // click(st,ed){
    //     if(this.state.inputValue===1){
    //         return(
    //             <DrivingRoute  start={{lng: this.state.myPosition.lng, lat: this.state.myPosition.lat}} end={this.state.endL}/>
    //         )
    //     }
    // }
    render() {
        return (
            <div>

            <Map  ref={ref => this.map = ref }
                style={{height:'100%',width:750,position:'absolute'}}
                center={{lng: this.state.myPosition.lng, lat: this.state.myPosition.lat}} zoom="17" enableScrollWheelZoom={true} enableMapClick={true} enableClicking={true}
            >
                {this.getTodoListItem()}
            </Map>
                <Link  to='/wx/person'>
                    <div className="map_goperson">
                        <div className="map_goson_con">

                        </div>

                    </div>
                </Link>
            </div>
        );
    }
}
export default Map2;







