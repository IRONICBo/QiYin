<template>
    <el-dialog v-model="props.visible" title="风格选择" :before-close="cancel" @open="open" width="35%">
        <div id="chart" style="width: 100%; height: 300px;"></div>
    </el-dialog>

</template>

<script setup>
	import {ref, onMounted, reactive, watch} from 'vue';
	import * as echarts from 'echarts';
	import RandomCircle from "../utils/circle"
    import data from "../utils/enum"
	import {sentTags} from "../api/sendTag";
	import {defineProps, nextTick} from "@vue/runtime-core";
		import SessionStorageUtil from "../utils/sessionStorage";
    const props = defineProps({
        visible:{
            type:Boolean,
            default:false
        },
    })
		const state = reactive({
			chartData:[],
            style:data.styles
		})
		const emits=defineEmits(['changeVisible'])

		const getRandomColor=() =>{
			let r = Math.floor(Math.random() * 100) + 155
			let g = Math.floor(Math.random() * 100) + 155
			let b = Math.floor(Math.random() * 100) + 155
			return `rgb(${r},${g},${b})`
		}

		const cancel=() =>{
			emits('changeVisible', false)
            // 点击关闭  在这段时间内不想让他出现
			SessionStorageUtil.set('style',true)
		}

		const open=async()=>{
            const chartContainer = document.getElementById('chart');
            if (chartContainer) {
                await nextTick(); // 等待DOM更新
                createChart(state.chartData);
            }
        }

        onMounted(() => {
            const p = new RandomCircle({
                total: state.style.length, //配置数量
            });

            p.init();
            state.chartData = p.circleArray
        });


			const createChart = (data) => {
				const chart = echarts.init(document.getElementById('chart'));

				const option = {
					series: [
						{
							type: 'scatter',
							data: data.map((circle,index) => ({
                                index:state.style[index].type,
								name: state.style[index].label,
								value: [circle.x, circle.y,circle.r],
							})),
							symbolSize: function (data) {
								return data[2];
							},
							itemStyle: {
								normal:{
                                  color:function(){ return getRandomColor()}
                                }
							},
                            emphasis:{
                              focus:"self", // 高亮的图形和标签样式
	                            label: {
		                            position: 'middle',
	                            }
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    show: true
                                },
                                emphasis: {
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            },
						},
					],
                    xAxis: {
						show:false,
	                    splitLine: {
		                    show: false, // 隐藏 x 轴网格线
	                    },
                    },
                    yAxis: {
	                    show:false,
	                    splitLine: {
		                    show: false, // 隐藏 x 轴网格线
	                    },
                    },
				};

				chart.setOption(option);

				chart.on('click', (params) => {
                    sentTags({style:params.data.index}).then((res)=>{
                        if(res.code === 200){
                        	console.log("成功")
	                        cancel()

                        }
                    })
				});
			};
</script>

<style>

    #chart{
        background: white;
    }
</style>
