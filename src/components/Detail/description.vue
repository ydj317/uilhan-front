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
      <div class="editorToolbar" ref="editorToolbar">
        <a-space>
          <a-button class="originalDetailTrans" type="default" @click="showPreview">미리보기</a-button>
          <a-spin v-model:spinning="imgLoading">
          <a-button type="primary" @click="translatePopup" style="background-color: #2171e2;color: white">상세 이미지번역
          </a-button>
          </a-spin>
<!--          <a-button type="primary" @click="translatePopup" style="background-color: #2171e2;color: white">통상세 만들기-->
<!--          </a-button>-->
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
  <image-translate-tools ref="imageTranslateTools" v-model:visible="imageTranslateToolsVisible"
                         @update:visible="imageTranslateToolsVisible = false" :translateImageList="translateImageList"
                         @update:translateImageList="updateTranslateImageList"/>
  <old-image-translate-tools ref="oldImageTranslateTools" v-model:visible="visible"
                         :isDetail="true" @update:visible="visible = false" :translateImageList="translateImageList"
                         @update:translateImageList="updateTranslateImageListOld" @update:editorImage="editorImage"/>
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
import OldImageTranslateTools from "@/components/Detail/OldImageTranslateTools.vue";

function checkShow(element, showCallback, hideCallback) {
  const options = {
    root: null,
    threshold: 0
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      try {
        if (entry.isIntersecting) {
          showCallback();
        } else {
          hideCallback()
        }
      } catch (e) {}
    });
  }, options);

  observer.observe(element);
}

