<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" title="계정정보" class="setting-page-margin"
          :style="{marginBottom:'20px'}">
    <a-descriptions bordered :column="{ xs: 1, sm: 1, md: 1}">
      <a-descriptions-item label="릴라켓 세션키 설정">
        <a-input v-model:value="accessKey" placeholder="AccessKey" style="width: 300px;" />
        <br>
        <a-input class="mt5" v-model:value="secretKey" placeholder="SecretKey" style="width: 300px;" />
        <br>
        <a-button class="mt5" @click="addKey" type="primary" style="width: 100px;">등록</a-button>
      </a-descriptions-item>

      <a-descriptions-item label="이미지 번역 남은 회수">
        <a-input :value="recharge" disabled style="width: 200px;" />
      </a-descriptions-item>

      <a-descriptions-item label="수집 가격 설정">
        <!-- 등록된 설정 -->
        <template v-for="(item, index) in collectionPriceList">
          <a-tag @close.prevent="delCollectionPrice(index)" closable class="setting-tag">
            {{ `${item.priceRangeStart} ~ ${item.priceRangeEnd}원 범위내 포함될시` }}
            <DoubleRightOutlined :style="{ color: '#1890ff' }" />
            {{ `${item.price} ${item.priceType === "number" ? "원으로 수집" : "%로 수집"}` }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.price_input_visible" class="setting-input">
          <a-input type="text" placeholder="기준 시작" v-model:value="priceRangeStart" />
          <a-input type="text" placeholder="기준 마감" v-model:value="priceRangeEnd" />
          <a-input type="text" :placeholder="priceType === 'number' ? '설정 가격' : '설정 값'" v-model:value="price" />
          <a-select class="setting-select" v-model:value="priceType">
            <a-select-option value="number">고정값</a-select-option>
            <a-select-option value="percent">백분율</a-select-option>
          </a-select>
          <a-button @click="addCollectionPrice" type="primary">등록</a-button>
          <a-button @click="input_visible.price_input_visible = false" class="ml5">취소</a-button>
        </div>
        <a-tag v-else v-if="collectionPriceList.length < 3" class="setting-add"
               @click="input_visible.price_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>
        <!--도움말-->
        <div class="setting-help">* 최대 3개까지 등록하실수 있습니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="아이콘 설정">
        <a-upload :showUploadList="false" :multiple="true" :headers="headers"
                  :customRequest="(file) => customRequest(file, 'icon')" :beforeUpload="handleBeforeUpload">
          <a-button>
            <UploadOutlined />
            업로드
          </a-button>
        </a-upload>
        <div class="setting-icons">
          <span v-for="(item, index) in icons">
            <icon class="setting-delete" @click="delIcon(index)"></icon>
            <img :src="item.src" />
          </span>
          <div v-if="icons.length === 0" style="text-align: center">
            추가된 아이콘이 없습니다.
          </div>
        </div>
      </a-descriptions-item>

      <a-descriptions-item label="로고 설정">
      </a-descriptions-item>

      <a-descriptions-item label="카테고리 동기화" v-if="isAdmin">
        <a-button style="width: 100px;" @click="onClickSyncDomeggookCategory" type="primary">수집 실행</a-button>
      </a-descriptions-item>

      <a-descriptions-item label="이미지 백업" v-if="isAdmin">
        <a-button style="width: 100px;" @click="backupImages" type="primary">백업 실행</a-button>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>

</template>

<script setup>
import { AuthRequest } from "@/util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import {
  DoubleRightOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import Cookie from "js-cookie";

const store = useStore();
const { product } = store.state;

// loading
const indicator = ref(false);
const cartLoading = ref(true);

const accessKey = ref();
const secretKey = ref();
const recharge = ref(0);
const priceRangeStart = ref("");
const priceRangeEnd = ref("");
const price = ref("");
const priceType = ref("number");
const collectionPriceList = ref([]);
const icons = ref([]);
const logoImg = ref("");
const headers = ref({
  token: Cookie.get("token"),
  "Content-Type": "multipart/form-data"
});

const isAdmin = ref(Cookie.get("member_roles").split(",").includes("ROLE_ADMIN"));

const input_visible = reactive({
  price_input_visible: false
});

function delIcon(index) {
  let delData = [{ src: icons.value[index].src }];

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/delicon", {
    data: [{ src: icons.value[index].src }],
    type: "icon"
  }).then((res) => {
    if (res.status !== "2000") {
      alert(res.message);
    }

    for (let i = 0; i < delData.length; i++) {
      icons.value = icons.value.filter((item) => item.src !== delData[i].src);
    }

    console.log("삭제 성공");
    indicator.value = false;
  });
}


function customRequest(option, type) {
  const formData = new FormData();
  formData.append("file", option.file);
  formData.append("relation_type", "user");
  formData.append("image_type", type);
  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/image",
    formData
  ).then((res) => {
    if (res.status !== "2000") {
      alert(res.message);
      return false;
    }

    if (type === "logo") {
      logoImg.value = res.data.img_url;
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
    alert("허용되는 이미지 격식이 아닙니다.");
    return false;
  }

  return true;
}

function backupImages() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/backupimages").then(
    (res) => {
      if (res.status !== "2000") {
        alert(res.message);
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
        alert(res.message);
        indicator.value = false;
        return false;
      }

      alert("카테고리 동기화 신청완료.");
      indicator.value = false;
    }
  );
}

