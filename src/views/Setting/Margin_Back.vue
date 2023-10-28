<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cardLoading" :bordered="false" title="마진 & 환율" class="setting-page-margin"
          :style="{marginBottom:'20px'}">
    <a-descriptions title="마진율 설정" bordered :column="{ xs: 1, sm: 1, md: 1}">
      <a-descriptions-item label="도매마진율" v-if="false">
        <!-- 등록된 마진률 -->
        <a-input-group compact>
          <template v-for="item in type_margin.wholesale_margin">
            <a-tag
              @close.prevent="deleteMargin('wholesale', item.value)"
              @click="updateMargin('wholesale', item.value)"
              :closable="item.value !== type_margin_option.wholesale_margin_option"
              class="setting-tag mr5"
              :style="item.value === type_margin_option.wholesale_margin_option ?
                {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
                {backgroundColor: '#fff'}"
            >{{ item.label }}
            </a-tag>
          </template>
          <!-- 등록버튼 -->
          <div v-if="input_visible.wholesale_input_visible" class="setting-input">
            <a-input-group compact>
              <a-input type="text" placeholder="명" v-model:value="type_margin_name.wholesale_margin_name"
                       style="width: 120px;" />
              <a-input type="text" placeholder="값" v-model:value="type_margin_value.wholesale_margin_value"
                       style="width: 60px;" />
              <a-button @click="addMargin('wholesale')" type="primary" class="ml5">등록</a-button>
              <a-button @click="input_visible.wholesale_input_visible = false" class="ml5">취소</a-button>
            </a-input-group>
          </div>
          <a-tag v-else class="setting-add" @click="input_visible.wholesale_input_visible = true">
            <PlusOutlined />
            등록
          </a-tag>
        </a-input-group>

        <!--도움말-->
        <div class="setting-help">* 상품 수집 시 설정한 마진율로 도매가 가격이 계산됩니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="공급마진율" v-if="isAdmin">
        <!-- 등록된 마진률 -->
        <a-input-group compact>
        <template v-for="item in type_margin.supply_margin">
          <a-tag
            @close.prevent="deleteMargin('supply', item.value)"
            @click="updateMargin('supply', item.value)"
            :closable="item.value !== type_margin_option.supply_margin_option"
            class="setting-tag mr5"
            :style="item.value === type_margin_option.supply_margin_option ?
                {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
                {backgroundColor: '#fff'}"
          >{{ item.label }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.supply_input_visible" class="setting-input">
          <a-input-group compact>
          <a-input type="text" placeholder="명" v-model:value="type_margin_name.supply_margin_name" style="width: 120px;" />
          <a-input type="text" placeholder="값" v-model:value="type_margin_value.supply_margin_value" style="width: 60px;" />
          <a-button @click="addMargin('supply')" type="primary" class="ml5">등록</a-button>
          <a-button @click="input_visible.supply_input_visible = false" class="ml5">취소</a-button>
          </a-input-group>
        </div>
        <a-tag v-else class="setting-add" @click="input_visible.supply_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>
        </a-input-group>

        <!--도움말-->
        <div class="setting-help">* 상품 수집 시 설정한 마진율로 공급가 가격이 계산됩니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="권장가">
        <!-- 등록된 마진률 -->
        <a-input-group compact>
        <template v-for="item in type_margin.disp_margin">
          <a-tag
            @close.prevent="deleteMargin('disp', item.value)"
            @click="updateMargin('disp', item.value)"
            :closable="item.value !== type_margin_option.disp_margin_option"
            class="setting-tag mr5"
            :style="item.value === type_margin_option.disp_margin_option ?
                {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
                {backgroundColor: '#fff'}"
          >{{ item.label }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.disp_input_visible" class="setting-input">
          <a-input-group compact>
          <a-input type="text" placeholder="명" v-model:value="type_margin_name.disp_margin_name" style="width: 120px;" />
          <a-input type="text" placeholder="값" v-model:value="type_margin_value.disp_margin_value" style="width: 120px;" />
          <a-button @click="addMargin('disp')" type="primary" class="ml5">등록</a-button>
          <a-button @click="input_visible.disp_input_visible = false" class="ml5">취소</a-button>
        </a-input-group>
        </div>
        <a-tag v-else class="setting-add" @click="input_visible.disp_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>
        </a-input-group>

        <!--도움말-->
        <div class="setting-help">* 상품 수집 시 설정한 마진율로 권장가가 계산됩니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="판매마진">
        <!-- 등록된 마진률 -->
        <a-input-group compact>
        <template v-for="item in type_margin.selling_margin">
          <a-tag
            @close.prevent="deleteMargin('selling', item.value)"
            @click="updateMargin('selling', item.value)"
            :closable="item.value !== type_margin_option.selling_margin_option"
            class="setting-tag mr5"
            :style="item.value === type_margin_option.selling_margin_option ?
                {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
                {backgroundColor: '#fff'}">
            {{ item.label }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.selling_input_visible" class="setting-input">
          <a-input-group compact>
          <a-input type="text" placeholder="명" v-model:value="type_margin_name.selling_margin_name" style="width: 120px;" />
          <a-input type="text" placeholder="값" v-model:value="type_margin_value.selling_margin_value" style="width: 60px;" />
          <a-button @click="addMargin('selling')" type="primary" class="ml5">등록</a-button>
          <a-button @click="input_visible.selling_input_visible = false" class="ml5">취소</a-button>
        </a-input-group>
        </div>
        <a-tag v-else class="setting-add" @click="input_visible.selling_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>
        </a-input-group>

        <!--도움말-->
        <div class="setting-help">* 상품 수집 시 설정한 마진율로 판매가 가격이 계산됩니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="수집 가격 설정">
        <!-- 등록된 설정 -->
        <a-input-group compact>
          <template v-for="(item, index) in collectionPriceList">
            <a-tag @close.prevent="delCollectionPrice(index)" closable class="setting-tag mr5">
              {{ `${item.priceRangeStart} ~ ${item.priceRangeEnd}원 범위 내 포함될 시` }}
              <DoubleRightOutlined :style="{ color: '#1890ff' }" />
              {{ `${item.price}${item.priceType === "number" ? "원으로 수집" : "%로 수집"}` }}
            </a-tag>
          </template>
          <!-- 등록버튼 -->
          <div v-if="input_visible.price_input_visible" class="setting-input">
            <a-input-group compact>
              <a-input type="text" placeholder="기준 시작" v-model:value="priceRangeStart" style="width: 100px;" />
              <a-input type="text" placeholder="기준 마감" v-model:value="priceRangeEnd" style="width: 100px; margin-right: 5px;" />
              <a-input type="text" :placeholder="priceType === 'number' ? '설정 가격' : '설정 값'" v-model:value="price" style="width: 100px;" />
              <a-select class="setting-select" v-model:value="priceType" style="width: 100px;">
                <a-select-option value="number">고정값</a-select-option>
                <a-select-option value="percent">백분율</a-select-option>
              </a-select>
              <a-button @click="addCollectionPrice" type="primary" class="ml5">등록</a-button>
              <a-button @click="input_visible.price_input_visible = false" class="ml5">취소</a-button>
            </a-input-group>
          </div>
          <a-tag v-else v-if="collectionPriceList.length < 3" class="setting-add"
                 @click="input_visible.price_input_visible = true">
            <PlusOutlined />
            등록
          </a-tag>
        </a-input-group>
        <!--도움말-->
        <div class="setting-help">* 상품 수집시 설정된 가격으로 수집합니다.<br>* 최대 3개까지 등록하실 수 있습니다.</div>
      </a-descriptions-item>
    </a-descriptions>
    <div style="height: 20px;"></div>
    <a-descriptions title="환율 설정" bordered :column="{ xs: 1, sm: 1, md: 1}">
      <a-descriptions-item label="기준 환율">
        <div style="padding: 5px 0;">
            <a-tag class="setting-rate" color="blue">
              <img width="25" :src="korIcon" alt=""> 한국 KRW : <b>{{ rateKor }}</b>
            </a-tag>
            <span style="margin: 0 10px 0 5px;"><SwapOutlined /></span>
            <a-tag class="setting-rate">
              <img width="25" :src="cnIcon" alt=""> 중국 RMB : <b>{{ rateCn }}</b>
            </a-tag>
        </div>
      </a-descriptions-item>

      <a-descriptions-item label="등록 환률">
        <!-- 등록된 환률 -->
        <a-input-group compact>
        <template v-for="item in type_margin.rate_margin">
          <a-tag
            @close.prevent="deleteMargin('rate', item.value)"
            @click="updateMargin('rate', item.value)"
            :closable="item.value !== type_margin_option.rate_margin_option"
            class="setting-tag mr5"
            :style="item.value === type_margin_option.rate_margin_option ?
              {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
              {backgroundColor: '#fff'}"
          ><img width="25" :src="korIcon" alt=""> {{ item.label }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.rate_input_visible" class="setting-input">
          <a-input-group compact>
          <a-input type="text" placeholder="명" v-model:value="type_margin_name.rate_margin_name" style="width: 120px;" />
          <a-input type="text" placeholder="값" v-model:value="type_margin_value.rate_margin_value" style="width: 60px;" />
          <a-button @click="addMargin('rate')" type="primary" class="ml5">등록</a-button>
          <a-button @click="input_visible.rate_input_visible = false" class="ml5">취소</a-button>
          </a-input-group>
        </div>
        <a-tag v-else class="setting-add" @click="input_visible.rate_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>
        </a-input-group>

        <!--도움말-->
        <div class="setting-help">* 상품 수집 시 설정한 환율로 가격이 계산됩니다.</div>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import Cookie from "js-cookie";
import { lib } from "@/util/lib";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import {
  DoubleRightOutlined,
  PlusOutlined,
  SwapOutlined
} from "@ant-design/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { message } from "ant-design-vue";

// loading
const indicator = ref(false);
const cardLoading = ref(true);
const cardLoading2 = ref(true);

const userData = ref({});
const rateCn = ref(0);
const rateKor = ref(0);
const korIcon = ref(require("../../assets/img/kor.png"))
const cnIcon = ref(require("../../assets/img/chn.png"))

const isAdmin = ref(Cookie.get("member_roles").split(",").includes("ROLE_ADMIN"));

// margin
const input_visible = reactive({
  wholesale_input_visible: false,
  supply_input_visible: false,
  selling_input_visible: false,
  disp_input_visible: false,
  rate_input_visible: false
});
let type_margin_option = reactive({
  wholesale_margin_option: 0,
  supply_margin_option: 0,
  selling_margin_option: 0,
  disp_margin_option: 0,
  rate_margin_option: 0
});
let type_margin = reactive({
  wholesale_margin: [],
  supply_margin: [],
  selling_margin: [],
  disp_margin: [],
  rate_margin: []
});
let type_margin_name = reactive({
  wholesale_margin_name: "",
  supply_margin_name: "",
  selling_margin_name: "",
  disp_margin_name: "",
  rate_margin_name: ""
});
let type_margin_value = reactive({
  wholesale_margin_value: "",
  supply_margin_value: "",
  selling_margin_value: "",
  disp_margin_value: "",
  rate_margin_value: ""
});

const collectionPriceList = ref([]);
const priceRangeStart = ref("");
const priceRangeEnd = ref("");
const price = ref("");
const priceType = ref("number");

function addCollectionPrice() {
  if (priceRangeStart.value === undefined || priceRangeStart.value.length === 0) {
    message.warning("기준가 시작범위는 필수로 입력해주십시오");
    return false;
  }

  if (priceRangeEnd.value === undefined || priceRangeEnd.value.length === 0) {
    message.warning("기준가 마감범위는 필수로 입력해주십시오");
    return false;
  }

  if (price.value === undefined || price.value.length === 0) {
    message.warning("가격은 필수로 입력해주십시오");
    return false;
  }

  let regPos = /^[0-9]+$/;
  if (
    !regPos.test(price.value) ||
    !regPos.test(priceRangeStart.value) ||
    !regPos.test(priceRangeEnd.value)
  ) {
    message.warning("기준 값과 가격 값은 숫자만 입력가능합니다.");
    return false;
  }

  if (parseInt(priceRangeStart.value) > parseInt(priceRangeEnd.value)) {
    message.warning("시작 가격은 마감 가격보다 작아야합니다.");
    return false;
  }

  if (collectionPriceList.value.length === 3) {
    message.warning("상품수집 가격설정은 최대 3개까지 등록하실수 있습니다.");
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
      message.warning(
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

function sendCollectionData(data) {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    data: data,
    type: "collection"
  }).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
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

function delCollectionPrice(index) {
  if (collectionPriceList.value.length === 0) {
    message.warning("등록된 가격 설정이 없습니다.");
    return false;
  }

  let data = collectionPriceList.value.filter(
    (item, i) => parseInt(index) !== parseInt(i)
  );
  indicator.value = true;
  sendCollectionData(data);
}

function setLabel(items, type, isRate = false) {
  let labelAddInfo = "";
  for (let i = 0; i < items.length; i++) {
    let symble = "";
    if (type === "margin" && isRate === false) {
      symble = "%";
    }

    if (
      items[i].label.indexOf("(") === -1 &&
      items[i].label.indexOf("%") === -1
    ) {
      labelAddInfo = " ( " + items[i].value + symble + " )";
    }

    items[i].label += labelAddInfo;
  }

  return items;
}

function setUserMargin(field, data) {
  field = field.replace("_margin", "");

  let isRate = false;
  if (field === "rate") {
    isRate = true;
  }

  let aMargin = lib.isArray(data)
    ? setLabel(data, "margin", isRate)
    : [];

  type_margin[field + "_margin"] = [];
  if (lib.isArray(aMargin, true)) {
    aMargin.map((data) => {
      type_margin[field + "_margin"].push(data);
    });
  }

  let aUse = aMargin.filter(margin => margin.use === "T");
  type_margin_option[field + "_margin_option"] = lib.isArray(aUse, true)
    ? aUse[0].value
    : "0";

  type_margin_name[field + "_margin_name"] = "";
  type_margin_value[field + "_margin_value"] = "";
  input_visible[field + "_input_visible"] = false;
}

function deleteMargin(type, value) {
  let data = type_margin[type + "_margin"].filter(
    (item) => parseInt(value) !== parseInt(item.value)
  );
  indicator.value = true;

  if (type !== "rate") {
    type = type + "_margin";
  }

  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    type: type,
    data: data
  }).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
      return false;
    }

    if (res.data.length === 0) {
      type_margin[type + "_margin"] = [];
      type_margin_option[type + "_margin_option"] = "";
      console.log("삭제성공");
      indicator.value = false;
      return false;
    }

    setUserMargin(type, res.data);

    console.log("삭제성공");
    indicator.value = false;
  });
}

function updateMargin(type, value) {
  // 이미 선택된 항목은 끝
  if (type_margin_option[type + "_margin_option"] === value) {
    return false;
  }

  let aOptions = type_margin[type + "_margin"];
  aOptions.map((item, i) => {
    aOptions[i].use = "F";
    if (parseInt(item.value) === parseInt(value)) {
      aOptions[i].use = "T";
    }
  });

  if (type !== "rate") {
    type = type + "_margin";
  }

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    type: type,
    data: aOptions
  }).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
      return false;
    }

    setUserMargin(type, res.data);

    console.log("설정성공");
    indicator.value = false;
  });
}

function addMargin(type) {
  if (lib.isEmpty(type_margin_name[type + "_margin_name"])) {
    message.warning("마진명은 필수로 입력해주십시오.");
    return false;
  }

  if (lib.isEmpty(type_margin_value[type + "_margin_value"])) {
    message.warning("마진값은 필수로 입력해주십시오.");
    return false;
  }

  let regPos = /^[0-9]+$/;
  if (!regPos.test(type_margin_value[type + "_margin_value"])) {
    message.warning("마진값은 숫자로 입력해주십시오.");
    return false;
  }

  let oData = {
    label: type_margin_name[type + "_margin_name"],
    value: type_margin_value[type + "_margin_value"]
  };
  let aFail = type_margin[type + "_margin"].filter(
    (item) => parseInt(oData.value) === parseInt(item.value)
  );
  if (lib.isArray(aFail, true)) {
    message.warning("동일유형에 같은 값을 중복으로 등록할수없습니다.");
    return false;
  }

  let aOptions = JSON.parse(JSON.stringify(type_margin[type + "_margin"]));
  aOptions.push(oData);

  if (type !== "rate") {
    type = type + "_margin";
  }

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/userup", {
    type: type,
    data: aOptions
  }).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      indicator.value = false;
      return false;
    }

    setUserMargin(type, res.data);

    console.log("등록성공");
    indicator.value = false;
  });
}

