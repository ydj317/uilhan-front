<template>
  <a-card title="주문관리">
    <div>
      <a-descriptions bordered :column="1" size="middle">
        <a-descriptions-item label="검색기간">
          <a-input-group compact>
            <a-space direction="vertical" :size="12">
              <a-range-picker v-model:value="state.tableData.params.paid_date" />
            </a-space>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문번호">
          <a-input-group compact style="display: flex;">
            <a-select v-model:value="state.tableData.params.order_type" style="width: 100px;">
              <a-select-option value="oid">주문번호</a-select-option>
              <a-select-option value="od_ix">주문상세번호(상품별)</a-select-option>
              <a-select-option value="co_oid">마켓 주문번호</a-select-option>
              <a-select-option value="co_od_ix">마켓 주문고유번호</a-select-option>
            </a-select>
            <a-input v-model:value="state.tableData.params.order_value" style="width: 300px;" />
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문자 수취인">
          <a-input-group compact>
            <a-input-group compact>
              <a-select v-model:value="state.tableData.params.orderer_type" style="width: 100px;">
                <a-select-option value="bname">주문자</a-select-option>
                <a-select-option value="rname">수취인</a-select-option>
              </a-select>
              <a-input v-model:value="state.tableData.params.orderer_value" style="width: 300px;" />
            </a-input-group>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문상태">
          <a-select ref="statusRef" v-model:value="state.tableData.params.status" mode="tags" placeholder="주문상태를 선택해주세요."
            @change="handleStatusChange" style="width: 657px;">
            <a-select-option v-for="option in state.orderStatus" :value="option.value">{{ option.label
            }}</a-select-option>
          </a-select>
        </a-descriptions-item>

      </a-descriptions>

      <div style="display: flex;justify-content: center;">
        <a-button type="primary" @click="getTableData" class="mt15">검색</a-button>
        <a-button @click="getTableData" class="ml15 mt15">초기화</a-button>
      </div>
    </div>
  </a-card>

  <a-card title="목록" class="mt15">
    <div class="mb15" style="display: flex;justify-content: space-between;">
      <div class="left-div">
      </div>
      <div class="right-div" style="display: flex;align-items: center;">
        <a-tooltip>
          <template #title>EXEL 다운로드</template>
          <a-button>
            <template #icon>
              <DownloadOutlined />
            </template>
          </a-button>
        </a-tooltip>

        <a-tooltip>
          <template #title>주문수집</template>
          <a-button class="ml10">
            <template #icon>
              <FileSyncOutlined />
            </template>
            주문수집
          </a-button>
        </a-tooltip>
      </div>
    </div>
    <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :row-selection="rowSelection"
      :pagination="false">
      <a-table-column title="마켓코드" dataIndex="marketCode" key="marketCode" />
      <a-table-column title="마켓ID" dataIndex="sellerId" key="sellerId" />
      <a-table-column title="노출상태" dataIndex="isUse" key="isUse">
        <template #customRender="scope, record, index">
          <a-switch v-model:checked="scope.record.isUse" @change="changeIsUse(scope.record)" :checkedValue="1"
            :unCheckedValue="0" checked-children="On" un-checked-children="Off" />
        </template>
      </a-table-column>
      <a-table-column title="등록일자" dataIndex="insDate" key="insDate">
        <template #customRender="scope, record, index">
          {{ scope.record.insDate.split('T')[0] }}
        </template>
      </a-table-column>
      <a-table-column title="관리" dataIndex="manage" key="manage">
        <template #customRender="scope, record, index">
          <RouterLink :to="`/market/accounts/register/${scope.record['id']}`">
            <a-button size="small">
              수정
            </a-button>
          </RouterLink>

          <!-- <a-popconfirm placement="leftBottom" ok-text="Yes" cancel-text="No"
                            @confirm="removeAccount(record['id'])" class="ml10">
                            <template #title>
                                <p>삭제 하시겠습니까?</p>
                            </template>
                            <a-button class="mt5" type="danger" size="small">
                                삭제
                            </a-button>
                        </a-popconfirm> -->
        </template>
      </a-table-column>
    </a-table>
    <a-pagination :total="state.tableData.total" :page-size="state.tableData.params.pageSize"
      :current="state.tableData.params.page" @change="pageChangeHandler" class="mt15" />
  </a-card>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useMarketOrderApi } from '@/api/order'
import { useMarketApi } from '@/api/market'
import { message } from 'ant-design-vue'
import { DownloadOutlined, FileSyncOutlined } from '@ant-design/icons-vue';

const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    params: {
      paid_date: '',
      order_type: 'oid',
      order_value: '',
      orderer_type: 'bname',
      orderer_value: '',
      market_code: '',
      shipping_box_id: '',
      order_id: '',
      page: 1,
      pageSize: 20,
    },
  },
  orderStatus: [],
});

// 주문 리스트
const getTableData = () => {

  useMarketOrderApi().getOrderList(state.tableData.params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }


    const { list, total } = res.data

    state.tableData.data = list;
    state.tableData.total = total;

  });
}


const getMarketStatusList = () => {
  useMarketApi().getMarketOrderStatusList({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    const statusObject = res.data;
    const options = Object.keys(res.data).map((item, index) => {
      console.log(item, index);
      return {
        label: statusObject[item],
        value: item,
      }
    })

    console.log(options);
    state.orderStatus = options;
  });
}


const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

const pageChangeHandler = (page) => {
  state.tableData.params.page = page;
  getTableList();
}

onMounted(() => {
  getMarketStatusList();
  getTableData()
})
</script>