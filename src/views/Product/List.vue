<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>

  <div id="container">
    <!--검색-->
    <div id="header" class="plr20 bg-white">
      <!--선택버튼 (상품수집마켓, 번역, 릴라켓연동)-->
      <div v-for="CONFIG in SEARCH_BUTTON_CONFIG" :class="CONFIG.class">
        <h1>{{ CONFIG.label }}</h1>
        <a-radio-group v-model:value="this[CONFIG.key]" :class="CONFIG.group_class">
          <a-radio-button v-for="options in CONFIG.options" :class="CONFIG.key" :value="options.value">
            {{ options.label }}
          </a-radio-button>
        </a-radio-group>
      </div>

      <!--검색기간-->
      <div class="mt10">
        <h1>기간</h1>
        <a-select v-model:value="date_type" class="w10 text-center">
          <a-select-option v-for="data in SEARCH_DATE_CONFIG" :value="data.key">{{ data.label }}</a-select-option>
        </a-select>
        <a-space direction="vertical" class="w25">
          <a-range-picker
              class="w100"
              v-model:value="date"
              :placeholder="['Start Time', 'End Time']"
              format="YYYY-MM-DD"
              @change="onChangeDatePicker"
          />
        </a-space>
      </div>

      <!--검색입력창-->
      <div class="mt10 pb20">
        <h1>키워드</h1>
        <a-select v-model:value="search_key" class="w10 mr1 text-center">
          <a-select-option v-for="config in SEARCH_KEYWORD_CONFIG" :value="config.key">{{ config.label }}
          </a-select-option>
        </a-select>
        <a-input v-model:value="search_value" placeholder="키워드" class="w25 mr1 text-center"/>
        <a-button @click="getList" type="primary" class="w5">검색</a-button>
      </div>
    </div>

    <!--상품 리스트-->
    <div id="content" class="mt20 plr20 bg-white">
      <!--top-->
      <div id="content-header" class="pt20 row space-between">
        <!--left button-->
        <div class="w12 space-between">
          <!--상품삭제-->
          <a-popconfirm title="삭제하시겠습니까?" @confirm="deletePrd">
            <a-button type="primary" danger>상품삭제</a-button>
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
        <a-table class="test-custem" :columns="LIST_COLUMNS_CONFIG" :data-source="prdlist" :pagination="pagination">
          <!--table header-->
          <template v-slot:headerCell="{title, column}">
            <template v-if="column.key === 'checked'">
              <a-checkbox v-model:checked="checked" @change="checkItem" id="content-content-checkAll"></a-checkbox>
            </template>
          </template>

          <!--table body-->
          <template v-slot:bodyCell="{text, record, index, column}">
            <!--체크박스-->
            <template v-if="column.key === 'checked'">
              <a-checkbox v-model:checked="record.checked"></a-checkbox>
            </template>

            <!--사진-->
            <template v-if="column.key === 'item_thumb'">
              <img :src="record.item_thumb[0]" alt="">
            </template>

            <!--상품정보-->
            <template v-if="column.key === 'item_name'">
              <!--상품명-->
              <div class="item-name">
                <span class="get-market-icon">
                    <img :src="getLogoSrc('get-logo', record.item_market.toLowerCase())" alt="">
                </span>
                <a :href="`/product/detail/${record.item_id}`">
                  {{ substrName(record.item_is_trans ? record.item_trans_name : record.item_name) }}
                </a>
              </div>
            </template>

            <!--판매가-->
            <template v-if="column.key === 'item_price'">
              {{ record.show_price }}
            </template>

            <!--상품코드-->
            <template v-if="column.key === 'item_code'">
              <a-button type="dashed" :href="record.item_url" :target="'_blank'">{{ record.item_code }}</a-button>
            </template>

            <!--상품등록(수정)일-->
            <template v-if="column.key === 'item_ins'">
              <div>{{ record.item_ins }}</div>
              <div v-if="record.item_upd !== null" class="item-upd">
                ( {{ record.item_upd }} )
              </div>
            </template>

            <!--제휴사연동-->
            <template v-if="column.key === 'item_sync'">
              <div class="center">
                <a-button @click="singlePop(record)" type="primary">연동</a-button>
              </div>
            </template>

            <!--연동마켓-->
            <template v-if="column.key === 'item_sync_status'">
              <div class="center">
                <a-space :size="5" class="item-market">
                <template v-for="(market_list, market_code) in record.show_sync_market" :key="market_code">
                  <template v-for="(market_info, key) in market_list" :key="key">
                      <a-tooltip placement="top">
                        <template #title>
                          <span>{{ market_info.market_account.split('::')[1] }}</span>
                        </template>
                        <span :class="market_info.status" class="sync">
                          <img :src="getLogoSrc('market-logo', market_info.market_account.split('::')[0])" alt="">
                        </span>
                      </a-tooltip>
                  </template>
                </template>
                </a-space>
              </div>
            </template>

            <!--연동메세지-->
            <template v-if="column.key === 'item_status'">
              <span v-if="record.item_sync_date">
                <!--연동성공-->
                <a-tooltip v-if="record.item_sync_status">
                    <template #title>{{ record.item_sync_result }}</template>
                    <a-tag color="success">연동중</a-tag>
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

          </template>
        </a-table>
      </div>
    </div>

    <!--제휴사연동-->
    <div id="footer">
      <!--제휴사 상품연동-->
      <a-modal :maskClosable="false" v-model:visible="singleSyncPop" class="col w50">
        <h3><strong>제휴사 상품연동</strong></h3>
        <a-table
            class="tableSyncStatus"
            :dataSource="singleDetail.item_sync_market"
            :columns="SYNC_COLUMNS_CONFIG"
        >

          <!--table header-->
          <template v-slot:headerCell="{ text, record, index, column }">
            <!--전체선택-->
            <template v-if="column.key === 'checked'">
              <a-checkbox v-model:checked="checkAll" @click="checkAllMarket(checkAll)"></a-checkbox>
            </template>
          </template>

          <!--table body-->
          <template v-slot:bodyCell="{ text, record, index, column }">
            <!--단일선택-->
            <template v-if="column.key === 'checked'">
              <a-checkbox v-model:checked="record.checked"></a-checkbox>
            </template>

            <!--연동계정-->
            <template v-if="column.key === 'market_account'">
              연동계정 : {{ record.market_account }}
            </template>

            <!--상태-->
            <template v-if="column.key === 'status'">
              <div class="syncStatus" :data-status="record.status">
                {{ {"sending": "전송중", "success": "성공", "failed": "실패", "unsync": "미연동"}[record.status] }}<span v-if="record.status === 'failed'"> 실패원인: {{record.result}}</span>
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
          <a-button type="primary" @click="closeResultPop('single')">확인</a-button>
          <a-button type="primary" @click="closeResultPop('single')" class="bg-697783">닫기</a-button>
        </template>
      </a-modal>

      <!--제휴사 연동결과-->
      <a-modal width="600px" :maskClosable="false" v-model:visible="marketSyncPop" title="제휴사연동결과" @ok="">
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
  </div>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {AuthRequest} from '@/util/request';
