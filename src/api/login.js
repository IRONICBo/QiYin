import axios from "../utils/http"
import { tokenStore } from '../stores/user';
//登录
export const login = (params) => {
	return axios({
		url: "/api/v1/login",
		method: "post",
		params,
		config: {
			// headers: {
			// 	'token': tokenStore().token
			// },
			timeout: 3000
		}
	})
}
//注册
export const register = (params) => {
	return axios({
		url: "/api/v1/register",
		method: "post",
		params,
		config: {
			// headers: {
			// 	'token': tokenStore().token
			// },
			timeout: 3000
		}
	})
}
//退出登录
export const outLogin = (params) => {
	return axios({
		url: "/api/v1/outLogin",
		method: "get",
		params,
		config: {
			headers: {
				'token': tokenStore().token
			},
			timeout: 3000
		}
	})
}