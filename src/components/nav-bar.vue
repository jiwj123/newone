<template>
  <div class="nav-bar">
    <div class="left" @click="back">
      <van-icon :name="icon" size="18" class="text-light-pri" />
    </div>
    <div class="text-light-pri fs-xl flex-1 text-center">{{ title }}</div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '福袋',
      icon: 'cross'
    }
  },
  watch: {
    $route(val) {
      this.getTitleAndIcon(val.path)
    }
  },
  created() {
    this.getTitleAndIcon(this.$route.path)
  },
  methods: {
    // 模拟断开ws
    breakOff() {
      this.$ws.$ws.onclose() // 关闭websocket
    },
    // 返回事件
    back() {
      if (this.icon === 'arrow-left') {
        this.$router.back(-1)
      } else {
        this.$store.dispatch('app/setExitModelShow', true)
      }
    },
    // 根据路由确定顶部标题和按钮
    getTitleAndIcon(path) {
      switch (path) {
        case '/main/home':
          this.title = '成长福袋(内测版本)'
          this.icon = 'cross'
          break
        case '/main/send-bag':
          this.title = '发福袋(内测版本)'
          this.icon = 'arrow-left'
          break
        case '/main/my-fujin':
          this.title = '我的福金(内测版本)'
          this.icon = 'arrow-left'
          break
        default:
          break
      }
    }
  }
}
</script>
<style scoped lang="scss">
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: $navBarHei;
  background: linear-gradient(to right, #9d2926, #c34931);
  @extend .ai-center;
  .left,
  .right {
    width: 50px;
    height: 100%;
    @extend .ai-center, .jc-center;
  }
}
</style>
