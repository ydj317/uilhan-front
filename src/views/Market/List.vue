<template>
    <div id="container" >
        <loading v-model:active="bLoading"
                 :can-cancel="false"
                 :is-full-page="true"/>

        <div v-if="showPopup" @click="closePopupFn" class="popupMask"></div>
        <div v-if="showPopup" class="popup_box">
            <div class="popup_title clearfix">
                <div class="title clearfix">
                    <div class="text">마켓 설정등록</div>
                </div>
                <a href="##" @click="closePopupFn" class="cross_btn"><span class="cross"></span></a>
            </div>
            <div ref="popupContent" class="popup_cont">
                <div class="content">
                    <div class="popup_table">
                        <div class="title clearfix">
                            <div class="text">마켓 연동 필수값</div>
                        </div>
                        <table class="table">
                            <colgroup>
                                <col width="125px" />
                                <col width="auto" />
                                <col width="125px" />
                                <col width="auto" />
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>마켓 선택 <span>*</span></th>
                                <td colspan="3">
                                    <a-select :options="SITE_CODE_LIST" v-model:value="marketItem.site_code">
                                    </a-select>
                                </td>
                            </tr>
                            <tr>
                                <th>API Key <span v-show="MUST_DATA[marketItem.site_code]['apiKey'] == 'true'">*</span></th>
                                <td>
                                    <a-input v-model:value="marketItem.apiKey" placeholder="" style="width: 190px;" />
                                </td>
                                <th>API Ticket Key <span v-show="MUST_DATA[marketItem.site_code]['apiKey'] == 'true'">*</span></th>
                                <td>
                                    <a-input v-model:value="marketItem.apiTicketKey" placeholder="" style="width: 190px;" />
                                </td>
                            </tr>
                            <tr>
                                <th>마켓 아이디 <span v-show="MUST_DATA[marketItem.site_code]['apiKey'] == 'true'">*</span></th>
                                <td>
                                    <a-input v-model:value="marketItem.siteLoginId" placeholder="" style="width: 190px;" />
                                </td>
                                <th>마켓 비밀번호 <span v-show="MUST_DATA[marketItem.site_code]['apiKey'] == 'true'">*</span></th>
                                <td>
                                    <a-input v-model:value="marketItem.siteLoginPw" placeholder="" style="width: 190px;" />
                                </td>
                            </tr>
                            <tr>
                                <th>Master LOGIN ID <span v-show="isEsm">*</span></th>
                                <td>
                                    <a-input v-model:value="marketItem.masterLoginId" placeholder="" style="width: 190px;" />
                                </td>
                                <th>Master LOGIN PASSWORD <span v-show="isEsm">*</span></th>
                                <td>
                                    <a-input v-model:value="marketItem.masterLoginPw" placeholder="" style="width: 190px;" />
                                </td>
                            </tr>
                            <tr>
                                <th>마켓 Company Code <span v-show="MUST_DATA[marketItem.site_code]['apiKey'] == 'true'">*</span></th>
                                <td colspan="3">
                                    <a-input v-model:value="marketItem.apiCompanyCode" placeholder="" style="width: 300px;" />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="popup_text1"><span>*</span> 연동된 마켓의 접근정보(ID변경 포함한 API KEY, API Ticket등)를 변경 저장하면 이후 연동에 오류를 유발합니다.<br>따라서 새로운 계정을 등록하고자 하는 경우, 마켓설정의[수정]이 아닌 신규 설정 추가를 통해 등록해주세요.</div>
                    </div>
                    <div class="popup_table">
                        <div class="title clearfix">
                            <div class="text">부가정보 설정</div>
                        </div>
                        <table class="table">
                            <colgroup>
                                <col width="125px" />
                                <col width="auto" />
                                <col width="125px" />
                                <col width="auto" />
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>노출 상태</th>
                                <td>
                                    <a-radio-group name="radioGroup" v-model:value="marketItem.disp">
                                        <a-radio value="1">노출함</a-radio>
                                        <a-radio value="2">노출안함</a-radio>
                                    </a-radio-group>
                                </td>
                                <th>연동상품유형</th>
                                <td>
                                    <a-radio-group v-model:value="marketItem.product_type">
                                        <a-radio :style="radioStyle" value="1">일반셀러(국내상품 계정)</a-radio>
                                        <a-radio :style="radioStyle" value="2">글로벌셀러(구매대행 계정)</a-radio>
                                        <a-radio :style="radioStyle" value="3">일반&글로벌셀러</a-radio>
                                    </a-radio-group>
                                </td>
                            </tr>
                            <tr>
                                <th>주문 수집 후 자동상태변경</th>
                                <td>
                                    <a-radio-group v-model:value="marketItem.change_order_status">
                                        <a-radio :style="radioStyle" value="1">변경안함</a-radio>
                                        <a-radio :style="radioStyle" value="2">변경함(배송준비중)</a-radio>
                                    </a-radio-group>
                                </td>
                                <th>자동연동설정</th>
                                <td>
                                    <a-radio-group v-model:value="marketItem.auto_update">
                                        <a-radio :style="radioStyle" value="product">상품정보 전체수정</a-radio>
                                        <a-radio :style="radioStyle" value="stock">재고만 수정</a-radio>
                                        <a-radio :style="radioStyle" value="none">미연동</a-radio>
                                    </a-radio-group>
                                </td>
                            </tr>
                            <tr>
                                <th>판매 가격 증가 연동</th>
                                <td colspan="3">
                                    <a-select ref="select" style="width: 150px;" v-model:value="marketItem.price_flag">
                                        <a-select-option value="N">사용안함</a-select-option>
                                        <a-select-option value="A">일괄적용</a-select-option>
                                        <a-select-option value="C">카테고리별 판매수수료 적용</a-select-option>
                                    </a-select>
                                    <a-input v-model:value="marketItem.price_rate" placeholder="" style="margin-left: 5px; width: 100px;" /> %
                                </td>
                            </tr>
                            <tr>
                                <th>정산용 판매수수료</th>
                                <td colspan="3">
                                    <a-select v-model:value="marketItem.commission_flag" ref="select" style="width: 150px;">
                                        <a-select-option value="N">사용안함</a-select-option>
                                        <a-select-option value="A">일괄적용</a-select-option>
                                        <a-select-option value="C">카테고리별 판매수수료 적용</a-select-option>
                                    </a-select>
                                    <a-input v-model:value="marketItem.market_sale_commission" placeholder="" style="margin-left: 5px; width: 100px;" /> %
                                </td>
                            </tr>
                            <tr>
                                <th>ESM 가격비교 사이트 상품 등록 설정</th>
                                <td colspan="3">
                                    <a-radio-group name="radioGroup" v-model:value="marketItem.is_pcs_product_flag">
                                        <a-radio value="1">등록함</a-radio>
                                        <a-radio value="0">등록안함</a-radio>
                                    </a-radio-group>
                                </td>
                            </tr>
                            <tr>
                                <th>ESM 가격비교 사이트 쿠폰 적용여부</th>
                                <td colspan="3">
                                    <a-radio-group name="radioGroup" v-model:value="marketItem.is_pcs_coupon_flag">
                                        <a-radio value="1">적용함</a-radio>
                                        <a-radio value="0">적용안함</a-radio>
                                    </a-radio-group>
                                </td>
                            </tr>
                            <tr>
                                <th>ESM 발송정책 타입</th>
                                <td colspan="3">
                                    <a-select v-model:value="marketItem.esm_dispatch_type" ref="select" style="width: 150px;">
                                        <a-select-option value="">사용안함</a-select-option>
                                        <a-select-option value="A">당일 발송</a-select-option>
                                        <a-select-option value="B">순차 발송</a-select-option>
                                        <a-select-option value="C">해외 발송</a-select-option>
                                        <a-select-option value="D">요청일 발송</a-select-option>
                                        <a-select-option value="E">주문제작 발송</a-select-option>
                                        <a-select-option value="F">발송일 미정</a-select-option>
                                    </a-select>
                                </td>
                            </tr>
                            <tr v-show="show_esm_dispatch_day">
                                <th>ESM 상품 준비기간</th>
                                <td colspan="3">
                                    주문 후
                                    <a-select ref="select" style="width: 60px;">
                                        <a-select-option value="">1</a-select-option>
                                    </a-select>
                                    일
                                </td>
                            </tr>
                            <tr v-show="show_esm_dispatch_time">
                                <th>ESM 발송 마감시간</th>
                                <td colspan="3">
                                    <a-select ref="select" style="width: 60px;">
                                        <a-select-option value="">24</a-select-option>
                                    </a-select> 시
                                    <a-select ref="select" style="width: 60px;">
                                        <a-select-option value="">30</a-select-option>
                                    </a-select> 분
                                </td>
                            </tr>
                            <tr>
                                <th>즉시할인</th>
                                <td colspan="3">
                                    <a-radio-group name="radioGroup" v-model:value="marketItem.discount_flag">
                                        <a-radio value="1">사용함</a-radio>
                                        <a-radio value="0">사용안함</a-radio>
                                    </a-radio-group>
                                </td>
                            </tr>
                            <tr>
                                <th>몰별 구분</th>
                                <td colspan="3">
                                    <a-input v-model:value="marketItem.mall_etc" placeholder="" style="width: 400px;" />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="mt30" style="text-align: center;">
                            <a-button @click="savePopupFn" style="width: 100px;" type="primary">
                                확인
                            </a-button>
                            <a-button class="ml10" @click="closePopupFn" style="width: 100px;" type="">취소</a-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="search" class="pl20 pr20 pb20  mb10 bg-white">
            <div style="margin: 0; padding: 0; display: flex; justify-content: space-between;">

                <div>
                    <h3>마켓선택</h3>
                    <a-select :options="SITE_CODE_LIST" v-model:value="searchParam.site_code" style="width: 250px">
                    </a-select>
                </div>

                <div>
                    <h3>노출선택</h3>
                    <a-radio-group v-model:value="searchParam.disp">
                        <a-radio-button value="">전체</a-radio-button>
                        <a-radio-button value="1">노출함</a-radio-button>
                        <a-radio-button value="0">노출안함</a-radio-button>
                    </a-radio-group>

                </div>

                <div>
                    <h3>연동상품유형</h3>
                    <a-radio-group v-model:value="searchParam.product_type">
                        <a-radio-button value="">전체</a-radio-button>
                        <a-radio-button value="1">일반셀러(국내상품 계정)</a-radio-button>
                        <a-radio-button value="2">글로벌셀러(구매대행 계정)</a-radio-button>
                        <a-radio-button value="3">일반 & 글로벌셀러</a-radio-button>
                    </a-radio-group>
                </div>
            </div>

            <div class="mt15" style="text-align: center;">
                <a-button @click="setDataList" style="width: 100px;" type="primary">
                    <template #icon><SearchOutlined /></template>
                    검색
                </a-button>
                <a-button class="ml10" @click="initSearchParam()" style="width: 100px;" type="">초기화</a-button>
            </div>

        </div>
        <div id="list" class="p20 bg-white">

            <div class="mb10" style="display: flex; justify-content: flex-end;">
                <a-button @click="showPopupFn" style="width: 100px; margin-left: 10px" type="primary">
                    <template #icon><FileAddOutlined /></template>
                    마켓등록
                </a-button>
            </div>

            <a-table :bordered="false" :columns="columns" :data-source="dataList" :pagination="pagination">
                <template #headerCell="{ column }">
                    <div style="text-align: center">{{column.title}}</div>
                </template>

                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'is_korea'">
                        국내
                    </template>
                    <template v-else-if="column.key === 'site_code'">
                        <div  style="text-align: center;">
                            {{record['site_name']}}
                            <span>({{record[column.key]}})</span>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'siteLoginId'">
                        <div  style="text-align: center;"><span>{{record[column.key]}}</span></div>
                    </template>
                    <template v-else-if="column.key === 'test'">
                        <div style="text-align: center">
                            <a-button @click="" style="width: 100px;" type="">API 통신</a-button>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'manage'">
                        <div style="text-align: center">
                            <a-button @click="showPopupFnByEdit(record['id'])" style="width: 100px;" type="primary">
                                <template #icon><EditOutlined /></template>
                                수정
                            </a-button>
                        </div>
                    </template>
                    <template v-else>
                        <div  style="text-align: center;">{{record[column.key]}}</div>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>
