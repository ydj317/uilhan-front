<template>
  <a-card title="주문관리">
    <template #extra>
      <a-button class="ml10">
        <template #icon>
          <FileSyncOutlined />
        </template>
        주문수집
      </a-button>
    </template>
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
          <a-radio-group v-model:value="state.tableData.params.status" button-style="solid" @change="handleStatusChange">
            <a-radio-button v-for="option in state.orderStatus" :value="option.value">{{ option.label
            }}</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>

      </a-descriptions>

      <div style="display: flex;justify-content: center;">
        <a-button type="primary" @click="getTableData" class="mt15">검색</a-button>
        <a-button @click="getTableData" class="ml15 mt15">초기화</a-button>
      </div>
    </div>
  </a-card>

  <a-card class="mt15">

    <div class="mb15" style="display: flex;justify-content: space-between;">
      <div class="left-div">
        <a-space>
          <a-button @click="getTableData" v-if="state.tableData.params.status === 'paid'">
            <template #icon>
              <DownloadOutlined />
            </template>
            발주처리
          </a-button>
        </a-space>
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
      </div>
    </div>

    <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :row-selection="rowSelection"
      :pagination="false">
      <a-table-column title="마켓" dataIndex="id" key="id" />
      <a-table-column title="주문번호" dataIndex="order_id" key="order_id" />
      <a-table-column title="상품번호" dataIndex="prd_code" key="prd_code"></a-table-column>
      <a-table-column title="상품명/옵션명" dataIndex="items" key="items">
        <template #default="{ record }">
          <div style="display: grid;">
            <a-space>
              <div>
                <div>{{ record.prd_name }}</div>
                <div>{{ record.prd_option }}</div>
                <div>{{ record.prd_option }}</div>
                <div>{{ record.prd_option }}</div>
              </div>
            </a-space>
            <a-space>
              <div>
                <div>{{ record.prd_name }}</div>
                <div>{{ record.prd_option }}</div>
              </div>
            </a-space>
          </div>
        </template>

      </a-table-column>
      <a-table-column title="판매가" dataIndex="unit_price" key="unit_price"></a-table-column>
      <a-table-column title="수량" dataIndex="quantity" key="quantity"></a-table-column>
      <a-table-column title="결제액" dataIndex="unit_price" key="unit_price"></a-table-column>
      <a-table-column title="주문자" dataIndex="orderer_name" key="orderer_name"></a-table-column>
      <a-table-column title="관리" dataIndex="manage" key="manage">
        <template #default="{ record }">
          <div style="display: grid;">
            <a-space>
              <RouterLink :to="`/order/info/${record['id']}`">
                <a-button size="small">상세</a-button>
              </RouterLink>
              <a-button size="small" v-if="state.tableData.params.status === 'paid'">발주</a-button>
              <a-button size="small" v-if="state.tableData.params.status === 'shippingAddress'">배송</a-button>
              <a-button size="small" v-if="state.tableData.params.status === 'shippingAddress'">구매</a-button>
              <a-button size="small"
                v-if="state.tableData.params.status === 'shipping' || state.tableData.params.status === 'shippingComplete'">추적</a-button>

            </a-space>
          </div>
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
      paid_date: [],
      order_type: 'oid',
      order_value: '',
      orderer_type: 'bname',
      orderer_value: '',
      market_code: '',
      status: 'paid',
      page: 1,
      pageSize: 20,
    },
  },
  tabActive: 'paid',
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
      return {
        label: statusObject[item],
        value: item,
      }
    })

    state.orderStatus = options;
  });
}


const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

const handleStatusChange = (e) => {
  getTableData()
}
const pageChangeHandler = (page) => {
  state.tableData.params.page = page;
  getTableData();
}

onMounted(() => {
  getMarketStatusList();
  getTableData()
})
</script>

<style scoped>
.order_status {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  cursor: pointer;
  border-radius: 0.5rem;
  border: 1px solid rgb(0 0 0 / 0.1);
  transition: all 0.3s ease-in-out;
}

.order_status:hover {
  /** box shadow */
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.order_status.active {
  background: linear-gradient(to bottom right, #359bfa, #1890ff);
  color: white;
  border-style: none;
}

.order_status.active:hover {
  /** box shadow */
  color: white;
  background: linear-gradient(to bottom right, #3885f8, #1e44ff);
}
</style>