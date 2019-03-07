import request from '../utils/request';
import { stringify } from 'qs';

export async function query(params) {
  return request(`/mmb/projects?${stringify(params)}`);
}

export async function add(params) {
  return request('/mmb/projects', {
    method: 'POST',
    body: params,
  });
}
export async function addAddress(params){
  return request('/mmb/projects/address/batch',{
    method:'POST',
    body: params
  })
}
export async function addTimeSlot(params){
  return request('/mmb/projects/timeSlot/batch',{
    method: 'POST',
    body: params
  })
}
export async function loadProjectAddress(projectId){
  return request(`/mmb/projects/${projectId}/address`)
}
export async function loadProjectTimeSlot(projectId){
  return request(`/mmb/projects/${projectId}/timeSlot`)
}

export async function deleteProjectAddress(id) {
  return request(`/mmb/projects/address/${id}`,{
    method: 'DELETE',
    body:{id:id}
  })
}
export async function deleteProjectTimeSlot(id) {
  return request(`/mmb/projects/timeSlot/${id}`,{
    method: 'DELETE',
    body:{id:id}
  })
}