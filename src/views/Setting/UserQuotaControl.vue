<template>

  <Loading
      v-model:active="loading"
      :can-cancel="false"
      :is-full-page="true"
  />

  <div v-if="isAdmin">
    <a-card title="금지어 관리" :bordered="false">
      <a-descriptions bordered size="middle" :column="1" :labelStyle="{ width: '200px' }">
        <a-descriptions-item label="아이디">
          <a-input  v-model:value="username" style="width: 200px;" placeholder="아이디를 입력해주세요."/>
        </a-descriptions-item>

        <a-descriptions-item label="서비스 유형">
          <a-select
              class="mr10"
              v-model:value="plan_type"
              style="width: 200px"
              @change="handleChange"
          >
            <a-select-option value="">전체</a-select-option>

            <a-select-option v-for="(item,index) in plans" value="index">{{ index }}</a-select-option>


          </a-select>
        </a-descriptions-item>

        <a-descriptions-item label="서비스 기간">
          <a-range-picker
              v-model:value="seerch_day"
              value-format="YYYY-MM-DD"
          />
        </a-descriptions-item>

      </a-descriptions>


      <div style="display: flex;justify-content: center;">
        <a-button type="primary" @click.prevent="search" class="mt15">검색</a-button>
        <a-button @click="initSearch" class="ml15 mt15">초기화</a-button>
      </div>
    </a-card>


    <a-card :bordered="false" class="mt20">

      <div style="
           display: flex;
           justify-content: flex-end;
           align-items: center;
        ">
        <!--금지어 추가 버튼-->
        <div>
          <a-button type="primary" :disabled="!hasSelected" size="small" @click="openModel = true" class="ml5">서비스 초기화</a-button>
          <a-modal v-model:open="openModel" title="서비스 초기화" @ok="handleOk" :closable="false">
            <a-radio-group v-model:value="plan">
              <a-radio v-for="(item, index) in plans" :key="index" :style="radioStyle" :value="index">{{ index }}</a-radio>
            </a-radio-group>
          </a-modal>
          <a-button type="primary" :disabled="!hasSelected" size="small" @click="resetSoresCnt('gpt_count')"  class="ml5">GPT 사용횟수 일괄변경</a-button>
          <a-button type="primary" :disabled="!hasSelected" size="small" @click="resetSoresCnt('gmarket_count')"  class="ml5">지마켓 상품수집 일괄변경</a-button>
          <a-button type="primary" :disabled="!hasSelected" size="small" @click="resetSoresCnt('auction_count')"  class="ml5">옥션 상품수집 일괄변경</a-button>
          <a-modal
              v-model:open="cntModel"
              :title="`서비스 ${currentStoreName}`"
              @ok="handleStoreOk"
              @cancel="handleStoreCancel"
              :closable="false">
            <a-input-number v-model:value="storeCnt" min="0" style="width: 200px" />
          </a-modal>
        </div>
      </div>

      <a-table :bordered="false"
               :columns="columns"
               :row-key="record => record.id"
               :data-source="dataSource"
               :row-selection="{ selectedRowKeys: checkedId, onChange: onSelectChange }"
               :pagination="{ hideOnSinglePage: true, disabled: true, pageSize: pageSize }"
               class="mt20"
               :scroll="{ x: 'max-content' }">
        <!--body-->
        <template v-slot:bodyCell="{ text, record, index, column }">

          <template  v-if="column.key === 'start_time' || column.key === 'end_time'">
            <a-date-picker v-model:value="editableData[index][column.dataIndex[0]][column.dataIndex[1]]"
                           show-time
                           value-format="YYYY-MM-DD HH:mm:ss"
                           :open=isAuto
                           @openChange="openChange"
                           v-if="editable && editingRowIndex === index && editingColumnKey === column.key"
                           @keydown.enter="editable = false">

            </a-date-picker>
            <span class="user-span" v-else @click="startEditing(index, column.key)">{{ text || ' ' }}</span>
          </template>

          <template v-if="
          column.key === 'gpt_count'
          || column.key === 'gmarket_count'
          || column.key === 'auction_count'
          || column.key === 'taobao_count'
          || column.key === 'trans_image_count'">
            <a-input-number
                min="0"
                v-model:value="editableData[index][column.dataIndex[0]][column.dataIndex[1]]"
                v-if="
              editable
              && editingRowIndex === index
              && editingColumnKey === column.key
              && editableData[index][column.dataIndex[0]][column.dataIndex[1]] != '-9999'"
                @keydown.enter="editable = false"
                @blur="onSave(index)"
            />
            <span class="user-span" v-else @click="startEditing(index, column.key)">{{ text === -9999 ? '无限制' : text }}</span>
          </template>

          <template v-if="column.key === 'edit'">
            <a-button danger @click="resetCnt(record)">서비스 초기화</a-button>
          </template>

        </template>

      </a-table>

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
    不是管理员
  </div>
</template>


