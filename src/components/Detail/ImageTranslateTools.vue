<template>
  <a-modal v-model:open="localvisible" width="1200px" style="top: 20px;" @cancel="onCancel">
    <div style="display: flex;padding: 0 20px;gap: 10px">
      <a-card style="flex: 6;height: 760px;overflow-y: scroll">
        <draggable
            style="display: grid; /* 세 개의 행, 각각 높이가 1:2:1 비율로 정의 */
            grid-template-columns: repeat(4, 1fr); gap: 5px;"
            item-key="order"
            v-bind="DRAG_OPTIONS"
            v-model="localTranslateImageList"
            :component-data="DRAG_CONFIG"
        >
          <template #item="{ element, index }">
            <div
                class="eModelTitle_1_conent_group"
                style="width: 120px;height: 120px;"
                :key="index"
            >
              <div style="position: relative;">
                <!--이미지-->
                <div
                    class="imageList"
                    style="background-color: white;width: 120px;height: 120px;overflow: hidden;position: relative;cursor: pointer;background-size: contain;background-position: center;background-repeat: no-repeat;"
                    :style="{backgroundImage: `url(${element.url})`}"
                    :key="index"
                    :class="`${element.checked ? 'checkedEl' : 'checkedNot'}`"
                    @click="activedImage(element, index)"
                >
                </div>

                <div style="position: absolute;top: 6px;right: 6px;width: 20px;height: 20px;border-radius: 2px; background-color: rgba(0,0,0,0.6);display: flex;justify-content: center;align-items: center;cursor: pointer">
                  <CloseOutlined style="color: white;" @click="deleteImages(index)"/>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </a-card>
      <a-card style="flex: 4;height: 760px;">
        <div style="display: flex;justify-content: space-between;align-items: center">
          <div style="display: flex;gap: 5px">
            <a-button type="primary" @click="handleTranslateImage">번역</a-button>
            <a-button>편집</a-button>
          </div>
          <div>
            이미지 번역 남은 회수: <span style="color: red;font-weight: bold;">{{ this.product.recharge }}</span>
          </div>
        </div>
        <section
            id="preview"
            style="display: flex;justify-content: center;align-items: center; width: 100%;height: 700px; margin-top: 10px" v-show="localTranslateImageList.find(item => item.checked === true)?.url"
        >
          <div
              style="background-color: white;width: 100%;height: 600px;overflow: hidden;position: relative;cursor: pointer;background-size: contain;background-position: center;background-repeat: no-repeat;"
              :style="{backgroundImage: `url(${localTranslateImageList.find(item => item.checked === true)?.url})`}"
          >

          </div>
        </section>
      </a-card>
    </div>
    <template #title>
      <div style="display: flex;justify-content: space-between;align-items:center;padding: 0 20px;">
        상세이미지 번역
      <a-button @click="onCancel">
        전체이미지 다운로드
      </a-button>
      </div>
    </template>
    <template #footer>
      <div style="display: flex; justify-content: center">
        <a-button @click="onCancel">취소</a-button>
        <a-button type="primary" @click="onSubmit" >저장</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import {defineComponent} from "vue";
import {lib} from "@/util/lib";
import Cookie from "js-cookie";
import draggable from "vuedraggable";
import {AuthRequest} from "@/util/request";
import {mapState} from "vuex";
import {message} from "ant-design-vue";
import {QuestionCircleOutlined, PlusOutlined,DeleteOutlined,CloseOutlined} from "@ant-design/icons-vue";
import XiangJi from "@/components/Detail/xiangJi.vue";

export default defineComponent({
  components: {
    XiangJi,
    QuestionCircleOutlined,
    draggable,
    PlusOutlined,
    DeleteOutlined,
    CloseOutlined,
  },

  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    }),
    localvisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    translateImageList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:visible", "update:translateImageList"],
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
      localTranslateImageList: this.translateImageList,
    };
  },

  methods: {

    handleTranslateImage() {
      const checkedImage = this.localTranslateImageList.find(item => item.checked === true);
      const index = this.localTranslateImageList.findIndex(item => item.checked === true);
      if(checkedImage === undefined){
        message.error("이미지를 선택해주세요.");
        return false;
      }

      this.translatePopup(index,checkedImage)
    },
    translatePopup(index, element) {
      this.product.xiangjiVisible = true;
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
        this.localTranslateImageList[aImagesInfo[0].key].translate_tmp_url = sTranslateUrl;
        this.productRequestXiangji([sTranslateUrl]);
      });
    },
    productRequestXiangji(aImagesUrl) {
      this.product.requestXiangji(aImagesUrl, (oRequestId) => {
        Object.keys(oRequestId).map((sRequestId) => {
          this.localTranslateImageList.map((data, i) => {
            if (
                lib.isString(data.translate_tmp_url, true) === true &&
                data.translate_tmp_url.split("/").includes(sRequestId) === true
            ) {
              this.localTranslateImageList[i].url = oRequestId[sRequestId];
              this.localTranslateImageList[i].translate_status = true;
            }
          });
        });

        // 이미지 편집기 닫기
        this.product.bImageEditorModule = false;
        this.product.xiangjiVisible = false;
      });
    },

    deleteImages(index) {
      this.localTranslateImageList.splice(index, 1)

      if(this.localTranslateImageList.find(item => item.checked === true) === undefined){
        this.localTranslateImageList[0].checked = true;
      }
    },

    // 图片 选择/取消选择
    activedImage(element, index) {
      this.localTranslateImageList.forEach((item) => {
        item.checked = false;
      });
      this.localTranslateImageList[index].checked = !element.checked;
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
    onSubmit() {
      this.$emit("update:translateImageList", this.localTranslateImageList);
      this.$emit("update:visible", false);
    },
    onCancel() {
      console.log('cancel');
      this.$emit("update:visible", false);
    },
  },

  mounted() {
    this.getRecharge();
  },

  watch: {
    localvisible: {
      handler(val) {
        this.localTranslateImageList = this.translateImageList;
      },
    },
  },
});
</script>

<style scoped>

.checkedEl {
  border:2px solid dodgerblue;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 0;
}

.checkedNot {
  border:2px solid #cccccc;
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

