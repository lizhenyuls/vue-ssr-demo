import { createApp } from './main'

const { app, router, store } = createApp()

// 如果有__INITIAL_STATE__变量，则将store的状态用它替换
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
// 当前运行环境
const isClient = process.env.NODE_ENV === 'development' || (process.env.NODE_ENV !== 'development' && !window.hasOwnProperty('__INITIAL_STATE__') && !window.hasOwnProperty('__serverRenderError__'))

const log = (color, i) => {
  console.log(`%c--${!isClient ? '客户端兼容模式' : '纯客户端'}渲染${i || ''}--`, `color:${color};font-size:12px;font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,Roboto,Noto Sans,-apple-system,BlinkMacSystemFont,sans-serif;`)
}

// 拉取当前路由数据
const feCompatibleRende = (route) => {
  if (isClient && route && route.meta && route.meta.title) document.title = route.meta.title

  let matched = router.getMatchedComponents(route)
  log('#2d8cf0')
  // 组件数据通过执行asyncData方法获取
  const asyncDataHooks = matched.map(c => c.asyncData).filter(_ => _)
  if (!asyncDataHooks.length) {
    return false
  }
  Promise.all(asyncDataHooks.map(hook => hook({ store, route })))
    .then(() => {
      log('#12cd5e', '成功')
    })
    .catch(() => {
      log('#ff0000', '失败')
    })
}

router.onReady((currentRoute) => {
  // 如果__serverRenderError__变量为true，服务端渲染异常，则vue降级前端渲染; isClient为true，开发环境或者纯客户端环境；为false，服务端渲染环境
  if (window.__serverRenderError__ || isClient) feCompatibleRende(currentRoute)
  // 通过路由勾子，执行拉取数据逻辑
  router.beforeResolve((to, from, next) => {
    if (to && to.meta && to.meta.title) document.title = to.meta.title
    // 找到增量组件，拉取数据
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    // 组件数据通过执行asyncData方法获取
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }
    // 要注意asyncData方法要返回promise，asyncData调用的vuex action也必须返回promise
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        next()
      })
      .catch(next)
  })
  // 将Vue实例挂载到dom中，完成浏览器端应用启动
  app.$mount('#app')
})
