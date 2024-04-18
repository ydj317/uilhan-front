<template>

  <a-card title="애널리틱스">
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
        <a-space class="mr5">
          <a-input type="number" min="0" v-model:value="state.tableData.params.visitCount" suffix="회" />
        </a-space>
        <a-select v-model:value="state.tableData.params.sort" style="width: 200px;">
          <a-select-option value="up">이상(포함)</a-select-option>
          <a-select-option value="down">이하(포함)</a-select-option>
        </a-select>
      </a-descriptions-item>
    </a-descriptions>
    <div class="mt15 center">
      <a-button type="default" class="mr15" @click="resetSearchParam">초기화</a-button>
      <a-button type="primary" class="mr15" @click="searchProductVisits(true)">조회수 0인 상품 검색</a-button>
      <a-button type="primary" @click="searchProductVisits(false)">검색</a-button>
    </div>
  </a-card>
  <a-card class="mt15">
    <a-table :columns="tableColumns" :data-source="tableList" bordered :pagination="false" @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'productThumbnails'">
          <a-image
            :src="record.productThumbnails[0]"
            fallback="../../assets/img/404.jpg"
            width="60" height="60" style="width: 60px;height:60px;border-radius: 10px;"/>
        </template>
        <template v-if="column.key === 'productCode'">
          <div style="display: flex;gap: 5px;">
            <img :src="getLogoSrc('get-logo', record.productMarket.toLowerCase())" style="width: 20px;height: 20px;" :alt="record.productMarket">
            {{ record.productCode}}
          </div>
        </template>
        <template v-if="column.key === 'syncTime'">
          {{ record.syncTime ? dayjs(record.syncTime).format("YYYY-MM-DD") : '-'}}
        </template>
        <template v-if="column.key === 'chart'">
          <img src="../../assets/img/chart_icon.png" alt="차트보기" width="20" height="20" @click="modalChart(record)" style="cursor: pointer;">
        </template>
        <template v-if="column.key === 'productMemo'">
          <img src="../../assets/img/memo_icon.png" alt="메모보기" width="20" height="20" style="cursor: pointer;">
        </template>
      </template>
    </a-table>
    <a-pagination
      style="width: 100%;display: flex;justify-content: end;align-items: center;margin-top: 15px;"
      v-model:current="state.tableData.params.page"
      v-model:page-size="state.tableData.params.pageSize"
      @change="onPageChange"
      :total="state.tableData.total"
      :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
    />
  </a-card>

  <a-modal v-model:open="state.modalOpen" title="상품 유입 데이터 차트" :footer="null" :closable="false" width="1000px">
    <a-flex class="mt20" justify="center">
      <img :src="state.selectedProduct?.productThumbnails[0]" width="60" height="60" class="mr20" :alt="state.selectedProduct?.productName" style="border-radius: 10px">
      <a-flex vertical="vertical" style="width: 90%">
        <a-flex justify="space-between" align="center">
          <span>{{ state.selectedProduct?.productName}}</span>
        </a-flex>
        <a-flex vertical="vertical">
          <span>마켓연동일：{{ state.selectedProduct && !!state.selectedProduct?.syncTime ? dayjs(state.selectedProduct.syncTime).format("YYYY-MM-DD") :'-' }}</span>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-divider />
    <a-skeleton :active="loadChartDataLoading" :loading="loadChartDataLoading">
      <div class="mt20" ref="modalCharts" style="width: 100%;height: 400px;"></div>
    </a-skeleton>
    <a-flex justify="flex-end" class="mt20">
      <a-button type="default" @click="modalClose">닫기</a-button>
    </a-flex>
  </a-modal>
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
    }
  },
  loading: false,
  order_date: [],
  marketCheckAll: false,


  indeterminate: true,
  marketList: [],
  accountList: [],
  modalOpen: false,
  modalTabsIndex: 0,
  dailyData: {
    params: {
      period: "1week",
      type: "amount"
    }
  },
  selectedProduct: null,
});

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
    dataIndex: "key",
    key: "key",
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
    sorter: true,
  },
  {
    title: "판매수",
    key: "sales",
    dataIndex: "sales",
    width: "10%",
    align: "center",
    sorter: true
  },
  {
    title: "마켓연동일",
    key: "syncTime",
    dataIndex: "syncTime",
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

    tableList.value = result.data;
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

  try {
    const result = await getProductVisits(state.tableData.params);
    result.status !== "2000" && message.error(result.message);

    tableList.value = result.data;
    state.tableData.totalVisitCount = result.total; //涉及分页
  } catch (e) {
    console.error(e);
  } finally {
    state.tableData.loading = false;
  }
};


const searchProductVisits = (searchByZero = false) => {
  if(searchByZero) {
    state.tableData.params.visitCount = "0";
  }
  getProductVisitsList()
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
    const result = await findProductVisits({ productId: product.productId })
    const legend = result.data.map(v => v.marketCode);

    // 오늘 부터 15일전 데이터
    const today = dayjs();
    let xAxis = Array.from({ length: 30 }, (v, k) => today.subtract(k, "day").format("YYYY-MM-DD")).reverse();

    // group by marketCode
    const groupByData = result.data.reduce((acc, cur) => {
      if(acc[cur.marketCode]) {
        acc[cur.marketCode].push(cur);
      } else {
        acc[cur.marketCode] = [cur];
      }
      return acc;
    }, []);

    let series;
    series = Object.keys(groupByData).map((v, k) => {
      return {
        name: v,
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

    setTimeout(() => {
      const myChart = echarts.init(modalCharts.value);
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
        series: series
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
};
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
</style>
