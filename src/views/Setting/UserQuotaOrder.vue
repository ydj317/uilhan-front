<template>

  <Loading
    v-model:active="loading"
    :can-cancel="false"
    :is-full-page="true"
  />

  <div v-if="isAdmin">

    <a-card title="서비스 권한 관리" :bordered="false">

      <div class="card-count">
        <div class="card-count-content" @click="searchStatusOrder('all')">
          全部<span class="card-count-span">{{ statistics.allCnt }}个</span>
        </div>
        <div class="card-count-content" @click="searchStatusOrder('Pending')">
          결제대기<span class="card-count-span">{{ statistics.pendingCnt }}个</span>
        </div>
        <div class="card-count-content" @click="searchStatusOrder('Completed')">
          결제완료<span class="card-count-span">{{ statistics.CompletedCnt }}个</span>
        </div>
        <div class="card-count-content" @click="searchStatusOrder('CancelPayment')">
          取消支付<span class="card-count-span">{{ statistics.CancelPayment }}个</span>
        </div>
        <div class="card-count-content" @click="searchStatusOrder('Refunding')">
          待退款<span class="pl22 color-FB6F3E">{{ statistics.refundingCnt }}个</span>
        </div>
        <div class="card-count-content" @click="searchStatusOrder('Refunded')">
          환불완료<span class="card-count-span">{{ statistics.refundedCnt }}个</span>
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
          <a-input-search
            v-model:value="speVal"
            placeholder="검색어"
            enter-button="검색"
            size="middle"
            @search="searchHandle"
          />
          <!--          <a-input v-model:value="speVal" style="width: 120px;" aria-placeholder="搜素"/>-->
          <!--          <a-button type="primary" @click.prevent="search">검색</a-button>-->
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
          <template v-if="column.key === 'id' && record.hasOwnProperty('children')">
            <span class="color-2171E2">{{ text }}</span>
          </template>

          <!--        <template v-if="column.key === 'operation' && record.hasOwnProperty('children')"><a @click="editData(index,record)">详情</a></template>-->
          <template v-if="column.key === 'operation'"><a @click="editData(record.id)">详情</a></template>
        </template>

      </a-table>

      <a-modal v-model:open="dataModel"
               title="서비스 결제관리"
               width="100%"
               :footer="null"
               :bodyStyle="{height:'60vh',overflow:'auto'}"
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

                <a-descriptions-item label="총 결제금액(vat포함">
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
                    <a-typography-text>{{ totolPrice.totalAmount }}</a-typography-text>
                  </a-table-summary-cell>
                  <a-table-summary-cell align="right">
                    <a-typography-text>{{ totolPrice.discountAmount }}</a-typography-text>
                  </a-table-summary-cell>
                  <a-table-summary-cell align="right">
                    <a-typography-text>{{ totolPrice.taxAmount }}</a-typography-text>
                  </a-table-summary-cell>
                  <a-table-summary-cell :col-span="2" align="right">
                    <a-typography-text style="font-weight: 600">{{ totolPrice.paymentAmount }}</a-typography-text>
                  </a-table-summary-cell>
                </a-table-summary-row>
              </template>
            </a-table>
          </div>

          <div class="mt50" v-if="secondData.length > 0">
            <h3>환불내역</h3>
            <a-table :data-source="secondData" :columns="secondCol" bordered :pagination="false">
              <template v-slot:bodyCell="{ text, record, index, column }">
                <template v-if="column.key === 'status' && text === '申请中' ">
                  {{ text }}
                  <a-button @click="agreeHandle(record)">확인</a-button>
                  <a-button @click="refusedHandle(record)">반려</a-button>
                </template>
                <template v-else>{{ text }}</template>
              </template>
            </a-table>
          </div>

          <div class="mt50 mb50" v-if="threeData[0] !== undefined && threeData[0]['referrerID'] !== ''">
            <h3>추천인 지급 내역</h3>
            <a-table class="w61" :data-source="threeData" :columns="threeCol" bordered :pagination="false">
              <template #summary>
                <a-table-summary-row>
                  <a-table-summary-cell class="detail-summaryCell" :col-span="5" align="center">합계</a-table-summary-cell>
                  <a-table-summary-cell align="right" style="font-weight: 600">
                    <a-typography-text>{{ totolPrice.theTotalReferrer }}</a-typography-text>
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
import {message, Modal, Textarea} from "ant-design-vue";
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

const currentOrderId = ref(null);

const currentRefundOrderId = ref(null);

const statistics = ref({
  allCnt:0,
  pendingCnt: 0,
  CompletedCnt:0,
  CancelPayment:0,
  refundingCnt:0,
  refundedCnt:0
})

