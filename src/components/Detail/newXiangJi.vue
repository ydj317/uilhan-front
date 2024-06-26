<template>
  <div v-if="loading" style="width:100vw;height: 100vh;position: fixed;z-index: 9999999999;top: 0;left: 0; display: flex;justify-content: center;align-items:center;">
    <a-spin v-if="loading" size="large"/>
  </div>
  <div v-else>
    <a-modal class="xiangJi" v-model:open="isOpen" :closable="false"
             :cancel-button-props="{ ghost: true, disabled: true }" :footer="null" width="100%" wrap-class-name="full-modal">
      <!-- 模板HTML 不可修改 -->
      <div id="xiangji-app">
        <div id="some-dialog">
          <iframe id="xiangji-image-editor" title="象寄图片精修工具"
                  :src="iframeSrc"
                  ref="iframeRef"
                  style="border:none;" @load="iframeOnload()"></iframe>
        </div>
      </div>
    </a-modal>
  </div>

</template>

<script>
import {defineComponent} from "vue";
import "@/util/jQuery_v1.10.2";
import MarketData from "@/components/Detail/MarketData.vue";
import BasicInfo from "@/components/Detail/basicInfo.vue";

export default defineComponent({
  name: "newxiangJi",
  components: { BasicInfo, MarketData },
  emits: ["callbackReceived", "update:isOpen"],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    requestIds: {
      type: Array,
      default: () => [],
    },
    translateType: {
      type: String,
      default: "imgTranslate",
    },
    recharge: {
      type: String,
      default: "0",
    },
    action: {
      type: String,
      default: "",
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
    isMany: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      translateTypes: {
        imgTranslate: ["XJ_IMAGE_EDITOR_REQUESTIDS","XJ_IMAGE_EDITOR_URL"],
        imgMatting: ["XJ_KOUTU_REQUESTIDS","XJ_KOUTU_RESULT"],
      },
      iframeSrc: "http://localhost:3000/#/?lang=KOR",
      iframeKoutuSrc: "http://localhost:3000/koutu/",
    };
  },
  methods: {
    // 이미지 불러오기
    iframeOnload() {
      this.sendMessage();
    },
    sendMessage() {
      let sendData = {
        name: this.translateTypes[this.translateType][0],
        requestIds: Object.values(this.requestIds),
        recharge:this.recharge,
        action:this.action,
        currentIndex:this.currentIndex,
        isMany:this.isMany,
      };
      const iframe = document.querySelector("#xiangji-image-editor");
      iframe.contentWindow.postMessage(
          sendData,
          "*"
      );
    },
    receiveMessage(e) {
      const self = this;
      e = e || window.event;
      if (e.origin === 'http://localhost:3000' && e.data.name === this.translateTypes[this.translateType][1]) {
        self.$emit("callbackReceived", e.data);
      }
    },
    onCancel() {
      this.$emit("update:isOpen", false);
    },
  },
  watch: {
    isOpen: {
      handler(val) {
        if (val === true) {
          window.addEventListener("message", this.receiveMessage);
          this.$nextTick(() => {
            this.iframeSrc = "http://localhost:3000/#/?lang=KOR";
          });
        } else {
          window.removeEventListener("message", this.receiveMessage);
          this.iframeSrc = "";
        }
      },
      immediate: true,
    },
  },
});
</script>

<style>
.logo-hide {
  position: absolute;
  top: 29px;
  left: 30px;
  background: #fff;
  width: 110px;
  height: 45px;
}

.close-btn {
  padding: 4px 20px 6px;
  position: absolute;
  bottom: 122px;
  right: 540px;
  //background: #2055f3;
  border-radius: 5px;
  //color: #fff;
  cursor: pointer;
  border: 1px solid #f2f2f2;
}

.closeBtn:hover {
  background: #4a7dff;
}

.xiangJi,
.xiangJi #xiangji-app,
.xiangJi #some-dialog,
.xiangJi #xiangji-image-editor {
  display: flex !important;
  align-content: center !important;
  justify-content: center !important;
  align-items: center !important;

  margin: 0 auto !important;
  /*padding: 0 !important;*/
  width: 100% !important;
  height: 100% !important;
  top: 0 !important;
  /*left: 0 !important;*/
}

.xiangJi {
  height: 100% !important;
}

.xiangJi .ant-modal-content {
  width: 100% !important;
  height: 100% !important;
  padding: 0;
}

.xiangJi .ant-modal-body {
  width: 100% !important;
  height: 95% !important;
}

.xiangJi .ant-modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  background-color: white !important;
  height: 5% !important;
}

.ant-modal-footer > button.ant-btn.ant-btn-background-ghost {
  display: none !important;
}
</style>
