<template>

  <div class="title">메세지치환 관리</div>

  <!--검색영역-->
  <a-descriptions bordered :column="1" :labelStyle="{ height: '50px',width: '150px',textAlign: 'right' }" :contentStyle="{ height: '50px' }">
    <a-descriptions-item label="유형">
      <a-radio-group v-model:value="searchFrom.type">
        <a-radio v-for="(value, key) in state.selectType" :key="key" :value="key">{{ value }}</a-radio>
      </a-radio-group>
    </a-descriptions-item>

    <a-descriptions-item label="마켓">
      <a-checkbox v-model:checked="state.marketCheckAll"
                  :indeterminate="state.marketIndeterminate"
                  @change="onmarketCheckAllChange">전체
      </a-checkbox>
      <a-divider type="vertical" class="mr15" style="border-color: #eee;" />
      <a-checkbox-group v-model:value="searchFrom.market" @change="onCheckMarketChange">
        <a-checkbox v-for="(value, key) in state.selectMarket" :key="key" :value="key">
          {{ value }}
        </a-checkbox>
      </a-checkbox-group>
    </a-descriptions-item>

    <a-descriptions-item label="치환조건">
      <a-input v-model:value="searchFrom.matcher" placeholder="검색어를 입력해 주세요" />
    </a-descriptions-item>

    <a-descriptions-item label="치환결과">
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

  <!--조작버튼-->
  <div class="mb10">
    <!--삭제-->
    <a-button type="primary" @click="onRemoveOpen()">선택삭제</a-button>
    <a-modal v-model:open="state.removeOpen" :confirm-loading="state.updateLoading" ok-text="섹제" cancel-text="취소" @ok="onRemove()">
      <template #title>
        <ExclamationCircleOutlined/>
        선택한내용 삭제 하시겠습니까?
      </template>
    </a-modal>

    <!--등록-->
    <a-button class="ml10" @click="state.registerOpen = true">새로등록</a-button>
    <a-modal v-model:open="state.registerOpen" :confirm-loading="state.updateLoading"
             title="메세지치환 등록" :ok-button-props="{ style: { display: 'none' } }"
             :cancel-button-props="{ style: { display: 'none' } }">
      <a-form :model="state.registerForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" @finish="onRegister()" class="mt20">
        <a-form-item label="유형" name="type">
          <a-radio-group v-model:value="state.registerForm.type">
            <a-radio v-for="(value, key) in state.selectType" :key="key" :value="key" >{{ value }}</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="마켓" name="market">
          <a-select v-model:value="state.registerForm.market" style="width: 160px;">
            <a-select-option v-for="(value, key) in state.selectMarket" :value="key">
              <img :src="getLogoSrc('market-logo', key)" alt="" style="width: 18px; border-radius: 50%;" class="mr5">
              {{ value }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="치환조건" name="matcher" :rules="[
          { required: true, message: '필수 입력입니다.' },
          { max: 255, message: '최대 255자까지 입력 가능합니다.' }]" >
          <a-input v-model:value="state.registerForm.matcher" />
        </a-form-item>

        <a-form-item label="치환결과" name="replacement" :rules="[
          { required: true, message: '필수 입력입니다.' },
          { max: 255, message: '최대 255자까지 입력 가능합니다.' }]" >
          <a-input v-model:value="state.registerForm.replacement" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit" :loading="state.updateLoading">새로등록</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

  <!--테이블-->
  <a-card :loading="state.loading" :bodyStyle="state.loading ? {overflow: 'hidden'} : {padding: 0, overflow: 'hidden'}">
    <a-spin size="large" :spinning="state.updateLoading">
      <a-table :data-source="state.replacementList" :pagination="false"
             :row-selection="{ selectedRowKeys: state.listSelectedRowKeys, onChange: onListSelectChange }">
        <template #headerCell="{ column }">
          <template v-if="column.key === 'matcher'">
            <span>
              {{ column.title }}
              <a-tooltip class="ml5">
                <template #title>
                  <div>1. 메세지내용에 치환조건 문구가 포함되면 치환결과 메세지로 노출됩니다.</div>
                  <div>2. 특정부호 {*} 로 정규일치(正则匹配)가능합니다.</div>
                </template>
                <QuestionCircleOutlined/>
              </a-tooltip>
            </span>
          </template>

          <template v-if="column.key === 'replacement'">
            <span>
              {{ column.title }}
              <a-tooltip class="ml5">
                <template #title>
                  <div>최종 노출메세지 입니다.</div>
                </template>
                <QuestionCircleOutlined/>
              </a-tooltip>
            </span>
          </template>
        </template>

      <a-table-column title="유형" :width="100" dataIndex="type" key="type">
        <template #customRender="{record}">
          <a-tooltip placement="top">
            <template #title>
              <span>선택하면 저장됩니다</span>
            </template>
            <a-select v-model:value="record.type" style="width: 70px;"
                      @change="setUpdateData(record.id, {type: record.type});">
              <a-select-option v-for="(value, key) in state.selectType" :value="key">
                {{ value }}
              </a-select-option>
            </a-select>
          </a-tooltip>
        </template>
      </a-table-column>

      <a-table-column title="마켓" :width="190" dataIndex="market" key="market">
        <template #customRender="{record}">
          <a-tooltip placement="top">
            <template #title>
              <span>선택하면 저장됩니다</span>
            </template>
            <a-select v-model:value="record.market" style="width: 160px;"
                      @change="setUpdateData(record.id, {market: record.market});">
              <a-select-option v-for="(value, key) in state.selectMarket" :value="key">
                <img :src="getLogoSrc('market-logo', key)" alt="" style="width: 18px; border-radius: 50%;" class="mr5">
                {{ value }}
              </a-select-option>
            </a-select>
          </a-tooltip>
        </template>
      </a-table-column>

      <a-table-column title="치환조건" dataIndex="matcher" key="matcher">
        <template #customRender="{record}">
          <a-tooltip placement="top" v-if="!record.matcherShow" @click="record.matcherShow = true">
            <template #title>
              <span>클릭하여 수정하세요</span>
            </template>
            <div style="cursor: pointer;">
              {{ record.matcher }}
            </div>
          </a-tooltip>
          <a-tooltip placement="top" v-else>
            <template #title>
              <span>Enter 눌러 저장(최대 255자 입력)</span>
            </template>
          <a-input-search v-model:value="record.matcher" maxlength="255" enter-button="저장"
                   @search="setUpdateData(record.id, {matcher: record.matcher.trim()}); record.matcherShow = false" />
          </a-tooltip>
        </template>
      </a-table-column>

      <a-table-column title="치환결과" dataIndex="replacement" key="replacement">
        <template #customRender="{record}">
          <a-tooltip placement="top" v-if="!record.replacementShow" @click="record.replacementShow = true">
            <template #title>
              <span>클릭하여 수정하세요</span>
            </template>
            <div style="cursor: pointer;">
              {{ record.replacement }}
            </div>
          </a-tooltip>
          <a-tooltip placement="top" v-else>
            <template #title>
              <span>Enter 눌러 저장(최대 255자 입력)</span>
            </template>
            <a-input-search v-model:value="record.replacement" maxlength="255" enter-button="저장"
                     @search="setUpdateData(record.id, {replacement: record.replacement.trim()}); record.replacementShow = false" />
          </a-tooltip>
        </template>
      </a-table-column>

      <a-table-column title="사용여부" :width="120" dataIndex="isUse" key="isUse">
        <template #customRender="{record}">
          <a-switch v-model:checked="record.isUse" @change="setUpdateData(record.id, {isUse: record.isUse})" checked-children="사용중" un-checked-children="사용안함" />
        </template>
      </a-table-column>

      <a-table-column title="생성시간" :width="200" dataIndex="insDate" key="insDate" >
        <template #customRender="{record}">
          {{ record.insDate }}
          <div style="color: #999; font-size: 12px;">변경( {{ record.updDate }} )</div>
        </template>
      </a-table-column>
    </a-table>
    </a-spin>
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
import {QuestionCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import {AuthRequest} from "@/util/request";
import {message} from "ant-design-vue";

const state = reactive({
  loading: true,
  updateLoading: false,
  marketCheckAll: true,
  marketIndeterminate: false,
  ins_date: [],
  selectType:
    {
      product: '상품',
    },
  selectMarket:
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
  registerForm: {
    type: 'product',
    market: 'smartstore',
    matcher: '',
    replacement: '',
  },
});

const searchFrom = reactive({
  type: 'product',
  market: Object.keys(state.selectMarket),
  matcher: '',
  replacement: '',
  is_use: '',
  ins_date: [],
  page: 1,
  pageSize: 10,
  total: 0,
});


const onmarketCheckAllChange = e => {
  state.marketIndeterminate = false;
  searchFrom.market = e.target.checked ? Object.keys(state.selectMarket) : [];
  onCheckMarketChange();
};

const onCheckMarketChange = () => {
  state.marketCheckAll = searchFrom.market.length === Object.keys(state.selectMarket).length
  state.marketIndeterminate = searchFrom.market.length > 0 && searchFrom.market.length < Object.keys(state.selectMarket).length
};

const getTableData = async () => {
  state.loading = true;
  await AuthRequest.get(process.env.VUE_APP_API_URL + '/api/replacement/list', {params: searchFrom}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message)
      state.replacementList = []
      return false
    }

    state.replacementList = res.data.list.map(item => ({
      ...item,
      key: item.id,
    }));

    searchFrom.total = res.data.total
  }).catch((e) => {
    message.error(e.message)
    state.replacementList = []
  }).finally(() => {
    state.loading = false
  });
};

