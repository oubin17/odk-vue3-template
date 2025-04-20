<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import type { UserEntity } from '@/types/user';
import { UserStatusMap } from '@/types/user'; // 导入 UserStatusMap
import { get } from '@/utils/api';
import { onMounted, ref } from 'vue';
const counter = useCounterStore()

const userInfo = ref<UserEntity>();

// 登录方法
const queryUserInfo = async () => {
  const res = await get<UserEntity>('/user/query')
  userInfo.value = res
}

onMounted(() => {
  queryUserInfo()
})
</script>

<template>
  <div v-if="userInfo">
    <p>用户ID：{{ userInfo.userId }}</p>
    <p>用户名：{{ userInfo.userProfile.userName }}</p>
    <p>用户状态：{{ UserStatusMap[userInfo.userStatus] }}</p>
  </div>
  <el-button @click="counter.increment">
    演示 Pinia 使用：count is {{ counter.doubleCount }}
  </el-button>
  <RouterLink :to="{ name: 'dynamic', params: { id: counter.doubleCount + 1 } }">动态路由到 /dynamic/{{ counter.doubleCount
    }}</RouterLink>

  <RouterLink :to="{ name: 'about' }">Go to About</RouterLink>
  <RouterLink to="/about">Go to About</RouterLink>

</template>
