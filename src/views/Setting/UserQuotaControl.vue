<template>

    <Loading
        v-model:active="loading"
        :can-cancel="false"
        :is-full-page="true"
    />

    <div v-if="isAdmin">
        <a-card title="서비스 권한 관리" :bordered="false">
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

                        <a-select-option v-for="(item,index) in plans" :value="index">{{ planTypeMap[index] }}</a-select-option>

                    </a-select>
                </a-descriptions-item>

                <a-descriptions-item label="서비스 기간">
                    <a-range-picker
                        v-model:value="search_day"
                        value-format="YYYY-MM-DD"
                    />
                </a-descriptions-item>
                <!--        <a-descriptions-item label="이미지 자동번역">-->
                <!--          <a-select-->
                <!--              v-model:value="auto_trans_image"-->
                <!--              style="width: 200px"-->
                <!--          >-->
                <!--            <a-select-option value="">전체</a-select-option>-->
                <!--            <a-select-option value="true">사용함</a-select-option>-->
                <!--            <a-select-option value="false">사용안함</a-select-option>-->

                <!--          </a-select>-->
                <!--        </a-descriptions-item>-->

            </a-descriptions>

            <div style="display: flex;justify-content: center;">
                <a-button type="primary" @click.prevent="search" class="mt15">검색</a-button>
                <a-button @click="initSearch" class="ml15 mt15">초기화</a-button>
            </div>
        </a-card>


        <a-card :bordered="false" class="mt20">

            <div style="display: flex;justify-content: space-between">

                <div style="align-items: center">
                    <a-switch v-model:checked="isShowDef" checked-children="기본서비스 숨김" un-checked-children="기본서비스 노출" />
                </div>

                <div style="
                 display: flex;
                 justify-content: flex-end;
                 align-items: center;
              ">
                    <!--금지어 추가 버튼-->
                    <div>
                        <a-button type="primary" :disabled="!hasMoreSelected" size="small" @click="openModel = true" class="ml5">서비스플랜 일괄추가</a-button>
                        <a-button type="primary" :disabled="!hasMoreSelected" size="small" @click="handleDelAll" class="ml5">서비스플랜 일괄삭제</a-button>
                        <a-modal v-model:open="openModel" :title="`서비스플랜 추가[${checkedUserName.join()}]`" @ok="handleAdd" :closable="false">
                            <a-radio-group v-model:value="plan">
                                <a-radio v-for="(item, index) in plans" :key="index" :style="radioStyle" :value="index">{{ planTypeMap[index] }}</a-radio>
                            </a-radio-group>
                        </a-modal>
                        <a-button type="primary" :disabled="!hasSelected" size="small" @click="handleDelay(5)" class="ml10">서비스 사용기한 5일 연장</a-button>
                        <a-button type="primary" :disabled="!hasSelected" size="small" @click="handleDelay(15)" class="ml5">서비스 사용기한 15일 연장</a-button>
                        <a-button type="primary" :disabled="!hasSelected" size="small" @click="handleOk" class="ml5">서비스 초기화</a-button>
                        <a-button type="primary" :disabled="!hasSelected" size="small" @click="resetSoresCnt('auto_trans_image_count')"  class="ml5">이미지 자동번역 횟수 일괄변경</a-button>
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
            </div>


            <a-table :bordered="false"
                     :columns="columns"
                     :row-key="record => record.id"
                     :data-source="dataSource"
                     :row-selection="{ checkStrictly: false,selectedRowKeys: tableRowKeys, onChange: onSelectChange }"
                     :pagination="{ hideOnSinglePage: true, disabled: true, pageSize: pageSize }"
                     class="mt20 yy_table"
                     :indent-size="30"
                     :expandRowByClick="true"
                     :expandedRowKeys="expandedRowKeys"
                     @expand="handleExpand"
                     :rowClassName="rowClassName"
                     :scroll="{ x: 'max-content' }">
                <!--body-->
                <template v-slot:bodyCell="{ text, record, index, column }">

                    <!--          <template v-if="column.key === 'auto_trans_image'">-->
                    <!--            <span>{{ text === true ? '사용함' : '사용안함'}}</span>-->
                    <!--          </template>-->

                    <template v-if="column.key === 'plan_type_label'">
                        <a-tooltip :title="text">
                            <span style="width: 120px;display: block;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;">{{ text }}</span>
                        </a-tooltip>
                    </template>

                    <template v-if="column.key === 'operation' && !record.hasOwnProperty('children') && record.plan_type !== 'DefaultPlan'"><a @click="editData(index,record)">수정</a></template>
                </template>

            </a-table>

            <a-modal v-model:open="dataModel"
                     @ok="handleDataOk"
                     @cancel="handleDataCancel"
                     :closable="false">
                <a-form
                    :model="editableData"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    ref="formRef"
                    :rules="rules">

                    <a-form-item  label="아이디">
                        <a-input :disabled="true" :value="editableData.user_name" />
                    </a-form-item>

                    <a-form-item has-feedback label="시작일시" name="start_time">
                        <a-date-picker :get-popup-container="(trigger) => {
                return trigger.parentNode;
            }" v-model:value="editableData.start_time"
                                       show-time
                                       value-format="YYYY-MM-DD HH:mm:ss">
                        </a-date-picker>
                    </a-form-item>

                    <a-form-item has-feedback label="종료일시" name="end_time">
                        <a-date-picker :get-popup-container="(trigger) => {
                return trigger.parentNode;
            }" v-model:value="editableData.end_time"
                                       show-time
                                       value-format="YYYY-MM-DD HH:mm:ss">
                        </a-date-picker>
                    </a-form-item>

                    <a-form-item label="서비스">
                        <a-input :disabled="true" :value="editableData.plan_type_label" />
                    </a-form-item>

                    <a-form-item has-feedback label="상품 수집수" name="taobao_count">
                        <a-input-number

                            v-model:value="editableData.taobao_count"
                        />
                    </a-form-item>

                    <!--          <a-form-item has-feedback label="이미지 자동번역">-->
                    <!--            <a-radio-group v-model:value="editableData.auto_trans_image">-->
                    <!--              <a-radio :value="true">사용함</a-radio>-->
                    <!--              <a-radio :value="false">사용안함</a-radio>-->
                    <!--            </a-radio-group>-->
                    <!--          </a-form-item>-->

                    <a-form-item has-feedback label="이미지 자동번역 횟수" name="auto_trans_image_count">
                        <a-input-number

                            v-model:value="editableData.auto_trans_image_count"
                        />

                    </a-form-item>

                    <!--          <a-form-item label="이미지 자동번역">-->
                    <!--            <a-switch v-model:checked="editableData.auto_trans_image" />-->
                    <!--          </a-form-item>-->

                    <a-form-item has-feedback label="이미지 번역 횟수" name="trans_image_count">
                        <a-input-number

                            v-model:value="editableData.trans_image_count"
                        />
                    </a-form-item>

                    <a-form-item has-feedback label="GPT 사용횟수" name="gpt_count">
                        <a-input-number

                            v-model:value="editableData.gpt_count"
                        />
                    </a-form-item>

                    <a-form-item has-feedback label="지마켓 상품 수집수" name="gmarket_count">
                        <a-input-number

                            v-model:value="editableData.gmarket_count"
                        />
                    </a-form-item>

                    <a-form-item has-feedback label="옥션 상품 수집수" name="auction_count">
                        <a-input-number

                            v-model:value="editableData.auction_count"
                        />
                    </a-form-item>

                    <!--          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">-->
                    <!--            <a-button type="primary" @click="submitForm">Submit</a-button>-->
                    <!--            <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>-->
                    <!--          </a-form-item>-->

                </a-form>

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
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import "vue-loading-overlay/dist/vue-loading.css";