import moment from 'moment';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Cookie from 'js-cookie';
import MarketList from 'components/List/MarketList';
import {mapState} from 'vuex';
import { ClockCircleOutlined, CloseCircleOutlined, CheckCircleOutlined, LinkOutlined, DollarTwoTone } from "@ant-design/icons-vue";
import { provide } from 'vue'

export default defineComponent({
  components: { DollarTwoTone, Loading, Cookie, MarketList, ClockCircleOutlined, CloseCircleOutlined, CheckCircleOutlined, LinkOutlined},

  computed: {
    ...mapState([
      'relaket',
      'user'
    ])
  },

  data() {
    return {
      SEARCH_BUTTON_CONFIG: [
        {
          options: [
            {
              label: '전체',
              value: 'all',
            },
            {
              label: 'Tmall',
              value: 'Tmall',
            },
            {
              label: 'Taobao',
              value: 'Taobao',
            },
            {
              label: 'Alibaba',
              value: 'Alibaba',
            },
            {
              label: 'Aliexpress',
              value: 'Aliexpress',
            },
          ],
          label: '상품수집마켓',
          key: 'market_code',
          class: 'w27',
          group_class: 'space-between mb10',
        },
        {
          options: [
            {
              label: '전체',
              value: 'all',
            },
            {
              label: '번역',
              value: '1',
            },
            {
              label: '미번역',
              value: '0',
            },
          ],
          label: '번역',
          key: 'trans_status',
          class: 'w14 inline-block',
          group_class: 'space-between',
        },
        {
          options: [
            {
              label: '전체',
              value: 'all',
            },
            {
              label: '성공',
              value: '1',
            },
            {
              label: '실패',
              value: '0',
            },
            {
              label: '미연동',
              value: '2',
            },
          ],
          label: '릴라켓연동',
          key: 'sync_status',
          class: 'w19 ml17 inline-block',
          group_class: 'space-between',
        },
      ],
      SEARCH_DATE_CONFIG: [
        {
          key: 'insert_date',
          label: '등록',
        },
        {
          key: 'update_date',
          label: '수정',
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
          title: '선택',
          key: 'checked',
          width: '3%',
          align: 'center'
        },
        {
          title: '사진',
          key: 'item_thumb',
          width: '5%',
          align: 'center'
        },
        {
          title: '상품명',
          key: 'item_name',
          align: 'center'
        },
        {
          title: '판매가',
          key: 'item_price',
          width: '12%',
          align: 'center'
        },
        {
          title: '상품코드',
          key: 'item_code',
          width: '12%',
          align: 'center'
        },
        {
          title: '상품등록(수정)일',
          key: 'item_ins',
          width: '12%',
          align: 'center'
        },
        {
          title: '연동마켓',
          key: 'item_sync_status',
          width: '12%',
          align: 'center'
        },
        {
          title: '연동상태',
          key: 'item_status',
          width: '8%',
          align: 'center'
        },
        {
          title: '제휴사연동',
          key: 'item_sync',
          width: '6%',
          align: 'center'
        },
      ],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: () => `전체 상품 건수 ${this.totalCount} / 검색 상품 건수 ${this.searchCount}`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
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
        },
      },
      SYNC_COLUMNS_CONFIG: [
        {
          title: '선택',
          key: 'checked',
        },
        {
          title: '쇼핑몰',
          key: 'market_account',
        },
        {
          title: '연동상태',
          key: 'status',
        },
        {
          title: '연동시간',
          key: 'ins_time',
        },
      ],

      checked: false,
      indicator: false,
      trans_status: 'all',
      // isChangeLimit: false,
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
      MarketListVisible: false,
    };
  },

  methods: {
    getLogoSrc(fileName, marketCode) {
      try {
        return require(`../../assets/img/list/${fileName}/${marketCode}.png`);
      } catch (error) {
        return 'data:image/png;base64,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';
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
          'background-color: #3ddc97; border: none' :
          'background-color: #f06543; border: none';
    },

    getList(sType = '') {
      let param = this.getParam(sType);
      this.indicator = true;
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/prdlist', {params: param}).then((res) => {
        if (res.status !== '2000') {
          alert(res.message)
        }

        this.prdlist = res.data.list;

        for (let i = 0; i < this.prdlist.length; i++) {
          this.prdlist[i].key = i;
          this.prdlist[i].checked = false;
          this.prdlist[i].item_name_type = '기존 상품명';
          if (this.prdlist[i].item_is_trans === true) {
            this.prdlist[i].item_name_type = '번역 상품명';
          }

          // 옵션 최저가 - 최대가
          // let minPrice = Math.min(...this.prdlist[i].item_sku.map(item => item.selling_price));
          // let maxPrice = Math.max(...this.prdlist[i].item_sku.map(item => item.selling_price));
          // if (minPrice === 0) {
          //   minPrice = Math.min(...this.prdlist[i].item_sku.map(item =>
          //     Number(item.shipping_fee_cn) + Number(item.original_price_cn)
          //   ));
          //   maxPrice = Math.max(...this.prdlist[i].item_sku.map(item =>
          //     Number(item.shipping_fee_cn) + Number(item.original_price_cn)
          //   ));
          //   minPrice = Math.ceil(Number(minPrice * (1 + Number(this.user.selling_margin_option) / 100) *
          //       Number(this.user.rate_margin_option)).toFixed(0) / 100) * 100;
          //   maxPrice = Math.ceil(Number(maxPrice * (1 + Number(this.user.selling_margin_option) / 100) *
          //     Number(this.user.rate_margin_option)).toFixed(0) / 100) * 100;
          //
          // }
          // this.prdlist[i]['show_price'] = minPrice.toLocaleString() + '원 ~ ' + maxPrice.toLocaleString() + '원';
          this.prdlist[i]['show_price'] = 111;

          // 제휴사 정보
          if (i === 0) {
            console.log('==0==')
            console.log(this.prdlist[i].item_sync_market)
          }
          let show_sync_market = {};

          this.prdlist[i].item_sync_market.forEach(value => {
            let key = value.market_account.split('::')[0]

            if (!show_sync_market[key]) {
              show_sync_market[key] = []; // 初始化为空数组
            }
            show_sync_market[key].push(value)
          });

          if (i === 0) {
            console.log('==0==')
            console.log(show_sync_market)
          }
          this.prdlist[i]['show_sync_market'] = show_sync_market;
        }

        let iCurrent = parseInt(res.data.page);
        let iPageSize = parseInt(res.data.limit);
        // if (sType === 'reload') {
        //   iCurrent = sessionStorage.relaket_page !== undefined? parseInt(sessionStorage.relaket_page): iCurrent;
        //   iPageSize = sessionStorage.relaket_limit !== undefined? parseInt(sessionStorage.relaket_limit): iPageSize;
        // }

        this.searchCount = parseInt(res.data.searchCount);
        this.totalCount = parseInt(res.data.totalCount);
        this.pagination.total = parseInt(res.data.searchCount);
        this.pagination.current = iCurrent;
        this.pagination.pageSize = iPageSize;
        this.date = [moment(res.data.start_time), moment(res.data.end_time)];
        this.indicator = false;
        this.checked = false;
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
        return sName.substr(0, 80) + '...';
      }

      return sName;
    },

    getParam(sType = '') {
      let iLimit = parseInt(this.limit);
      let iPage = parseInt(this.pageNum) || 1;

      if (sType === 'reload') {
        iPage = sessionStorage.relaket_page !== undefined? parseInt(sessionStorage.relaket_page): iPage;
        iLimit = sessionStorage.relaket_limit !== undefined? parseInt(sessionStorage.relaket_limit): iLimit;
      }

      return {
        'market_code': this.market_code === '' || this.market_code === null ? 'all' : this.market_code,
        'date_type': this.date_type,
        'start_time': this.start_time,
        'end_time': this.end_time,
        'search_key': this.search_key,
        'search_value': this.search_value,
        'trans_status': this.trans_status === '' || this.trans_status === null ? 'all' : this.trans_status,
        'sync_status': this.sync_status === '' || this.sync_status === null ? 'all' : this.sync_status,
        'limit': iLimit,
        'page': iPage,
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
        alert('선택하신 모든 상품의 마켓연동에 필요한 카테고리 값이 없습니다.');
        this.indicator = false;
        return false;
      }

      if (notCatePrd.length > 0) {
        alert(notCatePrd + ' 등 상품의 카테고리 정보가 없습니다.');
      }

      AuthRequest.post(process.env.VUE_APP_API_URL + '/api/sendmarket', {list: list}).then((res) => {
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
        let sMessage = "";
        if (data.success_code.length) {
          sMessage = '연동성공 상품 : ' + data.success_code;
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
        alert('선택된 상품이 없습니다.');
        return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delete', {params: {list: list}}).then((res) => {
        // if (res.status !== 200) {
        //   alert('삭제실패');
        //   return false;
        // }

        if (res.status !== '2000') {
          alert(res.message)
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

      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/exceldown', {params: param}).then((res) => {
        this.indicator = false;
        if (res.status !== '2000') {
          alert(res.message)
          return false;
        }
        // if (res.status !== 200) {
        //   alert('파일 다운로드에 실패하였습니다. \n일시적인 현상이오니 잠시후 재 시도하시길 바랍니다.');
        //   return false;
        // }
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
        if (res.status !== '2000') {
          alert(res.message)
          return false;
        }

        let returnData = res.data;
        // if (returnData.status === undefined || returnData.status !== '2000') {
        //   alert(returnData.msg);
        //   return false;
        // }

        this.options = returnData.data;
      });
    },

    testPop() {
      this.marketSyncPop = !this.marketSyncPop;
    },

    async testsync(type) {
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

      try {

          let res = await AuthRequest.post(process.env.VUE_APP_API_URL + '/api/sendmarket', {list: list});
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

      } catch (e) {
          alert(e.message);
          this.indicator = false;
          return false;
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/syncmarket',
          {params: {list: list, market: marketList, options: this.options}}).then((res) => {
        if (res.status !== '2000') {
          alert(res.message)
        }

        let returnData = res.data;
        if (type === 'multi') {
          this.setResultPopData(true, [
            returnData.success,
            returnData.failedCode,
            returnData.failed,
            returnData.total,
            returnData.data,
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
            returnData.data,
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

      setTimeout(()=>{
        Object.values(document.querySelectorAll('.syncStatus')).map(el => {
          el.parentElement.parentElement.style.backgroundColor = '#f9f9f9';
          if (el.getAttribute('data-status') === 'success') {
            el.parentElement.parentElement.style.backgroundColor = '#fff7f5';
          }
        })

        Object.values(document.querySelectorAll('.tableSyncStatus thead th')).map(el => {
          el.style.backgroundColor = '#f7fdff';
        })
      })
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

    css() {
      Object.values(document.querySelectorAll('#content-content th')).map(th => {
        th.style.margin = '0';
        th.style.padding = '0';
        th.style.backgroundColor = '#fafafa';
        th.style.textAlign = 'center';
        th.style.height = '50px';
      });

      document.querySelector('[placeholder="Start Time"]').style.textAlign = 'center';
      document.querySelector('[placeholder="End Time"]').style.textAlign = 'center';
    },
  },

  mounted() {
    this.getList('reload');
    this.getMarketList();
    this.css();
  },
});
</script>

<!--search-->
<style scoped>
/* ant vue 버튼 버그 */
#header .ant-radio-button-wrapper:not(:first-child)::before {
  content: none;
}

/* 모든 title */
#header h1 {
  font-size: 15px;
  font-weight: 600;
}

/* mouse leave */
#header .market_code {
  border: 1px solid #f06543 !important;
  border-radius: 5px !important;
  color: #f06543 !important;
  background-color: white !important;
}

/* mouse over */
#header .market_code:hover {
  color: white !important;
  background-color: #f06543 !important;
}

/* checked */
#header .market_code.ant-radio-button-wrapper-checked {
  outline: none !important;
  border: none !important;
  color: white !important;
  background-color: #3ddc97 !important;
}

/*********************************************************/

/* mouse leave */
#header .trans_status,
#header .sync_status {
  border: 1px solid #eff2f7 !important;
  border-radius: 5px !important;
  background-color: #eff2f7 !important;
  color: black !important;
}

