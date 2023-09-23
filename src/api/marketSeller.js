import {AuthRequest} from "@/util/request";

export function useMarketSellerApi() {
    return {
        // 계정목록
        getSellerList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/seller",
                method: "get",
                params: data,
            });
        },

        // 계정등록/수정
        registerOrModifySeller: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/market/seller",
                method: "post",
                data,
            });
        },

        // 계정삭제
        deleteSeller: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/category/searchList/" + data.id,
                method: "DELETE",
                data,
            });
        },
    }
}