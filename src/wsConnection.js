import store from './store'
// import { Toast } from 'vant'
import path from './api/path'

let wsConnection = {
  $ws: null,
  lockReturn: false,
  timeout: 60 * 1000 * 5,
  timeoutObj: null,
  timeoutNum: null,
  serverTimeoutObj: null,
  // 初始化webSocket长连接
  initWebSocket: function() {
    // store.dispatch('app/showOverlayShow', '连接服务器...')
    this.$ws = new WebSocket(path.wsUrl) // 写入地址 这里的地址可以在initWebSocket方法加入参数
    this.$ws.onopen = this.wsOpen
    this.$ws.onclose = this.wsClose
    this.$ws.onmessage = this.wsMsg
    this.$ws.onerror = this.wsError
  },
  // 打开websocket
  wsOpen: function() {
    // 开始websocket心跳
    console.log('ws success')
    // Toast.success('服务器连接成功')
    wsConnection.startWsHeartbeat()
  },
  wsSend: function(data) {
    wsConnection.$ws.send(data)
  },
  wsClose: function() {
    wsConnection.$ws.close()
    // Toast.fail({
    //   message: '服务已断开',
    //   duration: 0
    // })
    console.log('ws close')
    store.dispatch('app/setWsReadyState', false)
    wsConnection.reconnect() // 重连websocket
  },
  wsMsg: function(e) {
    // 每次接收到服务端消息后 重置websocket心跳
    wsConnection.resetHeartbeat()
    // 服务端发送来的消息存到vuex
    store.dispatch('app/setWsMsg', e)
  },
  wsError: function(err) {
    wsConnection.$ws.close()
    console.log(err, 'ws error')
    store.dispatch('app/setWsReadyState', false)
    wsConnection.reconnect() // 重连websocket
  },
  // 重启websocket
  reconnect: function() {
    let _this = this
    if (_this.lockReturn) {
      return
    }
    _this.lockReturn = true
    _this.timeoutNum && clearTimeout(_this.timeoutNum)
    _this.timeoutNum = setTimeout(function() {
      _this.initWebSocket()
      _this.lockReturn = false
    }, 3000)
  },
  startWsHeartbeat: function() {
    let _this = this
    _this.timeoutObj && clearTimeout(_this.timeoutObj)
    _this.serverTimeoutObj && clearTimeout(_this.serverTimeoutObj)
    _this.timeoutObj = setInterval(function() {
      // 判断websocket当前状态
      if (_this.$ws.readyState != 1) {
        _this.reconnect()
      }
    }, _this.timeout)
  },
  // 重置websocket心跳
  resetHeartbeat: function() {
    let _this = this
    clearTimeout(_this.timeoutObj)
    clearTimeout(_this.serverTimeoutObj)
    _this.startWsHeartbeat()
  }
}

// 抛出websocket对象
export default wsConnection
