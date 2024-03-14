<template>

  <a-card title="애널리틱스">
    <a-descriptions bordered :column="1" size="middle">
      <a-descriptions-item label="계정">
        <div>
          <a-checkbox v-model:checked="state.marketCheckAll" :indeterminate="state.indeterminate"
                      @change="onCheckAllChange">전체
          </a-checkbox>
          <a-checkbox-group v-model:value="state.tableData.params.market">
            <a-checkbox v-for="(item, key) in state.marketList" :key="key" :value="key">{{ item }}</a-checkbox>
          </a-checkbox-group>
        </div>
      </a-descriptions-item>
      <a-descriptions-item label="검색기간">
        <a-space class="mr5">
          <a-range-picker v-model:value="state.order_date" @change="onChangeDatePicker" />
        </a-space>
        <a-space class="range" v-model:value="state.tableData.params.range">
          <div value="all">전체기간</div>
          <a-divider type="vertical" class="line"/>
          <div value="today">오늘</div>
          <a-divider type="vertical" class="line"/>
          <div value="week">일주일</div>
          <a-divider type="vertical" class="line"/>
          <div value="month1">1개월</div>
          <a-divider type="vertical" class="line"/>
          <div value="month3">3개월</div>
        </a-space>
      </a-descriptions-item>
      <a-descriptions-item label="검색어">
        <a-input-group compact style="display: flex;">
          <a-select v-model:value="state.tableData.params.search_type" style="width: 100px;margin-right: 5px">
            <a-select-option value="order_no">주문번호</a-select-option>
            <a-select-option value="prd_code">상품번호</a-select-option>
            <a-select-option value="prd_name">상품명</a-select-option>
            <a-select-option value="prd_option_no">옵션번호</a-select-option>
            <a-select-option value="prd_option_name">옵션명</a-select-option>
            <a-select-option value="orderer_name">주문자</a-select-option>
            <a-select-option value="receiver_name">수취인</a-select-option>
          </a-select>
          <a-input v-model:value="state.tableData.params.search_value" style="width: 300px;" allowClear />
        </a-input-group>
      </a-descriptions-item>
      <a-descriptions-item label="조회수">
        <a-space class="mr5">
          <a-input v-model:value="state.tableData.params.number" suffix="회" />
        </a-space>
        <a-select v-model:value="state.tableData.params.sort" style="width: 200px;">
          <a-select-option value="up">이상</a-select-option>
          <a-select-option value="down">이하</a-select-option>
        </a-select>
      </a-descriptions-item>
    </a-descriptions>
    <div class="mt15 center">
      <a-button type="default" class="mr15">초기화</a-button>
      <a-button type="primary" class="mr15">조회수 0인 상품 검색</a-button>
      <a-button type="primary">검색</a-button>
    </div>
  </a-card>
  <a-card class="mt15">
    <a-table :columns="tableColumns" :data-source="tableList" bordered :pagination="false">
      <template #headerCell="{ column }">
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'goodsImg'">
          <img src="../../assets/img/404.jpg"  width="60" height="60">
        </template>
        <template v-if="column.key === 'goodsCode'">
          <img src="../../assets/img/404.jpg"  width="20" height="20">
          {{record.goodsCode}}
        </template>
        <template v-if="column.key === 'chart'" >
          <img src="../../assets/img/404.jpg"  width="20" height="20" @click="modalChart" style="cursor: pointer;">
        </template>
        <template v-if="column.key === 'note'">
          <img src="../../assets/img/404.jpg"  width="20" height="20" style="cursor: pointer;">
        </template>
      </template>
    </a-table>
    <a-pagination
            style="width: 100%;display: flex;justify-content: end;align-items: center;margin-top: 15px;"
            v-model:current="state.tableData.page"
            v-model:page-size="state.tableData.pageSize"
            @change="onPageChange"
            :total="state.tableData.total"
            :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
    />
  </a-card>
  <a-modal v-model:open="state.modalOpen" title="상품 유입 데이터 차트" :footer="null" :closable="false" width="1000px">
      <a-flex class="mt20" justify="center">
        <img src="../../assets/img/404.jpg"  width="60" height="60" class="mr20">
        <a-flex vertical="vertical"  style="width: 90%">
          <a-flex justify="space-between" align="center">
            <span>노랑 스마일 귀여운 LED 벽걸이 인테리어 무드등</span>
            <span><a-range-picker/></span>
          </a-flex>
          <a-flex vertical="vertical">
            <span>마켓연동일 : 2023-12-30 12:30</span>
            <a-divider />
          </a-flex>
        </a-flex>
      </a-flex>
    <a-space class="tab-wrap">
      <a-button :type="state.modalTabsIndex == k ?'primary':'default'" class="mr5" @click="modalToggleTabs(k)" v-for="(v,k) in state.modalTabs">{{v}}</a-button>
    </a-space>
    <div class="mt20" ref="modalCharts" style="width: 100%;height: 200px"></div>
    <a-flex justify="flex-end" class="mt20">
      <a-button type="default" @click="modalClose">닫기</a-button>
    </a-flex>
  </a-modal>
