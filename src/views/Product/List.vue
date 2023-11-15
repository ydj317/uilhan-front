<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true" />

  <!--검색-->
  <a-card :bordered="false" title="상품관리" :style="{ marginBottom: '20px' }">
    <div id="header">
      <!--선택버튼 (상품수집마켓, 번역)-->
      <div v-for="CONFIG in SEARCH_BUTTON_CONFIG" :class="CONFIG.class">
        <h1>{{ CONFIG.label }}</h1>
        <a-radio-group v-model:value="this[CONFIG.key]" :class="CONFIG.group_class" button-style="solid">
          <a-radio-button v-for="options in CONFIG.options" :class="CONFIG.key" :value="options.value">
            {{ options.label }}
          </a-radio-button>
        </a-radio-group>
      </div>

      <!--검색기간-->
      <div>
        <div class="inline-block mr17 mt10">
          <h1>검색기간</h1>
          <a-input-group compact>
            <a-select v-model:value="date_type" style="width: 150px;">
              <a-select-option v-for="data in SEARCH_DATE_CONFIG" :value="data.key">{{ data.label }}</a-select-option>
            </a-select>
            <a-range-picker v-model:value="date" format="YYYY-MM-DD" @change="onChangeDatePicker" style="width: 300px;" />
          </a-input-group>
        </div>

        <!--검색입력창-->
        <div class="inline-block mt10">
          <h1>검색어</h1>
          <a-input-group compact>
            <a-select v-model:value="search_key" style="width: 150px;">
              <a-select-option v-for="config in SEARCH_KEYWORD_CONFIG" :value="config.key">
                {{ config.label }}
              </a-select-option>
            </a-select>
            <a-input v-model:value="search_value" placeholder="검색어" style="width: 300px;" />
          </a-input-group>
        </div>

        <div class="mt25" style="text-align: center;">
          <a-button @click="getList" style="width: 100px;" type="primary">
            <SearchOutlined />
            검색
          </a-button>
          <a-button class="ml10" @click="initSearchParam()" style="width: 100px;" type="">초기화</a-button>
        </div>

      </div>
    </div>
  </a-card>

  <!--상품 리스트-->
  <a-card :bordered="false" :loading="listLoading">
    <!--top-->
    <div id="content-header" class="row space-between">
      <!--left button-->
      <div class="w12 space-between">
        <!--상품삭제-->
        <a-popconfirm title="삭제하시겠습니까?" @confirm="deletePrd">
          <a-button>상품삭제</a-button>
        </a-popconfirm>
      </div>

      <!--right button-->
      <div class=" pl5 ">
        <!--선택상품 등록-->
        <a-button @click="MarketListPop(record)" type="primary">선택상품 등록</a-button>
      </div>
    </div>

    <!--content-->
    <div id="content-content" class="pt20">
      <!--전체선택-->
      <a-table class="test-custem" :columns="LIST_COLUMNS_CONFIG" :data-source="prdlist" :pagination="pagination"
        :row-selection="{ selectedRowKeys: prdSelectedRowKeys, onChange: onPrdSelectChange }">

        <!--table body-->
        <template v-slot:bodyCell="{ text, record, index, column }">
          <!--체크박스-->
          <template v-if="column.key === 'checked'">
            <a-checkbox v-model:checked="record.checked"></a-checkbox>
          </template>

          <!--사진-->
          <template v-if="column.key === 'item_thumb'">
            <a-image :src="record.item_thumb[0]" style="width: 50px; height: 50px;" />
          </template>

          <!--상품코드-->
          <template v-if="column.key === 'item_code'">
            <a-button type="dashed" :href="record.item_url" :target="'_blank'">
              <span class="get-market-icon">
                <img :src="getLogoSrc('get-logo', record.item_market.toLowerCase())" alt="">
              </span>
              {{ record.item_code }}
            </a-button>
          </template>

          <!--상품명-->
          <template v-if="column.key === 'item_name'">
            <div class="item-name">
              <a :href="`/product/detail/${record.item_id}`">
                {{ substrName(record.item_is_trans ? record.item_trans_name : record.item_name) }}
              </a>
              <div class="cantent">
                <a-space :size="5" class="item-market">
                  <template v-for="(market_info, key) in record.item_sync_market" :key="key">
                    <a-tooltip placement="bottom">
                      <template #title>
                        <span>{{ market_info.seller_id }}</span>
                      </template>
                      <span class="item-market-icon" :class="market_info.status"
                        @click="openMarketPopup(market_info, market_info.market_prd_code)">
                        <img :src="getLogoSrc('market-logo', market_info.market_code)" alt="">
                      </span>
                    </a-tooltip>
                  </template>
                </a-space>
              </div>
            </div>
          </template>

          <!--판매가-->
          <template v-if="column.key === 'item_price'">
            {{ record.show_price }}
          </template>

          <!--상품등록(수정)일-->
          <template v-if="column.key === 'item_ins'">
            <div>{{ record.item_ins.slice(0, 16) }}</div>
            <div v-if="record.item_upd !== null" class="item-upd">
              ( {{ record.item_upd.slice(0, 16) }} )
            </div>
          </template>

          <!--등록상태-->
          <template v-if="column.key === 'item_status'">

            <span v-if="record.item_sync_date">
              <!--연동성공-->
              <a-tag color="success" v-if="record.item_sync_status">연동성공</a-tag>
              <!--연동실패-->
              <a-tooltip v-if="record.item_sync_status == false">
                <template #title>{{ record.item_sync_result }}</template>
                <a-tag color="error">연동실패</a-tag>
              </a-tooltip>
            </span>
            <span v-else>
              <!--연동대기-->
              <a-tag color="default">연동대기</a-tag>
            </span>
          </template>

          <!--제휴사연동-->
          <template v-if="column.key === 'item_sync_status'">
            <div class="center">
              <a-button @click="singlePop(record)" type="primary" shape="round">등록관리</a-button>
            </div>
          </template>

        </template>
      </a-table>
    </div>
  </a-card>

  <!--선택상품 등록-->
  <div id="footer">
    <!--선택상품 등록-->
    <a-modal width="1000px" v-model:visible="singleSyncPop" centered>
      <template #title>
        선택상품 등록
        <a-tooltip>
          <template #title>
            <div>상품을 등록할 마켓을 선택하여 등록해 주세요.</div>
          </template>
          <QuestionCircleOutlined/>
        </a-tooltip>
      </template>
      <a-table class="tableSyncStatus" :dataSource="singleDetail.item_sync_market" :columns="SYNC_COLUMNS_CONFIG"
        :row-selection="{ selectedRowKeys: syncSelectedRowKeys, onChange: onSyncSelectChange }">

        <!--table body-->
        <template v-slot:bodyCell="{ text, record, index, column }">
          <!--연동계정-->
          <template v-if="column.key === 'market_account'">
            <div style="text-align: left">
              <img :src="getLogoSrc('market-logo', record.market_code)"
                style="width: 16px; height: 16px; margin-right: 5px;">
              {{ record.seller_id }}
            </div>
          </template>

          <!--상태-->
          <template v-if="column.key === 'status'">
            <div style="text-align: left">
              <a-tag color="processing" v-if="record.status === 'sending'">전송중</a-tag>
              <a-tag color="processing" v-else-if="record.status === 'approval'">승인대기</a-tag>
              <a-tag color="success" v-else-if="record.status === 'success'">연동성공</a-tag>
              <a-tag color="error" v-else-if="record.status === 'failed'">연동실패</a-tag>
              <a-tag color="default" v-else>연동대기</a-tag>
              <span v-if="record.status === 'failed'">실패원인: {{ record.result }}</span>
              <a-tag color="#108ee9" v-if="record.status === 'approval'" style="cursor: pointer"
                @click="approvalCheck(record.market_id)">
                승인상태확인
              </a-tag>
            </div>
          </template>

          <!--연동시간-->
          <template v-if="column.key === 'ins_time'">
            <div v-if="record.status !== 'unsync'">
              <div v-if="!record.upd_time">{{ record.ins_time }}</div>
              <div v-else>{{ record.upd_time }}</div>
            </div>
          </template>
        </template>

      </a-table>

      <template v-slot:footer>
        <a-button type="primary" @click="sendMarket()">선택마켓연동</a-button>
        <a-button @click="closeResultPop('single')">닫기</a-button>
      </template>
    </a-modal>

    <!--제휴사 연동결과-->
    <a-modal width="600px" v-model:visible="marketSyncPop" centered title="제휴사연동결과" @cancel="closeResultPop('multi')">
      <h3><b>총{{ marketSyncTotal }}개 상품 / 성공 {{ marketSyncSuccess }} / 실패 {{ marketSyncFailed }}</b></h3>
      <a-list v-if="marketSyncResult.length > 0" :data-source="marketSyncResult">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.market_code + '::' + item.seller_id" style="width: 100%">
              <p v-for="( prd ) in item.products">{{ prd.prd_code }} - {{ prd.result }}</p>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
      <template v-slot:footer>
        <a-button type="primary" @click="searchFailed">실패상품검색</a-button>
        <a-button type="primary" @click="closeResultPop('multi')">확인</a-button>
      </template>
    </a-modal>

    <MarketList v-if="MarketListVisible"></MarketList>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { AuthRequest } from "@/util/request";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Cookie from "js-cookie";
