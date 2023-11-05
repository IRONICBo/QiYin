<script setup lang="ts">
import { onMounted, ref } from 'vue';
// import uploadInfoStoreWidthOut from '@/stores/qiniu'


import { inferenceSqueezenet } from '@/utils/predict'

const token = ref('')
// const uploadInfoStore = uploadInfoStoreWidthOut()
const videoURL = ref([])
const coverURLList = ref([])


onMounted(async () => {
    // videoURL.value = uploadInfoStore.videoURL
    // coverURLList.value = uploadInfoStore.coverURLList
    // console.log("Get uploadInfoStore => ",  uploadInfoStore)
    // console.log("Get videoURL => ",  videoURL)
    // console.log("Get coverURLList => ",  coverURLList)

    const url = "./assets/logo.png"
    // const url = "http://s3h1q0hvd.bkt.clouddn.com/0703b806-699a-415e-abe7-cb726c46abbf_000001.jpg"
    var [inferenceResult,inferenceTime] =  await inferenceSqueezenet(url)
    // console.log("inferenceResult => ",  inferenceResult)
    // console.log("inferenceTime => ",  inferenceTime)
})

</script>

<template>
    <img id="img" :src="coverURLList[0]" alt="" />
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