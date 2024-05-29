<template>

  <a-card title="매출데이터">
    <a-descriptions bordered :column="1" size="middle">
      <a-descriptions-item label="계정">
        <div>
          <a-checkbox v-model:checked="state.marketCheckAll" :indeterminate="state.indeterminate"
                      @change="onCheckAllChange">전체
          </a-checkbox>
          <a-checkbox-group v-model:value="state.tableData.params.market" @change="onCheckMarketChange" >
            <a-checkbox v-for="(item, key) in state.marketList" :key="key" :value="key">{{ item }}</a-checkbox>
          </a-checkbox-group>
        </div>
      </a-descriptions-item>
      <a-descriptions-item label="검색기간">
        <a-space class="mr5">
          <a-range-picker v-model:value="state.order_date" @change="onChangeDatePicker" />
        </a-space>
        <a-space class="range" v-model:value="state.tableData.params.range">
          <a-button size="small" type="ghost" @click="setOrderDate('all' , '')">전체기간</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button size="small" type="ghost" @click="setOrderDate('today', '')">오늘</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button size="small" type="ghost" @click="setOrderDate(1, 'week')">일주일</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button size="small" type="ghost" @click="setOrderDate(1, 'months')">1개월</a-button>
          <a-divider type="vertical" style="background-color: #ffd82c"/>
          <a-button size="small" type="ghost" @click="setOrderDate(3, 'months')">3개월</a-button>
        </a-space>
      </a-descriptions-item>
      <a-descriptions-item label="검색어">
        <a-input-group compact style="display: flex;">
          <a-select v-model:value="state.tableData.params.search_type" style="width: 100px;margin-right: 5px">
            <a-select-option value="prd_code">상품번호</a-select-option>
            <a-select-option value="prd_trans_name">상품명</a-select-option>
          </a-select>
          <a-input v-model:value="state.tableData.params.search_value" style="width: 300px;" allowClear />
        </a-input-group>
      </a-descriptions-item>
      <a-descriptions-item label="조회수">
        <a-input-number  min="1" v-model:value="state.tableData.params.visitCount" addon-after="회"/>
        <span class="ml10">
          <a-select  v-model:value="state.tableData.params.sort" style="width: 200px;">
          <a-select-option value="up">이상(포함)</a-select-option>
          <a-select-option value="down">이하(포함)</a-select-option>
        </a-select>
        </span>

      </a-descriptions-item>
    </a-descriptions>
    <div class="mt15 center">
      <a-button type="default" class="mr15" @click="resetSearchParam">초기화</a-button>
      <a-button type="primary" class="mr15" @click="searchProductVisitsZero(true)">조회수 0인 상품 검색</a-button>
      <a-button type="primary" @click="searchProductVisits(false)">검색</a-button>
    </div>
  </a-card>
  <a-card class="mt15">
    <a-table  :loading="state.tableData.loading" :columns="tableColumns" :data-source="tableList" bordered :pagination="false" @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'productThumbnails'">
          <a-image
            :src="record.productThumbnails[0]"
            fallback="data:image/png;base64,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"
            width="60" height="60" style="width: 60px;height:60px;border-radius: 10px;"/>
        </template>
        <template v-if="column.key === 'productCode'">
          <div style="display: flex;gap: 5px;">
            <img :src="getLogoSrc('get-logo', record.productMarket.toLowerCase())" style="width: 20px;height: 20px;" :alt="record.productMarket">
            {{ record.productCode}}
          </div>
        </template>
        <template v-if="column.key === 'insTime'">
          {{ record.insTime ? dayjs(record.insTime).format("YYYY-MM-DD") : '-'}}
        </template>
        <template v-if="column.key === 'chart'">
          <div v-if="record.visitCount > 0">
            <img src="../../assets/img/chart_icon.png" alt="차트보기" width="20" height="20" @click="modalChart(record)" style="cursor: pointer;">
          </div>
          <div v-else>
            -
          </div>
        </template>
        <template v-if="column.key === 'productMemo'">
          <a-button
              size="small"
              :type="!! record['productMemo'] ? 'primary' : 'default'"
              style="width: 32px;padding: 0;"
              @click="openMemoModal(record)"
          ><FileTextOutlined/></a-button>
        </template>
      </template>
    </a-table>
    <a-pagination
      style="width: 100%;display: flex;justify-content: center;align-items: center;margin-top: 15px;"
      v-model:current="state.tableData.params.page"
      v-model:page-size="state.tableData.params.pageSize"
      @change="onPageChange"
      :total="state.tableData.total"
      :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
    />
  </a-card>

  <a-modal v-model:open="state.modalOpen" title="상품 유입 데이터 차트" :footer="null" :closable="false" width="1000px" @cancel="modalClose">
    <a-flex class="mt20" justify="center">
      <img :src="state.selectedProduct?.productThumbnails[0]" width="60" height="60" class="mr20" :alt="state.selectedProduct?.productName" style="border-radius: 10px">
      <a-flex vertical="vertical" style="width: 90%">
        <a-flex justify="space-between" align="center">
          <span>{{ state.selectedProduct?.productTransName}}</span>
        </a-flex>
        <a-flex vertical="vertical">
          <span>마켓연동일：{{ state.selectedProduct && !!state.selectedProduct?.insTime ? dayjs(state.selectedProduct.insTime).format("YYYY-MM-DD") :'-' }}</span>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-divider />
    <a-skeleton :active="loadChartDataLoading" :loading="loadChartDataLoading">
      <div class="chart-wrap">
        <LeftOutlined class="left-arrow" @click="prevProductVisits" />
        <div class="mt20" ref="modalCharts" style="width: 100%;height: 400px;"></div>
        <RightOutlined class="right-arrow" @click="nextProductVisits" />
      </div>
    </a-skeleton>
    <a-flex justify="flex-end" class="mt20">
      <a-button type="default" @click="modalClose">닫기</a-button>
    </a-flex>
  </a-modal>
  <ModalMemo v-model:memo-data="memoForm" @before-save="indicator = true" @after-save="reloadList" />
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { message } from "ant-design-vue";
import * as echarts from "echarts";
import moment from "moment/moment";
import { useMarketApi } from "@/api/market";
import { findProductVisits, getProductVisits } from "@/api/productVisits";
import dayjs from "dayjs";
import { useMarketAccountApi } from "@/api/marketAccount";
import {useProductApi} from "@/api/product";
import {FileTextOutlined,LeftOutlined,RightOutlined} from "@ant-design/icons-vue";
import ModalMemo from "@/views/Product/List/Ctrls/ModalMemo.vue";