import MarketList from "@/components/List/MarketList";
import { useMarketApi } from "@/api/market";

import { mapState } from "vuex";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  DollarTwoTone, SearchOutlined, QuestionCircleOutlined
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { lib } from "@/util/lib";
import router from "@/router";

export default defineComponent({
  components: {
    QuestionCircleOutlined,
    SearchOutlined,
    DollarTwoTone,
    Loading,
    Cookie,
    MarketList,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    LinkOutlined
  },

  computed: {
    ...mapState([
      "relaket",
    ])
  },

  data() {
    return {
      SEARCH_BUTTON_CONFIG: [
        {
          options: [
            {
              label: "전체",
              value: "all"
            },
            {
              label: "Tmall",
              value: "Tmall"
            },
            {
              label: "Taobao",
              value: "Taobao"
            },
            {
              label: "Alibaba",
              value: "Alibaba"
            },
            {
              label: "Aliexpress",
              value: "Aliexpress"
            },
            {
              label: "Vvic",
              value: "Vvic"
            }
          ],
          label: "상품수집마켓",
          key: "market_code",
          class: "mr17 inline-block",
          group_class: "mb10"
        },
        {
          options: [
            {
              label: "전체",
              value: "all"
            },
            {
              label: "성공",
              value: "1"
            },
            {
              label: "실패",
              value: "0"
            },
            {
              label: "미등록",
              value: "2"
            }
          ],
          label: "등록상태",
          key: "sync_status",
          class: "inline-block",
          group_class: "start"
        }
      ],
      SEARCH_DATE_CONFIG: [
        {
          key: "insert_date",
          label: "등록"
        },
        {
          key: "update_date",
          label: "수정"
        }
      ],
      SEARCH_KEYWORD_CONFIG: [
        {
          key: "item_code",
          label: "상품코드"
        },
        {
          key: "item_name",
          label: "상품명"
        },
        {
          key: "sku_code",
          label: "품목코드"
        }
      ],
      LIST_COLUMNS_CONFIG: [
        {
          title: "사진",
          key: "item_thumb",
          width: "5%",
          align: "center"
        },
        {
          title: "상품코드",
          key: "item_code",
          width: "10%",
          align: "center"
        },
        {
          title: "상품명",
          key: "item_name",
          align: "center",
        },
        {
          title: "판매가",
          key: "item_price",
          width: "12%",
          align: "center"
        },
        {
          title: "상품등록(수정)일",
          key: "item_ins",
          width: "10%",
          align: "center"
        },
        {
          title: "등록상태",
          key: "item_status",
          width: "8%",
          align: "center"
        },
        {
          title: "마켓등록",
          key: "item_sync_status",
          width: "8%",
          align: "center"
        }
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: () => `전체 상품 건수 ${this.totalCount} / 검색 상품 건수 ${this.searchCount}`,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        onChange: page => {
          sessionStorage.relaket_page = page;
          this.pageNum = page;
          this.pagination.current = page;
          this.getList();
        },
        onShowSizeChange: (current, pageSize) => {
          sessionStorage.relaket_limit = pageSize;
          this.limit = pageSize;
          this.getList();
        }
      },
      SYNC_COLUMNS_CONFIG: [
        {
          title: "마켓",
          key: "market_account",
          align: "center"
        },
        {
          title: "등록상태",
          key: "status",
          align: "center",
          width: "100px",
        },
        {
          title: "등록시간",
          key: "ins_time",
          width: "170px",
          align: "center"
        }
      ],

      checked: false,
      indicator: false,
      trans_status: "all",
      // isChangeLimit: false,
      date: [],
      pageNum: 1,
      limit: 10,
      prdlist: [],
      market_code: "all",
      date_type: "insert_date",
      search_key: "item_code",
      start_time: "",
      end_time: "",
      search_value: "",
      searchCount: 0,
      totalCount: 0,
      sync_status: "all",
      options: [],
      marketList: [],
      marketSyncPop: false,
      marketSyncResult: [],
      marketSyncSuccess: 0,
      marketSyncFailed: 0,
      marketSyncTotal: 0,
      marketSyncFailedCode: "",
      singleSyncPop: false,
      singleDetail: [],
      checkedList: [],
      checkAll: false,
      listLoading: true,
      MarketListVisible: false,
      prdSelectedRowKeys: [],
      syncSelectedRowKeys: [],
      marketDetailUrls: [],
    };
  },

  methods: {
    initSearchParam() {
      this.market_code = "all"
      this.sync_status = "all"
      this.date_type = "insert_date"
      this.date = []
      this.search_key = "item_code"
      this.search_value = ""
    },

    onPrdSelectChange(prdSelectedRowKeys) {
      this.prdSelectedRowKeys = prdSelectedRowKeys;

      if (this.prdlist === undefined || this.prdlist.length < 1) {
        return false;
      }

      for (let i = 0; i < this.prdlist.length; i++) {
        this.prdlist[i].checked = this.prdSelectedRowKeys.includes(this.prdlist[i].key);
      }
    },

    onSyncSelectChange(syncSelectedRowKeys) {
      this.syncSelectedRowKeys = syncSelectedRowKeys;

      if (this.prdlist === undefined || this.prdlist.length < 1) {
        return false;
      }

      for (let i = 0; i < this.singleDetail.item_sync_market.length; i++) {
        this.singleDetail.item_sync_market[i].checked = this.syncSelectedRowKeys.includes(this.singleDetail.item_sync_market[i].key);
      }
    },

    getLogoSrc(fileName, marketCode) {
      try {
        return require(`../../assets/img/list/${fileName}/${marketCode}.png`);
      } catch (error) {
        return require('../../assets/img/temp_image.png');
      }
    },

    MarketListPop() {
      this.relaket.data = this;
      this.MarketListVisible = true;
    },

    equal(key1, key2) {
      return key1 === key2;
    },

    async getList(sType = "") {
      this.listLoading = true
      let param = this.getParam(sType);
      await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prdlist", { params: param }).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
        }

        this.prdlist = res.data.list;
        for (let i = 0; i < this.prdlist.length; i++) {
          this.prdlist[i].key = i;
          this.prdlist[i].checked = false;
          this.prdlist[i].item_name_type = "기존 상품명";
          if (this.prdlist[i].item_is_trans === true) {
            this.prdlist[i].item_name_type = "번역 상품명";
          }

          // SKU 최저가~최대가
          let selectedPrice = 0;
          let show_price = 0;
          if (!this.prdlist[i].item_sku || this.prdlist[i].item_sku.length === 0) {
            this.prdlist[i]["show_price"] = "0원";
            continue;
          }

          selectedPrice = this.prdlist[i].item_sku.filter(item => item.is_option_reference_price === 'T')
            .map(item => item.selling_price);

          if(selectedPrice.length === 0) {
            selectedPrice = this.prdlist[i].item_sku.map(item => item.selling_price);
          }

          show_price = selectedPrice[0];
          this.prdlist[i]["show_price"] = show_price.toLocaleString() + "원";
        }

        let iCurrent = parseInt(res.data.page);
        let iPageSize = parseInt(res.data.limit);

        this.searchCount = parseInt(res.data.searchCount);
        this.totalCount = parseInt(res.data.totalCount);
        this.pagination.total = parseInt(res.data.searchCount);
        this.pagination.current = iCurrent;
        this.pagination.pageSize = iPageSize;
        this.date = [moment(res.data.start_time), moment(res.data.end_time)];
        this.checked = false;
        this.listLoading = false;
      });
    },

    substrName(sName) {
      if (sName.length > 80) {
        return sName.substr(0, 80) + "...";
      }

      return sName;
    },

    getParam(sType = "") {
      let iLimit = parseInt(this.limit);
      let iPage = parseInt(this.pageNum) || 1;

      if (sType === "reload") {
        iPage = sessionStorage.relaket_page !== undefined ? parseInt(sessionStorage.relaket_page) : iPage;
        iLimit = sessionStorage.relaket_limit !== undefined ? parseInt(sessionStorage.relaket_limit) : iLimit;
      }

      return {
        "market_code": this.market_code === "" || this.market_code === null ? "all" : this.market_code,
        "date_type": this.date_type,
        "start_time": this.start_time,
        "end_time": this.end_time,
        "search_key": this.search_key,
        "search_value": this.search_value,
        "trans_status": this.trans_status,
        "sync_status": this.sync_status === "" || this.sync_status === null ? "all" : this.sync_status,
        "limit": iLimit,
        "page": iPage
      };
    },

    onChangeDatePicker(value, dateString) {
      this.start_time = dateString[0];
      this.end_time = dateString[1];
    },

    getCheckList() {
      let list = "";
      for (let i = 0; i < this.prdlist.length; i++) {
        if (this.prdlist[i].checked === true) {
          let comma = list === '' ? '' : ',';
          list += comma + this.prdlist[i].item_id;
        }
      }

      return list;
    },

    deletePrd() {
      let list = this.getCheckList();
      if (list === undefined || list.length === 0) {
        message.warning("선택된 상품이 없습니다.");
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/delete", { params: { list: list } }).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        window.location.reload()
      });
    },

    excelDown() {
      let list = this.getCheckList();

      let param = {};
      if (list.length === 0) {
        this.indicator = true;
        param = this.getParam();
      } else {
        param = { list: list };
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/exceldown", { params: param }).then((res) => {
        this.indicator = false;
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }
        window.open(res.data.path);
      });
    },

    searchFailed() {
      if (this.marketSyncFailedCode.length === 0) {
        message.warning("연동실패한 상품이 없습니다.");
        return false;
      }

      this.search_key = "item_code";
      this.search_value = this.marketSyncFailedCode;
      this.getList();

      this.setResultPopData(false, []);
    },

    closeResultPop(type) {
      if (type === "multi") {
        this.setResultPopData(false);
      }
      this.singleSyncPop = false;
      this.singleDetail = [];
      this.checkedList = [];
    },

    async getMarketList() {
      await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/marketlist").then((res) => {
        if (res.status !== "2000") {
          message.error("설정하신 마켓계정 정보가 없습니다. \n마켓계정을 설정해주세요. ");

          return false;
        }

        for (let i = 0; i < res.data.length; i++) {
          res.data[i].key = i;
        }

        this.options = res.data;
      });
    },

    async approvalCheck(market_id) {
      this.indicator = true;

      try {
        let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/approval_check", {
          market_id: market_id,
        });

        if (res.status !== "2000") {
          message.error(res.message);
          this.indicator = false;
          return false;
        }

        if (res.data !== undefined && res.data.length === 0) {
          message.error("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
          this.indicator = false;
          return false;
        }

        if (res.data.message !== undefined && res.data.message !== '') {
          message.warning(res.data.message);
          this.indicator = false;
          return false;
        }

        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        let now_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        for (let i = 0; i < this.singleDetail.item_sync_market.length; i++) {
          if (this.singleDetail.item_sync_market[i].market_id === market_id) {
            this.singleDetail.item_sync_market[i].upd_time = now_time;
            this.singleDetail.item_sync_market[i].status = res.data.status;
            this.singleDetail.item_sync_market[i].result = res.data.result;
            this.singleDetail.item_sync_date = now_time;
            this.singleDetail.item_sync_status = res.data.status === 'success' ? true : false;
            this.singleDetail.item_sync_result = res.data.result;
          }
        }

        this.indicator = false;

        return true;
      } catch (e) {
        message.error(e.message);
        this.indicator = false;
        return false;
      }
    },

    async sendMarket() {
      this.indicator = true;

      let accountList = this.singleDetail.item_sync_market.filter(item => item.checked === true);

      if (accountList.length === 0 || accountList.length === undefined) {
        message.warning("선택된 계정이 없습니다.");
        this.indicator = false;
        return false;
      }

      try {
        let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/send_market", {
          productList: this.singleDetail.item_id + "",
          accountList: accountList
        });

        if (res.status !== "2000") {
          message.error(res.message);
          this.indicator = false;
          return false;
        }

        if (res.data !== undefined && res.data.length === 0) {
          message.error("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
          this.indicator = false;
          return false;
        }

        this.singleSyncPop = false;
        this.singleDetail = [];
        this.checkedList = [];

        let returnData = res.data;
        this.setResultPopData(true, [
          returnData.success,
          returnData.failedCode,
          returnData.failed,
          returnData.total,
          returnData.data
        ]);

        this.indicator = false;

        return true;
      } catch (e) {
        message.error(e.message);
        this.indicator = false;
        return false;
      }
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
        this.marketSyncFailedCode = "";
        this.marketSyncFailed = 0;
        this.marketSyncTotal = 0;
        this.marketSyncResult = [];
        this.marketSyncPop = false;
      }
    },

    async singlePop(item) {
      this.singleSyncPop = !this.singleSyncPop;
      this.singleDetail = item;

      let sycnMarkets = []
      try {
        const res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/get_sync_market", {
          'prd_id': this.singleDetail.item_id
        });

        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        sycnMarkets = res.data;
      } catch (e) {
        message.error("등록상태 조회실패 하였습니다.");
        return false;
      }

      this.syncSelectedRowKeys = []
      for (let i = 0; i < this.singleDetail.item_sync_market.length; i++) {
        const foundItem = sycnMarkets.find(item => item.market_code === this.singleDetail.item_sync_market[i].market_code &&
          item.market_account === this.singleDetail.item_sync_market[i].seller_id);
        if (foundItem) {
          this.singleDetail.item_sync_market[i].marker_id = foundItem.id;
          this.singleDetail.item_sync_market[i].status = foundItem.status;
          this.singleDetail.item_sync_market[i].result = foundItem.result;
        }

        this.singleDetail.item_sync_market[i].key = i;
        let isChecked = false;
        if (this.singleDetail.item_sync_market[i].status !== "unsync") {
          isChecked = true;
          this.syncSelectedRowKeys.push(i)
        }
        this.singleDetail.item_sync_market[i].checked = isChecked;
      }
    },

    openMarketPopup(marketInfo, market_prd_code) {

      if (marketInfo.status !== "success") {
        if (marketInfo.status === "unsync") {
          return;
        }
        message.warning('연동준비중이거나 연동실패된 상품입니다.연동 완료후 시도해 주세요.');
        return;
      }


      if (!lib.isNumeric(marketInfo.market_code)) {
        message.warning("마켓코드가 잘못되었습니다.");
        return false;
      }
      if (!lib.isNumeric(market_prd_code)) {
        message.warning("상품코드가 잘못되었습니다.");
        return false;
      }
      let url = '';
      if(marketInfo.market_code === 'smartstore') {
        // check channel_info
        const channelInfo = marketInfo.market_data?.channel_info;

        if (!channelInfo?.url) {
          message.warning("채널정보가 없습니다. 마켓계정관리에서 연동확인 후 다시 시도해주세요.");
          return false;
        }
        url = `${channelInfo.url}/${market_prd_code}`;
      } else {
        url = this.marketDetailUrls[marketInfo.market_code] + market_prd_code;
      }
      window.open(url)
    },

    async getMarketDetailUrls() {
      await useMarketApi().getMarketDetailUrls({}).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }
        //console.log(res.data);
        this.marketDetailUrls = res.data;
      });
    }
  },


  beforeMount() {
    Promise.all([this.getMarketList(), this.getMarketDetailUrls(), this.getList("reload")]);
  },

});
</script>

