<template>
    <div class="tab-wrapper">
        <el-tabs v-model="state.activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane name="video">
                <template #label>
                    <span class="custom-tabs-label">
                      <el-icon><VideoCameraFilled /></el-icon>
                      <span>视频</span>
                    </span>
                </template>
                <div class="video-wrapper" v-if="state.videoList?.length !== 0">
                    <div class="left">
                        <div>
                            <el-tag
                                    v-for="item in data.videoCls"
                                    :key="item.type"
                                    :type="info"
                                    :effect="state.curTag === item.type? 'dark':'plain'"
                                    round
                                    class="tag"
                                    @click="handerTag(item.type)"
                            >
                                {{ item.label }}
                            </el-tag>
                        </div>
                        <div class="video-cards">
                            <el-space wrap style="width:100%" size="large">
                                <el-card v-for="(item,index) in state.videoList" :key="index" shadow="always">
                                    <div class="video" @click="gotoVideoInfo(item.id)">
                                        <el-image :key="url" :src="item.cover_url"  class="img"/>
                                        <div class="com-wrapper">
                                            <div class="com"><el-icon><Star /></el-icon> &nbsp{{item.favorite_count}} </div>
                                            <div class="com"><el-icon><ChatDotRound /></el-icon> &nbsp{{item.comment_count}}</div>
                                        </div>
                                        <div class="title">{{item.title}}</div>
                                        <div class="user">
                                            <div @click="gotoUserInfo(item.author.id)" class="user-name">@{{item.author.name}}</div>
                                            <div class="video-time">{{utils.$time(item.publish_time)}}</div>
                                        </div>
                                    </div>
                                </el-card>
                            </el-space>
                        </div>
                    </div>
                    <div class="user-select">
                        <el-affix :offset="200" style="width: 100%" >
                            <el-steps direction="vertical" style="height: 200px" >
                                <el-step
                                    v-for="(item,index) in data.videoOrder" :key="item.type"
                                    :title="item.label" :icon="item.icon"
                                    :status="state.curVideo === item.type?'finish':'wait'"
                                    @click="handleVideoOrder(item.type)"
                                    class="step"/>
                            </el-steps>

                        </el-affix>
                    </div>
                </div>
                <div v-else>
                    <el-result icon="info" title="无结果">
                        <template #sub-title>
                            <p>很遗憾，没有相关搜索结果，请重新搜索</p>
                        </template>
                    </el-result>
                </div>
            </el-tab-pane>
            <el-tab-pane name="user">
                <template #label>
                    <span class="custom-tabs-label">
                      <el-icon><UserFilled /></el-icon>
                      <span>用户</span>
                    </span>
                </template>
                <div class="user-wrapper" v-if="state.userList?.length !== 0">
                    <div class="user-cards">
                        <el-space wrap style="width:100%" size="large">
                            <el-card v-for="(item,index) in state.userList" :key="index" shadow="hover" body-style="border-radius: var(--el-card-border-radius);border: 1px solid var(--el-card-border-color)">
                                <div class="user" @click="gotoUserInfo(item.id)">
                                    <div class="avatar-wrapper">
                                        <el-avatar :size="50" :src="item.avatar" class="avatar" />
                                        <div class="name">{{item.name}}</div>
                                        <el-tag class="style">{{item.style||"风格"}}</el-tag>
                                    </div>
                                    <div class="like-wrapper">
                                        <div>{{item.total_favorited}}获赞</div>
                                        <div class="did">|</div>
                                        <div>{{item.total_collected}}被收藏</div>
                                    </div>
                                    <div class="sign">{{item.signature || "此用户没有填写简介"}}</div>
                                </div>
                            </el-card>
                        </el-space>
                    </div>
                    <div class="user-select">
                        <el-affix :offset="200" style="width: 100%">
                            <el-steps direction="vertical" style="height: 200px">
                                <el-step
                                        v-for="(item,index) in data.userOrder" :key="item.type"
                                        :title="item.label" :icon="item.icon"
                                        :status="state.curUser === item.type?'finish':'wait'"
                                        @click="handleOrder(item.type)"
                                        class="step"/>
