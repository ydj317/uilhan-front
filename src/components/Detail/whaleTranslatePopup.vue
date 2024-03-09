<template>
  <a-modal
      v-model:open="localVisible"
      width="1200px"
      title="웨일 번역"
      style="top: 20px;"
      @ok="onSubmit"
  >
    <div
        style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;"
    >
      <div v-for="(image, key) in images.detailImage" :key="key"
           style="display: flex;gap: 5px;align-items: center; justify-content: center; ">
        <img
            alt="example"
            style="width:100px;height: 100px;border-radius: 10px;object-fit: contain; aspect-ratio: 1/1;border: 1px solid #f0f0f0;background-color: white;"
            :data-key="key"
            :src="image.url"/>
        ⋙

        <div style="position: relative;">
          <a-spin v-if="image.loading"  style="position: absolute;top: 50%;left: 50%;transform:translate(-50%,-50%)"/>
          <a-image
              v-if="image.translate_url"
              :src="image.translate_url"
              style="width:100px;height: 100px;border-radius: 10px;"
          />
          <a-upload-dragger
              v-else
              v-model:fileList="image.fileList"
              name="file"
              class="whale-upload"
              :multiple="true"
              :showUploadList="false"
              @change="handleChange($event, key)"
              @drop="handleDrop($event, key)"
              :headers="headers"
              :action="uploadAction"
              :data="{
                image_type: 'product',
                relation_type: 'product',
                product_idx: product.item_id
              }"

          >
            <div
                style="display: flex;flex-direction: column;gap: 5px;justify-content: center;align-items: center;width: 100px;height:100px;">
              <PlusOutlined/>
            </div>
          </a-upload-dragger>
        </div>


      </div>
    </div>
  </a-modal>
</template>

<script>
import {SettingOutlined, EditOutlined, EllipsisOutlined, PlusOutlined} from '@ant-design/icons-vue';
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";
import {mapState} from "vuex";
import Cookie from "js-cookie";

export default {
  name: "whaleTranslatePopup",
  emits: ["update:isOpen"],
  components: {PlusOutlined, SettingOutlined, EditOutlined, EllipsisOutlined},
  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    }),
    localVisible: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("update:isOpen", value);
      },
    },
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    // images: {
    //   type: Object,
    //   default: '',
    // },
  },
  data() {
    return {
      fileList: [],
      images: {
        detailImage: [
          {
            "name": 0,
            "url": "https://img.alicdn.com/imgextra/i2/2385643300/O1CN01UAqIqX1aFRvDTPud9_!!2385643300.jpg",
            "order": 1,
            "checked": true,
            "visible": false
          },
          {
            "name": 1,
            "url": "https://img.alicdn.com/imgextra/i2/2385643300/O1CN013pnUsJ1aFRlWwPy7z_!!2385643300.jpg",
            "order": 2,
            "checked": false,
            "visible": false
          },
          {
            "name": 2,
            "url": "https://img.alicdn.com/imgextra/i1/2385643300/O1CN01zPyypp1aFRlUxTK6t_!!2385643300.jpg",
            "order": 3,
            "checked": false,
            "visible": false
          }
        ],
        optionImage: [],
        descriptionImage: [],
      },
      headers: {
        token: Cookie.get('token')
      },
      uploadAction: process.env.VUE_APP_API_URL + "/api/image",
    };
  },
  methods: {
    handleDrop(e,key) {
    },
    handleChange(info, key) {
      if (info.file.status === 'uploading') {
        this.images.detailImage[key].loading = true;
      }
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (info.file.status === 'done') {
        this.images.detailImage[key].loading = false;
        this.images.detailImage[key].translate_url = info.file.response.data.img_url;
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.images.detailImage[key].loading = false;
        message.error(`${info.file.name} file upload failed.`);
      }
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
      });
    },
  },
};

</script>

<style>
.whale-upload .ant-upload-drag .ant-upload-btn {
  padding: 0;
}
</style>