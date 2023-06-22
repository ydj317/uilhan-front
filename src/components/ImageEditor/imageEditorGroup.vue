<template>
  <div class="imageEditorGroupContainer">
    <!-- a-modal 渲染时 数据处理 同时使用 if 和 visible 请不要删除 -->
    <template title="번역팝업">
      <!--상품 이미지-->
      <a-modal
          v-if="
          product.bImageEditorModule && product.bProductDetailsEditor === false && product.bProductImageEditor === true
        "
          :visible="
          product.bImageEditorModule && product.bProductDetailsEditor === false && product.bProductImageEditor === true
        "
          :closable="false"
          :ok-text="'닫기'"
          :cancel-text="'번역'"
          @cancel="productTranslateImage(product.aPhotoCollection)"
          @ok="product.bImageEditorModule = false"
          :maskClosable="false"
          :cancel-button-props="{ danger: true, type: 'primary' }"
          width="auto"
          centered
      >
        <!-- 번역 남은 회수 -->
        <div class="w100 right center">
          <h3 class="pr5">
            남은회수: <span class="red">{{ product.recharge }}</span>
          </h3>
        </div>
        <div class="center">
          <img :src="product.aPhotoCollection[0].original_url" alt="" />
        </div>
      </a-modal>

      <!--SKU-->
      <a-modal
        v-if="
          product.bImageEditorModule && product.bProductDetailsEditor === false && product.bProductImageEditor === false
        "
        :visible="
          product.bImageEditorModule && product.bProductDetailsEditor === false && product.bProductImageEditor === false
        "
        :closable="false"
        :ok-text="'닫기'"
        :cancel-text="'번역'"
        @cancel="
          skuTranslateImage(
            product.aPhotoCollection[0].key,
            product.aPhotoCollection[0].original_url
          )
        "
        @ok="product.bImageEditorModule = false"
        :maskClosable="false"
        :cancel-button-props="{ danger: true, type: 'primary' }"
        width="auto"
        centered
      >
        <!-- 번역 남은 회수 -->
        <div class="w100 right center">
          <h3 class="pr5">
            남은회수: <span class="red">{{ product.recharge }}</span>
          </h3>
        </div>

        <div class="center">
          <img :src="product.aPhotoCollection[0].original_url" alt="" />
        </div>
      </a-modal>

      <!--상세설명-->
      <a-modal
        v-if="
          product.bImageEditorModule && product.bProductDetailsEditor === true
        "
        :visible="
          product.bImageEditorModule && product.bProductDetailsEditor === true
        "
        :closable="false"
        :ok-text="'닫기'"
        @ok="product.bImageEditorModule = false"
        :maskClosable="false"
        :cancel-button-props="{ ghost: true }"
        width="50%"
        centered
      >
        <!-- 번역 남은 회수 -->
        <div class="w100 right center">
          <h3 class="pr5">
            남은회수: <span class="red">{{ product.recharge }}</span>
          </h3>
        </div>

        <!-- 상세설명 이미지 리스트 -->
        <table>
          <tbody>
            <tr>
              <td>
                <ul
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    padding: 0;
                  "
                >
                  <li
                    class="mb10"
                    style="border: 2px solid white; list-style: none"
                    v-for="(item, key) in product.aPhotoCollection"
                    :key="key"
                  >
                    <div style="border: 2px solid #d9d9d9; position: relative">
                      <a-tooltip placement="right" :trigger="'click'">
                        <template #title>
                          <div>
                            <img
                              style="width: 100%; height: 100%"
                              :src="
                                item.translate_status
                                  ? item.translate_url
                                  : item.original_url
                              "
                              alt=""
                            />
                          </div>
                        </template>
                        <img
                          style="width: 190px; height: 160px"
                          :src="
                            item.translate_status
                              ? item.translate_url
                              : item.original_url
                          "
                          alt=""
                        />
                      </a-tooltip>
                      <a-checkbox
                        class="detailImageCheckbox"
                        v-model:checked="item.checked"
                        style="
                          position: absolute;
                          left: 0;
                          top: -3px;
                          width: 20px;
                          height: 20px;
                        "
                      ></a-checkbox>
                    </div>
                    <div class="space-between">
                      <a-button
                        v-if="item.translate_status !== true"
                        type="primary"
                        class="w50"
                        @click="detailTranslateImage(item)"
                        >번역</a-button
                      >
                      <a-button
                        v-else
                        type="primary"
                        class="w50"
                        @click="detailRequestXiangji(item)"
                        >편집</a-button
                      >
                      <a-button
                        type="primary"
                        class="w50"
                        @click="deleteCheckedDetailImage(item.key)"
                        danger
                        >삭제</a-button
                      >
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end">
          <a-button
            class="bg-3051d3 mr5"
            type="primary"
            @click="checkAllDetailImage"
            >전체선택</a-button
          >
          <a-button
            class="bg-3051d3 mr5"
            type="primary"
            @click="uncheckAllDetailImage"
            >선택취소</a-button
          >
          <a-button
            class="bg-3051d3 mr5"
            type="primary"
            @click="deleteCheckedDetailImage()"
            >선택삭제</a-button
          >
        </div>
      </a-modal>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { lib } from "@/util/lib";

