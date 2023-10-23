import {AuthRequest} from "@/util/request";

export function useMarketOrderApi() {
    return {
        // 주문목록
        getOrderList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/order",
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
        getClaimList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/claim",
                method: "get",
                params: data,
            });
        },

        // /api/market/order/{id}
        getClaimDetail: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/claim/" + data.id,
                method: "get",
            });
        },

        // 발주처리
        receiverOrder: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/order/receiverOrder",
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

        excelDownload: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/order/excelDownload",
                method: "post",
                data: data,
            });
        },
    }
}