<template>
  <div class="game-time">
    <img
      :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeeAD_gwAAADFV_4fAg517.png`"
      alt=""
      v-if="!center && gameTime.length > 20"
    />
    <img :src="`${this.PATH.fileServerPreName}B/CgUEPF_1WeeADaZdAAACnh3vuUk626.png`" alt="" v-if="center || gameTime.length < 20" />
    <span class="text-light-pri fs-sm">{{ gameTime }}</span>
  </div>
</template>
<script>
export default {
  props: {
    center: { default: true }
  },
  data() {
    return {}
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
    }
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.game-time {
  height: 25px;
  padding: 0 10px;
  @extend .ai-center;
  span {
    position: relative;
    z-index: 2;
    margin-top: 5px;
  }
  img {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
}
</style>
