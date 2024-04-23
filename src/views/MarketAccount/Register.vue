<template>
    <div>
        <a-card :title="this.getAccountId() === '' ? '마켓계정등록' : '마켓계정수정'">
            <div>
              <div class="help fs12 pl10 pb10" style="color: #999">마켓계정 정보 수정은 관리자에게 문의하시기 바랍니다.</div>
                <a-row>
                    <a-col :span="4"
                        style="display: flex;align-items: center;justify-content: right; padding:10px;background-color: #fafafa;border: 1px solid #eeeeee;border-bottom: none;"
                        :style="market_code === '' ? 'border-bottom: 1px solid #eeeeee;' : ''">
                        <span style="padding-right: 8px;">마켓 : </span>
                    </a-col>
                    <a-col :span="20" class="pl10"
                        style="padding:10px;border: 1px solid #eeeeee;border-bottom: none;border-left: none;"
                        :style="market_code === '' ? 'border-bottom: 1px solid #eeeeee;' : ''">
                        <a-select v-model:value="market_code" clearable @change="handleChangeSelection"
                            style="width: 300px;" :disabled="!auth && this.getAccountId() !== ''" >
<!--                          :disabled="this.getAccountId() !== ''"-->
                            <a-select-option value="">쇼핑몰(오픈마켓)</a-select-option>
                            <a-select-option :value="item.value" v-for="(item, key) in marketList" :key="key">{{
                                item.label
                            }}</a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
                <component :is="market_code" v-if="market_code" :accountInfo="accountInfo" :key="market_code"
                    :market_code="market_code"></component>

            </div>
        </a-card>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { useMarketAccountApi } from '@/api/marketAccount';
import { useMarketApi } from '@/api/market';

import Coupang from "./markets/Coupang.vue";
import Smartstore from "./markets/Smartstore.vue";
import Interpark from "./markets/Interpark.vue";
import Lotteon from "./markets/Lotteon.vue";
import Tmon from "./markets/Tmon.vue";
import Sk11st from "./markets/Sk11st.vue";
import Qoo10sg from "./markets/Qoo10sg.vue";
import Cookie from "js-cookie";

export default {
    data() {
        return {
            market_code: '',
            accountInfo: {},
            selectionMarket: '',

            marketList: [],
            marketItemFormRef: null,
            auth:Cookie.get("member_name") == 'jwli' ? true : false
        }
    },

    components: {
        Coupang, Smartstore, Interpark, Lotteon, Tmon, Sk11st, Qoo10sg
    },
    mounted() {
        // @TODO 마켓계정 ID로 조회를 하여 로그인한 user_id와 일치하는지 확인 계정 user_id가 일치하지 않으면 접근 불가
        // @TODO 마켓계정 ID가 없으면 마켓계정 등록 페이지로 이동

        this.getMarketList();

        const id = this.getAccountId();

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
              this.marketList = [];

              for (let key in res.data) {
                if (res.data.hasOwnProperty(key)) {
                  this.marketList.push({
                    value: key,
                    label: res.data[key]
                  });
                }
              }

            });
        },
        handleChangeSelection(value) {

        },

        getMarketAccount(id = '0') {

            useMarketAccountApi().getAccountFind(id).then(res => {

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