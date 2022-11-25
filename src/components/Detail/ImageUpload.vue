<template>
  <div id="eModelTitle_1" class="mt20 p20 bg-white">
    <!--title-->
    <h1><strong>상품 이미지</strong></h1>

    <!--상단 버튼-->
    <div id="eModelTitle_1_header" class="w16 mb20 space-between">
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
            class="w10 p5 m5"
            :key="index"
            :class="`${element.checked ? 'checkedEl' : 'checkedNot'}`"
          >
            <div>
              <!--이미지-->
              <img
                class="w100"
                :src="element.url"
                @click="activedImage(element, index)"
                alt=""
              />

              <!--버튼-->
              <div
                id="eModelTitle_1_conent_button_group"
                class="w100 center space-around h40"
              >
                <!--편집-->
                <a-button
                  v-if="element.url.indexOf('https://i.tosoiot.com/') !== -1"
                  class="w40 h30 center"
                  type="dashed"
                  @click="requestXiangji([element.url])"
                  ><span>편집</span></a-button
                >

                <!--번역-->
                <a-button
                  v-else
                  class="w40 h30 center"
                  type="dashed"
                  @click="translateImage(index, element)"
                  ><span>번역</span></a-button
                >

                <!--삭제팝업-->
                <a-popconfirm
                  class="w40 h30 center"
                  title="삭제하시겠습니까?"
                  @confirm="deleteImage(element)"
                >
                  <!--삭제-->
                  <a-button type="dashed"><span>삭제</span></a-button>
                </a-popconfirm>
              </div>
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

    // 이미지 번역
    translateImage(index, element) {
      let aImagesInfo = [
        {
          msg: "",
          key: index,
          name: element.name || "",
          order: element.order || "",
          checked: true,
          visible: true,
          original_url: element.url || "",
          translate_url: "",
          translate_status: false,
        },
      ];

      this.product.translateImage(aImagesInfo, (oTranslateInfo) => {
        let sTranslateUrl = oTranslateInfo[index].translate_url;
        this.product.item_thumbnails[index].url = sTranslateUrl;
        this.requestXiangji([sTranslateUrl]);
      });
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

    // 이미지 삭제
    deleteImage(element) {
      this.product.item_thumbnails = this.product.item_thumbnails.filter(
        (item) => item.name !== element.name && item.order !== element.order
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
          alert(res.message);
          return false;
        }

        let response = res.data;
        if (lib.isEmpty(response)) {
          alert("upload failed");
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
        alert("허용되는 이미지 격식이 아닙니다.");
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
  width: 120px;
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
  border: 4px solid #3ddc97 !important;
  padding: 5px;
}

.checkedNot > div {
  border: 4px solid white !important;
  padding: 5px;
}

.thumnail {
  border: 1px solid #ff5656;
}

#eModelTitle_1_conent #eModelTitle_1_conent_group:first-child {
  border: 3px solid #f06543;
}
</style>