export default {
  name: "productDetailDescription",

  components: {
    ImageTranslateTools,
    QuestionCircleOutlined,
    TEditor,
    OldImageTranslateTools
  },

  props: {
    activeKey: {
      type: String,
      default: '1'
    },
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
      visible: false,
      translateImageList: [],
      previewVisible: false,
      modalContent: "",
      showGuideImage: false,
      showVideo: false,
      showOptionTable: false,
      imgLoading:false,
      imgRegexData:[],
    };
  },
  watch: {
    descriptionOption: {
      handler() {
        this.showGuideImage = this.descriptionOption?.top_bottom_image?.use ?? false;
        this.showVideo = this.descriptionOption?.show_video ?? false;
        this.showOptionTable = this.descriptionOption?.option_table?.use ?? false;

        if (this.product.item_upd !== null) {
          this.checkDetatil();
        }


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
        if (!!this.showVideo) {
          this.$nextTick(() => {
            this.setVideoContent();
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

    checkShow(this.$refs.editorToolbar, function () {
      window.postMessage({
        showEditorToolbar: true
      }, '*');
    }, function () {
      window.postMessage({
        showEditorToolbar: false
      }, '*');
    })

    this.$nextTick(() => {
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

      const videoContent = `<div id="${this.videoId}"><video width="auto;" height="400;" controls="controls"><source src="${this.product.item_video_url}" type="video/mp4"></video></div>`;
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

      // #456 상/하단 이미지 체크 버튼 클릭시 삭제
      this.deleteGuideContentMergeData();

      if (this.showGuideImage) {
        this.setGuideContent();
      } else {
        this.deleteGuideContent();
      }
    },

    setGuideContent() {

        if (this.showGuideImage === true &&
            this.product.user.description_option.top_bottom_image.top_image_url === "" &&
            this.product.user.description_option.top_bottom_image.bottom_image_url === "") {
          message.warning("등록된 상/하단 이미지가 없습니다. \n" +
              "계정설정에서 별도로 등록하여 주시기 바랍니다.");
          this.showGuideImage = false;
          return;
        }

        const beforeCont = `<div id="${this.guideBeforeId}" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;"><img src="${this.product.user.description_option.top_bottom_image.top_image_url}" alt=""></div>`;
        const afterCont = `<div id="${this.guideAfterId}" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;" ><img src="${this.product.user.description_option.top_bottom_image.bottom_image_url}" alt=""></div>`;
        if (this.product.user.description_option.top_bottom_image.top_image_url !== "") {
          this.product.item_detail = beforeCont + this.product.item_detail;
        }

        if (this.product.user.description_option.top_bottom_image.bottom_image_url !== "") {
          this.product.item_detail = this.product.item_detail + afterCont;
        }

    },

    deleteGuideContent() {
      if (!!this.product.item_detail) {
        const regex = new RegExp(`<div id="${this.guideBeforeId}".*?</div>|<div id="${this.guideAfterId}".*?</div>`, "igs");
        this.product.item_detail = this.product.item_detail.replace(regex, "");
      }
    },

    deleteGuideContentMergeData() {
        const regex = /src=["']([^"']*(?:top_img|bottom_img)[^"']*)["']/g;
        this.product.item_detail = this.product.item_detail.replace(regex, "");
    },

    getGuide() {
      if (this.showGuideImage === false) {
        return;
      }
      // 기존에 있는지 업는지 판단소스를 써줘``
      const regexBefore = new RegExp(`<div id="${this.guideBeforeId}".*?</div>`, "ig");
      const regexAfter = new RegExp(`<div id="${this.guideAfterId}".*?</div>`, "ig");
      const matchBefore = regexBefore.exec(this.product.item_detail);
      const matchAfter = regexAfter.exec(this.product.item_detail);

      if (matchBefore === null) {
        const beforeCont = `<div id="${this.guideBeforeId}" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;"></div>`;
        this.product.item_detail = beforeCont + this.product.item_detail;
      }

      if (matchAfter === null) {
        const afterCont = `<div id="${this.guideAfterId}" style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;"></div>`;
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
          let doc = window.tinymce.editors[0]?.dom?.doc;
          let optionTableDoc = doc.querySelector(`div#${this.optionTableId}`);
          if (this.showOptionTable === false) {

            // 如果选项表不应该显示，移除已存在的选项表div,否则出现空div
            if (optionTableDoc) {
              // optionTableDoc.innerHTML = "";
              optionTableDoc.remove(); // 移除元素
              this.product.item_detail = window.tinymce.editors[0].getContent();
            }
            return;
          }

          let columnCount = this.product.user.description_option.option_table.column_length ?? 2;
          let optionHtml = this.getOptionTable(columnCount);

          // 只有在 showOptionTable 为 true 时才创建或更新 optionTable
          if (optionTableDoc) {
            optionTableDoc.style.display = 'flex';
            optionTableDoc.style.alignItems = 'center';
            optionTableDoc.style.justifyContent = 'center';
            optionTableDoc.innerHTML = optionHtml;
            this.product.item_detail = window.tinymce.editors[0].getContent();
          } else {
            const optionTable = `<div id="${this.optionTableId}" style="display: flex;align-items: center;justify-content: center;">${optionHtml}</div>`;
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
      optionTableDoc.style.display = 'flex';
      optionTableDoc.style.alignItems = 'center';
      optionTableDoc.style.justifyContent = 'center';
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
        this.product.item_detail = window.tinymce.editors[0].getContent();
      }
    },
    getOptionTable(columnCount) {
      let imgWrapWidth = columnCount == 1 ? '100%' : 'calc((100% - 14px) / 2)';
      let imgPaddingWidth = columnCount == 1 ? '0 15%' : '0';
      let html = `<div style="width: 100% !important; display: flex !important;gap: 10px !important;flex-wrap: wrap !important; margin: 10px 0 !important;">`
      forEach(this.product.sku, (item) => {
        html += `
        <div style="display: flex !important;flex-direction: column !important; width: ${imgWrapWidth} !important;padding: ${imgPaddingWidth} !important;">
        <img src="${item.img}" style="width: calc(100% - 2px) !important;border: 1px solid #e8e8e8 !important;border-bottom: 0 !important;">
        <div style="display: flex !important;align-items: center !important;justify-content: center !important;padding: 15px !important;font-size: 16px; !important;border: 1px solid #e8e8e8 !important;">${item.spec}</div>
        </div>`;
      });
      html += "</div>";
      return html;
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
    showPreview() {
      this.modalContent = cloneDeep(this.product.item_detail);
      this.previewVisible = true;
    },

    checkDetatil() {
      // 判断 detail里有没有 guideimage 内容来 判断 checkbox的 值
      const regexBefore = new RegExp(`<div id="${this.guideBeforeId}".*?</div>`, "igs");
      const regexAfter = new RegExp(`<div id="${this.guideAfterId}".*?</div>`, "igs");
      const matchBefore = regexBefore.exec(this.product.item_detail);
      const matchAfter = regexAfter.exec(this.product.item_detail);
      if (matchBefore === null && matchAfter === null) {
        this.showGuideImage = false;
      }else{
        this.showGuideImage = true;
      }

      //  判断 video
      const regexVideo = new RegExp(`<div id="${this.videoId}".*?</div>`, "igs");
      const matchVideo = regexVideo.exec(this.product.item_detail);
      if (matchVideo === null) {
        this.showVideo = false;
      } else {
        this.showVideo = true;
      }

      //  判断 table
      const regexTable = new RegExp(`<div id="${this.optionTableId}".*?</div>`, "igs");
      const matchTable = regexTable.exec(this.product.item_detail);
      // console.log('detail', this.product.item_detail)

      if (matchTable === null) {
        this.showOptionTable = false;
      } else {
        this.showOptionTable = true;
      }

    },

    translatePopup() {
      let aImagesUrl = this.getDetailContentsImage();
      //이미지 없을 경우
      if (aImagesUrl === false) {
        return false;
      }
      let imgList =aImagesUrl.map((item,index)=>{
        let tmp = [];
        tmp['checked'] = false;
        if(index == 0){
          tmp['checked'] = true;
        }
        tmp['order'] = index;
        tmp['request_id'] = '';
        tmp['url'] = item['url'];
        tmp['old_url'] = item['url'];
        let pos = item['url'].indexOf('request_id');
        if(pos != -1){
          tmp['request_id'] = item['url'].slice(pos+11);
        }
        return tmp;
      })

      //#456 상/하단 이미지 이미지편집 리스트에서 뺴기
      let regex = /(top_img|bottom_img)/;
      this.imgRegexData = imgList.filter(obj => regex.test(obj.url));
      imgList = imgList.filter(obj => !regex.test(obj.url));
      if (imgList.length > 0) {
        imgList[0].checked = true;
      }

      this.translateImageList = imgList;
      this.visible = true;
    },
    updateTranslateImageListOld(imageList) {
      this.$refs.editor.clear();
      let content = "<div style='display: flex; flex-direction: column;justify-content: center;align-items: center;'>";

      // #456 상/하단 리스트에서 뺸 이미지 머지
      let aMergedArray = imageList
      if (this.showGuideImage) {
        let aImgRegexData = this.imgRegexData;
        let iCount = aImgRegexData.length;

        aMergedArray = [
          ...aImgRegexData.slice(0,1),
          ...imageList,
          ...aImgRegexData.slice(iCount-1)
        ]
      }

      aMergedArray.forEach((item) => {
        content += `<img src="${item.url}" style="max-width: 100%; height: auto;"/>`;
        // if (item.translate_status === true) {
        //   content += `<img src="${item.translate_url}" style="max-width: 100%; height: auto;"/>`;
        // } else {
        //   const nUrl = item.translate_url || item.url;
        //   content += `<img src="${nUrl}" style="max-width: 100%; height: auto;"/>`;
        // }
      });
      content += "</div>";
      this.$refs.editor.contentValue = content;
      this.product.item_detail = content;

      // #440 옵션테이블 사라지는 이슈
      if (this.showOptionTable) {
        this.handleOptionTableToggle();
      }

    },
    editorImage(res) {
      let aImagesUrl = [{url: res.url, old_url: res.old_url}];
      let imgList =aImagesUrl.map((item, index)=>{
        let tmp = [];
        tmp['checked'] = false;
        if (index == 0) {
          tmp['checked'] = true;
        }
        tmp['order'] = index;
        tmp['request_id'] = '';
        tmp['url'] = item['url'];
        tmp['old_url'] = item['old_url'];
        let pos = item['url'].indexOf('request_id');
        if (pos != -1) {
          tmp['request_id'] = item['url'].slice(pos + 11).split('&')[0];
        }
        return tmp;
      })
      this.$refs.imageTranslateTools.translateImage({
        isTranslate: false,
        type: 1,
        imglist: imgList
      }, () => {
        this.imageTranslateToolsVisible = true;
      });
    },
    updateTranslateImageList(imageList) {
      this.$refs.editor.clear();
      let content = "<div style='display: flex; flex-direction: column;justify-content: center;align-items: center;'>";
      this.translateImageList = this.translateImageList.map((v)=>{
        let upData = imageList.find(v2 =>v2.old_url === v.old_url);
        if(upData){
          v.url = upData.url;
          content += `<img src="${upData.url}" style="max-width: 100%; height: auto;"/>`;
        }else{
          content += `<img src="${v.url}" style="max-width: 100%; height: auto;"/>`;
        }
        return { ...v };
      })
      content += "</div>";
      this.$refs.editor.contentValue = content;
      this.product.item_detail = content;
    },
    isPhone(){
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|android|symbianos|windows phone|ipod/i.test(userAgent);
      const isTabletDevice = /ipad|tablet/i.test(userAgent);

      // 如果检测到是移动设备或者宽度小于某个阈值
      const isSmallScreen = window.screen.width < 768; // 768px 作为判断阈值

      return isMobileDevice || (isTabletDevice && isSmallScreen);
    }
  }
};
</script>
<style>
#previewContainer img {
  display: block; /* 이미지 블록 레벨 요소로 설정 */
  margin: 0 auto; /* 이미지 상하 마진 0, 좌우 마진 자동으로 설정하여 중앙 정렬 */
  max-width: 100%; /* 이미지가 모달 너비를 초과하지 않도록 설정 */
  height: auto; /* 이미지의 원래 비율을 유지 */
}
</style>
<style scoped>
#previewContainer {
  overflow: auto;
  max-height: 800px;
  text-align: center; /* 텍스트 중앙 정렬 */
  padding: 20px 20%;
}

#previewContainer img {
  display: block; /* 이미지 블록 레벨 요소로 설정 */
  margin: 0 auto; /* 이미지 상하 마진 0, 좌우 마진 자동으로 설정하여 중앙 정렬 */
  max-width: 100%; /* 이미지가 모달 너비를 초과하지 않도록 설정 */
  height: auto; /* 이미지의 원래 비율을 유지 */
}

.guide-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
