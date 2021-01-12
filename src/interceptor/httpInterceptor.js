/**
 * axios接口实例和拦截
 */
import axios from 'axios'
import store from '../store'
import router from '../router'
import BASE64 from '../utils/base64'

import { Toast } from 'vant'
// 将所有 loading Toast 设置为背景不可点击
Toast.setDefaultOptions('loading', { forbidClick: true })

// 跳转登录页
const toLogin = () => {
  if (router.currentRoute.path.indexOf('/login') > -1) {
    return false
  } else {
    router.push('/login')
  }
}

// 创建axios 实例
var service = axios.create({ timeout: 10000 })

// 状态码判断
const errorHandle = status => {
  switch (status) {
    case 401:
      Toast.fail('401错误')
      break
    // case 412:
    //   Toast.fail('登录过期， 请重新登录')
    //   window.sessionStorage.removeItem('token')
    //   toLogin()
    //   break
    // 404请求不存在
    case 404:
      Toast.fail('404错误，请求的资源不存在')
      break
    case 500:
      Toast.fail('500错误，服务器内部错误')
      break
    default:
      Toast.fail('服务器错误')
      break
  }
}

// 请求拦截器:
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('Token') // token
    if (!token) {
      if (!router.currentRoute.path.includes('login')) {
        Toast.fail('用户信息失效，请重新登录')
        toLogin() // 跳转登录页
        return
      }
    } else {
      config.headers['Content-Type'] = 'application/json' // 设置请求头
      // 设置token
      config.headers.SOAPAction = token
      return config
    }
  },
  error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  // success
  res => {
    // 将vuex里的信息保存到sessionStorage里
    localStorage.setItem(
      BASE64.encode('store'),
      BASE64.encode(JSON.stringify(store.state))
    )
    return res
  },
  error => {
    if (localStorage.getItem('Token')) {
      if (error.message.includes('timeout')) {
        console.log('请求超时')
        Toast.fail('请求超时')
      } else {
        console.log('请求错误')
        if (error.response && error.response.status) {
          errorHandle(error.response.status)
        } else {
          Toast.fail('请求错误')
        }
      }
      return Promise.reject(error)
    }
  }
)

export default service
