<script setup>
import { onMounted, ref } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue'
import { getToken } from '@/api/qiniu';
import * as qiniu from "qiniu-js";

const token = ref('')

const carouselURL = [
    'https://static-file.qiniu.io/www/admin/1695806481/9.27.jpg',
    'http://s3h1q0hvd.bkt.clouddn.com/qiniu_banner.png',
]
const uploadTabs = ref('first')

onMounted(async () => {
    const res = await getToken()
    token.value = res.data.upload_token
    console.log("Get QiNiu web token => ",  token.value)
})

const uploadFile = (file) => {
    const key = file.name; 
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
        },
        complete(res) {
            console.log(res);

            // TODO:Get the file's url
            // {
            //     "key": "7256308498059873594.mp4",
            //     "hash": "Fp8usdKDgKhlidI4SeV1VebFuXkr",
            //     "bucket": "1024qiyin",
            //     "fsize": 1222554,
            //     "name": "null"
            // }
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
        <el-carousel height="135px">
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