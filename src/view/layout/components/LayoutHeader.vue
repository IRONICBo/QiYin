<script setup>
import { ref } from 'vue';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue'

// TODO: Get the recommend search from backend  
const recommendSearch = ref('华中科技大学')

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
        <el-input
            class="qiyin-search-input"
            v-model="input1"
            size="large"
            :placeholder="recommendSearch"
        >
        <template #append>
            <el-button type="danger">
            <el-icon><Search /></el-icon>
            搜索</el-button>
        </template>
        </el-input>
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
        <el-button type="danger" class="login-button" plain round>
            <el-icon><Avatar /></el-icon>
            登录</el-button>
    </el-menu-item>
  </el-menu>
</template>

<style lang="less" scoped>
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

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.qiyin-search-input {
    margin-left: 200px;
    width: 500px;
}

</style>
