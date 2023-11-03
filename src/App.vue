<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="go">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </transition>
  </RouterView>
</template>

<style scoped>
</style>
