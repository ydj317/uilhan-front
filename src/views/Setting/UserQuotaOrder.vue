<template>

  <Loading
    v-model:active="loading"
    :can-cancel="false"
    :is-full-page="true"
  />

  <div v-if="isAdmin">

    <a-card title="서비스 권한 관리" :bordered="false">

      <div class="card-count">
        <div class="card-count-content">
          결제대기<span class="card-count-span">2个</span>
        </div>
        <div class="card-count-content">
          결제완료<span class="card-count-span">2个</span>
        </div>
        <div class="card-count-content">
          退款申请<span class="pl22 color-FB6F3E">2个</span>
        </div>
        <div class="card-count-content">
          退款完毕<span class="card-count-span">2个</span>
        </div>
      </div>


      <div class="card-search">
        <div>
          结算完成时间&nbsp;&nbsp;&nbsp;
          <a-range-picker
            v-model:value="search_day"
            value-format="YYYY-MM-DD"
          />
        </div>
        <div class="card-search-form">
          <a-select
            style="width: 120px"
            v-model:value="selectVal"
            @change="handleChange"
          >
            <a-select-option value="id">订单号码</a-select-option>
            <a-select-option value="user_name">会员名</a-select-option>
          </a-select>
          <a-input v-model:value="speVal" style="width: 120px;" aria-placeholder="搜素"/>
          <a-button type="primary" @click.prevent="search">검색</a-button>
        </div>

      </div>

    </a-card>

    <a-card :bordered="false" class="mt20">

      <a-table :bordered="false"
               :columns="columns"
               :row-key="record => record.id"
               :data-source="dataSource"
               :pagination="{ hideOnSinglePage: true, disabled: true, pageSize: pageSize }"
               class="mt20"
               :indent-size="30"
               :expandRowByClick="true"
               :expandedRowKeys="expandedRowKeys"
               @expand="handleExpand"
               :scroll="{ x: 'max-content' }">
      <template v-slot:bodyCell="{ text, record, index, column }">

        <!--          <template v-if="column.key === 'auto_trans_image'">-->
        <!--            <span>{{ text === true ? '사용함' : '사용안함'}}</span>-->
        <!--          </template>-->

<!--        <template v-if="column.key === 'plan_type_label'">-->
<!--          <a-tooltip :title="text">-->
<!--            <span style="width: 120px;display: block;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;">{{ text }}</span>-->
<!--          </a-tooltip>-->
<!--        </template>-->

        <template v-if="column.key === 'operation' && record.hasOwnProperty('children')"><a @click="editData(index,record)">详情</a></template>
      </template>

    </a-table>

      <a-modal v-model:open="dataModel"
               @ok="handleDataOk"
               title="서비스 결제관리"
               width="100%"
               >

        <a-card :bordered="false" style="overflow: auto">
          <div class="fl">
            <div class="w70">
              <a-descriptions bordered
                              size="middle"
                              :column="2"
                              :labelStyle="{ width: '200px' }">
                <a-descriptions-item label="회원ID">
                  {{ descriptions.user_name }}
                </a-descriptions-item>

                <a-descriptions-item label="결제방식">
                  {{ descriptions.paymentMethod }}
                </a-descriptions-item>

                <a-descriptions-item label="주문번호">
                  {{ descriptions.id }}
                </a-descriptions-item>

                <a-descriptions-item label="총 결제금액(vat포함)">
                  {{ descriptions.paymentAmountStr }}
                </a-descriptions-item>

              </a-descriptions>
            </div>
