
import { createStore } from 'vuex'
 
export const store = createStore({
  state() {
    return {
      hadconnect: false
    }
  },
  mutations: {
    setWalletConnected(state) {
      state.hadconnect = true
    },
    setWalletDisconnect(state) {
      state.hadconnect = false
    }
  },
  actions: {
   
  },
  getters: {
   
  }
})