function addCollectionPrice() {
  if (priceRangeStart.value === undefined || priceRangeStart.value.length === 0) {
    alert("기준가 시작범위는 필수로 입력해주십시오");
    return false;
  }

  if (priceRangeEnd.value === undefined || priceRangeEnd.value.length === 0) {
    alert("기준가 마감범위는 필수로 입력해주십시오");
    return false;
  }

  if (price.value === undefined || price.value.length === 0) {
    alert("가격은 필수로 입력해주십시오");
    return false;
  }

  let regPos = /^[0-9]+$/;
  if (
    !regPos.test(price.value) ||
    !regPos.test(priceRangeStart.value) ||
    !regPos.test(priceRangeEnd.value)
  ) {
    alert("기준 값과 가격 값은 숫자만 입력가능합니다.");
    return false;
  }

  if (parseInt(priceRangeStart.value) > parseInt(priceRangeEnd.value)) {
    alert("시작 가격은 마감 가격보다 작아야합니다.");
    return false;
  }

  if (collectionPriceList.value.length === 3) {
    alert("상품수집 가격설정은 최대 3개까지 등록하실수 있습니다.");
    return false;
  }

  for (let i = 0; i < collectionPriceList.value.length; i++) {
    let item = collectionPriceList.value[i];
    if (
      (parseInt(priceRangeStart.value) >= parseInt(item.priceRangeStart) &&
        parseInt(priceRangeStart.value) <= parseInt(item.priceRangeEnd)) ||
      (parseInt(priceRangeEnd.value) >= parseInt(item.priceRangeStart) &&
        parseInt(priceRangeEnd.value) <= parseInt(item.priceRangeEnd))
    ) {
      alert(
        "요청하신 가격범위는 기존에 등록하신 가격범위에 포함되여있습니다."
      );
      return false;
    }
  }

  let data = collectionPriceList.value.concat({
    priceRangeStart: priceRangeStart.value,
    priceRangeEnd: priceRangeEnd.value,
    price: price.value,
    priceType: priceType.value
  });
  indicator.value = true;
  sendCollectionData(data);
}

function delCollectionPrice(index) {
  if (collectionPriceList.value.length === 0) {
    alert("등록된 가격 설정이 없습니다.");
    return false;
  }

  let data = collectionPriceList.value.filter(
    (item, i) => parseInt(index) !== parseInt(i)
  );
  indicator.value = true;
  sendCollectionData(data);
}

function sendCollectionData(data) {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    data: data,
    type: "collection"
  }).then((res) => {
    if (res.status !== "2000") {
      alert(res.message);
      return false;
    }

    collectionPriceList.value = data;
    input_visible.price_input_visible = false;
    priceRangeStart.value = "";
    priceRangeEnd.value = "";
    price.value = "";
    priceType.value = "number";
    indicator.value = false;
    console.log("처리성공");
  });
}

function getRecharge() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/getrecharge").then(
    (res) => {
      if (res.status !== "2000" || res.data === undefined) {
        alert(res.message);
        return false;
      }

      try {
        recharge.value = res.data.recharge;
        product.recharge = res.data.recharge;
      } catch (e) {
        alert("남은회수 호출 실패");
      }
    }
  );
}

function addKey() {
  if (accessKey.value.length === undefined || accessKey.value.length === 0) {
    alert("accessKey는 필수로 입력해주십시오");
    return false;
  }

  if (secretKey.value.length === undefined || secretKey.value.length === 0) {
    alert("secretKey는 필수로 입력해주십시오");
    return false;
  }

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    access_key: accessKey.value,
    secret_key: secretKey.value,
    type: "key"
  }).then((res) => {
    if (res.status !== "2000") {
      alert(res.message);
      return false;
    }

    alert("등록성공");
    indicator.value = false;
  });
}

function getUser() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user", {}).then(
    (res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      if (
        res.data.logo !== undefined &&
        res.data.logo.length > 0
      ) {
        logoImg.value = res.data.logo;
      }

      if (
        res.data.icons !== undefined &&
        res.data.icons.length > 0
      ) {
        icons.value = res.data.icons;
      }

      accessKey.value = res.data.key.access_key;
      secretKey.value = res.data.key.secret_key;

      collectionPriceList.value = res.data.collection;

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

.setting-input input:nth-child(1) {
  width: 100px;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.setting-input input:nth-child(2) {
  width: 100px;
  margin-right: 5px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.setting-input input:nth-child(3) {
  width: 100px;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.setting-input .setting-select {
  width: 100px;
  margin-right: 5px;
}

.setting-help {
  font-size: 12px;
  padding-top: 10px;
  color: #999;
}

.setting-icons {
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #eee;
}

.setting-icons span {
  display: inline-block;
  position: relative;
  margin-right: 10px;
}

.setting-icons .setting-delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: rgb(0,0,0,0.3);
  display: none;
  cursor: pointer;
}
.setting-icons .setting-delete::before, .setting-icons .setting-delete::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 1px;
  background-color: rgb(255,255,255,0.8);
  transform-origin: center;
}
.setting-icons .setting-delete::before {
  transform: translate(-50%, -50%) rotate(45deg);
}
.setting-icons .setting-delete::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.setting-icons span:hover .setting-delete {
  display: block;
}

.setting-icons img {
  width: 120px;
  height: 120px;
}


</style>