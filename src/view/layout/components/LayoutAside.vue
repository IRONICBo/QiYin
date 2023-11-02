<script setup>
import { ref } from 'vue';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
<el-row class="aside">
123
</el-row>
</template>

<style lang="less" scoped>
.aside {
    width: 100px;
}
</style>
