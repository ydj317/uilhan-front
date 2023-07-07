<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>

  <!--검색-->
  <a-card :bordered="false" title="상품관리" :style="{marginBottom:'20px'}">
    <div id="header">
      <!--선택버튼 (상품수집마켓, 번역, 릴라켓연동)-->
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
            <a-range-picker
                v-model:value="date"
                :placeholder="['Start Time', 'End Time']"
                format="YYYY-MM-DD"
                @change="onChangeDatePicker" style="width: 300px;"/>
          </a-input-group>
        </div>

        <!--검색입력창-->
        <div class="inline-block mt10">
          <h1>키워드</h1>
          <a-input-group compact>
            <a-select v-model:value="search_key" style="width: 150px;">
              <a-select-option v-for="config in SEARCH_KEYWORD_CONFIG" :value="config.key">
                {{ config.label }}
              </a-select-option>
            </a-select>
            <a-input v-model:value="search_value" placeholder="키워드" style="width: 300px;"/>
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
        <!--릴라켓연동-->
        <!--          <a-popconfirm title="릴라켓에 연동하시겠습니까?" @confirm="sendMarket">-->
        <!--            <a-button type="primary">릴라켓연동</a-button>-->
        <!--          </a-popconfirm>-->
        <!--제휴사 상품연동-->
        <a-button @click="MarketListPop(record)" type="primary">제휴사 상품연동</a-button>
      </div>
    </div>

    <!--content-->
    <div id="content-content" class="pt20">
      <!--전체선택-->
      <a-table class="test-custem" :columns="LIST_COLUMNS_CONFIG" :data-source="prdlist" :pagination="pagination"
               :row-selection="{ selectedRowKeys: prdSelectedRowKeys, onChange: onPrdSelectChange }">

        <!--table body-->
        <template v-slot:bodyCell="{text, record, index, column}">
          <!--체크박스-->
          <template v-if="column.key === 'checked'">
            <a-checkbox v-model:checked="record.checked"></a-checkbox>
          </template>

          <!--사진-->
          <template v-if="column.key === 'item_thumb'">
            <a-image :src="record.item_thumb[0]" :fallback="tempImage" style="width: 50px; height: 50px;"/>
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
                  <template v-for="(market_list, market_code) in record.show_sync_market" :key="market_code">
                    <template v-for="(market_info, key) in market_list" :key="key">
                      <a-tooltip placement="bottom">
                        <template #title>
                          <span>{{ market_info.market_account.split("::")[1] }}</span>
                        </template>
                        <span class="item-market-icon" :class="market_info.status" @click="openMarketPopup(market_info,record.item_code)">
                        <img :src="getLogoSrc('market-logo', market_info.market_account.split('::')[0])" alt="">
                        </span>
                      </a-tooltip>
                    </template>
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

          <!--연동상태-->
          <template v-if="column.key === 'item_status'">
          <span v-if="record.item_sync_date">
            <!--연동성공-->
            <a-tooltip v-if="record.item_sync_status">
                <template #title>{{ record.item_sync_result }}</template>
                <a-tag color="success">연동성공</a-tag>
            </a-tooltip>
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
              <a-button @click="singlePop(record)" type="primary" shape="round">연동관리</a-button>
            </div>
          </template>

        </template>
      </a-table>
    </div>
  </a-card>

  <!--제휴사연동-->
  <div id="footer">
    <!--제휴사 상품연동-->
    <a-modal width="1000px" title="제휴사 상품연동" v-model:visible="singleSyncPop" centered>
      <a-table
          class="tableSyncStatus"
          :dataSource="singleDetail.item_sync_market"
          :columns="SYNC_COLUMNS_CONFIG"
          :row-selection="{ selectedRowKeys: syncSelectedRowKeys, onChange: onSyncSelectChange }"
      >

        <!--table body-->
        <template v-slot:bodyCell="{ text, record, index, column }">
          <!--연동계정-->
          <template v-if="column.key === 'market_account'">
            <div style="text-align: left">
              <img :src="getLogoSrc('market-logo', record.market_account.split('::')[0])"
                   style="width: 16px; height: 16px; margin-right: 5px;">
              {{ record.market_account.split('::')[1] }}
            </div>
          </template>

          <!--상태-->
          <template v-if="column.key === 'status'">
            <div style="text-align: left">
              <a-tag color="success" v-if="record.status === 'success'">연동성공</a-tag>
              <a-tag color="processing" v-else-if="record.status === 'sending'">전송중</a-tag>
              <a-tag color="error" v-else-if="record.status === 'failed'">연동실패</a-tag>
              <a-tag color="default" v-else>연대기동</a-tag>
              <span v-if="record.status === 'failed'">실패원인: {{ record.result }}</span>
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
        <a-button type="primary" @click="testsync('single')">선택제휴사연동</a-button>
        <a-button @click="closeResultPop('single')">닫기</a-button>
      </template>
    </a-modal>

    <!--제휴사 연동결과-->
    <a-modal width="600px" v-model:visible="marketSyncPop" centered title="제휴사연동결과" @ok="">
      <h3><b>총{{ marketSyncTotal }}개 상품 / 성공 {{ marketSyncSuccess }} / 실패 {{ marketSyncFailed }}</b></h3>
      <a-list v-if="marketSyncResult.length > 0" :data-source="marketSyncResult">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card :title="item.market_account" style="width: 100%">
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
import {defineComponent, ref} from "vue";
import {AuthRequest} from "@/util/request";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Cookie from "js-cookie";
import MarketList from "components/List/MarketList";
import {mapState} from "vuex";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  DollarTwoTone, SearchOutlined
} from "@ant-design/icons-vue";

