<template>
  <div>
    <a-modal width="600px" v-model:visible="relaket.data.MarketListVisible" centered>
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
import {QuestionCircleOutlined} from "@ant-design/icons-vue";

export default {
  components: {QuestionCircleOutlined},
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
      marketSelectedRowKeys: []
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
      this.relaket.data.indicator = true;

      let productList = this.getCheckList();
      let accountList = this.relaket.data.options.filter(item => item.checked === true);

      if (productList === "," || productList.length === 0) {
        message.warning('선택된 상품이 없습니다.');
        this.relaket.data.indicator = false;
        return false;
      }

      if (accountList.length === undefined || accountList.length === 0) {
        message.warning("선택된 계정이 없습니다.");
        this.relaket.data.indicator = false;
        return false;
      }

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
