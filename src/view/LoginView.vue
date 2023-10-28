<script setup>
	import LoginDialog from '../components/LoginDialog.vue'
    import { reactive} from "vue";
		import {accountStoreWidthOut, tokenStoreWidthOut} from "../stores/user";
    const state = reactive({
      isLoginVisible:false
    })
    const changeVisible=(val)=>{
	    state.isLoginVisible=val
    }
    // const demoStore = accountStoreWidthOut()
</script>

<template>
    <div class="about" id="login">
        <button @click="state.isLoginVisible=true">登录</button>
<!--        <div>{{demoStore.account.name}}</div>-->
    </div>
    <LoginDialog
        title="登录"
        subtitle="收藏点赞评论随心发"
        :visible="state.isLoginVisible"
        @changeVisible="changeVisible"
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
