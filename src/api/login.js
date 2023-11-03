import axios from "../utils/http"
import { tokenStore } from '../stores/user';
import StorageUtil from "../utils/localStorage";
//登录
export const login = (params) => {
	return axios({
		url: "/login",
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
		url: "/register",
		method: "post",
		params,
		config: {
			// headers: {
			// 	'token': StorageUtil.get('token')
			// },
			timeout: 3000
		}
	})
}

export const checkToken = (params) => {
	return axios({
		url: "/check",
		method: "get",
		params,
		config: {
			headers: {
				'token': StorageUtil.get('token')
			},
			timeout: 3000
		}
	})
}

// 根据id获取用户信息
export const getUserInfo = (params) => {
	return axios({
		url: "/userinfo",
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


//退出登录
export const outLogin = (params) => {
	return axios({
		url: "/outLogin",
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