<template>
  <div class="distributeLuckyBag w-100 h-100">
    <img class="topImg" :src="PATH.fileServerPreName+'B/CgUEPF_1WeeARENCAAS7aAD70gI816.png'" alt="" />
    <img
      class="bottomImg"
      v-if="!hiddenWhereKeyboard"
      :src="PATH.fileServerPreName+'B/CgUEPF_1WeSAfKWaAAEOajQk_Sk594.png'"
      alt=""
    />
    <div class="formDiv">
      <van-form validate-first style="text-align: right">
        <van-field
          :value="form.value1"
          clickable
          readonly
          @touchstart.stop="value1Click"
          label="福金"
          type="digit"
          maxlength="6"
          placeholder="请输入>=1且<=可用福金的整数"
          input-align="right"
        />
        <van-number-keyboard
          :show="show"
          @blur="value1Blur"
          v-model="form.value1"
          maxlength="6"
          @input="onInput"
        />
        <span class="useLuckyMoney">可用福金：{{ luckyMoney }}金币</span>
        <van-field
          :value="form.value2"
          clickable
          readonly
          @touchstart.stop="value2Click"
          label="福袋数"
          type="digit"
          maxlength="6"
          placeholder="请输入>=1且<=福金值的整数"
          input-align="right"
        />
        <van-number-keyboard
          :show="show2"
          v-model="form.value2"
          maxlength="6"
          @blur="value2Blur"
          @input="onInput2"
        />
        <van-field
          v-model="form.value3"
          @focus="inputFocus"
          @input="inputBlur"
          label="福袋主题"
          placeholder="请输入福袋主题"
          maxlength="10"
        />
        <img
          :src="PATH.fileServerPreName+'B/CgUEPF_1WeSADtxVAAAFZq_-LpI975.png'"
          alt=""
          @click="showTheme = true"
        />
      </van-form>
      <div class="sendMoney">
        <img class="sendImg" :src="PATH.fileServerPreName+'B/CgUEPF_1WeWAHjBgAAAKfoSPbvw378.png'" alt="" />
        <span>{{ sendMoney }}</span>
        <img class="line" :src="PATH.fileServerPreName+'B/CgUEPF_1WeWAXCDaAAAe6KEmLWs809.png'" alt="" />
      </div>

      <img
        class="sendBtn"
        :src="showBtn ? trueSend : falseSend"
        alt=""
        @click="showBtn ? distribute() : ''"
      />
      <div class="theme" v-show="showTheme">
        <div class="companyTheme">
          <p>企业文化主题</p>
          <van-button
            v-for="(item, index) in business_culture"
            :key="index"
            type="default"
            @click="buttonSelect(item.NAME)"
            >{{ item.NAME }}</van-button
          >
          <!-- <van-button type="default" @click="buttonSelect('用科技推动社会进步')"
            >用科技推动社会进步</van-button
          >
          <van-button type="default" @click="buttonSelect('成全他人 成就自己')"
            >成全他人 成就自己</van-button
          >
          <van-button type="default" @click="buttonSelect('沟通 理解 合作')"
            >沟通 理解 合作</van-button
          >
          <van-button type="default" @click="buttonSelect('大道至简 美络至易')"
            >大道至简 美络至易</van-button
          > -->
        </div>
        <div class="wuFu">
          <p>五福主题</p>
          <van-button
            v-for="(item, index) in cod_blessing"
            :key="index"
            type="default"
            @click="buttonSelect(item.NAME)"
            >{{ item.NAME }}</van-button
          >
          <!-- <van-button type="default" @click="buttonSelect('敬业福')"
            >敬业福</van-button
          >
          <van-button type="default" @click="buttonSelect('友善福')"
            >友善福</van-button
          >
          <van-button type="default" @click="buttonSelect('平安福')"
            >平安福</van-button
          >
          <van-button type="default" @click="buttonSelect('富贵福')"
            >富贵福</van-button
          > -->
        </div>
      </div>
      <div class="footer" v-show="!showTheme">
        <div v-if="!hiddenWhereKeyboard">
          <p>福金用于万家村兑换豪礼</p>
          <p>每1000福金可兑换价值100元商品</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { uuid } from '@/utils/UUID'
