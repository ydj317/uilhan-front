<template>
    <div>
        <a-card title="마켓계정등록">
            <div>
                <a-row>
                    <a-col :span="4"
                        style="display: flex;align-items: center;justify-content: right; padding:10px;background-color: #fafafa;border: 1px solid #eeeeee;border-bottom: none;">
                        <span style="padding-right: 8px;">마켓 : </span>
                    </a-col>
                    <a-col :span="20" class="pl10"
                        style="padding:10px;border: 1px solid #eeeeee;border-bottom: none;border-left: none;">
                        <a-select v-model:value="market_code" clearable @change="handleChangeSelection"
                            style="width: 300px;">
                            <a-select-option :value="item.value" v-for="(item, key) in marketList" :key="key">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
                <component :is="market_code" v-if="market_code" :accountInfo="accountInfo" :key="market_code"></component>

            </div>
        </a-card>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { useMarketAccountApi } from '@/api/marketAccount';
import { useMarketApi } from '@/api/market';

import Coupang from "./markets/Coupang.vue";
import Storefarm from "./markets/Storefarm.vue";

export default {
    data() {
        return {
            market_code: '',
            accountInfo: {},
            selectionMarket: '',
            
            marketList: [],
            marketItemFormRef: null,
        }
    },

    components: {
        Coupang,
    },
    mounted() {
        this.getMarketList();

        const id = this.getAccountId();
        console.log(id);
        if (id) {
            this.getMarketAccount(id);
        }

    },
    methods: {
        getAccountId() {
            const { id } = useRoute().params;
            return id;
        },

        // 마켓 리스트
        getMarketList() {
            useMarketApi().getMarketList({}).then(res => {
                this.marketList = res;
            });
        },
        handleChangeSelection(value) {
            
        },

        getMarketAccount(id = '0') {
            useMarketAccountApi().getAccountFind({ id: id }).then(res => {
                const { marketCode } = res.data

                this.market_code = marketCode;
                this.accountInfo = res.data;
            });
        }
    }
}

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