<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()

</script>

<template>
  <button @click="counter.increment">
    演示 Pinia 使用：count is {{ counter.doubleCount }}
  </button>
  <RouterLink :to="{ name: 'dynamic', params: { id: counter.doubleCount + 1 } }">动态路由到 /dynamic/{{ counter.doubleCount
    }}</RouterLink>

  <RouterLink :to="{ name: 'about' }">Go to About</RouterLink>
  <RouterLink to="/about">Go to About</RouterLink>
</template>
