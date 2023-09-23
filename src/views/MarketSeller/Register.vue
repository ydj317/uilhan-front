<template>
    <div>
        <a-card title="마켓계정등록">
            <div>
                <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" class="market_form">
                    <a-form-item name="name" label="마켓">
                        <a-select v-model:value="state.formData.site_code" clearable @change="handleChangeSelection">
                            <a-select-option :value="item.value" v-for="(item, key) in state.marketList" :key="key">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <!-- if selectionMarket coupang -->
                    <template v-if="state.formData.site_code">
                        <a-form-item :name="['meta_data',item.key]" :label="item.label"
                            v-for="(item, key) in FormConfig[state.formData.site_code.toLowerCase()]" :key="key" :rules="item.rules">
                            <a-input v-model:value="state.formData.meta_data[item.key]" v-if="item.type === 'input'" />
                        </a-form-item>


                        <a-button class="mt15" @click="handleSubmit">연동확인</a-button>

                        <a-divider></a-divider>

                        <a-form-item name="category" label="마켓정보 불러오기">
                            <a-table :data-source="state.syncItem" size="small" bordered :pagination="false">
                                <a-table-column title="항목" dataIndex="label" key="label" align="center"/>
                                <a-table-column title="결과" dataIndex="updateAt" key="updateAt" align="center"/>
                                <a-table-column title="요청" align="center">
                                    <template #customRender="scope">
                                        <a-button size="small" @click="handleAction(scope.record)">업데이트</a-button>
                                    </template>
                                </a-table-column>
                            </a-table>
                        </a-form-item>
                        <a-button class="mt15" @click="handleSubmit" type="primary">저장</a-button>
                    </template>
                </a-form>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { useMarketApi } from '@/api/market';
import { FormConfig } from "./markets/FormConfig";
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const marketFormRef = ref(null);
const state = reactive({
    formData: {
        id: '',
        user_id: '',
        site_code: 'coupang',
        disp: '1',
        product_type: '',
        meta_data: {},
    },
    selectionMarket: '',
    marketList: [],
    syncItem: [
        {label: '카테고리', value: 'category', updateAt: '2023-09-22 12:12:03'},
        {label: '택배사', value: 'delivery', updateAt: '2023-09-23 10:12:03'},
    ],
})

// 마켓 리스트
const getMarketList = () => {
    useMarketApi().getMarketList({}).then(res => {
        state.marketList = res;
    });
};

const getMarketSeller = (id) => {
    console.log(id);
    // useMarketSellerApi().getSellerList(state.tableData.params).then(res => {
    //     const { list, total } = res.data
    //     state.tableData.data = list;
    //     state.tableData.total = total;
    // });
};
// 마켓정보 불러오기
const handleAction = (record) => {
    if (record.value === 'category') {
        syncCategory();
    } else if (record.value === 'delivery') {
        syncDelivery();
    }
};

const syncCategory = () => {
    console.log('syncCategory');
};
const syncDelivery = () => {
    console.log('syncDelivery');
};


// 저장
const handleSubmit = (e) => {
    // validation form
    marketFormRef.value.validate().then(() => {
        console.log(state.formData);
        // @TODO: createSeller insert data
        // useMarketSellerApi().createSeller(state.formData).then(res => {
        //     console.log(res);
        // });
        router.push({ name: 'market_seller_list' });

    }).catch((error) => {
        console.log('error', error);
    });
};

const handleChangeSelection = (value) => {
    console.log(state.selectionMarket);
};
onMounted(() => {
    getMarketList();
    getMarketSeller(route.params.id);
});

</script>

<style>
.market_form .ant-form-item {
    margin-bottom: 0;
}

.market_form .ant-form-item-label {
    border: 1px solid #eeeeee;
    background-color: #fafafa;
    width: 170px;
    padding: 10px;
    margin-bottom: -1px;
}

.market_form .ant-form-item-control {
    border: 1px solid #eeeeee;
    padding: 10px;
    margin-left: -1px;
    margin-bottom: -1px;
}

.market_form .ant-form-item-control:nth-last-child {
    border-bottom: 1px solid #eeeeee;
}
</style>