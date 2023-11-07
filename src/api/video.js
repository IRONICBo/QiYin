import axios from "../utils/http";
import StorageUtil from "../utils/localStorage";

// {
//     "category": 0,
//     "cover_url": "string",
//     "desc": "string",
//     "play_url": "string",
//     "tags": "string",
//     "title": "string"
// }

// 用户上传视频信息
export const uploadVideoInfo = (params) => {
	return axios({
		url: "/video/upload",
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