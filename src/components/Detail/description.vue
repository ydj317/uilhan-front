<template>
  <div id="eModelTitle_6" class="mt20 p20 bg-white">
    <!--title-->
    <h1><strong>상세설명</strong></h1>

    <!-- 상세설명 편집기 -->
    <div class="editorDiv">
      <div class="editorToolbar">
        <!--button-->
        <a-button
            class="button originalDetailTrans"
            type="primary"
            @click="translatePopup"
        >상세 이미지번역</a-button>
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="addSkuInfo">품목정보 추가</a-menu-item>
              <a-menu-item @click="">품목정보 제거</a-menu-item>
            </a-menu>
          </template>
          <a-button class="spec-right-button">
            품목정보 액션
          </a-button>
        </a-dropdown>
      </div>
      <TEditor
        ref="editor"
        v-model:value="product.item_detail"
        :productId="Number(product['item_id'])"
        @contentUpdate="contentUpdate"
      />
    </div>
  </div>
</template>

<script>
import { forEach } from "lodash";
import { mapState } from "vuex";
import TEditor from "../ImageEditor/TEdtor";
import { watchEffect } from "vue";

export default {
  name: "productDetailDescription",

  components: {
    TEditor,
  },

  computed: {
    ...mapState(["product"]),
  },

  data() {
    return {
      aBakDetailImages: {},
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      //품목 이미지, 품목명 변경에 따라 액션
      watchEffect(() => {
        this.product.sku.map(item => item.img);
      });
    },
    getOptionTable() {
      let skuHtml = '<div><table>'
      let i = 1;
      let trStartTag = null;
      let skuLength = this.product.sku.length;
      forEach(this.product.sku, (item) => {
        if (i === 1 || i === trStartTag) {
          trStartTag = i + 4;
          skuHtml += '<tr>';
        }
        skuHtml += `<td><img style="height:100px;width:100px;" src="${item.img}"></td>`;
        skuHtml += `<td>${item.spec}</td>`;
        //td 추가
        if (i === skuLength) {
          if (skuLength > 4) {
            for (let j = 0; j < (4 - skuLength % 4); j++) {
              skuHtml += `<td><img style="height:100px;width:100px;" src=""></td>`;
              skuHtml += `<td></td>`;
            }
          }
        }

        if (i % 4 === 0) {
          skuHtml += '</tr>';
        }
        i++;
      });
      skuHtml += '</table></div>'

      return skuHtml;
    },
    addSkuInfo() {
      if (this.product.sku.length === 0) {
        return;
      }

      let skuHtml = this.getOptionTable();

      this.product.item_detail = skuHtml + this.product.item_detail;
    },
    contentUpdate(tinymce) {
      this.product.item_detail = tinymce.editors[0].getContent();
    },

    getDetailContentsImage() {
      let content = window.tinymce.editors[0].getContent();
      if (content === undefined || content.length === 0) {
        alert("이미지가 없습니다");
        return false;
      }

      let imgReg = /<img.*?(?:>|\/>)/gi;
      let arr = content.match(imgReg);

      if (arr === undefined || arr.length === 0) {
        alert("번역하실 이미지가 없습니다");
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

      this.product.bProductDetailsEditor = true;
      this.product.bImageEditorModule = true;
      this.product.aPhotoCollection = [];

      aImagesUrl.map((oImageInfo) => {
        this.product.aPhotoCollection.push({
          msg: "",
          key: oImageInfo.key,
          name: "",
          order: "",
          checked: false,
          visible: true,
          original_url: oImageInfo.url,
          translate_url: oImageInfo.url,
          translate_status:
            oImageInfo.url.indexOf("https://i.tosoiot.com/") !== -1,
        });
      });
    },
  },
};
</script>

<style scoped>
.editorDiv {
  display: flex;
  flex-direction: column;
}

.editorDiv .editorToolbar {
  margin-right: auto;
}

.button {
  width: 150px;
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