//分页
const total = ref(0);
const current = ref(1);
const pageSize = ref(10);
const pageSizeOptions = ref(["10", "20", "30", "40", "50"]);

//展示当前行 modal
const dataModel = ref(false);
const expandedRowKeys = ref([]);

//详情descriptions
const descriptions = ref({});

//详情 表格

let oneData = ref([]);
let secondData = ref([]);
let threeData = ref([]);

let totolPrice = ref({});

let currentStatus = ref(null);

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




const  oneCol = [
  {
    title: '결제서비스',
    dataIndex: 'plan_type',
    key: 'plan_type',
    align: 'center'
  },
  {
    title: '결제요청일시',
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center'
  },
  {
    title: '결제완료일시',
    dataIndex: 'paymentTime',
    key: 'paymentTime',
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
    dataIndex: 'totalAmountStr',
    key: 'totalAmountStr',
    align: 'right'
  },
  {
    title: '할인(vat별도)',
    dataIndex: 'discountAmountStr',
    key: 'discountAmountStr',
    align: 'right'
  },
  {
    title: '부가세',
    dataIndex: 'taxAmountStr',
    key: 'taxAmountStr',
    align: 'right'
  },
  {
    title: '결제금액(vat포함)',
    dataIndex: 'paymentAmountStr',
    key: 'paymentAmountStr',
    align: 'right'
  },
  {
    title: '상태',
    dataIndex: 'statusStr',
    key: 'statusStr',
    width:'150px',
    align: 'center'
  }
]