<!--            <span class="p7 fl-te">xxxxx</span>-->

          </div>
          <div class="mt50">
            <h3>결제내역</h3>
            <a-table :data-source="oneData" :columns="oneCol" bordered :pagination="false">
              <template #summary>
                <a-table-summary-row>
                  <a-table-summary-cell class="detail-summaryCell" :col-span="4" align="center">합계</a-table-summary-cell>
                  <a-table-summary-cell align="right">
                    <a-typography-text>{{ `1,120,000` }}</a-typography-text>
                  </a-table-summary-cell>
                  <a-table-summary-cell align="right">
                    <a-typography-text>{{ `112,000` }}</a-typography-text>
                  </a-table-summary-cell>
                  <a-table-summary-cell align="right">
                    <a-typography-text>{{ `1,232,000` }}</a-typography-text>
                  </a-table-summary-cell>
                  <a-table-summary-cell :col-span="2" align="center">
                    <a-typography-text style="font-weight: 600">{{ `1,232,000` }}</a-typography-text>
                  </a-table-summary-cell>
                </a-table-summary-row>
              </template>
            </a-table>
          </div>

          <div class="mt50">
            <h3>退款明细</h3>
            <a-table :data-source="secondData" :columns="secondCol" bordered :pagination="false">
              <template v-slot:bodyCell="{ text, record, index, column }">
                <template v-if="column.key === 'status' && text === '환불요청' ">
                  {{ text }}
                  <a-button>확인</a-button>
                  <a-button>반려</a-button>
                </template>
                <template v-else>{{ text }}</template>
              </template>
            </a-table>
          </div>

          <div class="mt50 mb50">
            <h3>推荐人支付明细</h3>
            <a-table class="w61" :data-source="threeData" :columns="threeCol" bordered :pagination="false">
              <template #summary>
                <a-table-summary-row>
                  <a-table-summary-cell class="detail-summaryCell" :col-span="5" align="center">합계</a-table-summary-cell>
                  <a-table-summary-cell align="right" style="font-weight: 600">
                    <a-typography-text>{{ `1,17,665` }}</a-typography-text>
                  </a-table-summary-cell>
                </a-table-summary-row>
              </template>
            </a-table>
          </div>

        </a-card>


      </a-modal>

    <!--paging-->
    <div class="w100 center top h50" style="background-color: white">
      <a-pagination
        v-model:current="current"
        :page-size-options="pageSizeOptions"
        :total="total"
        show-size-changer
        :page-size="pageSize"
        @change="onChange"
      >
      </a-pagination>
    </div>

    </a-card>
  </div>
  <div v-else>
    관리자가 아닙니다
  </div>

</template>


<script setup>

import {ref, reactive, computed, onMounted, createVNode} from "vue";
import Loading from "vue-loading-overlay";
import Cookie from "js-cookie";
import {message, Modal} from "ant-design-vue";
import {AuthRequest} from "@/util/request";
import { useRouter } from 'vue-router';
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import "vue-loading-overlay/dist/vue-loading.css";

const loading = ref(false);
const isAdmin = Cookie.get("member_roles").indexOf("ROLE_ADMIN") !== -1;
const search_day = ref(null);
const type = ref('');
const speVal = ref('');
const selectVal = ref('id')
const dataSource = ref([]);
const router = useRouter();



//分页
const total = ref(0);
const current = ref(1);
const pageSize = ref(10);
const pageSizeOptions = ref(["10", "20", "30", "40", "50"]);

//展示当前行 modal
const dataModel = ref(false);
const editableData = reactive({});
const expandedRowKeys = ref([]);

//详情descriptions
const descriptions = ref({});

/* 페이징 Method */
const onChange = (iCurrent, iPageSize) => {
  current.value = iCurrent;
  pageSize.value = iPageSize;
  search();
};

const columns = [
  {
    title: "No.",
    dataIndex: "No",
    key: "No",
    align: "center",
  },
  {
    title: "订单号码",
    dataIndex: "id",
    key: "id",
    // width: 80,
    align: "center",
  },
  {
    title: "订购时间",
    dataIndex: "createdAt",
    key: "createdAt",
    align: "center",
  },
  {
    title: "结算完成时间",
    dataIndex: "paymentTime",
    key: "paymentTime",
    align: "center",
  },
  {
    title: "会员ID",
    dataIndex: "user_name",
    key: "user_name",
    align: "center",
  },
  {
    title: "结算服务",
    dataIndex: ['historyQuota','quotaDetail','show_name'],
    key: "quotaName",
    align: "center",
  },{
    title: "结算金额",
    dataIndex: "paymentAmountStr",
    key: "paymentAmountStr",
    align: "center",
  },
  {
    title: "订单状态",
    dataIndex: "statusStr",
    key: "statusStr",
    align: "center",
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    align: "center",
  },
];


//详情 表格

let oneData = ref([]);
let secondData = ref([]);
let threeData = ref([]);

