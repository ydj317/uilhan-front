import {AuthRequest} from "@/util/request";

export function useMarketOrderApi() {
    return {
        // 계정주문목록
        getOrderList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/order",
                method: "get",
                params: data,
            });
        },
    }
}