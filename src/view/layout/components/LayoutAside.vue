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

const isCollapse = ref(false)
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const router = useRouter();

const menuList = ref([
    {
        id: 1,
        name: 'Dashboard',
        icon: 'el-icon-s-home',
        path: '/dashboard'
    },
    {
        id: 2,
        name: 'Upload',
        icon: 'el-icon-upload',
        path: '/upload'
    },
    {
        id: 3,
        name: 'Download',
        icon: 'el-icon-download',
        path: '/download'
    },
    {
        id: 4,
        name: 'Config',
        icon: 'el-icon-setting',
        path: '/config'
    },
    {
        id: 5,
        name: 'User',
        icon: 'el-icon-user',
        path: '/user'
    },
]);
</script>

<template>
  <el-menu
    default-active="1"
    class="qiyin-aside"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="1">
        <el-icon><Opportunity /></el-icon>
        <template #title>推荐</template>
    </el-menu-item>
    <el-menu-item index="2">
        <el-icon><TrendCharts /></el-icon>
        <template #title>热门</template>
    </el-menu-item>
    <el-menu-item index="3">
        <el-icon><VideoCameraFilled /></el-icon>
        <template #title>风景</template>
    </el-menu-item>
    <el-menu-item index="4">
        <el-icon><Ticket /></el-icon>
        <template #title>宠物</template>
    </el-menu-item>
    <el-menu-item index="5">
        <el-icon><Expand /></el-icon>
        <template #title>体育</template>
    </el-menu-item>
    <el-menu-item index="6">
        <el-icon><KnifeFork /></el-icon>
        <template #title>美食</template>
    </el-menu-item>
    <el-menu-item index="7">
        <el-icon><Stamp /></el-icon>
        <template #title>娱乐</template>
    </el-menu-item>
    <el-menu-item index="8">
        <el-icon><GoodsFilled /></el-icon>
        <template #title>时尚</template>
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
