<template>
  <div id="eModelTitle_6" class="mt20 p20 bg-white">
    <!--title-->
    <h1><strong>상세설명</strong></h1>

    <!-- 상세설명 편집기 -->
    <div class="editorDiv">
      <div class="editorToolbar">
        <!--button-->
        <a-space>
          <span>옵션 테이블</span>
          <a-select v-model:value="selectOptionValue" style="width: 120px">
            <a-select-option v-for="selectOption in optionTableSelectOption" :key="selectOption.value" :value="selectOption.value" >{{selectOption.label}}</a-select-option>
          </a-select>
        </a-space>
        <a-button style="margin-left: 5px; margin-right: 10px;" type="primary" @click="setEditorContent">
          적용
        </a-button>
        <a-button
            class="button originalDetailTrans"
            type="primary"
            @click="translatePopup"
        >상세 이미지번역</a-button>
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
import { message } from "ant-design-vue";

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
      optionTableId: "editor_option_table",
      aBakDetailImages: {},
      selectOptionValue: "table_two_column",
      optionTableSelectOption: [
        {
          label: "두줄로 추가",
          value: "table_two_column",
        },
        {
          label: "네줄로 추가",
          value: "table_four_column",
        },
        {
          label: "제거",
          value: "table_cancel",
        }
      ]
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    setEditorContent() {
      let doc = window.tinymce.editors[0].dom.doc;
      let optionTableDoc = doc.querySelector(`div#${this.optionTableId}`);
      if (this.selectOptionValue === "table_cancel") {
        if (optionTableDoc) {
          optionTableDoc.innerHTML = "";
          this.product.item_detail = doc.documentElement.innerHTML;
        }
        return;
      }
      let columnCount = this.selectOptionValue === "table_two_column" ? 2 : 4;
      let optionHtml = this.getOptionTable(columnCount);
      if (optionTableDoc) {
        optionTableDoc.innerHTML = optionHtml;
        this.product.item_detail = doc.documentElement.innerHTML;
      } else {
        this.product.item_detail = `<div id="${this.optionTableId}">${optionHtml}</div>${this.product.item_detail}`;
      }
    },
    fetchData() {
      //품목 이미지, 품목명 변경에 따라 액션
      watchEffect(() => {
        this.product.sku.map(item => item.img);
        //변경될 경우 테이블 업데이트
        this.setOptionTable();
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
          optionHtml += '<tr>';
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
          optionHtml += '</tr>';
        }
        i++;
      });
      optionHtml += '</table>'

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
