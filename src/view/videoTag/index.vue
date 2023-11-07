<template>
    <div class="user-wrapper" v-if="state.videoList.length">
        <div class="video-cards">
            <el-space wrap style="width:100%" size="large">
                <el-card v-for="(item,index) in state.videoList" :key="index" shadow="always">
                    <div class="video" @click="gotoVideoInfo(item.id)">
                        <el-image :key="url" :src="item.cover_url"  class="img" fit="cover" />
                        <div class="com-wrapper">
                            <div class="com"><el-icon><Star /></el-icon> &nbsp{{item.favorite_count}} </div>
                            <div class="com"><el-icon><ChatDotRound /></el-icon> &nbsp{{item.comment_count}}</div>
                        </div>
                        <div class="title">{{item.title}}</div>
                        <div class="user">
                            <div class="video-time">{{item.publish_time.slice(0,10)}}</div>
                        </div>
                    </div>
                </el-card>
            </el-space>
        </div>
    </div>
    <div v-else class="result">
        <el-result icon="info" title="没有视频信息" >
            <template #sub-title>
                <p>很遗憾，没有找到该类视频信息</p>
            </template>
        </el-result>
    </div>
</template>

<script setup>
	import {reactive, watch} from "vue";
	import {onBeforeMount, onMounted} from "@vue/runtime-core";
    import {useRoute} from "vue-router";
    import {ElMessage} from "element-plus";
	import {getColVideos, getHistoryVideos, getLikeVideos, getTagVideos, getVideos} from "../../api/search";
    const route = useRoute()

    let state = reactive({
        tagId:route.query.tagId || "",
        videoList:[],
    })

    onMounted(() => {
	    getVideoList()
    })

    // 监听路由参数的变化
    watch(()=>[route.query.tagId],([newValue],[oldValue])=>{
        if (newValue && newValue !== oldValue) {
        	state.tagId = newValue
	        getVideoList()
        }
    })

    const gotoVideoInfo=(videoId)=>{
    //	 sessionStorage 跳转到
    }


    const getVideoList=()=>{
      if(state.tagId && state.tagId !== ""){
	      getTagVideos({tag:state.tagId}).then((res) => {
		      if (res.code === 200) {
			      state.videoList = res.data || []
		      } else {
			      ElMessage.error("搜索失败！")
		      }
	      }).catch(error=>{
		      ElMessage.error("失败！")
	      })
      }
    }
</script>

<style scoped lang="less">
    /deep/ .el-space__item{
        // width: 23%;
    }

    .user-wrapper{
        background: white;
            .video-cards {
                .video {
                    justify-content: center;
                    align-items: flex-start;
                    cursor: pointer;
                    border: 1px solid gainsboro;

                    border-radius: 8px;
                    box-shadow: 2px 2px 7px #939393;
                    overflow: hidden;

                    max-width: 400px;
                    max-height: 400px;

                    .img{
                        transition:all 0.5s;
                        background-color: #000000;
                        width: 300px;
                        height: 300px;
                    }
                    .img:hover{
                        transform:scale(1.05);
                    }

                    .com-wrapper{
                        transform:translateY(-30px);
                        color:white;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        margin: 0 10px;

                        .com{
                            align-items: center;
                            display: flex;
                        }
                    }

                    .title{
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        /*这两行代码可以解决大部分场景下的换行问题*/
                        word-break: break-all;
                        word-wrap: break-word;
                        /*但在有些场景中，还需要加上下面这行代码*/
                        white-space: normal;
                        margin: -15px 10px 10px 10px;
                    }

                    .user{
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: flex-end;
                        color:gray;
                        margin: 0  10px 10px 10px ;
                        border-radius: 8px;
                        .user-name{

                        }

                        .video-time{
                            font-size: 14px;
                        }
                    }
                }
            }
    }


    .result{
        background: white;
    }
</style>