<template>
  <div>
    <van-field
      label="用户名"
      v-model="value"
      placeholder="这是输入测试的手机号哦"
    ></van-field>
    <van-button @click="login">登录</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '15000000001'
    }
  },
  created() {
    this.$ws.wsOpen = this.onopen
    this.$ws.initWebSocket()
    // this.$store.dispatch('app/showOverlayShow', '连接服务器...')
  },
  methods: {
    login() {
      this.$store.dispatch('app/setTel', this.value)
      this.$router.push('/main')
    },
    onopen() {
      // this.$toast.success('服务器连接成功')
      console.log('连接成功')
    }
  }
}
</script>
<style scoped lang="scss"></style>