<script setup>
import {defineComponent, onMounted, ref, reactive, toRaw, computed} from 'vue';
import Cookie from "js-cookie";
import {AuthRequest} from "util/request";
import router from "router";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { SearchOutlined, FileAddOutlined, EditOutlined } from '@ant-design/icons-vue';

// api 결과값
const _MUST_DATA = [
    {
        "site_name": "11번가",
        "site_code": "11st",
        "apiKey": "true",
        "apiTicketKey": "false",
        "siteLoginId": "true",
        "siteLoginPw": "true",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "ESM2.0 옥션",
        "site_code": "esm_auction",
        "apiKey": "false",
        "apiTicketKey": "false",
        "siteLoginId": "true",
        "siteLoginPw": "false",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "ESM2.0 지마켓",
        "site_code": "esm_gmarket",
        "apiKey": "false",
        "apiTicketKey": "false",
        "siteLoginId": "true",
        "siteLoginPw": "false",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "네이버페이",
        "site_code": "npay",
        "apiKey": "false",
        "apiTicketKey": "false",
        "siteLoginId": "false",
        "siteLoginPw": "false",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "롯데ON",
        "site_code": "lotteon",
        "apiKey": "false",
        "apiTicketKey": "false",
        "siteLoginId": "false",
        "siteLoginPw": "false",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "스마트스토어",
        "site_code": "storefarm",
        "apiKey": "true",
        "apiTicketKey": "false",
        "siteLoginId": "true",
        "siteLoginPw": "true",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "신세계_new",
        "site_code": "ssg_new",
        "apiKey": "false",
        "apiTicketKey": "false",
        "siteLoginId": "false",
        "siteLoginPw": "false",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "옥션",
        "site_code": "auction",
        "apiKey": "false",
        "apiTicketKey": "true",
        "siteLoginId": "true",
        "siteLoginPw": "true",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "위메프",
        "site_code": "wemakeprice",
        "apiKey": "true",
        "apiTicketKey": "false",
        "siteLoginId": "true",
        "siteLoginPw": "true",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "인터파크",
        "site_code": "interpark",
        "apiKey": "false",
        "apiTicketKey": "false",
        "siteLoginId": "true",
        "siteLoginPw": "true",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "지마켓",
        "site_code": "gmarket",
        "apiKey": "false",
        "apiTicketKey": "false",
        "siteLoginId": "true",
        "siteLoginPw": "true",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "카카오스토어",
        "site_code": "kakao",
        "apiKey": "true",
        "apiTicketKey": "false",
        "siteLoginId": "true",
        "siteLoginPw": "true",
        "apiCompanyCode": "false"
    },
    {
        "site_name": "쿠팡",
        "site_code": "coupang",
        "apiKey": "true",
        "apiTicketKey": "true",
        "siteLoginId": "true",
        "siteLoginPw": "true",
        "apiCompanyCode": "true"
    },
    {
        "site_name": "티몬",
        "site_code": "tmon",
        "apiKey": "false",
        "apiTicketKey": "false",
        "siteLoginId": "false",
        "siteLoginPw": "false",
        "apiCompanyCode": "false"
    }
];
const MUST_DATA = {};
MUST_DATA[''] = {
    "site_name": "",
    "site_code": "",
    "apiKey": "",
    "apiTicketKey": "",
    "siteLoginId": "",
    "siteLoginPw": "",
    "apiCompanyCode": ""
};
for (let i = 0; i < _MUST_DATA.length; i++) {
    MUST_DATA[_MUST_DATA[i]['site_code']] = _MUST_DATA[i];
}