const loading = ref(false);
// const userName = Cookie.get("member_name");
const isAdmin = Cookie.get("member_roles").indexOf("ROLE_ADMIN") !== -1;
const username = ref("");
const plan_type = ref("");
const search_day = ref(null);
// const auto_trans_image = ref("");

const tableRowKeys = ref([]);
const checkedId = ref([]);
const checkedUserId = ref([]);
const checkedUserName = ref([]);

const hasSelected = computed(() => checkedId.value.length > 0);
const hasMoreSelected = computed(() => checkedUserId.value.length > 0);

const isShowDef = ref(false);

const dataSource = ref([]);

//展示当前行 modal
const dataModel = ref(false);



//table 编辑模式 || 文本模式
const labelCol = {
    style: {
        width: '150px',
    },
};
const wrapperCol = {
    span: 14,
};
const formRef = ref();
const editableData = reactive({});
const editIndex = ref(null);

const expandedRowKeys = ref([]);

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
        title: "No.",
        dataIndex: "No",
        key: "No",
        align: "center",
    },
    {
        title: "아이디",
        dataIndex: "user_name",
        key: "user_name",
        // width: 80,
        align: "center",
    },
    {
        title: "시작일시",
        dataIndex: "start_time",
        key: "start_time",
        align: "center",
    },
    {
        title: "종료일시",
        dataIndex: "end_time",
        key: "end_time",
        align: "center",
    },
    {
        title: "서비스",
        dataIndex: "plan_type_label",
        key: "plan_type_label",
        align: "center",
        ellipsis:true
    },
    {
        title: "상품 수집수",
        dataIndex: "taobao_count",
        key: "taobao_count",
        align: "center",
    },
    // {
    //   title: "이미지 자동번역",
    //   dataIndex: "auto_trans_image",
    //   key: "auto_trans_image",
    //   align: "center",
    // },
    {
        title: "이미지 자동번역 횟수",
        dataIndex: "auto_trans_image_count",
        key: "auto_trans_image_count",
        align: "center",
    },
    {
        title: "이미지 번역 횟수",
        dataIndex: "trans_image_count",
        key: "trans_image_count",
        align: "center",
    },
    {
        title: "GPT 사용횟수",
        dataIndex: "gpt_count",
        key: "gpt_count",
        align: "center",
    },
    {
        title: "지마켓 상품 수집수",
        dataIndex: "gmarket_count",
        key: "gmarket_count",
        align: "center",
    },
    {
        title: "옥션 상품 수집수",
        dataIndex: "auction_count",
        key: "auction_count",
        align: "center",
    },
    {
        title: "등록일시",
        dataIndex: "create_time",
        key: "create_time",
        align: "center",
    },
    {
        title: "수정일시",
        dataIndex: "update_time",
        key: "update_time",
        align: "center",
    },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        align: "center",
    },
];

