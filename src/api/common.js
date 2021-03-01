import request from '@/utils/request'
import qs from 'qs'

// post传参  不处理数据
export function getList(data,url) {
  return request({
    url: url,
    method: 'post',
    data
  })
}


// post传参  处理数据
export function getLists(data,url) {
  return request({
    url: url,
    method: 'post',
    data,
    transformRequest: request.transformRequest
  })
}
