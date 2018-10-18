import { createApp } from './main'
export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp(context)

    // 设置路由
    router.push(context.url)

    router.onReady(
      (currentRoute) => {
        if (currentRoute && currentRoute.meta && currentRoute.meta.title) context.title = currentRoute.meta.title
        const matchedComponents = router.getMatchedComponents()
        if (!matchedComponents.length) {
          // 前端404
          resolve(app)
        }
        // 执行asyncData方法，预拉取数据
        Promise.all(matchedComponents.map(Component => {
          if (Component.asyncData) {
            return Component.asyncData({
              store: store,
              route: router.currentRoute
            })
          }
        })).then(() => {
          // 将store的快照挂到ssr上下文上
          context.state = store.state
          resolve(app)
        }).catch(() => {
          context.serverError = true
          resolve(app)
        })
      },
      (e) => {
        context.serverError = true
        reject(e)
      }
    )
  })
}
