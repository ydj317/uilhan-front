<script setup>
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {onMounted, reactive, ref} from "vue";
import {AuthRequest} from "@/util/request";
import {lib} from "@/util/lib";
import Loading from "vue-loading-overlay";
import Cookie from "js-cookie";

let bLoading = ref(true);


const uploadApiUrl = process.env.VUE_APP_API_URL + '/api/tools/convert/file';
const headers = reactive({
  token: Cookie.get("token")
});

const fileList = ref([])
const formStat = reactive({
  list: [
    {name: 'JACKET', percent: 0},
    {name: 'KNIT', percent: 0},
    {name: 'ONEPIECE', percent: 0},
    {name: 'PANTS', percent: 0},
    {name: 'SHIRT', percent: 0},
    {name: 'SKIRT', percent: 0},
    {name: 'T-SHIRT', percent: 0},
  ]
});

const handleChange = info => {

  bLoading.value = true;

  console.log(info)

  const status = info.file.status;
  if (status === "removed") {
    bLoading.value = false;
  }

  if (status === 'done') {

    bLoading.value = false;

    if (info.file.response.status !== '2000') {
      message.warn(info.file.response.message);
      return;
    }

    let downloadElement = document.createElement("a");
    let url = window.URL || window.webkitURL || window.moxURL;
    let href = process.env.VUE_APP_API_URL + '/uploads/convert.xlsx?t=' + new Date().getTime();
    downloadElement.href = href;
    downloadElement.download = decodeURI('convert.xlsx'); // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    url.revokeObjectURL(href);

  } else if (status === 'error') {
    //message.error(`${info.file.name} file upload failed.`);
    bLoading.value = false;
  }



};

const handleDrop = (e) => {
  console.log(e);
}

const submitForm = function () {
  AuthRequest.post(
      process.env.VUE_APP_API_URL + "/api/tools/convert",
      JSON.stringify(formStat)
  ).then((res) => {

    console.log(res);

    if (res.status !== "2000") {
      alert(res.message);
      return false;
    }

    alert(res.message);

  });
}

onMounted(async () => {
  AuthRequest.get(
      process.env.VUE_APP_API_URL + "/api/tools/convert"
  ).then((res) => {
    bLoading.value = false;
    if (res.data !== null) {
      const data = JSON.parse(res.data.data);
      formStat.list = data.list;
    } else {
      alert('설정 정보를 입력해 주세요.');
    }
  });
});

const removeHandler = function () {
  bLoading.value = false;
  return true;
}

</script>


<template>

<!--  <loading v-model:active="bLoading" :can-cancel="false" :is-full-page="true" />-->

  <a-card bordered hoverable title="엑셀 컨버터 툴">
    <div style="display: flex; margin-top: 20px;">
      <div style="width: 50%;">
        <div style="padding: 0 20px 0 20px;">
          <a-list :data-source="formStat.list" :loading="false">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    {{ item.name }}
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-input-number v-model:value="item.percent" />%
                </template>
              </a-list-item>
            </template>
            <template #footer >
              <div style="display: flex;justify-content: center;">
                <a-button type="primary" style="width: 120px;" @click="submitForm">저장</a-button>
              </div>
            </template>
          </a-list>
        </div>

      </div>
      <div style="width: 50%;">
        <div style="padding: 0 20px 0 20px;">
          <a-upload-dragger
              v-model:fileList="fileList"
              name="file"
              :multiple="false"
              :headers="headers"
              :action="uploadApiUrl"
              @change="handleChange"
              @drop="handleDrop"
              @remove="removeHandler"
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined></inbox-outlined>
            </p>
            <p class="ant-upload-text">Click or drag file to this area to upload</p>
            <p class="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or other
              band files
            </p>
          </a-upload-dragger>
        </div>
      </div>
    </div>
  </a-card>

</template>

<style scoped>

</style>