const secondCol = [
  {
    title: '환불서비스',
    dataIndex: 'show_name',
    key: 'show_name',
    align: 'center'
  },
  {
    title: '환불요청일시',
    dataIndex: 'refundStartDate',
    key: 'refundStartDate',
    align: 'center'
  },
  {
    title: '환불완료일시',
    dataIndex: 'refundEndDate',
    key: 'refundEndDate',
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
    dataIndex: 'refundDay',
    key: 'refundDay',
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
    title: '취소수수료 10%',
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

//推荐人支付明细
const threeCol = [
  {
    title: '추천인ID',
    dataIndex: 'referrerID',
    key: 'referrerID',
    align: 'center',
    customCell: (_, index) => {
      if (index === 0) {
        return {
          rowSpan: oneData.value.length,
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
    dataIndex: 'plan_type',
    key: 'plan_type',
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
  // getStatistics();
})

//点击搜索回调  先重置订单状态
const searchHandle = () => {
  currentStatus.value = null;
  search();
}

//按订单状态 查找订单
const searchStatusOrder = (type) => {

  if (type !== 'all'){
    currentStatus.value = type;
  }else {
    currentStatus.value = null;
  }

  current.value = 1;
  pageSize.value = 10;
  speVal.value = '';
  selectVal.value = 'id';
  search_day.value = null;

  search();

}

//select change事件
const handleChange = (value) => {
  type.value = value;
}

//获取订单统计数据
const getStatistics = () => {

  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/user/order/statistics').then((res) => {

    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }

    statistics.value = {
      allCnt:res.data.allCnt,
      pendingCnt: res.data.pendingCnt,
      CompletedCnt:res.data.CompletedCnt,
      CancelPayment:res.data.CancelPayment,
      refundingCnt:res.data.refundingCnt,
      refundedCnt:res.data.refundedCnt
    }

  }).catch((error) => {
    message.error(error.message);
    return false;
  });

}

//table 点击搜索回调
const search = () => {

  getStatistics()

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

  if (currentStatus.value){
    oParam.status = currentStatus.value;
  }

  expandedRowKeys.value = [];


  requestPost('/api/user/quota/order/search',oParam, (data) => {

    total.value = Number(data.total);

    dataSource.value = data.list.map((item,key) => {
      item.No = total.value - (current.value - 1) * pageSize.value - key;
      if(item.hasOwnProperty('children') && item.children.length > 0){
        item.children = item.children.map((ele, k) => {
          delete ele.children;
          return { ...ele };
        })
      }else{
        delete item.children;
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

//详情点击回调
const editData = (id) => {

  currentOrderId.value = id;

  oneData.value = [];
  secondData.value = [];
  threeData.value = [];


  descriptions.value = {};
  oneData.value = [];
  totolPrice.value = {};

  loading.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/user/quota/order/detail/' + id).then((res) => {

    loading.value = false;
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }

    console.log(res.data);
    const uData = res.data;

    getStatistics();

    descriptions.value = {
      user_name:uData.user_name,
      paymentMethod:uData.paymentMethodStr,
      id:uData.id,
      paymentAmountStr:uData.paymentAmountStr
    }
    oneData.value.push({
      order_id: uData.id,
      plan_type : uData.historyQuota.quotaDetail.show_name,
      createdAt : formatDateTime(uData.createdAt),
      paymentTime : formatDateTime(uData.paymentTime),
      usageTime: formatDate(uData.historyQuota.quotaDetail.start_time) + '-' + formatDate(uData.historyQuota.quotaDetail.end_time),
      totalAmountStr:uData.totalAmountStr,
      totalAmount:uData.totalAmount,
      paymentAmountStr:uData.paymentAmountStr,
      paymentAmount:uData.paymentAmount,
      discountAmountStr:uData.discountAmountStr,
      discountAmount:uData.discountAmount,
      taxAmountStr:uData.taxAmountStr,
      taxAmount:uData.taxAmount,
      statusStr:uData.statusStr
    })

    uData.children.forEach((item) => {

      const childrenObj = {
        order_id: item.id,
        plan_type : item.historyQuota.quotaDetail.show_name,
        createdAt : formatDateTime(item.createdAt),
        paymentTime : formatDateTime(item.paymentTime),
        usageTime: formatDate(item.historyQuota.quotaDetail.start_time) + '-' + formatDate(item.historyQuota.quotaDetail.end_time),
        totalAmountStr:item.totalAmountStr,
        totalAmount:item.totalAmount,
        paymentAmountStr:item.paymentAmountStr,
        paymentAmount:item.paymentAmount,
        discountAmountStr:item.discountAmountStr,
        discountAmount:item.discountAmount,
        taxAmountStr:item.taxAmountStr,
        taxAmount:item.taxAmount,
        statusStr:item.statusStr
      }

      oneData.value.push(childrenObj)

    })

    totolPrice.value.totalAmount = numberFormat(oneData.value.reduce((accumulator, item) => accumulator + item.totalAmount, 0));
    totolPrice.value.paymentAmount = numberFormat(oneData.value.reduce((accumulator, item) => accumulator + item.paymentAmount, 0));
    totolPrice.value.discountAmount = numberFormat(oneData.value.reduce((accumulator, item) => accumulator + item.discountAmount, 0));
    totolPrice.value.taxAmount = numberFormat(oneData.value.reduce((accumulator, item) => accumulator + item.taxAmount, 0));

    //退款明细
    secondData.value = uData.refunds.map((item) => {
      const usableDays = item.refundDay + item.useDay;
      const remainingAmount = Math.floor((item.paymentAmount / usableDays) * item.refundDay);
      const cancellationFee = item.isFreeSevenDay ? 0 : Math.floor((item.totalAmount * 1.1) * 0.1);
      const refundEstimatedAmount = Math.floor(remainingAmount - cancellationFee);
      const refundConfirmedAmount = item.status === 'Success' ? refundEstimatedAmount : '';

      return {
        refund_id:item.id,
        order_id: item.order.id,
        show_name: item.order.show_name,
        refundStartDate: item.refundStartDate,
        refundEndDate: item.refundEndDate,
        usableDays: usableDays,
        refundDay: item.refundDay,
        remainingAmount: numberFormat(remainingAmount),
        cancellationFee: numberFormat(cancellationFee),
        refundEstimatedAmount: numberFormat(refundEstimatedAmount),
        refundConfirmedAmount: refundConfirmedAmount===''?'-':numberFormat(refundConfirmedAmount),
        status: item.statusStr,
        statusFlag:item.status
      };
    });


    //推荐人支付明细
    threeData.value = oneData.value.map((item) => {

      const referrerTotalAmount = Math.floor(item.paymentAmount * 0.1);

      const refundsItem =secondData.value.find((ele) => {
        return ele.order_id === item.order_id;
      })

      let referrerRefundEstimatedAmount = '';
      let referrerRefundConfirmedAmount = '';
      if (refundsItem!==undefined){
        referrerRefundEstimatedAmount = Math.floor((referrerTotalAmount / refundsItem.usableDays) * refundsItem.refundDay);
        referrerRefundConfirmedAmount = refundsItem.statusFlag === 'Success'? numberFormat(referrerRefundEstimatedAmount) : '';
      }

      const referrerActualAmount = referrerRefundConfirmedAmount === '' ? referrerTotalAmount : referrerTotalAmount - referrerRefundEstimatedAmount;

      return {
        referrerID:uData.recommendCodeUserName !== '' ? (uData.recommend_user.name === '' ? uData.recommend_user.user_name : uData.recommend_user.name) : '',
        plan_type:item.plan_type,
        referrerTotalAmount:numberFormat(referrerTotalAmount),
        referrerRefundEstimatedAmount:referrerRefundEstimatedAmount !== '' ? numberFormat(referrerRefundEstimatedAmount) : '-',
        referrerRefundConfirmedAmount:referrerRefundConfirmedAmount !== '' ? referrerRefundConfirmedAmount : '-',
        referrerActualAmount:numberFormat(referrerActualAmount),
        referrerActualAmountNum:referrerActualAmount
      }
    })

    totolPrice.value.theTotalReferrer = numberFormat(threeData.value.reduce((accumulator, item) => accumulator + item.referrerActualAmountNum, 0));

    if (currentRefundOrderId.value !== null){

      let updateData;
      if (uData.id === currentRefundOrderId.value){
        updateData = { ...uData };
      }else {
        if(uData.isParentOrder && uData.hasOwnProperty('children') && uData.children.length > 0){
          uData.children.forEach((item) => {
            delete item.children;
            if (item.id === currentRefundOrderId.value){
              updateData = {...item};
              return;
            }
          })
        }
      }

      replaceItem(currentRefundOrderId.value, updateData);
    }



    // return;
    dataModel.value = true;

  }).catch((error) => {
    loading.value = false;
    message.error(error.message);
    return false;
  });

}

//申请退款 同意按钮回调
const agreeHandle = (record) => {

  currentRefundOrderId.value = record.order_id;

  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要同意退款吗?',
    okText: '확인',
    cancelText: '취소',
    centered:true,
    onOk: () => {
      handleSuccessRefund(record.refund_id);
    }
  });
}

//申请退款 拒绝按钮回调
const refusedHandle = (record) => {

  currentRefundOrderId.value = record.order_id;
  const reason = ref('');

  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', null, [
      createVNode('p', null, '确定要拒绝退款吗?'),
      createVNode(Textarea, {
        placeholder: '请输入拒绝理由',
        'onUpdate:value': (value) => reason.value = value
      })
    ]),
    okText: '확인',
    cancelText: '취소',
    centered: true,
    onOk: () => {
      handleFailRefund(record.refund_id, reason.value); // 将理由传递给处理函数
    }
  });

}

