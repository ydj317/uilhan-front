<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" title="계정정보" class="setting-page-margin">
    <a-descriptions bordered :column="{ xs: 1, sm: 1, md: 1}">
      <a-descriptions-item label="API키 설정">
        <a-input-group compact>
        <a-input v-model:value="accessKey" placeholder="AccessKey" style="width: 300px;" />
        <a-input v-show="false" class="mt5" v-model:value="secretKey" placeholder="SecretKey" style="width: 300px;" />
        <a-button @click="addKey" type="primary">등록</a-button>
        </a-input-group>
      </a-descriptions-item>

      <a-descriptions-item label="서비스 유효일">
        {{ licenseEndTime === "" ? '서비스 종료' : licenseEndTime }}
        <router-link to="/user/licensePay" v-if="licenseEndTime === ''">
          <a-button type="primary" style="margin-left: 10px;">신청하기</a-button>
        </router-link>
      </a-descriptions-item>
      <a-descriptions-item label="서비스 마감일">
        {{ licenseRemainingDays === "" ? '서비스 종료' : licenseRemainingDays }}
      </a-descriptions-item>

      <a-descriptions-item label="이미지 번역 남은 회수">
        <a-input :value="recharge" disabled style="width: 200px;" />

        <!--도움말-->
        <div class="setting-help">* 상품 이미지 변역 남은 회수를 표시합니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="로고 설정" v-if="false">
        <a-upload :showUploadList="false" :multiple="true" :headers="headers"
                  :customRequest="(file) => customRequest(file, 'logo')" :beforeUpload="handleBeforeUpload">
          <a-button>
            <UploadOutlined />
            로고 업로드
          </a-button>
        </a-upload>

        <span v-if="logoImg.length > 0" class="ml10">
        <a-button v-if="isLogInDetail" @click="setLogoInDetail(false)" danger ghost>상품 상세 설명 적용 취소</a-button>
        <a-button v-else @click="setLogoInDetail(true)" type="primary">상품 상세 설명 적용</a-button>
        </span>

        <div class="setting-image">
          <a-image v-if="logoImg.length > 0" :src="logoImg" :fallback="tempImageUrl" style="width: 120px; height: 120px;" />
          <div v-if="logoImg.length === 0" style="text-align: center">
            등록된 로고가 없습니다.
          </div>
        </div>

        <!--도움말-->
        <div class="setting-help">* 업로드한 로고 이미지를 상품 상세 설명에 적용합니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="아이콘 설정" v-if="false">
        <a-upload :showUploadList="false" :multiple="true" :headers="headers"
                  :customRequest="(file) => customRequest(file, 'icon')" :beforeUpload="handleBeforeUpload">
          <a-button>
            <UploadOutlined />
            업로드
          </a-button>
        </a-upload>
        <div class="setting-image">
          <span v-for="(item, index) in icons">
            <p class="setting-delete" @click="delIcon(index)"></p>
            <a-image :src="item.src" :fallback="tempImageUrl" style="width: 120px; height: 120px;" />
          </span>
          <div v-if="icons.length === 0" style="text-align: center">
            등록된 아이콘이 없습니다.
          </div>
        </div>
      </a-descriptions-item>

      <a-descriptions-item label="카테고리 동기화" v-if="isAdmin">
        <a-button @click="onClickSyncDomeggookCategory" type="primary">동기화 실행</a-button>
      </a-descriptions-item>

      <a-descriptions-item label="이미지 백업" v-if="false">
        <a-button @click="backupImages" type="primary">백업 실행</a-button>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>

</template>

<script setup>
import { AuthRequest } from "@/util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import {
  UploadOutlined
} from "@ant-design/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import Cookie from "js-cookie";
import { message } from "ant-design-vue";

const store = useStore();
const { product } = store.state;

// loading
const indicator = ref(false);
const cartLoading = ref(true);

const accessKey = ref();
const secretKey = ref();
const licenseEndTime = ref("")
const licenseRemainingDays = ref("")
const recharge = ref(0);
const tempImageUrl = ref(require('../../assets/img/temp_image.png'));
const icons = ref([]);
const logoImg = ref('');
const isLogInDetail = ref(false);
const headers = ref({
  token: Cookie.get("token"),
  "Content-Type": "multipart/form-data"
});

const isAdmin = ref(Cookie.get("member_roles").split(",").includes("ROLE_ADMIN"));

function setLogoInDetail(value) {
  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    value: value,
    type: "logoindetail",
  }).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      indicator.value = false;
      return false;
    }

    isLogInDetail.value = res.data;
    if (isLogInDetail.value) {
      message.success('상품 상세 설명에 로고 이미지 적용 성공하였습니다.\n페이지를 갱신하시면 상품 상세 편집 창에서 효과를 확인하실 수 있습니다.')
    } else {
      message.success('상품 상세 설명에 로고 이미지 적용 취소하였습니다.\n페이지를 갱신하시면 상품 상세 편집 창에서 효과를 확인하실 수 있습니다.')
    }

    indicator.value = false;
  });
}

