<script setup>
	import LoginDialog from '../components/LoginDialog.vue'
	import CommentDrawer from '../components/CommentDrawer.vue'

    import { reactive} from "vue";
    const state = reactive({
      isLoginVisible:false,
      commentVisible:false
    })
    const changeVisible=(val)=>{
	    state.isLoginVisible=val
    }

    const closeComments=(val)=>{
    	state.commentVisible=val
    }
</script>

<template>
    <div class="about" id="login">
        <button @click="state.isLoginVisible=true">登录</button>
        <button @click="state.commentVisible=true">评论</button>
    </div>
    <LoginDialog
        title="登录"
        subtitle="收藏点赞评论随心发"
        :visible="state.isLoginVisible"
        @changeVisible="changeVisible"
    />
    <CommentDrawer
            :modelVisible="state.commentVisible"
            @changeVisible="closeComments"
            videoId=1
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
