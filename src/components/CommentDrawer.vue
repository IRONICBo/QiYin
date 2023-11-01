<template>
    <el-drawer v-model="props.modelVisible" :direction="state.isPhone" :before-close="cancel" :v-loading="state.loading">
        <template #header>
            <h4>共{{state.comments.length}}条评论</h4>
        </template>
        <template #default>
            <div class="comment" style="transform:translateY(-20px)">
                <div class="wrapper" v-if="state.comments.length">
                    <div class="items">
                        <div class="item" v-for="item in state.comments">
                            <div class="main">
                                <div class="content">
                                    <img :src="item.avatar" alt="" class="head-image" @click="goToUserInfo(item.id)">
                                    <div class="comment-container" >
                                        <div class="name">{{ item.name }}</div>
                                        <div class="detail" >{{ item.text }}</div>
                                        <div class="time-wrapper" >
                                            <div class="left">
                                                <div class="time"> {{item.time}}</div>
                                            </div>
                                                <template  class="love" @click="deleteComment(item.id)" v-show="item.canDel">
                                                    <el-popconfirm title="是否确认删除，删除后不可更改" @confirm="comDel" confirm-button-text="删除" cancel-button-text="取消">
                                                        <template #reference>
                                                            <el-icon color="#ed8787"><DeleteFilled/></el-icon>-->
                                                        </template>
                                                    </el-popconfirm>
                                                </template >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--        <no-more/>-->
                </div>
            </div>
        </template>
        <template #footer>
            <div class="input-toolbar">
                <div class="toolbar" style="display: flex">
                    <el-input
                        v-model="state.comment"
                        class="w-50 m-2"
                        size="middle"
                        :placeholder="state.placeholder"
                        :disabled="!state.haveAuth"
                        clearable
                        @keyup.enter="send"
                    >
                    </el-input>
                    <el-icon v-if="state.comment" @click="send" color="#17d46b" style="width: 20px;cursor: pointer;margin-top:8px"><Upload /></el-icon>
                </div>
            </div>
        </template>
    </el-drawer>
</template>


<script setup>
	import {reactive,watch} from 'vue';
    import utils from "../utils/index"
    import {ElMessage} from "element-plus";
    import {getComment, addComment, delComment} from "../api/comment"
    import StorageUtil from '../utils/localStorage';
    import {defineEmits, defineProps, onMounted} from "@vue/runtime-core";

	const props = defineProps({
		modelVisible: false,
		videoId: {
			type: String,
			default: null
		}
	});

	let state = reactive({
		comment: '',
		comments: [],
		selectRow: {},
		showPrivateChat: false,
		isInput: false,
        haveAuth: StorageUtil.get('token') !== '',
        placeholder:StorageUtil.get('token') !== ''? "留下你精彩的评论吧":"请登录后评论",
        delId:0,
        loading:false,
		isPhone:document.documentElement.clientWidth < 993?'btt':'rtl',
	})

    const emits=defineEmits(['changeVisible'])

    onMounted(() => {
	    window.addEventListener('resize', () => {
		    state.isPhone = document.documentElement.clientWidth < 993?'btt':'rtl'// 小于993视为平板及手机
        })
	    getData()
    })

    const cancel=() =>{
	    emits('changeVisible', false)
    }

	watch(()=>[props.modelVisible, props.videoId],([newModelValue,newVideoId],[oldModelValue,oldVideoId])=>{
		if (newModelValue) {
			getData()
		} else {
			state.comments = []
		}
		// 监听视频的变化
		props.videoId = newVideoId
	})

    const send= async() =>{
	    await utils.$sleep(500)
	    if (props.videoId === 0){
		    return
	    }
	    addComment( {videoId: parseInt(props.videoId, 10),commentText:state.comment } ).then((res) => {
		    if (res.code === 200) {
			    getData()
			    state.comment = ''
		    } else {
			    state.comment = ''
			    ElMessage.error("获取评论失败！")
		    }
	    }).catch(error=>{
		    state.comment = ''
		    ElMessage.error("失败！")
	    })
    }

    const getData = async () => {
	    await utils.$sleep(200)
        state.loading = true
	    console.log("获取评论列表", props.videoId)
	    // 获取评论数据
	    getComment({videoId: props.videoId}).then((res) => {
		    if (res.code === 200) {
				state.comments = []
			    const formattedData = [];
			    const userId = StorageUtil.get('accountId')
			    res.data.forEach(item => {
				    const formattedItem = {
					    id: item.id,
					    avatar: item.user_info.avatar,
					    name: item.user_info.name,
					    text: item.content,
					    loveNum: item.user_info.total_favorited,
					    isLoved: false,
					    time: utils.$time(item.create_date),
					    canDel: userId === item.user_info.id
				    }
				    formattedData.push(formattedItem)
			    })
			    state.comments = formattedData
		    } else {
			    ElMessage.error("获取评论失败！")
		    }
	    }).catch(error => {
		    ElMessage.error("失败！")
	    })
	    state.loading = false
    }

    const goToUserInfo=(id)=>{
	//    跳转到用户信息页
    }

    const deleteComment =(id)=>{
	    state.delId=id
    }

	const comDel=()=>{
	    if(state.delId === 0){
		    return
	    }
	    delComment( {commentId: parseInt(state.delId, 10)} ).then((res) => {
		    if (res.code === 200) {
			    getData()
		    } else {
			    ElMessage.error("删除评论失败！")
		    }
	    }).catch(error=>{
		    ElMessage.error("删除失败！")
	    })
        state.delId = 0
    }


