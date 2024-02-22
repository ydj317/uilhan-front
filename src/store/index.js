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
    showOptionModifyModal: false,
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

    // 상품상세에서 옵션 수정 모달 띄우기
    setShowOptionModifyModal(state, value) {
      state.showOptionModifyModal = value;
    }
  },
  actions: {},
  modules: {},
});
