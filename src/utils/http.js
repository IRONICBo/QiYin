import instance from "./request"
const axios = ({
	               method,
	               url,
	               params,
	               config
               }) => {
	method = method.toLowerCase();
	if (method === 'post') {
		return instance.post(url, params, { ...config })
	} else if (method === 'get') {
		return instance.get(url, {
			params: params,
			...config
		})
	}
}
export default axios