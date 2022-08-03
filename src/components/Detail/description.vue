<template>
  <div id="eModelTitle_7" class="mt20 p20 bg-white">
    <!--title-->
    <h1><strong>상세설명</strong></h1>

    <!--button-->
    <a-button hidden class="button bg-3051d3 originalDetailTrans" type="primary" @click="detailTrans">상세 이미지번역</a-button>

    <!-- 상세설명 편집기 -->
    <div class="center">
      <TEditor class="w90" ref="editor" v-model:value="product.item_detail" :productId="Number(product.item_id)"/>
    </div>

    <!-- 이미지 편집기 세트 -->
    <ImageEditorGroup ref="imageEditorGroup" @pushImageData="pushImageData"></ImageEditorGroup>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import TEditor from '../ImageEditor/TEdtor';
import ImageEditorGroup from '../ImageEditor/imageEditorGroup.vue';

export default {
  components: {
    ImageEditorGroup,
    TEditor,
  },

  computed: {
    ...mapState([
      'product'
    ])
  },

  data() {
    return {
      aBakDetailImages: {},
    }
  },

  methods: {
    pushImageData(key, url) {
      if (this.$refs.imageEditorGroup.bProductDetailsEditor === true) {
        let content = this.$refs.editor.contentValue;
        if (content === undefined) {
          return false;
        }

        this.$refs.editor.contentValue = content.replace(this.aBakDetailImages[key], url);
        this.product.item_detail = this.$refs.editor.contentValue;
        return false;
      }

      Object.values(this.product.sku).map((sku, i) => {
        if (sku.key === key) {
          this.product.sku[i].img = url;
        }
      });
    },

    detailTrans() {
      let content = this.$refs.editor.contentValue;
      if (content === undefined || content.length === 0) {
        alert('이미지가 없습니다');
        return false;
      }

      let imgReg = /<img.*?(?:>|\/>)/gi;
      let arr = content.match(imgReg);

      if (arr === undefined || arr.length === 0) {
        alert('번역하실 이미지가 없습니다');
        return false;
      }

      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的src
      let srcArr = [];
      for (let i = 0; i < arr.length; i++) {
        let src = arr[i].match(srcReg);
        if (src !== null) {
          srcArr.push({url: src[1], key: i});
          this.aBakDetailImages[i] = src[1];
        }
      }

      this.showModalAll(srcArr);
    },

    showModalAll(srcArr) {
      this.$refs.imageEditorGroup.aPhotoCollection = [];
      srcArr.map((oImageInfo) => {
        this.$refs.imageEditorGroup.aPhotoCollection.push({
          'msg': '',
          'key': oImageInfo.key,
          'name': '',
          'order': '',
          'checked': true,
          'visible': true,
          'original_url': oImageInfo.url,
          'translate_url': '',
          'translate_status': false,
        });
      });

      this.$refs.imageEditorGroup.mInitEditorImage(true);
    },
  }
};

class DescriptionClass {
  constructor() {
    this.DetailTrans();
  }

  DetailTrans() {
    let itimer = setInterval(() => {
      let oImageEditor = document.querySelector('[title="이미지 업로드"]');

      if (oImageEditor) {
        clearInterval(itimer);

        let sStyle = `style="width: 22px; height: 22px;"`;
        let sHtml = `
            <button aria-label="이미지 업로드" title="이미지 업로드" type="button" tabindex="-1" class="tox-tbtn copyDetailTrans" aria-disabled="false">
                <span class="tox-icon tox-tbtn__icon-wrap">
                    <svg ${sStyle} focusable="false" class="" data-icon="form" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z"></path><path d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 00-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z"></path></svg>
                </span>
            </button>`;
        oImageEditor.insertAdjacentHTML('afterend', sHtml);

        document.querySelector('.copyDetailTrans').onclick = () => {
          document.querySelector('.originalDetailTrans').click();
        };

        let tinymce = document.querySelector('.tox-edit-area__iframe').contentDocument.querySelector('#tinymce > p');
        tinymce.style.display = "flex";
        tinymce.style.flexDirection = "column";
        tinymce.style.flexWrap = "nowrap";
        tinymce.style.alignItems = "center";
      }
    }, 500);
  }
}
new DescriptionClass();
</script>

<style scoped>
.button {
  width: 150px;
  margin-bottom: 10px;
}
</style>
