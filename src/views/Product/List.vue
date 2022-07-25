<template>
  <a-spin :indicator="indicator" />

  <div class="container">
    <!--검색-->
    <div class="search">
      <!--선택버튼 (상품수집마켓, 번역, 릴라켓연동)-->
      <div class="search_button" v-for="CONFIG in SEARCH_BUTTON_CONFIG" :class="CONFIG.key">
        <h1>{{ CONFIG.label }}</h1>
        <a-radio-group v-model:value="CONFIG.key">
          <a-radio-button v-for="data in CONFIG.options" :class="data.class" :value="data.value">{{ data.label }}</a-radio-button>
        </a-radio-group>
      </div>

      <!--검색기간-->
      <div class="search_date">
        <h1>기간</h1>
        <a-select v-model:value="date_type">
          <a-select-option v-for="data in SEARCH_DATE_CONFIG" :value="data.key">{{ data.label }}</a-select-option>
        </a-select>
        <a-space direction="vertical">
          <a-range-picker
              :value="date"
              :placeholder="['Start Time', 'End Time']"
              format="YYYY-MM-DD"
              @change="onChangeDatePicker"
          />
        </a-space>
      </div>

      <!--검색입력창-->
      <div class="search_keyword">
        <h1>키워드</h1>
        <a-select v-model:value="search_key" @change="limitChange">
          <a-select-option v-for="config in SEARCH_KEYWORD_CONFIG" :value="config.key">{{ config.label }}</a-select-option>
        </a-select>
        <a-input v-model:value="search_value" placeholder="키워드"/>
        <a-button @click="getList" type="primary">검색</a-button>
      </div>
    </div>

    <!--상품 리스트-->
    <div class="list">
      <!--top-->
      <div class="top">
        <!--전체선택-->
        <!--        <a-checkbox v-model:checked="checked" @change="checkItem"></a-checkbox>-->

        <!--left button-->
        <div class="left">
          <!--상품번역-->
          <a-button type="primary">상품번역</a-button>
          <!--새로고침-->
          <a-button type="primary">새로고침</a-button>
          <!--상품삭제-->
          <a-popconfirm title="삭제하시겠습니까?" @confirm="deletePrd">
            <a-button type="primary">상품삭제</a-button>
          </a-popconfirm>
        </div>

        <!--right button-->
        <div class="right">
          <!--릴라켓연동-->
          <a-popconfirm title="릴라켓에 연동하시겠습니까?" @confirm="sendMarket">
            <a-button type="primary">릴라켓연동</a-button>
          </a-popconfirm>
          <!--제휴사 상품연동-->
          <a-button type="primary" @click="testsync('multi')">제휴사 상품연동</a-button>
        </div>
      </div>

      <!--content-->
      <div class="content">
        <a-table :bordered="true" :columns="LIST_COLUMNS_CONFIG" :data-source="prdlist" :pagination="pagination">
          <template v-for="col in LIST_KEYS_CONFIG" #[col]="{ text, record, line }" :key="col">
            <!--체크박스-->
            <a-checkbox v-if="equal(col, 'item_id')" v-model:checked="record.checked"></a-checkbox>
            <!--사진-->
            <img v-if="equal(col, 'item_thumb')" :src="text" alt="" style="width: 100px; height: 100px">
            <!--상품정보-->
            <div v-if="equal(col, 'item_name')">
              <!--상품명-->
              <div><a-button type="link" :href="record.item_url" :target="'_blank'">{{record.item_name}}</a-button></div>
              <!--상품코드-->
              <div style="padding-left: 15px;">상품 바로가기 : {{record.item_code}}</div>
              <!--미연동-->
              <div v-if="!record.item_sync_date && !record.item_sync_status" style="padding-left: 15px; margin-top: 5px;">
                <a-button type="primary" style="background-color: #eff2f7; color: black; border: none">릴라켓 미연동</a-button>
              </div>
              <!--연동-->
              <div v-if="record.item_sync_date">
                <a-button type="primary" :style="buttonStyle(record.item_sync_status)">릴라켓 연동{{ record.item_sync_status? '성공': '실패' }}</a-button>
              </div>
            </div>
            <!--등록&수정시간-->
            <div v-if="equal(col, 'item_ins')" style="font-size: 15px">
              <div>상품등록：{{record.item_ins}}</div>
              <div>상품수정：{{record.item_upd}}</div>
            </div>
            <!--제휴사연동-->
            <div v-if="equal(col, 'item_sync_status')" style="display: flex; justify-content: center;">
              <a-button @click="singlePop(record)" style="width: 80%; height: 40px; border-radius: 25px; font-size: 15px;" danger ghost>제휴사연동</a-button>
            </div>
          </template>
        </a-table>
      </div>
    </div>

    <!--제휴사연동-->
    <div class="sync">
      <a-modal width="600px" :maskClosable="false" v-model:visible="singleSyncPop" @ok="">
        <template #title>
          <h3 style="text-align: center; display: inline-block; width: 90%"><b>제휴사 상품연동</b></h3>
        </template>
        <a-checkbox style="margin-left: 20px" v-model:checked="checkAll" @click="checkAllMarket(checkAll)">전체선택</a-checkbox>

        <a-list :data-source="singleDetail.item_sync_market" style="height: 600px;overflow-y:scroll;">
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
      <a-modal width="600px" :maskClosable="false" v-model:visible="marketSyncPop" title="제휴사연동결과" @ok="">
        <h3><b>총{{marketSyncTotal}}개 상품 / 성공 {{marketSyncSuccess}} / 실패 {{marketSyncFailed}}</b></h3>
        <a-list v-if="marketSyncResult.length > 0" :data-source="marketSyncResult">
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
import { defineComponent } from 'vue';
import {AuthRequest} from "util/request";
import moment from "moment";
// import Loading from 'vue-loading-overlay';
// import 'vue-loading-overlay/dist/vue-loading.css';
import Cookie from "js-cookie";

