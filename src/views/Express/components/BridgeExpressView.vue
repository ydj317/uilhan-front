<template>
  <a-modal id="bridgeExpress" v-model:open="visible"
           width="100%" wrap-class-name="full-modal"
           :confirm-loading="state.confirmLoading" @cancel="onClose" class="showModal" :footer="null">
	<div class="express-view">
    <a-flex>
      <a-flex vertical gap="30" class="send-type">
        <div class="fs20 font-SCDream6 color-535660">1.배송방법을 선택해주세요.</div>
        <a-flex>
          <a-flex vertical class="address-list-wrap">
            <div class="fs16 color-3F4249 font-SCDream3">지점을 선택하세요.</div>
            <a-flex vertical>
              <div class="address-list fl-lb checked">
               <a-flex gap="5">
                 <img src="@/assets/img/express/china.png"/>
                 <div class="fs15 color-2755f9 font-SCDream3">광저우</div>
               </a-flex>
                <div class="address-list-check"></div>
              </div>
            </a-flex>
          </a-flex>
        </a-flex>
      </a-flex>
      <a-flex></a-flex>
    </a-flex>
    <a-flex></a-flex>
    <a-flex></a-flex>
    <a-flex></a-flex>
    <a-flex></a-flex>
  </div>
  </a-modal>
</template>

<script setup>
import {computed, createVNode, reactive, ref, toRefs, watchEffect} from "vue";
import {message, Modal} from "ant-design-vue";
import {
	ExclamationCircleOutlined,
	LoadingOutlined,
	QuestionCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
import {useMarketOrderApi} from "@/api/order";
import {useBridgeApi} from "@/api/bridge";
import Cookie from "js-cookie";
import ParseMarketOrderZhCn from "@/components/ParseMarketOrderZhCn.vue";
import OverseasCareDetail from "@/components/OverseasCareDetail.vue";
import {AuthRequest} from "@/util/request";
import plusOutlined from "@ant-design/icons-vue/lib/icons/PlusOutlined";
const state = reactive({
  confirmLoading:false,
});
const emit = defineEmits(["close", "update"]);
const props = defineProps({
  visible: Boolean,
});
let visible = computed({
  get: () => !props.visible, // getter
  set: (value) => emit("close") // setter
});
const onClose = () => {
  emit("close");
};
</script>
<style scoped>
.express-view{
  padding: 0 200px;
}
.send-type{
  height: 584px;
}
.address-list-wrap{
  width: 226px;
}
.address-list-check{
  width: 24px;
  height: 24px;
  background: #f1f3f8;
  border-radius: 50%;
  position: relative;
}
.address-list-check:before{
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%) rotate(-45deg);
  width: 11px;
  height: 6px;
  border-left: 3px solid #cfd2da;
  border-bottom: 3px solid #cfd2da;
}
.address-list-check.checked{
  background: #2755F9;
}
.address-list-check.checked:before{
  border-left: 3px solid white;
  border-bottom: 3px solid white;
}
</style>