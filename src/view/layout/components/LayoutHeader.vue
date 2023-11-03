<script setup>
	import {ref, watch} from 'vue';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Search from '../../../components/Search.vue'
import LoginDialog from '../../../components/LoginDialog.vue'
import {checkToken, getUserInfo} from '../../../api/login'
import {loginStoreWidthOut} from '../../../stores/user';

import { reactive} from "vue";
import StorageUtil from "../../../utils/localStorage";
const state = reactive({
	isLoginVisible:false,
	isLogin:false,
    userInfo:{}
})
const changeVisible=(val)=>{
	state.isLoginVisible=val
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
	//  点击跳转到用户信息页面
    }

    const handleClick =()=>{
      StorageUtil.remove("token")
      StorageUtil.remove("accountId")
      loginStoreWidthOut().setLoginStatus(false)
      state.isLogin =false
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

    <el-menu-item index="1">
        <Search/>
    </el-menu-item>

    <div class="flex-grow" />
    
    <el-menu-item index="2">
        <span class="icon-with-info">
            <el-icon><InfoFilled /></el-icon>
            <span class="icon-info">关于</span>
        </span>
        <span class="icon-with-info">
            <el-icon><HelpFilled /></el-icon>
            <span class="icon-info">稿件</span>
        </span>
        <span class="icon-with-info">
            <el-icon><Promotion /></el-icon>
            <span class="icon-info">柒音</span>
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
            <template #dropdown>c
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
</template>

<style lang="less" scoped>
    .el-menu--horizontal>.el-menu-item .is-active:nth-child(1){
        align-items:  self-start !important;
        margin-top: 7px;
    }

    .el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover{
        background: rgba(1,1,1,0) !important;
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

.el-menu-item.is-active {
    // cancel choose
    border: 0px !important;
    align-items:  self-start !important;
    margin-top: 8px;
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
