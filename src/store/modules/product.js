import {AuthRequest} from "@/util/request";
import {lib} from "@/util/lib";
import {message} from "ant-design-vue";

const state = () => ({
    detail: {
        onload: false,
        loading: true,
        resetOption : false  // 수집시 옵션으로 초기화
    },

    dataLoaded: false, // 表示产品详情是否加载完毕

    showOptionModify: false,    // 옵션수정 모달노출여부
    showOptionPreview: false
// 옵션 정보 초기화
});

const getters = {}

const mutations = {
    setDetail(state, value) {
        state.detail = value;
    },
    // 상품상세에서 옵션 수정 모달 띄우기
    setShowOptionModify(state, value) {
        state.showOptionModify = value;
    },

    setShowOptionPreview(state, value) {
        state.showOptionPreview = value;
    },


    // 添加一个状态表示数据是否加载完成
    setDataLoaded(state, loaded) {
        state.dataLoaded = loaded;
    },
};

const actions = {
    async getDetail({commit, state}, value) {
        commit('setDataLoaded', false);// 开始加载前设置为 false

        try {
            state.detail.loading = true;
            await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prd", {
                params: {product_idx: value},
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
                commit('setDataLoaded', true); // 数据加载成功
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