const SITE_CODE_LIST = [
    {label: "쇼핑몰(오픈마켓)", value: ''},
    {label: "스마트스토어", value: 'storefarm'},
    {label: "쿠팡", value: 'coupang'},
    {label: "11번가", value: '11st'},
    {label: "위메프", value: 'wemakeprice'},
    {label: "인터파크", value: 'interpark'},
    {label: "티몬", value: 'tmon'},
    {label: "ESM2.0 지마켓", value: 'esm_gmarket'},
    {label: "ESM2.0 옥션", value: 'esm_auction'},
    {label: "롯데ON", value: 'lotteon'},
];

const roles = ref(Cookie.get('member_roles'));

let bLoading = ref(false);

const searchParam = ref({
    site_code: '',
    disp: '',
    product_type: ''
});

const _marketItem = {
    ssi_ix: '',
    site_code: '',
    apiKey: '',
    apiTicketKey: '',
    siteLoginId: '',
    siteLoginPw: '',
    masterLoginId: '',
    masterLoginPw: '',
    apiCompanyCode: '',
    product_type: '1',
    disp: '1',
    mall_etc: '',
    price_flag: 'N', // 판매가격 증가 연동, N - 사용안함, A - 일괄적용, C - 카테고리별 판매수수료 적용
    price_rate: '', // 판매가격 증가율 (%)
    commission_flag: 'N', // 정산용 판매수수료, N - 사용안함, A - 일괄적용, C - 카테고리별 판매수수료 적용
    market_sale_commission: '', // 판매수수료 (%)
    change_order_status: '1', // 주문 수집 후 자동상태변경, 1 - 변경안함, 2 - 변경함(배송준비중)
    auto_update: 'product', // 자동연동 설정, product - 상품정보 전체수정, stock - 재고만 수정, none - 미연동
    discount_flag: '0', // 즉시할인 , 0 - 사용하지 않음, 1 - 사용함
    is_pcs_product_flag: '0', // ESM 가격비교 사이트 상품 등록 설정, 0 - 등록안함, 1 - 등록함
    is_pcs_coupon_flag: '0', // ESM 가격비교 사이트 쿠폰 적용여부, 0 - 적용안함, 1 - 적용함
    esm_dispatch_type: '', // ESM 발송정책 타입, A - 당일 발송, B - 순차 발송, C - 해외 발송, D - 요청일 발송, E - 주문제작 발송, F - 발송일 미정
    esm_dispatch_day: '', // ESM 상품 준비기간, esm_dispatch_type : B, E일 경우 주문일 N일로 필수 연동(2~10까지입력) , esm_dispatch_type : C일 경우 주문일 N주로 필수 연동(1~5까지 입력)
    esm_dispatch_time: '' // ESM 발송 마감시간, esm_dispatch_type : A일 경우 주문일 필수 연동, 00:00(시:분) 형태로 연동, 30분 단위로 입력 가능
};

