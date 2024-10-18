<template>
  <div style="padding: 0 20px;height: 39px;overflow: hidden">
    <a-typography-text style="margin-top: 10px;">
      <a
        href="javascript:void(0)"
        @click="$emit('popup', product.item_id)"
        style="color: black"
      >
        {{ substrName(product) }}
      </a>
    </a-typography-text>
  </div>
</template>

<script setup>
defineProps(['product'])
defineEmits(['popup'])

const substrName = (product) => {
  if (product.item_market === 'Superdelivery' || product.item_market === 'Iherb' || product.item_market === 'Domeggook' || product.item_market === 'Aliexpress') {
    return product.item_trans_name;
  }
  let sName = product.item_is_trans ? product.item_trans_name : product.item_name
  if (sName?.length > 38) {
    return sName.slice(0, 38) + "...";
  }

  return sName;
}
</script>
