<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { LoginParams, LoginResult } from '@/types/user'
import { useUserStore } from '@/stores/user'

//获取用户登录 store
const userStore = useUserStore()

const loginRes = ref(userStore.userInfo)


onMounted(() => {
  if (!userStore.isLoggedIn) {
    const params: LoginParams = {
      loginId: 'root',
      loginType: '1',
      identifyType: '1',
      identifyValue: '123456'
    }
    userStore.login(params).then((res: LoginResult) => {
      console.log(res)
    }).catch(err => {
      console.log('登录失败：', err)
    })
  }
})

</script>
<template>
  <div v-if="userStore.isLoggedIn">
    <h2>已登录</h2>
    <p>用户名：{{ userStore.userInfo?.userProfile.userName }}</p>
    <p>用户ID：{{ userStore.userInfo?.userId }}</p>
  </div>
  <div v-else>
    <h2>未登录</h2>
    <p>请先登录</p>
  </div>
  <div class="debug-info">
    <h3>调试信息</h3>
    登录信息：{{ loginRes }}
  </div>
</template>
<style scoped>
.debug-info {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
}
</style>
