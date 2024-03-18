import {AuthRequest} from "@/util/request";

export function getProductVisits(data) {
    return AuthRequest({
      url: process.env.VUE_APP_API_URL + "/api/product/visits",
      method: "post",
      data: data,
    });
}

export function findProductVisits(data) {
    return AuthRequest({
      url: process.env.VUE_APP_API_URL + "/api/product/visits/findOne",
      method: "post",
      data: data,
    });
}