defineEmits(['editMemo'])
const memoForm = ref({ show: false, item_id: -1, memo: '' })
const indicator = ref(false)
const modalCharts = ref(null);
const state = reactive({
  tableData: {
    data: [],
    total: 0,

    loading: false,
    params: {
      page: 1,
      pageSize: 10,
      market: [],
      account_ids: [],
      order_date: [],
      range: "",
      search_type: "prd_code",
      search_value: "",
      visitCount: "",
      sort: "up",
      sortOrder:"desc",
      sortField: "", // 初始排序字段为空
      salesCount: "",
    }
  },
  loading: false,
  order_date: [],
  marketCheckAll: false,


  indeterminate: true,
  marketList: [],
  openMarketList: [],
  accountList: [],
  modalOpen: false,
  modalTabsIndex: 0,
  modalPageIndex:0,
  modalStartTime:0,
  modalEndTime:0,
  dailyData: {
    params: {
      period: "1week",
      type: "amount"
    }
  },
  selectedProduct: null,
});

const openMemoModal = (record) => {
  memoForm.value = {
    show: true,
    item_id: record.productId,
    memo: record.productMemo
  }
}

async function reloadList() {
  if (tableList.value.length > 0) {
    if (tableList.value[0].totalVisitCount === 0) {
      await getViewCountZeroProduct()
    } else  {
      await getProductVisitsList()
    }
  }
}

const setOrderDate = (range, period) => {
  if (range === "all") {
    state.order_date = [];
    state.tableData.params.order_date = ["", ""]
  } else if (range === "today") {
    state.order_date = [moment(), moment()];
    state.tableData.params.order_date = [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
  } else {
    state.order_date = [moment().subtract(range, period), moment()];
    state.tableData.params.order_date = [moment().subtract(range, period).format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
  }
};

const onPageChange = (page, pageSize) => {
  state.tableData.page = page;
  state.tableData.pageSize = pageSize;
  if (tableList.value.length > 0) {
    if (tableList.value[0].totalVisitCount === 0) {
      getViewCountZeroProduct()
    } else  {
      getProductVisitsList()
    }
  }
};
const onChangeDatePicker = (value, dateString) => {
  state.tableData.params.order_date = [dateString[0], dateString[1]];
};
const onCheckAllChange = e => {
  state.indeterminate = false;
  state.tableData.params.market = e.target.checked ? Object.keys(state.marketList) : [];
};
const onCheckMarketChange = () => {
  // state.accountList 에서 체크되여 있는 marketCode 의 id 를 state.tableData.param.accountIds 에 넣어준다.
  state.tableData.params.account_ids = state.accountList.filter(it => state.tableData.params.market.includes(it.marketCode)).map(it => Number(it.id));
};
const getMarketList = async () => {
  try {
    let marketList = [];
    await useMarketApi().getMarketList({}).then(res => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }

      marketList = res.data;
      state.openMarketList = res.data;
    });

    await useMarketAccountApi().getAccountList({'page' : 'all', 'is_use': 1}).then(res => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
      state.accountList = res.data.list;
      state.marketList = res.data.list.reduce(
        (acc, cur) => ({
            ...acc,
            [cur.marketCode] : marketList[cur.marketCode]
          }
        ),
        {}
      );

      state.tableData.params.market = Object.keys(state.marketList);
      onCheckMarketChange();
    });

  } catch (e) {
    console.error(e);
  }
};