const validateEndtime = async (_rule, value) => {
    if (!value){
        return Promise.reject('종료일시를 선택해주세요.');
    }else if (value < editableData.start_time){
        return Promise.reject('시작일시는 종료일시보다 앞으로 설정하셔야 합니다.');
    }else{
        return Promise.resolve();
    }
}

const validateCnt = async (_rule, value) => {
    if (value === null){
        return Promise.reject('값이 비여있습니다. 반드시 입력하여 주시기 바랍니다.');
    }else if (value < 0 && value !== -9999){
        return Promise.reject('반드시 양수여야 합니다.');
    }else if (!Number.isInteger(value)){
        return Promise.reject('반드시 정수여야 합니다.');
    }else {
        return Promise.resolve();
    }
}

//验证规则
const rules = {
    start_time : [
        {
            required:true,
            message: '시작일시를 선택해주세요.',
            trigger:'change'
        }
    ],
    end_time : [
        {
            required:true,
            validator: validateEndtime,
            trigger:'change'
        }
    ],
    taobao_count : [
        {
            required:true,
            validator: validateCnt,
            trigger:'change'
        }
    ],
    auto_trans_image_count : [
        {
            required:true,
            validator: validateCnt,
            trigger:'change'
        }
    ],
    trans_image_count : [
        {
            required:true,
            validator: validateCnt,
            trigger:'change'
        }
    ],
    gpt_count : [
        {
            required:true,
            validator: validateCnt,
            trigger:'change'
        }
    ],
    gmarket_count : [
        {
            required:true,
            validator: validateCnt,
            trigger:'change'
        }
    ],
    auction_count : [
        {
            required:true,
            validator: validateCnt,
            trigger:'change'
        }
    ],
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
    search();
    getAllplan();
})

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    search();
  }
}

