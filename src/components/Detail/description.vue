<template>
  <div id="eModelTitle_4" class="mt20 p20 bg-white">
    <!--title-->
    <div style="display: flex; justify-content: space-between;">
      <h1><strong>상세페이지</strong></h1>
      <div class="editorToolbar">
        <a-space>
          <span>옵션 테이블</span>
          <a-input-group compact>
            <a-select v-model:value="selectOptionValue" style="width: 120px">
              <a-select-option v-for="selectOption in optionTableSelectOption" :key="selectOption.value"
                               :value="selectOption.value">
                {{ selectOption.label }}
              </a-select-option>
            </a-select>
            <a-button type="primary" @click="setOptionTableContent">적용</a-button>
          </a-input-group>
        </a-space>

        <a-divider type="vertical" style="border-color: #999" />

        <a-space>
          <span>안내정보</span>
          <div v-if="guideData.length > 0">
            <a-input-group compact>
              <a-select v-model:value="guideValue" style="width: 200px">
                <a-select-option v-for="data in guideData" :value="data.id">
                  {{ data.name }}
                </a-select-option>
                <a-select-option value="guide_cancel">제거</a-select-option>
              </a-select>
              <a-button type="primary" @click="setGuideContent">적용</a-button>
            </a-input-group>
          </div>
          <router-link v-else to="/setting/guideForm">
            <a-button type="primary">
              상하단이미지 설정
              <a-tooltip>
                <template #title>
                  <div class="mb10">상하단 이미지 설정 클릭 시 설정 페이지로 이동합니다.</div>
                  <div>이동 전 수정하신 내용을 먼저 저장해주세요.</div>
                </template>
                <QuestionCircleOutlined/>
              </a-tooltip>
            </a-button>
          </router-link>
        </a-space>

        <a-divider type="vertical" style="border-color: #999" />

        <a-button class="originalDetailTrans" type="primary" @click="translatePopup">상세 이미지번역</a-button>
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
</template>

<script>
import { forEach } from "lodash";
import { mapState } from "vuex";
import TEditor from "../ImageEditor/TEdtor";
import { watchEffect } from "vue";
import { message } from "ant-design-vue";
import { AuthRequest } from "@/util/request";
import {QuestionCircleOutlined} from "@ant-design/icons-vue";
import {EventBus} from "@/router/eventBus";

export default {
  name: "productDetailDescription",

  components: {
    QuestionCircleOutlined,
    TEditor
  },

  computed: {
    ...mapState(["product"])
  },

  data() {
    return {
      optionTableId: "editor_option_table",
      aBakDetailImages: {},
      selectOptionValue: "table_two_column",
      optionTableSelectOption: [
        {
          label: "두줄로 추가",
          value: "table_two_column"
        },
        {
          label: "네줄로 추가",
          value: "table_four_column"
        },
        {
          label: "제거",
          value: "table_cancel"
        }
      ],
      guideBeforeId: "editor_before_guide",
      guideAfterId: "editor_after_guide",
      guideValue: "",
      guideData: []
    };
  },
  mounted() {
    this.fetchData();
    this.getGuide();
  },
  methods: {
    setGuideContent() {
      const value = this.guideValue;

      const regex = new RegExp(`<div id="(${this.guideBeforeId}|${this.guideAfterId})"[^>]+>[\\s\\S]*?<\\/div>`, "ig");
      this.product.item_detail = this.product.item_detail.replace(regex, "");

      if (value === "guide_cancel") {
        return true;
      }

      const selectData = this.guideData.find(item => item.id === value);
      const beforeCont = `<div id="${this.guideBeforeId}" data-tid="${value}">${selectData.beforeCont}</div>`;
      const afterCont = `<div id="${this.guideAfterId}" data-tid="${value}">${selectData.afterCont}</div>`;

      this.product.item_detail = beforeCont + this.product.item_detail + afterCont;

      EventBus.emit('submit-request');
    },
    getGuide() {
      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/guide/list").then((res) => {
            if (res.status !== "2000") {
              message.error(res.message);
            }

            this.guideData = res.data;
            if (this.guideData.length < 1) {
              return true;
            }

            this.guideValue = this.guideData.find(item => item.isDefault === "1").id;

            // 기존에 없을때 자동적용
            const regex = new RegExp(`<div id="(${this.guideBeforeId}|${this.guideAfterId})"[^>]+>[\\s\\S]*?<\\/div>`, "ig");
            const match = regex.exec(this.product.item_detail);
            if (match === null) {
              const selectData = this.guideData.find(item => item.id === this.guideValue);
              const beforeCont = `<div id="${this.guideBeforeId}" data-tid="${this.guideValue}">${selectData.beforeCont}</div>`;
              const afterCont = `<div id="${this.guideAfterId}" data-tid="${this.guideValue}">${selectData.afterCont}</div>`;
              this.product.item_detail = beforeCont + this.product.item_detail + afterCont;
            }

          }
      );
    },
    setOptionTableContent() {
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

        const regex = new RegExp(`<div id="${this.guideBeforeId}"[^>]+>[\\s\\S]*?<\\/div>`, "ig");
        const match = regex.exec(this.product.item_detail);
        if (match !== null) {
          this.product.item_detail = this.product.item_detail.replace(regex, "");
          this.product.item_detail = match[0] + this.product.item_detail;
        }

      }
    },
    fetchData() {
      // 절정된 옵션테이블 유형 선택함
      // const regex = /id="(editor_option_table_\d+)"/g;
      // const match = regex.exec(this.product.item_detail);
      // if (match === null) {
      //   return true;
      // }
      // if (match[1] === `${this.optionTableId}_2`) {
      //   this.selectOptionValue = "table_two_column";
      // }
      // if (match[1] === `${this.optionTableId}_4`) {
      //   this.selectOptionValue = "table_four_column";
      // }

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
        this.selectOptionValue = "table_two_column";
      }
      //테이블 4줄로 추가
      if (optionTableDoc.querySelector(`table#${this.optionTableId}_4`)) {
        optionHtml = this.getOptionTable(4);
        this.selectOptionValue = "table_four_column";
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
              oImageInfo.url.indexOf("https://i.tosoiot.com/") !== -1
        });
      });
    }
  }
};
</script>

<style scoped>
</style>
