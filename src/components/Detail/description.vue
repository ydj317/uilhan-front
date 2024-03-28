<template>
  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 300px">
    <a-spin v-if="product.loading" size="large" />
  </div>
  <div v-show="!product.loading" id="eModelTitle_4" class="bg-white">
    <!--title-->
    <div style="display: flex; justify-content: space-between;">
      <div style="display: flex;align-items: center;">
        <a-space>
          <a-checkbox v-model:checked="this.showGuideImage" @change="handleGuideImageToggle">상/하단 이미지</a-checkbox>
          <a-checkbox v-model:checked="this.showVideo">동영상</a-checkbox>
          <a-checkbox v-model:checked="this.showOptionTable" @change="handleOptionTableToggle">옵션테이블</a-checkbox>
        </a-space>
      </div>
      <div class="editorToolbar">
        <a-space>
          <a-button class="originalDetailTrans" type="default" @click="showPreview">미리보기</a-button>
          <a-button type="primary" @click="translatePopup" style="background-color: #1e44ff;color: white">상세 이미지번역
          </a-button>
          <a-button type="primary" @click="translatePopup" style="background-color: #1e44ff;color: white">통상세 만들기
          </a-button>
        </a-space>

      </div>
    </div>

    <!-- 상세페이지 편집기 -->
    <div style="margin-top: 10px;">
      <TEditor
          ref="editor"
          v-model:value="product.item_detail"
          :productId="Number(product['item_id'])"
          @contentUpdate="contentUpdate"
      />
    </div>
  </div>
  <image-translate-tools v-model:visible="imageTranslateToolsVisible"
                         @update:visible="imageTranslateToolsVisible = false" :translateImageList="translateImageList"
                         @update:translateImageList="updateTranslateImageList" />
  <!-- 미리보기 -->
  <a-modal v-model:open="this.previewVisible"
           title="상품 미리보기"
           width="1000px"
           :centered="true"
           :footer="null"
           @ok="this.previewVisible = false">
    <div v-html="modalContent" id="previewContainer">

    </div>
  </a-modal>
</template>

<script>
import { cloneDeep, forEach } from "lodash";
import { mapState } from "vuex";
import TEditor from "../ImageEditor/TEdtor";
import { watch, watchEffect } from "vue";
import { message } from "ant-design-vue";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import ImageTranslateTools from "@/components/Detail/ImageTranslateTools.vue";


