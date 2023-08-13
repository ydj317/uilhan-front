<script setup>
import { InboxOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {computed, onMounted, reactive, ref, watch} from "vue";
import {AuthRequest} from "@/util/request";
import {lib} from "@/util/lib";
import Loading from "vue-loading-overlay";
import Cookie from "js-cookie";

let bLoading = ref(false);

const uploadApiUrl = process.env.VUE_APP_API_URL + '/api/tools/convert2/file';
const headers = reactive({
  token: Cookie.get("token")
});

const formState = reactive({
  intervalBeginCount: '20',
  intervalEndCount: '100',
  intervalPercent: '80',
  cutCount: '0',
  firstFile: [],
  secondFile: [],
  thirdFile: [],
});

const onFinish = values => {
  console.log('Success:', values);



  if (formState.firstFile.length === 0) {
    message.warn('이지어드민 엑셀 파일을 선택해주세요.');
    return;
  }

  if (formState.secondFile.length === 0) {
    message.warn('발주프로그램 엑셀 파일을 선택해주세요.');
    return;
  }

  if (formState.thirdFile.length === 0) {
    message.warn('발주 업로드 엑셀 파일을 선택해주세요.');
    return;
  }

  const requestData = {
    intervalBeginCount: formState.intervalBeginCount,
    intervalEndCount: formState.intervalEndCount,
    intervalPercent: formState.intervalPercent,
    cutCount: formState.cutCount,
    file1: formState.firstFile[0].response.data,
    file2: formState.secondFile[0].response.data,
    file3: formState.thirdFile[0].response.data,
  };

  bLoading.value = true;

  AuthRequest.post(
      process.env.VUE_APP_API_URL + "/api/tools/convert2",
      JSON.stringify(requestData)
  ).then((res) => {

    bLoading.value = false;

    if (res.status !== "2000") {
      alert(res.message);
      return false;
    }

    let downloadElement = document.createElement("a");
    let url = window.URL || window.webkitURL || window.moxURL;
    let href = process.env.VUE_APP_API_URL + '/uploads/convert2.xlsx?t=' + new Date().getTime();
    downloadElement.href = href;
    downloadElement.download = decodeURI('convert2.xlsx'); // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    url.revokeObjectURL(href);

  });
};


</script>


<template>

  <a-card bordered hoverable title="엑셀 컨버터 툴2">
    <div style="display: flex; margin-top: 20px;">

      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
      >
        <a-form-item
            label="구간시작 개수"
            name="intervalBeginCount"
            :rules="[{ required: true, message: '필수 입력 항목입니다.' }]"
        >
          <a-input v-model:value="formState.intervalBeginCount" />
        </a-form-item>

        <a-form-item
            label="구간끝 개수"
            name="intervalEndCount"
            :rules="[{ required: true, message: '필수 입력 항목입니다.' }]"
        >
          <a-input v-model:value="formState.intervalEndCount" />
        </a-form-item>

        <a-form-item
            label="구간 내 %수"
            name="intervalPercent"
            :rules="[{ required: true, message: '필수 입력 항목입니다.' }]"
        >
          <a-input v-model:value="formState.intervalPercent" />
        </a-form-item>

        <a-form-item
            label="최소 발주 수량"
            name="cutCount"
            :rules="[{ required: true, message: '필수 입력 항목입니다.' }]"
        >
          <a-input v-model:value="formState.cutCount" />
        </a-form-item>


        <a-form-item label="이지어드민" :wrapper-col="{ offset: 0, span: 16 }"
                     :rules="[{ required: true, message: '필수 입력 항목입니다.' }]"
        >
          <a-upload
              v-model:file-list="formState.firstFile"
              list-type="file"
              accept=".xlsx, .xls"
              :max-count="1"
              :headers="headers"
              :action="uploadApiUrl + '?type=file1'"
          >
            <a-button>
              <upload-outlined></upload-outlined>
              엑셀 파일 선택
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item label="발주프로그램" :wrapper-col="{ offset: 0, span: 16 }"
                     :rules="[{ required: true, message: '필수 입력 항목입니다.' }]"
        >
          <a-upload
              v-model:file-list="formState.secondFile"
              list-type="file"
              accept=".xlsx, .xls"
              :max-count="1"
              :headers="headers"
              :action="uploadApiUrl + '?type=file2'"
          >
            <a-button>
              <upload-outlined></upload-outlined>
              엑셀 파일 선택
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item label="발주 업로드" :wrapper-col="{ offset: 0, span: 16 }"
                     :rules="[{ required: true, message: '필수 입력 항목입니다.' }]"
        >
          <a-upload
              v-model:file-list="formState.thirdFile"
              list-type="file"
              accept=".xlsx, .xls"
              :max-count="1"
              :headers="headers"
              :action="uploadApiUrl + '?type=file3'"
          >
            <a-button>
              <upload-outlined></upload-outlined>
              엑셀 파일 선택
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>

    </div>
  </a-card>

  <loading v-model:active="bLoading" :can-cancel="false" :is-full-page="true" />

</template>

<style scoped>
.loading {
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}
</style>