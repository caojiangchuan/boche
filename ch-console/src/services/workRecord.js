import request from '../utils/request';
import { stringify } from 'qs';

export async function queryMatchUser(params) {
    return request(`/mmb/workRecords/project/${params.projectId}?${stringify(params)}`);
}
export async function matchUser(params){
    return request('/mmb/workRecords/batch',{
        method:'POST',
        body: params
    })
}

export async function deleteWorkRecord(params){
    return request(`/mmb/workRecords/${params.id}`,{
        method: "DELETE",
        body:{}
    })
}