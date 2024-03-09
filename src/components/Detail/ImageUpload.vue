<template>
  <div id="eModelTitle_1" class="mt20 p20">
    <!--title-->
    <div style="display: flex;justify-content: space-between;align-items: center">
      <h3><strong>대표 이미지</strong>
        <a-tooltip>
          <template #title>
            <div class="mb10">상품 업로드 시 이미지는 마켓별 권장크기로 자동리사이징됩니다 (1000*1000)</div>
            <div>이미지는 스마크스토어/쿠팡은 최대 10개,11번가 최대 5개, ESM2.0/인터파크 최대4개, 위메프 최대3개까지 등록 됩니다.</div>
          </template>
          <QuestionCircleOutlined/>
        </a-tooltip>
      </h3>
      <div style="display: flex;gap: 5px;">
        <a-button @click="translateImageWhalePopup" v-if="checkUserAgant">웨일 번역</a-button>
        <a-button @click="translateImageBatch" :loading="translateImageBatchLoading">전체 이미지 번역</a-button>
      </div>
    </div>

    <div style="display: flex;gap: 10px;margin-top: 10px">
      <a-card style="flex: 6;height: 600px;overflow-y: scroll;">
        <draggable
            style="display: grid;
            grid-template-columns: repeat(2, 1fr); gap: 10px;"
            item-key="order"
            v-bind="DRAG_OPTIONS"
            v-model="product.item_thumbnails"
            :component-data="DRAG_CONFIG"
        >
          <template #item="{ element, index }">
            <div
                class="eModelTitle_1_conent_group"
                style="width: 250px;height: 250px;"
                :key="index"
            >
              <div v-if="element.is_loading" style="width: 250px;height:250px;display: flex;justify-content: center;align-items: center;" class="checkedEl">
                <a-spin size="large"/>
              </div>
              <div v-else style="position: relative;">
                <!--이미지-->
                <div
                    class="imageList"
                    style="background-color: white;width: 250px;height: 250px;overflow: hidden;position: relative;cursor: pointer;background-size: contain;background-position: center;background-repeat: no-repeat;"
                    :style="{backgroundImage: `url(${element.url})`}"
                    :key="index"
                    :class="`${element.checked ? 'checkedEl' : 'checkedNot'}`"
                    @click="activedImage(element, index)"
                >
                  <div
                      style="position: absolute;top: 5px;left: 5px;width: 15px;height: 15px;border-radius: 50%;color: white;font-size: 10px; background-color: rgba(0,0,0,0.6);display: flex;justify-content: center;align-items: center;"
                      :style="{backgroundColor: index === 0 ? '#ff5656' : '#cccccc'}"
                  >
                    {{ index + 1 }}
                  </div>
                  <div
                      style="position: absolute;bottom: 8px;right: 5px;width: 15px;height: 15px;"
                      v-if="element.translate_status"
                  >
                    <CheckCircleOutlined style="color: #059669"/>
                  </div>
                </div>

                <div
                    style="position: absolute;top: 6px;right: 6px;width: 20px;height: 20px;border-radius: 2px; background-color: rgba(0,0,0,0.6);display: flex;justify-content: center;align-items: center;cursor: pointer">
                  <CloseOutlined style="color: white;" @click="deleteImages(index)"/>
                </div>
              </div>
            </div>
          </template>
          <template #footer>
            <div
                class="eModelTitle_1_conent_group"
                key="all"
                style="border:2px dashed #cccccc;display: flex;justify-content: center;align-items: center;height: 250px;width: 250px;border-radius: 10px;"
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
      </a-card>
      <a-card style="flex: 4;height: 600px;">
        <template #title>
          <div style="display: flex;justify-content: space-between;align-items: center;padding: 5px 0;">
            <div style="display: flex;flex-direction: column; justify-content: space-evenly">
              <h4>
                Preview
                <a-tooltip>
                  <template #title>
                    <div>이미지 번역은 한국어로 번역된 이미지를 생성합니다.</div>
                    <div>이미지 번역은 번역회수가 소모됩니다.</div>
                  </template>
                  <QuestionCircleOutlined/>
                </a-tooltip>
              </h4>
              <span style="font-size: 12px;color: #b0b0b0;font-weight: 400">이미지 번역 회수: <span style="font-size: 14px;color: #b91c1c;font-weight: bold;">{{this.product.recharge}}</span></span>
            </div>
            <div style="display: flex;gap: 5px">
              <a-button size="small" type="primary" @click="translateImage" :loading="translateImageLoading">번역</a-button>
              <a-button size="small" @click="editorImage">편집</a-button>
              <a-button size="small" @click="imageMatting" :loading="imageMattingLoading">AI 누끼 따기</a-button>
            </div>
          </div>
        </template>

        <section
            id="preview"
            style="display: flex;justify-content: center;align-items: center; width: 100%;height: 490px; "
        >
          <div
              v-if="translateImageLoading"
          >
            <a-spin size="large"/>
          </div>
          <div
              v-else
              style="width: 100%;height: 500px;overflow: hidden;position: relative;cursor: pointer;background-size: contain;background-position: center;background-repeat: no-repeat;"
              :style="selectedCollectionBackgroundImage"
          >

          </div>
        </section>
      </a-card>
    </div>

    <NewXiangJi
        :isOpen="isOpen"
        @update:isOpen="isOpen = false"
        :requestIds="requestIds"
        translateType="imgTranslate"
        :key="requestIds[0]"
        @callbackReceived="handleTranslateCallback"
    />
    <whale-translate-popup
        :isOpen="whalePopupIsOpen"
        @update:isOpen="whalePopupIsOpen = false"
    />
  </div>
