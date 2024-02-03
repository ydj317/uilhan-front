<template>

  <a-modal class="xiangJi" v-model:open="localvisible" :closable="false"
           :cancel-button-props="{ ghost: true, disabled: true }" :footer="null">

    <!-- 模板HTML 不可修改 -->
    <div id="xiangji-app">
      <div id="some-dialog">
        <div class="logo-hide"></div>
        <div class="close-btn" @click="localvisible = false">닫기</div>
        <iframe id="xiangji-image-editor" title="象寄图片精修工具"
                :src="iframeSrc"
                ref="iframeRef"
                style="border:none;" @load="iframeOnload()"></iframe>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {defineComponent} from "vue";
import "@/util/jQuery_v1.10.2";

export default defineComponent({
  name: "newxiangJi",

  emits: ["callbackReceived", "update:isOpen"],

  computed: {
    localvisible: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("update:isOpen", value);
      },
    },
  },

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
  },
  data() {
    return {
      translateTypes: {
        imgTranslate: ["XJ_IMAGE_EDITOR_REQUESTIDS","XJ_IMAGE_EDITOR_URL"],
        ImgMatting: ["XJ_KOUTU_REQUESTIDS","XJ_KOUTU_RESULT"],
      },
      iframeSrc: "https://www.xiangjifanyi.com/image-editor/#/?lang=KOR",
    };
  },
  methods: {
    // 이미지 불러오기
    iframeOnload() {

      const iframe = document.querySelector("#xiangji-image-editor");
      iframe.contentWindow.postMessage(
          {
            name: this.translateTypes[this.translateType][0],
            requestIds: Object.values(this.requestIds),
          },
          "*"
      );
    },

    // 이미지 편집기 적용후 처리
    receiveMessage(e) {
      const self = this;
      e = e || window.event;
      if (e.origin === 'https://www.xiangjifanyi.com' && e.data.name === this.translateTypes[this.translateType][1]) {
        self.$emit("callbackReceived", e.data);
      }
    },
  },

  watch: {
    isOpen: {
      handler(val) {
        if (val === true) {
          window.addEventListener("message", this.receiveMessage);
          this.$nextTick(() => {
            this.iframeSrc = "https://www.xiangjifanyi.com/image-editor/#/?lang=KOR";
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
  top: 32px;
  right: 130px;
  background: #2055f3;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
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