function initUserMargin(field) {
  let isRate = false;
  if (field === "rate") {
    isRate = true;
  }

  let aMargin = lib.isArray(
    userData.value[field + "_margin"]
  )
    ? setLabel(userData.value[field + "_margin"], "margin", isRate)
    : [];

  type_margin[field + "_margin"] = [];
  if (lib.isArray(aMargin, true)) {
    aMargin.map((data) => {
      type_margin[field + "_margin"].push(data);
    });
  }

  type_margin_option[field + "_margin_option"] = !lib.isEmpty(userData.value[field + "_margin_option"])
    ? userData.value[field + "_margin_option"]
    : "0";

}

function getUser() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user", {}).then(
    (res) => {
      if (res.status !== "2000") {
        message.error(res.message);
      }

      userData.value = res.data;
      ["wholesale", "supply", "selling", "disp", "rate"].map((field) => {
        initUserMargin(field);
      });

      collectionPriceList.value = res.data.collection;

      cardLoading.value = false;
    }
  );
}

function getRate() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/getrate").then(
    (res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }

      rateCn.value = res.data.cn;
      rateKor.value = res.data.ko;

      cardLoading2.value = false;
    }
  );
}

onMounted(() => {
  getUser();
  getRate();
});

</script>

<style>
.setting-page-margin .ant-descriptions-item-label {
  width: 200px;
}
</style>

<style scoped>
.setting-rate {
  text-align: center;
  padding: 5px 10px;
  margin: 3px 6px 3px 0;
}
.setting-rate img {
  margin-top: -2px;
  margin-right: 5px;
}

.setting-tag {
  cursor: pointer;
  padding: 5px 10px;
  margin: 3px 6px 3px 0;
}
.setting-tag img {
  margin-top: -2px;
  margin-right: 5px;
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
</style>