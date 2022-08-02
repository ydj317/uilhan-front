<template>
  <div style="margin: 30px; background-color: white;">
    <!--버튼-->
    <div style="height: 80px; display: flex; justify-content: space-between;">
      <div style="display: flex; align-items: center; margin-left: 20px; top: -50px">
        <a-checkbox v-model:checked="common.checked" @change="checkItem"></a-checkbox>
      </div>
      <div style="display: flex; align-items: center">
        <a-popconfirm
            title="삭제하시겠습니까?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deletePrd"
        >
          <a-button style="margin-right: 30px; width: 100px; height: 40px; background-color: #f06543; border: none; border-radius: 5px;" type="primary">상품삭제</a-button>
        </a-popconfirm>
        <a-popconfirm
            v-if="common.roles.length > 0 && common.roles.indexOf('ROLE_RELAKET') > -1"
            title="릴라켓에 연동하시겠습니까?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="sendMarket"
        >
          <a-button style="margin-right: 30px; width: 100px; height: 40px; background-color: #f06543; border: none; border-radius: 5px;" type="primary">릴라켓연동</a-button>
        </a-popconfirm>
      </div>
    </div>

    <!--상품 리스트-->
    <div>
      <a-table
          :bordered="true"
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
      >
        <template
            v-for="col in column"
            #[col]="{ text, record, line }"
            :key="col"
        >
          <!--체크박스-->
          <template v-if="col === 'item_id'">
            <a-checkbox v-model:checked="record.checked"></a-checkbox>
          </template>

          <!--사진-->
          <template v-if="col === 'item_thumb'">
            <img :src="text" alt="" style="width: 100px; height: 100px">
          </template>

          <!--상품정보-->
          <template v-if="col === 'item_name'">
            <div>
              <a-button type="link" :href="record.item_url" :target="'_blank'">{{record.item_name}}</a-button>
            </div>
            <div style="padding-left: 15px;">상품 바로가기 : {{record.item_code}}</div>

            <!--미연동-->
            <div v-if="!record.item_sync_date && !record.item_sync_status" style="padding-left: 15px; margin-top: 5px;">
              <a-button type="primary" style="background-color: #eff2f7; color: black; border: none">릴라켓 미연동</a-button>
            </div>

            <!--연동-->
            <div v-if="record.item_sync_date">
              <a-button type="primary" :style="buttonStyle(record.item_sync_status)">릴라켓 연동{{ record.item_sync_status? '성공': '실패' }}</a-button>
            </div>
          </template>

          <!--등록&수정시간-->
          <template v-if="col === 'item_ins'">
            <div style="font-size: 15px">
              <div>상품등록：{{record.item_ins}}</div>
              <div>상품수정：{{record.item_upd}}</div>
            </div>
          </template>

          <!--제휴사연동-->
          <template v-if="col === 'item_sync_status'">
            <div style="display: flex; justify-content: center;">
              <a-button @click="singlePop(record)" style="width: 80%; height: 40px; border-radius: 25px; font-size: 15px;" danger ghost>제휴사연동</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!--제휴사연동-->
    <div v-if="common.SyncPop">
      <a-modal width="600px" :maskClosable="false" v-model:visible="common.singleSyncPop" @ok="">
        <template #title>
          <h3 style="text-align: center; display: inline-block; width: 90%"><b>제휴사 상품연동</b></h3>
        </template>
        <a-checkbox style="margin-left: 20px" v-model:checked="common.checkAll" @click="checkAllMarket(checkAll)">전체선택</a-checkbox>
        <a-list :data-source="common.singleDetail.item_sync_market" style="height: 600px;overflow-y:scroll;">
          <template #renderItem="{ item }">
            <a-list-item>
              <div v-if="item.status !== 'unsync'" :class="item.status + ` prdSyncResult`">
                <a-checkbox v-model:checked="item.checked"></a-checkbox>
                <span style="margin-left: 10px"><b>연동계정 : {{item.market_account}}</b></span><br/>
                <span style="margin-left: 20px;"><b>등록시간 : {{item.ins_time}}</b></span><br/>
                <span style="margin-left: 20px;"><b>재연동시간 : {{item.upd_time}}</b></span><br/>
                <span style="margin-left: 20px;"><b>연동결과 : {{item.result}}</b></span>
              </div>
              <div v-else :class="item.status + ` prdSyncResult`">
                <a-checkbox v-model:checked="item.checked"></a-checkbox>
                <span style="margin-left: 10px"><b>연동계정 : {{item.market_account}}</b></span><br/>
                <span style="margin-left: 25px"><b>미연동</b></span>
              </div>
            </a-list-item>
          </template>
        </a-list>
        <template v-slot:footer>
          <a-button type="primary" @click="testsync('single')">선택제휴사연동</a-button>
          <a-button type="primary" @click="closeResultPop('single')">확인</a-button>
        </template>
      </a-modal>
      <a-modal width="600px" :maskClosable="false" v-model:visible="common.marketSyncPop" title="제휴사연동결과" @ok="">
        <h3><b>총{{common.marketSyncTotal}}개 상품 / 성공 {{common.marketSyncSuccess}} / 실패 {{common.marketSyncFailed}}</b></h3>
        <a-list v-if="common.marketSyncResult.length > 0" :data-source="common.marketSyncResult">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card :title="item.market_account" style="width: 100%">
                <p v-for="( prd ) in item.products">{{ prd.prd_code }} - {{prd.result}}</p>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
        <template v-slot:footer>
          <a-button  type="primary" @click="searchFailed">실패상품검색</a-button>
          <a-button type="primary" @click="closeResultPop('multi')">확인</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {AuthRequest} from '../../util/request';
