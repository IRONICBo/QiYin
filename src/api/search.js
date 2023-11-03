import axios from "../utils/http";
import StorageUtil from "../utils/localStorage";

// 热词
export const getHots = (params) => {
	return axios({
		url: "/api/v1/video/hots",
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
		url: "/api/v1/video/search",
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