<template>
  <!--편집기-->
  <div id="xiangJi">
    <a-modal
      class="xiangJi"
      v-if="product.xiangjiVisible"
      :visible="product.xiangjiVisible"
      :closable="false"
      :ok-text="'닫기'"
      :cancel-button-props="{ ghost: true, disabled: true }"
      @ok="product.xiangjiVisible = false"
    >
      <!-- 模板HTML 不可修改 -->
      <div id="app">
        <div id="some-dialog">
          <iframe
            id="xiangji-image-editor"
            title="象寄图片精修工具"
            src="/static/xiangji/xiangjiProxy.html"
            @load="iframeOnload()"
          ></iframe>
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
import oTranslatRule from "../../../public/static/xiangji/xiangjiUi.json";

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

      // iFrame UI 실시간 번역
      setInterval(() => !this.product.xiangjiVisible || this.translateUI());

      // loading 제거
      this.product.loading = false;
    },

    // 편집기 UI 번역
    translateUI() {
      // 이미지 편집기 프레임 body
      let $oIframeImageEditor = window._$(
        document
          .getElementById("xiangji-image-editor")
          .contentWindow.document.querySelector("body")
      );

      // 예외처리
      $oIframeImageEditor.find("#app .header .logo").remove();
      $oIframeImageEditor
        .find("#app .anticon-question-circle")
        .parent()
        .remove();
      $oIframeImageEditor
        .find('[placeholder="原文内容"]')
        .attr("placeholder", "원본");
      $oIframeImageEditor
        .find('[placeholder="译文内容"]')
        .attr("placeholder", "번역본");

      // if (
      //   $oIframeImageEditor.find('[placeholder="译文内容"]').val() ===
      //   "双击编辑文字"
      // ) {
      //   $oIframeImageEditor
      //     .find('[placeholder="译文内容"]')
      //     .val("123")
      //     .trigger("click")
      //     .trigger("input")
      //     .trigger("keydown");
      // }
      // if (
      //   $oIframeImageEditor.find('[placeholder="번역본"]').val() ===
      //   "双击编辑文字"
      // ) {
      //   $oIframeImageEditor
      //     .find('[placeholder="번역본"]')
      //     .val("123")
      //     .trigger("click")
      //     .trigger("input")
      //     .trigger("keydown");
      // }

      Object.keys(oTranslatRule.rule).map((sOrignalText) => {
        // 기본룰
        let oTranslateElement = $oIframeImageEditor.find(
          `:contains(${sOrignalText})`
        );

        // 예외처리
        let bException = Object.keys(oTranslatRule.exception).includes(
          sOrignalText
        );

        if (bException) {
          oTranslateElement = $oIframeImageEditor.find(
            oTranslatRule.exception[sOrignalText]
          );

          if (oTranslateElement.text() !== oTranslatRule.rule[sOrignalText]) {
            oTranslateElement.text(oTranslatRule.rule[sOrignalText]);
          }
        }

        try {
          if (oTranslateElement.length > 0 && !bException) {
            oTranslateElement = oTranslateElement.eq(
              oTranslateElement.length - 1
            );
            let sTranslateText = oTranslatRule.rule[sOrignalText];
            let sOrignalContents = oTranslateElement[0].firstChild.data;

            if (sOrignalContents && sOrignalContents.trim() === sOrignalText) {
              oTranslateElement[0].firstChild.data = sOrignalContents.replace(
                sOrignalText,
                sTranslateText
              );
            } else {
              sOrignalContents =
                oTranslateElement[0].firstChild.nextSibling.data;
              if (
                sOrignalContents &&
                sOrignalContents.trim() === sOrignalText
              ) {
                oTranslateElement[0].firstChild.nextSibling.data =
                  sOrignalContents.replace(sOrignalText, sTranslateText);
              }
            }
          }
        } catch (e) {
          // console.log(sOrignalText, {
          //   oTranslateElement,
          //   oTranslatRule.rule,
          // });
        }
      });
    },

    // 이미지 편집기 적용후 처리
    listenerImageEditor() {
      let self = this;
      window.addEventListener("message", function (e) {
        const { name, all } = e.data;
        if (name === "XJ_IMAGE_EDITOR_URL") {
          // 편집완료후 데이터 업데이트
          self.product.xiangjiCallback(all);
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
        };

        if (
          this.product.recharge < 1 ||
          oParam.list.length > this.product.recharge
        ) {
          alert("이미지번역 잔여수가 부족합니다.");
          this.product.loading = false;
          return false;
        }

        this.product.loading = true;
        AuthRequest.post(
          process.env.VUE_APP_API_URL + "/api/transimage",
          oParam
        ).then((res) => {
          if (res.status !== "2000") {
            alert(res.message);
            this.product.loading = false;
            return false;
          }

          if (lib.isArray(res.data["list"], true) === false) {
            alert(
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
            let aSplitImage = sUrl.split("/");
            let sRequestId = aSplitImage[aSplitImage.length - 2];
            aXiangjiRequestIds.push(sRequestId);
          });

          // 불러올 이미지 ID
          this.product.xiangjiRequestIds = aXiangjiRequestIds;
          // 이미지 편집기 열기
          this.product.xiangjiVisible = true;
          // // loading 제거
          // this.product.loading = false;

          this.product.xiangjiCallback = xiangjiCallback;
        } catch (e) {
          console.log(e);
          alert("편집기 호출 실패.");
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
.ant-modal-footer > button.ant-btn.ant-btn-background-ghost {
  display: none !important;
}
</style>
