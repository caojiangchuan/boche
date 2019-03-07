import  'whatwg-fetch'


const DEFAULT_HEADERS = {'Content-Type': 'application/json'};
const TOKEN_KEY = 'Authorization'
const Fetch = {
    get(url,params){
        let urlParams = '';
        for(let key in params) {
            if(urlParams){
                urlParams = urlParams.concat('&');
            }
            if(params[key].toString().length>0){
                urlParams = urlParams.concat(key,'=',params[key]);
            }
        }
        return this.doFetch(url+'?'+urlParams,{},'get');
    },
    create(url,params){
        return this.doFetch(url,params,'post');
    },
    post(url,params){
        return this.doFetch(url,params,'post');
    },
    update(url,params){
        return this.doFetch(url,params,'PATCH');
    },
    delete(url){
        return this.doFetch(url,{},'delete');
    },
    setRequestToken(headers){
        headers[TOKEN_KEY] = this.getToken();
        return headers;
    },
    setToken(token){
            sessionStorage.setItem(TOKEN_KEY,token);
    },
    getToken(){
        return sessionStorage.getItem(TOKEN_KEY);
    },
    login(params){
        return this.doFetch('/login',params,'post');
    },
    logout (){
        return this.doFetch('/logout',{},'post');
    },
    async uploadImage(url,body){
        let headers = {}
        let token = await this.getToken();
        if(token){
            headers[TOKEN_KEY] = token;
        }
        return fetch(url, {
            method: 'post',
            headers: headers,
            body:body
        }).then(response => {
            console.info(response);
            if(response.ok){
                return response.json();
            }else if(response.status === 401){
                return Promise.reject({status:response.status})
            }else{
            }
        });
    },
    doFetch(url,params,method){
        url = encodeURI(url);
        let headers = DEFAULT_HEADERS;
        headers = this.setRequestToken(headers);
        let body;
        if(method === 'post' || method === 'put'||method==='PATCH') {
            body = JSON.stringify(params);
        }
        return fetch(url, {
            method: method,
            headers: headers,
            body:body
        }).then(response => {
            if(response.ok){
                return response.json();
            }
            // else if(response.status === 401){
            //     // if(url==='/login'){
            //     //     return response.json();
            //     // }else{
            //     //     window.location.href = '/login'
            //     // }
            // }
        });
    },
    GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return (r[2]); return null;
    }
}
export default Fetch;