import moment from 'moment';

export default {
  computed: {
    ...mapState([
      'prdlist',
      'common',
    ])
  },

  data() {
    return {
      columns: [
        {
          title: "",
          width: "3%",
          slots: {
            customRender: "item_id",
          },
        },
        {
          title: "사진",
          dataIndex: "item_thumb",
          width: "3%",
          slots: {
            customRender: "item_thumb",
          },
        },
        {
          title: "상품정보",
          dataIndex: "item_name",
          width: "54%",
          slots: {
            customRender: "item_name",
          },
        },
        {
          title: "등록&수정시간",
          dataIndex: "item_ins",
          width: "20%",
          slots: {
            customRender: "item_ins",
          },
        },
        {
          title: "제휴사연동",
          dataIndex: "item_sync_status",
          width: "20%",
          slots: {
            customRender: "item_sync_status",
          },
        },
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: () => `전체 상품 건수 ${this.common.totalCount} / 검색 상품 건수 ${this.common.searchCount}`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: page => {
          this.pagination.current = page;
          this.getList();
        },
      },
      column: [
        'item_id',
        'item_thumb',
        'item_name',
        'item_ins',
        'item_sync_status',
      ],

      dataSource: []
    }
  },

  methods: {
    searchFailed() {
      if (this.marketSyncFailedCode.length === 0) {
        alert('연동실패한 상품이 없습니다.');
        return false;
      }

      this.search_key = 'item_code';
      this.search_value = this.marketSyncFailedCode;
      this.getList();

      this.setResultPopData(false, []);
    },

    closeResultPop(type) {
      if (type === 'multi') {
        this.setResultPopData(false);
      } else {
        this.singleSyncPop = false;
        this.singleDetail = [];
        this.checkedList = [];
      }

      this.getList();
    },

    sendMarket() {
      this.common.loading = true;
      let list = this.getCheckList();
      if (list === undefined || list.length === 0) {
        alert('선택된 상품이 없습니다.');
        this.common.loading = false;
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

        let item = this.prdlist.filter((item) => parseInt(item.item_id) === parseInt(id))[0];

        if (item.item_cate === null) {
          notCatePrd += notCatePrd.length === 0 ? '' : ',';
          notCatePrd += item.item_id;
          continue;
        }

        hasCatePrd += hasCatePrd.length === 0 ? '' : ',';
        hasCatePrd += item.item_id;
      }

      if (notCatePrd.length === items.length) {
        alert('선택하신 모든든 상품의 마켓연동에 필요한 카테고리 값이 없습니다.');
        this.common.loading = false;
        return false;
      }

      if (notCatePrd.length > 0) {
        alert(notCatePrd + ' 등 상품의 카테고리 정보가 없습니다.');
      }

      AuthRequest.post(process.env.VUE_APP_API_URL + '/api/sendmarket', {list: list}).then((res) => {
        if (res.data !== undefined && res.data.length === 0) {
          alert("해당요청에 오류가 발생하였습니다. \ 재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
          this.common.loading = false;
          return false;
        }

        let data = res.data.data;
        alert('연동성공 상품 : ' + data.success_code + "\n" + '연동실패 상품 : ' + data.failed_code);
        this.common.msg = data.msg;
        this.common.loading = false;
        this.getList();
      }).catch((error) => {
        alert(error.message);
        this.common.loading = false;
        return false;
      });
    },

    deletePrd() {
      let list = this.getCheckList();
      if (list === undefined || list.length === 0) {
        alert('선택된 상품이 없습니다.');
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/deleteprd', {params: {list: list}}).then((res) => {
        if (res.status !== 200) {
          alert('삭제실패');
          return false;
        }

        this.getList();
      });
    },

    setResultPopData(isOpen, data) {
      if (isOpen) {
        this.common.marketSyncSuccess = data[0];
        this.common.marketSyncFailedCode = data[1];
        this.common.marketSyncFailed = data[2];
        this.common.marketSyncTotal = data[3];
        this.common.marketSyncResult = data[4];
        this.common.marketSyncPop = true;
      } else {
        this.common.marketSyncSuccess = 0;
        this.common.marketSyncFailedcode = '';
        this.common.marketSyncFailed = 0;
        this.common.marketSyncTotal = 0;
        this.common.marketSyncResult = [];
        this.common.marketSyncPop = false;
      }
    },

    getCheckList() {
      let list = '';
      for (let i = 0; i < this.prdlist.length; i++) {
        if (this.prdlist[i].checked === true) {
          let comma = i === 0 ? '' : ',';
          list += comma + this.prdlist[i].item_id;
        }
      }

      return list;
    },

    testsync(type) {
      this.common.loading = true;
      let list = '';
      let marketList = [];
      if (type === 'multi') {
        marketList = this.common.marketList;
        list = this.getCheckList();
      } else {
        marketList = this.getCheckedMarketList();
        list = this.singleDetail.item_id + '';
      }

      if (list === ',' || list.length === 0) {
        alert('상품을 선택해주세요');
        this.common.loading = false;
        return false;
      }

      if (this.common.marketList.length === undefined) {
        alert('선택된 제휴사가 없습니다.');
        this.common.loading = false;
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/syncmarket',
          {params: {list: list, market: marketList, options: this.common.options}}).then((res) => {
        let returnData = res.data;

        if (returnData.status === undefined || returnData.status !== '2000') {
          alert(returnData.msg);
        }

        if (type === 'multi') {
          this.setResultPopData(true, [
            returnData.data.success,
            returnData.data.failedCode,
            returnData.data.failed,
            returnData.data.total,
            returnData.data.data,
          ]);
        } else {
          this.common.singleSyncPop = false;
          this.common.singleDetail = [];
          this.common.checkedList = [];

          this.setResultPopData(true, [
            returnData.data.success,
            returnData.data.failedCode,
            returnData.data.failed,
            returnData.data.total,
            returnData.data.data,
          ]);
        }

        this.common.loading = false;
      });


    },

    marketListChange() {
    },

    checkItem() {
      if (this.prdlist !== undefined && this.prdlist.length > 0) {
        for (let i = 0; i < this.prdlist.length; i++) {
          this.prdlist[i].checked = !this.prdlist[i].checked;
        }
      }
    },

    buttonStyle(item_sync_status) {
      return item_sync_status?
          'background-color: #3ddc97; border: none':
          'background-color: #f06543; border: none'
    },

    singlePop(item) {
      this.common.singleSyncPop = !this.common.singleSyncPop;
      this.common.singleDetail = item;
      for (let i = 0; i < this.common.singleDetail.item_sync_market.length; i++) {
        let isChecked = false;
        if (this.common.singleDetail.item_sync_market[i].status !== 'unsync') {
          isChecked = true;
        }

        this.common.singleDetail.item_sync_market[i].checked = isChecked;
      }

      this.common.SyncPop = true;
    },

    getParam() {
      return {
        'market_code': this.common.market_code || 'all',
        'date_type': this.common.date_type || 'insert_date',
        'start_time': this.common.start_time || '',
        'end_time': this.common.end_time || '',
        'search_key': this.common.search_key || 'item_code',
        'search_value': this.common.search_value || '',
        'trans_status': this.common.trans_status || 'all',
        'sync_status': this.common.sync_status || 'all',
        'limit': this.pagination.pageSize,
        'page': this.pagination.current,
      };
    },

    getList() {
      this.common.onload = false;
      this.common.loading = true;

      let param = this.getParam();
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/prdlist', {params: param}).then((res) => {
        this.$store.state.prdlist = Object.assign([], res.data.list);

        for (let i = 0; i < this.prdlist.length; i++) {
          this.prdlist[i].checked = false;
          this.prdlist[i].item_name_type = '기존 상품명';
          if (this.prdlist[i].item_is_trans === true) {
            this.prdlist[i].item_name_type = '번역 상품명';
          }
        }

        this.common.date_type = this.common.date_type || 'insert_date';
        this.common.search_key = this.common.search_key || 'item_code'

        this.common.searchCount = parseInt(res.data.searchCount);
        this.common.totalCount = parseInt(res.data.totalCount);

        this.common.date = [moment(res.data.start_time), moment(res.data.end_time)];
        this.common.msg = res.data.msg;
        if (this.common.isChangeLimit) {
          this.common.isChangeLimit = false;
        }

        // this.pagination.total = parseInt(res.data.searchCount);
        // this.pagination.current = parseInt(res.data.page);
        // this.pagination.pageSize = parseInt(res.data.limit);

        this.common.onload = true;
        this.common.loading = false;
      });
    },
  },

  mounted() {
    this.dataSource = JSON.parse(JSON.stringify(this.prdlist));
    this.dataSource.map((dataSource, i) => {
      this.dataSource[i].key = i;
      this.dataSource[i].checked = false;
    });

    this.pagination.total = JSON.parse(JSON.stringify(this.common.pagination.total));
    this.pagination.current = JSON.parse(JSON.stringify(this.common.pagination.current));
    this.pagination.pageSize = JSON.parse(JSON.stringify(this.common.pagination.pageSize));

    this.common.SyncPop = false;
  }
};
</script>

<style scoped>

</style>