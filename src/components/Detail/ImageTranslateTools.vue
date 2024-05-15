<template>
  <NewXiangJi
      :isOpen="visible"
      translateType="imgTranslate"
      :requestIds="requestIds"
      :recharge="product.recharge"
      :type="type"
      :key="requestIds[0]"
      @update:isOpen="onCancel"
      @callbackReceived="handleTranslateCallback"
      ref="newXiangJi"
  />
</template>

<script>
import {defineComponent} from "vue";
import {lib} from "@/util/lib";
import {AuthRequest} from "@/util/request";
import {mapState} from "vuex";
import {message} from "ant-design-vue";
import NewXiangJi from "@/components/Detail/newXiangJi.vue";
import {useProductApi} from "@/api/product";
import ImageUpload from "@/components/Detail/ImageUpload.vue";
import Cookie from "js-cookie";

export default defineComponent({
  components: {
    NewXiangJi,
    ImageUpload,
  },

  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    }),
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
    isMany: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:visible", "update:translateImageList"],
  data() {
    return {
      localTranslateImageList: this.translateImageList,
      requestIds: [],
      type: '',
    };
  },

  methods: {
    //图片处理回调
    async handleTranslateCallback(oTranslateInfo) {
      const {requestId,all,url,type,option} = oTranslateInfo;
      this.type = type;
      if(type == 'upload'){//图片上传
        await this.uploadImage(option);
      }
      if(type == 'translate'){//翻译

      }
      if(type == 'finish'){//完成编辑
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
        // this.onSubmit();
      }
    },

    // 批量翻译
    async translateImageBatch() {
      // if(!Cookie.get("localTranslateImageList")){
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
        console.log('翻译前',aImagesInfo)
        await useProductApi().translateImageBatch(oParam, (oTranslateInfo) => {
          console.log('翻译结果',oTranslateInfo.data)
          const { list,recharge } = oTranslateInfo.data;
          this.localTranslateImageList = list
          this.product.recharge = recharge;
          this.requestIds = this.localTranslateImageList.map(item => item.request_id);
        });
      // }
      // else{
      //   this.requestIds = Cookie.get("requestIds").split(',');
      // }
      console.log('this.requestIds2::',this.requestIds)
    },

    // 查看剩余的首次翻译数量
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
    // 图片上传
    async uploadImage(file) {
      let fileObj = this.base64toFileObj(file);
      const formData = new FormData();
      formData.append("file", fileObj);
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
        let tmp = {
          checked: false,
          order: iItemThumbnailsLength + 1,
          url: response.img_url,
        };
        if(this.isMany != 0){
          tmp.checked = true;
          tmp.order = 0;
        }
        this.localTranslateImageList.push(tmp);

      });
      // await this.translateImageBatch();
      // this.requestIds = ['91e295fb75284cc5'];
      this.requestIds.push('91e295fb75284cc5');
      this.product.recharge -= 1;
      this.$refs.newXiangJi.sendMessage();
    },
    //base64-文件对象
    base64toFileObj(base64, filename='tmp.png') {
      var arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    }
  },

  mounted() {
    this.getRecharge();
  },

  watch: {
    visible:{
      handler(val) {
        console.log('watch-visible',val)
        if(val){
          this.localTranslateImageList = this.translateImageList;
          this.translateImageBatch();
        }
      },
      immediate: true,
    }
  },
});
</script>