function setLogo() {
  if (logoImg.value.length === 0) {
    message.warning("업로드한 이미지가 없습니다");
    return false;
  }
  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    value: logoImg.value,
    type: "logo",
  }).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      indicator.value = false;
      return false;
    }

    if (res.data === undefined || res.data.length === 0) {
      message.error("로고 업로드 실패");
      return false;
    }

    logoImg.value = res.data;
    console.log('로고이미지 저장 성공')
    indicator.value = false;
  });
}

function delLogo(oldLogo) {
  if (oldLogo === '') {
    return false;
  }
  let delData = [{ src: oldLogo }];

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/delicon", {
    data: delData,
    type: "logo"
  }).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
    }

    console.log("oldLogo 삭제 성공");
    indicator.value = false;
  });
}

function delIcon(index) {
  let delData = [{ src: icons.value[index].src }];

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/delicon", {
    data: delData,
    type: "icon"
  }).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
    }

    for (let i = 0; i < delData.length; i++) {
      icons.value = icons.value.filter((item) => item.src !== delData[i].src);
    }

    console.log("icon 삭제 성공");
    indicator.value = false;
  });
}

function customRequest(option, type) {
  const oldLogo = logoImg.value;

  const formData = new FormData();
  formData.append("file", option.file);
  formData.append("relation_type", "user");
  formData.append("image_type", type);
  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/image",
    formData
  ).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
      return false;
    }

    if (type === "logo") {
      logoImg.value = res.data.img_url;
      setLogo()
      setLogoInDetail(true)
      delLogo(oldLogo)
    } else {
      icons.value.push({ src: res.data.img_url });
    }

    indicator.value = false;
  });
}

function handleBeforeUpload(file) {
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

function backupImages() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/backupimages").then(
    (res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
    }
  );
}

function onClickSyncDomeggookCategory() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/domeggook/sync/category", {
    market_code: "Domeggook"
  }).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        indicator.value = false;
        return false;
      }

      message.warning("카테고리 동기화 신청완료.");
      indicator.value = false;
    }
  );
}

function getRecharge() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/getrecharge").then(
    (res) => {
      if (res.status !== "2000" || res.data === undefined) {
        message.error(res.message);
        return false;
      }

      try {
        recharge.value = res.data.recharge;
        product.recharge = res.data.recharge;
      } catch (e) {
        message.error("남은회수 호출 실패");
      }
    }
  );
}

function addKey() {
  if (accessKey.value.length === undefined || accessKey.value.length === 0) {
    message.warning("accessKey는 필수로 입력해주십시오");
    return false;
  }

  if (secretKey.value.length === undefined || secretKey.value.length === 0) {
    // message.warning("secretKey는 필수로 입력해주십시오");
    // return false;
      secretKey.value = 'secretKey';
  }

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    access_key: accessKey.value,
    secret_key: secretKey.value,
    type: "key"
  }).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
      return false;
    }

    message.success("등록성공");
    indicator.value = false;
  });
}

function getUser() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user", {}).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
      }

      if (
        res.data.logo !== undefined &&
        res.data.logo.length > 0
      ) {
        logoImg.value = res.data.logo
        isLogInDetail.value = res.data.logoindetail
      }

      if (
        res.data.icons !== undefined &&
        res.data.icons.length > 0
      ) {
        icons.value = res.data.icons;
      }

      accessKey.value = res.data.key.access_key;
      secretKey.value = res.data.key.secret_key;

      const endDate = new Date(res.data.license_end_date);
      if (new Date() < endDate) {
        licenseRemainingDays.value = endDate.toLocaleString()
        licenseEndTime.value = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)) + '일'
      }

      cartLoading.value = false;
    }
  );
}

onMounted(() => {
  getUser();
  getRecharge();
});

</script>

<style>
.setting-page-margin .ant-descriptions-item-label {
  width: 200px;
}

.setting-input .ant-select-selector {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>

<style scoped>
.setting-tag {
  padding: 5px 10px;
  margin: 3px 6px 3px 0;
  background: #fff;
}

.setting-add {
  cursor: pointer;
  padding: 5px 10px;
  margin: 3px 6px 3px 0;
  background: #fff;
  border-style: dashed;
}

.setting-input {
  display: inline-block;
  margin: 3px 0;
}



.setting-help {
  font-size: 12px;
  padding-top: 10px;
  color: #999;
}

.setting-image {
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #eee;
}

.setting-image span {
  display: inline-block;
  position: relative;
  margin-right: 10px;
}

.setting-image .setting-delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: #666;
  display: none;
  cursor: pointer;
  z-index: 1;
}

.setting-image .setting-delete::before, .setting-image .setting-delete::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 1px;
  background-color: rgb(255, 255, 255, 0.8);
  transform-origin: center;
}

.setting-image .setting-delete::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.setting-image .setting-delete::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.setting-image span:hover .setting-delete {
  display: block;
}
</style>