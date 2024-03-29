<template>
  <div class="btn-link-market">
    <img
      :src="getLogoSrc('get-logo', product.item_market.toLowerCase())"
      style="width: 20px;height: 20px;border-radius: 10px"
    />
    <span>{{ product.item_code }}</span>
    <a
      :href="product.item_url"
      :target="'_blank'"
      style="padding: 0;margin: 0;display: flex;align-items: center"
    >
      <img src="../../../../assets/img/log_out.png" style="width: 15px;height: 15px;"/>
    </a>
  </div>
</template>

<script setup>
import {getLogoSrc} from "@/util/functions";
defineProps(['product'])
</script>

<style scoped>
.btn-link-market {
  position: absolute;
  bottom: 5px;
  width:226px;
  overflow:hidden;
  display: flex;
  gap: 10px;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>