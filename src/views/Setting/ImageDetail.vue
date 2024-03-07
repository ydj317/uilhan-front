<template>
  <a-card :loading="formState.loading" :bordered="false" title="상세이미지 설정">
    <a-descriptions bordered :column="1" :labelStyle="{ width: '100px' }"
                    :contentStyle="{ width: '500px' }">
      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>상/하단 이미지 설정</span>
          </a-space>
        </template>

        <a-switch v-model:checked="formState.settingDatas.description_option.top_bottom_image.use"
                  checked-children="on" un-checked-children="off" />

        <div class="upload-container" :class="{ 'is-disabled': !formState.settingDatas.description_option.top_bottom_image.use }">
            <span class="image-fix">
              <span class="title">상단 고정 이미지</span>
              <a-upload
                  name="avatar"
                  :headers="HEADER"
                  :multiple="true"
                  :max-count="1"
                  list-type="picture-card"
                  :beforeUpload="validateUploadImage"
                  :customRequest="(options) => uploadImage(options, 'top')"
                  v-model:file-list="fileListTop"
              >
                  <div>
                    <loading-outlined v-if="loadingTop" />
                    <plus-outlined v-else />
                    <div class="ant-upload-text">Upload</div>
                  </div>
              </a-upload>
            </span>
            <span class="image-fix">
              <span class="title">하단 고정 이미지</span>
              <a-upload
                  name="avatar"
                  :headers="HEADER"
                  :multiple="true"
                  :max-count="1"
                  list-type="picture-card"
                  :beforeUpload="validateUploadImage"
                  :customRequest="(options) => uploadImage(options, 'bottom')"
                  v-model:file-list="fileListBottom"
              >

                <div>
                  <loading-outlined v-if="loadingBottom" />
                  <plus-outlined v-else />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </span>
        </div>
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>동영상 노출 설정</span>
          </a-space>
        </template>
        <a-switch v-model:checked="formState.settingDatas.description_option.show_video"
                  checked-children="on" un-checked-children="off" />
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>옵션 테이블 설정</span>
          </a-space>
        </template>

        <a-switch v-model:checked="formState.settingDatas.description_option.option_table.use"
                   checked-children="on" un-checked-children="off" />
        <div class="select upload-container" :class="{ 'is-disabled': !formState.settingDatas.description_option.option_table.use }">
          <!-- 第一个下拉菜单 -->
          <a-select v-model:value="formState.settingDatas.description_option.option_table.show_position"
                    style="width: 120px">
            <a-select-option v-for="selectOption in showPosition" :key="selectOption.value"
                             :value="selectOption.value">
              {{ selectOption.label }}
            </a-select-option>
          </a-select>
          <!-- 第二个下拉菜单 -->
          <a-select v-model:value="formState.settingDatas.description_option.option_table.column_length"
                    style="width: 120px">
            <a-select-option v-for="selectOption in columnLength" :key="selectOption.value"
                             :value="selectOption.value">
              {{ selectOption.label }}
            </a-select-option>
          </a-select>
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <div style="display: flex;justify-content: center;margin-top: 20px;">
      <a-button type="primary" html-type="submit" @click="saveUserInfo">저장</a-button>
    </div>
  </a-card>
</template>

<script setup>
import {AuthRequest} from "@/util/request";

import {onMounted, reactive, ref } from "vue";
import Cookie from "js-cookie";
import {message} from "ant-design-vue";
import {useUserApi} from "@/api/user";
import {PlusOutlined, LoadingOutlined} from "@ant-design/icons-vue";
import router from "@/router";

const showPosition = reactive([
  { label: '상단에', value: 'top' },
  { label: '하단에', value: 'bottom' },
]);

const columnLength = reactive([
  { label: '두줄로 추가', value: 2 },
  { label: '네줄로 추가', value: 4 },
]);


//switch
const formState = reactive({
  settingDatas: {
    description_option:{
      top_bottom_image : {
        use : false,
        top_image_url: "",
        bottom_image_url: "",
      },

      show_video: false,

      option_table: {
        use: true,
        show_position : "top",
        column_length :2
      },
    },
  },
  loading: false,
});

// const topImageUrl = "https:\\/\\/worldlink.mev\\/uploads\\/25778155-65e915fd0fa48.jpg";
// const fileListTop = ref([
//   {
//     uid: '-1', // 通常使用文件的唯一标识符，这里只是示例
//     name: 'Top Image.jpg',
//     status: 'done', // 表示文件已经上传
//     url: topImageUrl, // 从后端获取的图片URL
//   }
// ]);

