<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" title="마진 & 환율" class="setting-page-margin"
          :style="{marginBottom:'20px'}">
    <a-descriptions title="마진율 설정" bordered :column="{ xs: 1, sm: 1, md: 1}">
      <a-descriptions-item label="도매마진율">
        <!-- 등록된 마진률 -->
        <template v-for="item in type_margin.wholesale_margin">
          <a-tag
            @close.prevent="deleteMargin('wholesale', item.value)"
            @click="updateMargin('wholesale', item.value)"
            :closable="item.value !== type_margin_option.wholesale_margin_option"
            class="setting-tag"
            :style="item.value === type_margin_option.wholesale_margin_option ?
                {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
                {backgroundColor: '#fff'}"
          >{{ item.label }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.wholesale_input_visible" class="setting-input">
          <a-input type="text" placeholder="명" v-model:value="type_margin_name.wholesale_margin_name" />
          <a-input type="text" placeholder="값" v-model:value="type_margin_value.wholesale_margin_value" />
          <a-button @click="addMargin('wholesale')" type="primary">등록</a-button>
          <a-button @click="input_visible.wholesale_input_visible = false" class="ml5">취소</a-button>
        </div>
        <a-tag v-else class="setting-add" @click="input_visible.wholesale_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>

        <!--도움말-->
        <div class="setting-help">* 상품 수집 시 설정한 마진율로 도매가 가격이 계산됩니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="공급마진율" v-if="isAdmin">
        <!-- 등록된 마진률 -->
        <template v-for="item in type_margin.supply_margin">
          <a-tag
            @close.prevent="deleteMargin('supply', item.value)"
            @click="updateMargin('supply', item.value)"
            :closable="item.value !== type_margin_option.supply_margin_option"
            class="setting-tag"
            :style="item.value === type_margin_option.supply_margin_option ?
                {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
                {backgroundColor: '#fff'}"
          >{{ item.label }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.supply_input_visible" class="setting-input">
          <a-input type="text" placeholder="명" v-model:value="type_margin_name.supply_margin_name" />
          <a-input type="text" placeholder="값" v-model:value="type_margin_value.supply_margin_value" />
          <a-button @click="addMargin('supply')" type="primary">등록</a-button>
          <a-button @click="input_visible.supply_input_visible = false" class="ml5">취소</a-button>
        </div>
        <a-tag v-else class="setting-add" @click="input_visible.supply_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>

        <!--도움말-->
        <div class="setting-help">* 상품 수집 시 설정한 마진율로 공급가 가격이 계산됩니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="할인전가격">
        <!-- 등록된 마진률 -->
        <template v-for="item in type_margin.disp_margin">
          <a-tag
            @close.prevent="deleteMargin('disp', item.value)"
            @click="updateMargin('disp', item.value)"
            :closable="item.value !== type_margin_option.disp_margin_option"
            class="setting-tag"
            :style="item.value === type_margin_option.disp_margin_option ?
                {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
                {backgroundColor: '#fff'}"
          >{{ item.label }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.disp_input_visible" class="setting-input">
          <a-input type="text" placeholder="명" v-model:value="type_margin_name.disp_margin_name" />
          <a-input type="text" placeholder="값" v-model:value="type_margin_value.disp_margin_value" />
          <a-button @click="addMargin('disp')" type="primary">등록</a-button>
          <a-button @click="input_visible.disp_input_visible = false" class="ml5">취소</a-button>
        </div>
        <a-tag v-else class="setting-add" @click="input_visible.disp_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>

        <!--도움말-->
        <div class="setting-help">* 상품 수집 시 설정한 마진율로 할인전 가격이 계산됩니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="판매마진율">
        <!-- 등록된 마진률 -->
        <template v-for="item in type_margin.selling_margin">
          <a-tag
            @close.prevent="deleteMargin('selling', item.value)"
            @click="updateMargin('selling', item.value)"
            :closable="item.value !== type_margin_option.selling_margin_option"
            class="setting-tag"
            :style="item.value === type_margin_option.selling_margin_option ?
                {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
                {backgroundColor: '#fff'}">
            {{ item.label }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.selling_input_visible" class="setting-input">
          <a-input type="text" placeholder="명" v-model:value="type_margin_name.selling_margin_name" />
          <a-input type="text" placeholder="값" v-model:value="type_margin_value.selling_margin_value" />
          <a-button @click="addMargin('selling')" type="primary">등록</a-button>
          <a-button @click="input_visible.selling_input_visible = false" class="ml5">취소</a-button>
        </div>
        <a-tag v-else class="setting-add" @click="input_visible.selling_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>

        <!--도움말-->
        <div class="setting-help">* 상품 수집 시 설정한 마진율로 판매가 가격이 계산됩니다.</div>
      </a-descriptions-item>
    </a-descriptions>
    <div style="height: 20px;"></div>
    <a-descriptions title="환율 설정" bordered :column="{ xs: 1, sm: 1, md: 1}">
      <a-descriptions-item label="현재 환율">
        <div style="padding: 5px 0;">
          <a-tooltip>
            <a-tag color="blue">한국 KRW {{ rateKor }}</a-tag>
            <span style="margin: 0 7px 0 0"><SwapOutlined /></span>
            <a-tag>중국 RMB {{ rateCn }}</a-tag>
          </a-tooltip>
        </div>

        <!--도움말-->
        <div class="setting-help">* 오늘의 환율 입니다.</div>
      </a-descriptions-item>

      <a-descriptions-item label="등록 환률">
        <!-- 등록된 환률 -->
        <template v-for="item in type_margin.rate_margin">
          <a-tag
            @close.prevent="deleteMargin('rate', item.value)"
            @click="updateMargin('rate', item.value)"
            :closable="item.value !== type_margin_option.rate_margin_option"
            class="setting-tag"
            :style="item.value === type_margin_option.rate_margin_option ?
              {backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'} :
              {backgroundColor: '#fff'}"
          >{{ item.label }}
          </a-tag>
        </template>
        <!-- 등록버튼 -->
        <div v-if="input_visible.rate_input_visible" class="setting-input">
          <a-input type="text" placeholder="명" v-model:value="type_margin_name.rate_margin_name" />
          <a-input type="text" placeholder="값" v-model:value="type_margin_value.rate_margin_value" />
          <a-button @click="addMargin('rate')" type="primary">등록</a-button>
          <a-button @click="input_visible.rate_input_visible = false" class="ml5">취소</a-button>
        </div>
        <a-tag v-else class="setting-add" @click="input_visible.rate_input_visible = true">
          <PlusOutlined />
          등록
        </a-tag>

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
  PlusOutlined,
  SwapOutlined
} from "@ant-design/icons-vue";
import { onMounted, reactive, ref } from "vue";

// loading
const indicator = ref(false);
const cartLoading = ref(true);
const cartLoading2 = ref(true);

const userData = ref({});
const rateCn = ref(0);
const rateKor = ref(0);

const isAdmin = ref(Cookie.get("member_roles").split(",").includes("ROLE_ADMIN"));

const nowTime = ref(new Date().toLocaleDateString());

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
      alert(res.message);
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
  if (type_margin_option[type + '_margin_option'] === value) {
    return false;
  }

  let aOptions = type_margin[type + '_margin'];
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
      alert(res.message);
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
    alert("마진명은 필수로 입력해주십시오.");
    return false;
  }

  if (lib.isEmpty(type_margin_value[type + "_margin_value"])) {
    alert("마진값은 필수로 입력해주십시오.");
    return false;
  }

  let regPos = /^[0-9]+$/;
  if (!regPos.test(type_margin_value[type + "_margin_value"])) {
    alert("마진값은 숫자로 입력해주십시오.");
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
    alert("동일유형에 같은 값을 중복으로 등록할수없습니다.");
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
      alert(res.message);
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
        alert(res.message);
      }

      userData.value = res.data;
      ["wholesale", "supply", "selling", "disp", "rate"].map((field) => {
        initUserMargin(field);
      });

      cartLoading.value = false;
    }
  );
}

function getRate() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/getrate").then(
    (res) => {
      if (res.status !== "2000") {
        alert(res.message);
        return false;
      }

      rateCn.value = res.data.cn;
      rateKor.value = res.data.ko;

      cartLoading2.value = false;
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
.setting-tag {
  cursor: pointer;
  padding: 5px 10px;
  margin: 3px 6px 3px 0;
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
  width: 50px;
  margin-right: 5px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.setting-help {
  font-size: 12px;
  padding-top: 10px;
  color: #999;
}
</style>