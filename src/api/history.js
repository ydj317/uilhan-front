import {AuthRequest} from "@/util/request";

export function useHistoryApi() {
    return {
        // 주문목록
        getHistoryList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/history",
                method: "post",
                data: data,
            });
        },
    }
}