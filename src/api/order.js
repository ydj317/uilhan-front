import {AuthRequest} from "@/util/request";

export function useMarketOrderApi() {
    return {
        // 주문목록
        getOrderList: (data) => {
            return AuthRequest({
                //url: process.env.VUE_APP_API_URL + "/api/market/order",
                url: "http://127.0.0.1:4523/m1/3329816-0-default/api/market/order",
                method: "get",
                params: data,
            });
        },

        // 주문상세
        getOrderInfo: (data) => {
            return AuthRequest({
                //url: process.env.VUE_APP_API_URL + "/api/market/order",
                url: "http://127.0.0.1:4523/m1/3329816-0-default/api/market/orderInfo",
                method: "get",
                params: data,
            });
        },
    }
}