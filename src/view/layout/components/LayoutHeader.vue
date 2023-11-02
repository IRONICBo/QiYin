<script setup>
import { ref } from 'vue';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

</script>

<template>
<el-row>
    <el-col :span="6">
        <span class="span">柒音</span>
    </el-col>
    <el-col :span="1" :offset="16">
        <el-dropdown v-model="method">
            <el-icon style="color: #337ecc;padding-top:2vh;"><Setting /></el-icon>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="jumpToConfig()"> Config </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </el-col>
    <el-col :span="1" >
        <el-dropdown v-model="method">
            <el-icon style="color: #337ecc;padding-top:2vh;"><User /></el-icon>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="logoutAndClean()"> Logout </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </el-col>
</el-row>
</template>

<style lang="less" scoped>
</style>
