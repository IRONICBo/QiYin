<script setup>
	import LoginDialog from '../components/LoginDialog.vue'
	import CommentDrawer from '../components/CommentDrawer.vue'
	import Search from '../components/Search.vue'
	import Circle from '../components/Circle.vue'

    import { reactive} from "vue";
    import {collectionAction, favoriteAction} from "../api/favorite";
    import {ElMessage} from "element-plus";
    const state = reactive({
      isLoginVisible:false,
      commentVisible:false,
      canFavorite:1,
      canCollection:1,
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
                            // ElMessage.success("成功")
            } else {
                ElMessage.error("赞操作失败！")
            }
        }).catch(error=>{
            ElMessage.error("失败！")
        })
    }


    const collection =() =>{
	    state.canCollection=-1*state.canCollection
	    collectionAction( {videoId: parseInt(state.videoId, 10),actionType:state.canCollection } ).then((res) => {
            if (res.code === 200) {
                            // ElMessage.success("成功")
            } else {
                ElMessage.error("赞操作失败！")
            }
        }).catch(error=>{
            ElMessage.error("失败！")
        })
    }
</script>

<template>
    <div class="about" id="login">
<!--        <button @click="state.isLoginVisible=true">登录</button>-->
<!--        <button @click="state.commentVisible=true">评论</button>-->
        <button @click="favorite">{{state.canFavorite === 1? "点赞":"取消点赞"}}</button>
        <div>
            <Search></Search>
            <Circle :visible="s"/>
        </div>

    </div>
    <CommentDrawer
            :modelVisible="state.commentVisible"
            @changeVisible="closeComments"
            :videoId="state.videoId"
    />

    <div class="tool-wrapper">
        <div class="tool" @click="collection">
            <el-icon size="50" color="#f5f7fa" v-if="state.canCollection === 1"><Star /></el-icon>
            <el-icon size="50" color="yellow"><StarFilled /></el-icon>
        </div>
        <div class="tool" @click="favorite">
            <el-icon size="50" color="#f5f7fa" v-if="state.canFavorite === 1"><MagicStick /></el-icon>
            <el-icon size="50" color="#red" v-else><MagicStick /></el-icon>
        </div >
        <div class="tool" @click="state.commentVisible=true">
            <el-icon size="50" color="#f5f7fa"><ChatDotRound /></el-icon>
        </div>
    </div>

</template>

<style lang="less">
    .tool-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 50px;
        .tool{
            margin: 20px 0;
            :hover{
                cursor: pointer;
            }
        }
    }
    @media (min-width: 1024px) {
        .about {
            min-height: 100vh;
            display: flex;
            align-items: center;
        }
    }
</style>
