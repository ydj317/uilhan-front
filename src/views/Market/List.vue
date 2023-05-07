<template>
    <div id="container" >
        <loading v-model:active="bLoading"
                 :can-cancel="false"
                 :is-full-page="true"/>

        <div v-if="showPopup" @click="closePopupFn" class="popupMask"></div>

        <div id="search" class="pl20 pr20 pb20  mb10 bg-white">
            <div style="margin: 0; padding: 0; display: flex; justify-content: space-between;">

                <div>
                    <h3>마켓선택</h3>
                    <a-select :options="searchParam.site_code.options" v-model:value="searchParam.site_code.value" style="width: 250px">
                    </a-select>
                </div>

                <div>
                    <h3>노출선택</h3>
                    <a-radio-group v-model:value="searchParam.disp.value">
                        <a-radio-button value="">전체</a-radio-button>
                        <a-radio-button value="1">노출함</a-radio-button>
                        <a-radio-button value="0">노출안함</a-radio-button>
                    </a-radio-group>

                </div>

                <div>
                    <h3>연동상품유형</h3>
                    <a-radio-group v-model:value="searchParam.product_type.value">
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
                <div v-if="showPopup" class="popup_box">
                    <div class="popup_title clearfix">
                        <div class="title clearfix">
                            <div class="text">마켓 설정등록</div>
                        </div>
                        <a href="##" @click="closePopupFn" class="cross_btn"><span class="cross"></span></a>
                    </div>
                    <div class="popup_cont">
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
                                            <a-select :options="searchParam.site_code.options" v-model:value="searchParam.site_code.value">
                                            </a-select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>API Key <span>*</span></th>
                                        <td>
                                            <a-input placeholder="" style="width: 190px;" />
                                        </td>
                                        <th>API Ticket Key <span>*</span></th>
                                        <td>
                                            <a-input placeholder="" style="width: 190px;" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>마켓 아이디 <span>*</span></th>
                                        <td>
                                            <a-input placeholder="" style="width: 190px;" />
                                        </td>
                                        <th>마켓 비밀번호 <span>*</span></th>
                                        <td>
                                            <a-input placeholder="" style="width: 190px;" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>마켓 Company Code</th>
                                        <td colspan="3">
                                            <a-input placeholder="" style="width: 300px;" />
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
                                            <a-radio-group name="radioGroup" v-model:value="value">
                                                <a-radio value="1">노출함</a-radio>
                                                <a-radio value="2">노출안함</a-radio>
                                            </a-radio-group>
                                        </td>
                                        <th>연동상품유형</th>
                                        <td>
                                            <a-radio-group v-model:value="value">
                                                <a-radio :style="radioStyle" :value="1">일반셀러(국내상품 계정)</a-radio>
                                                <a-radio :style="radioStyle" :value="2">글로벌셀러(구매대행 계정)</a-radio>
                                                <a-radio :style="radioStyle" :value="3">일반&글로벌셀러</a-radio>
                                            </a-radio-group>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <a-table :bordered="false" :columns="columns" :data-source="dataList" :pagination="pagination">
                <template #headerCell="{ column }">
                    <div style="text-align: center">{{column.title}}</div>
                </template>

                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'is_korea'">
                        <div style="text-align: center" v-if="record[column.key] === 'T'" >
                            국내
                        </div>
                        <div style="text-align: center" v-else >
                            국내
                        </div>
                    </template>
                    <template v-else-if="column.key === 'site_code'">
                        <div  style="text-align: center;"><span>{{record[column.key]}}</span></div>
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
                            <a-button @click="" style="width: 100px;" type="primary">
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
<script>
import {defineComponent, onMounted, ref, reactive, toRaw} from 'vue';
import Cookie from "js-cookie";
import {AuthRequest} from "util/request";
import router from "router";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { SearchOutlined, FileAddOutlined, EditOutlined } from '@ant-design/icons-vue';
export default defineComponent({
    components: { Loading, SearchOutlined, FileAddOutlined, EditOutlined },
    setup() {

        const roles = ref(Cookie.get('member_roles'));

        let bLoading = ref(false);

        const searchParam = ref({
            site_code: {
                options: [
                    {label: "쇼핑몰(오픈마켓)", value: ''},
                    {label: "11번가", value: '1'},
                    {label: "옥션", value: '2'},
                    {label: "쿠팡", value: '3'},
                ],
                value: ''
            },
            disp: {
                value: ''
            },
            product_type: {
                value: ''
            }
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
            bLoading.value = true;
            setDataList();
        });

        const initSearchParam = () => {
            searchParam.value.site_code.value = '';
            searchParam.value.disp.value = '';
            searchParam.value.product_type.value = '';
        };

        const setDataList = () => {

            // 마켓코드 searchParam.value.site_code.value;
            // 노출선택 searchParam.value.disp.value;
            // 연동상품유형 searchParam.value.product_type.value;
            // page pagination.value.current
            // limit pagination.value.pageSize

            console.log(pagination.value)

            // sample
            bLoading.value = false;
            const res = {
                data: {
                    total: 300,
                    page: 1,
                    limit: 10,
                    list: [
                        {
                            no: 1,
                            is_korea: 'T',
                            site_code: '11st',
                            siteLoginId: 'hello!'
                        }
                    ],
                }
            };

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
                dataIndex: 'ins_time',
                key: 'ins_time',
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

        const visible = ref(false);
        const confirmLoading = ref(false);
        const showModal = () => {
            visible.value = true;
        };
        const handleOk = () => {
            confirmLoading.value = true;
            setTimeout(() => {
                visible.value = false;
                confirmLoading.value = false;
            }, 2000);
        };


        const formRef = ref();
        const formState = reactive({
            name: '',
            region: undefined,
            date1: undefined,
            delivery: false,
            type: [],
            resource: '',
            desc: '',
        });
        const rules = {
            name: [
                {
                    required: true,
                    message: 'Please input Activity name',
                    trigger: 'blur',
                },
                {
                    min: 3,
                    max: 5,
                    message: 'Length should be 3 to 5',
                    trigger: 'blur',
                },
            ],
            region: [
                {
                    required: true,
                    message: 'Please select Activity zone',
                    trigger: 'change',
                },
            ],
            date1: [
                {
                    required: true,
                    message: 'Please pick a date',
                    trigger: 'change',
                    type: 'object',
                },
            ],
            type: [
                {
                    type: 'array',
                    required: true,
                    message: 'Please select at least one activity type',
                    trigger: 'change',
                },
            ],
            resource: [
                {
                    required: true,
                    message: 'Please select activity resource',
                    trigger: 'change',
                },
            ],
            desc: [
                {
                    required: true,
                    message: 'Please input activity form',
                    trigger: 'blur',
                },
            ],
        };
        const onSubmit = () => {
            formRef.value
                .validate()
                .then(() => {
                    console.log('values', formState, toRaw(formState));
                })
                .catch(error => {
                    console.log('error', error);
                });
        };
        const resetForm = () => {
            formRef.value.resetFields();
        };

        const showPopup = ref(true);
        const closePopupFn = () => {
            showPopup.value = false;
        }
        const showPopupFn = () => {
            showPopup.value = true;
        }

        const radioStyle = reactive({
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        });

        return {
            bLoading,
            searchParam,
            initSearchParam,
            setDataList,
            columns,
            dataList,
            pagination,

            visible,
            confirmLoading,
            showModal,
            handleOk,

            formRef,
            labelCol: {
                span: 4,
            },
            wrapperCol: {
                span: 14,
            },
            other: '',
            formState,
            rules,
            onSubmit,
            resetForm,

            showPopup,
            closePopupFn,
            showPopupFn,
            radioStyle,
        };
    },
});
</script>


<style scoped>

.popupMask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
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
    z-index: 9999;
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

