<script setup>

	import {onMounted, ref, watch} from "vue"
	import { ElLoading } from 'element-plus'
	import { useRoute,useRouter } from 'vue-router';

	const videoURL = ref('')
	// const videoURL = ref("http://s3h1q0hvd.bkt.clouddn.com/0595a2b2-34a9-4cec-8d69-3522d636a1f3.mp4")
	const videoPlayBackRate = ref(1)
	const route = useRoute()
	const router = useRouter()

	import LoginDialog from '../../components/LoginDialog.vue'
	import CommentDrawer from '../../components/CommentDrawer.vue'

	import { reactive} from "vue";
	import {collectionAction, favoriteAction} from "../../api/favorite";
	import {ElMessage} from "element-plus";
		import {loginStoreWidthOut} from "../../stores/user";
		import StorageUtil from "../../utils/localStorage";
		import {getVideo} from "../../api/video";
	const state = reactive({
		isLoginVisible:false,
		commentVisible:false,
		canFavorite:1,
		canCollection:1,
		videoId:route.query.videoId,
      video:{}
	})

    // 监听路由参数的变化
    watch(()=>[route.query.videoId],([newValue],[oldValue])=>{
        if (newValue && newValue !== oldValue) {
            state.videoId = newValue
	        getVideoId()
        }
    })
	const changeVisible=(val)=>{
		state.isLoginVisible=val
	}

	const closeComments=(val)=>{
		state.commentVisible=val
	}

	const favorite =() =>{
		state.canFavorite=-1*state.canFavorite
		favoriteAction( {videoId: parseInt(state.videoId, 10),actionType:state.canFavorite } ).then((res) => {
			if (res.code === 200) {
				// ElMessage.success("成功")
			} else {
				ElMessage.error("赞操作失败！")
			}
		}).catch(error=>{
			ElMessage.error("失败！")
		})
	}


	const collection =() =>{
		state.canCollection=-1*state.canCollection
		collectionAction( {videoId: parseInt(state.videoId, 10),actionType:state.canCollection } ).then((res) => {
			if (res.code === 200) {
				// ElMessage.success("成功")
			} else {
				ElMessage.error("赞操作失败！")
			}
		}).catch(error=>{
			ElMessage.error("失败！")
		})
	}

	onMounted(() => {
		// 获取url参数的中的videoID
		// const queryParam = route.query
		// console.log("queryParam=>", queryParam)
		videoURL.value = "http://s3h1q0hvd.bkt.clouddn.com/0595a2b2-34a9-4cec-8d69-3522d636a1f3.mp4"
        state.videoId = route.query.videoId
		getVideoId()
	})

	const getVideoId = ()=>{
		getVideo({videoId:state.videoId}).then(res=>{
			if(res.code === 200){
				state.video = res.data || {}
				videoURL.value = res.data.play_url
				state.canFavorite = res.data.is_favorite ? 1:-1
				state.canCollection = res.data.is_collection ? 1:-1
            }
        })
	}



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

const toUser=()=>{
	router.push({
		path:'/userInfo',
			query:{
				userId:state.video.author.id
			}
	})
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

        <div class="tool-wrapper">
            <div class="tool" @click="toUser">
                <el-avatar :size="50" v-if="state.video.author" :src="state.video.author.avatar" />
            </div>
            <div class="tool" @click="collection">
                <el-icon size="40" color="#f5f7fa" v-if="state.canCollection === 1"><Star /></el-icon>
                <el-icon size="40" color="yellow" v-else><StarFilled /></el-icon>
            </div>
            <div class="tool" @click="favorite">
                <el-icon size="40" color="#f5f7fa" v-if="state.canFavorite === 1"><MagicStick /></el-icon>
                <el-icon size="40" color="red" v-else><MagicStick /></el-icon>
            </div >
            <div class="tool" @click="state.commentVisible=true">
                <el-icon size="40" color="#f5f7fa"><ChatDotRound /></el-icon>
            </div>
        </div>
    </div>
    <CommentDrawer
        :modelVisible="state.commentVisible"
        @changeVisible="closeComments"
        :videoId="state.videoId"
    />
</template>

<style lang="less" scoped>
.video-container {
    display: flex;
    flex-direction: column;
    height: 90vh;
    border-radius: 10px;
    position: relative;

    .tool-wrapper{
        position:absolute;
        right: 20px;
        bottom: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 40px;
        z-index: 10;
        .tool{
            margin: 15px 0;
            :hover{
                cursor: pointer;
            }
        }
    }
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