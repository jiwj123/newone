<template>
  <div>
    <router-view></router-view>
    <!-- 确认退出弹窗 -->
    <div class="exit-model" v-if="$store.state.app.exitModelShow">
      <div class="images">
        <img :src="PATH.fileServerPreName + 'B/CgUEPF_1WeWAIVVjAACh7moFTS8998.png'" alt="退出弹窗" />
        <!-- 按钮区域 -->
        <div class="btn-area d-flex">
          <div class="flex-1" @click="exit"></div>
          <div class="flex-1" @click="cancel"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ios_or_android } from '@/utils/iosOrAndroid'

export default {
  name: 'App',
  data() {
    return {
      nowTime: ''
    }
  },
  computed: {
    // websocket收到的消息
    getWsMsg() {
      return this.$store.state.app.wsMsg
    },
    // 福袋队列
    bagLists() {
      return this.$store.state.bag.bagLists
    },
    // 游戏开始时间
    gameStartTime() {
      return parseInt(this.$store.state.app.gameStartTime / 1000)
    },
    // 游戏结束时间
    gameEndTime() {
      return parseInt(this.$store.state.app.gameEndTime / 1000)
    },
    // 用户手机号
    tel() {
      return this.$store.state.app.tel
    },
    // ws连接状态
    wsReadyState() {
      return this.$store.state.app.wsReadyState
    }
  },
  watch: {
    // websocket收到的消息
    getWsMsg(val) {
      let data = val.data
      if (data.includes('Privelige')) {
        // 登录返回的信息
        this.judgeLoginSuccess(data)
      } else {
        // 其他信息（福袋、消息）
        this.processSocketMsg(data)
      }
    },
    bagLists: {
      handler(val) {
        console.log('福袋列表:', val)
      },
      deep: true
    },
    // 当前时间世纪秒
    async nowTime(val) {
      // console.log('当前时间', this.dayjs(val).format('YYYY-MM-DD HH:mm:ss'));
      val = parseInt(val / 1000)
      if (val >= this.gameStartTime && val <= this.gameEndTime) {
        this.$store.dispatch('app/setGameStart', true)
      } else {
        this.$store.dispatch('app/setGameStart', false)
      }
      // 发送消息
      if (val === this.gameStartTime) {
        // 游戏开始时
        // console.log('start')
        this.$store.dispatch('app/setGameStart', true)
        this.sendMsg('start')
      } else if (val === this.gameEndTime) {
        // 游戏结束时
        // console.log('end')
        this.$store.dispatch('app/setGameStart', false)
        this.sendMsg('end')
      }
    },
    $route(val) {
      console.log(val)
      if (val.query.phone) {
        this.$store.dispatch('app/setTel', val.query.phone)
      }
    },
    // 监听websocket状态
    wsReadyState(val) {
      console.log(val)
    },
    tel(val) {
      if (val) {
        this.$ws.wsOpen = this.onopen
        this.$ws.wsError = this.onerror
        this.$ws.initWebSocket()
      }
    }
  },
  created() {
    let nowTime = new Date().getTime()
    this.nowTime = nowTime
    setInterval(() => {
      this.nowTime += 1000
    }, 1000)
  },
  mounted() {
    document.body.className = 'theme-default'
  },
  methods: {
    //获取游戏主题及游戏时间
    async getLoginNews() {
      //获取游戏主题
      const resData = await this.API.QueryThemeInfoByType([
        {
          ID: 'THEMETYPENAME',
          SQLCondition: '福袋'
        }
      ])
      if (resData.data.QueryThemeInfoByTypeResult.length > 0) {
        const data = resData.data.QueryThemeInfoByTypeResult[0]
        this.$store.dispatch('app/setTHEMETYPEID', data.THEMETYPEID) //游戏主题
      }
      //获得福袋活动的开始、结束时间
      const resDataTime = await this.API.QueryThemeTypeInfoByCode([
        {
          ID: 'THEMETYPECODE',
          SQLCondition: '001'
        }
      ])
      if (resDataTime.data.QueryThemeTypeInfoByCodeResult.length > 0) {
        const dataTime = resDataTime.data.QueryThemeTypeInfoByCodeResult[0]
        this.$store.dispatch(
          'app/setGameStartTime',
          new Date(dataTime.THEMETYPESTARTTIME).getTime()
        ) //游戏开始时间
        this.$store.dispatch(
          'app/setGameEndTime',
          new Date(dataTime.THEMETYPEENDTIME).getTime()
        ) //游戏结束时间
        this.$store.dispatch(
          'app/setTHEMETYPEVALIDITYPERIOD',
          dataTime.THEMETYPEVALIDITYPERIOD
        ) //福袋过期时间
      }
    },
    // websocket连接成功
    onopen() {
      console.log('连接成功')
      this.$store.dispatch('app/setWsReadyState', true)
      this.login()
    },
    // 用户登录
    async login() {
      // const res = await this.API.getLoginInfo(
      //   JSON.stringify('LoginResponseDto')
      // )
      // let username = this.$store.state.app.tel // 用户名
      let username = this.$store.state.app.tel // 用户名
      let psd = '123' // 密码
      let dataStr = `{<${username}@${psd}@8008>}` // 用户名密码进行拼装 密码暂时先用默认密码123
      this.$ws.wsSend(dataStr)
      // this.$store.dispatch('app/showOverlayShow', '正在登录...')
    },
    // 判断是否登陆成功
    async judgeLoginSuccess(data) {
      let jsonValue = JSON.parse(data)
      if (jsonValue.ID == null) {
        if (jsonValue.Token != null) {
          if (jsonValue.UserName !== '*UserName*') {
            // 用户信息验证成功
            // this.$toast.success('登录成功')
            localStorage.setItem('Token', jsonValue.Token) // token
            // 获取用户信息
            this.getUserInfo()
            // 订阅群组及个人
            this.$ws.wsSend(this.$store.state.app.subscribeCommand)
            this.$ws.wsSend(this.$store.state.app.subscribeCommandOfUser)
            //获取游戏主题及游戏时间
            this.getLoginNews()
          } else {
            this.$toast.fail('用户名或密码错误')
          }
        }
      }
    },
    // 其他信息（福袋、消息）
    processSocketMsg(data) {
      let content = ''
      if (data.includes('CONTENT')) {
        content = JSON.parse(data).CONTENT
        if (content.includes('LUCKYBAGID')) {
          // 收到福袋
          this.$store.state.bag.bagLists.push(JSON.parse(content)) // 放入福袋队列中
        } else if (content.includes('MSGID')) {
          // 收到消息
          let type = ''
          let msg = JSON.parse(content)
          console.log('收到消息', msg)
          // if (
          //   !this.$store.state.msg.msgLists
          //     .map(i => i.MSGID)
          //     .includes(msg.MSGID)
          // ) {
          //   // 过滤掉已经存在的消息，防止重复展示
            if (msg.RECEIVER === this.$store.state.app.GROUPID) {
              // 群组
              type = '说说'
            } else if (msg.RECEIVER === this.$store.state.app.UserID) {
              // 个人（RECEIVER = 此用户的id）
              type = '@你'
            }
            if (this.$store.state.msg.msgLists.length === 0) {
              this.$store.state.msg.msgLists.push({
                type: type,
                from: [msg.RECEIVER, msg.USERNAME],
                detail: msg.MSGCONTENT,
                // MSGID: msg.MSGID
              })
            } else {
              if (
                this.$store.state.msg.msgLists.length >=
                this.$store.state.msg.msgMaxCount
              ) {
                this.$store.state.msg.msgLists.pop()
              }
              this.$store.state.msg.msgLists.unshift({
                type: type,
                from: [msg.RECEIVER, msg.USERNAME],
                detail: msg.MSGCONTENT,
                // MSGID: msg.MSGID
              })
            }
          }
        }
      // }
    },
    // 获取用户信息
    async getUserInfo() {
      const res = await this.API.getLoginInfo(
        JSON.stringify('LoginResponseDto')
      )
      if (res.status === 200) {
        this.$store.dispatch('app/setUserID', res.data.COUSTOMID) // 用户手机号
        this.$store.dispatch('app/setDESKUSERID', res.data.DESKUSERID) // 用户id
        this.$store.dispatch('app/setUserName', res.data.COUSTOMNAME) // 用户名
        // 订阅群组
        this.$ws.wsSend(this.$store.state.app.subscribeCommand)
      } else {
        this.$toast.fail('用户名或密码错误')
      }
    },
    // 发送游戏开始结束通知消息
    async sendMsg(type) {
      let MSGCONTENT = ''
      if (type === 'start') {
        MSGCONTENT = '游戏开始啦，快来发福袋吧'
      } else if (type === 'end') {
        MSGCONTENT = '游戏结束啦，明年再见吧'
      }
      if (this.$store.state.msg.msgLists.length === 0) {
        this.$store.state.msg.msgLists.push({
          type: '通知',
          from: '',
          detail: MSGCONTENT
        })
      } else {
        if (
          this.$store.state.msg.msgLists.length >=
          this.$store.state.msg.msgMaxCount
        ) {
          this.$store.state.msg.msgLists.pop()
        }
        this.$store.state.msg.msgLists.unshift({
          type: '通知',
          from: '',
          detail: MSGCONTENT
        })
      }
    },
    // 残忍退出
    exit() {
      console.log('退出')
      this.$store.dispatch('app/setExitModelShow', false)
      this.sendMsgToApp()
    },
    sendMsgToApp() {
      console.log('与app交互')
      let flagStr = 'luckybag'
      let userAgent = ios_or_android()
      console.log('当前环境：', userAgent)
      if (userAgent === 'ios') {
        // 与IOS传递数据
        window.webkit.messageHandlers.haveParamsFunction.postMessage({
          goodsId: flagStr
        })
      } else {
        // 与ANDROID传递数据
        window.android.haveParamsFunction(flagStr)
      }
    },
    // 取消
    cancel() {
      this.$store.dispatch('app/setExitModelShow', false)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
}
.exit-model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 25;
  background: rgba(0, 0, 0, 0.8);
  .images {
    position: relative;
    top: 30%;
    width: 298px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
    .btn-area {
      position: absolute;
      bottom: 30px;
      height: 50px;
      width: 245px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
