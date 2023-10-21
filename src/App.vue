<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import useSettingsStore from '@/stores/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import { testApi } from "@/api/test";

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
  test()
})

const test = async () => {
  const data = await testApi();
  console.log(data)
  console.log('test End')
}
</script>

<style scoped>
</style>
