<template>

  <div class="title">메세지치환 관리</div>

  <!--검색영역-->
  <a-descriptions bordered :column="1" :labelStyle="{ height: '50px',width: '150px',textAlign: 'right' }" :contentStyle="{ height: '50px' }">
    <a-descriptions-item label="유형">
      <a-radio-group v-model:value="searchFrom.type">
        <a-radio v-for="(value, key) in state.typeSelect" :key="key" :value="key">{{ value }}</a-radio>
      </a-radio-group>
    </a-descriptions-item>

    <a-descriptions-item label="마켓">
      <a-checkbox v-model:checked="state.marketCheckAll"
                  :indeterminate="state.marketIndeterminate"
                  @change="onmarketCheckAllChange">전체
      </a-checkbox>
      <a-divider type="vertical" class="mr15" style="border-color: #eee;" />
      <a-checkbox-group v-model:value="searchFrom.market" @change="onCheckMarketChange">
        <a-checkbox v-for="(value, key) in state.marketSelect" :key="key" :value="key">
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
        <a-range-picker size="middle" v-model:value="state.ins_date" @change="onChangeDatePicker" />
      </a-space>
    </a-descriptions-item>

  </a-descriptions>

  <!--검색버튼-->
  <div class="mt20 mb20" style="display: flex; justify-content: center;">
    <a-button type="primary" @click="onPageChange(1, searchFrom.pageSize)">검색</a-button>
    <a-button class="ml15" @click="onReset()">초기화</a-button>
  </div>

  <!--테이블-->
  <a-card :loading="state.loading" :bodyStyle="state.loading ? {overflow: 'hidden'} : {padding: 0, overflow: 'hidden'}">
    <a-table :data-source="state.replacementList" :pagination="false"
             :row-selection="{ selectedRowKeys: state.listSelectedRowKeys, onChange: onListSelectChange }">

      <a-table-column title="유형" :width="60" dataIndex="type" key="type">
        <template #customRender="{text}">
          {{ state.typeSelect[text] }}
        </template>
      </a-table-column>

      <a-table-column title="마켓" :width="160" dataIndex="market" key="market">
        <template #customRender="{text}">
          <img :src="getLogoSrc('market-logo', text)" alt="" style="width: 18px;border-radius: 50%;" class="mr5">
          {{ state.marketSelect[text] }}
        </template>
      </a-table-column>

      <a-table-column title="변역조건" dataIndex="match" key="match">
        <template #customRender="{record}">
          <a-input v-model:value="record.match" />
          <a-tooltip placement="top">
            <template #title>
              <span>prompt text</span>
            </template>
            <div style="display: inline-block; cursor: pointer;">{{ record.match }}</div>
          </a-tooltip>
        </template>
      </a-table-column>

      <a-table-column title="변역결과" dataIndex="replacement" key="replacement">
        <template #customRender="{record}">
          <a-tooltip placement="top">
            <template #title>
              <span>prompt text</span>
            </template>
            <div>{{ record.replacement }}</div>
          </a-tooltip>
        </template>
      </a-table-column>

      <a-table-column title="사용여부" :width="120" dataIndex="isUse" key="is_use">
        <template #customRender="{record}">
          <a-switch v-model:checked="record.isUse" :disabled="state.updateLoading" @change="setUpdateData(record.id, {isUse: record.isUse})" checked-children="사용중" un-checked-children="사용안함" />
        </template>
      </a-table-column>

      <a-table-column title="생성시간" :width="200" dataIndex="insDate" key="insDate" />
      <a-table-column title="변경시간" :width="200" dataIndex="updDate" key="updDate" />

      <a-table-column title="액션" :width="70" dataIndex="id" key="action">
        <template #customRender="{text}">
          <a-button type="primary" size="small" class="mlr5" @click="onRemove(text)">삭제</a-button>
        </template>
      </a-table-column>
    </a-table>
  </a-card>

  <!--페이지-->
  <a-pagination
    :disabled="state.loading"
    style="width: 100%;display: flex;justify-content: center;align-items: center;margin-top: 15px;"
    v-model:current="searchFrom.page"
    v-model:page-size="searchFrom.pageSize"
    show-size-changer
    @show-size-change="onChangePage"
    @change="onPageChange"
    :total="searchFrom.total"
    :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
  />

  <div style="height: 100px;"></div>

</template>

<script setup>
import {onMounted, reactive} from "vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";

const state = reactive({
  loading: true,
  updateLoading: false,
  marketCheckAll: true,
  marketIndeterminate: false,
  ins_date: [],
  typeSelect:
    {
      product: '상품',
    },
  marketSelect:
    {
      smartstore: '스마트스토어',
      coupang: '쿠팡',
      interpark: '인터파크',
      lotteon: '롯데온',
      sk11st: '11번가',
      gmarket: 'G마켓',
      auction: '옥션',
    },
  replacementList: [],
  listSelectedRowKeys: [],
});

const searchFrom = reactive({
  type: 'product',
  market: Object.keys(state.marketSelect),
  match: '',
  replacement: '',
  is_use: '',
  ins_date: [],
  page: 1,
  pageSize: 10,
  total: 0,
});


const onmarketCheckAllChange = e => {
  state.marketIndeterminate = false;
  searchFrom.market = e.target.checked ? Object.keys(state.marketSelect) : [];
  onCheckMarketChange();
};

const onCheckMarketChange = () => {
  state.marketCheckAll = searchFrom.market.length === Object.keys(state.marketSelect).length
  state.marketIndeterminate = searchFrom.market.length > 0 && searchFrom.market.length < Object.keys(state.marketSelect).length
};

const getTableData = async () => {
  state.loading = true;
  await AuthRequest.get(process.env.VUE_APP_API_URL + '/api/replacement/list', {params: searchFrom}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message)
      state.loading = false
      return false
    }

    state.replacementList = res.data.list.map(item => ({
      ...item,
      key: item.id,
    }));

    searchFrom.total = res.data.total

  }).catch((e) => {
    message.error(e.message)
    state.loading = false
  }).finally(() => {
    state.loading = false
  });
};

const setUpdateData = async (targetId, updateData) => {
  state.updateLoading = true

  await AuthRequest.post(process.env.VUE_APP_API_URL + '/api/replacement/update', {id: targetId, updateData}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message)
      state.updateLoading = false
      return false
    }

    const index = state.replacementList.findIndex(item => item.id === targetId);
    if (index !== -1) {
      state.replacementList.splice(index, 1, { ...state.replacementList[index], ...updateData });
    }

    state.updateLoading = false
  }).catch((e) => {
    message.error(e.message)
    state.updateLoading = false
  }).finally(() => {
    state.updateLoading = false
  });
};


const onListSelectChange = (selectedRowKeys) => {
  state.listSelectedRowKeys = selectedRowKeys;
};

const onChangeDatePicker = (value, dateString) => {
  searchFrom.ins_date = [dateString[0] + ' 00:00:00', dateString[1] + ' 23:59:59'];
};

function onChangePage(current, pageSize) {
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
  searchFrom.market = Object.keys(state.marketSelect)
  searchFrom.match = ''
  searchFrom.replacement = ''
  searchFrom.ins_date = []
  searchFrom.page = 1
  searchFrom.pageSize = 10
  searchFrom.total = 0
  state.marketCheckAll = true
  state.marketIndeterminate = false
  state.ins_date = []
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