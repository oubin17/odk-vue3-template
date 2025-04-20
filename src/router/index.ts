import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DynamicRoutingView from '@/views/router/DynamicRoutingView.vue'
import NestRoutingView from '@/views/router/NestRoutingView.vue'
import LoginView from '@/views/Login/LoginView.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }, // 需要登录
  },
  //登录
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }, // 明确标记不需要认证
  },
  //动态导入
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true }, // 需要登录
  },
  // 动态字段以冒号开始
  {
    path: '/dynamic/:id',
    name: 'dynamic',
    component: DynamicRoutingView,
    meta: { requiresAuth: true }, // 需要登录
    children: [
      {
        // 当 /dynamic/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'nest/:nestId',
        component: NestRoutingView,
        props: true,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

//添加全局前置路由导航守卫
router.beforeEach((to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      return `/login?redirect=${encodeURIComponent(to.fullPath)}`
    }
  }
  if (to.path === '/login' && userStore.isLoggedIn) {
    return '/'
  }

  // // 如果前往的不是登录页，且用户未登录，则重定向到登录页
  // if (to.path !== '/login' && !userStore.isLoggedIn) {
  //   next({ path: '/login' })
  //   query: {
  //     redirect: to.fullPath
  //   }
  // } else {
  //   next()
  // }
})

export default router
