<script setup lang="ts">
defineProps({
  nestId: {
    type: String,
    required: true,
  },
});
</script>
<template>
  嵌套路由:传递过来的参数是：{{ $route.params.nestId }} 或者 {{ nestId }}
</template>
<style scoped></style>
