<template>
    <div>
        <a-card>
            <div class="mb15" style="display: flex;">
                <div>
                    <h3>마켓선택</h3>
                    <a-select v-model:value="state.tableData.params.market_code" style="width: 250px" @change="getTableList"
                        clearable>
                        <a-select-option value="">쇼핑몰(오픈마켓)</a-select-option>
                        <a-select-option :value="item.value" v-for="(item, key) in state.marketList" :key="key">{{
                            item.label
                        }}</a-select-option>
                    </a-select>
                </div>

                <div class="ml15" style="min-width: 210px;">
                    <h3>노출선택</h3>
                    <a-radio-group v-model:value="state.tableData.params.is_use" @change="getTableList">
                        <a-radio-button value="">전체</a-radio-button>
                        <a-radio-button value="1">노출함</a-radio-button>
                        <a-radio-button value="0">노출안함</a-radio-button>
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
                <a-table-column title="마켓코드" dataIndex="marketCode" key="marketCode" />
                <a-table-column title="마켓ID" dataIndex="sellerId" key="sellerId" />
                <a-table-column title="노출상태" dataIndex="isUse" key="isUse">
                    <template #customRender="scope, record, index">
                        <a-switch v-model:checked="scope.record.isUse" @change="changeIsUse(scope.record)" :checkedValue="1"
                            :unCheckedValue="0" checked-children="On" un-checked-children="Off" />
                    </template>
                </a-table-column>
                <a-table-column title="등록일자" dataIndex="insDate" key="insDate">
                    <template #customRender="scope, record, index">
                        {{ scope.record.insDate.split('T')[0] }}
                    </template>
                </a-table-column>
                <a-table-column title="관리" dataIndex="manage" key="manage">
                    <template #customRender="scope, record, index">
                        <RouterLink :to="`/market/accounts/register/${scope.record['id']}`">
                            <a-button size="small">수정</a-button>
                        </RouterLink>

                        <a-popconfirm placement="leftBottom" ok-text="Yes" cancel-text="No"
                            @confirm="removeAccount(scope.record['id'])" class="ml10">
                            <template #title>
                                <p>삭제 하시겠습니까?</p>
                            </template>
                            <a-button class="mt5" type="danger" size="small">삭제</a-button>
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
import { useMarketAccountApi } from '@/api/marketAccount';
import { useMarketApi } from '@/api/market';
import { message } from 'ant-design-vue';

const state = reactive({
    tableData: {
        data: [],
        total: 0,
        loading: false,
        params: {
            market_code: '',
            is_use: '',
            seller_id: '',
            page: 1,
            pageSize: 20,
        },
    },
    marketList: [],
    rowData: {},
    isModalVisible: false,
});

const removeAccount = (id) => {
  useMarketAccountApi().removeAccount({'id': id}).then(res => {
    if (res.status !== '2000') {
      message.error(res.message);
      return false;
    }

    message.success(res.message);

    getTableList();
  });
};
const getTableList = () => {
    useMarketAccountApi().getAccountList(state.tableData.params).then(res => {
        const { list, total } = res.data

        state.tableData.data = list;
        state.tableData.total = total;
    });
};

const getMarketList = () => {
  useMarketApi().getMarketList({}).then(res => {
    state.marketList = [];

    for (let key in res.data) {
      if (res.data.hasOwnProperty(key)) {
        state.marketList.push({
          value: key,
          label: res.data[key]
        });
      }
    }

  });
};

const changeIsUse = (record) => {
    const params = {
        account_id: record.id,
        is_use: record.isUse ? 1 : 0,
    };

    useMarketAccountApi().updateAccountStatus(params).then(res => {
        message.success('노출상태가 변경되었습니다.');
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
    state.isModalVisible = false;
};

const pageChangeHandler = (page) => {
    state.tableData.params.page = page;
    getTableList();
}
</script>