<template>
  <div class="myFujin w-100 h-100">
    <div style="background: linear-gradient(180deg, #721E1B 0%, rgba(127, 34, 31, 0.7) 47%, rgba(141, 38, 35, 0) 100%);position:absolute;z-index:9999;height:100px;width:100%">

    </div>
    <img class="topImg" :src="PATH.fileServerPreName + 'B/CgUEPF_1WeeARENCAAS7aAD70gI816.png'" alt="" />
    <img
      class="bottomImg"
      :src="PATH.fileServerPreName + 'B/CgUEPF_1WeSAfKWaAAEOajQk_Sk594.png'"
      alt=""
    />
    <div class="header">
      <div class="fujin">
        <img :src="PATH.fileServerPreName + 'B/CgUEPF_1WeSAeicHAAFsMQc6P5A698.png'" alt="" />
        <span>总福金: {{ fujin }}</span>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了..."
        @load="onLoad"
      >
        <div v-for="(item, index) in list" :key="index" class="listDiv">
          <img :src="PATH.fileServerPreName + 'B/CgUEPF_1WeWAQiyqAAAH6-v6OVM021.png'" alt="" />
          <span>{{ item.title }}</span>
          <div class="detail">
            <div class="left">
              <h2
                :style="{
                  color:
                    item.USERNAME === '系统预充'
                      ? '#449581'
                      : item.USERNAME === '超时未领取退回'
                      ? '#CD5826'
                      : '#663E41'
                }"
              >
                {{ item.USERNAME }}
              </h2>
              <p>{{ item.RECORDDESC }}</p>
            </div>
            <h2
              class="right"
              :style="{
                color: item.RESOURCETYPEID === '4' ? '#A73329' : '#FFAA00'
              }"
            >
              <span v-if="item.RESOURCETYPEID != '4'">+</span>
              <span v-else>-</span> {{ item.RECORDAMOUNT }}
            </h2>
          </div>
        </div>
        <!-- <van-cell  :title="item" /> -->
      </van-list>
      <div class="tip">
        <p>福金用于万家村兑换豪礼</p>
        <p>每1000福金可兑换价值100元商品</p>
      </div>
      <div class="sendBagImg">
        <img :src="showBtn ? trueSend : falseSend" alt="" @click="sendBag()" />
        <div class="time ai-center jc-center">
          <game-time></game-time>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import gameTime from '@/components/game-time'

