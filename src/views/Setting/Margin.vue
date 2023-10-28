<template>
  <a-card :loading="formState.loading" :bordered="false">
    <a-descriptions title="마진율 설정" bordered :column="1" :labelStyle="{ width: '100px' }"
                    :contentStyle="{ width: '500px' }">
      <a-descriptions-item>
        <!-- label slot-->
        <template #label>
          <a-space>
            <span>환율 설정</span>
            <a-tooltip title="환율설정은 상품수집시 설정한 옵션에 따라 계산되여 수집됩니다.">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-radio-group v-model:value="formState.settingDatas.rate.is_real_rate">
          <a-radio :value="true">실시간 환율</a-radio>
          <a-radio :value="false">직접 입력 환율</a-radio>
        </a-radio-group>
        <a-input-number v-model:value.number="formState.settingDatas.rate.rate_value"
                        :disabled="formState.settingDatas.rate.is_real_rate"
                        :min="0" :max="300" size="small"/>
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>마진율 설정</span>
            <a-tooltip title="마진율 설정은 상품수집시 설정한 옵션에 따라 계산되여 수집됩니다.">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-radio-group v-model:value="formState.settingDatas.margin.is_auto_setting">
          <a-radio :value="true">
            자동 설정
            <a-tooltip title="원가 x 환율 x (카드 수수료 1% + 퍼센트 마진 3%) + 최소마진: 0 + 해외배송비: 0">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-radio>
          <a-radio :value="false">
            수동 설정
            <a-tooltip title="원가 x 환율 x (카드 수수료 + 퍼센트 마진) + 최소마진 + 해외배송비">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-radio>
        </a-radio-group>
        <a-space>
          원가 x
          <span>
            {{
              formState.settingDatas.rate.is_real_rate ? '실시간 환율' : formState.settingDatas.rate.rate_value ? formState.settingDatas.rate.rate_value : '미입력'
            }}
          </span>
          x (
          <a-input-number v-model:value.number="formState.settingDatas.margin.margin_data.card_charge"
                          :disabled="formState.settingDatas.margin.is_auto_setting" :min="1" :max="100" :step="0.01"
                          size="small" style="width: 60px;"/>
          +
          <a-input-number v-model:value.number="formState.settingDatas.margin.margin_data.margin_value"
                          :disabled="formState.settingDatas.margin.is_auto_setting" :min="0" :max="100" :step="0.1"
                          size="small" style="width: 60px;"/>
          )
          +
          <a-input-number v-model:value.number="formState.settingDatas.margin.margin_data.min_margin"
                          :disabled="formState.settingDatas.margin.is_auto_setting" :min="0" :max="20000" size="small"
                          style="width: 75px;" :step="1000"/>
          +
          <a-input-number v-model:value.number="formState.settingDatas.margin.margin_data.overseas_shipping_fee"
                          :disabled="formState.settingDatas.margin.is_auto_setting" :min="0" :max="20000" size="small"
                          style="width: 75px;" :step="1000"/>
        </a-space>
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>마켓별 가중치 설정</span>
            <a-tooltip title="설정하신 기본 판매가에서 마켓별 가중치에 따라 적용되어 업로드 됩니다.">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-radio-group v-model:value="formState.settingDatas.margin_weight.is_use">
          <a-radio :value="false">사용안함</a-radio>
          <a-radio :value="true">사용</a-radio>
        </a-radio-group>

        <a-descriptions bordered size="small" class="mt15" :column="4"
                        v-if="formState.settingDatas.margin_weight.is_use">
          <a-descriptions-item :label="market" v-for="(market,index) in formState.marketList" :key="index">
            <a-input-number v-model:value.number="formState.settingDatas.margin_weight.markets[index]" addon-after="%"
                            :min="0" :max="300" size="small" style="width: 150px" defaultValue="0"/>
          </a-descriptions-item>
        </a-descriptions>
      </a-descriptions-item>
    </a-descriptions>
    <div style="display: flex;justify-content: center" class="mt15">
      <a-button type="primary" @click="handleSaveUserData">저장</a-button>
    </div>
  </a-card>
</template>

<script setup>

import {message} from "ant-design-vue";
import {AuthRequest} from "@/util/request";
import {onMounted, reactive} from "vue";
import {QuestionCircleOutlined} from "@ant-design/icons-vue";
import {useMarketApi} from "@/api/market";
import {useUserApi} from "@/api/user";

const formState = reactive({
  settingDatas: {
    // 환율
    rate: {
      is_real_rate: true, // 실시간환율(true),고정환율(false) 여부
      rate_value: 0, // 고정환율일 경우 환율값
    },
    // 마진
    margin: {
      is_auto_setting: true, // 자동설정(true),수동설정(false) 여부
      // 수동설정일 경우
      margin_data: {
        card_charge: '1', // 수동설정일 경우 카드수수료
        margin_value: '0', // 수동설정일 경우 마진값
        min_margin: '0', // 수동설정일 경우 최소마진
        overseas_shipping_fee: '0', // 수동설정일 경우 해외배송비
      },
    },
    // 마켓별 마진가중치
    margin_weight: {
      is_use: false, // 사용(true),미사용(false) 여부
      markets: {},
    },
  },
  loading: false,
  marketList: [],
})

function getUserInfoData() {
  formState.loading = true;
  useUserApi().getUserInfoData({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      formState.loading = false;
      return false;
    }

    const { user_data } =res.data;

    if(!user_data || user_data.length < 1){
      formState.loading = false;
      return false;
    }

    formState.settingDatas = user_data;
    setTimeout(() => {
      formState.loading = false;
    }, 500);

  });
}

// 유효성 체크
const checkValidation = () => {
  if (formState.settingDatas.rate.is_real_rate === false) {
    if (!formState.settingDatas.rate.rate_value) {
      message.error("환율을 입력해주세요.");
      return false;
    }
  }

  if (formState.settingDatas.margin.is_auto_setting === false) {

    if (!formState.settingDatas.margin.margin_data.margin_value) {
      message.error("마진율을 입력해주세요.");
      return false;
    }

    if (!formState.settingDatas.margin.margin_data.card_charge) {
      message.error("카드수수료를 입력해주세요.");
      return false;
    }

    if (formState.settingDatas.margin.margin_data.min_margin !== 0 && !formState.settingDatas.margin.margin_data.min_margin) {
      message.error("최소마진을 입력해주세요.");
      return false;
    }

    if (formState.settingDatas.margin.margin_data.overseas_shipping_fee !== 0 && !formState.settingDatas.margin.margin_data.overseas_shipping_fee) {
      message.error("해외배송비를 입력해주세요.");
      return false;
    }
  }

  if (formState.settingDatas.margin_weight.is_use === true) {

    if(Object.keys(formState.settingDatas.margin_weight.markets).length < 1){
      message.error("마켓별 가중치를 입력해주세요.");
      return false;
    }

    for (let key in formState.marketList) {
      // check undefined or null
      if (formState.settingDatas.margin_weight.markets[key] === undefined || formState.settingDatas.margin_weight.markets[key] === null) {
        message.error(`${formState.marketList[key]} 가중치를 입력해주세요.`);
        return false;
      }
    }

  }

  return true;
}

// 저장
const handleSaveUserData = () => {
  if (checkValidation() === false) {
    return false;
  }
  useUserApi().saveUserData(formState.settingDatas).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    message.success('저장 되었습니다.');
    getUserInfoData();
  });
}

// 마켓 리스트 가져오기
const getMarketList = () => {
  useMarketApi().getMarketList().then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    formState.marketList = res.data;
  });
}

onMounted(() => {
  getMarketList();
  getUserInfoData();
})
</script>