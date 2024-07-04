<template>
  <NewXiangJi
      :isOpen="visible"
      translateType="imgTranslate"
      :key="Math.random()"
      @update:isOpen="onCancel"
      @callbackReceived="handleTranslateCallback"
      :xjParams="xjParams"
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
    xjParams: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:visible", "update:translateImageList","update:xjParams"],
  data() {
    return {
      localTranslateImageList: this.translateImageList,
    };
  },

  methods: {
    //图片处理回调
    async handleTranslateCallback(oTranslateInfo) {
      const {action,requestId,allSort,base64} = oTranslateInfo;
      switch (action){
        case 'upload':
          this.uploadImage(base64,()=>{
            this.translateImage({type: 2,action});
          });
          break;
        case 'delete':
          this.translateImage({type: 4,requestId});
          break;
        case 'translate':
          await this.translateImage({isTranslate: true,type: 3,requestId,action});
          break;
        case 'finish':
          this.localTranslateImageList = allSort.map(v=>{
            const requestId = Object.keys(v)[0];
            let item = this.localTranslateImageList.find(v2=>v2.request_id == requestId);
            if (item.translate_status === true) {
              item.translate_url = v[requestId]+'?request_id='+requestId;
            } else {
              item.translate_url = v[requestId]+'?request_id='+requestId;
              item.url = v[requestId]+'?request_id='+requestId;
            }
            return item;
          });
          this.onSubmit();
          break;
        case 'cancel':
          this.onCancel();
          break;
      }
    },
    async translateImage(option) {
      const {isTranslate = true,type,requestId,action='',imglist} = option;
      // console.log('translateImage-option',option);
      if(imglist){
        this.localTranslateImageList = imglist;
      }
      const oParam = {
        from: "zh",
        to: "ko",
        list: [],
        isTranslate,
      }
      let images = [];
      switch (type * 1){
        case 1:
          //默认不翻译只获取requestId
          images = this.localTranslateImageList.filter(item => item.request_id == '');
          break;
        case 3://翻译图片
          images = this.localTranslateImageList.filter(item =>item.request_id === requestId);
          if (images.translate_status === true) {
            message.error("이미 번역된 이미지입니다.");
            return false;
          }
          break;
        case 4://删除图片
          this.localTranslateImageList = this.localTranslateImageList.filter(item =>item.request_id != requestId);
          break;
        default:
          images = [];
          break;
      }
      let xjParams = {
        isMany:this.xjParams.isMany,
        currentIndex:this.xjParams.currentIndex,
        action:action,
      };
      if(!images.length){
        xjParams.requestIds = this.getRequestIds;
        xjParams.recharge = this.product.recharge;
        this.$emit("update:xjParams", xjParams);
      }else {
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
            xjParams.currentIndex = this.localTranslateImageList.findIndex(value => value.request_id === requestId);
          }
          const {list, recharge} = oTranslateInfo.data;
          this.localTranslateImageList = this.localTranslateImageList.map(item=>{
            let thisItem = list.find(item2=>item2.original_url == item.url);
            return thisItem ? Object.assign(item, thisItem) : item;
          });
          xjParams.requestIds = this.getRequestIds;
          xjParams.recharge = recharge;
          this.$emit("update:xjParams", xjParams);
        });
      }
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
      this.$emit("update:visible", false);
    },
    // 图片上传
    uploadImage(file,back) {
      back = back || function (){};
      let fileObj = this.base64toFileObj(file);
      const formData = new FormData();
      formData.append("file", fileObj);
      useProductApi().uploadImage(formData, (res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }
        if (lib.isEmpty(res.data.url)) {
          message.error("upload failed");
          return false;
        }
        let tmp = {
          checked: false,
          order: this.localTranslateImageList.length,
          url: res.data.url,
          request_id: res.data.requestId,
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

