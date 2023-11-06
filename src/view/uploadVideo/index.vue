<template>
    <div class='con'>
		<div>
			<h1>发布作品</h1>
			<h6>作品描述</h6>
			<el-input
				v-model="textarea"
				:rows="6"
				type="textarea"
				placeholder="写一个合适的标题，能让更多人看到"
			/>
			<div>
				<h6>设置封面</h6>
				<div class='f_pic'>
					<div>
						<el-upload
							class="avatar-uploader"
							action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
							:show-file-list="false"
							:on-success="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload"
						>
						<img v-if="imageUrl" :src="imageUrl" class="avatar" />
						<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
						</el-upload>
					</div>
					<div class='auto_pic'>
						智能封面推荐
					</div>
					
				</div>
			</div>
			<div>
				<h6>视频分类</h6>

			</div>
			<div>
				<h6>允许他人保存视频</h6>
				
			</div>
		</div>
		<div>
			<h1>发布设置</h1>

			<div>
				<h6>设置谁可以看</h6>

			</div>
			<div>
				<h6>发布时间</h6>
				
			</div>
		</div>
		
    </div>
</template>

<script setup>
	import {onBeforeMount, onMounted} from "@vue/runtime-core";
	import {useRoute} from "vue-router";
	import {ElMessage} from "element-plus";
	import {reactive, watch} from "vue";
	import { Timer, Position, Star } from '@element-plus/icons-vue'
	const route = useRoute()

	import { ref } from 'vue'
	const textarea = ref('')


	import { Plus } from '@element-plus/icons-vue'

</script>

<style scoped lang="less">
	.con {
		background-color: white;
		padding:5%
	}
	.f_pic {
		display: flex;
		flex-direction: row;
	}
	.auto_pic {
		background-color: #f2f2f4;
		width:40%
	}

	.avatar-uploader .avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: var(--el-transition-duration-fast);
	}

	.avatar-uploader .el-upload:hover {
		border-color: var(--el-color-primary);
	}

	.el-icon.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		text-align: center;
	}

</style>