const initSearch = () => {
    username.value = '';
    plan_type.value = '';
    search_day.value = null;
    // auto_trans_image.value = '';
}

const onSelectChange = (selectedRowKeys,selectedRows) => {

    console.log('reow',selectedRows);
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    tableRowKeys.value = selectedRowKeys;

    // let isDefault = false;
    // const rowsArr = [...selectedRows];
    // for (let rowsArrElement of rowsArr) {
    //   if (rowsArrElement.plan_type === 'DefaultPlan'){
    //     isDefault = true;
    //     const indexToRemove = tableRowKeys.value.indexOf(rowsArrElement.id);
    //     tableRowKeys.value = tableRowKeys.value.slice(0, indexToRemove).concat(tableRowKeys.value.slice(indexToRemove + 1));
    //   }
    // }
    //
    // if (isDefault){
    //   message.warning('기본서비스는 수정할 수 없습니다.')
    //   return;
    // }

    checkedUserName.value = [];
    let rowKeys = [...selectedRowKeys];
    rowKeys = rowKeys.filter((item) => {
        return Number.isInteger(item);
    });
    checkedId.value = rowKeys.filter(checkRowKeys);

    const arr = rowKeys.map(checkUserRowKeys);

    checkedUserId.value = [...new Set(arr)]
    checkedUserName.value = [...new Set(checkedUserName.value)]

    // console.log('zzyy',checkedId.value);
    // console.log('yyyy',checkedUserId.value);

};

// const handleSelect = (record, selected, selectedRows, nativeEvent) => {
//
//   if (record.plan_type === 'DefaultPlan'){
//     message.warning('기본서비스는 수정할 수 없습니다.');
//     console.log('tar',tableRowKeys.value);
//     tableRowKeys.value = tableRowKeys.value.filter((item) => {;
//       return item !== record.id;
//     })
//   }
//
//   console.log('record',record, selected, selectedRows, nativeEvent);
// }


const checkRowKeys = (id) => {
    return dataSource.value.some((item) => {
        const res = item.children.find((val) => {
            return val.id === id;
        })
        return res && res.plan_type !== "DefaultPlan"
    })
}

const checkUserRowKeys = (id) => {
    for (const item of dataSource.value) {
        const res = item.children.find((val) => {
            return val.id === id;
        });
        if (res) {
            checkedUserName.value.push(res.user_name)
            return res.user_id;
        }
    }
}

const planTypeMap = {
    DefaultPlan: '기본플랜',
    PreviewPlan: '베타버전',
    BasicPlan1Month: '기본서비스 1개월',
    BasicPlan6Month: '기본서비스 6개월',
    BasicPlan12Month: '기본서비스 12개월',
    Extra1PlanAutoImage: '이미지 자동 번역',
    Extra2PlanGPT100: 'AI GPT 서비스 100개',
    Extra2PlanGPT150: 'AI GPT 서비스 150개',
    Extra2PlanGPT200: 'AI GPT 서비스 200개',
    Extra2PlanGPT250: 'AI GPT 서비스 250개',
    Extra2PlanGPT300: 'AI GPT 서비스 300개',
    Extra3PlanMarketCollect100: 'ESM 원클릭 수집 100',
    Extra3PlanMarketCollect150: 'ESM 원클릭 수집 150',
    Extra3PlanMarketCollect200: 'ESM 원클릭 수집 200',
    Extra3PlanMarketCollect250: 'ESM 원클릭 수집 250',
    Extra3PlanMarketCollect300: 'ESM 원클릭 수집 300',
    Extra1PlanAutoImageCount100: '이미지 자동번역100',
    Extra1PlanAutoImageCount200: '이미지 자동번역200',
    Extra1PlanAutoImageCount300: '이미지 자동번역300',
}

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

    if (search_day.value) {

        oParam.start_time = Math.floor(Date.parse(search_day.value[0] + ' 00:00:00') / 1000);
        oParam.end_time = Math.floor(Date.parse(search_day.value[1] + ' 23:59:59') / 1000);
    }

    // if (auto_trans_image.value !== '') {
    //   oParam.auto_trans_image = auto_trans_image.value;
    // }

    tableRowKeys.value  = [];
    expandedRowKeys.value = [];

    requestPost('/api/user/quota/search',oParam, (data) => {

        total.value = Number(data.total);

        dataSource.value = data.list.map((item,key) => {
            item.No = total.value - (current.value - 1) * pageSize.value - key
            return {...item};
        })

    });

};


