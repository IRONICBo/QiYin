<script setup>
import { onMounted, ref } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue'
import { getToken } from '@/api/qiniu';
import * as qiniu from "qiniu-js";
import { v4 as uuidv4 } from 'uuid';
import uploadInfoStoreWidthOut from '@/stores/qiniu'

const token = ref('')
const uploadInfoStore = uploadInfoStoreWidthOut()

onMounted(async () => {
    const videoURL = uploadInfoStore.videoURL
    const coverURLList = uploadInfoStore.coverURLList
    console.log("Get uploadInfoStore => ",  uploadInfoStore)
    console.log("Get videoURL => ",  videoURL)
    console.log("Get coverURLList => ",  coverURLList)
})

</script>

<template>
</template>

<style lang="less" scoped>
.upload {
    padding: 30px;
}

.upload-picker {
    #el-upload-dragger {
        background-color: aqua;
    }
}

.upload-tabs {
    margin-top: 35px;
    height: 48px;
    font-size: 18px;
    line-height: 48px;
}
</style>