const marketItem = ref({
    ssi_ix: '',
    site_code: '',
    apiKey: '',
    apiTicketKey: '',
    siteLoginId: '',
    siteLoginPw: '',
    masterLoginId: '',
    masterLoginPw: '',
    apiCompanyCode: '',
    product_type: '1',
    disp: '1',
    mall_etc: '',
    price_flag: 'N', // 판매가격 증가 연동, N - 사용안함, A - 일괄적용, C - 카테고리별 판매수수료 적용
    price_rate: '', // 판매가격 증가율 (%)
    commission_flag: 'N', // 정산용 판매수수료, N - 사용안함, A - 일괄적용, C - 카테고리별 판매수수료 적용
    market_sale_commission: '', // 판매수수료 (%)
    change_order_status: '1', // 주문 수집 후 자동상태변경, 1 - 변경안함, 2 - 변경함(배송준비중)
    auto_update: 'product', // 자동연동 설정, product - 상품정보 전체수정, stock - 재고만 수정, none - 미연동
    discount_flag: '0', // 즉시할인 , 0 - 사용하지 않음, 1 - 사용함
    is_pcs_product_flag: '0', // ESM 가격비교 사이트 상품 등록 설정, 0 - 등록안함, 1 - 등록함
    is_pcs_coupon_flag: '0', // ESM 가격비교 사이트 쿠폰 적용여부, 0 - 적용안함, 1 - 적용함
    esm_dispatch_type: '', // ESM 발송정책 타입, A - 당일 발송, B - 순차 발송, C - 해외 발송, D - 요청일 발송, E - 주문제작 발송, F - 발송일 미정
    esm_dispatch_day: '', // ESM 상품 준비기간, esm_dispatch_type : B, E일 경우 주문일 N일로 필수 연동(2~10까지입력) , esm_dispatch_type : C일 경우 주문일 N주로 필수 연동(1~5까지 입력)
    esm_dispatch_time: '' // ESM 발송 마감시간, esm_dispatch_type : A일 경우 주문일 필수 연동, 00:00(시:분) 형태로 연동, 30분 단위로 입력 가능
});

