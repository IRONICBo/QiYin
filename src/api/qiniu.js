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