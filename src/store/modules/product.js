import {AuthRequest} from "@/util/request";
import {lib} from "@/util/lib";
import {message} from "ant-design-vue";

const state = () => ({
    detail: {
        onload: false,
        loading: true,
    },
});

const getters = {}

const mutations = {
    setDetail(state, value) {
        state.detail = value;
    },
};

const actions = {
    async getDetail({commit, state}, value) {
        try {
            state.detail.loading = true;
            await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prd", {
                params: {prduct_idx: value},
            }).then((res) => {
                if (
                    lib.isEmpty(res) ||
                    res.status !== "2000" ||
                    lib.isEmpty(res.data)
                ) {
                    message.success(res.message);
                    router.push("/product");
                    return false;
                }
                res.data.item_is_free_delivery = res.data.item_is_free_delivery === "T";
                commit("setDetail", res.data);
            }).finally(() => {
                state.detail.onload = true;
                state.detail.loading = false;
            });
        } catch (e) {
            console.log(e);
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}