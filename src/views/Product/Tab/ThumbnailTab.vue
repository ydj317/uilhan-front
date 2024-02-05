<template>
<div>
  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 600px">
    <a-spin v-if="product.loading" size="large"/>
  </div>
  <div v-else>
    <!--상품 이미지-->
    <ImageUpload></ImageUpload>
  </div>
</div>
</template>

<script>
import { defineComponent } from "vue";
import {mapState} from "vuex";
import ImageUpload from "@/components/Detail/ImageUpload.vue";

export default defineComponent({
  name: "ThumbnailTab",
  components: {ImageUpload},

  computed: {
    ...mapState({
      product: state => state.product.detail
    }),
  },

  methods: {
  },

})
</script>