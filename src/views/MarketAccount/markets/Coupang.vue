<template>
    <a-form ref="marketFormRef" :model="state.formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        class="market_form">
        <a-form-item name="seller_id" label="쿠팡ID" :rules="[{ required: true, message: '쿠팡ID를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.seller_id" :disabled="!auth && registerId !== ''" />
        </a-form-item>

        <a-form-item name="vendor_id" label="업체코드" @keyup="handleResetSyncStatus" :rules="[{ required: true, message: '업체코드를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.vendor_id" :disabled="!auth && registerId !== ''"/>
        </a-form-item>

        <a-form-item name="access_key" label="accessKey" @keyup="handleResetSyncStatus" :rules="[{ required: true, message: 'AccessKey를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.access_key" :disabled="!auth && registerId !== ''"/>
        </a-form-item>

        <a-form-item name="secret_key" label="secretKey" @keyup="handleResetSyncStatus" :rules="[{ required: true, message: 'AccessKey를 입력해 주세요.' }]">
            <a-input v-model:value="state.formData.secret_key" :disabled="!auth && registerId !== ''"/>
        </a-form-item>

        <a-button class="mt15" @click="handleSyncMarketCheck" :loading="state.syncCheckLoading">
            <template #icon v-if="state.formData.sync_market_status">
                <CheckCircleOutlined style="color:#67C23A;" />
            </template>
            연동확인
        </a-button>

        <a-divider></a-divider>
        <div v-if="state.formData.sync_market_status">
            <div style="display:flex;justify-content:space-between;align-items:center;" class="mb15">
                <h3>마켓정보 불러오기</h3>
            </div>

            <a-form-item name="outboundShippingPlaceCode" label="출고지"
                :rules="[{ required: true, message: '출고지를 선택해 주세요.' }]">
                <a-select v-model:value="state.formData.outboundShippingPlaceCode" placeholder="출고지를 선택해 주세요"
                    style="width:260px;">
                    <a-select-option :value="item.outbound_address_code" v-for="(item, key) in state.outboundAddressList"
                        :key="key">{{ item.outbound_address_name }}</a-select-option>
                </a-select>
                <a-button @click="syncOutboundAddress(state.formData.id)" class="ml15"
                    :loading="state.syncOutboundAddressLoading">업데이트</a-button>
                <a-tag class="ml15" v-if="state.sync_outbound_address_status == 0">-</a-tag>
                <a-tag color="#87d068" class="ml15" v-else-if="state.sync_outbound_address_status == 1">성공</a-tag>
                <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
                <span>{{ state.sync_outbound_address_date ?? '-' }}</span>
            </a-form-item>

            <a-form-item name="returnCenterCode" label="반품지" :rules="[{ required: true, message: '반품지를 선택해 주세요.' }]">
                <a-select v-model:value="state.formData.returnCenterCode" placeholder="반품지를 선택해 주세요" style="width:260px;"
                    @change="setReturnCenterData">
                    <a-select-option :value="item.return_address_code" v-for="(item, key) in state.returnAddressList"
                        :key="key">{{ item.return_address_name }}</a-select-option>
                </a-select>
                <a-button @click="syncReturnAddress(state.formData.id)" class="ml15"
                    :loading="state.syncReturnAddressLoading">업데이트</a-button>
                <a-tag class="ml15" v-if="state.sync_return_address_status == 0">-</a-tag>
                <a-tag color="#87d068" class="ml15" v-else-if="state.sync_return_address_status == 1">성공</a-tag>
                <a-tag color="#F56C6C" class="ml15" v-else>실패</a-tag>
                <span>{{ state.sync_return_address_date ?? '-' }}</span>
            </a-form-item>


            <h3 class="mt20">마켓정보설정</h3>

          <a-form-item>
            <template #label>
              <span>반품비(편도)</span>
              <a-tooltip class="ml10">
                <template #title>
                  <p>
                  쿠팡에 경우 다른 오픈마켓과 달리 상품 금액 별
                  최대 반품비용이 별도로 존재합니다.
                  </p>
                  <p>
                  상품 금액별 최대 반품비용을 참고하시고 설정해
                  주시면 됩니다.
                  </p>
                  <p>
                    <a-popover v-model:open="popoverVisible" title="해외 (해외구매대행 포함)" trigger="click" placement="rightTop" style="z-index: 999">
                      <template #content>
                        <table border="1" style="border: 1px solid #999" class="popoverTable">
                          <tr>
                            <th>항목</th>
                            <th>상품 가격 기준</th>
                            <th>배송비</th>
                            <th>반품비 (편도)</th>
                            <th>추가조건</th>
                            <th>도서산간 배송비</th>
                          </tr>
                          <tr>
                            <td rowspan="3">전체 카테고리</td>
                            <td><strong>상품가</strong> &lt;&equals; 20,000</td>
                            <td>최대 15,000</td>
                            <td>최대 15,000</td>
                            <td>반품배송비는 상품가를 초과하지 않아야 합니다.</td>
                            <td rowspan="5">최대 8,000</td>
                          </tr>
                          <tr>
                            <td>20,000 &lt; <strong>상품가</strong> &lt;&equals; 40,000</td>
                            <td>최대 20,000</td>
                            <td>최대 20,000</td>
                            <td>반품배송비는 상품가를 초과하지 않아야 합니다.</td>
                          </tr>
                          <tr>
                            <td><strong>상품가</strong> &gt; 40,000</td>
                            <td>최대 30,000</td>
                            <td>최대 100,000</td>
                            <td>반품배송비는 상품가를 초과하지 않아야 합니다.</td>
                          </tr>
                          <tr>
                            <td rowspan="2">일부 예외 카테고리</td>
                            <td><strong>상품가</strong> &lt;&equals; 60,000</td>
                            <td>최대 30,000</td>
                            <td>최대 30,000</td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td><strong>상품가</strong> &gt; 60,000</td>
                            <td>최대 200,000<p>(카테고리별 상이)</p></td>
                            <td>최대 200,000<p>(카테고리별 상이)</p></td>
                            <td>반품배송비는 상품가를 초과하지 않아야 합니다.</td>
                          </tr>
                        </table>
                      </template>
                      쿠팡 배송비 정책 자세히 보러가기 (삼각형 클릭)<a-button type="link">▶</a-button>
                    </a-popover>
                  </p>
                </template>
                <QuestionCircleOutlined/>
              </a-tooltip>
            </template>

            <a-form-item name="returnChargeLow" label="상품가 <= 20000"
                         :rules="[{ required: true, message: '상품가 <= 20000 일때 배송비를 입력해 주세요.' }]" :labelCol="{ span: 5 }">
              <a-input-number v-model:value="state.formData.returnChargeLow" placeholder="최대 15000" style="width:160px" min="0" max="15000" step="1000"/>
            </a-form-item>
            <a-form-item name="returnChargeMedium" label="20000 < 상품가 <= 40000"
                         :rules="[{ required: true, message: '20000 < 상품가 <= 40000 일때 배송비를 입력해 주세요.' }]" :labelCol="{ span: 5 }">
              <a-input-number v-model:value="state.formData.returnChargeMedium" placeholder="최대 20000" style="width:160px" min="0" max="20000" step="1000"/>
            </a-form-item>
            <a-form-item name="returnChargeHigh" label="상품가 > 40000"
                         :rules="[{ required: true, message: '상품가 > 40000 일때 배송비를 입력해 주세요.' }]" :labelCol="{ span: 5 }">
              <a-input-number v-model:value.number="state.formData.returnChargeHigh" placeholder="최대 40000" style="width:160px" min="0" max="40000" step="1000"/>
            </a-form-item>
          </a-form-item>

          <a-form-item name="deliveryCompany" label="출고지 택배사" :rules="[{ required: true, message: '출고지 택배사를 선택해주세요.' }]">
            <a-select v-model:value="state.formData.deliveryCompany" style="width:260px;">
              <a-select-option value="">- 선택해주세요 -</a-select-option>
              <a-select-option v-for="(name, code) in state.deliveryCompanyList" :key="code" :value="code">{{ name }}</a-select-option>
            </a-select>
          </a-form-item>

        </div>
        <a-button class="mt15" @click="goBack">돌아가기</a-button>
        <a-button class="mt15 ml15" @click="handleSubmit" type="primary">저장</a-button>

    </a-form>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { useMarketAccountApi } from '@/api/marketAccount';