//同意退款处理逻辑
const handleSuccessRefund = (id) => {

  const oParam = {
    refund_id : id
  }

  requestPost('/api/user/quota/order/success/refund',oParam, (data) => {

    if (data){
      message.success('同意退款成功')
      editData(currentOrderId.value);
    }
  });
}

//拒绝退款处理逻辑
const handleFailRefund = (id, reason) => {
  console.log(id, reason);

  const oParam = {
    refund_id : id,
    memo : reason
  }

  requestPost('/api/user/quota/order/fail/refund',oParam, (data) => {

    if (data){
      message.success('拒绝退款成功')
      editData(currentOrderId.value);
    }
  });

}


//按默认 格式化为金额
const  numberFormat= (num) => {
  return parseFloat(num).toLocaleString();
};

//时间格式化
function formatDate(dateString) {
  // 将输入的日期字符串转换为 Date 对象
  const date = new Date(dateString);

  // 获取年份、月份和日期
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() 返回值是 0-11，需要加 1
  const day = date.getDate();

  // 返回格式化后的字符串
  return `${year}.${month}.${day}`;
}

//时间格式化
function formatDateTime(dateString) {
  // 将输入的日期字符串转换为 Date 对象
  const date = new Date(dateString);

  // 获取年份、月份、日期、小时、分钟和秒
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() 返回值是 0-11，需要加 1
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // 返回格式化后的字符串
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}


const replaceItem = (orderId, data) => {

  dataSource.value.forEach((item, index) => {

    if (item.isParentOrder && item.hasOwnProperty('children') && item.children.length > 0) {
      item.children.forEach((child_item, child_index) => {
        if(child_item.id == orderId) {
          const newData = {...data}
          dataSource.value[index].children[child_index] = newData
        }
      })
    }

    if(item.id == orderId) {
      const newData = {...data}
      newData.No=dataSource.value[index].No
      dataSource.value[index] = newData
    }
  })

}

//详情模态框 确定回调
// const handleDataOk = () => {
//   dataModel.value = false;
// }



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

.detail-summaryCell {
  background-color: #d9d9d961;
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
  min-width: 135px;
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
.card-search-form >>> .ant-select-selector{
  border-right: 0;
  border-radius: 5px 0 0 5px;
}
.card-search-form >>> .ant-input{
  border-radius: 0;
}


.card-count-content:hover{
  cursor: pointer;
}

</style>
