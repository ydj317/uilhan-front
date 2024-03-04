import {createStore} from "vuex";
import product from "@/store/modules/product";
import marketAccount from "@/store/modules/marketAccount";

export default createStore({
  state: {
    common: {},
    return: {
      isOptionApplied: false,
    },
    isModalOpen: false,
    isOptionModified: false,
  },
  mutations: {
    //bottonBanner옵션적용
    setOptionApplied(state, value) {
      state.isOptionApplied = value;
    },
    setOptionModified(state, value) {
      state.isOptionModified = value;
    },

    setUseAutoSave(state, value) {
      state.useAutoSave = value;
    },

    //用于修改 isModalOpen 的值。
    setIsModalOpen(state, value) {
      state.isModalOpen = value;
    },

    // 상품상세에서 옵션 수정 모달 띄우기
    setShowOptionModifyModal(state, value) {
      state.showOptionModifyModal = value;
    }
  },
  actions: {
  },
  modules: {
    product,
    marketAccount
  },
});
