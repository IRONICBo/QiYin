import axios from "../utils/http";
import StorageUtil from "../utils/localStorage";

// 热词
export const getHots = (params) => {
	return axios({
		url: "/video/hots",
		method: "get",
		params,
		config: {
			// headers: {
			// 	'token': StorageUtil.get('token')
			// },
			timeout: 3000
		}
	})
}

//搜索 视频
export const goSearch = (params) => {
	return axios({
		url: "/video/search",
		method: "get",
		params,
		config: {
			// headers: {
			// 	'token': StorageUtil.get('token')
			// },
			timeout: 3000
		}
	})
}


//搜索 用户
export const goSearchUser = (params) => {
	return axios({
		url: "/searchUser",
		method: "get",
		params,
		config: {
			// headers: {
			// 	'token': StorageUtil.get('token')
			// },
			timeout: 3000
		}
	})
}

//根据id获取视频列表
export const getVideos = (params) => {
	return axios({
		url: "/video/list",
		method: "get",
		params,
		config: {
			// headers: {
			// 	'token': StorageUtil.get('token')
			// },
			timeout: 3000
		}
	})
}

//根据id获取喜爱列表
export const getLikeVideos = (params) => {
	return axios({
		url: "/favorite/list",
		method: "get",
		params,
		config: {
			// headers: {
			// 	'token': StorageUtil.get('token')
			// },
			timeout: 3000
		}
	})
}

//根据id获取喜爱列表
export const getColVideos = (params) => {
	return axios({
		url: "/collection/list",
		method: "get",
		params,
		config: {
			// headers: {
			// 	'token': StorageUtil.get('token')
			// },
			timeout: 3000
		}
	})
}