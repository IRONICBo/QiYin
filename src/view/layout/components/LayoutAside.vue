<script setup>
import { ref } from 'vue';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import {accountStoreWidthOut, loginStoreWidthOut} from "../../../stores/user";
import {ElMessage} from "element-plus";
import StorageUtil from "../../../utils/localStorage";

const isCollapse = ref(false)
const router = useRouter();

const handleOpen = (key, keyPath) => {
    console.log(key)
    // 跳转到信息发布页面
    if(key === "9") {
	    router.push({
          path:'/upload',
        })
    }
    // 跳转到我的页面
    else if(key === "10" || key=== 10) {
    	// 查看是否是登录状态 如果是才能进行跳转
      if(loginStoreWidthOut().getLoginStatus && StorageUtil.get("accountId") !== ""){
	      router.push({
		      path:'/userInfo',
		      query:{
			      userId:StorageUtil.get("accountId")
		      }
	      })
      }else{
	      ElMessage({
		      showClose: true,
		      message: "请登录后查看个人信息",
		      type: "error",
	      });
      }
    }else if(key === "1" || key === "2" || key === "3" || key === "4" || key === "5" || key === "6" || key === "7" ){
	    router.push({
		    path:'/videoTag',
		    query:{
			    tagId:key
		    }
	    })
    }
    else if(key === "0" ){
	    router.push({
		    path:'/recommend',
	    })
    }
}
const handleClose = (key, keyPath) => {
  console.log(key)
}
</script>

<template>
  <el-menu
    default-active="0"
    class="qiyin-aside"
    @select="handleOpen"
  >
    <el-menu-item index="0">
        <el-icon><Opportunity /></el-icon>
        <template #title>推荐</template>
    </el-menu-item>
    <el-menu-item index="1">
        <el-icon><TrendCharts /></el-icon>
        <template #title>热门</template>
    </el-menu-item>
    <el-menu-item index="2">
        <el-icon><VideoCameraFilled /></el-icon>
        <template #title>风景</template>
    </el-menu-item>
    <el-menu-item index="3">
        <el-icon><Ticket /></el-icon>
        <template #title>宠物</template>
    </el-menu-item>
    <el-menu-item index="4">
        <el-icon><Expand /></el-icon>
        <template #title>体育</template>
    </el-menu-item>
    <el-menu-item index="5">
        <el-icon><KnifeFork /></el-icon>
        <template #title>美食</template>
    </el-menu-item>
    <el-menu-item index="6">
        <el-icon><Stamp /></el-icon>
        <template #title>娱乐</template>
    </el-menu-item>
    <el-menu-item index="7">
        <el-icon><GoodsFilled /></el-icon>
        <template #title>时尚</template>
    </el-menu-item>

    <el-divider />
    <el-menu-item index="9">
        <el-icon><HelpFilled /></el-icon>
        <template #title>投稿</template>
    </el-menu-item>
    <el-menu-item index="10" style="">
        <el-icon><UserFilled /></el-icon>
        <template #title>我的</template>
    </el-menu-item>

  </el-menu>
</template>

<style lang="less" scoped>
.qiyin-aside {
    padding: 20px 0px;
    height: 100vh;
    position: fixed;
    top:60px;
    z-index: 10
}

.el-menu-item {
    margin: 5px 10px;
}

.el-menu-item:hover {
    background-color: var(--el-color-primary-light-9);
    border-radius: var(--el-component-size-small);
    padding-right: var(--el-component-size-large);
}

.is-active {
    background-color: var(--el-color-primary-light-9);
    border-radius: var(--el-component-size-small);
    padding-right: var(--el-component-size-large);
}
</style>
