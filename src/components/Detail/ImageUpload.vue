<template>
  <div id="eModelTitle_1" class="container">
    <!--title-->
    <h1><strong>이미지</strong></h1>

    <!--상단 버튼-->
    <div class="top">
      <a-button @click="showModal('batch')">일괄 번역</a-button>
      <a-upload
          name="file"
          :headers="headers"
          :multiple="true"
          :showUploadList="false"
          :beforeUpload="handleBeforeUpload"
          :customRequest="customRequest"
      >
        <a-button>이미지 업로드</a-button>
      </a-upload>
    </div>

    <!--이미지 리스트-->
    <div>
      <draggable
          class="image_container"
          tag="transition-group"
          item-key="order"
          v-bind="dragOptions"
          v-model="fileList"
          :component-data="dragConfig"
      >
        <template #item="{element, index}">
          <div :key="index" :class="`image_item ${element.checked ? 'checkedEl' : 'checkedNot'}`">
            <!--이미지-->
            <img :src="element.url" @click="outElChecking(element, index)" alt=""/>

            <!--버튼-->
            <div class="image_item_footer">
              <a-button type="dashed" @click="showModal('single', element)"><span>번역</span></a-button>
              <a-popconfirm title="삭제하시겠습니까?" @confirm="delElement(element)">
                <a-button type="dashed"><span>삭제</span></a-button>
              </a-popconfirm>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!--이미지 편집기 세트-->
    <ImageEditorGroup ref="imageEditorGroup" @pushImageData="pushImageData"></ImageEditorGroup>
  </div>
</template>

<script>
import {lib} from 'util/lib';
import Cookie from 'js-cookie';
import draggable from 'vuedraggable';
import {AuthRequest} from 'util/request';
import ImageEditorGroup from 'components/ImageEditor/imageEditorGroup';
import {mapState} from 'vuex';

export default {
  components: {
    draggable,
    ImageEditorGroup,
  },

  computed: {
    ...mapState([
      'product'
    ])
  },

  data() {
    return {
      fileList: [],
      modalList: [],

      headers: {
        'token': Cookie.get('token'),
        'Content-Type': 'multipart/form-data',
      },
      dragConfig: {
        tag: 'div',
        name: 'flip-list',
        type: 'transition',
      },
      dragOptions: {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      },
    };
  },

  methods: {
    showModal(type, obj = []) {
      if (type === 'single') {
        this.modalList = [obj];
      } else {
        this.modalList = this.fileList.filter(item => item.checked === true);
        if (this.modalList.length === 0) {
          this.modalList = this.fileList;
        }
      }

      this.$refs.imageEditorGroup.aPhotoCollection = [];
      Object.values(this.modalList).map((oImageInfo, i) => {
        this.$refs.imageEditorGroup.aPhotoCollection.push({
          'msg': '',
          'key': i,
          'name': oImageInfo.name,
          'order': oImageInfo.order,
          'checked': true,
          'visible': true,
          'original_url': oImageInfo.url,
          'translate_url': '',
          'translate_status': false,
        });
      });

      this.$refs.imageEditorGroup.mInitEditorImage(false);
    },

    pushImageData(key, url) {
      Object.values(this.fileList).map((oImageInfo, i) => {
        if (oImageInfo.order === key) {
          this.fileList[i].url = url;
        }
      });
    },

    delElement(element) {
      this.fileList = this.fileList.filter(
          item => item.name !== element.name && item.order !== element.order);
    },

    outElChecking(element, index) {
      this.fileList[index].checked = !element.checked;
    },

    customRequest(option) {
      const formData = new FormData();
      formData.append('file', option.file);
      formData.append('image_type', 'product');
      formData.append('relation_type', 'product');
      formData.append('product_idx', this.product.item_id);
      AuthRequest.post(process.env.VUE_APP_API_URL + '/api/image', formData).then((res) => {
        let response = res.data;
        if (lib.isEmpty(response)) {
          alert('upload failed');
          return false;
        }

        if (response.status !== 'success') {
          alert('upload failed');
          return false;
        }

        this.fileList.push({
          name: this.fileList.length,
          url: response.img_url,
          order: this.fileList.length + 1,
          checked: false,
          visible: false,
        });
      });
    },

    handleBeforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isJPEG = file.type === 'image/jpeg';
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';

      if (!(isJPG || isJPEG || isPNG || isGIF)) {
        alert('허용되는 이미지 격식이 아닙니다.');
        return false;
      }

      return true;
    },
  },

  mounted() {
    this.fileList = this.product.item_thumbnails;
    for (let i = 0; i < this.product.item_thumbnails.length; i++) {
      this.fileList[i].order = i + 1;
      this.fileList[i].checked = false;
      this.fileList[i].visible = false;
    }
  }
};
</script>

<style scoped>
/*DEBUG*/
/*div {*/
/*  outline: 1px solid red;*/
/*}*/

.top {
  display: flex;
  justify-content: space-around;

  width: 20%;
}

.top button {
  height: 39px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #3051d3;
  color: #3051d3;
}

.top button:first-child {
  width: 44%;
}

.image_container {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}

.image_item {
  display: flex;
  flex-direction: column;

  width: 10%;
  padding: 5px;
  outline: 1px solid #f0f2f5;
}

.image_item img {
  width: 100%;
  height: 150px;
}

.image_item_footer {
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  height: 30px;
  padding-top: 10px;
}

.image_item_footer button {
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0;
  padding: 0;
  width: 44px;
  height: 30px;
  border-radius: 5px;
  border: 1px solid white;
}

.image_item_footer button {
  background-color: #00a7e1;
  color: white;
}

.image_item_footer button:first-child {
  background-color: #3051d3;
}

.checkedEl {
  border: 4px solid #3ddc97
}

.checkedNot {
  border: 4px solid white;
}
</style>
