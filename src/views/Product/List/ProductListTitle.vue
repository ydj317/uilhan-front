<template>
  <FullPageLoading v-model:show="loading" />
  <div class="title">
    <h3><strong>상품관리</strong></h3>
    <a-dropdown>
      <template #overlay>
        <a-menu>
          <a-menu-item key="1" @click="showUrlModal = true">URL상품 업로드</a-menu-item>
          <a-menu-item key="2">
            <a-upload
              :action="uploadCustomOrderPath"
              v-model:fileList="excelPrdFileList"
              name="file"
              :max-count="1"
              :headers="excelUploadHeaders"
              :multiple="false"
              :showUploadList="false"
              @change="excelUploadCustomOrder"
            >
              엑셀상품 업로드
            </a-upload>
          </a-menu-item>
          <a-menu-item
            key="3"
            @click="downloadSampleExcel"
          >업로드 샘플</a-menu-item>
        </a-menu>
      </template>
      <a-button type="primary" >상품수집 <DownOutlined /></a-button>
    </a-dropdown>
  </div>
  <a-divider style="margin: 10px 0;"/>
  <a-modal width="800px" v-model:open="showUrlModal" centered>
    <template #title>
      URL상품 업로드
      <a-tooltip>
        <template #title>
          <div>타오바오, 티몰, 1688 상품URL을 입력하여 상품 업로드 합니다.</div>
        </template>
        <QuestionCircleOutlined/>
      </a-tooltip>
    </template>

    <div>타오바오, 티몰, 1688 상품URL을 입력하여 상품 업로드 합니다.</div>

    <a-divider/>

    <div>
      <a-textarea
        v-model:value="urlPrdValue"
        placeholder="상품url 줄바꿈으로 구문하여 입력 부탁 합니다."
        :auto-size="{ minRows: 5, maxRows: 5 }"
      />
    </div>

    <template v-slot:footer>
      <a-button type="primary" @click="urlPrdUpload()">업로드</a-button>
      <a-button @click="showUrlModal = false">취소</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {DownOutlined, QuestionCircleOutlined} from '@ant-design/icons-vue';
import {ref} from "vue";
import Cookie from "js-cookie";
import {message} from "ant-design-vue";
import {useProductApi} from "@/api/product";
import FullPageLoading from "@/components/FullPageLoading.vue";

const uploadCustomOrderPath = process.env.VUE_APP_API_URL + "/api/excelPrdUpload?XDEBUG_SESSION_START=PHPSTORM"
const excelUploadHeaders = { token: Cookie.get("token") }

const loading = ref(false)
const showUrlModal = ref(false)
const urlPrdValue = ref('')
const excelPrdFileList = ref([])

function handleMenuClick ({key}) {
  switch (key) {
    case '1':
      showUrlModal.value = true
      break;
    case '3':

  }
}

async function urlPrdUpload() {
  loading.value = true;

  await useProductApi().urlPrdUpload({"urlPrdValue": urlPrdValue.value}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      loading.value = false;
      return false;
    }

    message.success('업로드요청 성공하였습니다.');

    loading.value = false;
    showUrlModal.value = false;
  });

}

function excelUploadCustomOrder(res) {
  if (res.file.status === 'uploading') {
    loading.value = true;
    return false;
  }

  if (res.file.status === 'error') {
    loading.value = false;
    message.error(res.error.message);
    return false;
  }

  if (res.file.status === 'done') {
    loading.value = false;
    if (res.file.response.status != '2000') {
      message.error(res.file.response.message);
    } else {
      message.success(res.file.response.message);
    }
  }
}

function downloadSampleExcel() {
  window.open('/sampleFile/exclPrdUpload.xlsx', '_blank');
}

</script>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center
}
.title :deep(button) {
  background-color: #2171e2;color: white;
}
.title :deep(button):hover,
.title :deep(button):active,
.title :deep(button):focus {
  background-color: #2171e2;color: white;
}
</style>