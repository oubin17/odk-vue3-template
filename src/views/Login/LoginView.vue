<script setup lang="ts">
import { post } from '@/utils/api'
import { onMounted, ref } from 'vue'

interface LoginParams {
  loginId: string
  loginType: string
  identifyType: string
  identifyValue: string
}
interface AccessToken {
  tokenType: string
  tokenValue: string
}
interface UserProfile {
  userName: string
  gender: string | null
  birthDay: string | null
}

interface LoginResult {
  userId: string,
  userType: string,
  userStatus: string,
  "accessToken": AccessToken,
  "userProfile": UserProfile,
  "token": string,
}
const login = async (params: LoginParams): Promise<LoginResult> => {
  const res = await post('/user/login', params)
  return res as LoginResult
}

const loginRes = ref<LoginResult>()

onMounted(() => {
  const params: LoginParams = {
    loginId: 'root',
    loginType: '1',
    identifyType: '1',
    identifyValue: '123456'
  }
  login(params).then((res: LoginResult) => {
    loginRes.value = res
    console.log(res)
  })
})

</script>
<template>
  登录信息：{{ loginRes }}
</template>
<style scoped></style>
