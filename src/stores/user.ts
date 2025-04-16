import type { LoginParams, LoginResult } from '@/types/user'
import { post } from '@/utils/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 从 localStorage 恢复用户信息
    const storedUserInfo = localStorage.getItem('userInfo')

    // 用户登录信息
    const userInfo = ref<LoginResult | null>(storedUserInfo ? JSON.parse(storedUserInfo) : null)

    const isLoggedIn = ref(!!userInfo.value)

    const login = async (params: LoginParams): Promise<LoginResult> => {
      try {
        const res = await post<LoginResult>('/user/login', params)
        userInfo.value = res
        isLoggedIn.value = true

        return res
      } catch (error) {
        console.error('登录失败', error)
        throw error
      }
    }

    const logout = () => {
      userInfo.value = null
      isLoggedIn.value = false
    }

    return { userInfo, isLoggedIn, login, logout }
  },
  {
    //依赖 pinia 持久化插件，能够将数据写到 localStorage 中
    persist: true,
  },
)
