import React from 'react';
import Dropzone from 'react-dropzone';
import './imgUpload.css';
import Fetch from "../fetch/fetch";

class ImgUpload extends React.Component<any,any> {
    constructor(){
        super()
        this.state = {
            //显示图片
            accepted: [],
            rejected: [],
            previewUrl:'',
            igp_preview:false,
            imgClickIndex:'',
            imgUpaddShow:true,
            serverImgUrl:[],
            httpImg:'http://park.cenhotec.com:8000'   //图片服务器地址
        }
        this.previewImg=this.previewImg.bind(this);
        this.hidePreview=this.hidePreview.bind(this);
        this.deleteImg=this.deleteImg.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.accepted){
        console.log(nextProps)
        //判断是否有默认图片
        this.setState({
            accepted: nextProps.accepted.split(','),
            serverImgUrl: nextProps.accepted.split(',')
        },()=>{

            if(this.state.accepted.length>=3){
                this.setState({
                    imgUpaddShow: false
                });
            }
        })
        }
    }
    componentDidMount(){

    }


    //设置默认的props
    static defaultProps = {
        fileSize : 2000,

    };

     drop(src : any) : any{
        const that = this;
        let img = src;
        let image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = img;
        image.onload = function(){
            let base64 = that.getBase64Image(image);
            let imger=that.dataURLtoBlob(base64);
            //that.upLoadImg({imgData:base64})
        }
    }
    //转base64
     getBase64Image(img :any) : string {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        let ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        let dataURL = canvas.toDataURL("image/"+ext);
        return dataURL;
    }
    //  async upLoadImg(params : object) : Promise<any>{
    //     let res  = await axios.post('http://localhost:3000/upLoadImg',params);
    //
    // }
    //预览
    previewImg(index){
        const accepted=[...this.state.accepted];
        this.setState({
            igp_preview: !this.state.igp_preview,
            previewUrl:accepted[index].preview || this.state.httpImg+accepted[index] ,
            imgClickIndex:index
        })
        // accepted.splice(index, 1);
        // this.setState({
        //     accepted
        // })
    }
    //隐藏预览
    hidePreview(){
        this.setState({
            igp_preview: !this.state.igp_preview,
        })
    }
    //删除图片
    deleteImg(index){

        const accepted=[...this.state.accepted];
        const serverImgUrl=[...this.state.serverImgUrl];
        accepted.splice(index, 1);
        serverImgUrl.splice(index, 1);
        this.setState({
            accepted,serverImgUrl
        }, ()=> {
            console.log('accepted-删除:'+this.state.accepted)
            if(this.state.accepted.length<3){
                this.setState({
                    imgUpaddShow: true
                });
            }
        })

    }

    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    }


    render(){
        let imgs;
        if(this.state.accepted.length > 0){
            imgs = (
                <ul id="list">
                    {this.state.accepted.map( (f,index) => {
                        if(index<3){
                            return <li key={index}><img  src={f.preview || this.state.httpImg+f }  onClick={ ()=>this.previewImg(index) } alt="" /></li>
                        }else{
                            return '';
                        }
                    })}
                </ul>
            )
        }

        return (
            <div>
                <div className="">

                </div>
                <div className="wrap clearfix">
                    <div className="imgUp_show">{imgs}</div>
                    <Dropzone
                        multiple={false}
                        accept="image/jpeg, image/png"
                        onDrop={(inputValue, rejected) => {

                        if(rejected[0]){
                            alert('仅支持jpg,jpeg,png等格式的图片上传');
                            return
                        }
                        if(inputValue[0]){
                            if( (inputValue[0].type!=='image/jpeg' && inputValue[0].type!=='image/jpg' && inputValue[0].type!=='image/png' )){
                                alert('仅支持jpg,jpeg,png等格式的图片上传');
                                return
                            }
                        }

                        if(this.state.accepted.length===2){
                                this.setState({
                                    imgUpaddShow: false
                                });
                        }else{
                            this.setState({
                                 imgUpaddShow: true
                            });
                        }
                        if(this.state.accepted.length<3){

                            let size = Math.floor(inputValue[0].size/1024);
                            if(size> this.props.fileSize) {
                                alert("上传文件不得超过"+(this.props.fileSize/1000)+"M!");
                                return false;
                            };
                            this.setState({
                           //     accepted:[ ...this.state.accepted, ...inputValue ],
                                rejected
                            });

                            let formData= new FormData();
                            formData.append('files',inputValue[0]);
                      //      let imger=this.dataURLtoBlob()
                             Fetch.uploadImage( this.state.httpImg+'/file/v1/tmp/upload',formData).then(json=>{
                                        console.log( 'accepted-添加前：'+ this.state.accepted)
                                        if(json.success===true){
                                            this.setState({
                                         //    serverImgUrl:[...this.state.serverImgUrl,json.data],
                                           accepted:[...this.state.accepted,json.data]
                                            },()=>{
                                            console.log( 'accepted-添加后传值：'+ this.state.accepted)
                                                 this.props.onChoose(this.state.accepted);
                                            })
                                        }
                                    }).catch(e=>{

                             })
                        }else {
                            alert('最多只能选择三张图片哦！')
                        }
                            this.drop(inputValue[0].preview)
                        }}
                        className="imgUpadd"
                        id={ this.state.imgUpaddShow ? "" : "displayNone" }
                    >
                        <p className="upload"></p>
                    </Dropzone>
                    <div className="igp_preview" id={ this.state.igp_preview ? "" : "displayNone" } onClick={this.hidePreview}>
                        <img src={this.state.previewUrl} className="igp_pw_img" alt="" />
                        <img src={require('../img/del.png')} className="igp_pw_del" onClick={()=>this.deleteImg( this.state.imgClickIndex)}  alt=""/>
                    </div>

                </div>

            </div>

        )
    }

}
export default ImgUpload;
