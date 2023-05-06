<template>
    <div id="container" >
        <loading v-model:active="bLoading"
                 :can-cancel="false"
                 :is-full-page="true"/>
        <div id="search" class="pl20 pr20 pb30  mb10 bg-white">
            <ul style="list-style: none; margin: 0; padding: 0;">
                <li style="display: inline-block;">
                    <h3>마켓선택</h3>
                    <a-select :options="searchParam.site_code.options" v-model:value="searchParam.site_code.value" style="width: 250px">
                    </a-select>
                </li>

                <li class="p20" style="display: inline-block;">
                    <h3>노출선택</h3>
                    <a-radio-group :options="searchParam.disp.options" v-model:value="searchParam.disp.value" size="" />

                </li>

                <li style="display: inline-block;" class="p20" >
                    <h3>연동상품유형</h3>
                    <a-radio-group :options="searchParam.product_type.options" v-model:value="searchParam.product_type.value"  />
                </li>
            </ul>


            <div class="mt15" style="text-align: center;">
                <a-button @click="getUserList" style="width: 100px;" type="">초기화</a-button>
                <a-button @click="getUserList" style="width: 100px; margin-left: 10px" type="primary">검색</a-button>
            </div>

        </div>
        <div id="list" class="p20 bg-white">
            <a-table :bordered="false" :columns="columns" :data-source="dataList" :pagination="pagination">
                <template #headerCell="{ column }">
                    <template v-if="column.key === 'all'">
                        <div style="text-align: center"><a-button>{{column.title}}</a-button></div>
                    </template>
                    <template v-else>
                        <div style="text-align: center">{{column.title}}</div>
                    </template>
                </template>

                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'all'">
                        <div style="text-align: center">
                            <a-checkbox v-model:checked="record.checked"></a-checkbox>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'test'">
                        <div style="text-align: center">
                            <a-button @click="" style="width: 100px;" type="">API 통신</a-button>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'manage'">
                        <div style="text-align: center">
                            <a-button @click="" style="width: 100px;" type="primary">수정</a-button>
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
import {defineComponent, onMounted, ref} from 'vue';
import Cookie from "js-cookie";
import {AuthRequest} from "util/request";
import router from "router";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default defineComponent({
    components: { Loading },
    setup() {

        const roles = ref(Cookie.get('member_roles'));

        let bLoading = ref(false);
        const dataList = ref([]);
        const pagination = ref({});

        onMounted(async () => {
            if (roles.value === null || roles.value.indexOf('ROLE_ADMIN') === -1) {
                return false;
            }
            bLoading.value = true;
            setDataList();
        });


        const setDataList = () => {

            // sample
            bLoading.value = false;
            const res = {
                data: {
                    total: 300,
                    page: 1,
                    limit: 1,
                    list: [
                        {
                            no: 1
                        }
                    ],
                }
            };

            dataList.value = res.data.list;

            pagination.value = {
                total: res.data.list.total,
                current: res.data.list.page,
                pageSize: res.data.list.limit,
                position: ['bottomCenter'],
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                onChange: page => {
                    pagination.value.current = page;
                    setDataList();
                },
                onShowSizeChange: (current, pageSize) => {
                    pagination.value.pageSize = pageSize;
                    setDataList();
                },
            };
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
                options: [
                    {label: "전체", value: ''},
                    {label: "사용함", value: '1'},
                    {label: "사용안함", value: '0'},
                ],
                value: ''
            },
            product_type: {
                options: [
                    {label: '전체', value: ''},
                    {label: '일반셀러(국내상품 계정)', value: '1'},
                    {label: '글로벌셀러(구매대행 계정)', value: '2'},
                    {label: '일반 & 글로벌셀러', value: '3'}
                ],
                value: ''
            }
        });

        return {
            bLoading,
            searchParam,
            columns,
            dataList,
            pagination
        };
    },
});
</script>


<style scoped>
</style>

