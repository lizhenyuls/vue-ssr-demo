import Home from '@/views/Home.vue'
const err_404 = () => import(/* webpackChunkName: "error_404" */ '@/views/error-page/404');
export default [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "error_401" */ '@/views/error-page/401'),
    name: 'error_401',
    meta: {
      title: '权限异常'
    }
  },
  {
    path: '/404',
    component: err_404,
    name: 'error_404',
    meta: {
      title: '页面资源未找到'
    }
  },
  {
    path: '/500',
    component: () => import(/* webpackChunkName: "error_500" */ '@/views/error-page/500'),
    name: 'error_500',
    meta: {
      title: '服务器异常'
    }
  },
  {
    path: '*',
    name: 'error',
    component: err_404,
    meta: {
      title: '页面没找到'
    }
  }
]