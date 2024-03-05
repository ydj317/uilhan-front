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

        <a-switch v-model:checked="formState.settingDatas.imgSecection.image_upload_switch" @change="handleSaveUserData"
                  checked-children="on" un-checked-children="off" />

        <div v-if="formState.settingDatas.imgSecection.image_upload_switch">
            <span class="image-fix">
              <span class="title">상단 고정 이미지</span>
              <a-upload
                  v-model:file-list="fileListTop"
                  name="avatar"
                  list-type="picture-card"
                  :headers="formState.uploadHeaders"
                  :max-count="3"
                  :action="formState.uploadUrl"
                  @change="handleChangeTop"
              >
                 <template v-if="fileListTop.length < 3">
                  <div>
                    <loading-outlined v-if="loadingTop" />
                    <plus-outlined v-else />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </template>
              </a-upload>
            </span>
            <span class="image-fix">
              <span class="title">하단 고정 이미지</span>
              <a-upload
                  v-model:file-list="fileListBottom"
                  name="avatar"
                  list-type="picture-card"
                  :headers="formState.uploadHeaders"
                  :max-count="3"
                  :action="formState.uploadUrl"
                  @change="handleChangeBottom"
              >
                 <template v-if="fileListBottom.length < 3">
                  <div>
                    <loading-outlined v-if="loadingBottom" />
                    <plus-outlined v-else />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </template>
              </a-upload>
            </span>
        </div>
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>옵션 테이블 설정</span>
          </a-space>
        </template>

        <a-switch v-model:checked="formState.settingDatas.option.option_table_switch" @change="handleSaveUserData" checked-children="on" un-checked-children="off" />
        <div class="select" v-if="formState.settingDatas.option.option_table_switch">
          <!-- 第一个下拉菜单 -->
          <a-select v-model:value="formState.settingDatas.option.option_select_value1" style="width: 120px">
            <a-select-option v-for="selectOption in formState.settingDatas.option.optionTableSelectOption1" :key="selectOption.value"
                             :value="selectOption.value">
              {{ selectOption.label }}
            </a-select-option>
          </a-select>
          <!-- 第二个下拉菜单 -->
          <a-select v-model:value="formState.settingDatas.option.option_select_value2" style="width: 120px">
            <a-select-option v-for="selectOption in formState.settingDatas.option.optionTableSelectOption2" :key="selectOption.value"
                             :value="selectOption.value">
              {{ selectOption.label }}
            </a-select-option>
          </a-select>
        </div>
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>동영상 노출 설정</span>
          </a-space>
        </template>
        <a-switch v-model:checked="formState.settingDatas.show_video" @change="handleSaveUserData" checked-children="on" un-checked-children="off" />
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script setup>
import {AuthRequest} from "@/util/request";

import {onMounted, reactive, ref, watch} from "vue";
import Cookie from "js-cookie";
import {message} from "ant-design-vue";
import {useUserApi} from "@/api/user";
import {PlusOutlined, LoadingOutlined} from "@ant-design/icons-vue";


//switch
const formState = reactive({
  settingDatas: {
    imgSecection:{
      image_upload_switch: false,
      image_upload_image_top: 'top',
      image_upload_image_bottom: 'bottom'
    },
    option:{
      option_table_switch:false,
      option_select_value1: 'top',  // 直接在对象内设置默认值
      option_select_value2: 'table_two_column',

      optionTableSelectOption1: [  // 直接定义为数组，无需ref
        { label: '상단에', value: 'top' },
        { label: '하단에', value: 'bottom' },
      ],
      optionTableSelectOption2: [  // 直接定义为数组，无需ref
        { label: '두줄로 추가', value: 'table_two_column' },
        { label: '네줄로 추가', value: 'table_four_column' },
      ]
    },
    show_video: false
  },


  //upload
  uploadUrl: process.env.VUE_APP_API_URL + '/api/user/uploadImage',
  loading: false,
  uploadHeaders: {
    token: Cookie.get("token")
  },
});

const fileListTop = ref([]);
const fileListBottom = ref([]);
const loadingTop = ref(false);
const loadingBottom = ref(false);
const imageUrl = ref('');

//option
// const selectOptionValue1 = ref('top'); //默认
// const optionTableSelectOption1 = ref([
//   { label: '상단에', value: 'top' },
//   { label: '하단에', value: 'bottom' },
// ]);
//
// // const selectOptionValue2 = ref('table_two_column');
// const optionTableSelectOption2 = ref([
//   { label: '두줄로 추가', value: 'table_two_column' },
//   { label: '네줄로 추가', value: 'table_four_column' },
// ]);

// watch(() => formState.settingDatas.option.option_select_value1, (newValue) => {
//   console.log('New value for option_select_value1:', newValue);
// });
//
// watch(() => formState.settingDatas.option.option_select_value2, (newValue) => {
//   console.log('New value for option_select_value2:', newValue);
// });

const handleChangeTop = ({ file, fileList: newFileList }) => {
  if (file.status === 'uploading') {
    loadingTop.value = true;
  } else {
    loadingTop.value = false;
    fileListTop.value = newFileList;
  }
};

const handleChangeBottom = ({ file, fileList: newFileList }) => {
  if (file.status === 'uploading') {
    loadingBottom.value = true;
  } else {
    loadingBottom.value = false;
    fileListBottom.value = newFileList;
  }
};

const handleSaveUserData = () => {
  useUserApi().saveUserData(formState.settingDatas).then((res) => {
    console.log('Data saved successfully');
  }).catch((error) => {
      console.error('Failed to save data:', error);
  });
}

// function fetchUserUploadImage() {
//   AuthRequest.get(process.env.VUE_APP_API_URL + "/api/user/getUploadImage")
//       .then(response => {
//         console.log(response);
//         const  avatarFilename  = response.avatar_filename;
//         console.log(avatarFilename);
//         if (avatarFilename) {
//           imageUrl.value = `/uploads/${avatarFilename}`;
//           console.log(imageUrl.value);
//         }
//       })
//       .catch(error => {
//         console.error('Failed to fetch user profile:', error);
//       });
// }

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

    if (user_data.imgSecection=== undefined) {
      formState.loading = false;
      return false;
    }

    if (user_data.option === undefined) {
      formState.loading = false;
      return false;
    }

    formState.settingDatas = user_data;
    setTimeout(() => {
      formState.loading = false;
    }, 500);

  });
}

onMounted(() => {
  // fetchUserUploadImage();
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

</style>