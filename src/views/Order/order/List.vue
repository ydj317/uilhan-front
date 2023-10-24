<template>
  <a-card title="주문관리">
    <template #extra v-if="false">
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
              <a-range-picker v-model:value="state.tableData.params.paid_date" :showTime="false" picker="date" />
            </a-space>
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문번호">
          <a-input-group compact style="display: flex;">
            <a-select v-model:value="state.tableData.params.order_type" style="width: 100px;">
              <a-select-option value="oid">주문번호</a-select-option>
            </a-select>
            <a-input v-model:value="state.tableData.params.order_value" style="width: 300px;" allowClear />
          </a-input-group>
        </a-descriptions-item>
        <a-descriptions-item label="주문자 수취인">
          <a-input-group compact>
            <a-input-group compact>
              <a-select v-model:value="state.tableData.params.orderer_type" style="width: 100px;">
                <a-select-option value="bname">주문자</a-select-option>
                <a-select-option value="rname">수취인</a-select-option>
              </a-select>
              <a-input v-model:value="state.tableData.params.orderer_value" style="width: 300px;" allowClear />
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
          <a-button @click="receiverOrderSelected" v-if="state.tableData.params.status === 'paid'">
            <template #icon>
              <ContainerOutlined />
            </template>
            발주처리
          </a-button>
        </a-space>
      </div>
      <div class="right-div" style="display: flex;align-items: center;">
        <a-tooltip>
          <template #title>EXCEL 다운로드</template>
          <a-button @click="excelDownload">
            <template #icon>
              <DownloadOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :row-selection="rowSelection"
      :pagination="false" :defaultExpandAllRows="true">
      <a-table-column :width="200" title="마켓" dataIndex="id" key="id">
        <template #default="{ record }">
          <div style="display: flex;align-items: center;gap: 5px;" v-if="record.market_code">
            <img :src="getLogoSrc(record.market_code)" style="width: 18px;height: 18px;" />
            {{ record.seller_id }}
          </div>
        </template>
      </a-table-column>
      <a-table-column :width="200" title="주문번호" dataIndex="order_no" key="order_no" />
      <a-table-column title="주문자" dataIndex="orderer_name" key="orderer_name" />
      <a-table-column :width="300" title="주문시간" dataIndex="order_date" key="order_date" />
      <a-table-column :width="300" title="수집시간" dataIndex="ins_date" key="ins_date">
        <template #default="{ record }">
          <span style="display: block;">{{ record['ins_date'] }}</span>
          <span style="display: block; font-size: 13px; color: #999">( {{ record['upd_date'] }} )</span>
        </template>
      </a-table-column>
      <a-table-column :width="200" title="관리" dataIndex="manage" key="manage">
        <template #default="{ record }">
          <div style="display: grid;">
            <a-space>
              <RouterLink :to="`/order/info/${record['id']}`" v-if="record['id']">
                <a-button size="small">상세</a-button>
              </RouterLink>
              <a-button type="primary" size="small" @click="openMarketAdminPage(record.market_code)">마켓바로가기</a-button>
              <a-button type="primary" size="small"
                v-if="!record['id'] && state.tableData.params.status === 'paid'">발주</a-button>
              <a-button type="success" size="small"
                v-if="!record['id'] && state.tableData.params.status === 'shippingAddress'">배송</a-button>
              <a-button size="small" v-if="!record['id'] && state.tableData.params.status === 'shipping'">추적</a-button>
            </a-space>
          </div>
        </template>
      </a-table-column>
      <template #expandedRowRender="scoped" style="padding:0">
        <div>
          <a-table :data-source="scoped.record.orderItems" :pagination="false" size="small"
            :row-selection="rowItemSelection" :showHeader="true" style="padding: 0;" bordered>
            <a-table-column :width="50" title="이미지" dataIndex="prd_image" key="prd_image">
              <template #default="{ record }">
                <a-image :src="record.prd_image"
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                  style="width: 50px;height: 50px;border-radius: 5px;" />
              </template>
            </a-table-column>
            <a-table-column title="상품명" dataIndex="prd_name" key="prd_name" />
            <a-table-column :width="300" title="옵션명" dataIndex="prd_option_name" key="prd_option_name" />
            <a-table-column :width="100" title="수량" dataIndex="quantity" key="quantity">
              <template #default="{ record }">
                {{ record['quantity'] - record['claim_quantity'] }}
                <span style="display: block; color: red;">(반품: {{ record['claim_quantity'] }})</span>
              </template>
            </a-table-column>
            <a-table-column :width="100" title="단가" dataIndex="unit_price" key="unit_price" />
            <a-table-column :width="100" title="합계">
              <template #default="{ record }">
                {{ (record['quantity'] - record['claim_quantity']) * record['unit_price'] }}
              </template>
            </a-table-column>
            <a-table-column :width="200" title="운송장정보" dataIndex="invoice_number" key="invoice_number"
              v-if="state.tableData.params.status !== 'paid'">
              <template #default="{ record }">
                <div style="display: flex;flex-direction: column;gap: 5px;"
                  v-if="state.tableData.params.status === 'shippingAddress'">
                  <a-select v-model:value="state.courierNameValues[record.id]" placeholder="택배사를 선택해주세요.">
                    <a-select-option :value="key" :key="key"
                      v-for="(company, key) in state.marketDeliveryCompany[scoped.record.market_code]">{{
                        company
                      }}</a-select-option>
                  </a-select>
                  <a-input v-model:value="state.invoiceNumberValues[record.id]" />
                </div>
                <div v-else>
                  {{ record.courier_name }} - {{ record.invoice_number }}
                </div>

              </template>
            </a-table-column>
            <a-table-column :width="200" title="상태변경시간" dataIndex="item_last_date" key="item_last_date"></a-table-column>
            <a-table-column :width="100" title="" dataIndex="command" key="command">
              <template #default="{ record }">
                <a-space>
                  <a-button type="primary" size="small" v-if="state.tableData.params.status === 'paid'"
                    @click="receiverOneOrder(scoped.record, record)">발주</a-button>
                  <a-button size="small" v-if="state.tableData.params.status === 'shippingAddress'">구매</a-button>
                  <a-button type="info" size="small" v-if="state.tableData.params.status === 'shippingAddress'"
                    @click="deliveryOrder(scoped.record, record)">배송</a-button>
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
import table2excel from 'js-table2excel';
import { message } from 'ant-design-vue'
import { DownloadOutlined, FileSyncOutlined, PlusOutlined, ContainerOutlined } from '@ant-design/icons-vue';


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
  courierNameValues: {},
  invoiceNumberValues: {},
  marketDeliveryCompany: {},
});