const setUpdateData = async (targetId, updateData) => {
  state.updateLoading = true

  await AuthRequest.post(process.env.VUE_APP_API_URL + '/api/replacement/update', {id: targetId, updateData}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message)
      getTableData()
      return false
    }

  }).catch((e) => {
    message.error(e.message)
    getTableData()
  }).finally(() => {
    state.updateLoading = false
  });
};

const onRegister = async () => {
  state.updateLoading = true

  state.registerForm.matcher = state.registerForm.matcher.trim()
  state.registerForm.replacement = state.registerForm.replacement.trim()

  await AuthRequest.post(process.env.VUE_APP_API_URL + '/api/replacement/register', state.registerForm).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message)
      return false
    }

    state.registerForm = {
      type: 'product',
      market: 'smartstore',
      matcher: '',
      replacement: '',
    }

    getTableData()
  }).catch((e) => {
    message.error(e.message)
  }).finally(() => {
    state.updateLoading = false
    state.registerOpen = false
  });
}

const onRemoveOpen = () => {
  if (state.listSelectedRowKeys.length < 1) {
    message.error('삭제할 내용을 선택해주세요')
    return
  }

  state.removeOpen = true
}

const onRemove = async () => {
  state.updateLoading = true

  await AuthRequest.post(process.env.VUE_APP_API_URL + '/api/replacement/remove', {id: state.listSelectedRowKeys}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message)
      return false
    }

    getTableData()
  }).catch((e) => {
    message.error(e.message)
  }).finally(() => {
    state.updateLoading = false
    state.removeOpen = false
  });
}

const onListSelectChange = (selectedRowKeys) => {
  state.listSelectedRowKeys = selectedRowKeys
};

const onChangeDatePicker = (value, dateString) => {
  searchFrom.ins_date = [dateString[0] + ' 00:00:00', dateString[1] + ' 23:59:59']
};

function onChangePage(current, pageSize) {
  searchFrom.page = 1
  searchFrom.pageSize = pageSize
  getTableData()
}

const onPageChange = (page, pageSize) => {
  searchFrom.page = page
  searchFrom.pageSize = pageSize
  getTableData()
};

const onReset = () => {
  searchFrom.type = 'product'
  searchFrom.market = Object.keys(state.selectMarket)
  searchFrom.matcher = ''
  searchFrom.replacement = ''
  searchFrom.ins_date = []
  searchFrom.page = 1
  searchFrom.pageSize = 10
  searchFrom.total = 0
  state.marketCheckAll = true
  state.marketIndeterminate = false
  state.ins_date = []
  getTableData()
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