export default defineComponent({
  components: { Cookie },
  data() {
    return {
      SEARCH_BUTTON_CONFIG: [
        {
          options: [
            {
              label: '전체',
              value: 'all',
              class: 'market_code_default',
            },
            {
              label: 'Tmall',
              value: 'Tmall',
              class: 'market_code'
            },
            {
              label: 'Taobao',
              value: 'Taobao',
              class: 'market_code'
            },
            {
              label: 'Alibaba',
              value: 'Alibaba',
              class: 'market_code'
            },
          ],
          label: '상품수집마켓',
          key: 'market_code',
        },
        {
          options: [
            {
              label: '전체',
              value: 'all',
              class: 'trans_status_default',
            },
            {
              label: '번역',
              value: '1',
              class: 'trans_status',
            },
            {
              label: '미번역',
              value: '0',
              class: 'trans_status',
            }
          ],
          label: '번역',
          key: 'trans_status',
        },
        {
          options: [
            {
              label: '전체',
              value: 'all',
              class: 'sync_status_default',
            },
            {
              label: '성공',
              value: '1',
              class: 'sync_status',
            },
            {
              label: '실패',
              value: '0',
              class: 'sync_status',
            },
            {
              label: '미연동',
              value: '2',
              class: 'sync_status',
            },
          ],
          label: '릴라켓연동',
          key: 'sync_status',
        },
      ],
      SEARCH_DATE_CONFIG: [
        {
          key: 'insert_date',
          label: '등록'
        },
        {
          key: 'update_date',
          label: '수정'
        },
      ],
      SEARCH_KEYWORD_CONFIG: [
        {
          key: 'item_code',
          label: '상품코드',
        },
        {
          key: 'item_name',
          label: '기존 상품명',
        },
        {
          key: 'item_trans_name',
          label: '번역 상품명',
        },
        {
          key: 'sku_code',
          label: '품목코드',
        },
      ],
      LIST_COLUMNS_CONFIG: [
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
      LIST_KEYS_CONFIG: [
        'item_id',
        'item_thumb',
        'item_name',
        'item_ins',
        'item_sync_status',
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: () => `전체 상품 건수 ${this.totalCount} / 검색 상품 건수 ${this.searchCount}`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: page => {
          this.pagination.current = page;
          this.getList();
        },
      },

      checked: false,
      indicator: false,
      trans_status: 'all',
      isChangeLimit: false,
      date: [],
      pageNum: 1,
      limit: 10,
      prdlist: [],
      market_code: 'all',
      date_type: 'insert_date',
      search_key: 'item_code',
      start_time: '',
      end_time: '',
      search_value: '',
      searchCount: 0,
      totalCount: 0,
      msg: [],
      sync_status: 'all',
      options: [],
      marketList: [],
      marketSyncPop: false,
      marketSyncResult: [],
      marketSyncSuccess: 0,
      marketSyncFailed: 0,
      marketSyncTotal: 0,
      marketSyncFailedCode: '',
      singleSyncPop: false,
      singleDetail: [],
      checkedList: [],
      checkAll: false,
    }
  },

  methods: {
    equal(key1, key2) {
      return key1 === key2;
    },

    buttonStyle(item_sync_status) {
      return item_sync_status?
          'background-color: #3ddc97; border: none':
          'background-color: #f06543; border: none'
    },

    limitChange() {
      this.isChangeLimit = true;
    },

    getList() {
      let param = this.getParam();
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/prdlist', {params: param}).then((res) => {
        this.prdlist = res.data.list;

        for (let i = 0; i < this.prdlist.length; i++) {
          this.prdlist[i].key = i;
          this.prdlist[i].checked = false;
          this.prdlist[i].item_name_type = '기존 상품명';
          if (this.prdlist[i].item_is_trans === true) {
            this.prdlist[i].item_name_type = '번역 상품명';
          }
        }

        this.searchCount = parseInt(res.data.searchCount);
        this.totalCount = parseInt(res.data.totalCount);
        this.pagination.total = parseInt(res.data.searchCount);
        this.pagination.current = parseInt(res.data.page);
        this.pagination.pageSize = parseInt(res.data.limit);
        this.date = [moment(res.data.start_time), moment(res.data.end_time)];
        this.msg = res.data.msg;
        if (this.isChangeLimit) {
          this.isChangeLimit = false;
        }
      });
    },

    getParam() {
      return {
        'market_code': this.market_code === '' || this.market_code === null ? 'all' : this.market_code,
        'date_type': this.date_type,
        'start_time': this.start_time,
        'end_time': this.end_time,
        'search_key': this.search_key,
        'search_value': this.search_value,
        'trans_status': this.trans_status === '' || this.trans_status === null ? 'all' : this.trans_status,
        'sync_status': this.sync_status === '' || this.sync_status === null ? 'all' : this.sync_status,
        'limit': parseInt(this.limit),
        'page': this.isChangeLimit ? 1 : parseInt(this.pageNum),
      };
    },

    onChangeDatePicker(value, dateString) {
      this.start_time = dateString[0];
      this.end_time = dateString[1];
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

    sendMarket() {
      this.indicator = true;
      let list = this.getCheckList();
      if (list === undefined || list.length === 0) {
        alert('선택된 상품이 없습니다.');
        this.indicator = false;
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
        this.indicator = false;
        return false;
      }

      if (notCatePrd.length > 0) {
        alert(notCatePrd + ' 등 상품의 카테고리 정보가 없습니다.');
      }

      AuthRequest.post(process.env.VUE_APP_API_URL + '/api/sendmarket', {list: list}).then((res) => {
        if (res.data !== undefined && res.data.length === 0) {
          alert("해당요청에 오류가 발생하였습니다. \ 재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
          this.indicator = false;
          return false;
        }

        let data = res.data.data;
        alert('연동성공 상품 : ' + data.success_code + "\n" + '연동실패 상품 : ' + data.failed_code);
        this.msg = data.msg;
        this.indicator = false;
        this.getList();
      }).catch((error) => {
        alert(error.message);
        this.indicator = false;
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

    excelDown() {
      let list = this.getCheckList();

      let param = {};
      if (list.length === 0) {
        this.indicator = true;
        param = this.getParam()
      } else {
        param = {list: list};
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/exceldown', {params: param}).then((res) => {
        this.indicator = false;
        if (res.status !== 200) {
          alert("파일 다운로드에 실패하였습니다. \n일시적인 현상이오니 잠시후 재 시도하시길 바랍니다.");
          return false;
        }
        window.open(res.data.path);
      });
    },

    checkItem() {
      if (this.prdlist !== undefined && this.prdlist.length > 0) {
        for (let i = 0; i < this.prdlist.length; i++) {
          this.prdlist[i].checked = !this.prdlist[i].checked;
        }
      }
    },

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

    testmarket() {
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/getcategorylist').then((res) => {

      });
    },

    getMarketList() {
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/marketlist').then((res) => {
        let returnData = res.data;
        if (returnData.status === undefined || returnData.status !== '2000') {
          alert(returnData.msg);
          return false;
        }

        this.options = returnData.data;
      });
    },

    testPop() {
      this.marketSyncPop = !this.marketSyncPop;
    },

    testsync(type) {
      this.indicator = true;
      let list = '';
      let marketList = [];
      if (type === 'multi') {
        marketList = this.marketList;
        list = this.getCheckList();
      } else {
        marketList = this.getCheckedMarketList();
        list = this.singleDetail.item_id + '';
      }

      if (list === ',' || list.length === 0) {
        alert('상품을 선택해주세요');
        this.indicator = false;
        return false;
      }

      if (this.marketList.length === undefined) {
        alert('선택된 제휴사가 없습니다.');
        this.indicator = false;
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/syncmarket',
          {params: {list: list, market: marketList, options: this.options}}).then((res) => {
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
          this.singleSyncPop = false;
          this.singleDetail = [];
          this.checkedList = [];

          this.setResultPopData(true, [
            returnData.data.success,
            returnData.data.failedCode,
            returnData.data.failed,
            returnData.data.total,
            returnData.data.data,
          ]);
        }

        this.indicator = false;
      });


    },

    setResultPopData(isOpen, data) {
      if (isOpen) {
        this.marketSyncSuccess = data[0];
        this.marketSyncFailedCode = data[1];
        this.marketSyncFailed = data[2];
        this.marketSyncTotal = data[3];
        this.marketSyncResult = data[4];
        this.marketSyncPop = true;
      } else {
        this.marketSyncSuccess = 0;
        this.marketSyncFailedcode = '';
        this.marketSyncFailed = 0;
        this.marketSyncTotal = 0;
        this.marketSyncResult = [];
        this.marketSyncPop = false;
      }
    },

    singlePop(item) {
      this.singleSyncPop = !this.singleSyncPop;
      this.singleDetail = item;
      for (let i = 0; i < this.singleDetail.item_sync_market.length; i++) {
        let isChecked = false;
        if (this.singleDetail.item_sync_market[i].status !== 'unsync') {
          isChecked = true;
        }

        this.singleDetail.item_sync_market[i].checked = isChecked;
      }

    },

    checkAllMarket(checkAll) {
      for (let i = 0; i < this.singleDetail.item_sync_market.length; i++) {
        if (checkAll === false) {
          this.singleDetail.item_sync_market[i].checked = true;
        } else {
          this.singleDetail.item_sync_market[i].checked = false;
        }
      }
    },

    getCheckedMarketList() {
      let list = [];

      for (let i = 0; i < this.singleDetail.item_sync_market.length; i++) {
        if (this.singleDetail.item_sync_market[i].checked === true) {
          list.push(this.singleDetail.item_sync_market[i].market_account);
        }
      }

      return list;
    },
  },

  mounted() {
    this.getList();
    this.getMarketList();

    document.querySelector('.search_button.trans_status').style.display = 'inline-block';
    document.querySelector('.search_button.sync_status').style.display = 'inline-block';
    document.querySelector('.search_date > div').style.width = '100px';

    document.querySelector('.search_button.market_code label').style.width = '100px';
  }
});
</script>