const isEsm = computed(() => {
    return marketItem.value.site_code === 'esm_gmarket' || marketItem.value.site_code === 'esm_auction';
});

const dataList = ref([]);
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 10,
    position: ['bottomCenter'],
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: page => {
        pagination.value.current = page;
        setDataList();
    },
    onShowSizeChange: (current, pageSize) => {
        pagination.value.current = 1;
        pagination.value.pageSize = pageSize;
        setDataList();
    },
});

onMounted(async () => {
    if (roles.value === null || roles.value.indexOf('ROLE_ADMIN') === -1) {
        return false;
    }

    await setDataList();
});

const initSearchParam = () => {
    searchParam.value.site_code = '';
    searchParam.value.disp = '';
    searchParam.value.product_type = '';
};

const setDataList = async () => {
    bLoading.value = true;

    const res = await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/market/setting", {
        params: {
            site_code: searchParam.value.site_code, // 마켓코드
            disp: searchParam.value.disp, // 노출선택
            product_type: searchParam.value.product_type, // 상품연동유형
            page: pagination.value.current, // 페이지
            limit: pagination.value.pageSize // 리미트
        },
    });

    bLoading.value = false;

    dataList.value = res.data.list;
    pagination.value.total = res.data.total;
    pagination.value.current = res.data.page;
    pagination.value.pageSize = res.data.limit;
};

