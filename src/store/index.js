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
    isRefundModalOpen: false,
  },
  mutations: {
    //bottonBanner옵션적용
    setOptionApplied(state, value) {
      state.isOptionApplied = value;
    },

    setUseAutoSave(state, value) {
      state.useAutoSave = value;
    },

    //用于修改 isModalOpen 的值。
    setIsModalOpen(state, value) {
      state.isModalOpen = value;
    },

    setIsRefundModalOpen(state, value) {
      state.isRefundModalOpen = value;
    }
  },
  actions: {
  },
  modules: {
    product,
    marketAccount
  },
});
