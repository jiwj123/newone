// import { uuid } from './UUID'
// 自定义base64
let Base64 = require('js-base64').Base64 // 引入base64

let secret = 'lucky-bag' // 标识字

// 加密
const encode = params => Base64.encode(secret + params)
// 解密
const decode = params => Base64.decode(params).substr(5)

export default {
  encode,
  decode
}
