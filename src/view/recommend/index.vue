<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue"
import { ElLoading } from 'element-plus'
import { useRoute } from 'vue-router';
import { getRecommendList } from '@/api/video'

const videoURLS = ref([])
const videoPlayBackRate = ref(1)
const route = useRoute()
const remarkCarousel = ref(null)
const currentActiveItem = ref(0)
const currentActiveVideoId = ref(0)
const concurrentCounts = ref(3) // Default to get 3 video concurrency
const networkSpeed = ref(0);

const checkNetworkSpeed = () => {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        networkSpeed.value  = connection.downlink; // 将网速从 bps 转换为 Mbps
        console.log("networkSpeed=>", networkSpeed.value)

        if (networkSpeed.value < 5) {
            concurrentCounts.value = 3
        } else {
            concurrentCounts.value = 5
        }
    }
};

onMounted(() => {
    if ('connection' in navigator) {
        checkNetworkSpeed();
        // check speed
        navigator.connection.addEventListener('change', checkNetworkSpeed);
    }

    getRecommendList().then(res => {
        console.log("getRecommendList res=>", res)
        videoURLS.value = res.data
    })
})

onBeforeUnmount(() => {
    if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', checkNetworkSpeed);
    }
})

const handleActiveItem = (index) => {
    console.log("index=>", index)
}

const changeDown = () => {
    console.log("changeDown")
    currentActiveItem.value = currentActiveItem.value + 1
    if (currentActiveItem.value >= videoURLS.value.length - 1) {
        // get new list
        getRecommendList().then(res => {
            videoURLS.value = [...videoURLS.value, ...res.data]
            console.log("getRecommendList res=>", videoURLS.value)
        })
    }

    remarkCarousel.value.setActiveItem(currentActiveItem.value)
}

const changeUp = () => {
    console.log("changeUp")
    currentActiveItem.value = currentActiveItem.value - 1
    if (currentActiveItem.value < 0) {
        currentActiveItem.value = 0      
    }

    remarkCarousel.value.setActiveItem(currentActiveItem.value)
}

const handleKeyDown = (e) => {
    console.log(e)
    if (e.key === 'ArrowUp') {
        changeUp()
    } else if (e.key === 'ArrowDown') {
        changeDown()
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

const judgePlay = (e) => {
    console.log(e)
    console.log("currentActiveItem.value=>", currentActiveItem.value)
    console.log(videoURLS.value[currentActiveItem.value].id == e.id)
    // return videoURLS.value[currentActiveItem.value].id == e.id
    return false
}
</script>

<template>
    <div class="video-container" @keydown="handleKeyDown" @keyup="handleKeyUp">
        <el-carousel
            ref="remarkCarousel"
            height="90vh"
            :initial-index="currentActiveItem"
            :interval="0"
            direction="vertical"
            :autoplay="false">
            <el-carousel-item v-for="video in videoURLS" :key="item">
                <video-player
                    class="qiniu-video-player"
                    :src="video.play_url"
                    controls
                    :autoplay="false"
                    :playbackRate="videoPlayBackRate"
                    :loop="true"
                    :volume="0.6"
                >
                </video-player>
            </el-carousel-item>
        </el-carousel>
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
        height: 90%;
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