<!--search-->
<style>
* {
  content: none;
  outline: none;
  margin: 0;
  padding: 0;
}

.container {
  /*border: 1px solid red;*/

  display: flex;
  flex-direction: column;
  padding: 20px;
}

.search {
  background-color: white;
  padding: 20px;
}

.search > div > div{
  margin-bottom: 10px;
  margin-right: 5px;
}

/*모든 title*/
.search h1 {
  font-size: .875rem;
  margin: 0 0 7px 0;
  font-weight: 700;
  text-transform: uppercase;
}

/*모든버튼*/
.search_button > div label {
  margin-right: 10px;
}

/*상품수집마켓 모든버튼*/
.search_button.market_code label {
  text-align: center;
  width: 100px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid red;
  color: red;
  outline: none;
  content: none;
}
/*상품수집마켓 처음버튼*/
.search_button.market_code label:first-child {
  background-color: #3ddc97;
  border: 1px solid #3ddc97;
  color: white;
}

/*번역,릴라켓연동 모든버튼*/
.search_button.trans_status label,
.search_button.sync_status label
{
  text-align: center;
  width: 100px;
  border-radius: 5px;
  background-color: #d6ddea;
  border: none;
  color: black;
}

/*번역,릴라켓연동 처음버튼*/
.search_button.trans_status label:first-child,
.search_button.sync_status label:first-child
{
  text-align: center;
  width: 100px;
  border-radius: 5px;
  background-color: #2744b7;
  border: none;
  color: white;
}

/*키워드 셀렉*/
.search_keyword > div:first-child {
  width: 120px !important;
}
/*키워드 입력*/
.search_keyword input {
  width: 500px;
}
/*키워드 버튼*/
.search_keyword button {
  margin-left: 5px;
  background-color: #3051d3;
}

/*기간 입력창*/
.search_date input {
  width: 232px;
}
</style>

<!--list-->
<style>
.ant-table-row-cell-break-word {
  text-align: center;
}
.ant-radio-button-wrapper:not(:first-child)::before {
  content: none;
}
.list {
  margin-top: 20px;
  background-color: white;
}
.list .top {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: white;
}

.list .top .left button{
  margin-right: 10px;
}
.list .top .right button{
  margin-left: 10px;
}
.list .top button {
  background-color: #f06543;
  border-radius: 5px;
  border: none;
}

.list .content {
  padding: 0 20px 20px 20px;
}
</style>

