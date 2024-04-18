import {AuthRequest} from "@/util/request";

export function useExpressApi() {
    return {
        getExpressList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/express/list",
                method: "get",
                params: data,
            });
        },
        save: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/express/save",
                method: "POST",
                data,
            });
        },

    }
}