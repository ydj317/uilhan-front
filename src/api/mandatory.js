import {AuthRequest} from "@/util/request";

export function useMandatoryApi() {
    return {
        getList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/openmarket/mandatory/list",
                method: "get",
                params: data,
            });
        },
    }
}