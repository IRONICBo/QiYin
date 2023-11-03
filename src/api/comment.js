import axios from "../utils/http"
import StorageUtil from '../utils/localStorage';
//根据videoId 获取到评论列表
export const getComment = (params) => {
	return axios({
		url: "/comment/list",
		method: "get",
		params,
		config: {
			// headers: {
			// 	'token': tokenStore().token
			// },
			timeout: 3000
		}
	})
}
//添加评论
export const addComment = (params) => {
	return axios({
		url: "/comment/add",
		method: "post",
		params,
		config: {
			headers: {
				'token': StorageUtil.get('token')
			},
			timeout: 3000
		}
	})
}

//删除评论
export const delComment = (params) => {
	return axios({
		url: "/comment/delete",
		method: "post",
		params,
		config: {
			headers: {
				'token': StorageUtil.get('token')
			},
			timeout: 3000
		}
	})
}