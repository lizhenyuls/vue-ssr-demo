import Vue from 'vue'
import Router from 'vue-router'
import routers from './routers'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    base: process.env.VUE_APP_BASE_URL,
    routes: routers
  })
}
