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
                <template v-if="fileListTop.length < 1">
                  <div>
                    <loading-outlined v-if="loadingTop" />
                    <plus-outlined v-else />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </template>
              </a-upload>
              <template v-if="fileListTop.length > 0">
                <close-circle-outlined class="delete-icon" @click="removeFileTop" />
              </template>
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
                <template v-if="fileListBottom.length < 1">
                  <div>
                    <loading-outlined v-if="loadingBottom" />
                    <plus-outlined v-else />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </template>
              </a-upload>
              <template v-if="fileListBottom.length > 0">
                <close-circle-outlined class="delete-icon" @click="removeFileBottom" />
              </template>
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
          <a-select v-model:value="formState.settingDatas.description_option.option_table.show_position"
                    style="width: 120px">
            <a-select-option v-for="selectOption in showPosition" :key="selectOption.value"
                             :value="selectOption.value">
              {{ selectOption.label }}
            </a-select-option>
          </a-select>
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

import {onMounted, reactive, ref} from "vue";
import Cookie from "js-cookie";
import {message} from "ant-design-vue";
import {useUserApi} from "@/api/user";
import {LoadingOutlined, PlusOutlined, CloseCircleOutlined  } from "@ant-design/icons-vue";
import response from "vuedraggable";

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

const fileListTop = ref([]);

const fileListBottom = ref([]);
const loadingTop = ref(false);
const loadingBottom = ref(false);

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

    // 上传成功处理
    let imgUrl = res.data.img_url;

    let newFileList = [{
      uid: '-1',
      name: 'option.file.name',
      status: 'done',
      url: imgUrl,
    }];

    // 根据位置更新状态和文件列表
    if (position === 'top') {
      formState.settingDatas.description_option.top_bottom_image.top_image_url = imgUrl;
      fileListTop.value.splice(0, fileListTop.value.length, ...newFileList);
      console.log(fileListTop.value);

      loadingTop.value = false;
    } else if (position === 'bottom') {
      formState.settingDatas.description_option.top_bottom_image.bottom_image_url = imgUrl;
      fileListBottom.value = newFileList;
      loadingBottom.value = false;
    }
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

function removeFileTop(){
  fileListTop.value = [];
}
function removeFileBottom(){
  fileListBottom.value = [];
}

async function saveUserInfo(){
  const isSwitchOn = formState.settingDatas.description_option.top_bottom_image.use;
  if (isSwitchOn && fileListTop.value.length === 0 && fileListBottom.value.length === 0)
  {
    message.error('상/하단 이미지를 등록하여 주세요.');
    return; // 阻止执行后续保存操作
  }

  // 检查并清除空的图片URL
  if (fileListTop.value.length === 0) {
    formState.settingDatas.description_option.top_bottom_image.top_image_url = '';
  }
  if (fileListBottom.value.length === 0) {
    formState.settingDatas.description_option.top_bottom_image.bottom_image_url = '';
  }

  try {
    const updateResponse = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", {
      settingDatas: formState.settingDatas
    });

    if (updateResponse.status !== '2000') {
      message.error(updateResponse.message);
      return;
    }

    await useUserApi().saveUserData(formState.settingDatas);
    console.log('Data saved successfully');
    message.success(updateResponse.message);

    // 在所有数据保存操作完成后获取最新的用户信息
    getUserInfoData();
  } catch (error) {
    console.error('Failed to save data:', error);
    message.error('\'Failed to save data:\', error');
  }
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

    //更新顶部和底部图片的文件列表
    if (user_data.description_option && user_data.description_option.top_bottom_image) {
      const top_image_url = user_data.description_option.top_bottom_image.top_image_url;
      const bottom_image_url = user_data.description_option.top_bottom_image.bottom_image_url;

      // 如果有顶部图片 URL，则创建对应的文件列表项
      if (top_image_url) {
        fileListTop.value = [{
          uid: '-1',
          name: 'Top Image',
          status: 'done',
          url: top_image_url,
        }];
      }

      if (bottom_image_url) {
        fileListBottom.value = [{
          uid: '-2',
          name: 'Bottom Image',
          status: 'done',
          url: bottom_image_url,
        }];
      }
    }
    formState.settingDatas = user_data; //更新状态

    setTimeout(() => {
      formState.loading = false;
    }, 500);

  }).catch((error)=>{
    message.error('실패: ${error.message}');
    formState.loading = false;
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
    position:relative;
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

  :deep .ant-upload-list-item-actions {
    display: none;
  }

  :deep .ant-upload-list-item::before{
    display:none;
  }

  :deep .ant-upload-list-item-custom {
    position: relative;
  }

  :deep .delete-icon {
    color: red;
    position: absolute;
    right: 100px;
    top: 20px;
    cursor: pointer;
  }

</style>