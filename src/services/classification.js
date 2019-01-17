import request from '@/utils/request';

export async function queryClassificationList(params) {
  return request('/api/Classification/GetClassificationList', {
    method: 'post',
    body: params,
  });
}

export async function aaa() {
    return request('/api/Classification/GetClassificationList');
  }