<script setup lang="ts">

defineProps<{
  icon: string,
  width?: string | number,
  height?: string | number,
  color?: string,
}>()
</script>
<template>
  <Icon :icon="icon" :width="width" :height="height" :color="color" />
</template>
<style scoped></style>
