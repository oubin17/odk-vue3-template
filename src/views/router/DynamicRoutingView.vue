<script setup lang="ts">
</script>
<template>
  动态路由：传递过来的参数是：{{ $route.params.id }}
  <RouterLink to="/dynamic/1/nest/2">嵌套路由：Go to Nest</RouterLink>
  <RouterView />
</template>
<style scoped></style>
