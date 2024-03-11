<template>
  <div style="display: flex;justify-content: space-between;align-items: center;padding: 0 20px;">
    <strong>{{ product.show_price }}</strong>
    <div style="display: flex;gap: 3px;align-items: center">
      <template v-for="(market_info, key) in product.item_sync_market" :key="key">
        <a-tooltip placement="bottom">
          <template #title>
            <span>{{ market_info.seller_id }}</span>
          </template>
          <span
            class="item-market-icon"
            :class="market_info.status"
            @click="$emit('popup', market_info)"
          ><img :src="getLogoSrc('market-logo', market_info.market_code)" alt=""></span>
        </a-tooltip>
      </template>
    </div>
  </div>
</template>

<script setup>
import {getLogoSrc} from "@/util/functions";

defineProps(['product'])
defineEmits(['popup'])

</script>

<style scoped>
.item-market-icon img {
  width: 16px;
  height: 16px;
}

.unsync img {
  cursor: pointer;
  filter: grayscale(100%);
  opacity: 0.3;
}

.unsync:hover img {
  filter: grayscale(0%);
  opacity: 1;
}

.failed img,
.success img,
.sending img {
  cursor: pointer;
  filter: grayscale(0%);
  opacity: 1;
}
</style>