<script setup>
import {ref, reactive, computed, onMounted, createVNode} from "vue";
import Loading from "vue-loading-overlay";
import {cloneDeep} from "lodash-es";
import Cookie from "js-cookie";
import {message, Modal} from "ant-design-vue";
import {AuthRequest} from "@/util/request";
import {ExclamationCircleOutlined, FileSyncOutlined, QuestionCircleOutlined} from "@ant-design/icons-vue";
import "vue-loading-overlay/dist/vue-loading.css";

const loading = ref(false);
const userName = Cookie.get("member_name");
const isAdmin = Cookie.get("member_roles").indexOf("ROLE_ADMIN") !== -1;
const username = ref("");
const plan_type = ref("");
const seerch_day = ref(null);

const checkedId = ref([]);
const hasSelected = computed(() => checkedId.value.length > 0);


const dataSource = ref([]);

//table 编辑模式 || 文本模式
const editableData = reactive({});
const editable = ref(false);
const editingRowIndex = ref(null);
const editingColumnKey = ref(null);

//DatePiccker 是否open
const isAuto = ref(false);

//model 选定套餐
const plan = ref(null);
const openModel = ref(false);
const cntModel = ref(false);
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});

//所有套餐
const plans = ref([]);

//批量修改 modal inputNum cnt
const storeCnt = ref('');
const currentStoreName = ref(null);
const currentStoreId = ref(null);

//分页
const total = ref(0);
const current = ref(1);
const pageSize = ref(10);
const pageSizeOptions = ref(["10", "20", "30", "40", "50"]);
/* 페이징 Method */
const onChange = (iCurrent, iPageSize) => {
  current.value = iCurrent;
  pageSize.value = iPageSize;
  search();
};

const columns = [
  {
    title: "아이디",
    dataIndex: "username",
    key: "username",
    width: 80,
    align: "center",
    fixed: "left"
  },
  {
    title: "시작일시",
    dataIndex: ['quota', 'start_time'],
    key: "start_time",
    align: "center",
  },
  {
    title: "종료일시",
    dataIndex: ['quota', 'end_time'],
    key: "end_time",
    align: "center",
  },
  {
    title: "서비스",
    dataIndex: ['quota', 'plan_type'],
    key: "plan_type",
    align: "center",
  },
  {
    title: "상품 수집수",
    dataIndex: ['quota', 'taobao_count'],
    key: "taobao_count",
    align: "center",
  },
  {
    title: "이미지 번역 횟수",
    dataIndex: ['quota', 'trans_image_count'],
    key: "trans_image_count",
    align: "center",
  },
  {
    title: "GPT 사용횟수",
    dataIndex: ['quota', 'gpt_count'],
    key: "gpt_count",
    align: "center",
  },
  {
    title: "지마켓 상품 수집수",
    dataIndex: ['quota', 'gmarket_count'],
    key: "gmarket_count",
    align: "center",
  },
  {
    title: "옥션 상품 수집수",
    dataIndex: ['quota', 'auction_count'],
    key: "auction_count",
    align: "center",
  },
  {
    title: "등록일시",
    dataIndex: ['quota', 'create_time'],
    key: "create_time",
    align: "center",
  },
  {
    title: "수정일시",
    dataIndex: ['quota', 'update_time'],
    key: "update_time",
    align: "center",
  },
  {
    title: "관리",
    dataIndex: "edit",
    key: "edit",
    width: 80,
    align: "center",
    fixed: "right"
  },
];

onMounted(() => {
  search();
  getAllplan();
})

const initSearch = () => {
  username.value = '';
  plan_type.value = '';
  seerch_day.value = null;
}

const onSelectChange = selectedRowKeys => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  checkedId.value = selectedRowKeys;
};


const search = () => {

  const oParam = {
    page: current.value,
    page_size: pageSize.value,

  }

  if (username.value && username.value.trim() !== '') {
    oParam.username = username.value;
  }

  if (plan_type.value) {
    oParam.plan_type = plan_type.value;
  }

  if (seerch_day.value) {

    oParam.start_time = Math.floor(Date.parse(seerch_day.value[0] + ' 00:00:00') / 1000);
    oParam.end_time = Math.floor(Date.parse(seerch_day.value[1] + ' 23:59:59') / 1000);
  }


  loading.value = true;


  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user/quota/search",
      oParam
  ).then((res) => {

    loading.value = false;
    /* fail */
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    total.value = Number(res.data.total);


    dataSource.value = res.data.list.map((item) => {

      return {...item};
    })


  }).catch((error) => {
    loading.value = false;
    message.error('Error fetching data:', error);
  });

};


/**
 * 下拉框选择回调
 * @param value
 */
const handleChange = (value) => {
  plan_type.value = value;
};

/**
 * 重置当前套餐回调
 * @param id
 */
const resetCnt = (obj) => {
  const oParam = {
    user_id: [obj.id],
    plan_name: obj.quota.plan_type
  }

  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认要重置 ' + obj.quota.plan_type + ' 吗?',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      resetPlan(oParam)
    }
  });
}


const storeNameMap = {
  'gpt_count': 'GPT',
  'gmarket_count': 'GMARKET',
  'auction_count': 'AUCTION'
}
/**
 * 批量set Count
 * @param type
 */
