<template>
  <loading v-model:active="indicator"
           :can-cancel="false"
           :is-full-page="true"/>
  <div class="search_body">
    <div class="source_picker">
      <span :style="{ marginRight: '8px' }"> 마켓 :</span>
      <a-radio-group v-model:value="market_code">
        <a-radio-button value="all">전체</a-radio-button>
        <a-radio-button value="Tmall">Tmall</a-radio-button>
        <a-radio-button value="Taobao">Taobao</a-radio-button>
        <a-radio-button value="Alibaba">Alibaba</a-radio-button>
      </a-radio-group>

      <span :style="{ marginLeft: '20px' }"> 번역상태 :</span>
      <a-select v-model:value="trans_status" style="width: 120px; margin-left: 10px">
        <a-select-option value="all">전체</a-select-option>
        <a-select-option value="0">미번역</a-select-option>
        <a-select-option value="1">번역</a-select-option>
      </a-select>

      <span :style="{ marginLeft: '20px' }"> 연동상태 :</span>
      <a-select v-model:value="sync_status" style="width: 120px; margin-left: 10px">
        <a-select-option value="all">전체</a-select-option>
        <a-select-option value="1">성공</a-select-option>
        <a-select-option value="0">실패</a-select-option>
        <a-select-option value="2">미연동</a-select-option>
      </a-select>
    </div>
    <div class="range_picker">
      <span :style="{ marginRight: '8px' }">기간 : </span>
      <a-select v-model:value="date_type" style="width: 120px">
        <a-select-option value="insert_date">등록</a-select-option>
        <a-select-option value="update_date">수정</a-select-option>
      </a-select>
      <a-space direction="vertical">
        <a-range-picker
            :value="date"
            format="YYYY-MM-DD"
            :placeholder="['Start Time', 'End Time']"
            @change="onChangeDatePicker"
        />
      </a-space>
    </div>

    <div class="key_picker">
      <span :style="{ marginRight: '8px' }">키원드 : </span>
      <a-select @change="limitChange" v-model:value="search_key" style="width: 120px">
        <a-select-option value="item_code">상품코드</a-select-option>
        <a-select-option value="item_name">기존 상품명</a-select-option>
        <a-select-option value="item_trans_name">번역 상품명</a-select-option>
        <a-select-option value="sku_code">품목코드</a-select-option>
      </a-select>
      <a-input style="width: 500px; margin-left: 10px" v-model:value="search_value" placeholder="키워드" />
      <a-button @click="getList" style="width: 100px; margin-left: 10px" type="primary">검색</a-button>
      <a-select
          style="width: 150px; margin-left: 20px; text-align: center"
          v-model:value="limit"
          @change="limitChange"
      >
        <a-select-option value="10">10개씩보기</a-select-option>
        <a-select-option value="20">20개씩보기</a-select-option>
        <a-select-option value="50">50개씩보기</a-select-option>
        <a-select-option value="100">100개씩보기</a-select-option>
      </a-select>
    </div>
  </div>

  <div class="search_body">
    <table style="width: 100%">
      <tr>
        <td style="width: 2%"><a-checkbox v-model:checked="checked" @change="checkItem"></a-checkbox></td>
        <td style="width: 75%; display: flex; align-items: center;">
          <div style="width: 300px">
            전체 상품 건수 <span style="color: #d4380d">{{totalCount}}</span> / 검색 상품 건수 <span style="color: #d4380d">{{searchCount}}</span>
          </div>
          <a-select
              v-model:value="marketList"
              mode="tags"
              style="width: 400px;margin-left: 100px"
              placeholder="연동가능 제휴사"
              :options="options"
              @change="marketListChange"
          >
          </a-select>
          <a-button style="margin-left: 20px;" type="primary" @click="testsync('multi')">제휴사 상품연동</a-button>
          <!--          <a-button style="margin-left: 20px" type="primary" @click="testPop">팝업</a-button>-->

        </td>
        <td>
          <a-popconfirm
              title="삭제하시겠습니까?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deletePrd"
          >
            <a-button style="margin-left: 10px; float: right" type="primary">상품삭제</a-button>
          </a-popconfirm>
          <a-popconfirm
              v-if="this.roles.length > 0 && this.roles.indexOf('ROLE_RELAKET') > -1"
              title="릴라켓에 연동하시겠습니까?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="sendMarket"
          >
            <a-button style="margin-right: 10px; float: right" type="primary">릴라켓연동</a-button>
          </a-popconfirm>
        </td>
      </tr>
    </table>
  </div>

  <a-list
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="prdlist"
  >
    <template #renderItem="{ item, index }">
      <a-list-item key="item.pno">
        <template #extra>
          <img
              width="100"
              height="80"
              alt="logo"
              :src="item.item_thumb[0]"
          />
        </template>
        <a-list-item-meta :description="item.item_info[0]">
          <template #title>
            <ul style="list-style-type: none; padding: 0; margin: 0;">
              <li style="float: left; width: 30px">
                <a-checkbox v-if="item.checked !== undefined" v-model:checked="item.checked"></a-checkbox>
              </li>
              <li v-if="item.item_is_trans === true">
                <a :href="item.item_href">{{ item.item_name_type }} : {{ item.item_trans_name }}</a><br>
                <a style="color: #6d737b" :href="item.item_href">기존 상품명 : {{ item.item_name }}</a>
              </li>
              <li v-else ><a :href="item.item_href">기존 상품명 : {{ item.item_name }}</a></li>
            </ul>
          </template>
        </a-list-item-meta>
        <a-typography-title :level="5">
          마켓 : {{item.item_market}}
          <span> | </span>
          마켓 상품 바로가기 : <a :href="item.item_url" target="_blank">{{item.item_code}}</a>
          <span> | </span>
          등록일 : {{item.item_ins}}
          <span> | </span>
          수정일 : {{item.item_upd}}
        </a-typography-title>
        <div v-if="this.roles.length > 0 && this.roles.indexOf('ROLE_RELAKET') > -1">
          연동 상태:
          <span v-if="item.item_sync_date === null && item.item_sync_status === false">
              미연동
            </span>
          <span v-else-if="item.item_sync_date !== null && item.item_sync_status === false">
              <a-tooltip>
              <template #title>{{msg[item.item_code]}}</template>
              <span style="color: #d4380d">연동실패</span>
              </a-tooltip>
               | 연동일시 : {{item.item_sync_date}}
            </span>
          <span v-else-if="item.item_sync_date !== null && item.item_sync_status === true">
              연동성공 | 연동일시 : {{item.item_sync_date}}
            </span>
          <a-button type="dashed" style="margin-left: 20px" @click="singlePop(item)">제휴사연동정보</a-button>
        </div>
      </a-list-item>
    </template>

  </a-list>
  <a-modal width="600px" :maskClosable="false" v-model:visible="singleSyncPop" @ok="">
    <template #title>
      <h3 style="text-align: center; display: inline-block; width: 90%"><b>제휴사 상품연동</b></h3>
    </template>
    <a-checkbox style="margin-left: 20px" v-model:checked="checkAll" @click="checkAllMarket(checkAll)">전체선택</a-checkbox>
    <!--    <a-checkbox style="margin-left: 20px" v-model:checked="checkAll" @click="checkAllMarket(checkAll)">실패상품선택</a-checkbox>-->
    <!--    <a-checkbox style="margin-left: 20px" v-model:checked="checkAll" @click="checkAllMarket(checkAll)">미연동상품선택</a-checkbox>-->

    <a-list :data-source="this.singleDetail.item_sync_market" style="height: 600px;overflow-y:scroll;">
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
    <!--   marketSyncSuccess
