<template>
  <div class="open-bag" v-if="show">
    <!-- 背景蒙版 -->
    <div class="model"></div>
    <!-- 福袋区域 -->
    <div class="content">
      <div class="lucky-bag">
        <!-- 福袋弹窗里的图片 -->
        <!-- 拆开前 -->
        <div v-if="!isOpen">
          <img
            class="model_bg"
            style="width:80%;height:auto"
            :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeWALRCbAADx1OPmR3A908.png`"
            title="福袋"
            alt="福袋"
          />
        </div>
        <!-- 拆开后 -->
        <div v-else>
          <!-- 有福金 -->
          <div v-if="hasFujin" style="width: 100%;height: auto;margin: 0 auto;">
            <img
              class="model_bg_opened"
              :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeaAR4KxAAEV0zINaY0240.png`"
              title="福袋"
              alt="福袋"
            />
            <!-- 有福金的图片标识 -->
            <img class="buling" :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeSAOFUbAApxPy-iomk504.gif`" alt="buling" />
          </div>
          <!-- 无福金 -->
          <div v-else>
            <img
              class="model_bg_no_money"
              :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeWAAvSoAAD_wSSeghQ412.png`"
              title="福袋"
              alt="福袋"
            />
            <!-- 没有福金的图片标识 -->
            <img
              class="empty-flag"
              :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeWAD_oHAAK07te-oGc058.gif`"
              alt="empty_flag"
            />
          </div>
        </div>
        <!-- 福袋说明区域 -->
        <div
          class="w-100 text-light-pri"
          :class="isOpen ? 'detail-after-open' : 'detail-before-open'"
        >
          <!-- 拆福袋前 -->
          <div v-if="!isOpen">
            <div class="from">{{ bagData.USERNAME }}</div>
            <div class="title mt-2">喊你拆福袋啦</div>
          </div>
          <!-- 拆开福袋后 -->
          <div v-if="isOpen">
            <!-- 有福金的提示语 -->
            <div class="hasFujin" v-if="hasFujin">
              获得<span class="mx-1">{{ fujinAmount }}</span
              >福金
            </div>
            <!-- 无福金的提示语 -->
            <div class="noFujin" v-else>
              <div>很遗憾</div>
              <div>你和福金擦肩而过</div>
            </div>
          </div>
        </div>
        <!-- 福袋主题 -->
        <div
          v-if="!isOpen"
          class="theme text-light-pri fs-sm w-100 text-center"
        >
          {{ bagData.LUCKYBAGTOPIC }}
        </div>
        <!-- 按钮区域 -->
        <div :class="isOpen ? 'btn-after-open' : 'btn-before-open'">
          <div v-if="!isOpen" class="btn text-center" style="width: 85%;margin:0 auto">
            <img
              class="image"
              @click="openBag"
              :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeaARPIkAAAW9mJqREU487.png`"
              alt="拆福袋"
            />
          </div>
          <div v-else class="btn jc-center">
            <img
              class="image"
              :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeeAFuqJAAAPjBcuB2o491.png`"
              alt="送祝福"
              @click="sendBlessing"
            />
            <img
              class="image"
              :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeeAae7mAAAP00fCR4Y248.png`"
              alt="发福袋"
              @click="sendBag"
            />
            <div class="time" v-if="false">
              <game-time></game-time>
            </div>
            <img
              class="image"
              :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeWAaaF1AAAPkx3BYHU363.png`"
              alt="继续拆"
              @click="goOnOpen"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 弹幕消息列表 -->
    <div class="msg-lists flex-1 mb-2" :style="{ height: msgListsHei }">
      <bullet-chat v-if="msgLists.length > 0" v-model="msgLists"></bullet-chat>
    </div>
    <!-- 说点什么input框 -->
    <say
      ref="say"
      v-model="sayShow"
      :placeholder="`送祝福给${bagData.USERNAME}...`"
    ></say>
  </div>
</template>
<script>
import Say from '@/components/say.vue'
import gameTime from '@/components/game-time'
import dayjs from 'dayjs'
import bulletChat from '@/components/bullet-chat'
export default {
  components: { Say, gameTime, bulletChat },
  model: {
    prop: 'show',
    event: 'getShow'
  },
  props: {
    show: { default: false },
    data: {
      dafault: () => {}
    }
  },
  data() {
    return {
      isOpen: false, // 是否已经打开福袋
      hasFujin: true, // 是否抢到福金
      sayShow: false, // 送祝福组件
      fujinAmount: '', // 福金金额
      bagData: {
        USERNAME: '-',
        LUCKYBAGTOPIC: '-'
      }
    }
  },
  computed: {
    // 消息列表
    msgLists() {
      return this.$store.state.msg.msgLists
    },
    msgListsHei() {
      return this.$parent.msgListsHei
    }
  },
  watch: {
    data: {
      handler(val) {
        // console.log('福袋消息', val)
        this.bagData = val
      },
      immediate: true
    }
  },
  methods: {
    // 拆福袋
    async openBag() {
      // 调接口
      let params = [
        {
          ID: 'LUCKYBAGID',
          SQLCondition: this.bagData.LUCKYBAGID
        },
        {
          ID: 'USERID',
          SQLCondition: this.$store.state.app.DESKUSERID
        },
        {
          ID: 'SNATCHTIME',
          SQLCondition: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      ]
      const queryRes = await this.API.OpenLuckyBag(params)
      let res = queryRes.data[this.PATH.OpenLuckyBag.resName][0]
      if (
        res.SNATCHRESULT === 'OverTime' ||
        res.SNATCHRESULT === 'Finished' ||
        res.SNATCHRESULT === 'Duplicated'||
        res.SNATCHRESULT === 'Error'
      ) {
        // 红包已过期或已经被抢完或重复抢
        this.hasFujin = false
      } else {
        this.hasFujin = true
        this.fujinAmount = res.SNATCHRESULT
      }
      this.isOpen = true
      // 拿到bagLists
      let index = this.$store.state.bag.bagLists.findIndex(
        i => i.LUCKYBAGID === this.bagData.LUCKYBAGID
      )
      this.$store.state.bag.bagLists.splice(index, 1) // 从福袋列表中删除该福袋
    },
    // 继续拆
    goOnOpen() {
      // 拿到bagData
      if (this.$store.state.bag.bagLists.length === 0) {
        this.$toast('没有福袋啦~')
        setTimeout(() => {
          this.close() // 关闭当前弹窗
        }, 500)
      } else {
        this.$parent.chooseOneLuckyBag()
        this.initPageData()
      }
    },
    // 关闭当前弹窗
    close() {
      this.initPageData()
      this.$emit('getShow', false)
    },
    // 送祝福
    sendBlessing() {
      this.sayShow = true
    },
    // 发福袋
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
    },
    // 初始化页面
    initPageData() {
      this.isOpen = false
    }
  }
}
</script>
<style scoped lang="scss">
@import '~csshake/scss/csshake-hard.scss';
.open-bag {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
  .model {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
  }
  .content {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: 22;
    .lucky-bag {
      margin-top: 20%;
      position: relative;
      .model_bg {
        width: 305px;
        height: 380px;
      }
      .model_bg_opened,
      .model_bg_no_money {
        // width: 305px;
        // height: 395px;
        width: 80%;
        height: auto;
        margin: 0 auto;
      }
      .buling,
      .empty-flag {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      .buling {
        // width: 70%;
        // top: 75px;
        width: 46%;
    top: 27%;
      }
      .empty-flag {
        width: 25%;
        top: 18%;
      }
      .detail-after-open,
      .detail-before-open {
        position: absolute;
        @include font_size(2);
        @extend .w-100, .text-light-pri;
        .hasFujin,
        .noFujin {
          @extend .w-100, .text-center;
          position: relative;
          bottom: 10%;
          span {
            @include font_size(3.5);
          }
        }
      }
      .detail-before-open {
        bottom: 40%;
      }
      .detail-after-open {
        bottom: 45%;
      }
      .theme {
        position: absolute;
        bottom: 25%;
      }
      .btn-before-open,
      .btn-after-open {
        position: absolute;
        height: 50px;
        @extend .w-100;
            
        .btn {
          .image {
            @extend .h-100, .flex-1;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .time {
            position: absolute;
            bottom: -5px;
          }
        }
      }
      .btn-before-open {
        bottom: 5%;
        .btn {
          height: 80%;
          // width: 259px;
          // margin-left: 23px;
        }
      }
      .btn-after-open {
        bottom: 7.5%;
        width: 68% !important;
    margin-left: 16%;
    height: auto;
    // width: 80% !important;
    // margin-left: 10%;
        // width: 84%;
        // margin: 0 auto;
        // margin-left: 8%;
        .btn {
          // width: 255px;
          // margin-left: 25px;
          // height: 100%;
          // width: 85%;
          margin: 0 auto;
          height: auto;
          img{
            width: 33%;
    height: auto;
          }
        }
      }
    }

    // 自定义抖动规则
    .my-custom-shake {
      @include do-shake(
        $name: 'my-custom-shake',
        $h: 5px,
        $v: 5px,
        $r: 20deg,
        $dur: 1000ms,
        $precision: 0.08,
        $opacity: false,
        $q: infinite,
        $t: linear,
        $delay: null,
        $chunk: 100%
      );
    }
  }
  .msg-lists {
    overflow: hidden;
    position: fixed;
    width: 100%;
    top: 395px;
    z-index: 21;
  }
}
</style>