oneData  = [
  {
    key: '1',
    service: '기본서비스 6개월',
    requestDate: '2024. 1. 1 12:30:00',
    completionDate: '2024. 1. 1 13:00:00',
    usageTime: '2024. 1. 1 ~ 2024. 6. 30',
    standardAmount: '1,200,000',
    discount: '960,000',
    tax: '96,000',
    paymentAmount: '1,056,000',
    status: '결제완료 / 결제대기 (무통장)'
  },
  {
    key: '2',
    service: '이미지 자동번역 100개',
    requestDate: '',
    completionDate: '2024. 1. 1 13:00:00',
    usageTime: '2024. 1. 1 ~ 2024. 1. 31',
    standardAmount: '100,000',
    discount: '100,000',
    tax: '10,000',
    paymentAmount: '110,000',
    status: '환불요청'
  },
  {
    key: '3',
    service: 'GPT 100개',
    requestDate: '',
    completionDate: '2024. 1. 1 13:00:00',
    usageTime: '2024. 1. 1 ~ 2024. 1. 31',
    standardAmount: '60,000',
    discount: '60,000',
    tax: '6,000',
    paymentAmount: '66,000',
    status: '환불완료'
  }
];
const  oneCol = [
  {
    title: '결제서비스',
    dataIndex: 'service',
    key: 'service',
    align: 'center'
  },
  {
    title: '결제요청일시',
    dataIndex: 'requestDate',
    key: 'requestDate',
    align: 'center'
  },
  {
    title: '결제완료일시',
    dataIndex: 'completionDate',
    key: 'completionDate',
    align: 'center'
  },
  {
    title: '사용시간',
    dataIndex: 'usageTime',
    key: 'usageTime',
    align: 'center'
  },
  {
    title: '표준금액(vat별도)',
    dataIndex: 'standardAmount',
    key: 'standardAmount',
    align: 'right'
  },
  {
    title: '할인(vat별도)',
    dataIndex: 'discount',
    key: 'discount',
    align: 'right'
  },
  {
    title: '부가세',
    dataIndex: 'tax',
    key: 'tax',
    align: 'right'
  },
  {
    title: '결제금액(vat포함)',
    dataIndex: 'paymentAmount',
    key: 'paymentAmount',
    align: 'right'
  },
  {
    title: '상태',
    dataIndex: 'status',
    key: 'status',
    align: 'center'
  }
]

secondData = [
  {
    key: '1',
    refundService: '이미지 자동번역 100개',
    refundRequestDate: '2024. 1. 10 13:00:00',
    refundCompletionDate: '',
    usableDays: 31,
    remainingDays: 21,
    remainingAmount: '74,516',
    refundEstimatedAmount: '52,516',
    refundConfirmedAmount: '52,516',
    cancellationFee: '22,000',
    status: '환불요청'
  },
  {
    key: '2',
    refundService: 'GPT 100개',
    refundRequestDate: '2024. 1. 5 13:00:00',
    refundCompletionDate: '2024. 1. 5 13:00:00',
    usableDays: 31,
    remainingDays: 26,
    remainingAmount: '55,355',
    refundEstimatedAmount: '42,155',
    refundConfirmedAmount: '42,155',
    cancellationFee: '13,200',
    status: '환불완료'
  }
];

const secondCol = [
  {
    title: '환불서비스',
    dataIndex: 'refundService',
    key: 'refundService',
    align: 'center'
  },
  {
    title: '환불요청일시',
    dataIndex: 'refundRequestDate',
    key: 'refundRequestDate',
    align: 'center'
  },
  {
    title: '환불완료일시',
    dataIndex: 'refundCompletionDate',
    key: 'refundCompletionDate',
    align: 'center'
  },
  {
    title: '사용가능 일수',
    dataIndex: 'usableDays',
    key: 'usableDays',
    align: 'center'
  },
  {
    title: '남은 일수',
    dataIndex: 'remainingDays',
    key: 'remainingDays',
    align: 'center'
  },
  {
    title: '예치금 남아 현황(vat 포함)',
    dataIndex: 'remainingAmount',
    key: 'remainingAmount',
    align: 'right'
  },
  {
    title: '환불 예정금액',
    dataIndex: 'refundEstimatedAmount',
    key: 'refundEstimatedAmount',
    align: 'right'
  },
  {
    title: '환불 확정금액',
    dataIndex: 'refundConfirmedAmount',
    key: 'refundConfirmedAmount',
    align: 'right'
  },
  {
    title: '취소수수료 20%',
    dataIndex: 'cancellationFee',
    key: 'cancellationFee',
    align: 'right'
  },
  {
    title: '상태',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center'
  }
];

threeData = [
  {
    key: '1',
    referrerID: '이몽룡',
    paymentService: '기본서비스 6개월',
    referrerTotalAmount: '105,600',
    referrerRefundEstimatedAmount: '',
    referrerRefundConfirmedAmount: '',
    referrerActualAmount: '105,600'
  },
  {
    key: '2',
    referrerID: '이몽룡',
    paymentService: '이미지 자동번역 100개',
    referrerTotalAmount: '11,000',
    referrerRefundEstimatedAmount: '9,226',
    referrerRefundConfirmedAmount: '',
    referrerActualAmount: '11,000'
  },
  {
    key: '3',
    referrerID: '이몽룡',
    paymentService: 'GPT 100개',
    referrerTotalAmount: '6,600',
    referrerRefundEstimatedAmount: '5,535',
    referrerRefundConfirmedAmount: '5,535',
    referrerActualAmount: '1,065'
  }
];

