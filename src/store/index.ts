import { createStore } from 'vuex'
import auth from './modules/auth'
import search from './modules/search'
import friends from './modules/friends'
import wall from './modules/wall'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    search,
    friends,
    wall
  }
})
