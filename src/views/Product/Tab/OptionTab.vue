<template>
  <div>
  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 600px">
    <a-spin v-if="product.loading" size="large"/>
  </div>
  <div v-else>
    <!--Sku-->
    <Sku></Sku>

    <!--New Spec-->
    <NewSpec></NewSpec>
  </div>
  </div>
</template>

<script>
import {defineAsyncComponent, defineComponent,} from "vue";
import Sku from "@/components/Detail/Sku.vue"
import NewSpec from "@/components/Detail/Spec/NewSpec.vue"
import {mapState} from "vuex";

export default {
  components: {Sku,NewSpec},

  computed: {
    ...mapState({
      product: state => state.product.detail
    }),
  },
}
</script>