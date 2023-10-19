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
      :pagination="false" :defaultExpandAllRows="true">
      <a-table-column title="마켓" dataIndex="id" key="id">
        <template #default="{ record }">
          <div style="display: flex;align-items: center;gap: 5px;" v-if="record.market_code">
            <img :src="getLogoSrc(record.market_code)" style="width: 18px;height: 18px;" />
            {{ record.seller_id }}
          </div>
        </template>
      </a-table-column>
      <a-table-column title="주문번호" dataIndex="order_no" key="order_no"></a-table-column>
      <a-table-column title="주문자" dataIndex="orderer_name" key="orderer_name" />
      <a-table-column title="연락처" dataIndex="orderer_name" key="orderer_name"></a-table-column>
      <a-table-column title="주문시간" dataIndex="ins_date" key="ins_date"></a-table-column>
      <a-table-column title="관리" dataIndex="manage" key="manage">
        <template #default="{ record }">
          <div style="display: grid;">
            <a-space>
              <RouterLink :to="`/order/info/${record['id']}`" v-if="record['id']">
                <a-button size="small">상세</a-button>
              </RouterLink>
              <a-button type="primary" size="small"
                v-if="!record['id'] && state.tableData.params.status === 'paid'">발주</a-button>
              <a-button type="success" size="small"
                v-if="!record['id'] && state.tableData.params.status === 'shippingAddress'">배송</a-button>
              <a-button size="small" v-if="!record['id'] && state.tableData.params.status === 'shipping'">추적</a-button>
            </a-space>
          </div>
        </template>
      </a-table-column>
      <template #expandedRowRender="{ record }" style="padding:0">
        <div>
          <a-table :data-source="record.orderItems" :pagination="false" size="small" :row-selection="rowItemSelection"
            :showHeader="true" style="padding: 0;" bordered>
            <a-table-column title="이미지" dataIndex="prd_image" key="prd_image">
              <template #default="{ record }">
                <a-image src="https://picsum.photos/200/300" style="width: 50px;height: 50px;border-radius: 5px;" />
              </template>
            </a-table-column>
            <a-table-column title="상품명" dataIndex="prd_name" key="prd_name" />
            <a-table-column title="옵션명" dataIndex="prd_option" key="prd_option" />
            <a-table-column title="수량" dataIndex="quantity" key="quantity" />
            <a-table-column title="단가" dataIndex="unit_price" key="unit_price" />
            <a-table-column title="운송장정보" dataIndex="invoice_number" key="invoice_number"
              v-if="state.tableData.params.status !== 'paid'">
              <template #default="{ record }">
                <div style="display: flex;flex-direction: column;gap: 5px;">
                  <a-select v-model="record.courier_name">
                    <a-select-option value="1">CJ대한통운</a-select-option>
                    <a-select-option value="2">우체국</a-select-option>
                  </a-select>
                  <a-input v-model:value="record.invoice_number" />
                </div>

              </template>
            </a-table-column>
            <a-table-column title="" dataIndex="command" key="command">
              <template #default="{ record }">
                <a-space>
                  <a-button type="primary" size="small">발주</a-button>
                  <a-button size="small" v-if="state.tableData.params.status === 'shippingAddress'">구매</a-button>
                  <a-button type="info" size="small"
                    v-if="state.tableData.params.status === 'shippingAddress'">배송</a-button>
                  <a-button size="small" v-if="state.tableData.params.status === 'shipping'">추적</a-button>
                </a-space>
              </template>
            </a-table-column>
          </a-table>
        </div>
      </template>
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
import { DownloadOutlined, FileSyncOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';


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

const rowItemSelection = ref({
  columnTitle: '선택',
  checkStrictly: false,
  selectedRowKeys: [],
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(selectedRows);
  },

});

const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    rowItemSelection.value.selectedRowKeys = selectedRows.flatMap(row => row.orderItems.map(item => item.key));
  },
});

const handleStatusChange = (e) => {
  getTableData()
}
const pageChangeHandler = (page) => {
  state.tableData.params.page = page;
  getTableData();
}

const getLogoSrc = (marketCode) => {
  try {
    return require(`../../assets/img/list/market-logo/${marketCode}.png`);
  } catch (error) {
    return "../../assets/img/temp_image.png"
  }
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