import { useAccountJsonApi } from '@/api/accountJson';
import {
  CheckCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import Cookie from "js-cookie";
import {useMarketApi} from "@/api/market";
const auth = Cookie.get("member_name") == 'jwli' ? true : false;
const props = defineProps({
    market_code: {
        type: String,
        default: ''
    },
    accountInfo: {
        type: Object,
        default: {}
    },
    registerId: {
      type: String,
      default: ''
    }
});
const router = useRouter();
const popoverVisible = ref(false);
const marketFormRef = ref(null);

const state = reactive({
    formData: {
        id: '',
        market_code: props.market_code,
        seller_id: '',
        vendor_id: '',
        access_key: '',
        secret_key: '',
        sync_market_status: false,

        // 마켓정보 불러오기
        returnCenterCode: null,// 반품지
        outboundShippingPlaceCode: null,// 출고지

        // 마켓정보 설정
        returnChargeLow: 0,
        returnChargeMedium: 0,
        returnChargeHigh: 0,
        deliveryCompany: '',
    },

    syncCheckLoading: false,
    syncOutboundAddressLoading: false,
    syncReturnAddressLoading: false,

    returnAddressList: [],
    outboundAddressList: [],

    // 불러오기 상태
    sync_outbound_address_status: 0,
    sync_outbound_address_date: null,

    sync_return_address_status: 0,
    sync_return_address_date: null,

    deliveryCompanyList: []
})

// 수정시 계정 데이터 설정
const initFormData = () => {
    const accountInfo = props.accountInfo;

    if (Object.keys(accountInfo).length > 0) {
        state.formData.id = accountInfo.id;
        state.formData.market_code = accountInfo.marketCode;
        state.formData.seller_id = accountInfo.marketData.seller_id;
        state.formData.vendor_id = accountInfo.marketData.vendor_id;
        state.formData.access_key = accountInfo.marketData.access_key;
        state.formData.secret_key = accountInfo.marketData.secret_key;
        state.formData.sync_market_status = accountInfo.marketData.sync_market_status;

        state.formData.outboundShippingPlaceCode = accountInfo.marketData.outboundShippingPlaceCode;
        state.formData.returnCenterCode = accountInfo.marketData.returnCenterCode;
        state.formData.returnZipCode = accountInfo.marketData.returnZipCode;
        state.formData.returnAddress = accountInfo.marketData.returnAddress;
        state.formData.returnAddressDetail = accountInfo.marketData.returnAddressDetail;
        state.formData.companyContactNumber = accountInfo.marketData.companyContactNumber;
        state.formData.shippingPlaceName = accountInfo.marketData.shippingPlaceName;

        state.formData.returnChargeLow = accountInfo.marketData.returnChargeLow;
        state.formData.returnChargeMedium = accountInfo.marketData.returnChargeMedium;
        state.formData.returnChargeHigh = accountInfo.marketData.returnChargeHigh;

        state.formData.deliveryCompany = accountInfo.marketData.deliveryCompany || '';

    }
}

const syncOutboundAddress = (account_id) => {
    state.syncOutboundAddressLoading = true;
    useAccountJsonApi().syncOutboundAddress({ account_id: account_id, market_code: props.market_code }).then(res => {
        if (res.status !== "2000") {
            message.error(res.message);
            state.syncOutboundAddressLoading = false;
            return false;
        }

        message.success('업데이트 완료 되었습니다. 출고지를 선택해 주세요.');

        const { marketJson, syncStatus, updDate } = res.data;

        // 업데이트상태/날짜
        state.sync_outbound_address_status = syncStatus || '0';
        state.sync_outbound_address_date = updDate || null;
        state.outboundAddressList = [];
        marketJson?.forEach(item => {
            if (item.usable === true) {
                state.outboundAddressList.push({
                    outbound_address_code: item.outboundShippingPlaceCode,
                    outbound_address_name: item.shippingPlaceName
                });
            }
        });

        state.syncOutboundAddressLoading = false;
    });
};
const syncReturnAddress = (account_id) => {
    state.syncReturnAddressLoading = true;
    useAccountJsonApi().syncReturnAddress({ account_id: account_id, market_code: props.market_code }).then(res => {
        if (res.status !== "2000") {
            message.error(res.message);
            state.syncReturnAddressLoading = false;
            return false;
        }

        message.success('업데이트 완료 되었습니다. 반품지를 선택해 주세요.');
        const { marketJson, syncStatus, updDate } = res.data;

        // 업데이트상태/날짜
        state.sync_return_address_status = syncStatus || '0';
        state.sync_return_address_date = updDate || null;
        state.returnAddressList = [];
        marketJson?.forEach(item => {
            state.returnAddressList.push({
                return_address_code: item.returnCenterCode,
                return_address_name: item.shippingPlaceName + '-' + item.placeAddresses[0].returnAddress,
                shippingPlaceName: item.shippingPlaceName,
                companyContactNumber: item.placeAddresses[0].companyContactNumber,
                returnZipCode: item.placeAddresses[0].returnZipCode,
                returnAddress: item.placeAddresses[0].returnAddress,
                returnAddressDetail: item.placeAddresses[0].returnAddressDetail,

            });
        });

        state.syncReturnAddressLoading = false;
    });

};

const setReturnCenterData = (value) => {
    const returnCenterCode = value;
    const returnAddress = state.returnAddressList.find(item => item.return_address_code === returnCenterCode);

    state.formData.returnCenterCode = returnCenterCode;
    state.formData.returnZipCode = returnAddress.returnZipCode;
    state.formData.returnAddress = returnAddress.returnAddress;
    state.formData.returnAddressDetail = returnAddress.returnAddressDetail;
    state.formData.companyContactNumber = returnAddress.companyContactNumber;
    state.formData.shippingPlaceName = returnAddress.shippingPlaceName;
}
// 연동확인
const handleSyncMarketCheck = () => {

    marketFormRef.value.validate().then(() => {
        state.syncCheckLoading = true;
        state.formData.vendor_user_id = state.formData.seller_id

        useMarketAccountApi().syncMarketCheck(state.formData).then(res => {
            if (res.status !== "2000") {
                message.error(res.message);
                state.syncCheckLoading = false;
                return false;
            }

            const { account_id } = res.data;
            message.success(res.message);

            state.formData.id = account_id;
            // 출고지/반품지 수집실행
            syncOutboundAddress(account_id);
            syncReturnAddress(account_id);

            state.syncCheckLoading = false;
            state.formData.sync_market_status = true
        });
    }).catch((error) => {
        console.log('error', error);
    });
};

// 저장
const handleSubmit = (e) => {

  if (state.formData.sync_market_status === false) {
    message.error('연동확인을 먼저 해주세요.');
    return false;
  }

    // validation form
    state.formData.vendor_user_id = state.formData.seller_id
    marketFormRef.value.validate().then(() => {
        useMarketAccountApi().registerOrModifyAccount(state.formData).then(res => {
            if (res.status !== "2000") {
                message.error(res.message);
                return false;
            }

            message.success(res.message);
            setTimeout(() => {
                router.push({ name: 'market_accounts_list' });
            }, 500);

        });
    }).catch((error) => {
        console.log('error', error);
    });
};

const handleResetSyncStatus = () => {
  state.formData.sync_market_status = false;
}


// 반품지 리스트
const getReturnAddressList = () => {
    useAccountJsonApi().getAccountJson({ account_id: props.accountInfo.id, group: 'return_address' }).then(res => {

        const { marketJson, syncStatus, updDate } = res.data;

        // 업데이트상태/날짜
        state.sync_return_address_status = syncStatus || '0';
        state.sync_return_address_date = updDate || null;

        marketJson?.forEach(item => {
            state.returnAddressList.push({
                return_address_code: item.returnCenterCode,
                return_address_name: item.shippingPlaceName + '-' + item.placeAddresses[0].returnAddress,
                shippingPlaceName: item.shippingPlaceName,
                companyContactNumber: item.placeAddresses[0].companyContactNumber,
                returnZipCode: item.placeAddresses[0].returnZipCode,
                returnAddress: item.placeAddresses[0].returnAddress,
                returnAddressDetail: item.placeAddresses[0].returnAddressDetail,
            });
        });
    });

}

// 출고지 리스트
const getOutboundAddressList = () => {
    useAccountJsonApi().getAccountJson({ account_id: props.accountInfo.id, group: 'outbound_address' }).then(res => {
        const { marketJson, syncStatus, updDate } = res.data;

        // 업데이트상태/날짜
        state.sync_outbound_address_status = syncStatus || '0';
        state.sync_outbound_address_date = updDate || null;

        marketJson?.forEach(item => {
            if (item.usable === true && item.placeAddresses[0].countryCode === 'CN') {
                state.outboundAddressList.push({
                    outbound_address_code: item.outboundShippingPlaceCode,
                    outbound_address_name: item.shippingPlaceName
                });
            }
        });
    });
}

// 택배사 목록
const getMarketDeliveryCompany = async () => {
  await useMarketApi().getMarketDeliveryCompany({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    state.deliveryCompanyList = res.data.coupang || [];
  });
};

onMounted(() => {
    getMarketDeliveryCompany()
    initFormData()

    // 연동확인후
    if (state.formData.sync_market_status) {
        getOutboundAddressList()
        getReturnAddressList()
    }
});

const goBack = () => {
    router.push({ name: 'market_accounts_list' });
};
</script>
<style scoped>
.popoverTable {
  width: 100%;
  border-collapse: collapse;
}
.popoverTable th {
  background-color: #f5f5f5;
  padding: 5px;
  text-align: center;
}
.popoverTable td {
  padding: 5px;
}
</style>
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