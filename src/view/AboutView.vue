<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import LoginDialog from '../components/LoginDialog.vue'
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <LoginDialog
    title="登录"
    subtitle="收藏点赞评论随心发"
    :visible=true
  />
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