const resetSoresCnt = (type) => {
  cntModel.value = true;
  currentStoreId.value = type;
  currentStoreName.value = storeNameMap[type];
}


const handleOk = () => {
  const oParam = {
    user_id: checkedId.value,
    plan_name: plan.value
  }

  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认要重置为 ' + plan.value + ' 吗?',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      resetPlan(oParam)
    }
  });


}

//正整数正则验证
function isPositiveInteger(value) {
  // 使用正则表达式匹配输入值是否为正整数
  return /^\d+$/.test(value);
}

/**
 * 批量update个数
 * @return {boolean}
 */
const handleStoreOk = () => {

  if (!storeCnt.value) {
    message.warning('请输入数字类型')
    return false;
  }

  if (!isPositiveInteger(storeCnt.value)) {
    message.warning('请输入正整数')
    return false;
  }

  const oParam = {
    user_id: checkedId.value,
    [currentStoreId.value]: storeCnt.value
  }

  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认要修改 ' + currentStoreName.value + ' 个数吗?',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      updateCnt(oParam)
    }
  });

}

const handleStoreCancel = () => {
  storeCnt.value = '';
}

//重置套餐(单/多)
const resetPlan = (params) => {
  loading.value = true;

  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user/quota/reset/plan",
      params
  ).then((res) => {

    loading.value = false;
    /* fail */
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success('success_plan_rest');

    dataSource.value = dataSource.value.map((item) => {
      const data = res.data.find((val) => {
        return val.id === item.id
      })
      if (data) {
        return {...data}
      } else {
        return {...item}
      }
    })

    openModel.value = false;
  }).catch((error) => {
    loading.value = false;
    message.error('Error fetching data:', error);
  })

}

/**
 * 批量更新store个数
 * @param params
 */
const updateCnt = (params) => {
  loading.value = true;

  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user/quota/update",
      params
  ).then((res) => {

    loading.value = false;
    /* fail */
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success('success_cnt_update');

    dataSource.value = dataSource.value.map((item) => {
      const data = res.data.find((val) => {
        return val.id === item.id
      })
      if (data) {
        return {...data}
      } else {
        return {...item}
      }
    })

    storeCnt.value = '';
    cntModel.value = false;
  }).catch((error) => {
    loading.value = false;
    message.error('Error fetching data:', error);
  })

}

const startEditing = (index, columnKey) => {
  editable.value = true;
  editingRowIndex.value = index;
  editingColumnKey.value = columnKey;
  isAuto.value = true
  editableData[index] = cloneDeep(dataSource.value[index]);
  setTimeout(() => {
    const input = document.querySelector('.ant-table-cell .ant-input-number-input');
    if (input) {
      input.focus();
    }
  }, 0);
};
const onSave = (index) => {

  editable.value = false;
  editingRowIndex.value = null;
  editingColumnKey.value = null;
  isAuto.value = false;

  const isNull = Object.values(editableData[index]['quota']).includes(null)

  const gpt_rules = isPositiveInteger(editableData[index]['quota']['gpt_count']);
  const gmarket_rules = isPositiveInteger(editableData[index]['quota']['gmarket_count']);
  const auction_rules = isPositiveInteger(editableData[index]['quota']['auction_count']);

  let taobao_rules = true;
  if (editableData[index]['quota']['taobao_count'] != '-9999') {
    taobao_rules = isPositiveInteger(editableData[index]['quota']['taobao_count']);
  }

  let trans_image_rules = true;
  if (editableData[index]['quota']['taobao_count'] != '-9999') {
    trans_image_rules = isPositiveInteger(editableData[index]['quota']['trans_image_count']);
  }

  //判断数字 是否为整数
  if (isNull || !gpt_rules || !gmarket_rules || !auction_rules || !taobao_rules || !trans_image_rules) {
    delete editableData[index];
    return;
  }


  const {id, quota} = editableData[index];

  const start_time = Math.floor(Date.parse(quota['start_time']) / 1000);
  const end_time = Math.floor(Date.parse(quota['end_time']) / 1000);

  const oParam = {...quota, user_id: [id], start_time, end_time}

  delete oParam.id;

  loading.value = true;

  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user/quota/update",
      oParam
  ).then((res) => {
    loading.value = false;

    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success('success_row_update');

    const data = dataSource.value[index];

    Object.assign(data, editableData[index]);

  }).catch((error) => {
    loading.value = false;
    message.error('Error fetching data:', error);
  })

};

const getAllplan = () => {
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/user/quota/plan/all").then((res) => {
    /* fail */
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    plans.value = res.data;
    plan.value = Object.keys(res.data)[0];

  }).catch((error) => {
    message.error('Error fetching data:', error);
  })
}

const openChange = (state) => {

  if (isAuto.value === state) return;

  if (!state) {
    onSave(editingRowIndex.value);
  } else {
    isAuto.value = state;
  }
}


</script>


<style scoped>

.user-span {
  display: block;
  width: 100%;
  cursor: pointer;
}

</style>