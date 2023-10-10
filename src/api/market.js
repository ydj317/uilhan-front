import {AuthRequest} from "@/util/request";

export function useMarketApi() {
    return {
        // 마켓목록
        getMarketList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/selectList",
                method: "get",
                params: data,
            });
        },

    }
}