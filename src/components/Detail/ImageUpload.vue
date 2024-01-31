<template>
  <div id="eModelTitle_1" class="mt20 p20 bg-white">
    <!--title-->
    <h3><strong>대표 이미지</strong>
      <a-tooltip>
        <template #title>
          <div class="mb10">상품 업로드 시 이미지는 마켓별 권장크기로 자동리사이징됩니다 (1000*1000)</div>
          <div>이미지는 스마크스토어/쿠팡은 최대 10개,11번가 최대 5개, ESM2.0/인터파크 최대4개, 위메프 최대3개까지 등록 됩니다.</div>
        </template>
        <QuestionCircleOutlined/>
      </a-tooltip>
    </h3>
    <!--이미지 리스트-->
    <div id="eModelTitle_1_conent">
      <draggable
          style="display: grid; /* 세 개의 행, 각각 높이가 1:2:1 비율로 정의 */
          grid-template-columns: repeat(6, 1fr); gap: 10px;"
          item-key="order"
          v-bind="DRAG_OPTIONS"
          v-model="product.item_thumbnails"
          :component-data="DRAG_CONFIG"
      >
        <template #item="{ element, index }">
          <div
              class="eModelTitle_1_conent_group"
              style="border:1px solid #cccccc;"
              :key="index"
              :class="`${element.checked ? 'checkedEl' : 'checkedNot'}`"
          >
            <div style="position: relative;">
              <!--이미지-->
              <img
                  class="w100"
                  :src="element.url"
                  @click="activedImage(element, index)"
                  @dblclick="translatePopup(index, element)"
                  alt=""
              />
              <div style="position: absolute;top: 1px;right: 1px;width: 20px;height: 20px;background-color: rgba(0,0,0,0.6);display: flex;justify-content: center;align-items: center;cursor: pointer">
                <CloseOutlined style="color: white;" @click="deleteImages(index)"/>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
            <div
                class="eModelTitle_1_conent_group"
                key="all"
                style="border:1px dashed #cccccc;display: flex;justify-content: center;align-items: center;"
            >
              <a-upload
                  name="file"
                  :headers="HEADER"
                  :multiple="true"
                  :showUploadList="false"
                  :beforeUpload="validateUploadImage"
                  :customRequest="uploadImage"
              >
              <div style="display: flex;flex-direction: column;gap: 5px;justify-content: center;align-items: center">
                <PlusOutlined/>
                이미지 업로드
              </div>
              </a-upload>
            </div>

        </template>
      </draggable>
      <div style="display: flex;justify-content: space-between;margin: 20px 0;">
        <div style="display: flex;gap: 5px">
          <a-button type="primary" @click="handleTranslateImage">이미지 번역</a-button>
          <a-button>이미지 편집</a-button>
        </div>
        <div>
          이미지 번역 남은 회수: <span style="color: red;font-weight: bold;">{{ this.product.recharge }}</span>
        </div>
      </div>

      <section id="preview" style="display: flex;justify-content: center;align-items: center; width: 100%;" v-show="product.item_thumbnails.find(item => item.checked === true)?.url">
        <img :src="product.item_thumbnails.find(item => item.checked === true)?.url" alt="" style="width: 500px">
      </section>
    </div>
    <XiangJi />
  </div>
</template>

<script>
import {lib} from "@/util/lib";
import Cookie from "js-cookie";
import draggable from "vuedraggable";
import {AuthRequest} from "@/util/request";
import {mapState} from "vuex";
import {message} from "ant-design-vue";
import {QuestionCircleOutlined, PlusOutlined,DeleteOutlined,CloseOutlined} from "@ant-design/icons-vue";
import XiangJi from "@/components/Detail/xiangJi.vue";

export default {
  components: {
    XiangJi,
    QuestionCircleOutlined,
    draggable,
    PlusOutlined,
    DeleteOutlined,
    CloseOutlined,
  },

  computed: {
    ...mapState(["product"]),
  },

  data() {
    return {
      HEADER: {
        token: Cookie.get("token"),
        "Content-Type": "multipart/form-data",
      },

      DRAG_CONFIG: {
        tag: "div",
        name: "flip-list",
        type: "transition",
      },

      DRAG_OPTIONS: {
        group: "description",
        disabled: false,
        animation: 300,
        ghostClass: "ghost",
      },
    };
  },

  methods: {
    // 초기화
    init() {
      let aItemThumbnails = this.product.item_thumbnails;

      if (lib.isArray(aItemThumbnails, true) === false) {
        return false;
      }

      // 拖拽会用到的参数
      for (let i = 0; i < aItemThumbnails.length; i++) {
        aItemThumbnails[i].order = i + 1;
        aItemThumbnails[i].checked = false;
        aItemThumbnails[i].visible = false;
      }

      if(aItemThumbnails.find(item => item.checked === true) === undefined){
        aItemThumbnails[0].checked = true;
      }
      this.product.item_thumbnails = aItemThumbnails;
    },
    handleTranslateImage() {
      const checkedImage = this.product.item_thumbnails.find(item => item.checked === true);
      const index = this.product.item_thumbnails.findIndex(item => item.checked === true);
      if(checkedImage === undefined){
        message.error("이미지를 선택해주세요.");
        return false;
      }

      this.translatePopup(index,checkedImage)
    },
    translatePopup(index, element) {

      this.product.aPhotoCollection = [
        {
          msg: "",
          key: index,
          name: element.name || "",
          order: element.order || "",
          checked: true,
          visible: true,
          original_url: element.url,
          translate_url: "",
          translate_status: element.translate_status,
        }
      ]
      this.productTranslateImage(this.product.aPhotoCollection, false)
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

    deleteImages(index) {
      this.product.item_thumbnails.splice(index, 1)
    },

    // 图片 选择/取消选择
    activedImage(element, index) {
      this.product.item_thumbnails.forEach((item) => {
        item.checked = false;
      });
      this.product.item_thumbnails[index].checked = !element.checked;
    },

    // 图片上传
    uploadImage(option) {
      const formData = new FormData();
      formData.append("file", option.file);
      formData.append("image_type", "product");
      formData.append("relation_type", "product");
      formData.append("product_idx", this.product.item_id);
      AuthRequest.post(
          process.env.VUE_APP_API_URL + "/api/image",
          formData
      ).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        let response = res.data;
        if (lib.isEmpty(response)) {
          message.error("upload failed");
          return false;
        }

        let aItemThumbnails = this.product.item_thumbnails;
        let iItemThumbnailsLength = 0;
        if (lib.isArray(aItemThumbnails, true) === true) {
          iItemThumbnailsLength = aItemThumbnails.length;
        }

        this.product.item_thumbnails.push({
          name: iItemThumbnailsLength,
          url: response.img_url,
          order: iItemThumbnailsLength + 1,
          checked: false,
          visible: false,
        });
      });
    },

    // 检查上传的图片
    validateUploadImage(file) {
      const isJPG = file.type === "image/jpeg";
      const isJPEG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";

      if (!(isJPG || isJPEG || isPNG || isGIF)) {
        message.warning("허용되는 이미지 격식이 아닙니다.");
        return false;
      }

      return true;
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
    this.init();
    this.getRecharge();
  },
};
</script>

<style scoped>
.eModelTitle_1_conent_group img {
  width: 100px;
  height: 150px;
}
.checkedEl > div {
  border: 2px solid #1890ff !important;
  padding: 0;
}

.checkedNot > div {
  border: 2px solid white !important;
  padding: 0;
}

.thumnail {
  border: 1px solid #ff5656;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>

