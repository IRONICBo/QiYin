
import axios from "../utils/http";
import StorageUtil from "../utils/localStorage";

//点赞
export const favoriteAction = (params) => {
	return axios({
		url: "/favorite/action",
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