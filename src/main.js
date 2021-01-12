import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api'
import path from './api/path'

import wsConnection from './wsConnection'

import { uuid } from '@/utils/UUID'
import dayjs from 'dayjs'

import 'babel-polyfill'
// 导入默认样式文件
import '@/assets/scss/style.scss'

import Vant from 'vant'
import 'vant/lib/index.css'
// 重写vant样式
import '@/assets/scss/vant-ui.scss';

// 引入vconsole移动端控制台，方便调试
// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()
// Vue.use(vConsole)
Vue.use(Vant)

// 挂载vue原型链
Vue.prototype.API = api
Vue.prototype.PATH = path
Vue.prototype.$ws = wsConnection
Vue.prototype.UUID = uuid
Vue.prototype.dayjs = dayjs

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
