<template>
  <div>
    <a-modal width="600px" title="연동할 제휴사" v-model:visible="relaket.data.MarketListVisible" centered>

      <a-table :columns="columns" :data-source="relaket.data.options" :pagination="{hideOnSinglePage:true}"
               :row-selection="{ selectedRowKeys: marketSelectedRowKeys, onChange: onMarketSelectChange }">

        <!--bodyCell-->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'market_account'">
            <div style="text-align: left">
              <img :src="getLogoSrc('market-logo', record.market_code)"
                   style="width: 16px; height: 16px; margin-right: 5px;" >
              {{ record.seller_id }}
            </div>
          </template>

          <template v-if="column.key === 'market_name'">
            <div  style="text-align: center;">{{ record.market_code }}</div>
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

export default {
  computed: {
    ...mapState([
      'relaket',
    ])
  },

  data() {
    return {
      columns: [
        {
          title: '쇼핑몰',
          key: 'market_account',
          align: "center",
          width: '200px'
        },
        {
          title: '제휴사',
          key: 'market_name',
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
        // return false;
      }

      if (accountList.length === undefined || accountList.length === 0) {
        message.warning("선택된 계정이 없습니다.");
        this.relaket.data.indicator = false;
        return false;
      }

      let items = productList.split(',');
      let notCatePrdList = '';
      let hasCatePrdList = '';

      for (let i = 0; i < items.length; i++) {
        let id = items[i];
        if (id === undefined || id === '' || id === null) {
          continue;
        }

        let item = this.relaket.data.prdlist.filter((item) => parseInt(item.item_id) === parseInt(id))[0];

        if (item.item_cate === null) {
          notCatePrdList += notCatePrdList.length === 0 ? '' : ',';
          notCatePrdList += item.item_id;
          continue;
        }

        hasCatePrdList += hasCatePrdList.length === 0 ? '' : ',';
        hasCatePrdList += item.item_id;
      }

      if (notCatePrdList.split(',').length === items.length) {
        message.warning('선택하신 모든 상품의 마켓연동에 필요한 카테고리 값이 없습니다.');
        this.relaket.data.indicator = false;
        // return false;
      }

      if (notCatePrdList.length > 0) {
        message.warning(notCatePrdList + ' 등 상품의 카테고리 정보가 없습니다.');
        this.relaket.data.indicator = false;
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

        const sellerIds = accountList.map(item => item.seller_id);
        this.relaket.data.prdlist.forEach(item => {
          let item_id = item.item_id + "";
          if (items.includes(item_id)) {

            item.item_sync_market.forEach(item2 => {
              if (sellerIds.includes(item2.seller_id)) {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1，并且要确保两位数格式
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                item2.status = 'sending';
                item2.ins_time = formattedDateTime;
              }
            })

          }
        });

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
