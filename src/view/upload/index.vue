<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { UploadFilled } from '@element-plus/icons-vue'
import { getToken } from '@/api/qiniu';
import * as qiniu from "qiniu-js";
import { v4 as uuidv4 } from 'uuid';
import uploadInfoStoreWidthOut from '@/stores/qiniu'
import {ElMessage} from "element-plus";

const router = useRouter();

const token = ref('')
const carouselURL = [
    'https://static-file.qiniu.io/www/admin/1695806481/9.27.jpg',
    'http://s3h1q0hvd.bkt.clouddn.com/qiniu_banner.png',
]
const uploadTabs = ref('first')
const uuidTicket = ref('')
const coverList = ref([])
const domain = import.meta.env.VITE_QINIU_FILE_DOMAIN
const filename = ref('')


onMounted(async () => {
    uuidTicket.value = uuidv4()
    // Get cover url list
    for (let i = 1; i <= 3; i++) {
        coverList.value.push(domain + '/' + uuidTicket.value + '_00000' + i + '.jpg')
    }

    console.log("Get uuidTicket => ",  uuidTicket.value)
    console.log("Get domain => ",  domain)
    console.log("Get coverList => ",  coverList.value)
    const res = await getToken(uuidTicket.value)
    token.value = res.data.upload_token
    console.log("Get QiNiu web token => ",  token.value)
})

const uploadFile = (file) => {
    const suffix = file.name.split('.').pop();
    const key = uuidTicket.value + '.' + suffix;
    filename.value = key

    const putExtra = {
        fname: key,
        params: {},
        mimeType: null // 上传文件类型限制
    };
    const config = {
        useCdnDomain: true,
    };
    const observable = qiniu.upload(file, key, token.value, putExtra, config);
    const observer = {
        next(res) {
        },
        error(err) {
            console.log(err);
            ElMessage({
              showClose: true,
              message: err,
              type: "error",
            });
        },
        complete(res) {
            console.log(res);
            // Store the upload info
            const uploadInfoStore = uploadInfoStoreWidthOut()
            uploadInfoStore.setVideoURL(domain + '/' + filename.value)
            uploadInfoStore.setCoverURLList(coverList.value)

            const videoURL = uploadInfoStore.videoURL
            const coverURLList = uploadInfoStore.coverURLList
            console.log("Get videoURL => ",  videoURL)
            console.log("Get uploadInfoStore => ",  videoURL)
            console.log("Get coverURLList => ",  coverURLList)

            router.push('/uploadInfo');
            ElMessage({
              showClose: true,
              message: '上传成功，请完善视频信息～',
              type: "success",
            });
        }
    };
    const subscription = observable.subscribe(observer);
}
const handleFileUpload = (params) => {
    console.log(params);
    uploadFile(params.file);
}

</script>

<template>
    <el-card class="upload">
        <el-carousel height="160px">
            <el-carousel-item v-for="url in carouselURL" :key="url">
                <el-image :src="url" :fit="cover" />
            </el-carousel-item>
        </el-carousel>
        <el-tabs v-model="uploadTabs" class="upload-tabs">
            <el-tab-pane label="视频发布" name="first">视频发布</el-tab-pane>
            <el-tab-pane label="图文发布" name="second">图文发布</el-tab-pane>
        </el-tabs>
        <el-upload
        class="upload-picker"
        drag
        :http-request="handleFileUpload"
        >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            直接将视频文件拖入此区域或者<em>&nbsp;点击上传</em>
        </div>
        <template #tip>
            <div class="el-upload__tip">
            <!-- 上传文件大小不能超过 200MB -->
            </div>
        </template>
        </el-upload>

        <el-row :gutter="20">
            <el-col :span="8">
                <el-alert
                    :closable="false"
                    title="视频格式"
                    type="info"
                    description="七牛云存储支持常用格式，建议使用mp4"
                />
            </el-col>
            <el-col :span="8">
                <el-alert
                    :closable="false"
                    title="视频大小"
                    type="info"
                    description="视频文件不超过200MB"
                />
            </el-col>
            <el-col :span="8">
                <el-alert
                    :closable="false"
                    title="视频分辨率"
                    type="info"
                    description="建议分辨率为（1280x720）及以上"
                />
            </el-col>
        </el-row>    
    </el-card>
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