marketSyncFailed
marketSyncTotal     <p v-for="( message ) in excelUploadResult">{{ message }}</p>-->
    <h3><b>총{{this.marketSyncTotal}}개 상품 / 성공 {{this.marketSyncSuccess}} / 실패 {{this.marketSyncFailed}}</b></h3>
    <a-list v-if="this.marketSyncResult.length > 0" :data-source="this.marketSyncResult">
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
</template>
<script>
import { defineComponent } from 'vue';
import {AuthRequest} from "../../util/request";
import {ref} from "vue";
import Spec from "../../components/Spec";
import moment from "moment";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Cookie from "js-cookie";
import router from "../../router";
export default defineComponent({
  components: {Spec, Loading, Cookie},
  data() {
    let trans_status = 'all';
    let limit = '10';
    let prdlist = [];
    let market_code = 'all';
    let date_type = 'insert_date';
    let search_key = 'item_code';
    let start_time = '';
    let end_time = '';
    let search_value = '';
    let pageNum = ref(1);
    let date = [];
    let isChangeLimit = false;
    let nameField = '기존 상품명';
    const pagination = {
      onChange: page => {
        this.pageNum = page;
        this.getList();
      },
      pageSize: 10,
    };
    const roles = [];

    let marketList = [];
    let marketSyncPop = false;
    let marketSyncResult = [];
    let marketSyncSuccess = 0;
    let marketSyncFailed = 0;
    let marketSyncTotal = 0;
    let marketSyncFailedCode = '';

    let singleSyncPop = false;
    let singleDetail = [];

    let checkedList = [];
    let checkAll = false;
    let options = [];

    return {
      checked: false,
      indicator: false,
      trans_status,
      isChangeLimit,
      nameField,
      date,
      pageNum,
      limit,
      prdlist,
      pagination,
      market_code,
      date_type,
      search_key,
      start_time,
      end_time,
      search_value,
      searchCount: 0,
      totalCount: 0,
      roles,
      msg: [],
      sync_status: 'all',
      options,
      marketList,
      marketSyncPop,
      marketSyncResult,
      marketSyncSuccess,
      marketSyncFailed,
      marketSyncTotal,
      marketSyncFailedCode,
//<p v-for="( prd ) in item.products">{{ prd.prd_code }} - {{prd.status}} - {{prd.result}}
      singleSyncPop,
      singleDetail,
      checkedList,
      checkAll,
    }
  },

  methods: {
    limitChange() {
      this.isChangeLimit = true;
    },

    getList() {
      let param = this.getParam();
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/prdlist', {params: param}).then((res) => {
        this.prdlist = res.data.list;

        for (let i = 0; i < this.prdlist.length; i++) {
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

    setPrivilege() {
      this.roles = Cookie.get('member_roles');
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

    marketListChange() {
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
    this.setPrivilege();
    this.getMarketList();
  }
});
</script>

<style>
.ant-list-pagination {
  text-align: center;
}

.ant-list-items {
  background: #ffffff;
}

.search_body {
  padding: 10px 10px;
  background: #fff;
  margin: 10px 10px 10px 10px;
}

.key_picker {
  margin-top: 10px;
}

.range_picker {
  margin-top: 10px;
}

.sending {
  border: 1px solid #031a03;
  border-radius:5px;
}

.success {
  border: 1px solid #a7d0f6;
  border-radius:5px;
}

.unsync {
  border: 1px solid #f0f0f0;
  border-radius:5px;
}

.failed {
  border: 1px solid red;
  border-radius:5px;
}

.prdSyncResult {
  width: 100%; min-height: 50px; line-height: 50px; padding: 0px 20px
}
</style>