const threeCol = [
  {
    title: '추천인 ID',
    dataIndex: 'referrerID',
    key: 'referrerID',
    align: 'center',
    customCell: (_, index) => {
      if (index === 0) {
        return {
          rowSpan: 3,
        };
      }

      if (index > 0) {
        return {
          rowSpan: 0
        }
      }
    }
  },
  {
    title: '결제서비스',
    dataIndex: 'paymentService',
    key: 'paymentService',
    align: 'center'
  },
  {
    title: '추천인 지급총액',
    dataIndex: 'referrerTotalAmount',
    key: 'referrerTotalAmount',
    align: 'right'
  },
  {
    title: '추천인 반환 예정금액',
    dataIndex: 'referrerRefundEstimatedAmount',
    key: 'referrerRefundEstimatedAmount',
    align: 'right'
  },
  {
    title: '추천인 반환 확정금액',
    dataIndex: 'referrerRefundConfirmedAmount',
    key: 'referrerRefundConfirmedAmount',
    align: 'right'
  },
  {
    title: '추천인 실 지급액',
    dataIndex: 'referrerActualAmount',
    key: 'referrerActualAmount',
    align: 'right'
  }
];


onMounted(() => {
  search();
})

//select change事件
const handleChange = (value) => {
  type.value = value;
}

//table 点击搜索回调
const search = () => {

  const oParam = {
    page: current.value,
    page_size: pageSize.value,

  }

  if (speVal.value && speVal.value.trim() !== '') {
    oParam.speVal = speVal.value;
  }

  if (selectVal.value) {
    oParam.selectVal = selectVal.value;
  }

  if (search_day.value) {

    oParam.start_time = Math.floor(Date.parse(search_day.value[0] + ' 00:00:00') / 1000);
    oParam.end_time = Math.floor(Date.parse(search_day.value[1] + ' 23:59:59') / 1000);
  }

  expandedRowKeys.value = [];


  requestPost('/api/user/quota/order/search',oParam, (data) => {

    total.value = Number(data.total);

    dataSource.value = data.list.map((item,key) => {
      item.No = total.value - (current.value - 1) * pageSize.value - key;
      if(item.children.length > 0){
        item.children = item.children.map((ele, k) => {
          delete ele.children;
          return { ...ele };
        })
      }
      return {...item};
    })


  });

}

//点击展开图标时触发
const handleExpand = (expanded, record) => {
  if (expanded){
    expandedRowKeys.value.push(record.id);
  }else {
    expandedRowKeys.value = expandedRowKeys.value.filter((item) => {
      return item !== record.id;
    })
  }
}

//行点击回调
const editData = (index,record) => {


  console.log(record.id);

  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/user/quota/order/detail/' + record.id).then((res) => {

    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }

    console.log(res);
    const uData = res.data;
    descriptions.value = {
      user_name:uData.user_name,
      paymentMethod:uData.paymentMethod,
      id:uData.id,
      paymentAmountStr:uData.paymentAmountStr
    }
    oneData.value = {

    }
    // return;
    dataModel.value = true;

  }).catch((error) => {
    message.error(error.message);
    return false;
  });

}

//详情模态框 确定回调
const handleDataOk = () => {
  dataModel.value = false;
}



const requestPost = (url, params, callback) => {

  loading.value = true;

  AuthRequest.post(process.env.VUE_APP_API_URL + url,
    params
  ).then((res) => {

    loading.value = false;
    /* fail */
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    callback(res.data);

  }).catch((error) => {
    loading.value = false;
    message.error('Error fetching data:', error);
  })

}

</script>


<style scoped>

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}


 .card-count {
   display: flex;
   justify-content: flex-start;
   font-size: 15px;
   font-weight: 600;
 }

 .card-count-content{
   padding: 13px;
   margin-right: 10px;
   width: 135px;
   height: 50px;
   border: 1px solid #cccccc;
   border-radius: 8px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
   transition: box-shadow 0.3s ease; /* 添加平滑过渡效果 */

 }

 .card-count-content:hover {
   box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 悬停时的阴影效果 */
 }

 .card-count-span{
   padding-left: 22px;
   color: #2A6BD0;
 }

 .card-search{
   margin-top: 50px;
   display: flex;
   justify-content: space-between;
 }
 .card-search-form{
   display: flex;
 }

</style>
