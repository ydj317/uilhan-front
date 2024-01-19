<template>
  <div>
    <a-modal width="600px" v-model:open="relaket.data.MarketListVisible" centered>
      <template #title>
        선택상품 등록
        <a-tooltip>
          <template #title>
            <div>상품을 등록할 마켓을 선택하여 등록해 주세요.</div>
          </template>
          <QuestionCircleOutlined/>
        </a-tooltip>
      </template>
      <a-table :columns="columns" :data-source="relaket.data.options" :pagination="{hideOnSinglePage:true}"
               :row-selection="{ selectedRowKeys: marketSelectedRowKeys, onChange: onMarketSelectChange }">

        <!--bodyCell-->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'market_name'">
            <div  style="text-align: center;">{{ record.market_code }}</div>
          </template>

          <template v-if="column.key === 'market_account'">
            <div style="text-align: left">
              <img :src="getLogoSrc('market-logo', record.market_code)"
                   style="width: 16px; height: 16px; margin-right: 5px;" >
              {{ record.seller_id }}
              <a-tooltip v-if="record.market_code === 'lotteon'">
                <template #title>
                  <div>롯데ON의 경우 마켓 등록 재전송 필요합니다.(*기존 데이터 베이스가 없으므로 작업 후 기존 마켓들과 동일하게 업로드 가능)</div>
                </template>
                <ExclamationCircleOutlined />
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>

      <!--footer-->
      <template v-slot:footer>
        <div style="text-align: center">
          <a-button type="primary" @click="sendMarket()">마켓연동</a-button>
          <a-button type="primary" @click="MarketListClose">닫기</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {AuthRequest} from '@/util/request';
import { message } from "ant-design-vue";
import {ExclamationCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons-vue";
import {useCategoryApi} from "@/api/category";

export default {
  components: {ExclamationCircleOutlined, QuestionCircleOutlined},
  computed: {
    ...mapState([
      'relaket',
    ])
  },

  data() {
    return {
      columns: [
        {
          title: '마켓',
          key: 'market_name',
          align: "center",
          width: '160px'
        },
        {
          title: '계정',
          key: 'market_account',
          align: "center",

        },
      ],
      checkAll: false,
      marketSelectedRowKeys: [],
      smartStoreCategory: [],
    };
  },

  methods: {
    onMarketSelectChange(marketSelectedRowKeys) {
      this.marketSelectedRowKeys = marketSelectedRowKeys;

      if (this.relaket.data.options === undefined || this.relaket.data.options.length < 1) {
        return false;
      }

      for (let i = 0; i < this.relaket.data.options.length; i++) {
        this.relaket.data.options[i].checked = this.marketSelectedRowKeys.includes(this.relaket.data.options[i].key);
      }
    },

    getLogoSrc(fileName, marketCode) {
      try {
        return require(`../../assets/img/list/${fileName}/${marketCode}.png`);
      } catch (error) {
        return require('../../assets/img/temp_image.png');
      }
    },

    MarketListClose() {
      this.relaket.data.MarketListVisible = false;
    },

    async sendMarket() {

      let productList = this.getCheckList();
      let accountList = this.relaket.data.options.filter(item => item.checked === true);

      if (productList === "," || productList.length === 0) {
        message.warning('선택된 상품이 없습니다.');
        return false;
      }

      if (accountList.length === undefined || accountList.length === 0) {
        message.warning("선택된 계정이 없습니다.");
        return false;
      }

      const checkSmartStore = this.checkSmartStoreCategory(accountList);
      if(checkSmartStore === false) {
        return false
      }

      this.relaket.data.indicator = true;

      try {
        let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/send_market", {
          productList: productList,
          accountList: accountList
        });

        if (res.status !== "2000") {
          message.error(res.message);
          this.indicator = false;
          return false;
        }

        if (res.data !== undefined && res.data.length === 0) {
          message.error("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
          this.relaket.data.indicator = false;
          return false;
        }

        let returnData = res.data;
        this.relaket.data.setResultPopData(true, [
          returnData.success,
          returnData.failedCode,
          returnData.failed,
          returnData.total,
          returnData.data,
        ])

        this.relaket.data.MarketListVisible = false;
        this.relaket.data.indicator = false;

        return true;
      } catch (e) {
        message.error(e.message);
        this.relaket.data.indicator = false;
        return false;
      }

    },

    checkSmartStoreCategory(accountList) {
      const smartstoreAccounts = accountList.filter((item) => item.market_code === 'smartstore')
      const checkedPrdList = this.relaket.data.prdlist.filter((item) => item.checked === true);

      let faildItem = [];
      if(smartstoreAccounts.length === 0) {
        return true;
      }

      checkedPrdList.map((prdItem) => {
        faildItem = this.smartStoreCategory.filter((item) => {
          return prdItem.item_sync_keyword.includes(item.cate_name);
        })
      })

      if(faildItem.length > 0) {
        message.warning(`스마트스토어 금지어: [${faildItem.map((item) => item.cate_name).join(', ')}] 상품명 수정후 마켓연동해 주세요.`)
        return false;
      }
      return true;
    },

    async getSmartstoreCategory() {
      await useCategoryApi().getSmartstoreCategory({}).then((res) => {
        if(res.status !== '2000'){
          message.error(res.message);
          return false;
        }

        this.smartStoreCategory = res.data
      }).catch((e) => {
        message.error(e.message);
        return false;
      })

    },

    getCheckList() {
      let list = '';
      for (let i = 0; i < this.relaket.data.prdlist.length; i++) {
        if (this.relaket.data.prdlist[i].checked === true) {
          let comma = list === '' ? '' : ',';
          list += comma + this.relaket.data.prdlist[i].item_id;
        }
      }

      return list;
    },
  },

  mounted() {
    this.getSmartstoreCategory();
  },
};

</script>

<style scoped>
.titleStyle {
  text-align: center;
  display: inline-block;
  width: 100%;
  margin-top: 10px;
}
</style>