// 주문 리스트
const getTableData = () => {
  state.tableData.loading = true;
  useMarketOrderApi().getOrderList(state.tableData.params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.tableData.loading = false;
      return false;
    }

    const { list, total } = res.data

    state.tableData.data = list;
    state.tableData.total = total;
    state.tableData.loading = false;
  });
}

// 주문 상태 리스트
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

// 상품 선택
const rowItemSelection = ref({
  columnTitle: '선택',
  checkStrictly: false,
  selectedRowKeys: [],
  selectedRowKeysTemp: [],
  onChange: (selectedRowKeys, selectedRows) => {
    rowSelection.value.selectedRowKeys = selectedRows.map(row => row.order_id);
    rowItemSelection.value.selectedRowKeys = selectedRowKeys;
    rowItemSelection.value.selectedRowKeysTemp = selectedRows.flatMap(row => {
      return {
        order_no: row.order_no,
        account_id: row.account_id,
        shipping_box_id: row.shipping_box_id || row.order_no,
        item_no: row.item_no,
      };
    });
  },
});

// 주문 선택
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    rowSelection.value.selectedRowKeys = selectedRows.map(row => row.key);
    rowItemSelection.value.selectedRowKeys = selectedRows.flatMap(row => row.orderItems.map(item => item.key));
    rowItemSelection.value.selectedRowKeysTemp = selectedRows.flatMap(row => row.orderItems.map(item => {
      return {
        order_no: row.order_no,
        account_id: row.account_id,
        shipping_box_id: item.shipping_box_id || row.order_no,
        item_no: item.item_no,
      };
    }));
  },
});

const handleStatusChange = (e) => {
  if (state.tableData.params.status === 'shippingAddress') {
    getMarketDeliveryCompany();
  }
  getTableData()
}
const pageChangeHandler = (page) => {
  state.tableData.params.page = page;
  getTableData();
}

// 로고 이미지
const getLogoSrc = (marketCode) => {
  try {
    return require(`../../../assets/img/list/market-logo/${marketCode}.png`);
  } catch (error) {
    return "../../../assets/img/temp_image.png"
  }
}

/**
 * 선택발주처리
 */
