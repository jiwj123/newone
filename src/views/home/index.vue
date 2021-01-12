<template>
  <div class="home w-100 h-100">
    <!-- 轮播图 -->
    <van-swipe
      class="my-swipe"
      ref="swipe"
      :autoplay="6000"
      :touchable="true"
      indicator-color="white"
      :style="{
        backgroundImage: 'url(' + PATH.fileServerPreName + 'C/CgUEPF_1WeeAeUGgAAXGdkumqHI338.png)'
      }"
    >
      <van-swipe-item v-for="(item, index) in pics" :key="index" class="w-100">
        <img
          style="height: 350px; width: 100%"
          :src="item.src"
          :alt="`图片${index + 1}`"
        />
      </van-swipe-item>
    </van-swipe>
    <!-- 底部背景图 -->
    <div
      class="footer"
      v-if="!sayShow"
      :style="{
        height: footerHei,
        backgroundImage: 'url(' + PATH.fileServerPreName + 'B/CgUEPF_1WeSAYBdlAADbiumy428094.png)'
      }"
    ></div>
    <!-- 底部消息区域和按钮区域 -->
    <!-- 弹幕消息列表 -->
    <div
      class="msg-lists flex-1 mb-2"
      :style="{ height: msgListsHei }"
      v-if="!bagShow"
    >
      <bullet-chat v-if="msgLists.length > 0" v-model="msgLists"></bullet-chat>
    </div>
    <!-- 底部按钮 -->
    <div class="footer-btn jc-between" v-if="!sayShow">
      <div class="image" style="flex: 10">
        <img
          :src="PATH.fileServerPreName + 'B/CgUEPF_1WeaAcPmDAAAXvGIIVqs782.png'"
          alt=""
          @click="saySome"
        />
      </div>
      <div class="image" style="flex: 13">
        <img
          :src="PATH.fileServerPreName + 'B/CgUEPF_1WeaAWjPOAAAaDyNGKvg794.png'"
          alt=""
          @click="myFujin"
        />
      </div>
      <div class="image" style="flex: 10; position: relative">
        <img
          :src="PATH.fileServerPreName + 'B/CgUEPF_1WeeAH2XRAAAZKjG_Z3Q485.png'"
          v-if="gameStart"
          alt=""
          @click="sendBag"
        />
        <img
          :src="PATH.fileServerPreName + 'B/CgUEPF_1WeeAZ5MwAAAYlH84LSk795.png'"
          v-else
          alt=""
          @click="sendBag"
        />
        <div class="time ai-center jc-center">
          <game-time :center="false"></game-time>
        </div>
      </div>
    </div>
    <!-- 拆福袋页面组件 -->
    <open-bag v-model="bagShow" :data="bagData"></open-bag>
    <!-- 说点什么input框 -->
    <say ref="say" v-model="sayShow"></say>
  </div>
</template>