const tableColumns = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    width: "5%",
    align: "center"
  },
  {
    title: "이미지",
    dataIndex: "productThumbnails",
    key: "productThumbnails",
    width: "10%",
    align: "center"
  },
  {
    title: "상품정보",
    dataIndex: "productTransName",
    key: "productTransName",
    width: "20%",
    align: "center"
  },
  {
    title: "상품코드",
    key: "productCode",
    dataIndex: "productCode",
    width: "10%",
    align: "center"
  },
  {
    title: "데이터차트",
    key: "chart",
    dataIndex: "chart",
    width: "10%",
    align: "center"
  },
  {
    title: "누적 조회수",
    key: "totalVisitCount",
    dataIndex: "totalVisitCount",
    width: "10%",
    align: "center",
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.totalVisitCount - b.totalVisitCount
  },
  // {
  //   title: "판매수",
  //   key: "totalSalesCount",
  //   dataIndex: "totalSalesCount",
  //   width: "10%",
  //   align: "center",
  //   sorter: true,
  //   customRender: ({ text }) => (text !== undefined && text !== null) ? text : '-'
  // },
  {
    title: "마켓연동일",
    key: "insTime",
    dataIndex: "insTime",
    width: "20%",
    align: "center"
  },
  {
    title: "메모",
    key: "productMemo",
    dataIndex: "productMemo",
    width: "10%",
    align: "center"
  }
];
const tableList = ref([])
const getLogoSrc = (fileName, marketCode) => {
  try {
    return require(`../../assets/img/list/${fileName}/${marketCode}.png`);
  } catch (error) {
    return require('../../assets/img/temp_image.png');
  }
}

const getProductVisitsList = async () => {
  state.tableData.loading = true;
  try {
    const result = await getProductVisits(state.tableData.params);
    result.status !== "2000" && message.error(result.message);
    // result.data.currentPageResults 에 index 를 추가 1부터++
    result.data.currentPageResults.forEach((v, i) => {
      v.index = (state.tableData.params.page - 1) * state.tableData.params.pageSize + i + 1;
    });
    tableList.value = result.data.currentPageResults;
    state.tableData.total = result.data.totalCount;
  } catch (e) {
    console.error(e);
  } finally {
    state.tableData.loading = false;
  }
};

const handleTableChange = async(pagination, filters, sorter) => {
  state.tableData.loading = true;
  //后端所需的排序参数
  const sortField = sorter.field || 'totalVisitCount'; // 默认排序字段
  const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // 转换排序顺序

  // 更新状态中的参数，发送给后端
  state.tableData.params.sortField = sortField;
  state.tableData.params.sortOrder = sortOrder;
  await reloadList()
};


const searchProductVisits = (searchByZero = false) => {
  getProductVisitsList()
}

const searchProductVisitsZero = () => {
  resetSearchParam()
  state.order_date = [];
  getViewCountZeroProduct()
}

const resetSearchParam = () => {
  state.tableData.params = {
    page: 1,
    pageSize: 10,
    market: Object.keys(state.marketList),
    order_date: ["", ""],
    range: "",
    search_type: "prd_code",
    search_value: "",
    number: "",
    sort: "up"
  };
}

watch(
  () => state.tableData.params.market,
  val => {
    state.indeterminate = !!val.length && val.length < Object.keys(state.marketList).length;
    state.marketCheckAll = val.length === Object.keys(state.marketList).length;
  }
);

onMounted(async () => {
  await Promise.all([getMarketList()])
    .then(() => {
    });

  await getProductVisitsList();
});


