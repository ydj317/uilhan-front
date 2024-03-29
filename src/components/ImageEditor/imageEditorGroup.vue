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
          @cancel="product.bImageEditorModule = false"
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
          <img :src="product.aPhotoCollection[0].original_url" alt="" width="500" />
        </div>

        <template v-slot:footer>
          <a-button type="primary" @click="productTranslateImage(product.aPhotoCollection, true)" v-if="!product.aPhotoCollection[0].translate_status">번역</a-button>
          <a-button type="primary" @click="productTranslateImage(product.aPhotoCollection, false)">편집</a-button>
          <a-button @click="product.bImageEditorModule = false">닫기</a-button>
        </template>
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
          @cancel="product.bImageEditorModule = false"
          width="auto"
          wrap-class-name="full-modal"
          centered
      >
        <!-- 번역 남은 회수 선택-->
        <div class="w100 right center">
          <h3 class="pr5">
            남은회수: <span class="red">{{ product.recharge }}</span>
          </h3>
        </div>

        <div class="center">
          <img :src="product.aPhotoCollection[0].original_url" alt="" style="width: 500px;" />
        </div>

        <template v-slot:footer>
          <a-button type="primary"
                    @click="skuTranslateImage(
                      product.aPhotoCollection[0].key,
                      product.aPhotoCollection[0].original_url,
                      true
                    )"
                    v-if="!product.aPhotoCollection[0].translate_status"
          >
            번역
          </a-button>
          <a-button type="primary" @click="skuTranslateImage(
            product.aPhotoCollection[0].key,
            product.aPhotoCollection[0].original_url,
            false
          )">편집
          </a-button>
          <a-button @click="product.bImageEditorModule = false">닫기</a-button>
        </template>
      </a-modal>

      <!--상세페이지-->
      <a-modal
          v-if="
          product.bImageEditorModule && product.bProductDetailsEditor === true
        "
          :visible="
          product.bImageEditorModule && product.bProductDetailsEditor === true
        "
          :closable="false"
          @cancel="product.bImageEditorModule = false"
          width="50%"
          centered
      >
        <!-- 번역 남은 회수 상세이미지번역-->
        <div class="w100 right center">
          <h3 class="pr5">
            남은회수: <span class="red">{{ product.recharge }}</span>
          </h3>
        </div>

        <!-- 상세페이지 이미지 리스트 -->
        <a-row :gutter="15" style="max-height: 620px; overflow: scroll;overflow-x: hidden;">
          <a-col
              v-for="(item, key) in product.aPhotoCollection"
              :key="key"
              class="mb15"
              style="display: flex;justify-content: center;"
              :xs="24" :sm="24" :md="24" :lg="12" :xl="8"
          >
            <a-card hoverable style="width: 250px">
              <template #cover>
                <a-image
                    style="width: 250px; height: 250px"
                    :src="item.translate_status ? item.translate_url : item.original_url"
                    alt=""
                />
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
              </template>
              <template #actions>
                <a-button @click="detailTranslateImage(item, true)"
                          v-if="!item.translate_status"
                >번역
                </a-button>

                <a-button v-if="item.translate_status !== true"
                          @click="detailTranslateImage(item, false)">편집
                </a-button>
                <a-button v-else @click="detailRequestXiangji(item)">편집
                </a-button>

                <a-button danger @click="deleteCheckedDetailImage(item.key)">삭제
                </a-button>
              </template>
            </a-card>
          </a-col>
        </a-row>

        <template v-slot:footer>
          <a-button style="float: left" type="primary" @click="downloadAllDetailImage">전체이미지 다운로드</a-button>
          <a-button type="primary" @click="checkAllDetailImage">전체선택</a-button>
          <a-button @click="uncheckAllDetailImage">선택취소</a-button>
          <a-button @click="deleteCheckedDetailImage(false)" danger>선택삭제</a-button>
          <a-button @click="product.bImageEditorModule = false">닫기</a-button>
        </template>
      </a-modal>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { lib } from "@/util/lib";