export default {
  name: "productDetailDescription",

  components: {
    ImageTranslateTools,
    QuestionCircleOutlined,
    TEditor
  },


  computed: {
    ...mapState({
      product: (state) => state.product.detail,
      descriptionOption: (state) => state.product.detail?.user?.description_option
    })
  },

  data() {
    return {
      aBakDetailImages: {},
      optionTableId: "editor_option_table",
      guideBeforeId: "editor_before_guide",
      guideAfterId: "editor_after_guide",
      videoId: "editor_video_content",

      imageTranslateToolsVisible: false,
      translateImageList: [],
      previewVisible: false,
      modalContent: "",
      showGuideImage: false,
      showVideo: false,
      showOptionTable: false,

      userTriggeredChange: false
    };
  },
  watch: {
    descriptionOption: {
      handler() {
        this.showGuideImage = this.descriptionOption?.top_bottom_image?.use ?? false;
        this.showVideo = this.descriptionOption?.show_video ?? false;
        this.showOptionTable = this.descriptionOption?.option_table?.use ?? false;

        //和setGuideContent
        if (!!this.showGuideImage) {
          this.$nextTick(() => {
            this.handleGuideImageToggle();
          })
        }
        if (!!this.showOptionTable) {
          this.$nextTick(() => {
            this.handleOptionTableToggle();
          })
        }
      },
      immediate: true,
      deep: true
    },
  },

  mounted() {
    this.fetchData();
    this.getGuide();
    this.$nextTick(() => {
      watch(() => this.showGuideImage, (newValue) => {
        if (newValue === true) {
          this.setGuideContent();
        } else {
          if (this.product.loading !== true) {
            this.deleteGuideContent();
          }
        }
      });

      watch(() => this.showVideo, (newValue) => {
        this.setVideoContent();
      });
    })
  },

  methods: {
    setVideoContent() {
      const regexVideo = new RegExp(`<div id="${this.videoId}".*?</div>`, "igs");
      this.product.item_detail = this.product.item_detail.replace(regexVideo, "");
      if ((this.product.item_video_url === "" || this.product.item_video_url === null) && this.showVideo === true) {
        message.warning("수집된 상품정보에 동영상 URL이 존재하지 않습니다.");
        this.showVideo = false;
        return false;
      }

      if (this.showVideo === false) {
        return false;
      }

      const videoContent = `<div id="${this.videoId}">
                            <video width="auto;" height="400;" controls="controls">
                            <source src="${this.product.item_video_url}" type="video/mp4"></video>
                            </div>`;
      let regex = new RegExp(`<div id="${this.guideBeforeId}".*?</div>`, "igs");
      const match = regex.exec(this.product.item_detail);
      if (match !== null) {
        this.product.item_detail = this.product.item_detail.replace(regex, "");
        this.product.item_detail = match[0] + videoContent + this.product.item_detail;
      } else {
        this.product.item_detail = videoContent + this.product.item_detail;
      }
    },

    handleGuideImageToggle(e) {
      // 检查图片设置是否存在[]时
      if (!this.descriptionOption?.top_bottom_image) {
        message.warning("상/하단 이미지 설정이 없습니다. \n계정설정에서 상/하단 이미지 설정을 등록하여 주시기 바랍니다.");
        this.showGuideImage = false;
        return;
      }

      // 设置用户交互触发标志为true
      this.userTriggeredChange = true;

      this.setGuideContent();
    },

    setGuideContent() {
      // 如果不是初始加载并且不是用户交互触发，不执行
      if (!this.userTriggeredChange) {
        return;
      }

      if (this.showGuideImage === true &&
          this.product.user.description_option.top_bottom_image.top_image_url === "" &&
          this.product.user.description_option.top_bottom_image.bottom_image_url === "") {
        message.warning("등록된 상/하단 이미지가 없습니다. \n" +
            "계정설정에서 별도로 등록하여 주시기 바랍니다.");
        this.showGuideImage = false;
        return;
      }

      const beforeCont = `<div id="${this.guideBeforeId}" ><img src="${this.product.user.description_option.top_bottom_image.top_image_url}" alt=""></div>`;
      const afterCont = `<div id="${this.guideAfterId}" ><img src="${this.product.user.description_option.top_bottom_image.bottom_image_url}" alt=""></div>`;
      if (this.product.user.description_option.top_bottom_image.top_image_url !== "") {
        this.product.item_detail = beforeCont + this.product.item_detail;
      }

      if (this.product.user.description_option.top_bottom_image.bottom_image_url !== "") {
        this.product.item_detail = this.product.item_detail + afterCont;
      }

      // 执行后重置用户交互触发标志
      this.userTriggeredChange = false;
    },

    deleteGuideContent() {
      if (!!this.product.item_detail) {
        const regex = new RegExp(`<div id="${this.guideBeforeId}".*?</div>|<div id="${this.guideAfterId}".*?</div>`, "igs");
        this.product.item_detail = this.product.item_detail.replace(regex, "");
      }
    },

    getGuide() {
      if (this.showGuideImage === false) {
        return;
      }
      // 기존에 있는지 업는지 판단소스를 써줘
      const regexBefore = new RegExp(`<div id="${this.guideBeforeId}"><\\/div>`, "ig");
      const regexAfter = new RegExp(`<div id="${this.guideAfterId}"><\\/div>`, "ig");
      const matchBefore = regexBefore.exec(this.product.item_detail);
      const matchAfter = regexAfter.exec(this.product.item_detail);

      if (matchBefore === null) {
        const beforeCont = `<div id="${this.guideBeforeId}"></div>`;
        this.product.item_detail = beforeCont + this.product.item_detail;
      }

      if (matchAfter === null) {
        const afterCont = `<div id="${this.guideBeforeId}"></div>`;
        this.product.item_detail = this.product.item_detail + afterCont;
      }

    },

    handleOptionTableToggle(e) {
      if (!this.descriptionOption?.option_table) {
        message.warning("옵션테이블 설정이 없습니다. \n" +
            "계정설정에서 옵션테이블 설정을 등록하여 주시기 바랍니다.");
        this.showOptionTable = false;
        return;
      }
      this.setOptionTableContent();
    },

    setOptionTableContent() {
      setTimeout(() => {
        if (window.tinymce.editors && window.tinymce.editors[0]) {
          let doc = window.tinymce.editors[0].dom.doc;
          let optionTableDoc = doc.querySelector(`div#${this.optionTableId}`);
          if (this.showOptionTable === false) {
            if (optionTableDoc) {
              optionTableDoc.innerHTML = "";
              this.product.item_detail = doc.documentElement.innerHTML;
            }
            return;
          }

          let columnCount = this.product.user.description_option.option_table.column_length ?? 2;
          let optionHtml = this.getOptionTable(columnCount);
          if (optionTableDoc) {
            optionTableDoc.innerHTML = optionHtml;
            this.product.item_detail = doc.documentElement.innerHTML;
          } else {
            const optionTable = `<div id="${this.optionTableId}">${optionHtml}</div>`;
            // top에 올라가게 변경
            let regex = new RegExp(`<div id="${this.guideBeforeId}".*?</div>`, "igs");
            // bottom에 올라가게 변경
            if (this.product.user.description_option.option_table.show_position === "bottom") {
              // <div id="${this.guideAfterId}"[^>] 위에 올라가게 변경
              regex = new RegExp(`<div id="${this.guideAfterId}".*?</div>`, "igs");
            }

            const match = regex.exec(this.product.item_detail);
            if (match !== null) {
              if (this.product.user.description_option.option_table.show_position === "bottom") {
                this.product.item_detail = this.product.item_detail.replace(regex, "");
                this.product.item_detail = this.product.item_detail + optionTable + match[0];
              } else {
                this.product.item_detail = this.product.item_detail.replace(regex, "");
                const regexVideo = new RegExp(`<div id="${this.videoId}".*?</div>`, "igs");
                const matchVideo = regexVideo.exec(this.product.item_detail);
                if (matchVideo !== null) {
                  this.product.item_detail = this.product.item_detail.replace(regexVideo, "");
                  this.product.item_detail = match[0] + matchVideo[0] + optionTable + this.product.item_detail;
                } else {
                  this.product.item_detail = match[0] + optionTable + this.product.item_detail;
                }
              }
            } else {
              if (this.product.user.description_option.option_table.show_position === "bottom") {
                this.product.item_detail = this.product.item_detail + optionTable;
              } else {
                this.product.item_detail = optionTable + this.product.item_detail;
              }
            }
          }
        }
      },100);
    },

    fetchData() {

      // 품목 이미지, 품목명 변경에 따라 액션
      watchEffect(() => {
        if (this.product.loading !== true) {
          this.product.sku.map(item => item.img);
          //변경될 경우 테이블 업데이트
          this.$nextTick(() => {
            this.setOptionTable();
          });
        }
      });
    },

    setOptionTable() {
      let dom = window.tinymce.editors[0].dom;
      if (dom === undefined) {
        return;
      }
      //테이블 추가 여부 확인
      let optionTableDoc = dom.doc.querySelector(`div#${this.optionTableId}`);
      if (!optionTableDoc) {
        return;
      }
      let optionHtml;
      //테이블 2줄로 추가
      if (optionTableDoc.querySelector(`table#${this.optionTableId}_2`)) {
        optionHtml = this.getOptionTable(2);
      }
      //테이블 4줄로 추가
      if (optionTableDoc.querySelector(`table#${this.optionTableId}_4`)) {
        optionHtml = this.getOptionTable(4);
      }
      if (optionHtml) {
        optionTableDoc.innerHTML = optionHtml;
        this.product.item_detail = dom.doc.documentElement.innerHTML;
      }
    },
    getOptionTable(columnCount) {
      let tableId = `${this.optionTableId}_${columnCount}`;
      //columnCount은 2줄로 보기 혹은 4줄로 보기
      let optionHtml = `<table id="${tableId}" border="1" style="border-collapse: collapse; margin-left: auto; margin-right: auto;">`;
      let i = 1;
      let trStartTag = null;
      let skuLength = this.product.sku.length;
      forEach(this.product.sku, (item) => {
        if (i === 1 || i === trStartTag) {
          //다음번 tr 시작 태그
          trStartTag = i + columnCount;
          optionHtml += "<tr>";
        }
        let imgHtml = item.img === null || item.img === "" ? `<div style="height:100px;width:100px;"></div>` : `<img style="height:100px;width:100px;" src="${item.img}">`;
        optionHtml += `<td style="min-height:100px;min-width:100px;">${imgHtml}</td>`;
        optionHtml += `<td style="min-height:100px;min-width:150px; text-align: center;">${item.spec}</td>`;
        //1줄 이상의 데이타일 경우 부족한 td 추가해줌
        if (i === skuLength) {
          if (skuLength > columnCount && skuLength % columnCount !== 0) {
            for (let j = 0; j < (columnCount - skuLength % columnCount); j++) {
              optionHtml += `<td style="min-height:100px;min-width:100px;"></td>`;
              optionHtml += `<td style="min-height:100px;min-width:150px;"></td>`;
            }
          }
        }

        //tr태그 닫음
        if (i % columnCount === 0) {
          optionHtml += "</tr>";
        }
        i++;
      });
      optionHtml += "</table>";

      return optionHtml;
    },
    contentUpdate(tinymce) {
      this.product.item_detail = tinymce.editors[0].getContent();
    },

    getDetailContentsImage() {
      let content = window.tinymce.editors[0].getContent();
      const regex = /<div id="editor_option_table">[\s\S]*?<\/div>/g;
      content = content.replace(regex, "");
      if (content === undefined || content.length === 0) {
        message.warning("이미지가 없습니다");
        return false;
      }

      let imgReg = /<img.*?(?:>|\/>)/gi;
      let arr = content.match(imgReg);

      if (arr === undefined || arr === null || arr.length === 0) {
        message.warning("번역하실 이미지가 없습니다");
        return false;
      }

      let srcReg = /src=['"]?([^'"]*)['"]?/i; // 匹配图片中的src
      let srcArr = [];
      let logoUrl = this.product.user.logo;

      arr = arr.filter((data) => {
        try {
          return (
              data.match(srcReg) !== null && data.match(srcReg)[1] !== logoUrl
          );
        } catch (e) {
          return false;
        }
      });

      this.product.aBakDetailImages = [];
      for (let i = 0; i < arr.length; i++) {
        let src = arr[i].match(srcReg);
        if (src !== null) {
          srcArr.push({ url: src[1], key: i });
          this.product.aBakDetailImages[i] = src[1];
        }
      }

      return srcArr;
    },

    translatePopup() {
      let aImagesUrl = this.getDetailContentsImage();
      //이미지 없을 경우
      if (aImagesUrl === false) {
        return false;
      }
      // { order: ..., url: ...} 구조로 변경
      aImagesUrl = aImagesUrl.map((item, index) => {
        return {
          checked: false,
          order: index,
          url: item.url
        };
      });
      aImagesUrl[0].checked = true;

      this.imageTranslateToolsVisible = true;
      this.translateImageList = aImagesUrl;
    },
    updateTranslateImageList(imageList) {
      this.$refs.editor.clear();
      let content = "<p>";
      imageList.forEach((item) => {
        if (item.translate_status === true) {
          content += `<img src="${item.translate_url}" style="max-width: 100%; height: auto;"/>`;
        } else {
          const nUrl = item.translate_url || item.url;
          content += `<img src="${nUrl}" style="max-width: 100%; height: auto;"/>`;
        }
      });
      content += "</p>";
      this.$refs.editor.contentValue = content;
      this.product.item_detail = content;
    },
    showPreview() {
      this.modalContent = cloneDeep(this.product.item_detail);
      this.previewVisible = true;
    }
  }
};
</script>

<style scoped>
#previewContainer {
  overflow: auto;
  max-height: 800px;
  padding: 20px;
  text-align: center; /* 텍스트 중앙 정렬 */
}

#previewContainer img {
  display: block; /* 이미지 블록 레벨 요소로 설정 */
  margin: 0 auto; /* 이미지 상하 마진 0, 좌우 마진 자동으로 설정하여 중앙 정렬 */
  max-width: 100%; /* 이미지가 모달 너비를 초과하지 않도록 설정 */
  height: auto; /* 이미지의 원래 비율을 유지 */
}
</style>
