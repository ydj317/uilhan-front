<template>
  <NewXiangJi
      :isOpen="visible"
      translateType="imgTranslate"
      :requestIds="requestIds"
      :recharge="product.recharge"
      :action="action"
      :currentIndex="currentIndex"
      :isMany="isMany"
      :key="Math.random()"
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
    getRequestIds() {
      return this.localTranslateImageList.map(item => item.request_id)
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
      localRequestIds:[],
      action: '',
      currentIndex:0,
    };
  },

  methods: {
    //图片处理回调
    handleTranslateCallback(oTranslateInfo) {
      const {requestId,all,allSort,url,action,option} = oTranslateInfo;
      if(action == 'upload'){//图片上传
        this.uploadImage(option,()=>{
          this.translateImage({isTranslate: false,type: 2,action});
        });
      }
      if(action == 'translate'){//翻译
        this.translateImage({isTranslate: true,type: 3,requestId:requestId,action});
      }
      if(action == 'finish'){//完成编辑
        if(requestId === undefined){
          message.error("이미지 번역 실패");
          return false;
        }
        this.localTranslateImageList = allSort.map(v=>{
          const requestId = Object.keys(v)[0];
          let item = this.localTranslateImageList.find(v2=>v2.request_id == requestId);
          if (item.translate_status === true) {
            item.translate_url = v[requestId];
          } else {
            item.translate_url = v[requestId];
            item.url = v[requestId];
          }
          return item;
        });
        this.onSubmit();
      }
      if(action == 'cancel'){
        this.onCancel();
      }
    },
    async translateImage(option,back) {
      back = back || function (){};
      const {isTranslate = true,type,requestId,action='',localTranslateImageList} = option;
      console.log('translateImage-option',option);
      if(localTranslateImageList){
        this.localTranslateImageList = localTranslateImageList;
      }
      const oParam = {
        from: "zh",
        to: "ko",
        list: [],
        isTranslate,
      }
      //默认不翻译只获取requestId
      let images = this.localTranslateImageList.filter(item => item.translate_status !== true);
      if(type == 2){//新增图片不翻译获取requestId
        images = [this.localTranslateImageList[this.localTranslateImageList.length-1]];
      }
      if(type == 3){//翻译图片
        images = this.localTranslateImageList.filter(item =>item.request_id === requestId);
        if (images.translate_status === true) {
          message.error("이미 번역된 이미지입니다.");
          return false;
        }
      }
      images.forEach((item,i) => {
        oParam.list.push({
          msg: "",
          key: i,
          name: item.name || "",
          order: item.order || "",
          checked: item.checked,
          visible: item.visible,
          original_url: item.url,
          translate_url: item.translate_url || '',
          translate_status: item.translate_status,
          request_id: item.request_id || '',
          is_translate: isTranslate,
        })
      })
      await useProductApi().translateImage(oParam, (oTranslateInfo) => {
        if (oTranslateInfo.status !== "2000") {
          message.error(oTranslateInfo.message);
          return false;
        }
        if(type == 3){
          this.currentIndex = this.localTranslateImageList.findIndex(value => value.request_id === requestId);
        }
        const {list, recharge} = oTranslateInfo.data;
        this.localTranslateImageList = this.localTranslateImageList.map(item=>{
          let thisItem = list.find(item2=>item2.original_url == item.url);
          return thisItem ? Object.assign(item, thisItem) : item;
        });
        this.requestIds = this.getRequestIds;
        this.product.recharge = recharge;
        this.action = action;
        back();
      });
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
      this.action = '';
      this.currentIndex = 0;
      this.$emit("update:translateImageList", this.localTranslateImageList);
      this.$emit("update:visible", false);
    },
    onCancel() {
      this.action = '';
      this.currentIndex = 0;
      this.$emit("update:visible", false);
    },
    // 图片上传
    uploadImage(file,back) {
      back = back || function (){};
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
        //test
        //response.img_url = "https://img.alicdn.com/imgextra/i2/1085315961/O1CN017A8yTv1tuBrypAdbs_!!0-item_pic.jpg";
        let tmp = {
          checked: false,
          order: this.localTranslateImageList.length,
          url: response.img_url,
        };
        this.localTranslateImageList.push(tmp);
        back();
      });
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
});
</script>

