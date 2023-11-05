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
                video结果
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
                                <el-step title="名称" :icon="Timer" :status="state.default" @click="handleOrder('default')" class="step"/>
                                <el-step title="喜爱度" :icon="Position" @click="handleOrder('like')" :status="state.like"  class="step"/>
                                <el-step title="收藏量" :icon="Star" @click="handleOrder('star')"  :status="state.star"  class="step"/>
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
	import { Timer, Position, Star } from '@element-plus/icons-vue'
	const route = useRoute()

    let state = reactive({
        searchValue: route.query.searchValue,
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
    })

	onBeforeMount(() => {
	    gotoSearch()
    })

    const gotoUserInfo=(userId)=>{
	    //	todo 跳转到用户详情页面
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

		const handleOrder=(value)=>{
		if(value === 'default'){
			state.default = 'finish'
			state.like = 'wait'
			state.star = 'wait'
            state.userList.sort((a,b)=>{
                return( b.name - a.name)
            })
        }else if(value === 'like'){
            state.like = 'finish'
            state.default = 'wait'
            state.star = 'wait'
            state.userList.sort((a,b)=>{
                return( b.total_favorited - a.total_favorited)
            })
        }else{
            state.star = 'finish'
            state.default = 'wait'
            state.like = 'wait'
            state.userList.sort((a,b)=>{
                return( b.total_collected - a.total_collected)
            })
        }
    }

    const gotoSearch =()=>{
	    state.loading = true
        goSearch( { searchValue: state.searchValue} ).then((res) => {
            if (res.code === 200) {
	            state.videoList = res.data || []
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
        border-radius: 10px;
        border: 0px;
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
    }

</style>