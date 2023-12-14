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
        // qrcode 생성
        createQrcode: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/tools/getQrcode",
                method: "get",
                params: data,
            });
        },
        deleteCustomOrder: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/delete",
                method: "post",
                data: data,
            });
        },
        getCountWithStatus: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/count",
                method: "get",
                params: data,
            });
        },
        getCustomOrderDetail: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/detail",
                method: "get",
                params: data,
            });
        },
        setReceiptCompleted : (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/receipt",
                method: "post",
                data: data,
            });
        },

        getCustomOrderReceiptList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/receiptList",
                method: "get",
                params: data,
            });
        },

        // 입고처리
        setWaitWarehouse : (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/waitWarehouse",
                method: "post",
                data: data,
            });
        },

        downloadCustomOrderReceiptList: (data) => {
            return AuthRequest({
                url: process.env.VUE_APP_API_URL + "/api/custom/order/receiptList/download",
                method: "post",
                data: data,
            });
        }



    }
}