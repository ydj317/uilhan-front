import {AuthRequest} from "@/util/request";

export function useCustomOrderApi() {
    return {
        // 구매관리 리스트
        getCustomOrderList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/list",
                method: "get",
                params: data,
            });
        },
        updateCustomOrder: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/update",
                method: "post",
                data: data,
            });
        },
        downloadCustomOrderExcel: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/excelDownload",
                method: "post",
                data: data,
            });
        },
        deleteCustomOrder: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/delete",
                method: "post",
                data: data,
            });
        }
    }
}