export default {
  components: { gameTime },
  data() {
    return {
      fujin: 0,
      list: [],
      loading: false,
      finished: false,
      STARTPOSITION: 0,
      ENDPOSITION: 10,
      thislist: [],
      trueSend: `${this.PATH.fileServerPreName}B/CgUEPF_1WeaAM1HBAAAeTp8El0Y839.png`,
      falseSend: `${this.PATH.fileServerPreName}B/CgUEPF_1WeaAemLFAAAdP8T0Gco159.png`
    }
  },
  computed: {
    // 游戏时间
    gameTime() {
      let startDate = this.dayjs(this.$store.state.app.gameStartTime).format(
        'MM-DD'
      )
      let endDate = this.dayjs(this.$store.state.app.gameEndTime).format(
        'MM-DD'
      )
      let startTime = this.dayjs(this.$store.state.app.gameStartTime).format(
        'HH:mm'
      )
      let endTime = this.dayjs(this.$store.state.app.gameEndTime).format(
        'HH:mm'
      )
      if (startDate === endDate) {
        return `${startDate} ${startTime} - ${endTime}`
      } else {
        return `${startDate} ${startTime} - ${endDate} ${endTime}`
      }
    },
    showBtn() {
      return this.$store.state.app.gameStart
    }
  },
  created() {
    this.leftMoneyData()
    this.getData()
  },
  methods: {
    // 获取最新剩余福金数
    async leftMoneyData() {
      const resData = await this.API.QueryLastRecordByUserId([
        {
          ID: 'USERID',
          SQLCondition: this.$store.state.app.DESKUSERID
        }
      ])
      if (resData.data.QueryLastRecordByUserIdResult.length > 0) {
        this.fujin =
          resData.data.QueryLastRecordByUserIdResult[0].RECORDTOTALAMOUNT
      }
    },
    async getData() {
      let arr = [
        '牛',
        '气',
        '冲',
        '冲',
        '牛',
        '转',
        '乾',
        '坤',
        '牛',
        '运',
        '亨',
        '通',
        '牛',
        '年',
        '鸿',
        '运',
        '牛',
        '劲',
        '十',
        '足'
      ]
      const resData = await this.API.QueryRecordFlowWaterInfo([
        {
          ID: 'USERID',
          SQLCondition: this.$store.state.app.DESKUSERID
          // SQLCondition:'gus'
        },
        {
          ID: 'STARTPOSITION',
          SQLCondition: this.STARTPOSITION
        },
        {
          ID: 'ENDPOSITION',
          SQLCondition: this.ENDPOSITION
        }
      ])
      let num = this.STARTPOSITION
      if (resData.data.QueryRecordFlowWaterInfoResult.length >= 0) {
        resData.data.QueryRecordFlowWaterInfoResult.forEach((ele, index) => {
          if (ele.RESOURCETYPEID === '1') {
            ele.USERNAME = '系统预充'
          }
          if (ele.RESOURCETYPEID === '3') {
            ele.USERNAME = '超时未领取退回'
          }
          if (this.STARTPOSITION >= arr.length) {
            num = this.STARTPOSITION % arr.length
          }
          ele.title = arr[Number(num) + (Number(index) % arr.length)]
        })
        this.thislist = resData.data.QueryRecordFlowWaterInfoResult
        this.list.push(...resData.data.QueryRecordFlowWaterInfoResult)
      }
    },
    //发福袋
    async sendBag() {
      await this.getLoginNews()
      if (dayjs().isBefore(dayjs(this.$store.state.app.gameStartTime))) {
        this.$toast('游戏未开始，请等待')
        return
      }
      if (dayjs().isAfter(dayjs(this.$store.state.app.gameEndTime))) {
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
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        // 数据全部加载完成
        if (this.thislist.length < 10) {
          this.finished = true
          return
        }
        this.STARTPOSITION = Number(this.STARTPOSITION) + Number(10)
        this.getData()
        // for (let i = 0; i < 10; i++) {
        // this.list.push(this.list.length + 1)
        // }
        // 加载状态结束
        this.loading = false
      }, 1000)
    }
  }
}
</script>
<style scoped lang="scss">
.myFujin {
  height: 100%;
  position: relative;
  overflow: hidden;
  .topImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
  .bottomImg {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: -9;
  }
  .header {
    .fujin {
      position: relative;
      z-index: 99999;
      font-size: 1.5rem;
      color: #ffd9c0;
      text-align: center;
      // padding-top: 2.6rem;
      // margin-bottom: 70px;
background: linear-gradient(180deg, #721E1B 0%, rgba(127, 34, 31, 0.7) 47%, rgba(141, 38, 35, 0) 100%);
      img {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        width: 330px;
        margin: 0 auto;
      }
      span {
        position: absolute;
        z-index: 9999;
        top: 25px;
        left: 0;
        right: 0;
      }
    }
    .van-list {
      max-height: calc(100vh - 200px);
      overflow: auto;
      position: relative;
      z-index: 999;
      width: 350px;
      margin: 0 auto;
      padding-top: 95px;
      .listDiv {
        position: relative;
        margin-bottom: 6px;
        height: 80px;
        img {
          position: absolute;
          width: 350px;
          top: 0;
          left: 0;
          height: 80px;
        }
        > span {
          position: absolute;
          top: 24px;
          left: 29px;
          font-size: 1.8rem;
          color: #fff;
        }
        .detail {
          height: 100%;
          position: relative;
          z-index: 9999;
          .left {
            float: left;
            margin-left: 23%;
            h2 {
              margin: 1.2rem 0;
            }
            p {
              margin: -0.8rem 0 1rem 0;
              font-size: 1.2rem;
              color: #666666;
            }
          }
          .right {
            float: right;
            margin-right: 4%;
            margin-top: 2.3rem;
          }
        }
      }
      .listDiv:after,
      .listDiv:before {
        content: '';
        display: table;
      }
      .listDiv:after {
        clear: both;
      }
      .listDiv {
        *zoom: 1;
      }
    }
    .tip {
      color: #e79976;
      position: relative;
      z-index: 999;
      padding: 8px 0;
      background: rgba(133, 33, 33, 0.8);
      border-radius: 4px;
      width: 350px;
      margin: 0 auto;
      text-align: center;
      font-size: 1.2rem;
      margin-top: 2px;
      p {
        margin: 0;
      }
    }
    .sendBagImg {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 10px;
      text-align: center;
      img {
        width: 70%;
        position: relative;
      }
      .time {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