export default defineComponent({
  components: {
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
              label: "미연동",
              value: "2"
            }
          ],
          label: "연동상태",
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
          title: "연동상태",
          key: "item_status",
          width: "8%",
          align: "center"
        },
        {
          title: "제휴사연동",
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
          title: "쇼핑몰",
          key: "market_account",
          width: "200px",
          align: "center"
        },
        {
          title: "연동상태",
          key: "status",
          align: "center"
        },
        {
          title: "연동시간",
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
      tempImage: require('../../assets/img/temp_image.png'),
      listLoading: true,
      MarketListVisible: false,
      prdSelectedRowKeys: [],
      syncSelectedRowKeys: []
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
        return this.tempImage;
      }
    },

    MarketListPop() {
      this.relaket.data = this;
      this.MarketListVisible = true;
    },

    equal(key1, key2) {
      return key1 === key2;
    },

    buttonStyle(item_sync_status) {
      return item_sync_status ?
          "background-color: #3ddc97; border: none" :
          "background-color: #f06543; border: none";
    },

    getList(sType = "") {
      this.listLoading = true
      let param = this.getParam(sType);
      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prdlist", {params: param}).then((res) => {
        if (res.status !== "2000") {
          alert(res.message);
        }

        this.prdlist = res.data.list;

        for (let i = 0; i < this.prdlist.length; i++) {
          this.prdlist[i].key = i;
          this.prdlist[i].checked = false;
          this.prdlist[i].item_name_type = "기존 상품명";
          if (this.prdlist[i].item_is_trans === true) {
            this.prdlist[i].item_name_type = "번역 상품명";
          }

          // 연동 마켓 아이콘
          let show_sync_market = {};
          this.prdlist[i].item_sync_market.forEach(value => {
            let key = value.market_account.split("::")[0];

            if (!show_sync_market[key]) {
              show_sync_market[key] = []; // 初始化为空数组
            }
            show_sync_market[key].push(value);
          });
          this.prdlist[i]["show_sync_market"] = show_sync_market;

          // SKU 최저가~최대가
          let selectedPrice = 0;
          let show_price = 0;
          if (!this.prdlist[i].item_sku || this.prdlist[i].item_sku.length === 0) {
            this.prdlist[i]["show_price"] = "0원";
            continue;
          }

          selectedPrice = this.prdlist[i].item_sku.filter(item => item.is_option_reference_price === 'T')
              .map(item => item.selling_price);

          show_price = selectedPrice[0]
          if (show_price === undefined) {
            show_price = Math.min(...this.prdlist[i].item_sku.map(item => item.selling_price));
          }

          // 연동대기 상품은 판매가를 계산 해서 가져옴
          if (show_price === 0) {
            const userData = this.prdlist[i].user;

            selectedPrice = this.prdlist[i].item_sku.filter(item => item.is_option_reference_price === 'T')
                .map(item =>
                    Number(item.shipping_fee_cn) + Number(item.original_price_cn)
                );

            show_price = selectedPrice[0]
            if (show_price === undefined) {
              show_price = Math.min(...this.prdlist[i].item_sku.map(item =>
                  Number(item.shipping_fee_cn) + Number(item.original_price_cn)
              ))
            }

            show_price = Math.ceil(Number(show_price * (1 + Number(userData.selling_margin_option) / 100) *
                Number(userData.rate_margin_option)).toFixed(0) / 100) * 100;
          }
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

    setLabel(items, type, isRate = false) {
      let labelAddInfo = "";
      for (let i = 0; i < items.length; i++) {
        let symble = "";
        if (type === "margin" && isRate === false) {
          symble = "%";
        }

        if (
            items[i].label.indexOf("(") === -1 &&
            items[i].label.indexOf("%") === -1
        ) {
          labelAddInfo = " ( " + items[i].value + symble + " )";
        }

        items[i].label += labelAddInfo;
      }

      return items;
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
          let comma = i === 0 ? "" : ",";
          list += comma + this.prdlist[i].item_id;
        }
      }

      return list;
    },

    sendMarket() {
      this.indicator = true;
      let list = this.getCheckList();
      if (list === undefined || list.length === 0) {
        alert("선택된 상품이 없습니다.");
        this.indicator = false;
        return false;
      }

      let items = list.split(",");
      let notCatePrd = "";
      let hasCatePrd = "";

      for (let i = 0; i < items.length; i++) {
        let id = items[i];
        if (id === undefined || id === "" || id === null) {
          continue;
        }

        let item = this.prdlist.filter((item) => parseInt(item.item_id) === parseInt(id))[0];

        if (item.item_cate === null) {
          notCatePrd += notCatePrd.length === 0 ? "" : ",";
          notCatePrd += item.item_id;
          continue;
        }

        hasCatePrd += hasCatePrd.length === 0 ? "" : ",";
        hasCatePrd += item.item_id;
      }

      if (notCatePrd.length === items.length) {
        alert("선택하신 모든 상품의 마켓연동에 필요한 카테고리 값이 없습니다.");
        this.indicator = false;
        return false;
      }

      if (notCatePrd.length > 0) {
        alert(notCatePrd + " 등 상품의 카테고리 정보가 없습니다.");
      }

      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/sendmarket", {list: list}).then((res) => {
        if (res.status !== "2000") {
          alert(res.message);
          this.indicator = false;
          return false;
        }

        if (res.data !== undefined && res.data.length === 0) {
          alert("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
          this.indicator = false;
          return false;
        }

        let data = res.data;
        let sMessage = "";
        if (data.success_code.length) {
          sMessage = "연동성공 상품 : " + data.success_code;
        }
        if (data.failed_code.length) {
          sMessage += "\n연동실패 상품 : " + data.failed_code;
        }
        alert(sMessage);
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
        alert("선택된 상품이 없습니다.");
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/delete", {params: {list: list}}).then((res) => {
        // if (res.status !== 200) {
        //   alert('삭제실패');
        //   return false;
        // }

        if (res.status !== "2000") {
          alert(res.message);
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
        param = this.getParam();
      } else {
        param = {list: list};
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/exceldown", {params: param}).then((res) => {
        this.indicator = false;
        if (res.status !== "2000") {
          alert(res.message);
          return false;
        }
        // if (res.status !== 200) {
        //   alert('파일 다운로드에 실패하였습니다. \n일시적인 현상이오니 잠시후 재 시도하시길 바랍니다.');
        //   return false;
        // }
        window.open(res.data.path);
      });
    },

    searchFailed() {
      if (this.marketSyncFailedCode.length === 0) {
        alert("연동실패한 상품이 없습니다.");
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
      } else {
        this.singleSyncPop = false;
        this.singleDetail = [];
        this.checkedList = [];
      }
    },

    testmarket() {
      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/category/sync", {
        params: {
          market_code: 'relaket',
          cid: '019002001001000'
        }
      }).then((res) => {

      });
    },

    getMarketList() {
      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/marketlist").then((res) => {
        if (res.status !== "2000") {
          alert(res.message);
          return false;
        }

        let returnData = res.data;
        for (let i = 0; i < returnData.data.length; i++) {
          returnData.data[i].key = i;
        }

        this.options = returnData.data;
      });
    },

    testPop() {
      this.marketSyncPop = !this.marketSyncPop;
    },

    async testsync(type) {
      this.indicator = true;
      let list = "";
      let marketList = [];
      if (type === "multi") {
        marketList = this.marketList;
        list = this.getCheckList();
      } else {
        marketList = this.getCheckedMarketList();
        list = this.singleDetail.item_id + "";
      }

      if (list === "," || list.length === 0) {
        alert("상품을 선택해주세요");
        this.indicator = false;
        return false;
      }

      if (this.marketList.length === undefined) {
        alert("선택된 제휴사가 없습니다.");
        this.indicator = false;
        return false;
      }

      try {

        let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/sendmarket", {list: list});
        if (res.status !== "2000") {
          alert(res.message);
          this.indicator = false;
          return false;
        }

        if (res.data !== undefined && res.data.length === 0) {
          alert("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
          this.indicator = false;
          return false;
        }

      } catch (e) {
        alert(e.message);
        this.indicator = false;
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/syncmarket",
          {params: {list: list, market: marketList, options: this.options}}).then((res) => {
        if (res.status !== "2000") {
          alert(res.message);
        }

        let returnData = res.data;
        if (type === "multi") {
          this.setResultPopData(true, [
            returnData.success,
            returnData.failedCode,
            returnData.failed,
            returnData.total,
            returnData.data
          ]);
        } else {
          this.singleSyncPop = false;
          this.singleDetail = [];
          this.checkedList = [];

          this.setResultPopData(true, [
            returnData.success,
            returnData.failedCode,
            returnData.failed,
            returnData.total,
            returnData.data
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
        this.marketSyncFailedcode = "";
        this.marketSyncFailed = 0;
        this.marketSyncTotal = 0;
        this.marketSyncResult = [];
        this.marketSyncPop = false;
      }
    },

    singlePop(item) {
      this.singleSyncPop = !this.singleSyncPop;
      this.singleDetail = item;
      this.syncSelectedRowKeys = []
      for (let i = 0; i < this.singleDetail.item_sync_market.length; i++) {
        this.singleDetail.item_sync_market[i].key = i;
        let isChecked = false;
        if (this.singleDetail.item_sync_market[i].status !== "unsync") {
          isChecked = true;
          this.syncSelectedRowKeys.push(i)
        }

        this.singleDetail.item_sync_market[i].checked = isChecked;
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

    openMarketPopup(marketInfo,pid) {
      if(marketInfo.status !== "success"){
        if(marketInfo.status === "unsync"){
          return;
        }
        alert('연동준비중이거나 연동실패된 상품입니다.연동 완료후 시도해 주세요.');
        return;
      }

      const ssiIx = this.getMarketSsiIx(marketInfo.market_account)

      if(!ssiIx) return;

      const request = {
        ssi_ix: ssiIx,
        site_id: marketInfo.market_account.split('::')[1],
        pid: pid
      }

      const queryString = encodeURIComponent(new URLSearchParams(request).toString());
      window.open('/product/marketPopup/'+ queryString, '_blank');
    },
    getMarketSsiIx(siteId){
      let ssiIx = '';
      this.options.forEach((item) => {
        if(item.value === siteId) {
          ssiIx = item.ssi_ix
        }
      })
      return ssiIx
    }
  },

  beforeMount() {
    this.getList("reload");
    this.getMarketList();
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

.failed img, .success img, .sending img {
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

