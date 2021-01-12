<template>
  <div class="main">
    <nav-bar></nav-bar>
    <div class="content"><router-view></router-view></div>
  </div>
</template>

<script>
import navBar from '@/components/nav-bar'
export default {
  components: { navBar },
  data() {
    return {}
  }
}
</script>
<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  @extend .bg-pri, .bg-color-pri;
  .content {
    height: calc(100% - 46px);
    margin-top: $navBarHei;
    overflow: hidden;
  }
}
</style>