/* mouse over */
#header .trans_status:hover,
#header .sync_status:hover {
  background-color: #d6ddea !important;
}

/* checked */
#header .trans_status.ant-radio-button-wrapper-checked,
#header .sync_status.ant-radio-button-wrapper-checked {
  outline: none !important;
  border: none !important;
  background-color: #3051d3 !important;
  color: white !important;
}

/* 검색버튼 */
#header button:last-child {
  color: white;
  background-color: #2c4cc7;
}
</style>

<!--list-->
<style scoped>
/* ant vue 버튼 버그 */
#content .ant-radio-button-wrapper:not(:first-child)::before {
  content: none;
}

#content-content-checkAll {
  position: absolute;
  z-index: 9;
  left: 305px;
  top: 505px;
}

#content-content img {
  width: 50px;
  height: 50px;
}

#content-content .get-market-icon img {
  margin-top: -2px;
}
#content-content .get-market-icon img {
  width: 16px;
  height: 16px;
}
#content-content .item-name {
  text-align: left;
}
#content-content .item-name a {
  padding: 0 15px 0 5px;
  color: #555;
}

#content-content .item-upd {
  font-size: 12px;
  color: #999;
}

#content-content .center .item-market {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

#content-content .center .unsync img {
  cursor: pointer;
  width: 16px;
  height: 16px;
  filter: grayscale(100%);
}

#content-content .center .sync img {
  cursor: pointer;
  width: 16px;
  height: 16px;
  filter: grayscale(0%);
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

