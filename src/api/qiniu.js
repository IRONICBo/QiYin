import request from "../utils/request";

// Get Token
export const getToken = (ticket) => {
  return request({
    url: "/qiniu/token",
    method: "post",
    data: {
      "ticket": ticket,
    },
  });
};

// Get proxy image
export const getProxyImage = (url) => {
  return request({
    url: "/qiniu/proxy?url=" + url,
    method: "get",
  });
}