//图表模态框
const loadChartDataLoading = ref(false);
const modalChart = async (product) => {
  state.modalOpen = true;
  state.selectedProduct = product;
  loadChartDataLoading.value = true;
  try {
    // 오늘 부터 15일전 데이터
    const today = dayjs().subtract(state.modalPageIndex, "month");
    let xAxis = Array.from({ length: 30 }, (v, k) => today.subtract(k, "day").format("YYYY-MM-DD")).reverse();
    state.modalStartTime = xAxis[0];
    state.modalEndTime = xAxis[xAxis.length-1];
    const result = await findProductVisits({ productId: product.productId,startTime:state.modalStartTime,endTime:state.modalEndTime })
    let legend =  [];
    let series;
    if(result.data.length){
      legend =  result.data.map(v => state.openMarketList[v.marketCode]);
      // group by marketCode
      const groupByData = result.data.reduce((acc, cur) => {
        if(acc[cur.marketCode]) {
          acc[cur.marketCode].push(cur);
        } else {
          acc[cur.marketCode] = [cur];
        }
        return acc;
      }, []);
      series = Object.keys(groupByData).map((v, k) => {
        return {
          name: state.openMarketList[v],
          type: "bar",
          stack: "visit",
          data: xAxis.map(_v => {
            const find = groupByData[v].find(_vv => dayjs(_vv.visitDate).format("YYYY-MM-DD") === _v);
            return find ? find.visitCount : '-';
          })
        };
      });

      const stackInfo = {};
      for (let i = 0; i < series[0].data.length; ++i) {
        for (let j = 0; j < series.length; ++j) {
          const stackName = series[j].stack;
          if (!stackName) {
            continue;
          }
          if (!stackInfo[stackName]) {
            stackInfo[stackName] = {
              stackStart: [],
              stackEnd: []
            };
          }
          const info = stackInfo[stackName];
          const data = series[j].data[i];
          if (data && data !== '-') {
            if (info.stackStart[i] == null) {
              info.stackStart[i] = j;
            }
            info.stackEnd[i] = j;
          }
        }
      }
      for (let i = 0; i < series.length; ++i) {
        const data = series[i].data;
        const info = stackInfo[series[i].stack];
        for (let j = 0; j < series[i].data.length; ++j) {
          // const isStart = info.stackStart[j] === i;
          const isEnd = info.stackEnd[j] === i;
          const topBorder = isEnd ? 5 : 0;
          const bottomBorder = 0;
          data[j] = {
            value: data[j],
            itemStyle: {
              borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
            }
          };
        }
      }
    }
    setTimeout(() => {
      const myChart = echarts.init(modalCharts.value);
      // 创建左右箭头的图标路径
      const  leftArrowIcon= 'path://M25,6 L13,6 L13,0 L3,12 L13,24 L13,18 L25,18 L25,6 Z';
      const  rightArrowIcon = 'path://M3,6 L15,6 L15,0 L25,12 L15,24 L15,18 L3,18 L3,6 Z';
      let option;
      option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: legend
        },
        xAxis: {
          type: "category",
          data: xAxis
        },
        yAxis: {
          type: "value"
        },
        series: series,
      };
      option && myChart.setOption(option);
    });
  } catch (e) {
    console.error(e);
  } finally {
    loadChartDataLoading.value = false;
  }
};
const modalClose = () => {
  state.selectedProduct.value = null;
  state.modalOpen = false;
  state.modalPageIndex = 0;
};

const getViewCountZeroProduct = async () => {
  try {
    state.tableData.loading = true;
    const result = await useProductApi().getViewCountZeroProduct(state.tableData.params);
    // result.data.currentPageResults 돌과서 totalVisitCount 를 모두 0 으로 넣어줌
    // result.data.currentPageResults 에 index 를 추가 1부터++
    result.data.currentPageResults.forEach((v, i) => {
      v.index = (state.tableData.params.page - 1) * state.tableData.params.pageSize + i + 1;
      v.totalVisitCount = 0;
    });
    tableList.value = result.data.currentPageResults;
    state.tableData.total = result.data.totalCount;
    state.tableData.loading = false;
  } catch (e) {
    state.tableData.loading = false;
    console.error(e);
  }
}
const prevProductVisits = () =>{
  state.modalPageIndex += 1;
  modalChart(state.selectedProduct);
}

const nextProductVisits = () =>{
  if(state.modalPageIndex - 1 < 0){
    state.modalPageIndex = 0;
    return;
  }
  state.modalPageIndex = state.modalPageIndex - 1;
  modalChart(state.selectedProduct);
}
</script>
<style scoped>
.range {
  border: 1px solid #d9d9d9;
  padding: 4px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.line {
  background: #ffd117;
}

.tab-wrap button {
  width: 100px;
}

.tab-wrap .ant-btn-default {
  border: 1px solid #ffd117;
}
.chart-wrap{
  position: relative;
}
.chart-wrap .left-arrow{
  position: absolute;
  left: 10px;
  top: 50%;
  font-size: 30px;
  cursor: pointer;
  z-index: 9;
}
.chart-wrap .right-arrow{
  position: absolute;
  right: 10px;
  top: 50%;
  font-size: 30px;
  cursor: pointer;
  z-index: 9;
}
</style>
