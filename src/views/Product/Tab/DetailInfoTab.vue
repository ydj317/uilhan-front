<template>
  <div>
  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 360px">
    <a-spin v-if="product.loading" size="large"/>
  </div>
  <div v-show="!product.loading">
    <!--상세페이지-->
    <Description :activeKey="activeKey"></Description>
  </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Description from "@/components/Detail/description.vue";
import {mapState} from "vuex";

export default defineComponent({
  name: "DetailInfoTab",
  components: {Description},

  computed: {
    ...mapState({
      product: state => state.product.detail
    }),
  },

  methods: {

  },
  props: {
    activeKey: {
      type: String,
      default: '1'
    },
  },
})
</script>