const columns = [
    {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        width: 50,
    }, {
        title: '구분',
        dataIndex: 'is_korea',
        key: 'is_korea',
        width: 100,
    }, {
        title: '마켓명(마켓코드)',
        dataIndex: 'site_code',
        key: 'site_code',
    }, {
        title: '마켓아이디',
        dataIndex: 'siteLoginId',
        key: 'siteLoginId',
    }, {
        title: 'MALL ETC',
        dataIndex: 'mall_etc',
        key: 'mall_etc',
        width: 100,
    }, {
        title: '마켓 수수료(%)',
        dataIndex: 'market_sale_commission',
        key: 'market_sale_commission',
        width: 100,
    }, {
        title: '노출 상태',
        dataIndex: 'disp',
        key: 'disp',
        width: 100,
    }, {
        title: '등록일자',
        dataIndex: 'ins_date',
        key: 'ins_date',
        width: 100,
    }, {
        title: '통신테스트',
        dataIndex: 'test',
        key: 'test',
        width: 100,
    }, {
        title: '관리',
        dataIndex: 'manage',
        key: 'manage',
        width: 100,
    }
];

const popupContent = ref(null);


const showPopup = ref(false);
const closePopupFn = () => {
    showPopup.value = false;
}
const showPopupFn = () => {
    marketItem.value = JSON.parse(JSON.stringify(_marketItem));
    showPopup.value = true;
}
const showPopupFnByEdit = async (id) => {
    bLoading.value = true;
    const res = await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/market/setting/" + id);
    marketItem.value = res.data;
    showPopup.value = true;
    bLoading.value = false;
}

