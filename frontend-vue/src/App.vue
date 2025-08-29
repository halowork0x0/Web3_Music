<script setup>
import HeaderContain from './components/HeaderContain.vue'
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="contain">
    <HeaderContain />
    <RouterView />
  </div>
</template>

<style scoped>
.contain {
  width: 100%;
  height: 100%;
}
</style>
