import { Toast } from 'vant'

const GROUPID = '99999'

let state = {
  wsReadyState: false, // ws连接状态
  tel: '', // （用户名）手机号
  GROUPID: GROUPID, // 群组的id
  subscribeCommand: `subscribe:${GROUPID}`, // 订阅群组的ws命令
  subscribeCommandOfUser: `subscribe:${GROUPID}@{USER}`, // 订阅个人的ws命令
  wsMsg: '', // websocket message
  userName: '', // 用户名
  gameStartTime: '', // 游戏开始时间
  gameEndTime: '', // 游戏结束时间
  gameStart: false, // 游戏是否开始
  THEMETYPEVALIDITYPERIOD:10,//红包过期时间
  THEMETYPEID: '', // 主题
  UserID: '', // 用户手机号
  DESKUSERID: '', // 用户id
  exitModelShow: false // 是否退出弹窗
}

const mutations = {
  setWsReadyState: (state, n) => (state.wsReadyState = n),
  setTel: (state, n) => (state.tel = n),
  setWsMsg: (state, n) => (state.wsMsg = n),
  setUserName: (state, n) => (state.userName = n),
  showOverlayShow(state, n) {
    Toast.loading({
      duration: 0,
      message: n,
      forbidClick: true,
      loadingType: 'spinner'
    })
  },
  setGameStartTime: (state, n) => (state.gameStartTime = n),
  setGameEndTime: (state, n) => (state.gameEndTime = n),
  setTHEMETYPEVALIDITYPERIOD: (state, n) => (state.THEMETYPEVALIDITYPERIOD = n),
  setGameStart: (state, n) => (state.gameStart = n),
  setTHEMETYPEID: (state, n) => (state.THEMETYPEID = n),
  setUserID: (state, n) => (state.UserID = n),
  setDESKUSERID: (state, n) => (state.DESKUSERID = n),
  setExitModelShow: (state, n) => (state.exitModelShow = n)
}

const actions = {
  setWsReadyState({ commit }, n) {
    commit('setWsReadyState', n)
  },
  setTel({ commit }, n) {
    commit('setTel', n)
  },
  setWsMsg({ commit }, n) {
    commit('setWsMsg', n)
  },
  setUserName({ commit }, n) {
    commit('setUserName', n)
  },
  showOverlayShow({ commit }, n) {
    if (n === undefined) {
      n = '数据加载中'
    } else if (n === 'none') {
      n = ''
    }
    commit('showOverlayShow', n)
  },
  setGameStartTime({ commit }, n) {
    commit('setGameStartTime', n)
  },
  setGameEndTime({ commit }, n) {
    commit('setGameEndTime', n)
  },
  setTHEMETYPEVALIDITYPERIOD({ commit }, n) {
    commit('setTHEMETYPEVALIDITYPERIOD', n)
  },
  setGameStart({ commit }, n) {
    commit('setGameStart', n)
  },
  setTHEMETYPEID({ commit }, n) {
    commit('setTHEMETYPEID', n)
  },
  setUserID({ commit }, n) {
    commit('setUserID', n)
  },
  setDESKUSERID({ commit }, n) {
    commit('setDESKUSERID', n)
  },
  setExitModelShow({ commit }, n) {
    commit('setExitModelShow', n)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
