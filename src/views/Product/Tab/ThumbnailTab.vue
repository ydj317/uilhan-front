<template>

  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 300px">
    <a-spin v-if="product.loading" size="large"/>
  </div>
  <div v-else>
    <!--상품 이미지-->
    <ImageUpload></ImageUpload>
  </div>

</template>

<script>
import { defineComponent } from "vue";
import {mapState} from "vuex";
import ImageUpload from "@/components/Detail/ImageUpload.vue";

export default defineComponent({
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