/**
 * vuex
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import app from './modules/app'
import msg from './modules/msg'
import bag from './modules/bag'

export default new Vuex.Store({
  modules: {
    app,
    msg,
    bag
  }
})