</template>

<script>
import {lib} from "@/util/lib";
import Cookie from "js-cookie";
import draggable from "vuedraggable";
import {AuthRequest} from "@/util/request";
import {mapState} from "vuex";
import {message} from "ant-design-vue";
import {QuestionCircleOutlined, PlusOutlined, DeleteOutlined, CloseOutlined,CheckCircleOutlined} from "@ant-design/icons-vue";
import NewXiangJi from "@/components/Detail/newXiangJi.vue";
import {useProductApi} from "@/api/product";
import WhaleTranslatePopup from "@/components/Detail/whaleTranslatePopup.vue";

export default {
  components: {
    WhaleTranslatePopup,
    NewXiangJi,
    QuestionCircleOutlined,
    draggable,
    PlusOutlined,
    DeleteOutlined,
    CloseOutlined,
    CheckCircleOutlined
  },

  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    }),
    selectedCollectionBackgroundImage() {
      const checkedImage = this.product.item_thumbnails.find(item => item.checked === true);
      if (checkedImage === undefined) {
        return false;
      }

      // checked translate_status
      if (checkedImage.translate_status === true) {
        return {
          backgroundImage: `url(${checkedImage.translate_url})`
        };
      } else {
        const nUrl = checkedImage.translate_url || checkedImage.url;
        return {
          backgroundImage: `url(${nUrl})`
        };
      }
    },
    selectedCollection() {
      return this.product.item_thumbnails.find(item => item.checked === true);
    },
    checkUserAgant() {
      const userAgent = navigator.userAgent;
      return userAgent.indexOf("Whale") > -1;
    },
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
      isOpen: false,

      translateImageLoading: false,
      translateImageBatchLoading: false,
      imageMattingLoading: false,
      requestIds: [],

      whalePopupIsOpen: false,
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

      if (aItemThumbnails.find(item => item.checked === true) === undefined) {
        aItemThumbnails[0].checked = true;
      }
      this.product.item_thumbnails = aItemThumbnails;
    },

    handleTranslateCallback(oTranslateInfo) {
      const {requestId,all,url} = oTranslateInfo;

      if(requestId === undefined){
        message.error("이미지 번역 실패");
        return false;
      }

      const checkedImage = this.product.item_thumbnails.find(item => item.request_id === requestId);
      if(checkedImage.translate_status === true){
        checkedImage.translate_url = url;
      } else {
        checkedImage.url = url;
      }
    },

    // 단건 이미지 번역
    async translateImage(option) {
      const { isTranslate = true } = option;
      const checkedImage = this.product.item_thumbnails.find(item => item.checked === true);
      const index = this.product.item_thumbnails.findIndex(item => item.checked === true);
      if (checkedImage === undefined) {
        message.error("이미지를 선택해주세요.");
        return false;
      }

      if(checkedImage.translate_status === true){
        message.error("이미 번역된 이미지입니다.");
        return false;
      }

      const oParam = {
        from: "zh",
        to: "ko",
        list: [
          {
            msg: "",
            key: index,
            name: checkedImage.name || "",
            order: checkedImage.order || "",
            checked: checkedImage.checked,
            visible: checkedImage.visible,
            original_url: checkedImage.url,
            translate_url: checkedImage.translate_url || '',
            translate_status: checkedImage.translate_status,
            request_id: checkedImage.request_id || '',
            is_translate: isTranslate
          }
        ],
        isTranslate,
      }
      this.translateImageLoading = true;
      await useProductApi().translateImage(oParam, (oTranslateInfo) => {
        const { list,recharge } = oTranslateInfo.data;
        this.product.item_thumbnails[index] = {...this.product.item_thumbnails[index],...list.find(item => item.key === index)}
        this.product.recharge = recharge;
      }).finally(() => {
        this.translateImageLoading = false;
      });

    },

    // 전체 이미지 번역
    async translateImageBatch() {

      // 이미지 번역이 안된 이미지만 번역
      const aImagesInfo = this.product.item_thumbnails.filter(item => item.translate_status !== true);
      if(aImagesInfo.length === 0){
        message.info("번역할 이미지가 없습니다.");
        return false;
      }


      const oParam = {
        from: "zh",
        to: "ko",
        list: [],
        isTranslate: true
      }

      aImagesInfo.forEach((item,index) => {
        oParam.list.push({
          msg: "",
          key: index,
          name: item.name || "",
          order: item.order || "",
          checked: item.checked,
          visible: item.visible,
          original_url: item.url,
          translate_url: item.translate_url || '',
          translate_status: item.translate_status,
          request_id: item.request_id || '',
          is_translate: true,
        })
      })

      this.translateImageBatchLoading = true;
      await useProductApi().translateImageBatch(oParam, (oTranslateInfo) => {
        const { list,recharge } = oTranslateInfo.data;
        this.product.item_thumbnails = list
        this.product.recharge = recharge;
      }).finally(() => {
        this.translateImageBatchLoading = false;
      });

    },

    // 편집
    async editorImage() {
      const { request_id } = this.selectedCollection

      // 이미지 번역이 안된 이미지는 번역부터 진행
      if(request_id === undefined || request_id === ''){
        const option = {
          isTranslate: false // 편집만함
        }
        await this.translateImage(option)
      }

      this.requestIds = [this.selectedCollection.request_id];
      this.isOpen = true;
    },

    // 이미지 누끼 따기
    async imageMatting() {
      const selectedCollection = this.selectedCollection

      if(selectedCollection === undefined){
        message.error("이미지를 선택해주세요.");
        return false;
      }

      const option = {
        msg: "",
        key: selectedCollection.key || 0,
        name: selectedCollection.name || "",
        order: selectedCollection.order || "",
        checked: selectedCollection.checked,
        visible: selectedCollection.visible,
        original_url: selectedCollection.url,
        translate_url: selectedCollection.translate_url || '',
        translate_status: selectedCollection.translate_status,
        request_id: selectedCollection.request_id || '',
        is_translate: selectedCollection.is_translate || false
      }
      this.imageMattingLoading = true;
      useProductApi().imageMatting(option, (oTranslateInfo) => {
        const { translate_url } = oTranslateInfo.data;
        selectedCollection.translate_url = translate_url;
      }).finally(() => {
        this.imageMattingLoading = false;
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
    },

    translateImageWhalePopup() {
      this.whalePopupIsOpen = true;
    },
  },

  mounted() {
    this.init();
    this.getRecharge();
  },
};
</script>

<style scoped>
.checkedEl {
  border: 2px solid dodgerblue;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 0;
}

.checkedNot {
  border: 2px solid #cccccc;
  border-radius: 10px;
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

