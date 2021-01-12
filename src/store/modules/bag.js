const state = {
  bagLists: []
}

const mutations = {
  setBagLists: (state, n) => (state.bagLists = n)
}

const actions = {
  setBagLists({ commit }, n) {
    commit('setBagLists', n)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
