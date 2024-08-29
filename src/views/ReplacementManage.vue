<template>

  <div class="title">메세지치환 관리</div>

  <a-descriptions bordered :column="1" :labelStyle="{ height: '50px',width: '150px',textAlign: 'right' }" :contentStyle="{ height: '50px' }">
    <a-descriptions-item label="유형">
      <a-radio-group v-model:value="searchFrom.type">
        <a-radio v-for="(value, key) in typeSelect" :key="key" :value="key">{{ value }}</a-radio>
      </a-radio-group>
    </a-descriptions-item>

    <a-descriptions-item label="마켓">
      <a-checkbox v-model:checked="checkAll"
                  :indeterminate="indeterminate"
                  @change="onCheckAllChange">전체
      </a-checkbox>
      <a-divider type="vertical" class="mr15" style="border-color: #eee;" />
      <a-checkbox-group v-model:value="searchFrom.market" @change="onCheckMarketChange">
        <a-checkbox v-for="(value, key) in marketSelect" :key="key" :value="key">
          {{ value }}
        </a-checkbox>
      </a-checkbox-group>
    </a-descriptions-item>

    <a-descriptions-item label="번역조건">
      <a-input v-model:value="searchFrom.match" placeholder="검색어를 입력해 주세요" />
    </a-descriptions-item>

    <a-descriptions-item label="번역결과">
      <a-input v-model:value="searchFrom.replacement" placeholder="검색어를 입력해 주세요" />
    </a-descriptions-item>

    <a-descriptions-item label="생성시간">
      <a-space direction="vertical" :size="12">
        <a-range-picker size="middle" v-model:value="ins_date" @change="onChangeDatePicker" show-time />
      </a-space>
    </a-descriptions-item>

  </a-descriptions>

  <div class="mt20 mb20" style="display: flex; justify-content: center;">
    <a-button type="primary" @click="onPageChange(1, searchFrom.pageSize)">검색</a-button>
    <a-button class="ml15" @click="onReset()">초기화</a-button>
  </div>

  <a-card :loading="loading" :bodyStyle="loading ? {overflow: 'hidden'} : {padding: 0, overflow: 'hidden'}">
    <a-table :data-source="replacementList" :pagination="false">

      <a-table-column title="유형" :width="60" dataIndex="type" key="type">
        <template #customRender="{text}">
          {{ typeSelect[text] }}
        </template>
      </a-table-column>

      <a-table-column title="마켓" :width="160" dataIndex="market" key="market">
        <template #customRender="{text}">
          <img :src="getLogoSrc('market-logo', text)" alt="" style="width: 18px;border-radius: 50%;" class="mr5">
          {{ marketSelect[text] }}
        </template>
      </a-table-column>

      <a-table-column title="변역조건" dataIndex="match" key="match" />
      <a-table-column title="변역결과" dataIndex="replacement" key="replacement" />
      <a-table-column title="생성시간" :width="200" dataIndex="insDate" key="insDate" />
      <a-table-column title="변경시간" :width="200" dataIndex="updDate" key="updDate" />
    </a-table>
  </a-card>

  <a-pagination
    :disabled="loading"
    style="width: 100%;display: flex;justify-content: center;align-items: center;margin-top: 15px;"
    v-model:current="searchFrom.page"
    v-model:page-size="searchFrom.pageSize"
    show-size-changer
    @show-size-change="onChangeLimit"
    @change="onPageChange"
    :total="searchFrom.total"
    :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
  />

  <div style="height: 100px;"></div>

</template>

<script setup>
import {onMounted, ref, reactive} from "vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";

let loading = ref(true);

const typeSelect = ref(
  {
    product: '상품',
  }
);

let checkAll = ref(true);
let indeterminate = ref(false);
const marketSelect = ref(
  {
    smartstore: '스마트스토어',
    coupang: '쿠팡',
    interpark: '인터파크',
    lotteon: '롯데온',
    sk11st: '11번가',
    gmarket: 'G마켓',
    auction: '옥션',
  }
);

let ins_date = ref();
const searchFrom = reactive({
  type: 'product',
  market: Object.keys(marketSelect.value),
  match: '',
  replacement: '',
  ins_date: [],
  page: 1,
  pageSize: 10,
  total: 0,
});

let replacementList = ref([]);


const onCheckAllChange = e => {
  indeterminate.value = false;
  searchFrom.market = e.target.checked ? Object.keys(marketSelect.value) : [];
  onCheckMarketChange();
};

const onCheckMarketChange = () => {
  checkAll.value = searchFrom.market.length === Object.keys(marketSelect.value).length
  indeterminate.value = searchFrom.market.length > 0 && searchFrom.market.length < Object.keys(marketSelect.value).length
};

const getTableData = async () => {
  loading.value = true;
  await AuthRequest.get(process.env.VUE_APP_API_URL + '/api/replacement/list', {params: searchFrom}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      loading.value = false;
      return false;
    }

    replacementList.value = res.data.list;
    searchFrom.total = res.data.total;

  }).catch((e) => {
    message.error(e.message);
    return false
  }).finally(() => {
    loading.value = false;
  });
};

const onChangeDatePicker = (value, dateString) => {
  console.log('==0==')
  console.log(dateString)
  searchFrom.ins_date = [dateString[0], dateString[1]];
};

function onChangeLimit(current, pageSize) {
  searchFrom.page = 1
  searchFrom.pageSize = pageSize;
  getTableData();
}

const onPageChange = (page, pageSize) => {
  searchFrom.page = page;
  searchFrom.pageSize = pageSize;
  getTableData();
};

const onReset = () => {
  searchFrom.type = 'product'
  searchFrom.market = Object.keys(marketSelect.value)
  searchFrom.match = ''
  searchFrom.replacement = ''
  searchFrom.ins_date = []
  searchFrom.page = 1
  searchFrom.pageSize = 10
  searchFrom.total = 0
  checkAll.value = true
  indeterminate.value = false
  ins_date.value = ''
  getTableData();
};

const getLogoSrc = (fileName, marketCode) => {
  try {
    return require(`../assets/img/list/${fileName}/${marketCode}.png`);
  } catch (error) {
    return require("assets/img/temp_image.png");
  }
}

onMounted(() => {
  getTableData()
});

</script>

<style scoped>

.title {
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 10px;
}

</style>