<script setup>
import {ref, watch} from 'vue';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Search from '../../../components/Search.vue'
import Circle from '../../../components/Circle.vue'
import LoginDialog from '../../../components/LoginDialog.vue'
import {checkToken, getUserInfo} from '../../../api/login'
import {loginStoreWidthOut} from '../../../stores/user';
import {ElMessage, ElMessageBox} from "element-plus";

import { reactive} from "vue";
import StorageUtil from "../../../utils/localStorage";
import SessionStorageUtil from "../../../utils/sessionStorage";

const router = useRouter();
const state = reactive({
	isLoginVisible:false,
	isLogin:false,
    userInfo:{},
	styleVisible:false
})
const changeVisible=(val)=>{
	state.isLoginVisible=val
}

const changeStyleVisible=(val)=>{
    state.styleVisible=val
}

const changeLogin=(val)=>{
	state.isLogin=val
}

// 获取token 如果有效  则直接就是登录状态
const check =()=>{
	checkToken().then((res) => {
        if (res.code === 200) {
            state.isLogin = true
	        loginStoreWidthOut().setLoginStatus(true)
            state.userInfo = res.data
          //说明没有选择风格
          if ((res.data.style === null || res.data.style=== 0  || res.data.style=== "" )&& !SessionStorageUtil.get('style')){
          	state.styleVisible=true
          }
        } else {
            console.log("登录失败")
        }
    }).catch(error=>{
        console.log("失败")
    })
}


onMounted(() => {
	check()
})

watch(()=>[state.isLogin],([newIsLogin],[oldIsLogin])=>{
    if (newIsLogin && newIsLogin !== oldIsLogin && !state.userInfo.name) {
	    check()
    }
})

    const gotoUser=()=>{
	    router.push({
		    path:'/userInfo',
		    query:{
			    userId:StorageUtil.get("accountId")
		    }
	    })
    }

    const handleClick =()=>{
      StorageUtil.remove("token")
      StorageUtil.remove("accountId")
      loginStoreWidthOut().setLoginStatus(false)
      state.isLogin =false
    }

const toInfo = () => {
    ElMessageBox({
        title: "关于柒音",
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: `
        <pre>
比赛官网：https://www.qiniu.com

前端：https://github.com/IRONICBo/QiYin
后端：https://github.com/IRONICBo/QiYin_BE
算法：https://github.com/IRONICBo/QiYin_AI

Contributor: @IRONICBo @Baihhh @nnnnn319
        </pre>
        `,
    });
}
const toUpload = () => {
    router.push({path:"/upload"})
}
const toHome = () => {
    router.push({path:"/"})
}
const toMe = () => {
    router.push({
        path:'/userInfo',
        query:{
            userId:StorageUtil.get("accountId")
        }
    })
}
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <img
        style="width: 80px"
        src="@/assets/logo.png"
        alt="柒音"
      />
    </el-menu-item>

    <div class="flex-grow" />

    <el-menu-item index="1" class="search-menu">
        <Search/>
    </el-menu-item>

    <div class="flex-grow" />
    
    <el-menu-item index="2">
        <span class="icon-with-info" @click="toInfo">
            <el-icon><InfoFilled /></el-icon>
            <span class="icon-info">关于</span>
        </span>
        <span class="icon-with-info" @click="toUpload">
            <el-icon><HelpFilled /></el-icon>
            <span class="icon-info">投稿</span>
        </span>
        <span class="icon-with-info" @click="toHome">
            <el-icon><Promotion /></el-icon>
            <span class="icon-info">柒音</span>
        </span>
        <span v-if="!state.isLoginVisible" class="icon-with-info" @click="toMe">
            <el-icon><UserFilled /></el-icon>
            <span class="icon-info">我的</span>
        </span>
    </el-menu-item>

    <el-menu-item index="3">
        <el-button type="danger" class="login-button" plain round @click="state.isLoginVisible=true" v-if="!state.isLogin">
            <el-icon><Avatar /></el-icon>
            登录</el-button>
        <el-dropdown v-else trigger="hover">
            <div class="block"  @click="gotoUser">
                <el-avatar :size="35" :src="state.userInfo.avatar" style="margin-right: 6px"/>
                <span>{{state.userInfo.name || "用户"}}</span>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="handleClick">登出</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </el-menu-item>
  </el-menu>
    <LoginDialog
        title="登录"
        subtitle="收藏点赞评论随心发"
        :visible="state.isLoginVisible"
        @changeVisible="changeVisible"
        @changeLogin="changeLogin"
    />

    <Circle
        :visible="state.styleVisible"
        @changeVisible="changeStyleVisible"
    />
</template>

<style lang="less" scoped>
    .el-menu-demo{
        position: fixed;
        top:0;
        left: 0;
        right: 0;
        z-index: 10;

        .search-menu{
            align-items: flex-start;
        }
        .el-menu-item .is-active .search-menu{
            align-items: flex-start;
            margin-top: 8px !important;
        }
    }
    .el-menu--horizontal>.el-menu-item .is-active:nth-child(1){
        align-items:  self-start !important;
        margin-top: 7px;
    }

    .el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover{
        background: rgba(1,1,1,0) !important;
    }

    .el-menu--horizontal>.el-menu-item.is-active{
        border-bottom: 0;
    }
    .flex-grow {
      flex-grow: 1;
    }

.login-button {
    padding: 18px 20px;
}

.el-menu-item:hover{
    background-color: var(--el-bg-color) !important;
}

.el-menu-item .is-active {
    // cancel choose
    border: 0px !important;
    align-items:  self-start !important;
    margin-top: 8px !important;
}

.icon-with-info {
    margin: 0px 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--el-color-info);
    cursor: pointer;

    .icon-info {
        font-weight: 400;
        font-size: 12px;
        -webkit-transform: scale(0.833);
        -moz-transform: scale(0.833);
        transform: scale(0.833);
        line-height: 14px;

        // elementui icon contans this property
        margin-right: 5px;
    }
}

.block{
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-top: 3px;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.qiyin-search-input {
    margin-left: 200px;
    width: 500px;
}

</style>
