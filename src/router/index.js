import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

// 解决多次点击同个路由报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const createRouter = () =>
  new Router({
    base: '/luckybag/', // 这里要和服务器上父级目录名称一致
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
const newRouter = createRouter()
router.matcher = newRouter.matcher // reset router

// 路由拦截
router.beforeEach((to, from, next) => {
  next()
})

export default router
