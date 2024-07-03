<template>
  <div>
  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 600px">
    <a-spin v-if="product.loading" size="large"/>
  </div>
  <div v-else>
  <BasicInfo @suggest-category="handleSuggestCategory" :activeKey="activeKey"></BasicInfo>
  <MarketData :suggest-category="suggestCategory"> </MarketData>
  </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import Loading from "vue-loading-overlay";
import BasicInfo from "@/components/Detail/basicInfo.vue";
import MarketData from "@/components/Detail/MarketData.vue";

export default {
  components: {MarketData, Loading, BasicInfo},

  data() {
    return {
      useAutoSave: false,
      productWatchCount: 0,
      suggestCategory: []
    };
  },

  computed: {
    ...mapState({
      product: state => state.product.detail
    }),
  },
  props: {
    activeKey: {
      type: String,
      default: '1'
    },
  },
  watch: {
    "product.item_id"() {
      this.suggestCategory = []
    }
  },
  methods: {
    handleSuggestCategory(categories) {
      if (! Array.isArray(categories)) {
        categories = []
      }
      this.suggestCategory = categories
    }
  }
}
</script>