<script>
import openBag from '@/components/open-bag'
import bulletChat from '@/components/bullet-chat'
import Say from '@/components/say'
import gameTime from '@/components/game-time'
export default {
  components: { openBag, bulletChat, Say, gameTime },
  data() {
    return {
      pics: [
        // { src: require('@/assets/images/pic1.png') },
        // { src: require('@/assets/images/pic2.png') },
        // { src: require('@/assets/images/pic3.png') }
        { src: `${this.PATH.fileServerPreName}B/CgUEPF_1WeaAPkV7AAWcCOGIm9c309.png` },
        { src: `${this.PATH.fileServerPreName}B/CgUEPF_1WeaAbbNQAAVwpaL0gcQ303.png` },
        { src: `${this.PATH.fileServerPreName}B/CgUEPF_1WeaAOGe8AAS2YpJSsLY663.png` }
      ],
      bagShow: false,
      sayShow: false,
      footerHei: '',
      msgListsHei: '',
      nowTime: '', // 当前时间世纪秒
      bagData: {} // 要传给拆福袋组件的bag信息
    }
  },
  computed: {
    // 游戏是否开始
    gameStart() {
      return this.$store.state.app.gameStart
    },
    // 消息列表
    msgLists() {
      return this.$store.state.msg.msgLists
    },
    // 福袋队列
    bagLists() {
      return this.$store.state.bag.bagLists
    },
    showPopover() {
      return !this.$store.state.app.gameStart
    }
  },
  watch: {
    bagLists: {
      handler(val) {
        this.$store.dispatch('bag/setBagLists', val)
        if (val.length > 0 && this.bagShow === false) {
          this.chooseOneLuckyBag()
        }
      },
      deep: true
    }
  },
  // 离开当前路由进行的操作
  beforeRouteLeave(to, from, next) {
    if (to.path === '/main/my-fujin' || to.path === '/main/send-bag') {
      next()
    } else {
      if (this.$store.state.app.exitModelShow) {
        this.$store.dispatch('app/setExitModelShow', false)
      } else {
        this.$store.dispatch('app/setExitModelShow', true)
      }
      next(false)
    }
  },
  created() {
    if (this.bagLists.length > 0) {
      this.chooseOneLuckyBag()
    }
  },
  mounted() {
    let windowHei = window.innerHeight // 浏览器窗口高度
    let topbarHei = 46 // 顶部导航条高度
    let footBtnHei = 67 // 底部按钮区域高度
    let swipeHei = this.$refs.swipe.computedHeight // 轮播图高度
    // 底部按钮高度
    let footerHei = windowHei - topbarHei - swipeHei - 5
    this.footerHei = footerHei + 'px'
    this.msgListsHei = footerHei - footBtnHei + 'px'
  },
  methods: {
    showOpenBagComp() {
      this.bagShow = !this.bagShow
    },
    // 从bagLists中取一个福袋
    chooseOneLuckyBag() {
      let len = this.bagLists.length
      let index = 0
      if (len > 1) {
        index = this.getRandom(0, len - 1)
        console.log(`取福袋池中第${index}个福袋`)
      } else {
        index = 0
      }
      this.bagData = this.bagLists[index]
      this.bagShow = true
    },
    // 两数中随机取整
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    // 说点啥按钮
    saySome() {
      this.sayShow = true
    },
    // 我的福金按钮
    myFujin() {
      this.$router.push('/main/my-fujin')
    },
    // 发福袋按钮
    async sendBag() {
      await this.getLoginNews()
      if (
        this.dayjs().isBefore(this.dayjs(this.$store.state.app.gameStartTime))
      ) {
        this.$toast('游戏未开始，请等待')
        return
      }
      if (this.dayjs().isAfter(this.dayjs(this.$store.state.app.gameEndTime))) {
        this.$toast('游戏已结束，明年再来吧')
        return
      }
      this.$router.push('/main/send-bag')
    },
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
      }
    }
  }
}
</script>
<style scoped lang="scss">
.home {
  position: relative;
  overflow: hidden;
  .my-swipe {
    // background-image: url(`${this.PATH.fileServerPreName}top_bg.png`);
    background-size: 100% 100%;
    height: 350px;
    z-index: 3;
    .van-swipe-item {
      color: #fff;
      font-size: 20px;
      line-height: 150px;
      text-align: center;
    }
    ::v-deep .van-swipe__indicators {
      bottom: 8px;
    }
    ::v-deep .van-swipe__indicator--active {
      width: 12px;
      border-radius: 10px;
    }
  }
  .content {
    @extend .bg-pri;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    // background-image: url('../../assets/images/bottom_bg_tran.png');
    background-size: 100% 100%;
  }
  .msg-lists {
    overflow: hidden;
    position: fixed;
    width: 100%;
    top: 395px;
    z-index: 21;
  }
  .footer-btn {
    position: fixed;
    bottom: 0;
    z-index: 2;
    width: 100%;
    height: 67px;
    margin-bottom: 5px;
    .image {
      @extend .px-2, .h-100;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .time {
    position: fixed;
    bottom: 4px;
    right: 3px;
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
}
</style>