const receiverOrderSelected = () => {

  const selectedItemRowKeys = rowItemSelection.value.selectedRowKeysTemp;
  if (selectedItemRowKeys.length === 0) {
    message.error('발주처리할 주문을 선택해주세요.');
    return false;
  }

  const selectedOrders = {};
  selectedItemRowKeys.forEach(item => {
    // 이미 존재하는 주문
    if (selectedOrders[item.account_id]) {
      // 이미 존재하는 주문번호
      if (selectedOrders[item.account_id][item.order_no]) {
        selectedOrders[item.account_id][item.order_no].items.push(item.item_no);
        return;
      }

      // 존재하지 않는 주문번호
      selectedOrders[item.account_id] = Object.assign(selectedOrders[item.account_id], {
        [item.order_no]: {
          order_no: item.order_no,
          account_id: item.account_id,
          shipping_box_id: item.shipping_box_id,
          items: [item.item_no],
        }
      })
      return;
    } else {
      // 존재하지 않는 주문
      selectedOrders[item.account_id] = {
        [item.order_no]: {
          order_no: item.order_no,
          account_id: item.account_id,
          shipping_box_id: item.shipping_box_id,
          items: [item.item_no],
        }
      }
    }

  });
  receiverOrderApi(selectedOrders);

}

// 발주처리
const receiverOrderApi = (order) => {
  useMarketOrderApi().receiverOrder({
    order
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    message.success('발주처리가 완료되었습니다.');
  });
}

const receiverOneOrder = (orders, item) => {
  const order = {};
  order[orders.account_id] = {
    [orders.order_no]: {
      order_no: orders.order_no,
      account_id: orders.account_id,
      shipping_box_id: orders.shipping_box_id,
      items: [item.item_no],
    }
  }

  receiverOrderApi(order);
}

// 배송처리
const deliveryOrder = (order, item) => {

  if (!state.courierNameValues[item.id]) {
    message.error('택배사를 선택해주세요.');
    return false;
  }

  if (!state.invoiceNumberValues[item.id]) {
    message.error('운송장번호를 입력해주세요.');
    return false;
  }

  useMarketOrderApi().deliveryOrder({
    accountId: order.account_id,
    orderId: order.id,
    itemId: item.id,
    courierName: state.courierNameValues[item.id],
    invoiceNumber: state.invoiceNumberValues[item.id]
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    message.success('배송처리가 완료되었습니다.');
  });
}

const openMarketAdminPage = (marketCode) => {
  const url = state.marketAdminUrls[marketCode]['order'];
  if (!url) {
    message.error("마켓 관리자 페이지가 등록되지 않았습니다.");
    return false;
  }

  window.open(url);
}

const getMarketAdminUrls = () => {
  useMarketApi().getMarketAdminUrls({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.marketAdminUrls = res.data;
  });
}

const getMarketDeliveryCompany = () => {
  useMarketApi().getMarketDeliveryCompany({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.marketDeliveryCompany = res.data;
  });
}


const excelDownload = () => {
  const header = [
    { title: '주문번호', key: 'order_no' },
    { title: '주문자', key: 'orderer_name' },
    { title: '주문시간', key: 'order_date' },
    { title: '상태', key: 'status' },
    { title: '상품코드', key: 'prd_code' },
    { title: '상품명', key: 'prd_name' },
    { title: '옵션명', key: 'prd_option_name' },
    { title: '이미지', key: 'prd_image' },
    { title: '수량', key: 'quantity' },
    { title: '취소수량', key: 'claim_quantity' },
    { title: '판매가', key: 'unit_price' },
    { title: '수취인', key: 'receiver_name' },
    { title: '택배사', key: 'courier_name' },
    { title: '송장번호', key: 'invoice_number' },
    { title: '수집날자', key: 'ins_date' },
    { title: '업데이트날자', key: 'upd_date' },
  ]

  const excelData = [];

  state.tableData.data.forEach(order => {
    order.orderItems.forEach(item => {
      const status = state.orderStatus.filter(it => it.value === item.status);
      excelData.push({
        order_no: order.order_no,
        orderer_name: order.orderer_name,
        order_date: order.order_date,
        status: status[0].label,
        prd_code: item.prd_code,
        prd_name: item.prd_name,
        prd_option_name: item.prd_option_name,
        prd_image: item.prd_image,
        quantity: item.quantity,
        claim_quantity: item.claim_quantity,
        unit_price: item.unit_price,
        receiver_name: item.receiver_name,
        courier_name: item.courier_name,
        invoice_number: item.invoice_number,
        ins_date: item.item_ins_date,
        upd_date: item.item_upd_date,
      })
    })
  });

  table2excel(header, excelData, `x-plan-order ${new Date().toLocaleString()}`);
}

onMounted(() => {
  getMarketStatusList();
  getMarketAdminUrls();

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