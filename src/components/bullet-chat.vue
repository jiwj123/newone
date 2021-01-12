<template>
  <div class="bullet-chat h-100 overflow-y-auto flex-recolumn" ref="bulletChat">
    <div
      v-for="(item, index) in data"
      :key="index"
      class="lists w-100 my-2 p-2"
    >
      <!-- 消息类型 -->
      <span :class="`type p-1 mr-2 text-center ${item.typeClassName}`">{{
        item.type.includes('@') && item.from[0] === $store.state.app.UserID
          ? '@你'
          : item.type
      }}</span>
      <!-- 消息发送人 -->
      <span class="from h-100 mt-1 text-FFAB73" v-if="item.from"
        >{{ item.from[1] }}：</span
      >
      <!-- 消息内容 -->
      <span :class="`detail m-1 ${item.detailClassName}`">{{
        item.detail
      }}</span>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'data',
    event: 'getLists'
  },
  props: ['data'],
  data() {
    return {
      lists: []
    }
  },
  watch: {
    data: {
      handler(val) {
        this.setClassName(val)
        this.scrollToBottom()
      },
      deep: true
    }
  },
  created() {
    this.setClassName(this.data)
  },
  mounted() {
    // 监听消息列表滚动scroll
    this.$refs.bulletChat.addEventListener('scroll', this.chatSrcoll)
    this.$nextTick(() => {
      this.scrollToBottom()
    })
  },
  methods: {
    chatSrcoll() {},
    // 消息滚动至最底部
    scrollToBottom() {
      let dom = this.$refs.bulletChat
      // 将消息列表滚动到最底部
      setTimeout(() => {
        dom.scrollTop = dom.scrollHeight
      }, 100)
    },
    // 给消息列表item加属性，用来保存className
    setClassName(arr) {
      arr.forEach(i => {
        let className = ''
        if (i.type === '说说') {
          className = 'shuoshuo'
        } else if (i.type === '通知') {
          className = 'tongzhi'
        } else {
          if (i.type.includes('@')) {
            className = 'aite'
          }
        }
        i.typeClassName = `type_${className}` // 消息类型的样式
        i.detailClassName = `detail_${className}` // 消息内容的样式
      })
    }
  }
}
</script>
<style scoped lang="scss">
.bullet-chat {
  width: 95%;
  margin: 0 auto;
  overflow-x: hidden;
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0,
    rgba(255, 255, 255, 1) 50%
  );
  .my-2{
    padding: .3rem;
    margin-top:0.1rem;
    margin-bottom: 0.1rem;
  }
  .lists {
    font-size: 1.2rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    line-height: 22px;
    word-wrap: break-word;
    .type {
      border-radius: 5px;
      width: 3rem;
    }
    .detail {
      // word-wrap: break-word;
    }
    // @消息类型的样式
    .type_aite {
      @extend .bg-light-pri, .text-500005;
    }
    // 说说消息类型的样式
    .type_shuoshuo {
      @extend .bg-FFAB73, .text-500005;
    }
    // 通知消息类型的样式
    .type_tongzhi {
      @extend .bg-500005, .text-light-pri;
    }

    // @消息内容的样式
    .detail_aite {
      @extend .text-light-pri;
    }
    // 说说内容类型的样式
    .detail_shuoshuo {
      @extend .text-light-pri;
    }
    // 通知内容类型的样式
    .detail_tongzhi {
      @extend .text-FFAB73;
    }
  }
}
</style>
