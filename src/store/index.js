import Vue from 'vue'
import Vuex from 'vuex'
import about from './module/about'
Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
      about
    }
  })
}
