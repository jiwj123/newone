<template>
  <div class="say ai-center bg-white" v-if="show">
    <div class="bg-pri vertical-line ml-3"></div>
    <van-field
      v-model="value"
      ref="field"
      center
      clearable
      maxlength="100"
      :placeholder="placeholder"
    >
      <template #button>
        <van-button
          size="small"
          type="primary"
          @click="determine"
          class="px-3 fs-lg"
          >{{ value ? '发送' : '取消' }}</van-button
        >
      </template>
    </van-field>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'show',
    event: 'getShow'
  },
  props: {
    placeholder: { default: '说点什么...' },
    show: { default: false }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.field.focus()
          // document.body.scrollTop = document.documentElement.scrollTop = 0
        })
      }
    }
  },
  methods: {
    // aaa(){
    //   console.log(document.body.scrollTop);
    //   document.body.scrollTop = document.documentElement.scrollTop = 0
    //   console.log(document.body.scrollTop);
    // },
    determine() {
      if (!this.value) {
        this.$emit('getShow', false)
      } else {
        let type = '' // 消息的类型
        let from = '' // 消息来源
        if (this.placeholder === '说点什么...') {
          type = '说说'
          from = [this.$store.state.UserID, this.$store.state.app.userName]
        } else {
          type = '@'
          from = [this.$parent.bagData.USERPHONE, this.$parent.bagData.USERNAME]
        }
        let msg = {
          type: type,
          from: from,
          detail: this.value
        }
        this.sendMsg(msg)
      }
    },
    // 发送消息
    async sendMsg(data) {
      let Receivers = []
      let msgcontent = ''
      let receiver = ''
      let RECEIVERTYPEID = ''
      // let sendWsMsg = '' // 需要发送给websocket的信息
      if (data.type === '@') {
        let fromID = this.$parent.bagData.USERPHONE
        Receivers = [fromID] // 福袋发送者的用户id
        receiver = fromID
        msgcontent = `${data.detail}`
        RECEIVERTYPEID = this.$store.state.msg.RECEIVERTYPEID[1] // 个人
        // sendWsMsg = this.$store.state.app.subscribeCommandOfUser
      } else {
        Receivers = [this.$store.state.app.GROUPID] // 所有人
        receiver = this.$store.state.app.GROUPID
        msgcontent = `${data.detail}`
        RECEIVERTYPEID = this.$store.state.msg.RECEIVERTYPEID[0] // 群组
        // sendWsMsg = this.$store.state.app.subscribeCommand
      }
      // let MSGID = this.UUID() // 消息ID
      let params = [
        {
          Receivers: Receivers,
          MessageBody: {
            // MSGID: MSGID,
            MSGCONTENT: msgcontent,
            USERID: this.$store.state.app.DESKUSERID,
            USERNAME: this.$store.state.app.userName,
            MSGCREATETIME: this.dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            RECEIVER: receiver,
            RECEIVERTYPEID: RECEIVERTYPEID,
            RowState: '1'
          }
        }
      ]
      const res = await this.API.SaveMsgInfo(params)
      if (res.data === 'OK') {
        // this.$ws.wsSend(sendWsMsg) // 通知websocket
        // 拼装一条，放入消息列表，这样自己能看到
        if (
          this.$store.state.msg.msgLists.length >=
          this.$store.state.msg.msgMaxCount
        ) {
          this.$store.state.msg.msgLists.pop()
        }
        // console.log('自己拼装消息');
        if (data.type === '@') {
          this.$store.state.msg.msgLists.unshift({
            type: data.type + this.$parent.bagData.USERNAME,
            from: [
              this.$parent.bagData.USERPHONE,
              this.$store.state.app.userName
            ],
            detail: msgcontent,
            // MSGID: MSGID
          })
        } else {
          this.$store.state.msg.msgLists.unshift({
            type: data.type,
            from: data.from,
            detail: msgcontent,
            // MSGID: MSGID
          })
        }
        this.$toast.success('发送成功')
        this.$emit('getShow', false)
        this.value = ''
      } else {
        this.$toast.fail('发送失败')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.say {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 999;
  .van-cell {
    height: 100%;
    @extend .px-3;
  }
  .van-button {
    border: none;
    @extend .text-white, .bg-pri;
  }
  .vertical-line {
    width: 2px;
    height: 45%;
  }
}
</style>