<style>
#header .ant-picker-input input {
  text-align: center;
}
</style>

<!--search-->
<style scoped>
/* 모든 title */
#header h1 {
  font-size: 15px;
  font-weight: 600;
}

/* 모든 title */
#footer h3 {
  font-size: 15px !important;
  font-weight: 600;
}
</style>

<!--list-->
<style scoped>
#content-content-checkAll {
  position: absolute;
  z-index: 9;
  left: 305px;
  top: 505px;
}

#content-content .get-market-icon img {
  display: inline-block;
  margin-right: 5px;
  margin-top: -3px;
  width: 16px;
  height: 16px;
}

#content-content .item-name {
  text-align: left;
}

#content-content .item-name a {
  color: #555;
}

.item-market {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.item-market-icon img {
  width: 16px;
  height: 16px;
}

.unsync img {
  cursor: pointer;
  filter: grayscale(100%);
  opacity: 0.3;
}

.unsync:hover img {
  filter: grayscale(0%);
  opacity: 1;
}

.failed img,
.success img,
.sending img {
  cursor: pointer;
  filter: grayscale(0%);
  opacity: 1;
}

#content-content .item-upd {
  font-size: 12px;
  color: #999;
}
</style>

<!--footer-->
<style scoped>
/* 모든 title */
#footer h3 {
  font-size: 15px !important;
  font-weight: 600;
}
</style>