const fileListTop = ref([]);
const fileListBottom = ref([]);
const loadingTop = ref(false);
const loadingBottom = ref(false);
// const imageUrl = ref('');
// const loading = ref(false);

const HEADER =ref({
    token: Cookie.get("token"),
    "Content-Type": "multipart/form-data",
})

function uploadImage(option,position) {
  const formData = new FormData();
  formData.append("file", option.file);
  formData.append("image_type", "product");
  formData.append("relation_type", "product");

  if (position === 'top') loadingTop.value = true;
  else loadingBottom.value = true;

  AuthRequest.post(
      process.env.VUE_APP_API_URL + "/api/image",
      formData
  ).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    let response = res.data;
    if (!response || Object.keys(response).length === 0) {
      message.error("upload failed");
      return false;
    }

    message.success(res.message);

    // 上传成功处理逻辑
    let imgUrl = res.data.img_url;
    let newFileList = [{
      uid: '-1', // 唯一标识，可以是上传文件的ID
      name: 'image.png', // 文件名
      status: 'done', // 状态有：uploading, done, error, removed
      url: imgUrl, // 文件访问路径
    }];

    // 根据位置更新状态和文件列表
    if (position === 'top') {
      formState.settingDatas.description_option.top_bottom_image.top_image_url = imgUrl;
      fileListTop.value = newFileList; // 更新文件列表
      loadingTop.value = false; // 停止加载状态
    } else if (position === 'bottom') {
      formState.settingDatas.description_option.top_bottom_image.bottom_image_url = imgUrl;
      fileListBottom.value = newFileList;
      loadingBottom.value = false;
    }

    // // 保存到数据库
    // handleSaveUserData();

  }).catch((error) => {
    message.error(`Upload failed: ${error.message}`);
    if (position === 'top') loadingTop.value = false;
    else loadingBottom.value = false;
  });
}

function validateUploadImage(file) {
  const isJPG = file.type === "image/jpeg";
  const isJPEG = file.type === "image/jpeg";
  const isGIF = file.type === "image/gif";
  const isPNG = file.type === "image/png";

  if (!(isJPG || isJPEG || isPNG || isGIF)) {
    message.warning("허용되는 이미지 격식이 아닙니다.");
    return false;
  }

  return true;
}

// const handleSaveUserData = () => {
//   useUserApi().saveUserData(formState.settingDatas).then((res) => {
//     console.log('Data saved successfully');
//   }).catch((error) => {
//       console.error('Failed to save data:', error);
//   });
// }

function saveUserInfo(){
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail").then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }

    message.success(res.message);

    useUserApi().saveUserData(formState.settingDatas).then((res) => {
      console.log('Data saved successfully');
    }).catch((error) => {
      console.error('Failed to save data:', error);
    });
  });
}


function getUserInfoData() {
  formState.loading = true;
  useUserApi().getUserInfoData({}).then((res) => {

    if (res.status !== "2000") {
      message.error(res.message);
      formState.loading = false;
      return false;
    }

    const { user_data } = res.data;
    if(!user_data || user_data.length < 1){
      formState.loading = false;
      return false;
    }

    // 直接赋值可能不会触发更新，特别是对于深层次的对象
    if (user_data.description_option && user_data.description_option.top_bottom_image) {
      formState.settingDatas.description_option.top_bottom_image = { ...user_data.description_option.top_bottom_image };
    }

    if (user_data.description_option && user_data.description_option.show_video) {
      formState.settingDatas.description_option.show_video = { ...user_data.description_option.show_video };
    }

    if (user_data.description_option && user_data.description_option.option_table) {
      formState.settingDatas.description_option.option_table = { ...user_data.description_option.option_table };
    }

    formState.settingDatas = user_data;
    setTimeout(() => {
      formState.loading = false;
    }, 500);

  });
}
onMounted(() => {
  getUserInfoData();
});

</script>

<style scoped>
  .select{
    display:block;
    margin-top:10px;
  }

  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .upload{
    display:block;
  }
  .image-fix{
    display:inline-block;
    margin-top:10px;
  }
  .ant-upload-select-picture-card{
    margin-top:10px !important;
  }

  .upload-container.is-disabled {
    pointer-events: none;
    opacity: 0.5;
  }

</style>