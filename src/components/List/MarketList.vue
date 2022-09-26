<template>
  <div>
    <a-modal v-model:visible="relaket.data.MarketListVisible">
      <!--title-->
      <template #title>
        <h3 class="titleStyle"><b>연동할 제휴사</b></h3>
      </template>

      <a-table :columns="columns" :data-source="relaket.data.options" :pagination="{hideOnSinglePage:true}">
        <!--headerCell-->
        <template #headerCell="{ column }">
          <template v-if="column.key === 'ssi_ix'">
            <div class="center">
              <a-checkbox v-model:checked="checkAll" @click="checkAllMarket(checkAll)"></a-checkbox>
            </div>
          </template>
          <template v-else>
            <div style="text-align: center">{{column.title}}</div>
          </template>
        </template>

        <!--bodyCell-->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'ssi_ix'">
            <div class="center">
              <a-checkbox v-model:checked="record.checked"></a-checkbox>
            </div>
          </template>
          <template v-else-if="column.title === '쇼핑몰'">
            <div style="text-align: center;"> {{record.value.split('::')[1]}} </div>
          </template>
          <template v-else-if="column.title === '제휴사'">
            <div  style="text-align: center;">{{record.value.split('::')[0]}}</div>
          </template>
        </template>
      </a-table>

      <!--footer-->
      <template v-slot:footer>
        <div style="text-align: center">
          <a-button type="primary" @click="testsync('multi')">연동</a-button>
          <a-button type="primary" @click="MarketListClose">닫기</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {AuthRequest} from '@/util/request';

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
          title: '전체',
          dataIndex: 'ssi_ix',
          key: 'ssi_ix',
          width: 20,
        },
        {
          title: '쇼핑몰',
          dataIndex: 'value',
          key: 'value',
          width: 100,
        },
        {
          title: '제휴사',
          dataIndex: 'value',
          key: 'value',
          width: 100,
        },
      ],
      checkAll: false,
    };
  },

  methods: {
    MarketListClose() {
      this.relaket.data.MarketListVisible = false;
    },

    testsync(type) {
      this.relaket.data.indicator = true;
      let list = '';
      let marketList = [];
      if (type === 'multi') {
        marketList = this.relaket.data.marketList;
        list = this.getCheckList();
      } else {
        marketList = this.getCheckedMarketList();
        list = this.relaket.data.singleDetail.item_id + '';
      }

      if (list === ',' || list.length === 0) {
        alert('상품을 선택해주세요');
        this.relaket.data.indicator = false;
        return false;
      }

      let aOptions = JSON.parse(JSON.stringify(this.relaket.data.options));

      marketList = [];
      aOptions.map((options, i) => {
        if (options.checked) {
          delete aOptions[i].checked;
          marketList.push(options.value);
        }
      })

      if (marketList.length === undefined) {
        alert('선택된 제휴사가 없습니다.');
        this.relaket.data.indicator = false;
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/syncmarket',
          {params: {list: list, market: marketList, options: aOptions}}).then((res) => {
        if (res.status !== '2000') {
          alert(res.message)
        }

        let returnData = res.data;
        if (type === 'multi') {
          this.relaket.data.setResultPopData(true, [
            returnData.success,
            returnData.failedCode,
            returnData.failed,
            returnData.total,
            returnData.data,
          ])
        } else {
          this.relaket.data.MarketListVisible = false;
          this.relaket.data.singleDetail = [];
        }

        this.relaket.data.MarketListVisible = false;
        this.relaket.data.indicator = false;
      });

    },

    getCheckList() {
      let list = '';
      for (let i = 0; i < this.relaket.data.prdlist.length; i++) {
        if (this.relaket.data.prdlist[i].checked === true) {
          let comma = i === 0 ? '' : ',';
          list += comma + this.relaket.data.prdlist[i].item_id;
        }
      }

      return list;
    },

    getCheckedMarketList() {
      let list = [];

      for (let i = 0; i < this.relaket.data.singleDetail.item_sync_market.length; i++) {
        if (this.relaket.data.singleDetail.item_sync_market[i].checked === true) {
          list.push(this.relaket.data.singleDetail.item_sync_market[i].market_account);
        }
      }

      return list;
    },

    checkAllMarket(checkAll) {
      for (let i = 0; i < this.relaket.data.options.length; i++) {
        this.relaket.data.options[i].checked = !checkAll;
      }
    },
  },

  mounted() {},
};

</script>

<style scoped>
/*#container {*/
/*  height: 800px;*/
/*}*/

.titleStyle {
  text-align: center;
  display: inline-block;
  width: 100%;
  margin-top: 10px;
}

.ant-table-thead {

}
</style>