const radioStyle = reactive({
    display: 'block',
    height: '30px',
    lineHeight: '30px',
});

const show_esm_dispatch_day = computed(() => {
    return ['B', 'E'].indexOf(marketItem.value.esm_dispatch_type) > -1;
});

const show_esm_dispatch_time = computed(() => {
    return ['A'].indexOf(marketItem.value.esm_dispatch_type) > -1;
});

const savePopupFn = async () => {
    bLoading.value = true;
    const res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/market/setting/save", marketItem.value);
    bLoading.value = false;
    closePopupFn();
    setDataList();
};


</script>


<style scoped>

.popupMask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    height: 100%;
    background-color: #00000073;
}

.clearfix {
    zoom: 1
}

.clearfix:after {
    content: "";
    display: block;
    clear: both;
    height: 0;
    overflow: hidden;
    visibility: hidden;
}

/*  배경색  */
.popup_background {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgb(0, 0, 0, 0.8);
    z-index: 9998;
}

/*  팝업 창  */
.popup_box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 740px;
    height: 700px;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;
    z-index: 20;
}

.popup_title {
    width: 100%;
    height: 65px;
    background: #1890ff;
}

.popup_title .title {
    float: left;
    margin: 10px 0 0 20px;
}

.popup_title .title .img {
    float: left;
}

.popup_title .title .text {
    float: left;
    font: 18px/42px 'NanumGothic';
    color: #fff;
    margin: 0 0 0 10px;
}

.popup_title .title img {
    width: 42px;
}

/*  팝업 닫기 버튼 start  */
.popup_title .cross_btn {
    float: right;
    margin: 15px 20px 0 0;
}

.cross {
    display: block;
    width: 30px;
    height: 30px;
    position: relative;
}

.cross:before,
.cross:after {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 100%;
    background: #fff;
}

.cross:before {
    transform: translate(-50%, -50%) rotate(45deg);
}

.cross:after {
    transform: translate(-50%, -50%) rotate(-45deg);
}

/*  팝업 닫기 버튼 end  */

/*  팝업 내용  */
.popup_cont {
    width: 100%;
    height: 633px;
    overflow-y: scroll;
}

.popup_cont .content {
    padding: 30px 30px;
}

.popup_cont .content .title {
    background: #838b8e;
    height: 40px;
}

.popup_cont .content .title .text {
    float: left;
    padding: 0 0 0 20px;
    font: 15px/40px 'NanumGothic';
    color: #fff;
}

.popup_cont .content .title .hidden {
    float: right;
    display: block;
    width: 40px;
    height: 40px;
    border-left: 1px solid #fff;
}


.popup_cont .content .arrow-right {
    margin: 17px 0 0 14px;
    width: 10px;
    height: 10px;
    background-color: transparent; /* 模块背景为透明 */
    border-color: #fff;
    border-style: solid;
    border-width: 2px 2px 0 0;
    transform: rotate(315deg); /*箭头方向可以自由切换角度*/

}

.popup_table {
    padding-bottom: 30px;
}

.popup_table .table {
    width: 100%;
    border-collapse: collapse;
}

.popup_table .table th {
    text-align: left;
    padding: 10px;
    height: 40px;
    background: #f3f3f3;
    border-bottom: 1px solid #e2e2e2;
    font: 14px/26px 'NanumGothic';
    color: #000;
}

.popup_table .table th span {
    color: red;
}

.popup_table .table td {
    padding: 10px 0 10px 10px;
    height: 40px;
    border-bottom: 1px solid #e2e2e2;
    font: 14px/26px 'NanumGothic';
    color: #000;
}

.popup_text1 {
    font: 12px/18px 'NanumGothic';
    color: #000;
}

.popup_text1 span {
    color: red;
}
</style>

