/**
 * 路由配置
 */

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/main/home',
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require([`@/views/login.vue`], resolve),
  },
  {
    path: '/main',
    name: 'main',
    component: resolve => require(['@/views/main.vue'], resolve),
    redirect: '/main/home',
    children: [
      // 游戏首页
      {
        path: '/main/home',
        name: 'main/home',
        component: resolve => require(['@/views/home/index.vue'], resolve)
      },
      // 发福袋
      {
        path: '/main/send-bag',
        name: 'main/send-bag',
        component: resolve => require(['@/views/send-bag/index.vue'], resolve)
      },
      // 我的福金
      {
        path: '/main/my-fujin',
        name: 'main/my-fujin',
        component: resolve => require(['@/views/my-fujin/index.vue'], resolve)
      }
    ]
  },
  // {
  //   path: '/distributeLuckyBag',
  //   name: 'distributeLuckyBag',
  //   component: resolve => require(['@/views/distributeLuckyBag/index.vue'], resolve),
  //   redirect: '/distributeLuckyBag',
  //   children: [
  //     {
  //       path: '/distributeLuckyBag',
  //       name: 'distributeLuckyBag',
  //       component: resolve => require(['@/views/distributeLuckyBag/index.vue'], resolve)
  //     }
  //   ]
  // },
  // {
  //   path: '/luckyMoneyList',
  //   name: 'luckyMoneyList',
  //   component: resolve => require(['@/views/luckyMoneyList/index.vue'], resolve),
  //   redirect: '/luckyMoneyList',
  //   children: [
  //     {
  //       path: '/luckyMoneyList',
  //       name: 'luckyMoneyList',
  //       component: resolve => require(['@/views/luckyMoneyList/index.vue'], resolve)
  //     }
  //   ]
  // },
  // 错误页面
  {
    path: '/404',
    name: '404',
    component: resolve => require(['@/views/404.vue'], resolve),
    meta: { title: '404' }
  },
  {
    path: '*',
    redirect: '/404'
  }
]
export default routes
