<script setup>
import LayoutContent from './components/LayoutContent.vue';
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutAside from './components/LayoutAside.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <div class="base">
        <el-container>
            <el-header>
                <layout-header />
            </el-header> 
            <el-container>
                <el-aside><layout-aside /></el-aside>
                <el-main><layout-content /></el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="less" scoped>
.base {
    min-height: 100vh;
    background-color: var(--el-color-info-light-9);
}
</style>
