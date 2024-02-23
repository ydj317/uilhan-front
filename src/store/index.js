import { createStore } from "vuex";

export default createStore({
  state: {
    common: {},
    product: {
      onload: false,
      loading: true,
    },
    relaket: {
      data: {},
      methods: {}
    },
    prdlist: [],

    return: {
      isOptionApplied: false,
    },

    //通过Vuex来管理模态窗口的显示状态
    isModalOpen: false,
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
    }
  },
  actions: {
  },
  modules: {},
});
