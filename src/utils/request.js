import axios from "axios";
// import { useUserStore } from "@/pinia/modules/user";
import router from "@/router/index";

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 99999,
});

service.interceptors.request.use(
  (config) => {
    if (!config.donNotShowLoading) {
      showLoading();
    }
    // const userStore = useUserStore();
    config.headers = {
      "Content-Type": "application/json",
    //   "x-token": userStore.token,
    //   "x-user-id": userStore.userInfo.ID,
      ...config.headers,
    };
    return config;
  },
  (error) => {
    if (!error.config.donNotShowLoading) {
      closeLoading();
    }
    ElMessage({
      showClose: true,
      message: error,
      type: "error",
    });
    return error;
  }
);

service.interceptors.response.use(
  (response) => {
    // const userStore = useUserStore();
    if (!response.config.donNotShowLoading) {
      closeLoading();
    }
    if (response.headers["new-token"]) {
    //   userStore.setToken(response.headers["new-token"]);
    }
    if (response.data.code === 0 || response.headers.success === "true") {
      if (response.headers.msg) {
        response.data.msg = decodeURI(response.headers.msg);
      }
      return response.data;
    } else {
      ElMessage({
        showClose: true,
        message: response.data.msg || decodeURI(response.headers.msg),
        type: "error",
      });
      if (response.data.data && response.data.data.reload) {
        // userStore.token = "";
        localStorage.clear();
        router.push({ name: "Login", replace: true });
      }
      return response.data.msg ? response.data : response;
    }
  },
  (error) => {
    if (!error.config.donNotShowLoading) {
      closeLoading();
    }

    if (!error.response) {
      console.log(error);
      return;
    }

    return error;
  }
);
export default service;
