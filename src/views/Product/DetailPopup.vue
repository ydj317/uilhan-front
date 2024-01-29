<template>
  <a-modal v-model:open="visible" title="상품상세" width="1000px" style="top: 20px;" @ok="onSubmit" @cancel="onCancel" >
    <a-tabs v-model:activeKey="activeKey"
            :tabBarGutter="30"
    >
      <a-tab-pane v-for="pane in tabList" :key="pane.key">
        <template #tab>
          <div style="display: flex;gap: 3px">
            <span>
              <component :is="pane.icon" />
            </span>
            {{pane.tab}}
          </div>
        </template>
        <component :is="pane.component" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>

import {onMounted, ref, toRefs, watch} from "vue";
import { AndroidOutlined,PictureOutlined,ProfileOutlined } from '@ant-design/icons-vue';
import DefaultTab from "@/views/Product/Tab/DefaultTab.vue";
import ThumbnailTab from "@/views/Product/Tab/ThumbnailTab.vue";
import OptionTab from "@/views/Product/Tab/OptionTab.vue";
import DetailInfoTab from "@/views/Product/Tab/DetailInfoTab.vue";
import {useRoute} from "vue-router";
import {lib} from "@/util/lib";
import {message} from "ant-design-vue";
import router from "@/router";
import {AuthRequest} from "@/util/request";

const props = defineProps({
  visible: Boolean,
  prdId: {
    type: String,
    required: true
  }
});

const { visible,prdId } = toRefs(props)
const emit = defineEmits(['update:visible']);


const activeKey = ref('1');
const tabList = [
  {
    key: '1',
    tab: '기본정보',
    icon: ProfileOutlined,
    component: DefaultTab,
  },
  {
    key: '2',
    tab: '썸네일',
    icon: PictureOutlined,
    component: ThumbnailTab,
  },
  {
    key: '3',
    tab: '옵션정보',
    icon: AndroidOutlined,
    component: OptionTab,
  },
  {
    key: '4',
    tab: '상세페이지',
    icon: AndroidOutlined,
    component: DetailInfoTab,
  },
];

const getProduct = () => {

  if (!lib.isNumeric(prdId.value)) {
    message.warning("상품번호가 잘못되었습니다.");
    router.push("/product");
    return false;
  }

  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prd", {
    params: { prduct_idx: prdId.value },
  }).then((res) => {
    if (
        lib.isEmpty(res) ||
        res.status !== "2000" ||
        lib.isEmpty(res.data)
    ) {
      message.success(res.message);
      router.push("/product");
      this.product.loading = false;
      return false;
    }

    this.$store.state.product = Object.assign(this.product, res.data); //vueX
    if (Array.isArray(this.product.item_cate) && this.product.item_cate.length === 0){
      this.product.item_cate = {};
    }

    if ((Array.isArray(this.product.item_disp_cate) && this.product.item_disp_cate.length === 0) || lib.isEmpty(this.product.item_disp_cate)){
      this.product.item_disp_cate = {};
    }

    // 상품 전송여부 판단
    this.product.is_sync = "F";
    this.product.item_sync_market.forEach(item => {
      if (item.status !== "unsync") {
        this.product.is_sync = "T";
        return false;
      }
    })

    this.initSku();

    this.product.select_pvs = [1,2];

    this.product.onload = true;
    this.product.loading = false;
  });
}

onMounted(() => {
  //getProduct();
})

watch(() => prdId.value, (_newId,_oldId) => {
  console.log(_newId);
  getProduct();
})
const onCancel = () => {
  console.log('cancel!');
  emit('update:visible');
}
const onSubmit = () => {
  console.log('submit!');
  emit('update:visible');
}
</script>