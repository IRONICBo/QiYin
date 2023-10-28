import axios from "axios";
// import { useUserStore } from "@/pinia/modules/user";
import router from "@/router/index";
import {ElMessage} from "element-plus";
import {tokenStoreWidthOut} from "../stores/user";

const service = axios.create({
  baseURL: '/api',
  timeout: 99999,
});

service.interceptors.request.use(
  (config) => {
    // if (!config.donNotShowLoading) {
    //   showLoading();
    // }
    config.headers = {
      "Content-Type": "application/json",
    //   "x-token": userStore.token,
    //   "x-user-id": userStore.userInfo.ID,
      ...config.headers,
    };
    return config;
  },
  (error) => {
    // if (!error.config.donNotShowLoading) {
    //   closeLoading();
    // }
    // ElMessage({
    //   showClose: true,
    //   message: error,
    //   type: "error",
    // });
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    // if (!response.config.donNotShowLoading) {
    //   closeLoading();
    // }
    // if (response.headers["new-token"]) {
    //   tokenStore.setToken(response.headers["new-token"]);
    // }
    if (response.data.code === 200 || response.data.msg === "success") {
      if (response.headers.msg) {
        response.data.msg = decodeURI(response.headers.msg);
      }
      if (response.data.data.token) {
        tokenStoreWidthOut().setToken(response.data.data.token);
      }
      return response.data;
    } else {
      ElMessage({
        showClose: true,
        message: response.data.msg || decodeURI(response.headers.msg),
        type: "error",
      });
      // if (response.data.data && response.data.data.reload) {
      //   // userStore.token = "";
      //   localStorage.clear();
      //   router.push({ name: "Login", replace: true });
      // }
      return response.data.msg ? response.data : response;
    }
  },
  (error) => {
    // if (!error.config.donNotShowLoading) {
    //   closeLoading();
    // }
    if (!error.response) {
      console.log(error);
      return;
    }

    return error;
  }
);
export default service;