</script>

<style lang="less" scoped>
    ::v-deep .el-drawer__header {
        margin:0px !important;
    }
        .comment {
        height: v-bind(height);
        background: #fff;
        z-index: 5;

        .wrapper {
            width: 100%;
            position: relative;
        }

        .items {
            width: 100%;

            .item {
                width: 100%;
                border-top: 1px solid #e2e2e2;

                .main {
                    width: 100%;
                    padding: 5px 0;
                    display: flex;

                    &:active {
                        background: #53535321;
                    }

                    .head-image {
                        margin-left: 15px;
                        margin-right: 10px;
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                    }
                }

                .replies {
                    padding-left: 55px;

                    .reply {
                        padding: 5px 0 5px 5px;
                        display: flex;

                        &:active {
                            background: #53535321;
                        }

                        .head-image {
                            margin-right: 10px;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                        }
                    }

                    .more {
                        font-size: 12px;
                        margin: 5px;
                        display: flex;
                        align-items: center;
                        color: rgb(143, 143, 158);

                        .gang {
                            background: #d5d5d5;
                            width: 20px;
                            margin-right: 10px;
                            height: 1px;
                        }

                        .arrow {
                            margin-left: 5px;
                            margin-top: 8px;
                            width: 0;
                            height: 0;
                            border: 5px solid transparent;
                            border-top: 6px solid rgb(143, 143, 158);
                        }
                    }
                }

                .content {
                    width: 100%;
                    display: flex;
                    font-size: 14px;

                    .comment-container {
                        flex: 1;
                        margin-right: 20px;

                        .comment-container:hover{
                            background: #999999;
                        }


                        .name {
                            color: rgb(143, 143, 158);
                            margin-bottom: 5px;
                            display: flex;
                            align-items: center;


                            .reply-user {
                                margin-left: 5px;
                                width: 0;
                                height: 0;
                                border: 5px solid transparent;
                                border-left: 6px solid gray;
                            }
                        }

                        .detail {
                            margin-bottom: 5px;
                        }

                        .time-wrapper {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            font-size: 12px;

                            .left {
                                display: flex;

                                .time {
                                    color: #c4c3c3;
                                    margin-right: 10px;
                                }

                                .reply-text {
                                    color: rgb(143, 143, 158);
                                }
                            }

                            .love {
                                color: rgb(143, 143, 158);
                                display: flex;
                                align-items: center;
                                width: 20px;
                                cursor: pointer;
                                z-index: 10;


                                .love-image {
                                    margin-right: 10px;
                                    width: 25px;
                                    border-radius: 50%;
                                }

                                span {
                                    font-size: 10px;
                                    word-break: keep-all;
                                }
                            }
                        }
                    }
                }
            }
        }


        @normal-bg-color: rgb(35, 38, 47);
        @chat-bg-color: rgb(105, 143, 244);

        .input-toolbar {
            border-radius: 10px 10px 0 0;
            background: white;
            position: fixed;
            width: 100vw;
            bottom: 0;
            z-index: 15;

            @space-width: 18px;
            @icon-width: 48px;

            .toolbar {
                @icon-width: 25px;
                display: flex;
                align-items: center;
                padding: 10px 15px;
                border-top: 1px solid #e2e1e1;
                flex-direction: row;

                img {
                    width: @icon-width;
                    height: @icon-width;
                    border-radius: 50%;
                    margin-left: 15px;
                }
            }
        }
    }
</style>