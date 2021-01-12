const state = {
  RECEIVERTYPEID: [
    '1', // 群组
    '2' // 个人
  ],
  msgLists: [],
  msgMaxCount: 10 // 存放最多消息数
}

const mutations = {
  setMsgLists: (state, n) => (state.msgLists = n),
  setMsgMaxCount: (state, n) => (state.msgMaxCount = n)
}

const actions = {
  setMsgLists({ commit }, n) {
    commit('setMsgLists', n)
  },
  setMsgMaxCount({ commit }, n) {
    commit('setMsgMaxCount', n)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
