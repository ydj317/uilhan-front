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
                  <div
                      style="position: absolute;bottom: 8px;right: 5px;width: 15px;height: 15px;"
                      v-if="element.translate_status"
                  >
                    <CheckCircleOutlined style="color: #059669"/>
                  </div>
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
            <a-button type="primary" @click="translateImage" :loading="translateImageLoading">번역</a-button>
            <a-button @click="editorImage">편집</a-button>
          </div>
          <div>
            이미지 번역 남은 회수: <span style="color: red;font-weight: bold;">{{ this.product.recharge }}</span>
          </div>
        </div>
        <section
            id="preview"
            style="display: flex;justify-content: center;align-items: center; width: 100%;height: 700px; margin-top: 10px"
        >
          <div
              v-if="translateImageLoading"
          >
            <a-spin size="large"/>
          </div>
          <div
              v-else
              style="background-color: white;width: 100%;height: 600px;overflow: hidden;position: relative;cursor: pointer;background-size: contain;background-position: center;background-repeat: no-repeat;"
              :style="selectedCollectionBackgroundImage"
          >

          </div>
        </section>
      </a-card>
    </div>
    <template #title>
      <div style="display: flex;justify-content: space-between;align-items:center;padding: 0 20px;">
        상세이미지 번역
<!--        <div style="display: flex;gap: 5px;">-->
<!--          <a-button @click="onCancel">-->
<!--            전체 이미지 다운로드-->
<!--          </a-button>-->
<!--          <a-popconfirm title="리스트의 전체 이미지가 번역됩니다. 계속 진행 하시겠습니까?" ok-text="확인" cancel-text="취소" @confirm="translateImageBatch">-->
<!--            <a-button :loading="translateImageBatchLoading">전체 이미지 번역</a-button>-->
<!--          </a-popconfirm>-->
<!--        </div>-->
      </div>
    </template>
    <template #footer>
      <div style="display: flex; justify-content: center">
        <a-button @click="onCancel">취소</a-button>
        <a-button type="primary" @click="onSubmit" >저장</a-button>
      </div>
    </template>
  </a-modal>
  <NewXiangJi
      :isOpen="isOpen"
      @update:isOpen="isOpen = false"
      :requestIds="requestIds"
      translateType="imgTranslate"
      :key="requestIds[0]"
      @callbackReceived="handleTranslateCallback"
  />
</template>

<script>
import {defineComponent} from "vue";
import {lib} from "@/util/lib";
import Cookie from "js-cookie";
import draggable from "vuedraggable";
import {AuthRequest} from "@/util/request";
import {mapState} from "vuex";
import {message} from "ant-design-vue";
import {
  QuestionCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  CloseOutlined,
  CheckCircleOutlined
} from "@ant-design/icons-vue";
import NewXiangJi from "@/components/Detail/newXiangJi.vue";
import {useProductApi} from "@/api/product";

export default defineComponent({
  components: {
    CheckCircleOutlined,
    NewXiangJi,
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
    selectedCollectionBackgroundImage() {
      const checkedImage = this.localTranslateImageList.find(item => item.checked === true);
      if (checkedImage === undefined) {
        return false;
      }

      // checked translate_status
      if (checkedImage.translate_status === true) {
        return {
          backgroundImage: `url(${checkedImage.translate_url})`
        };
      } else {
        return {
          backgroundImage: `url(${checkedImage.url})`
        };
      }
    },
    selectedCollection() {
      return this.localTranslateImageList.find(item => item.checked === true);
    }
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

      isOpen: false,

      translateImageLoading: false,
      translateImageBatchLoading: false,
      requestIds: [],
    };
  },

  methods: {

    handleTranslateCallback(oTranslateInfo) {
      const {requestId,all,url} = oTranslateInfo;

      if(requestId === undefined){
        message.error("이미지 번역 실패");
        return false;
      }

      const checkedImage = this.localTranslateImageList.find(item => item.request_id === requestId);
      if(checkedImage.translate_status === true){
        checkedImage.translate_url = url;
      } else {
        checkedImage.translate_url = url;
        checkedImage.url = url;
      }
    },

    // 단건 이미지 번역
    async translateImage(option) {
      const { isTranslate = true } = option;
      const checkedImage = this.localTranslateImageList.find(item => item.checked === true);
      const index = this.localTranslateImageList.findIndex(item => item.checked === true);
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
        if (oTranslateInfo.status !== "2000") {
          message.error(oTranslateInfo.message);
          return false;
        }

        const { list,recharge } = oTranslateInfo.data;
        this.localTranslateImageList[index] = {...this.localTranslateImageList[index],...list.find(item => item.key === index)}
        this.product.recharge = recharge;
      }).finally(() => {
        this.translateImageLoading = false;
      });

    },

    // 전체 이미지 번역
    async translateImageBatch() {

      // 이미지 번역이 안된 이미지만 번역
      const aImagesInfo = this.localTranslateImageList.filter(item => item.translate_status !== true);
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
        this.localTranslateImageList = list
        this.product.recharge = recharge;
      }).finally(() => {
        this.translateImageBatchLoading = false;
      });

    },

    // 편집
    async editorImage() {
      const { request_id } = this.selectedCollection
      if(request_id === undefined || request_id === ''){
        // 자동번역된 이미지 url 에   request_id 가 있음
        let url = new URL(this.selectedCollection.url);
        let requestId = url.searchParams.get('request_id');
        if (requestId) {
          // 자동번역된 이미지이면 request_id 를 넣고 is_translate 를 true 로 설정
          this.localTranslateImageList.find(item => item.checked === true).request_id = requestId;
          this.localTranslateImageList.find(item => item.checked === true).is_translate = true;
        } else {
          // 이미지 번역이 안된 이미지는 번역부터 진행
          const option = {
            isTranslate: false // 편집만함
          }
          await this.translateImage(option)
        }
      }

      this.requestIds = [this.selectedCollection.request_id ?? ''];
      this.isOpen = true;
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