import { ios_or_android } from '@/utils/iosOrAndroid'
export default {
  // components: { openBag },
  data() {
    return {
      show: false,
      show2: false,
      business_culture: [],
      cod_blessing: [],
      form: {
        value1: '',
        value2: '',
        value3: '用科技推动社会进步'
      },
      luckyMoney: 0,
      isDisabled: true,
      sendMoney: 0,
      showTheme: false,
      falseSend: `${this.PATH.fileServerPreName}B/CgUEPF_1WeaAPv0QAAAYlVqfwEE072.png`,
      trueSend: `${this.PATH.fileServerPreName}B/CgUEPF_1WeaAMCLmAAAZThKZmns569.png`,
      showBtn: false,
      hiddenWhereKeyboard: false, // 键盘弹起时需要隐藏的部分
      LASTRECORDID:''
    }
  },
  mounted() {
    let oHeight = document.body.clientHeight //浏览器当前的高度
    window.onresize = () => {
      if (document.body.clientHeight < oHeight) {
        this.hiddenWhereKeyboard = true
      } else {
        this.hiddenWhereKeyboard = false
      }
    }
  },
  created() {
    this.leftMoneyData()
    this.GetCodeListData()
    console.log(1);
    console.log(this.$store.state.app.THEMETYPEVALIDITYPERIOD);
  },
  watch: {
    form: {
      deep: true,
      handler() {
        if (
          this.form.value1 != '' &&
          this.form.value2 != '' &&
          this.form.value3 != '' &&
          this.form.value1 != undefined &&
          this.form.value2 != undefined &&
          this.form.value3 != undefined
        ) {
          this.showBtn = true
        } else {
          this.showBtn = false
        }
      }
    },
    'form.value1'() {
      if (!this.form.value1) {
        this.sendMoney = 0
      } else {
        this.sendMoney = this.form.value1
      }
    }
  },
  methods: {
    async GetCodeListData() {
      //获取企业文化主题
      const business_culture = await this.API.GetCodeList.BusinessCulture({
        ID: '',
        SQLCondition: ''
      })
      //获取五福主题
      const cod_blessing = await this.API.GetCodeList.Blessing({
        ID: '',
        SQLCondition: ''
      })
      // if (business_culture.data.QueryBusinessCultureTopicResult.length > 0) {
      this.business_culture =
        business_culture.data.QueryBusinessCultureTopicResult
      // }
      // if (cod_blessing.data.QueryBlessingTopicResult.length > 0) {
      this.cod_blessing = cod_blessing.data.QueryBlessingTopicResult
      // }
    },
    // 获取最新剩余福金数
    async leftMoneyData() {
      const resData = await this.API.QueryLastRecordByUserId([
        {
          ID: 'USERID',
          SQLCondition: this.$store.state.app.DESKUSERID
        }
      ])
      if (resData.data.QueryLastRecordByUserIdResult.length > 0) {
        this.luckyMoney =
          resData.data.QueryLastRecordByUserIdResult[0].RECORDTOTALAMOUNT
          this.LASTRECORDID=resData.data.QueryLastRecordByUserIdResult[0].RECORDID
      }
    },
    value1Click() {
      this.showTheme = false
      event.preventDefault()
      this.show2 = false
      this.show = true
    },
    value2Click() {
      this.showTheme = false
      event.preventDefault()
      this.show = false
      this.show2 = true
    },
    //发送福袋按钮
    async distribute() {
      this.showTheme = false
      await this.getLoginNews()
      if (
        this.form.value1 &&
        (Number(this.form.value1) > Number(this.luckyMoney) ||
          Number(this.form.value1) < 1)
      ) {
        this.$toast('请输入合适的福金值')
        return
      }
      if (
        !(
          Number(this.form.value2) >= 1 &&
          Number(this.form.value2) <= Number(this.form.value1)
        )
      ) {
        this.$toast('请输入合适的福袋数')
        return
      }
      if (dayjs().isBefore(dayjs(this.$store.state.app.gameStartTime))) {
        this.$toast('游戏未开始，请等待')
        return
      }
      if (dayjs().isAfter(dayjs(this.$store.state.app.gameEndTime))) {
        this.$toast('游戏已结束，明年再来吧')
        return
      }
      this.leftMoneyData()
      if (this.luckyMoney < Number(this.form.value1)) {
        this.$toast('请输入合适的福金值')
        return
      }
      this.showBtn = false
      const MessageBody = {
        LUCKYBAGID: uuid(), //前端uuid
        USERID: this.$store.state.app.DESKUSERID, //登录获取
        USERPHONE: this.$store.state.app.UserID, //登录获取
        USERNAME: this.$store.state.app.userName, //登录获取
        LASTRECORDID:this.LASTRECORDID, //
        LUCKYBAGTOPIC: this.form.value3, //福袋主题
        // RECORDTOTALAMOUNT:Number(this.luckyMoney)-Number(this.form.value1),
        ALGORITHMID: '2', //分配方式,目前固定随机
        THEMETYPEID: this.$store.state.app.THEMETYPEID, //登录获取
        LUCKYBAGTOTALAMOUNT: this.form.value1, //发的福金金额
        LUCKYBAGREMAINAMOUNT: this.form.value1, //同上
        LUCKYBAGCREATETIME: dayjs().format('YYYY-MM-DD HH:mm:ss'), //福袋创建时间
        LUCKYBAGEXPIREDTIME: dayjs()
          .add(Number(this.$store.state.app.THEMETYPEVALIDITYPERIOD), 'minute')
          .format('YYYY-MM-DD HH:mm:ss'), //福袋过期时间为创建+10min
        LUCKYBAGNUMBER: this.form.value2, //福袋数量
        LUCKYBAGREMAINNUMBER: this.form.value2, //同上
        LUCKYBAGFILEPATH: '', //福袋图片
        RECORDID: uuid(), //我的福金”主键，UUID前端创建
        RECORDAMOUNT: this.form.value1, //同LUCKYBAGTOTALAMOUNT
        RESOURCETYPEID: '4', //我的福金”类型ID（发福袋为4）
        RECORDCREATETIME: dayjs().format('YYYY-MM-DD HH:mm:ss'), //“我的福金”记录产生时间
        RowState: '1',
        RECORDDESC: this.form.value3 //福袋主题
      }
      const resData = await this.API.SaveBag([
        {
          Receivers: [
            this.$store.state.app.GROUPID,
            this.$store.state.app.UserID
          ], //登录时获取,目前固定全部人员为99999
          MessageBody: MessageBody
        }
      ])
      if (resData.data === 'OK') {
        // this.$ws.wsSend(this.$store.state.app.subscribeCommand)
        const msgLists = this.$store.state.bag.bagLists
        // 拼装一条，放入福袋列表，这样自己能看到
        msgLists.push(MessageBody)
        this.$store.dispatch('bag/setBagLists', msgLists)
        this.$toast('发送成功')
        this.$router.push('/main')
      } else {
        this.$toast('发送失败')
      }
      this.showBtn = true
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
        this.$store.dispatch(
          'app/setTHEMETYPEVALIDITYPERIOD',
          dataTime.THEMETYPEVALIDITYPERIOD
        ) //福袋过期时间
      }
    },
    value1Blur() {
      this.form={
        ...this.form,
        value1:this.form.value1.replace(/^[0]+/,"")
      }
      if (
        this.form.value1 &&
        (Number(this.form.value1) > Number(this.luckyMoney) ||
          Number(this.form.value1) < 1)
      ) {
        this.$toast('请输入合适的福金值')
      }
      this.show = false
    },
    value2Blur() {
      this.form={
        ...this.form,
        value2:this.form.value2.replace(/^[0]+/,"")
      }
      if (
        !(
          Number(this.form.value2) >= 1 &&
          Number(this.form.value2) <= Number(this.form.value1)
        )
      ) {
        this.$toast('请输入合适的福袋数')
      }
      this.show2 = false
    },
    buttonSelect(val) {
      this.showTheme = false
      this.form = {
        ...this.form,
        value3: val
      }
    },
    inputFocus() {
      this.showTheme = false
    },
    inputBlur() {
      if (ios_or_android() === 'ios') {
        const param = this.form.value3
        const regRule = /[^\u4E00-\u9FA5|\d|a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g
        this.form = {
          ...this.form,
          value3: param.replace(regRule, '')
        }
      } else {
        const param = this.form.value3
        const regRule = /[^\u4E00-\u9FA5|\d|a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g
        this.form = {
          ...this.form,
          value3: param.replace(regRule, '')
        }
      }
    },
    onInput(value) {
      this.form = {
        ...this.form,
        value1: `${this.form.value1.toString()}${value}`
      }
    },
    // onDelete() {
    //   this.form = {
    //     ...this.form,
    //     value1: this.form.value1.slice(0, this.form.value1.length - 1)
    //   }
    // },
    // onDelete2() {
    //   this.form = {
    //     ...this.form,
    //     value2: this.form.value2.slice(0, this.form.value2.length - 1)
    //   }
    // },
    onInput2(value) {
      this.form = {
        ...this.form,
        value2: `${this.form.value2.toString()}${value}`
      }
    }
  }
}
</script>
<style scoped lang="scss">
.distributeLuckyBag {
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
  .formDiv {
    position: relative;
    width: 90%;
    margin: 5% auto;
    height: 95%;
    padding: 5%;
    background: rgba(133, 33, 33, 0.8);
    border-radius: 8px;
    z-index: 20;
  }
  .van-form {
    margin-top: -10px;
    position: relative;
    .useLuckyMoney {
      color: #e79976;
    }
    .van-cell {
      font-size: 1.2rem;
      width: 100%;
      height: 45px;
      border-bottom: none;
      background: #fee8da !important;
      border-radius: 8px;
      border: 1px solid #e49167;
      margin-bottom: 10px;
      margin-top: 10px;
      // padding: 6px;
      ::v-deep {
        input::-webkit-input-placeholder {
          color: #e2b4a0;
        }
        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #e2b4a0;
        }
        input:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #e2b4a0;
        }
        input:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #e2b4a0;
        }
        .van-field__label {
          color: #663e41;
          width: auto;
        }
        // .van-field__value {
        //   .van-field__body {
        //     text-align: left;
        //   }
        // }
        .van-field__control {
          color: #a73329;
        }
      }
    }
    img {
      position: absolute;
      bottom: 0.8rem;
      right: 0.5rem;
      height: 2rem;
    }
  }
  .sendMoney {
    text-align: center;
    margin-left: -1.8rem;
    .sendImg {
      height: 3rem;
      vertical-align: -0.8rem;
      margin-right: 1rem;
      position: absolute;
      left: 5rem;
      margin-top: 0.5rem;
    }
    span {
      color: #ffb889;
      font-weight: 600;
      font-size: 3rem;
      margin-left: 1.5rem;
    }
    .line {
      display: block;
      width: 105%;
      margin-left: 1%;
      margin-top: -50px;
    }
  }
  .sendBtn {
    width: 80%;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    margin-top: 10px;
  }
  .footer {
    position: fixed;
    bottom: 7%;
    left: 0;
    right: 0;
    margin: auto;
    p {
      color: #e79976;
      text-align: center;
      margin: 0;
      font-size: 1.2rem;
    }
  }
  .theme {
    width: 95%;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.3);
    padding: 0 2.5% 1% 2.5%;
    color: #500005;
    position: absolute;
    left: 2.5%;
    bottom: 1.3%;

    border-radius: 4px;
    p {
      color: #e79976;
      margin: 8px 0;
    }
    button {
      border-radius: 4px;
      margin-bottom: 2%;
      padding: 0;
      text-align: center;
      font-size: 1rem;
      height: 2.5rem;
    }
    .companyTheme {
      button {
        background: #fee8da;

        border: 1px solid #e49167;
        width: 49%;
      }
      button:nth-child(2n) {
        margin-right: 2%;
      }
    }
    .wuFu {
      button {
        background: #ffab73;
        border: 1px solid #d27645;
        width: 32%;
      }
      button:nth-child(3),
      button:nth-child(6) {
        margin: 0 2%;
      }
    }
  }
}
.static {
  position: static;
}
</style>
