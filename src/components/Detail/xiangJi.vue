<template>
  <!--편집기-->
  <div id="xiangJi">
    <a-modal class="xiangJi" v-if="product.xiangjiVisible" :visible="product.xiangjiVisible" :closable="false"
      :cancel-button-props="{ ghost: true, disabled: true }" :footer="null">
      <!-- 模板HTML 不可修改 -->
      <div id="app">
        <div id="some-dialog">
          <div class="logo-hide"></div>
          <div class="close-btn" @click="product.xiangjiVisible = false">닫기</div>
          <iframe id="xiangji-image-editor" title="象寄图片精修工具" src="https://www.xiangjifanyi.com/image-editor/#/?lang=KOR"
            style="border:none;" @load="iframeOnload()"></iframe>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import "@/util/jQuery_v1.10.2";
import { mapState } from "vuex";
import { AuthRequest } from "@/util/request";
import { lib } from "@/util/lib";
import { message } from "ant-design-vue";

export default {
  name: "xiangJi",

  data() {
    return {};
  },

  computed: {
    ...mapState(["product"]),
  },

  methods: {
    // 이미지 불러오기
    iframeOnload() {
      const iframe = document.querySelector("#xiangji-image-editor");
      iframe.contentWindow.postMessage(
        {
          name: "XJ_IMAGE_EDITOR_REQUESTIDS",
          requestIds: Object.values(this.product.xiangjiRequestIds),
        },
        "*"
      );

      // loading 제거
      this.product.loading = false;
    },

    // 이미지 편집기 적용후 처리
    listenerImageEditor() {
      let self = this;
      window.addEventListener("message", function (e) {
        if (e.origin === 'https://www.xiangjifanyi.com') {
          let content = window.tinymce.editors[0].getContent();
          const { name, all } = e.data;
          if (name === "XJ_IMAGE_EDITOR_URL") {
            // 편집완료후 데이터 업데이트
            self.product.xiangjiCallback(all);
          }
        }
      });
    },

    // 이미지 번역
    translateImage() {
      this.product.translateImage = (aImagesInfo = [], xiangjiCallback) => {
        let oParam = {
          from: "zh",
          to: "ko",
          list: aImagesInfo,
          isTranslate: this.product.isTranslate,
        };

        if (
          this.product.recharge < 1 ||
          oParam.list.length > this.product.recharge
        ) {
          message.warning("이미지번역 잔여수가 부족합니다.");
          this.product.loading = false;
          return false;
        }

        this.product.loading = true;
        AuthRequest.post(
          process.env.VUE_APP_API_URL + "/api/transimage",
          oParam
        ).then((res) => {
          if (res.status !== "2000") {
            message.error(res.message);
            this.product.loading = false;
            return false;
          }

          if (lib.isArray(res.data["list"], true) === false) {
            message.error(
              "번역 실패. 오류가 지속될경우 관리자에게 문의하시길 바랍니다."
            );
            this.product.loading = false;
            return false;
          }

          // 이미지번역 잔여수 업데이트
          this.product.recharge = res.data.recharge;

          // 이미지 편집기 호출
          let oTranslateInfo = {};
          res.data["list"].map((data) => {
            oTranslateInfo[data.key] = data;
          });

          xiangjiCallback(oTranslateInfo);
        });
      };
    },

    // 편집기에 이미지 불러오기
    requestXiangji() {
      this.product.requestXiangji = (aEditorImageUrl = [], xiangjiCallback) => {
        try {
          // 불러올 이미지 ID 수집
          let aXiangjiRequestIds = [];
          aEditorImageUrl.map((sUrl) => {
            const searchParams = new URLSearchParams(new URL(sUrl).search);
            // requestID 값을 가져오기
            let requestId = searchParams.get("requestID");

            if(!requestId) {
              const pattern = /\/[a-f0-9]{16}\//i; // 16자리의 영문자와 숫자 조합
              const match = sUrl.match(pattern);
              requestId = match[0].slice(1, -1); // '/' 문자 제거
            }

            aXiangjiRequestIds.push(requestId);
          });

          // 불러올 이미지 ID
          this.product.xiangjiRequestIds = aXiangjiRequestIds;
          // 이미지 편집기 열기
          this.product.xiangjiVisible = true;
          // // loading 제거
          // this.product.loading = false;

          this.product.xiangjiCallback = xiangjiCallback;
        } catch (e) {
          message.error("편집기 호출 실패.");
          this.product.loading = false;
          this.product.xiangjiVisible = false;
        }
      };
    },
  },

  mounted() {
    this.listenerImageEditor();
    this.requestXiangji();
    this.translateImage();
  },
};
</script>

<style>
.logo-hide {
  position: absolute;
  top: 30px;
  left: 30px;
  background: #fff;
  width: 110px;
  height: 45px;
}

.close-btn {
  padding: 4px 20px 6px;
  position: absolute;
  top: 36px;
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
.xiangJi #app,
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

.ant-modal-footer>button.ant-btn.ant-btn-background-ghost {
  display: none !important;
}
</style>
