/**
 * Created by YM10213 on 2018/10/18.
import React from 'react'; */
import Fetch from './fetch.js';

const code =Fetch.GetQueryString('code')||0;
const state=Fetch.GetQueryString('state')||0;

let codeState={
    code:code,
    state:state
}

const getToken=(fun,pageNmae)=>{

    if(!Fetch.getToken()) {
        Fetch.get('/ch1/wx/portal/getToken',codeState
        ).then(json =>{
            if(json.code==='000000'){

                Fetch.setToken(json.data.token);

                //sessionStorage.savet= JSON.stringify(json.data);
                fun();
                if(json.data.status==='关注'){
                    window.location='/wx'
                }
            }else {
                alert(json.messages)
                // window.location='/'
            }

        }).catch(e=>{
          //  if(e.code==="999999"){
               // alert(e.messages)
                //window.location='/'
         //   }
            console.info(e);
        })
    }else if( pageNmae==='self' || pageNmae==='map' || pageNmae==='person'){

        fun()
    }
}
export default getToken;