import { AuthRequest } from "@/util/request";
import { message } from "ant-design-vue";
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';

export default {
  name: "ImageEditorGroup",
  display: "ImageEditorGroup",

  computed: {
    ...mapState(["product"])
  },

  methods: {
    // 이미지 번역
    skuTranslateImage(index, url, isTranslate) {
      this.product.isTranslate = isTranslate
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
          translate_status: false
        }
      ];

      this.product.translateImage(aImagesInfo, (oTranslateInfo) => {
        let sTranslateUrl = oTranslateInfo[index].translate_url;
        this.product.sku.map((data, i) => {
          if (data.key === index) {
            this.product.sku[i].translate_tmp_img = sTranslateUrl;
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
                lib.isString(data.translate_tmp_img, true) === true &&
                data.translate_tmp_img.split("/").includes(sRequestId) === true
            ) {
              this.product.sku[i].img = oRequestId[sRequestId];
              this.product.sku[i].translate_status = true;
            }
          });
        });

        // 이미지 편집기 닫기
        this.product.bImageEditorModule = false;
        this.product.xiangjiVisible = false;
      });
    },

    //상품이미지 번역
    productTranslateImage(aImagesInfo, isTranslate) {
      this.product.isTranslate = isTranslate
      this.product.translateImage(aImagesInfo, (oTranslateInfo) => {
        let sTranslateUrl = oTranslateInfo[aImagesInfo[0].key].translate_url;
        this.product.item_thumbnails[aImagesInfo[0].key].translate_tmp_url = sTranslateUrl;
        this.productRequestXiangji([sTranslateUrl]);
      });
    },
    productRequestXiangji(aImagesUrl) {
      this.product.requestXiangji(aImagesUrl, (oRequestId) => {
        Object.keys(oRequestId).map((sRequestId) => {
          this.product.item_thumbnails.map((data, i) => {
            if (
                lib.isString(data.translate_tmp_url, true) === true &&
                data.translate_tmp_url.split("/").includes(sRequestId) === true
            ) {
              this.product.item_thumbnails[i].url = oRequestId[sRequestId];
              this.product.item_thumbnails[i].translate_status = true;
            }
          });
        });

        // 이미지 편집기 닫기
        this.product.bImageEditorModule = false;
        this.product.xiangjiVisible = false;
      });
    },

    // 이미지 번역
    detailTranslateImage(item, isTranslate) {
      this.product.isTranslate = isTranslate
      this.product.aBakDetailImagesTmp = []

      this.product.translateImage([item], (oTranslateInfo) => {
        let sTranslateUrl = oTranslateInfo[item.key].translate_url;

        // 팝업창 데이터 업데이트
        this.product.aPhotoCollection.map((data, i) => {
          if (item.key === data.key) {
            this.product.aPhotoCollection[i].translate_tmp_url = sTranslateUrl;
          }
        });

        // 상세내용 편집기 contents 업데이트
        this.product.aBakDetailImages.map((url, i) => {
          if (lib.isEmpty(oTranslateInfo[i]) === false) {
            this.product.aBakDetailImagesTmp[i] = sTranslateUrl
          }
        });

        this.detailRequestXiangji(item);
      });
    },

    detailRequestXiangji(item) {
      let aImagesUrl = [item.translate_tmp_url||item.translate_url];
      this.getDetailContentsImage();
      this.product.requestXiangji(aImagesUrl, (oRequestId) => {
        Object.keys(oRequestId).map((sRequestId) => {
          // 팝업창 데이터 업데이트
          this.product.aPhotoCollection.map((data, i) => {
            if (item.key === data.key) {
              this.product.aPhotoCollection[i].translate_status = true;
              this.product.aPhotoCollection[i].translate_url =
                  oRequestId[sRequestId];
            }
          });

          // 상세내용 편집기 contents 업데이트
          this.product.aBakDetailImagesTmp.map((url,index) => {
            if (
                lib.isString(url, true) === true &&
                url.split("/").includes(sRequestId) === true
            ) {
              let content = window.tinymce.editors[0].getContent();
              if (content !== undefined) {
                content = content.replace(this.product.aBakDetailImages[index], oRequestId[sRequestId]);
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
        message.warning("이미지가 없습니다");
        return false;
      }

      let imgReg = /<img.*?(?:>|\/>)/gi;
      let arr = content.match(imgReg);

      if (arr === undefined || arr.length === 0) {
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
    deleteCheckedDetailImage(keys = false) {
      // 일괄삭제
      let aCheckedImage = this.product.aPhotoCollection.filter(
          (data) => {
            return data.checked === true;
          }
      );

      // 단일삭제
      if (keys !== false) {
        aCheckedImage = this.product.aPhotoCollection.filter(
            (data) => data.key === keys
        );
      }

      if (lib.isArray(aCheckedImage, true) === false) {
        message.warning("삭제할 이미지를 선택해 주세요.");
      }

      let aCheckedImageUrl = [];
      aCheckedImage.map((data) => {
        aCheckedImageUrl.push(data.original_url);
      });
      let content = window.tinymce.editors[0].getContent();

      // 옵션테이블 백업 및 삭제
      let regex = /<div id="editor_option_table">[\s\S]*?<\/div>/g;
      const optionTableMatch = regex.exec(content);
      let optionTable = "";
      if (optionTableMatch !== null) {
        content = content.replace(regex, "");
        optionTable = optionTableMatch[0];
      }

      // 안내정보 앞내용 백업 및 삭제
      regex = new RegExp(`<div id="editor_before_guide"[^>]+>[\\s\\S]*?<\\/div>`, "ig");
      const beforeGuideMatch = regex.exec(content);
      let beforeGuide = "";
      if (beforeGuideMatch !== null) {
        content = content.replace(regex, "");
        beforeGuide = beforeGuideMatch[0];
      }

      // 안내정보 뒤내용 백업 및 삭제
      regex = new RegExp(`<div id="editor_after_guide"[^>]+>[\\s\\S]*?<\\/div>`, "ig");
      const afterGuideMatch = regex.exec(content);
      let afterGuide = "";
      if (afterGuideMatch !== null) {
        content = content.replace(regex, "");
        afterGuide = afterGuideMatch[0];
      }

      let imgReg = /<img.*?(?:>|\/>)/gi;
      let aDetailHtml = content.match(imgReg);

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

      let newHtml = aDetailHtml.join("");
      newHtml = beforeGuide + optionTable + newHtml + afterGuide;
      window.tinymce.editors[0].setContent(newHtml);

      this.getDetailContentsImage();
      this.product.item_detail = window.tinymce.editors[0].getContent();
    },

    // 전체이미지 다운로드
    downloadAllDetailImage() {

      this.product.loading = true;

      let detailImageList = [];
      this.product.aPhotoCollection.map((data, i) => {
        detailImageList.push(data.translate_url);
      });

      AuthRequest.post(
          process.env.VUE_APP_API_URL + "/api/downloadImageZip",
          {
            "imageList": detailImageList
          }
      ).then((res) => {

        this.product.loading = false;

        let response = res;

        if (response === undefined) {
          message.error("다운로드에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
          return false;
        }

        let downloadElement = document.createElement("a");
        let url = window.URL || window.webkitURL || window.moxURL;
        let href = response.data["download_url"];

        downloadElement.href = href;
        downloadElement.download = decodeURI("detail_images.zip"); // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        url.revokeObjectURL(href);
      });
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

    // 최초 번역 남은 회수 조회
    getRecharge() {
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/getrecharge").then(
          (res) => {
            if (res.status !== "2000" || res.data === undefined) {
              message.error(res.message);
              return false;
            }

            try {
              this.product.recharge = res.data.recharge;
            } catch (e) {
              message.error("남은회수 호출 실패");
            }
          }
      );
    }
  },

  mounted() {
    // 최초 번역 남은 회수 조회
    this.getRecharge();
  }
};
</script>

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

</style>

<style scoped>
.checkedEl {
  border: 3px solid #7093db;
}

.checkedNot {
  border: 3px solid white;
}
</style>
