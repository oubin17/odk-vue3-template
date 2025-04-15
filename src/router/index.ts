import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DynamicRoutingView from '@/views/router/DynamicRoutingView.vue'
import NestRoutingView from '@/views/router/NestRoutingView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  //动态导入
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  // 动态字段以冒号开始
  {
    path: '/dynamic/:id',
    name: 'dynamic',
    component: DynamicRoutingView,
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

export default router
