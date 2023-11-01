// 创建一个名为 "StorageUtil" 的工具对象
const StorageUtil = {
	// 存储数据到 localStorage
	set(key, value) {
		if (typeof value === 'object') {
			// 如果值是对象，转换为 JSON 字符串再存储
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			// 否则直接存储值
			localStorage.setItem(key, value);
		}
	},

	// 从 localStorage 获取数据
	get(key) {
		const storedValue = localStorage.getItem(key);
		try {
			// 尝试将 JSON 字符串解析为对象
			return JSON.parse(storedValue);
		} catch (error) {
			// 如果解析失败，说明不是 JSON 字符串，直接返回原始值
			return storedValue;
		}
	},

	// 从 localStorage 删除数据
	remove(key) {
		localStorage.removeItem(key);
	},

	// 清空 localStorage
	clear() {
		localStorage.clear();
	},
};
export default StorageUtil;