/**
 * 下拉框选择回调
 * @param value
 */
const handleChange = (value) => {
    plan_type.value = value;
};


const storeNameMap = {
    'gpt_count': 'GPT',
    'gmarket_count': 'GMARKET',
    'auction_count': 'AUCTION',
    'auto_trans_image_count':'IMAGE'
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
        user_quota_ids: checkedId.value,
    }

    Modal.confirm({
        icon: createVNode(ExclamationCircleOutlined),
        content: '서비스플랜을 초기화하시겠습니까?',
        okText: '확인',
        cancelText: '취소',
        onOk: () => {
            resetPlan(oParam)
        }
    });

}



/**
 * 批量update个数
 * @return {boolean}
 */
const handleStoreOk = () => {

    if (!Number.isInteger(storeCnt.value) || storeCnt.value < 0 ) {
        message.warning('양의 정수를 입력하여 주세요')
        return false;
    }

    const oParam = {
        user_quota_ids: checkedId.value,
        [currentStoreId.value]: storeCnt.value
    }

    Modal.confirm({
        icon: createVNode(ExclamationCircleOutlined),
        content: `${currentStoreName.value}수량을 수정하시겠습니까?`,
        okText: '확인',
        cancelText: '취소',
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

    requestPost('/api/user/quota/reset/plan',params, () => {
        message.success('success_plan_rest');
    });

}

/**
 * 批量添加套餐
 */

const handleAdd = () => {

    const oParam = {
        user_ids: checkedUserId.value,
        plan_name: plan.value
    }

    Modal.confirm({
        icon: createVNode(ExclamationCircleOutlined),
        content: `${plan.value}서비스플랜을 수정하시겠습니까?`,
        okText: '확인',
        cancelText: '취소',
        onOk: () => {
            addPlan(oParam)
        }
    });
}

/**
 * 批量删除套餐
 */

const handleDelAll = () => {

    if (checkedId.value.length === 0){
        message.warning("기본서비스는 삭제할 수 없습니다.")
        return;
    }

    const oParam = {
        user_quota_ids: checkedId.value,
    }

    Modal.confirm({
        icon: createVNode(ExclamationCircleOutlined),
        content: `[${checkedUserName.value.join()}]서비스플랜을 삭제하시겠습니까?`,
        okText: '확인',
        cancelText: '취소',
        onOk: () => {
            delPlan(oParam)
        }
    });
}

/**
 * 批量添加套餐
 * @param params
 */

const addPlan = (params) => {

    requestPost('/api/user/quota/plan/add',params, () => {
        message.success('추가 성공');
        openModel.value = false;
    });

}

/**
 * 批量删除套餐
 */

const delPlan = (params) => {

    requestPost('/api/user/quota/plan/remove',params, () => {
        message.success('삭제 성공');
    });

}

/**
 * 批量更新store个数
 * @param params
 */
const updateCnt = (params) => {

    requestPost('/api/user/quota/update',params, () => {
        storeCnt.value = '';
        cntModel.value = false;
        message.success('업데이트 성공');
    });
}


const getAllplan = () => {
    AuthRequest.get(process.env.VUE_APP_API_URL + "/api/user/quota/plan/all").then((res) => {
        /* fail */
        if (res.status !== "2000") {
            message.error(res.message);
            return false;
        }

        console.log('allplan',res.data)
        /**
         * 자동이미지 숨김 폰론트단에서 처리
         */
        delete res.data['Extra1PlanAutoImage']

        plans.value = res.data;
        plan.value = Object.keys(res.data)[0];

    }).catch((error) => {
        message.error('Error fetching data:', error);
    })
}

const editData = (index,record) => {
    if (formRef.value){
        formRef.value.resetFields();
    }

    editIndex.value = index;
    Object.assign(editableData, { ...record })
    dataModel.value = true;

}

const handleDataOk = () => {
    submitForm();
}

const handleDataCancel = () => {
    Object.assign(editableData, {})
}

const rowClassName = (record, index) => {
    if (isShowDef.value === false && !record.hasOwnProperty('children') && record.plan_type === "DefaultPlan"){
        return 'yy_deplan';
    }else{
        return '';
    }
    // console.log('zz',expandedRowKeys);
    // if (expandedRowKeys.value.indexOf(record.id) !== -1) {
    //   return 'expanded-row';
    // }else {
    //   return '';
    // }
}


const submitForm = () => {

    formRef.value
        .validate()
        .then(() => {

            let oParam = { ...editableData };

            // const start_time = Math.floor(Date.parse(editableData['start_time']) / 1000);
            // const end_time = Math.floor(Date.parse(editableData['end_time']) / 1000);
            const start_time = editableData['start_time'];
            const end_time = editableData['end_time'];
            oParam = {...oParam, user_quota_ids: [oParam.id], start_time, end_time}


            requestPost('/api/user/quota/update',oParam, () => {
                dataModel.value = false;
                message.success('업데이트 성공');
            });

        })
        .catch(error => {
            console.log('error', error);
        });

}

const handleExpand = (expanded, record) => {
    if (expanded){
        expandedRowKeys.value.push(record.id);
    }else {
        expandedRowKeys.value = expandedRowKeys.value.filter((item) => {
            return item !== record.id;
        })
    }
}

const handleDelay = (day) => {

    const oParam = {
        user_quota_ids: checkedId.value,
        delay_days: day
    }

    Modal.confirm({
        icon: createVNode(ExclamationCircleOutlined),
        content: `서비스 사용기간을 연장하시겠습니까?`,
        okText: '확인',
        cancelText: '취소',
        onOk: () => {
            delayDay(oParam)
        }
    });
}

const delayDay = (params) => {
    requestPost('/api/user/quota/update',params, () => {
        message.success('success_day_delay');
    });
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
        if (!res.data.hasOwnProperty('list')){
            res.data.forEach((item) => {
                let sub = null
                const res = dataSource.value.some((val,index) => {
                    sub = index;
                    return item.id === val.id;
                })

                if (res && sub !== null) {
                    dataSource.value[sub] = {...item};
                }

            })
        }

        checkedId.value =[];
        checkedUserId.value = [];
        checkedUserName.value = [];
        tableRowKeys.value = [];
        callback(res.data);

    }).catch((error) => {
        loading.value = false;
        message.error('Error fetching data:', error);
    })

}


// const resetForm = () => {
//   console.log('重置数据');
//   dataSource.value.forEach((item) => {
//     if (item.id === editableData.id){
//       Object.assign(editableData, { ...item })
//     }
//   })
// }


</script>


<style scoped>

.user-span {
    display: block;
    width: 100%;
    cursor: pointer;
}

</style>

<style>


.yy_deplan {
    display: none!important;
}

.yy_table .ant-table-row.ant-table-row-level-1{
    background-color: blanchedalmond!important;
}

.yy_table .ant-table-row.ant-table-row-level-1 .ant-table-cell-row-hover {
    background-color: blanchedalmond!important;
}


</style>