</template>

<script setup>
  import {computed, onMounted, reactive, ref, watch} from "vue";
import {message} from "ant-design-vue";
import * as echarts from 'echarts';
import {useMarketApi} from '@/api/market';
import moment from "moment";
  import dayjs from "dayjs";
  const modalCharts = ref(null);
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    params: {
      market: [],
      order_date: [moment().subtract(15, "days").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
      range: "",
      search_type: "order_no",
      search_value: "",
      number:"",
      sort:"up",
    }
  },
  loading: false,
  order_date: [moment().subtract(15, "days"), moment()],
  marketCheckAll: false,
  indeterminate: true,
  marketList: [],
  modalOpen:false,
  modalTabs:['일별','월별'],
  modalTabsIndex:0,
  dailyData: {
    params: {
      period: '1week',
      type: 'amount'
    }
  }
});
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
const getMarketList = async () => {
  try {
    await useMarketApi().getMarketList({}).then(res => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }

      state.marketList = res.data;
      state.tableData.params.market = Object.keys(state.marketList);
    });
  } catch (e) {
    console.error(e);
  }
};

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
});

const tableColumns = [
  {
    title: 'No',
    dataIndex: 'No',
    key: 'No',
    width:'5%',
    align:'center',
  },
  {
    title: '이미지',
    dataIndex: 'goodsImg',
    key: 'goodsImg',
    width:'10%',
    align:'center',
  },
  {
    title: '상품정보',
    dataIndex: 'goodsInfo',
    key: 'goodsInfo',
    width:'15%',
    align:'center',
  },
  {
    title: '상품코드',
    key: 'goodsCode',
    dataIndex: 'goodsCode',
    width:'10%',
    align:'center',
  },
  {
    title: '데이터차트',
    key: 'chart',
    dataIndex: 'chart',
    width:'10%',
    align:'center',
  },
  {
    title: '누적 조회수',
    key: 'views',
    dataIndex: 'views',
    width:'10%',
    align:'center',
    sorter:true,
  },
  {
    title: '판매수',
    key: 'sales',
    dataIndex: 'sales',
    width:'10%',
    align:'center',
    sorter:true,
  },
  {
    title: '마켓연동일',
    key: 'date',
    dataIndex: 'date',
    width:'20%',
    align:'center',
  },
  {
    title: '메모',
    key: 'note',
    width:'10%',
    align:'center',
  }
];
const tableList = [
  {
    key: '1',
    No: 1,
    goodsImg: '직원1직원1직원1',
    goodsInfo: '여자 여름',
    goodsCode: '777788889999',
    views: 100,
    sales: 99999,
    date: '2023-12-20 12:40',
  },
  {
    key: '2',
    No: 2,
    goodsImg: '직원1직원1직원1',
    goodsInfo: '여자 여름',
    goodsCode: '777788889999',
    views: 100,
    sales: 99999,
    date: '2023-12-20 12:40',
  },
];
//图表模态框
const modalChart = () => {
  state.modalOpen = true;
  setTimeout(()=>{
    var myChart = echarts.init(modalCharts.value);
    var option;
    option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['전체', '스마트스토어', '쿠팡', '인터파크','티몬','롯데ON','11번가','큐텐']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: ['10.21', '10.22', '10.23', '10.24', '10.25', '10.26', '10.27']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '전체',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '스마트스토어',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '쿠팡',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '인터파크',
          type: 'line',
          stack: 'Total',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
          {
              name: '티몬',
              type: 'line',
              stack: 'Total',
              data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
              name: '롯데ON',
              type: 'line',
              stack: 'Total',
              data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
              name: '11번가',
              type: 'line',
              stack: 'Total',
              data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
              name: '큐텐',
              type: 'line',
              stack: 'Total',
              data: [320, 332, 301, 334, 390, 330, 320]
          }
      ]
    };
    option && myChart.setOption(option);
  })
};
const modalClose = () => {
  state.modalOpen = false;
};
const modalToggleTabs = (k) => {
  state.modalTabsIndex = k;
};
</script>
<style scoped>
  .range{
    border: 1px solid #d9d9d9;
    padding: 4px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
  .line{
    background: #ffd117;
  }
  .tab-wrap button{
    width: 100px;
  }
  .tab-wrap .ant-btn-default{
    border: 1px solid #ffd117;
  }
</style>
