import {AuthRequest} from "@/util/request";

export function useMarketOrderApi() {
    return {
        // 주문목록
        getOrderList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/order",
                //url: "http://127.0.0.1:4523/m1/3329816-0-default/api/market/order",
                method: "get",
                params: data,
            });
        },

        // /api/market/order/{id}
        getOrderDetail: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/order/" + data.id,
                method: "get",
            });
        },

        // 클레임목록
        getOrderClaimList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/claim",
                method: "get",
                params: data,
            });
        },

        // 발주처리
        placeOrder: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/order/placeOrder",
                method: "post",
                data: data,
            });
        },

        // 배송처리
        deliveryOrder: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/order/deliveryOrder",
                method: "post",
                data: data,
            });
        },
    }
}