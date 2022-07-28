<template>
  <div id="eModelTitle_7" class="mt20 p20 bg-white">
    <!--title-->
    <h1><strong>상세설명</strong></h1>

    <!--button-->
    <a-button class="button" type="primary" @click="detailTrans">상세 이미지번역</a-button>

    <!-- 상세설명 편집기 -->
    <TEditor ref="editor" v-model:value="product.item_detail" :productId="Number(product.item_code)"/>

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

        this.product.item_detail = content.replace(this.aBakDetailImages[key], url);
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
</script>

<style scoped>
.button {
  width: 150px;
  margin-bottom: 10px;
}
</style>