export default {
  name: "ImageEditorGroup",
  display: "ImageEditorGroup",

  computed: {
    ...mapState(["product"]),
  },

  methods: {
    // 이미지 번역
    skuTranslateImage(index, url) {
      let aImagesInfo = [
        {
          msg: "",
          key: index,
          name: "",
          order: "",
          checked: true,
          visible: true,
          original_url: url || "",
          translate_url: "",
          translate_status: false,
        },
      ];

      this.product.translateImage(aImagesInfo, (oTranslateInfo) => {
        let sTranslateUrl = oTranslateInfo[index].translate_url;
        this.product.sku.map((data, i) => {
          if (data.key === index) {
            this.product.sku[i].img = sTranslateUrl;
          }
        });
        this.skuRequestXiangji([sTranslateUrl]);
      });

      return true;
    },

    // 이미지 편집
    skuRequestXiangji(aImagesUrl) {
      this.product.requestXiangji(aImagesUrl, (oRequestId) => {
        Object.keys(oRequestId).map((sRequestId) => {
          this.product.sku.map((data, i) => {
            if (
              lib.isString(data.img, true) === true &&
              data.img.split("/").includes(sRequestId) === true
            ) {
              this.product.sku[i].img = oRequestId[sRequestId];
            }
          });
        });

        // 이미지 편집기 닫기
        this.product.bImageEditorModule = false;
        this.product.xiangjiVisible = false;
      });
    },

    //상품이미지 번역
    productTranslateImage(aImagesInfo) {
      this.product.translateImage(aImagesInfo, (oTranslateInfo) => {
        let sTranslateUrl = oTranslateInfo[aImagesInfo[0].key].translate_url;
        this.product.item_thumbnails[aImagesInfo[0].key].url = sTranslateUrl;
        this.productRequestXiangji([sTranslateUrl]);
      });
    },
    productRequestXiangji(aImagesUrl) {
      this.product.requestXiangji(aImagesUrl, (oRequestId) => {
        Object.keys(oRequestId).map((sRequestId) => {
          this.product.item_thumbnails.map((data, i) => {
            if (
                lib.isString(data.url, true) === true &&
                data.url.split("/").includes(sRequestId) === true
            ) {
              this.product.item_thumbnails[i].url = oRequestId[sRequestId];
            }
          });
        });

        // 이미지 편집기 닫기
        this.product.bImageEditorModule = false;
        this.product.xiangjiVisible = false;
      });
    },

    // 이미지 번역
    detailTranslateImage(item) {
      this.product.translateImage([item], (oTranslateInfo) => {
        let sTranslateUrl = oTranslateInfo[item.key].translate_url;

        // 팝업창 데이터 업데이트
        this.product.aPhotoCollection.map((data, i) => {
          if (item.key === data.key) {
            this.product.aPhotoCollection[i].translate_status = true;
            this.product.aPhotoCollection[i].translate_url = sTranslateUrl;
          }
        });

        // 상세내용 편집기 contents 업데이트
        this.product.aBakDetailImages.map((url, i) => {
          if (lib.isEmpty(oTranslateInfo[i]) === false) {
            let content = window.tinymce.editors[0].getContent();
            if (content !== undefined) {
              content = content.replace(url, sTranslateUrl);
              window.tinymce.editors[0].setContent(content);
            }
          }
        });

        this.product.item_detail = window.tinymce.editors[0].getContent();
        this.detailRequestXiangji(item);
      });
    },

    detailRequestXiangji(item) {
      let aImagesUrl = [item.translate_url];
      this.getDetailContentsImage();
      this.product.requestXiangji(aImagesUrl, (oRequestId) => {
        Object.keys(oRequestId).map((sRequestId) => {
          // 팝업창 데이터 업데이트
          this.product.aPhotoCollection.map((data, i) => {
            if (item.key === data.key) {
              this.product.aPhotoCollection[i].translate_url =
                oRequestId[sRequestId];
            }
          });

          // 상세내용 편집기 contents 업데이트
          this.product.aBakDetailImages.map((url) => {
            if (
              lib.isString(url, true) === true &&
              url.split("/").includes(sRequestId) === true
            ) {
              let content = window.tinymce.editors[0].getContent();
              if (content !== undefined) {
                content = content.replace(url, oRequestId[sRequestId]);
                window.tinymce.editors[0].setContent(content);
              }
            }
          });
        });

        this.product.item_detail = window.tinymce.editors[0].getContent();
        // 이미지 편집기 닫기
        // this.product.bImageEditorModule = false;
        this.product.xiangjiVisible = false;
      });
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

      for (let i = 0; i < arr.length; i++) {
        let src = arr[i].match(srcReg);
        if (src !== null) {
          srcArr.push({ url: src[1], key: i });
          this.product.aBakDetailImages[i] = src[1];
        }
      }

      return srcArr;
    },

    // 상세 이미지 삭제 (필터링 실제삭제가 아님)
    deleteCheckedDetailImage(key = false) {
      // 일괄삭제
      let aCheckedImage = this.product.aPhotoCollection.filter(
        (data) => data.checked === true
      );

      // 단일삭제
      if (key !== false) {
        aCheckedImage = this.product.aPhotoCollection.filter(
          (data) => data.key === key
        );
      }

      if (lib.isArray(aCheckedImage, true) === false) {
        alert("삭제할 이미지를 선택해 주세요.");
      }

      let aCheckedImageUrl = [];
      aCheckedImage.map((data) => {
        aCheckedImageUrl.push(data.original_url);
      });

      let sDetailContents = window.tinymce.editors[0].getContent();
      let imgReg = /<img.*?(?:>|\/>)/gi;
      let aDetailHtml = sDetailContents.match(imgReg);

      let aNewDetailImages = [];
      this.product.aPhotoCollection.map((data) => {
        if (aCheckedImageUrl.includes(data.original_url) === false) {
          aNewDetailImages.push(data);
        }
      });

      // 삭제후 key 다시 설정
      aNewDetailImages.map((data, i) => {
        aNewDetailImages[i].key = i;
      });
      this.product.aPhotoCollection = aNewDetailImages;

      aDetailHtml.map((sImageTag, i) => {
        let aDelete = aCheckedImageUrl.filter(
          (sUrl) => sImageTag.indexOf(sUrl) !== -1
        );
        if (lib.isArray(aDelete, true) === true) {
          delete aDetailHtml[i];
        }
      });
      window.tinymce.editors[0].setContent(aDetailHtml.join());

      this.getDetailContentsImage();
      this.product.item_detail = window.tinymce.editors[0].getContent();
    },

    // 전체선택
    checkAllDetailImage() {
      this.product.aPhotoCollection.map((data, i) => {
        this.product.aPhotoCollection[i].checked = true;
      });
    },

    // 선택취소
    uncheckAllDetailImage() {
      this.product.aPhotoCollection.map((data, i) => {
        this.product.aPhotoCollection[i].checked = false;
      });
    },
  },
};
</script>

<style>
.full-modal .ant-modal {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}
.full-modal .ant-modal-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
}
.full-modal .ant-modal-body {
  flex: 1;
}
</style>

<style>
/*.imageEditorGroupContainer .ant-modal-wrap {*/
/*  top: -20% !important;*/
/*  display: flex !important;*/
/*  align-items: center !important;*/
/*  justify-content: center !important;*/
/*}*/
.ant-modal-footer > button.ant-btn.ant-btn-background-ghost {
  display: none !important;
}

.list-group-item i {
  cursor: pointer;
}

.parent-element {
  text-align: center;
  position: relative;
  min-height: 600px;
  max-height: 900px;
}

.trans_success {
  background-color: #c0ebd7;
  display: block;
  text-align: center;
}

.trans_error {
  background-color: #fc9d9a;
  display: block;
  text-align: center;
  cursor: pointer;
}

.ant-tooltip-inner {
  /*padding: 0 !important;*/
  width: 416px;
}
</style>

<style scoped>
.checkedEl {
  border: 3px solid #7093db;
}
.checkedNot {
  border: 3px solid white;
}
</style>
