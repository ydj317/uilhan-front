<template>
    <div>
        <a-card>
            <a-card :bordered="false" :title="'마켓연동'">
                <div class="user_form">
                    <a-form-item label="마켓선택">
                        <a-select v-model:value="state.tableData.params.market_code" style="width: 250px" @change="getTableList"
                                  clearable>
                            <a-select-option value="">쇼핑몰(오픈마켓)</a-select-option>
                            <a-select-option :value="item.value" v-for="(item, key) in state.marketList" :key="key">{{
                                item.label
                                }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="노출선택">
                        <a-radio-group v-model:value="state.tableData.params.is_use" @change="getTableList">
                            <a-radio value="">전체</a-radio>
                            <a-radio value="1">노출함</a-radio>
                            <a-radio value="0">노출안함</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </div>
            </a-card>

            <div class="mb15 mt20" style="display: flex;justify-content: space-between;">
                <div class="left-div">
                </div>
                <div class="right-div">
                    <RouterLink to="/market/accounts/register">
                        <a-button type="primary">등록</a-button>
                    </RouterLink>
                </div>
            </div>
            <a-table  :data-source="state.tableData.data" :loading="state.tableData.loading" :row-selection="rowSelection"
                :pagination="false" bordered :row-class-name="(_record, index) => (_record.total && !auth ? 'bg-f0f0f0' : '')">
                <a-table-column title="마켓" dataIndex="marketCode" key="marketCode" align="center">
                    <template #customRender="scope, record, index">
                      <img :src="getLogoSrc('market-logo', scope.record.marketCode)" alt="" class="mr10" style="width: 25px;height: 25px;">
<!--                      <span>{{scope.record.marketCode}}</span>-->
                    </template>
                </a-table-column>
                <a-table-column title="마켓ID" dataIndex="sellerId" key="sellerId" align="center"/>
                <a-table-column title="노출상태" dataIndex="isUse" key="isUse" align="center">
                    <template #customRender="scope, record, index">
                        <a-switch v-model:checked="scope.record.isUse" @change="changeIsUse(scope.record)" :checkedValue="1"
                            :unCheckedValue="0" checked-children="On" un-checked-children="Off" :disabled="!!(scope.record.total && !auth)" />
                    </template>
                </a-table-column>
                <a-table-column title="등록일자" dataIndex="insDate" key="insDate" align="center">
                    <template #customRender="scope, record, index">
                        {{ scope.record.insDate.split('T')[0] }}
                    </template>
                </a-table-column>
                <a-table-column title="관리" dataIndex="manage" key="manage" align="center">
                    <template #customRender="scope, record, index">
                        <RouterLink :to="`/market/accounts/register/${scope.record['id']}`">
                            <a-button type="primary" :disabled="!!(scope.record.total && !auth)">수정</a-button>
                        </RouterLink>

                        <a-popconfirm placement="leftBottom" ok-text="Yes" cancel-text="No"
                            @confirm="removeAccount(scope.record['id'])" class="ml10">
                            <template #title>
                                <p>삭제 하시겠습니까?</p>
                            </template>
                            <a-button class="mt5" type="default">삭제</a-button>
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
import Cookie from "js-cookie";

const auth = Cookie.get("member_name") == 'jwli' ? true : false;
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
const getTableList = async () => {
    await useMarketAccountApi().getAccountList(state.tableData.params).then(res => {
        const { list, total } = res.data
        let marketCode = [];
        for (const k in list) {
          list[k]['total'] = 0;
          if(marketCode.indexOf(list[k]['marketCode']) !== -1){
            list[k]['total'] = 1;
          }else{
            marketCode.push(list[k]['marketCode']);
          }
        }
        state.tableData.data = list;
        state.tableData.total = total;
    });
};

const getMarketList = async () => {
  await useMarketApi().getMarketList({}).then(res => {
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
  //禁止全选单选
  getCheckboxProps: record => ({
    disabled: record.total == 1 && !auth,
  }),
};

onMounted(() => {
  Promise.all([getTableList(), getMarketList()])
});

const handleOk = (e) => {
    state.isModalVisible = false;
};

const pageChangeHandler = (page) => {
    state.tableData.params.page = page;
    getTableList();
}
const getLogoSrc = (fileName, marketCode) => {
    try {
        return require(`../../assets/img/list/${fileName}/${marketCode}.png`);
    } catch (error) {
        return require('../../assets/img/temp_image.png');
    }
};
</script>
<style>
    .user_form .ant-form-item {
        margin-bottom: 0;
    }

    .user_form .ant-form-item-label {
        border: 1px solid #eeeeee;
        background-color: #fafafa;
        width: 170px;
        padding: 10px;
        margin-bottom: -1px;
    }

    .user_form .ant-form-item-control {
        border: 1px solid #eeeeee;
        padding: 10px;
        margin-left: -1px;
        margin-bottom: -1px;
    }

    .user_form .ant-form-item-control:nth-last-child {
        border-bottom: 1px solid #eeeeee;
    }

    .user_form .phone .ant-form-item-control {
        border: none;
        padding: 0;
        margin: 0;
    }

    .user_form .phone .ant-form-item-control:nth-last-child {
        border-bottom: none;
    }
    .bg-f0f0f0{
      background-color: #f0f0f0;
    }
</style>
<style scoped>

</style>