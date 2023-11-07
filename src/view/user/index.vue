<template>
    <div class="user-wrapper" v-if="JSON.stringify(state.userInfo) !== '{}'">
        <div class="user-info">
            <el-avatar :size="100" :src="state.userInfo.avatar" class="avatar" />
            <div class="info-wrapper">
                <div class="name">{{state.userInfo.name || "未登录"}}</div>
                <div class="sign">{{state.userInfo.signature || "什么都没有"}}</div>
                <div class="like-wrapper">
                    <div>{{state.userInfo.total_favorited || "-"}}&nbsp获赞</div>
                    <div class="did">|</div>
                    <div>{{state.userInfo.total_collected || "-"}}&nbsp被收藏</div>
                </div>
            </div>
        </div>
            <el-tabs v-model="state.activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane name="video">
                    <template #label>
                        <span class="custom-tabs-label">
                          <span>作品</span>
                        </span>
                    </template>
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
                </el-tab-pane>
                <el-tab-pane name="like">
                    <template #label>
                        <span class="custom-tabs-label">
                          <span>喜欢</span>
                        </span>
                    </template>
                    <div class="video-cards">
                        <el-space wrap style="width:100%" size="large">
                            <el-card v-for="(item,index) in state.likeVideos" :key="index" shadow="always">
                                <div class="video" @click="gotoVideoInfo(item.id)">
                                    <el-image :key="url" :src="item.cover_url"  class="img"/>
                                    <div class="com-wrapper">
                                        <div class="com"><el-icon><Star /></el-icon> &nbsp{{item.favorite_count}} </div>
                                        <div class="com"><el-icon><ChatDotRound /></el-icon> &nbsp{{item.comment_count}}</div>
                                    </div>
                                    <div class="title">{{item.title}}</div>
                                    <div class="user">
                                        <div @click="gotoUserInfo(item.author.id)" class="user-name">@{{item.author.name}}</div>
                                        <div class="video-time">{{item.publish_time.slice(0,10)}}}</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-space>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="collection">
                    <template #label>
                        <span class="custom-tabs-label">
                          <span>收藏</span>
                        </span>
                    </template>
                    <div class="video-cards">
                        <el-space wrap style="width:100%" size="large">
                            <el-card v-for="(item,index) in state.colVideos" :key="index" shadow="always">
                                <div class="video" @click="gotoVideoInfo(item.id)">
                                    <el-image :key="url" :src="item.cover_url"  class="img"/>
                                    <div class="com-wrapper">
                                        <div class="com"><el-icon><Star /></el-icon> &nbsp{{item.favorite_count}} </div>
                                        <div class="com"><el-icon><ChatDotRound /></el-icon> &nbsp{{item.comment_count}}</div>
                                    </div>
                                    <div class="title">{{item.title}}</div>
                                    <div class="user">
                                        <div @click="gotoUserInfo(item.author.id)" class="user-name">@{{item.author.name}}</div>
                                        <div class="video-time">{{item.publish_time.slice(0,10)}}</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-space>
                    </div>
                </el-tab-pane>
                <el-tab-pane name="history">
                    <template #label>
                        <span class="custom-tabs-label">
                          <span>浏览记录</span>
                        </span>
                    </template>
                    <div class="video-cards">
                        <el-space wrap style="width:100%" size="large">
                            <el-card v-for="(item,index) in state.hisVideos" :key="index" shadow="always">
                                <div class="video" @click="gotoVideoInfo(item.id)">
                                    <el-image :key="url" :src="item.cover_url"  class="img"/>
                                    <div class="com-wrapper">
                                        <div class="com"><el-icon><Star /></el-icon> &nbsp{{item.favorite_count}} </div>
                                        <div class="com"><el-icon><ChatDotRound /></el-icon> &nbsp{{item.comment_count}}</div>
                                    </div>
                                    <div class="title">{{item.title}}</div>
                                    <div class="user">
                                        <div @click="gotoUserInfo(item.author.id)" class="user-name">@{{item.author.name}}</div>
                                        <div class="video-time">{{item.publish_time.slice(0,10)}}</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-space>
                    </div>
                </el-tab-pane>
            </el-tabs>
    </div>
    <div v-else class="result">
        <el-result icon="info" title="没有该用户信息" >
            <template #sub-title>
                <p>很遗憾，没有找到该用户信息</p>
            </template>
        </el-result>
    </div>
