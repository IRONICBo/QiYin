<template>
    <div class="search" ref="searchRef">
        <div class="input">
            <el-input
                    v-model="state.searchValue"
                    class="w-50 m-2"
                    size="large"
                    :placeholder="state.placeholder"
                    @keyup.enter="send"
                    :disabled="state.loading"
                    id="search"
            >
                <template #append  style="cursor: pointer">
                    <el-button type="danger" @click="send" v-if="!state.loading">
                        <el-icon style="margin-right:3px"><Search /></el-icon>
                        搜索</el-button>
                    <el-button type="danger" v-else>
                        <el-icon style="margin-right:3px" class="is-loading"><Loading /></el-icon>
                        搜索中</el-button>
                </template>
            </el-input>
        </div>
        <div class="wrapper" v-show="state.showDiv">
            <div class="history">
                <div class="title-row">
                    <div class="title">历史记录</div>
                    <div class="icon" @click="clearHistorys">
                        <el-icon style="margin-right: 3px"><Delete /></el-icon>
                        <span>清除记录</span>
                    </div>
                </div>
                <div class="history-wrapper" >
                    <div v-for="(tag,index) in state.historys" class="his-item">
                        <el-tag
                                :key="index"
                                class="mx-1"
                                closable
                                @close="handleClose(index)"
                                @click="clickHistory(tag)"
                        >
                            {{ tag }}
                        </el-tag>
                    </div>
                </div>
            </div>
            <div class="hots">
                <div class="title">热搜榜</div>
                <div class="hot-ul">
                    <div v-for="(item,index) in state.hots" :key="index" class="hot-li">
                        <div @click="clickHistory(item)">
                            <span class="hot-num">{{index+1}}</span>
                            <span class="hot-item">{{item}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
	import {reactive,watch,ref} from 'vue';
    import utils from "../utils/index"
    import {ElMessage} from "element-plus";
    import StorageUtil from '../utils/localStorage';
	import {onMounted, onUnmounted} from "@vue/runtime-core";
    import {getHots ,goSearch} from '../api/search'
	import {useRouter,useRoute} from "vue-router";

    const searchRef = ref();
    const router = useRouter();
    const route = useRoute();
	let state = reactive({
		searchValue: router.currentRoute._value.path === "/searchResult"? (route.query.searchValue|| ''):'',
        placeholder:"搜索相关内容",
        showDiv:false,
        loading:false,
        hots:[],
		historys:[],
		isPhone:document.documentElement.clientWidth < 768?'btt':'rtl',
	})

	onMounted(() => {
	    window.addEventListener('resize', () => {
		    state.isPhone = document.documentElement.clientWidth < 768?'btt':'rtl'// 小于993视为平板及手机
        })
    //      监听点击事件
	    document.addEventListener('click', handlerClick)

    })
    onUnmounted(() => {
        window.removeEventListener('click', handlerClick)
	    window.removeEventListener('resize', () => {
		    state.isPhone = document.documentElement.clientWidth < 768?'btt':'rtl'// 小于993视为平板及手机
	    })
    })
	watch(()=>[state.showDiv],([newShowDiv],[oldShowDiv])=>{
		if (newShowDiv && newShowDiv !== oldShowDiv && !state.hots.length) {
           getVideoHots()
           getHistory()
		}
	})

    const handlerClick =(e)=>{
          if (e.target.id === "search"){
              state.showDiv = true
              return
          }
          if(!utils.isGrandchild(e.target,searchRef.value)){
                state.showDiv = false
          }
    }


    const getHistory =()=>{
	    state.historys = StorageUtil.get("historys") || []
    }

    // 点击删除单个历史记录
    const handleClose=(index)=>{
	    if (isNaN(index) || index >= state.historys.length) {
		    return false;
	    }
	    state.historys.splice(index, 1);

	    StorageUtil.set("historys", JSON.stringify( state.historys));
    }

    // 清除历史记录
    const clearHistorys =()=>{
    	state.historys = []
	    StorageUtil.set("historys", JSON.stringify( state.historys));
    }

    // 点击历史记录直接搜索
    const clickHistory=(tag)=> {
		state.searchValue = tag
        // 将新点击的放在最前面
	    state.historys.splice(0, 0, tag);
	    state.historys = state.historys.filter((item,index,self)=>{
            return self.indexOf(item)  === index
        })
	    StorageUtil.set("historys",JSON.stringify(state.historys))
	    gotoSearch();
    }

    const getVideoHots =()=>{
	    getHots().then((res) => {
            if (res.code === 200) {
                state.hots = res.data
            } else {
                console.log("热词搜索失败")
            }
        }).catch(error=>{
            console.log("热词搜索失败")
        })
    }

    // 进行搜索
    const send= () =>{
        // 将搜索词存放在本地
        if(state.searchValue !== ""){
        	let [...newArr] = state.historys
            newArr.unshift(state.searchValue)
            // 去重
	        state.historys = newArr.filter((item,index,self)=>{
            	return self.indexOf(item)  === index
            }).slice(0,15)

	        StorageUtil.set("historys",JSON.stringify(state.historys))
            gotoSearch()
        }
    }

    const gotoSearch =()=>{
	    // searchValueWidthOut().setSearchValue(state.searchValue)
        state.showDiv=false
	    router.push({
          path:'/searchResult',
          query:{
          	searchValue: state.searchValue
          }
        })
	    // state.loading = true
	    // goSearch( { searchValue:state.searchValue} ).then((res) => {
		//     if (res.code === 200) {
		// 		route.push({path:'/searchResult'})
        //         // 将搜索结果进行存储，然后传递到searchResult
        //         console.log("成功")
		//     } else {
		// 	    state.searchValue = ''
		// 	    ElMessage.error("搜索失败！")
		//     }
	    // }).catch(error=>{
		//     state.searchValue = ''
		//     ElMessage.error("失败！")
	    // })
	    // state.loading = false
    }

</script>

<style lang="less" scoped>
    /deep/ .el-input-group__append{
        cursor: pointer;
    }

    /deep/ .el-tag.is-closable :hover{
        color: #409eff;
    }

    .search {
        z-index: 5;
        border-radius: var(--el-input-border-radius, var(--el-border-radius-base)) var(--el-input-border-radius, var(--el-border-radius-base)) 8px 8px;
        width: 400px;
        background: white;
        line-height: normal;
        margin-top: 8px;


        .input{
            width: 400px;
        }

        .wrapper {
            padding: 15px;
            border: 1px solid #dcdfe6;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            .history{
                margin-bottom: 15px;
                width: 370px;

                .title-row{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    line-height: normal;
                    .title{
                        font-weight: bold;
                        font-size: 15px;
                        color: #636363;
                    }
                    .icon{
                        font-size: 13px;
                        color:gray;
                        cursor: pointer;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                    }

                    .icon :hover{
                        color: #b6b6b6;
                    }
                }

                .history-wrapper{
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    margin-top: 10px;
                    line-height: normal;

                    .his-item{
                        margin: 3px 5px;
                        cursor: pointer;
                        line-height: normal;
                    }

                    .his-item:hover{
                        color:blue;
                    }
                }
            }

            .hots{
                line-height: normal;
                .title{
                    font-weight: bold;
                    font-size: 15px;
                    color: #636363;
                }
                .hot-ul{
                    /*width: 100%;*/
                    padding: 8px;

                    .hot-li{
                        cursor: pointer;
                        .hot-num{
                            margin-right: 10px;
                            font-family: AMGDT;
                            font-weight: bold;
                            color: gray;
                        }
                        .hot-item{
                            color: #262626;
                        }
                    }
                    .hot-li :hover{
                        background: #f5f5f5;
                        color: #409eff;
                    }
                }

            }
        }
    }
    /*@media (min-width: 1024px) {*/
    /*    .searchResult{*/
    /*        width: 30%;*/
    /*        .wrapper {*/
    /*            padding: 15px;*/
    /*        }*/
    /*    }*/
    /*}*/

    /*@media (min-width: 700px) and (max-width: 1024px){*/
    /*    .searchResult{*/
    /*        width: 76%;*/
    /*        left: 12%;*/
    /*        .wrapper {*/
    /*            padding: 15px;*/
    /*        }*/
    /*    }*/
    /*}*/

    /*@media (min-width: 200px) and (max-width: 700px){*/
    /*    .searchResult{*/
    /*        width: 90%;*/
    /*        left: 5%;*/
    /*        .wrapper {*/
    /*            padding: 7px;*/
    /*        }*/
    /*    }*/
    /*}*/
</style>