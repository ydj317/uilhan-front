<template>
  <div>
    <a-modal v-model:visible="common.MarketListVisible">
      <!--   타이틀   -->
      <template #title>
        <h3 class="titleStyle"><b>연동할 제휴사</b></h3>
      </template>
      <a-table bordered="false" :columns="columns" :data-source="MarketList" :pagination="{hideOnSinglePage:true}">
        <template #headerCell="{ column }">
          <template v-if="column.key === 'all'">
            <div style="text-align: center"><a-button>{{column.title}}</a-button></div>
          </template>
          <template v-else>
            <div style="text-align: center">{{column.title}}</div>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'all'">
            <div style="text-align: center">
              <a-checkbox v-model:checked="checked"></a-checkbox>
            </div>
          </template>
          <template v-else-if="column.key === 'mallid'">
            <div style="text-align: center;"> {{record.mallid}} </div>
          </template>
          <template v-else-if="column.key === 'market'">
            <div  style="text-align: center;">{{record.market}}</div>
          </template>
        </template>
      </a-table>

      <!--   버튼    -->
      <template v-slot:footer>
        <div style="text-align: center">
          <a-button type="primary" @click="">연동</a-button>
          <a-button type="primary" @click="MarketListClose">닫기</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  computed: {
    ...mapState([
      'common',
    ])
  },

  data() {
    return {
      MarketList,
      columns
    }
  },

  methods: {
    MarketListClose() {
      this.common.MarketListVisible = false;
    }
  },

  mounted() {},
};

const MarketList = [
  {mallid: "rctaoye", market: '11st', ssi_ix: "2280"},
  {mallid: "zhuoshun", market: 'auction', ssi_ix: "2281"},
  {mallid: "yunmeng04", market: 'coupang', ssi_ix: "2319"}
];

const columns = [{
  title: '전체',
  dataIndex: 'all',
  key: 'all',
  width: 20,
}, {
  title: '쇼핑몰',
  dataIndex: 'mallid',
  key: 'mallid',
  width: 100,
}, {
  title: '제휴사',
  dataIndex: 'market',
  key: 'market',
  width: 100,
}];

</script>

<style scoped>
#container {
  height: 800px;
}

.titleStyle {
  text-align: center;
  display: inline-block;
  width: 100%;
  margin-top: 10px;
}

.ant-table-thead {

}
</style>