<!--                                <el-step title="名称" :icon="Timer" :status="state.default" @click="handleOrder('default')" class="step"/>-->
<!--                                <el-step title="喜爱度" :icon="Position" @click="handleOrder('like')" :status="state.like"  class="step"/>-->
<!--                                <el-step title="收藏量" :icon="Star" @click="handleOrder('star')"  :status="state.star"  class="step"/>-->
                            </el-steps>
                        </el-affix>
                    </div>
                </div>
                <div v-else>
                    <el-result icon="info" title="无结果">
                        <template #sub-title>
                            <p>很遗憾，没有相关搜索结果，请重新搜索</p>
                        </template>
                    </el-result>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
	import {onBeforeMount, onMounted} from "@vue/runtime-core";
	import {useRoute} from "vue-router";
	import {goSearch, goSearchUser} from "../../api/search";
	import {ElMessage} from "element-plus";
    import {reactive, watch} from "vue";
    import data from '../../utils/enum.js'
	import { Timer, Position, Star } from '@element-plus/icons-vue'
	import utils from "../../utils/index"
	const route = useRoute()

    let state = reactive({
        searchValue: route.query.searchValue,
        constVideos:[],   // 保存
        videoList:[],
        userList:[],
        isPhone:document.documentElement.clientWidth < 768?'btt':'rtl',
        loading:true,
	    activeName:"video",
        isUser: false,
        isVideo: false,
	    default:'finish',
        like:'wait',
	    star:'wait',
        curTag:0,
        curVideo:'publish_time',
	    curUser:'name'
    })

	onBeforeMount(() => {
	    gotoSearch()
    })

    const gotoUserInfo=(userId)=>{
	    //	todo 跳转到用户详情页面
    }

    const gotoVideoInfo=(videoId)=>{
	    //	todo 跳转到视频详情页面
    }

    const handerTag=(tagId)=>{
    //	 处理视频  根据tag进行筛选
      state.curTag = tagId
      if(tagId ===0){
      	state.videoList = state.constVideos
      }else{
      	state.videoList = state.videoList((item)=>{
      		return item.category === tagId
        })
      }
    }

    // 监听路由参数的变化
    watch(()=>[route.query.searchValue],([newValue],[oldValue])=>{
        if (newValue && newValue !== oldValue) {
        	state.searchValue = newValue
            state.isUser =false
	        state.isVideo =false
            if(state.activeName === 'user'){
	            getUsers()
            }else{
	            gotoSearch()

            }
        }
    })

    const handleVideoOrder = (value)=>{
    	state.curVideo = value
	    state.videoList.sort((a,b)=>{
		    return( b[value] - a[value])
	    })
    }

		const handleOrder=(value)=>{
    	state.curUser=value
        state.userList.sort((a,b)=>{
            return( b[value] - a[value])
        })
    }

    const gotoSearch =()=>{
	    state.loading = true
        goSearch( { searchValue: state.searchValue} ).then((res) => {
            if (res.code === 200) {
	            state.videoList = res.data || []
	            state.constVideos = res.data || []
                state.isVideo = true
            } else {
                ElMessage.error("搜索失败！")
            }
        }).catch(error=>{
            ElMessage.error("失败！")
        })
        state.loading = false
    }

    const getUsers = () =>{
	    state.loading = true
	    goSearchUser( { searchValue: state.searchValue} ).then((res) => {
		    if (res.code === 200) {
			    state.userList=res.data ||[]
			    state.isUser =true  // 查询之后就不需要再查询了
		    } else {
			    ElMessage.error("搜索失败！")
		    }
	    }).catch(error=>{
		    ElMessage.error("失败！")
	    })
	    state.loading = false
    }

    const handleClick =(tab)=>{
	    state.activeName = tab.props.name
	//	 如果是user  则需要查询
      if(tab.props.name === "user" &&  !state.isUser){
	      getUsers()
      }else if(tab.props.name === "video" && !state.isVideo){
	      gotoSearch()
      }
    }
</script>

<style scoped lang="less">
    .el-tabs--card {
        height: calc(100vh - 195px);
    }
    .el-tab-pane {
        height: calc(100vh - 195px);
    }
    /deep/ .el-space__item{
        width: 30%;
    }
    .tab-wrapper{
        padding: 20px;
        background: white;
        .demo-tabs > .el-tabs__content {
            padding: 20px;
            color: #6b778c;
            font-size: 32px;
            font-weight: 600;
            ::-webkit-scrollbar {
                width: 0 !important;
                display: none;
            }
        }

        .demo-tabs{
            flex: auto;
            display: flex;
            flex-direction: column;

            /deep/ .el-tabs__content{
                flex-grow: 1;
                overflow-y: scroll;
            }
        }


        .demo-tabs .custom-tabs-label{
            padding: 0 20px;
        }
        .demo-tabs .custom-tabs-label .el-icon {
            vertical-align: middle;
        }
        .demo-tabs .custom-tabs-label span {
            vertical-align: middle;
            margin-left: 4px;
        }

        .user-wrapper{
            display: flex;
            flex-direction: row;

            .user-cards{
                width: 85%;
                padding: 10px;
                .user{
                    justify-content: center;
                    align-items: center;
                    margin: 0;
                    cursor: pointer;

                    .avatar-wrapper{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        .name {
                            margin-left: 10px;
                            font-size: 15px;
                        }
                        .style {
                            margin-left: auto;
                        }
                    }
                    .like-wrapper{
                        display: flex;
                        flex-direction: row;
                        color: #636363;
                        font-size: 15px;
                        margin: 15px;

                        .did{
                            margin: 0 15px;
                        }
                    }
                    .sign{
                        color: #717171;
                        font-size: 13px;
                        margin-left: 15px;
                    }
                }
            }

            .user-select{
                width: 15%;
                .step{
                    cursor: pointer;
                }
                /*.select-wrapper{*/
                /*    display: flex;*/
                /*    flex-direction: column;*/
                /*    .select-item{*/
                /*        padding: 15px;*/
                /*    }*/
                /*}*/
            }

        }

        .video-wrapper {
            display: flex;
            flex-direction: row;

            .left {
                width: 85%;
                padding: 10px;

                .tag{
                    margin: 0 5px;
                    cursor: pointer;
                }

                .video-cards {
                    .video {
                        justify-content: center;
                        align-items: flex-start;
                        cursor: pointer;
                        border: 1px solid gainsboro;

                        border-radius: 8px;
                        box-shadow: 2px 2px 7px #939393;
                        overflow: hidden;

                        .img{
                            transition:all 0.5s;
                        }
                        .img:hover{
                            transform:scale(1.1);
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
                            justify-content: space-between;
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
            .user-select {
                width: 15%;

                .step {
                    cursor: pointer;
                }
            }
        }
    }
</style>