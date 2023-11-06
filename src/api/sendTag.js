import axios from "../utils/http";
import StorageUtil from "../utils/localStorage";

// 发送选择标签
export const getHots = (params) => {
	return axios({
		url: "/tags",
		method: "post",
		params: {
            'tags': StorageUtil.get('tags')
        },
		config: {
			// headers: {
			// 	'token': StorageUtil.get('token')
			// },
			timeout: 3000
		}
	})
}

