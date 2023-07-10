<template>
  <div id="eModelTitle_1" class="mt20 p20 bg-white">
    <!--title-->
    <h1><strong>상품 이미지</strong></h1>

    <!--상단 버튼-->
    <div id="eModelTitle_1_header" class="mb20 space-between">
      <a-upload
          name="file"
          :headers="HEADER"
          :multiple="true"
          :showUploadList="false"
          :beforeUpload="validateUploadImage"
          :customRequest="uploadImage"
      >
        <a-button>이미지 업로드</a-button>
      </a-upload>

      <a-button style="margin-right: auto; margin-left: 10px;" @click="deleteImages">이미지 삭제</a-button>
    </div>

    <!--이미지 리스트-->
    <div id="eModelTitle_1_conent">
      <draggable
          class="row left wrap"
          item-key="order"
          v-bind="DRAG_OPTIONS"
          v-model="product.item_thumbnails"
          :component-data="DRAG_CONFIG"
      >
        <template #item="{ element, index }">
          <div
              id="eModelTitle_1_conent_group"
              class="w10 m5"
              :key="index"
              :class="`${element.checked ? 'checkedEl' : 'checkedNot'}`"
          >
            <div>
              <!--이미지-->
              <img
                  class="w100"
                  :src="element.url"
                  @click="activedImage(element, index)"
                  @dblclick="translatePopup(index, element)"
                  alt=""
              />
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import { lib } from "@/util/lib";
import Cookie from "js-cookie";
import draggable from "vuedraggable";
import { AuthRequest } from "@/util/request";
import { mapState } from "vuex";
import { message } from "ant-design-vue";

export default {
  components: {
    draggable,
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
        animation: 0,
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

      this.product.item_thumbnails = aItemThumbnails;
    },
    translatePopup(index, element) {
      // 변역완료된 상품은 편집
      if (element.url.indexOf("https://i.tosoiot.com/") !== -1) {
        this.requestXiangji([element.url]);

        return false;
      }

      this.product.bProductDetailsEditor = false;
      this.product.bProductImageEditor = true;
      this.product.bImageEditorModule = true;
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
          translate_status: false,
        }
      ]
    },

    // 이미지 편집
    requestXiangji(aImagesUrl) {
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
        this.product.xiangjiVisible = false;
      });
    },

    //이미지 일괄 삭제
    deleteImages() {
      this.product.item_thumbnails = this.product.item_thumbnails.filter(
          (item) => item.checked === false
      );
    },

    // 图片 选择/取消选择
    activedImage(element, index) {
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
  },

  mounted() {
    this.init();
  },
};
</script>

<style scoped>
#eModelTitle_1 img {
  width: 100px;
  height: 150px;
}
</style>

<style scoped>
/*.top {*/
/*  display: flex;*/
/*  justify-content: space-around;*/

/*  width: 20%;*/
/*}*/

#eModelTitle_1_header button {
  height: 39px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #3051d3;
  color: #3051d3;
}
#eModelTitle_1_conent_group {
  height: auto;
  width: auto;
  min-width: 150px;
  border: 1px solid #f0f2f5;
}

/*.top button:first-child {*/
/*  width: 44%;*/
/*}*/

/*.image_container {*/
/*  display: flex;*/
/*  justify-content: flex-start;*/
/*  flex-direction: row;*/
/*  flex-wrap: wrap;*/
/*}*/

/*.image_item {*/
/*  display: flex;*/
/*  flex-direction: column;*/

/*  width: 10%;*/
/*  padding: 5px;*/
/*  outline: 1px solid #f0f2f5;*/
/*}*/

/*.image_item img {*/
/*  width: 100%;*/
/*  height: 150px;*/
/*}*/

/*.image_item_footer {*/
/*  display: flex;*/
/*  justify-content: space-evenly;*/
/*  align-items: center;*/

/*  height: 30px;*/
/*  padding-top: 10px;*/
/*}*/

#eModelTitle_1_conent button {
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: center;*/

  /*margin: 0;*/
  /*padding: 0;*/
  /*width: 44px;*/
  /*height: 30px;*/
  border-radius: 5px;
  border: 1px solid white;
  background-color: #00a7e1;
  color: white;
  text-align: center;
}
#eModelTitle_1_conent_button_group button:first-child {
  background-color: #3051d3;
}

/*.image_item_footer button {*/
/*  background-color: #00a7e1;*/
/*  color: white;*/
/*}*/

/*.image_item_footer button:first-child {*/
/*  background-color: #3051d3;*/
/*}*/

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
</style>

