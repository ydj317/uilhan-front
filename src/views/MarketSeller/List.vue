<template>
    <div>
        <a-card>
            <div class="mb15" style="display: flex;">
                <div>
                    <h3>마켓선택</h3>
                    <a-select v-model:value="state.tableData.params.site_code" style="width: 250px" @change="getTableList"
                        clearable>
                        <a-select-option :value="item.value" v-for="(item, key) in state.marketList" :key="key">{{
                            item.label
                        }}</a-select-option>
                    </a-select>
                </div>

                <div class="ml15" style="min-width: 210px;">
                    <h3>노출선택</h3>
                    <a-radio-group v-model:value="state.tableData.params.disp" @change="getTableList">
                        <a-radio-button value="">전체</a-radio-button>
                        <a-radio-button value="1">노출함</a-radio-button>
                        <a-radio-button value="0">노출안함</a-radio-button>
                    </a-radio-group>
                </div>

                <div class="ml15">
                    <h3>연동상품유형</h3>
                    <a-radio-group v-model:value="state.tableData.params.product_type" @change="getTableList">
                        <a-radio-button value="">전체</a-radio-button>
                        <a-radio-button value="1">일반셀러(국내상품 계정)</a-radio-button>
                        <a-radio-button value="2">글로벌셀러(구매대행 계정)</a-radio-button>
                        <a-radio-button value="3">일반 & 글로벌셀러</a-radio-button>
                    </a-radio-group>
                </div>
            </div>

            <div class="mb15" style="display: flex;justify-content: space-between;">
                <div class="left-div">
                </div>
                <div class="right-div">
                    <RouterLink to="/market/accounts/register">
                        <a-button type="primary">등록</a-button>
                    </RouterLink>
                </div>
            </div>
            <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :row-selection="rowSelection"
                :pagination="false">
                <a-table-column title="구분" dataIndex="country" key="country" />
                <a-table-column title="마켓코드" dataIndex="site_code" key="site_code" />
                <a-table-column title="마켓명" dataIndex="site_name" key="site_name" />
                <a-table-column title="마켓ID" dataIndex="siteLoginId" key="site_name" />
                <a-table-column title="MALL ETC" dataIndex="mall_etc" key="mall_etc" />
                <a-table-column title="마켓 수수료(%)" dataIndex="market_sale_commission" key="market_sale_commission" />
                <a-table-column title="노출상태" dataIndex="disp" key="disp" />
                <a-table-column title="등록일자" dataIndex="ins_date" key="ins_date" />
                <a-table-column title="통신테스트" dataIndex="check" key="check" />
                <a-table-column title="관리" dataIndex="manage" key="manage">
                    <template #customRender="scope, record, index">
                        <RouterLink :to="`/market/accounts/register/${scope.record['id']}`">
                            <a-button size="small">
                                수정
                            </a-button>
                        </RouterLink>

                        <a-popconfirm placement="leftBottom" ok-text="Yes" cancel-text="No"
                            @confirm="removeItem(record['id'])" class="ml10">
                            <template #title>
                                <p>삭제 하시겠습니까?</p>
                            </template>
                            <a-button class="mt5" type="danger" size="small">
                                삭제
                            </a-button>
                        </a-popconfirm>
                    </template>
                </a-table-column>
            </a-table>
            <a-pagination :total="state.tableData.total" :page-size="state.tableData.params.pageSize"
                :current="state.tableData.params.page" @change="pageChangeHandler" class="mt15" />

        </a-card>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useMarketSellerApi } from '@/api/marketSeller';
import { useMarketApi } from '@/api/market';

const state = reactive({
    tableData: {
        data: [],
        total: 0,
        loading: false,
        params: {
            disp: '',
            product_type: '',
            site_code: '',
            page: 1,
            pageSize: 10,
        },
    },
    marketList: [],
    rowData: {},
    isModalVisible: false,
});

const getMarketList = () => {
    useMarketApi().getMarketList({}).then(res => {
        state.marketList = res;
    });
};
const getTableList = () => {
    useMarketSellerApi().getSellerList(state.tableData.params).then(res => {
        const { list, total } = res.data
        state.tableData.data = list;
        state.tableData.total = total;

    });
};

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
};

onMounted(() => {
    getTableList();
    getMarketList();
});

const handleOk = (e) => {
    console.log(e);
    state.isModalVisible = false;
};

const pageChangeHandler = (page) => {
    state.tableData.params.page = page;
    getTableList();
}
</script>

<style lang="scss" scoped></style>