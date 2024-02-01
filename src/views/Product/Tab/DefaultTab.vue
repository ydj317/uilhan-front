<template>

  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 300px">
    <a-spin v-if="product.loading" size="large"/>
  </div>
  <div v-else>
  <BasicInfo></BasicInfo>
  <MarketData> </MarketData>
  </div>

</template>

<script>
import { defineComponent } from "vue";
import BasicInfo from "@/components/Detail/basicInfo.vue";
import {mapState} from "vuex";
import Loading from "vue-loading-overlay";
import MarketData from "@/components/Detail/MarketData.vue";

export default defineComponent({
  components: {MarketData, Loading, BasicInfo},

  data() {
    return {
      useAutoSave: false,
      productWatchCount: 0
    };
  },

  computed: {
    ...mapState({
      product: state => state.product.detail
    }),
  },
})
</script>