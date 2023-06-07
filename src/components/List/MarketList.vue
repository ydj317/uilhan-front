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

      async sendMarket() {
          let list = this.getCheckList();
          if (list === undefined || list.length === 0) {
              alert('선택된 상품이 없습니다.');
              return false;
          }

          let items = list.split(',');
          let notCatePrd = '';
          let hasCatePrd = '';

          for (let i = 0; i < items.length; i++) {
              let id = items[i];
              if (id === undefined || id === '' || id === null) {
                  continue;
              }

              let item = this.relaket.data.prdlist.filter((item) => parseInt(item.item_id) === parseInt(id))[0];

              if (item.item_cate === null) {
                  notCatePrd += notCatePrd.length === 0 ? '' : ',';
                  notCatePrd += item.item_id;
                  continue;
              }

              hasCatePrd += hasCatePrd.length === 0 ? '' : ',';
              hasCatePrd += item.item_id;
          }

          if (notCatePrd.length === items.length) {
              alert('선택하신 모든 상품의 마켓연동에 필요한 카테고리 값이 없습니다.');
              return false;
          }

          if (notCatePrd.length > 0) {
              alert(notCatePrd + ' 등 상품의 카테고리 정보가 없습니다.');
          }

          try {
              const res = await AuthRequest.post(process.env.VUE_APP_API_URL + '/api/sendmarket', {list: list});

              if (res.status !== '2000') {
                  alert(res.message)
                  this.indicator = false;
                  return false;
              }

              if (res.data !== undefined && res.data.length === 0) {
                  alert("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
                  this.indicator = false;
                  return false;
              }

              let data = res.data;

              // let sMessage = "";
              // if (data.success_code.length) {
              //     sMessage = '연동성공 상품 : ' + data.success_code;
              // }
              // if (data.failed_code.length) {
              //     sMessage += "\n연동실패 상품 : " + data.failed_code;
              // }
              //
              // alert(sMessage);
              //
              // return false;

              return true;

          } catch (e) {
              alert(e.message);
              return false;
          }
      },

    async testsync(type) {

      this.relaket.data.indicator = true;

        // 릴라켓 연동
        if (await this.sendMarket() === false) {
            this.relaket.data.indicator = false;
            return false;
        }


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
