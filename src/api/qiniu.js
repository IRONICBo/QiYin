import request from "../utils/request";

// Get Token
export const getToken = () => {
  return request({
    url: "/qiniu/token",
    method: "get",
  });
};

