<script setup>
	import LoginDialog from '../components/LoginDialog.vue'
	import CommentDrawer from '../components/CommentDrawer.vue'
	import Search from '../components/Search.vue'

    import { reactive} from "vue";
		import {favoriteAction} from "../api/favorite";
		import {ElMessage} from "element-plus";
    const state = reactive({
      isLoginVisible:false,
      commentVisible:false,
      canFavorite:1,
	    videoId:1
    })
    const changeVisible=(val)=>{
	    state.isLoginVisible=val
    }

    const closeComments=(val)=>{
    	state.commentVisible=val
    }

    const favorite =() =>{
	    state.canFavorite=-1*state.canFavorite
	    favoriteAction( {videoId: parseInt(state.videoId, 10),actionType:state.canFavorite } ).then((res) => {
            if (res.code === 200) {
                            ElMessage.success("成功")
            } else {
                ElMessage.error("获取评论失败！")
            }
        }).catch(error=>{
            ElMessage.error("失败！")
        })
    }
</script>

<template>
    <div class="about" id="login">
        <button @click="state.isLoginVisible=true">登录</button>
        <button @click="state.commentVisible=true">评论</button>
        <button @click="favorite">{{state.canFavorite === 1? "点赞":"取消点赞"}}</button>
        <div>
            <Search></Search>
        </div>
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
            :videoId="state.videoId"
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
