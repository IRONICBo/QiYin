<script setup>
import { onMounted, ref } from "vue"
import { ElLoading } from 'element-plus'
import { useRoute } from 'vue-router';

const videoURL = ref('')
// const videoURL = ref("http://s3h1q0hvd.bkt.clouddn.com/0595a2b2-34a9-4cec-8d69-3522d636a1f3.mp4")
const videoPlayBackRate = ref(1)
const route = useRoute()

onMounted(() => {
    // 获取url参数的中的videoID
    const queryParam = route.query
    console.log("queryParam=>", queryParam)
    videoURL.value = queryParam.videoURL
})

const handleKeyDown = (e) => {
    console.log(e)
    if (e.key === 'ArrowUp') {

    } else if (e.key === 'ArrowDown') {

    } else if (e.key === 'ArrowRight') {
        // play rate
        videoPlayBackRate.value = 5
        // create global loading
        ElLoading.service({
            text: '倍速中 5x 🚀🚀🚀',
            background: 'rgba(0, 0, 0, 0.2)',
            fullscreen: true
        })
    }
}

const handleKeyUp = (e) => {
    if (e.key === 'ArrowRight') {
        // 倍速播放
        videoPlayBackRate.value = 1
        // close global loading
        const loadingInstance1 = ElLoading.service({ fullscreen: true })
        loadingInstance1.close()
    }
}
</script>

<template>
    <div class="video-container" @keydown="handleKeyDown" @keyup="handleKeyUp">
        <video-player
            class="qiniu-video-player"
            :src="videoURL"
            autoplay
            controls
            :playbackRate="videoPlayBackRate"
            :loop="true"
            :volume="0.6"
        >
        </video-player>
    </div>
</template>

<style lang="less" scoped>
.video-container {
    display: flex;
    flex-direction: column;
    height: 90vh;
    border-radius: 10px;

    .qiniu-video-player {
        flex: 1;
        height: 100%;
        width: 100%;
        // height: 300px;
        // overflow: hidden;
        // width: 320px;
        border-radius: 10px;


        margin-top: 20px;
        margin-bottom: 20px;
    }
}
</style>