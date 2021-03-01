import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['x-auth-token'] = getToken()

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    const res = response.data

    return res
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
