import axios from "../utils/http";
import StorageUtil from "../utils/localStorage";

// 发送选择标签
export const sentTags = (params) => {
	return axios({
		url: "/setStyle",
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

