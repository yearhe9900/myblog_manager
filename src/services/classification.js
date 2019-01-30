import request from '@/utils/request';

export async function queryClassificationList(params) {
  return request('/api/Classification/GetClassificationList', {
    method: 'POST',
    body: params,
  });
}

export async function updateClassification(params) {
  return request('/api/Classification/EditClassification', {
    method: 'POST',
    body: params,
  });
}

export async function addClassification(params) {
  return request('/api/Classification/AddClassification', {
    method: 'POST',
    body: params,
  });
}

export async function getEnabledClassificationList() {
  return request('/api/values/GetEnabledClassificationList', {
    method: 'POST',
  });
}