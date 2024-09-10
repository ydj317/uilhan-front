<template>
  <NewXiangJi
      :isOpen="visible"
      translateType="imgTranslate"
      :key="Math.random()"
      @update:isOpen="onCancel"
      @callbackReceived="handleTranslateCallback"
      :xjParams="xjParams"
      ref="NewXiangJi"
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
  watch: {
    "product.recharge"(val) {
      this.xjParams.recharge = val;
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
    isMany: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:visible", "update:translateImageList"],
  data() {
    return {
      localTranslateImageList: this.translateImageList,
      xjParams:{
        isMany:this.isMany,
        currentIndex:0,
        action:'',
        requestIds:[],
        recharge:0
      },
    };
  },

  methods: {
    //图片处理回调
    async handleTranslateCallback(oTranslateInfo) {
      const {action,requestId,requestIds,allSort,base64} = oTranslateInfo;
      switch (action){
        case 'upload':
          this.uploadImage(base64,()=>{
            this.translateImage({type: 2,action});
          });
          break;
        case 'delete':
          this.translateImage({type: 4,requestIds,action});
          break;
        case 'translate':
          await this.translateImage({type: 3,isTranslate: true,requestId,action});
          break;
        case 'finish':
          this.localTranslateImageList = allSort.map(v => {
            const requestId = Object.keys(v)[0];
            let item = this.localTranslateImageList.find(v2 => v2.request_id === requestId);
            let is_resize = '';
            if (item.old_url.includes('&is_resize=1')) {
              is_resize = '&is_resize=1';
            }
            item.translate_url = v[requestId] + is_resize;
            item.url = v[requestId] + is_resize;
            return {...item};
          });
          this.onSubmit();
          break;
        case 'cancel':
          this.onCancel();
          break;
      }
    },
    async translateImage(option,back) {
      back = back || function(){}
      const {type,isTranslate = false,requestId,requestIds,action='',imglist} = option;
      // console.log('translateImage-option',option);
      if(imglist){
        this.localTranslateImageList = imglist;
      }

      let from = 'zh';
      if (['Rakuten', 'Superdelivery'].includes(this.product.item_market)) {
        from = 'jp';
      }

      const oParam = {
        from: from,
        to: "ko",
        list: [],
        isTranslate,
        relation_id: this.product.item_id,
      }
      let images = [];
      switch (type * 1){
        case 1:
          //获取没有request_id的图片
          images = this.localTranslateImageList.filter(item => item.request_id == '');
          break;
        case 3://翻译图片
          images = this.localTranslateImageList.filter(item =>item.request_id === requestId);
          break;
        case 4://删除图片
          let localTranslateImageList = requestIds.map(request_id=>{
            return this.localTranslateImageList.find(item=>item.request_id==request_id);
          })
          this.localTranslateImageList = localTranslateImageList;
          break;
        default:
          images = [];
          break;
      }
      if(!this.product.recharge){
        this.getRecharge();
      }
      this.xjParams.recharge = this.product.recharge;
      this.xjParams.requestIds = this.getRequestIds;
      this.xjParams.action = action;
      if(images.length){
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
            this.xjParams.currentIndex = this.localTranslateImageList.findIndex(value => value.request_id === requestId);
          }
          const {list, recharge} = oTranslateInfo.data;
          this.localTranslateImageList = this.localTranslateImageList.map(item=>{
            let thisItem = list.find(item2=>item2.original_url == item.url);
            return thisItem ? Object.assign(item, thisItem) : item;
          });
          this.xjParams.requestIds = this.getRequestIds;
          this.xjParams.recharge = recharge;
          this.product.recharge = recharge;
          back();
        });
      }else{
        back();
      }
      if(this.visible){
        this.$refs.NewXiangJi.sendMessage();
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
      formData.append("image_type", 'product');
      formData.append("relation_id", this.product.item_id);
      formData.append("is_xiangji", '1');
      useProductApi().uploadImage(formData, (res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }
        if (lib.isEmpty(res.data.img_url)) {
          message.error("upload failed");
          return false;
        }
        let tmp = {
          checked: false,
          order: this.localTranslateImageList.length,
          url: res.data.img_url,
          request_id: res.data.url_id,
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
});
</script>