</template>

<script setup>
	import {reactive, watch} from "vue";
    import {onBeforeMount} from "@vue/runtime-core";
    import {useRoute} from "vue-router";
	import {getUserInfo} from "../../api/login";
    import {ElMessage} from "element-plus";
		import {getColVideos, getHistoryVideos, getLikeVideos, getVideos} from "../../api/search";
    const route = useRoute()

    let state = reactive({
        userInfo:{},
        userId:route.query.userId || "",
        videoList:[],
        likeVideos:[],
        colVideos:[],
        hisVideos:[],
	    activeName:"video",
        isLike:false,
        isCollected:false,
        isHistory:false,
    })

    const handleClick =(tab)=>{
        state.activeName = tab.props.name
        //	 如果是user  则需要查询
        if(tab.props.name === "like" &&  !state.isLike){
            getLikeVideo()
        }else if(tab.props.name === "collection" && !state.isCollected){
            getCollVideo()
        }else if(tab.props.name === "history" && !state.isHistory){
            getHisVideo()
        }
    }

    const getLikeVideo=()=>{
	    getLikeVideos({userId:state.userId}).then((res) => {
		    if (res.code === 200) {
			    state.likeVideos = res.data || []
                state.isLike=true
		    } else {
			    ElMessage.error("搜索失败！")
		    }
	    }).catch(error=>{
		    ElMessage.error("失败！")
	    })
    }

    const getCollVideo=()=>{
	    getColVideos({userId:state.userId}).then((res) => {
		    if (res.code === 200) {
			    state.colVideos = res.data || []
                state.isCollected=true
		    } else {
			    ElMessage.error("搜索失败！")
		    }
	    }).catch(error=>{
		    ElMessage.error("失败！")
	    })
    }

    const getHisVideo=()=>{
	    getHistoryVideos().then((res) => {
		    if (res.code === 200) {
			    state.hisVideos = res.data || []
                state.isHistory=true
		    } else {
			    ElMessage.error("搜索失败！")
		    }
	    }).catch(error=>{
		    ElMessage.error("失败！")
	    })
    }

    onBeforeMount(() => {
        getUser()
    })

    // 监听路由参数的变化
    watch(()=>[route.query.userId],([newValue],[oldValue])=>{
        if (newValue && newValue !== oldValue) {
            state.userId = newValue
            state.isLike =false
            state.isCollected =false
            state.activeName="video"
            getUser()
        }
    })

    const gotoVideoInfo=(videoId)=>{
    //	 sessionStorage 跳转到
    }

    const gotoUserInfo =(userId)=>{

    }
    const getUser=()=>{
    	if(state.userId !== ""){
            getUserInfo({userId:state.userId}).then((res) => {
                if (res.code === 200) {
                    state.userInfo = res.data || {}
                //     获取视频列表 根据useri
	                getVideoList()
                } else {
                    ElMessage.error("搜索失败！")
                }
            }).catch(error=>{
                ElMessage.error("失败！")
            })
        }
    }

    const getVideoList=()=>{
        getVideos({userId:state.userId}).then((res) => {
            if (res.code === 200) {
                state.videoList = res.data || []
            } else {
                ElMessage.error("搜索失败！")
            }
        }).catch(error=>{
            ElMessage.error("失败！")
        })
    }
</script>

<style scoped lang="less">
    /deep/ .el-space__item{
        // width: 23%;
    }
    .user-wrapper{

        .user-info{
            background: white;
            padding: 30px;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 10px 0 0 0px;
            border-radius: 10px;

            .info-wrapper{
                margin-left: 15px;
                .name{
                    font-size: 20px;
                    font-weight: 500;
                }
                .sign{
                    margin-top: 10px;
                    color: #760002;
                    font-size: 14px;
                }
                .like-wrapper{
                    display: flex;
                    flex-direction: row;
                    color: #636363;
                    font-size: 15px;
                    margin-top: 8px;
                    font-size: 14px;

                    .did{
                        margin: 0 15px;
                    }
                }
            }
        }

        .demo-tabs{
            background: white;
            padding: 30px;
            margin: 20px 0 0 0px;
            border-radius: 10px;

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
    }

    .result{
        background: white;
    }
</style>