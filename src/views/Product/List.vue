<template>
  <loading v-model:active="indicator" :can-cancel="false" :is-full-page="true"/>

  <!--검색-->

  <div id="header" style="padding:0 30px;">
    <div style="display: flex; justify-content: space-between" @click="expand = !expand">
      <h1 style="font-size: 18px;">상품관리</h1>
      <template v-if="expand">
        <UpOutlined/>
      </template>
      <template v-else>
        <DownOutlined/>
      </template>
    </div>

    <div v-if="expand" class="mt20">
      <!--선택버튼 (상품수집마켓, 번역)-->
      <div style="display: flex;flex-direction: column;justify-content:center;border-top: 1px solid #eeeeee">
        <div v-for="CONFIG in SEARCH_BUTTON_CONFIG"
             style="display: flex;flex-direction: row;align-items:center;border-bottom: 1px solid #eeeeee;height: 50px;">
          <h1 style="width: 120px;margin-top: 6px;">{{ CONFIG.label }}</h1>
          <a-radio-group v-model:value="this[CONFIG.key]" style="">
            <a-radio v-for="options in CONFIG.options" :value="options.value">
              {{ options.label }}
            </a-radio>
          </a-radio-group>
        </div>
      </div>

      <!--검색기간-->
      <div>
        <div class=" mr17 mt10" style="display: flex;height:50px;">
          <h1 style="width: 120px;margin-top: 6px;">검색기간</h1>
          <a-select v-model:value="date_type" style="width: 150px;height:33px;" class="mr10">
            <a-select-option v-for="data in SEARCH_DATE_CONFIG" :value="data.key">{{ data.label }}</a-select-option>
          </a-select>
          <a-range-picker v-model:value="date" format="YYYY-MM-DD" @change="onChangeDatePicker"
                          style="width: 300px;height:33px;"/>
        </div>

        <!--검색입력창-->
        <div class="mt10" style="display: flex;height:50px;border-bottom: 1px solid #eeeeee">
          <h1 style="width: 120px;margin-top: 6px;">검색어</h1>
          <a-select v-model:value="search_key" style="width: 150px;height:33px;" class="mr10">
            <a-select-option v-for="config in SEARCH_KEYWORD_CONFIG" :value="config.key">
              {{ config.label }}
            </a-select-option>
          </a-select>
          <a-input v-model:value="search_value" placeholder="검색어" style="width: 300px;height:33px;"/>
        </div>

        <div class="mt25" style="text-align: center;">
          <a-button @click="getList" style="width: 100px;" type="primary">
            <SearchOutlined/>
            검색
          </a-button>
          <a-button class="ml10" @click="initSearchParam()" style="width: 100px; border-color: #d9d9d9">초기화</a-button>
        </div>

      </div>
    </div>
  </div>


  <!--상품 리스트-->
  <a-card :bordered="true" style="border: none" :loading="listLoading" class="mt20">
    <!--top-->
    <div id="content-header" class="row space-between">
      <!--left button-->
      <div>
        <!--상품삭제-->
        <a-button class="mr10 button-blue" size="small" @click="deletePop()"
        >상품삭제
        </a-button>

        <!--상품삭제-->
        <a-popconfirm class="mr10 button-blue" @confirm="clonePrd">
          <template #title>
            <b>상품 복사 확인</b>
            <br>
            <span>선택한 상품을 복사하시겠습니다?</span>
            <br>
            <span style="font-size: 12px; color: #999;">*복사 된 상품은 최상단으로 이동합니다.</span>
          </template>
          <a-button size="small">상품복사</a-button>
        </a-popconfirm>

        <a-button v-if="this.userinfo.use_ai === '1'" @click="replaceWithAI" class="button-blue" size="small">AI 추천모드
        </a-button>
      </div>

      <!--right button-->
      <div>
        <a-button @click="urlPrdPop = true" class="ml10 button-blue" size="small">URL상품 업로드</a-button>

        <a-upload
            :action="uploadCustomOrderPath"
            v-model:fileList="excelPrdFileList"
            name="file"
            :max-count="1"
            :headers="excelUploadHeaders"
            :multiple="false"
            :showUploadList="false"
            @change="excelUploadCustomOrder"
            class="ml10 button-blue"
        >
          <a-button class="custom-button button-blue" size="small">엑셀상품 업로드</a-button>
        </a-upload>

        <a-button @click="downloadSampleExcel" class="custom-button ml10 button-blue" size="small">
          <DownloadOutlined/>
          업로드 샘플
        </a-button>
<!--        <a-upload-->
<!--            v-if="haveDownloadProductPermission"-->
<!--            :action="uploadProductPath"-->
<!--            v-model:fileList="fileList"-->
<!--            name="file"-->
<!--            :max-count="1"-->
<!--            :headers="headers"-->
<!--            :multiple="false"-->
<!--            :showUploadList="false"-->
<!--            @change="addExcelProduct"-->
<!--            class="ml10"-->
<!--        >-->
<!--          <a-spin style="margin-right: 10px;" v-if="uploadProductIndicator"/>-->
<!--          <a-button class="button-blue mr10" size="small">-->
<!--            상품 업로드-->
<!--            <template #icon>-->
<!--              <UploadOutlined/>-->
<!--            </template>-->
<!--          </a-button>-->
<!--        </a-upload>-->

<!--        <a-spin style="margin-right: 10px;" v-if="indicator"/>-->
<!--        <a-button v-if="haveDownloadProductPermission" @click="productExcelDown(record)" class="button-blue"-->
<!--                  size="small">상품 다운로드-->
<!--        </a-button>-->
        <!--선택상품 등록-->
        <a-button class="ml10 button-blue" @click="MarketListPop(record)" size="small">선택상품 등록</a-button>
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
            <a-image :src="record.item_thumb[0]" style="width: 50px; height: 50px;border-radius: 5px"/>
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
          <!--          <template v-if="column.key === 'item_ins'">-->
          <!--            <div>{{ record.item_ins.slice(0, 16) }}</div>-->
          <!--            <div v-if="record.item_upd !== null" class="item-upd">-->
          <!--              ( {{ record.item_upd.slice(0, 16) }} )-->
          <!--            </div>-->
          <!--          </template>-->

          <!--등록상태-->
          <!--          <template v-if="column.key === 'item_status'">-->

          <!--            <span v-if="record.item_sync_date">-->
          <!--              &lt;!&ndash;연동성공&ndash;&gt;-->
          <!--              <a-tag color="success" v-if="record.item_sync_status">연동성공</a-tag>-->
          <!--              &lt;!&ndash;연동실패&ndash;&gt;-->
          <!--              <a-tooltip v-if="record.item_sync_status === false">-->
          <!--                <template #title>{{ record.item_sync_result }}</template>-->
          <!--                <a-tag color="error">연동실패</a-tag>-->
          <!--              </a-tooltip>-->
          <!--            </span>-->
          <!--            <span v-else>-->
          <!--              &lt;!&ndash;연동대기&ndash;&gt;-->
          <!--              <a-tag color="default">연동대기</a-tag>-->
          <!--            </span>-->
          <!--          </template>-->

          <!--제휴사연동-->
          <template v-if="column.key === 'item_sync_status'">
            <div class="center">
              <a-space>
                <a-button size="small"
                          @click.prevent="showHistory({title: record.item_trans_name || record.item_name, type: 'product', index_id: record.item_id})">
                  히스토리
                </a-button>
                <a-divider/>
                <a-button @click="singlePop(record)" size="small" class="primary-button-yellow">등록관리</a-button>
              </a-space>
            </div>
          </template>

        </template>
      </a-table>
    </div>

    <HistoryView :visible="historyVisible" @close="historyVisible = false" :historyData="historyData"/>
  </a-card>

  <!--팝업-->
  <div id="footer">

    <!--URL상품 업로드-->
    <a-modal width="800px" v-model:open="urlPrdPop" centered>
      <template #title>
        URL상품 업로드
        <a-tooltip>
          <template #title>
            <div>타오바오, 티몰, 1688 상품URL을 입력하여 상품 업로드 합니다.</div>
          </template>
          <QuestionCircleOutlined/>
        </a-tooltip>
      </template>

      <div>타오바오, 티몰, 1688 상품URL을 입력하여 상품 업로드 합니다.</div>

      <a-divider/>

      <div>
        <a-textarea
            v-model:value="urlPrdValue"
            placeholder="상품url 줄바꿈으로 구문하여 입력 부탁 합니다."
            :auto-size="{ minRows: 5, maxRows: 5 }"
        />
      </div>

      <template v-slot:footer>
        <a-button type="primary" @click="urlPrdUpload()">업로드</a-button>
        <a-button @click="urlPrdPop = false">취소</a-button>
      </template>
    </a-modal>

    <!--상품삭제-->
    <a-modal width="800px" v-model:open="deletePrdPop" centered>
      <template #title>
        등록상품 삭제하기
        <a-tooltip>
          <template #title>
            <div>전체삭제 할 경우 리스트에서 상품이 삭제됩니다.</div>
          </template>
          <QuestionCircleOutlined/>
        </a-tooltip>
      </template>

      <div class="space-between">
        <div>선택한 상품의 삭제할 오픈마켓을 선택해주세요.<br>11번가 / 롯데온 / 위메프는 상품 삭제를 지원하지안아 "판매중지" 상태로 변경됩니다.</div>
        <div>
          <a-button style="margin-right: 10px;" @click="deleteCheckList = deleteOptions.map(option => option.value)">
            전체선택
          </a-button>
          <a-button @click="deleteCheckList = []">전체해제</a-button>
        </div>
      </div>

      <a-divider/>

      <div v-if="deleteOptions.length > 0">
        <a-checkbox-group v-model:value="deleteCheckList">
          <a-checkbox v-for="option in deleteOptions" :key="option.value" :value="option.value"
                      style="background: #e1ecfe; padding: 5px 8px 8px 12px; border-radius: 3px; margin: 5px 10px 5px 0;">
            <img :src="getLogoSrc('market-logo', option.market_code)" alt=""
                 style="width: 16px; height: 16px; margin-right: 5px;">
            {{ option.label }}
          </a-checkbox>
        </a-checkbox-group>
      </div>

      <div style="color: red;" v-else>
        <a-empty>
          <template #description>
            <span>연동된 마켓이 없습니다. 리스트에서 상품을 삭제 하기겠습니까?</span>
          </template>
        </a-empty>
      </div>

      <template v-slot:footer>
        <a-button type="primary" @click="deletePrd()">삭제하기</a-button>
        <a-button @click="deletePrdPop = false">취소</a-button>
      </template>
    </a-modal>

    <!--등록관리-->
    <a-modal width="1000px" v-model:open="singleSyncPop" centered>
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
                   style="width: 16px; height: 16px; margin-right: 5px;" :alt="record.market_code">
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

    <!--연동결과-->
    <a-modal width="600px" v-model:open="marketSyncPop" centered title="제휴사연동결과" @cancel="closeResultPop('multi')">
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

    <!--선택상품 등록-->
    <MarketList v-if="MarketListVisible"></MarketList>
  </div>
</template>

<script>
import {defineComponent, reactive} from "vue";
import {AuthRequest} from "@/util/request";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Cookie from "js-cookie";
import MarketList from "@/components/List/MarketList";
import {useMarketApi} from "@/api/market";

import {Empty} from 'ant-design-vue';

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

import {mapState} from "vuex";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  DollarTwoTone, DownloadOutlined, SearchOutlined, QuestionCircleOutlined, UploadOutlined, UpOutlined, DownOutlined
} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";
import {lib} from "@/util/lib";
import HistoryView from "@/components/HistoryView.vue";
import {useCategoryApi} from "@/api/category";
import {useProductApi} from "@/api/product";
import {useUserApi} from "@/api/user";

export default defineComponent({
  components: {
    UploadOutlined,
    HistoryView,
    QuestionCircleOutlined,
    DownloadOutlined,
    SearchOutlined,
    DollarTwoTone,
    Loading,
    Cookie,
    MarketList,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    LinkOutlined,
    UpOutlined,
    DownOutlined
  },

  computed: {
    ...mapState([
      "relaket",
    ])
  },

  data() {
    return {
      lib,
      SEARCH_BUTTON_CONFIG: [
        {
          options: [
            {
              label: "전체",
              value: "all"
            },
            {
              label: "Taobao",
              value: "Taobao"
            },
            {
              label: "Tmall",
              value: "Tmall"
            },
            {
              label: "Alibaba",
              value: "Alibaba"
            },
            {
              label: "Aliexpress",
              value: "Aliexpress"
            },
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
        showTotal: () => `[전체 ${this.totalCount}개] / 검색결과 ${this.searchCount}개`,
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
          align: "center",
          width: "180px",
        },
        {
          title: "등록상태",
          key: "status",
          align: "center",
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

      deletePrdPop: false,
      deleteCheckList: [],
      deleteOptions: [],
      deleteItems: [],

      urlPrdPop: false,
      urlPrdValue: '',

      excelPrdFileList: [],
      uploadCustomOrderPath: process.env.VUE_APP_API_URL + "/api/excelPrdUpload?XDEBUG_SESSION_START=PHPSTORM",
      excelUploadHeaders: {
        token: Cookie.get("token")
      },

      singleSyncPop: false,
      singleDetail: [],
      checkedList: [],
      checkAll: false,
      listLoading: true,
      MarketListVisible: false,
      prdSelectedRowKeys: [],
      syncSelectedRowKeys: [],
      marketDetailUrls: [],
      historyVisible: false,
      historyData: {},
      smartStoreCategory: [],
      userinfo: {},
      haveDownloadProductPermission: false,
      fileList: [],
      headers: reactive({
        token: Cookie.get("token")
      }),
      uploadProductPath: process.env.VUE_APP_API_URL + "/api/product/excelUpload",
      uploadProductIndicator: false,
      simpleImage,
      expand: true,
    };
  },

  methods: {
    downloadSampleExcel() {
      window.open('/sampleFile/exclPrdUpload.xlsx', '_blank');
    },

    // 엑셀 업로드
    excelUploadCustomOrder(res) {
      if (res.file.status === 'uploading') {
        this.indicator = true;
        return false;
      }

      if (res.file.status === 'error') {
        this.indicator = false;
        message.error(res.error.message);
        return false;
      }

      if (res.file.status === 'done') {
        this.indicator = false;
        message.success(res.file.response.message);
      }
    },

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
      await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prdlist", {params: param}).then((res) => {
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

          if (selectedPrice.length === 0) {
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
      }).catch(() => {
        message.error("상품 리스트 조회 실패하였습니다.")
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

    async replaceWithAI() {
      this.indicator = true;

      let list = this.getCheckList();
      if (list === undefined || list.length === 0) {
        message.warning("선택된 상품이 없습니다.");
        this.indicator = false;
        return false;
      }

      await useProductApi().replaceWithAI({list}).then(res => {
        if (res.status !== "2000") {
          message.error(res.message);
          this.indicator = false;
          return false;
        }

        this.indicator = false;
        message.success('상품명이 성공적으로 업데이트 되었습니다. ');

        window.location.reload()
      });

    },

    deletePop() {
      let list = this.getCheckList();
      if (list === undefined || list.length === 0) {
        message.warning("선택된 상품이 없습니다.");
        return false;
      }

      this.deleteItems = this.prdlist.filter(item => list.includes(item.item_id));
      this.deleteOptions = Object.values(this.deleteItems.flatMap(item => item.item_sync_market)
          .reduce((acc, syncItem) => {
            const key = syncItem.id;
            if (!acc[key] && syncItem.status !== 'unsync') {
              acc[key] = {
                market_code: syncItem.market_code,
                label: syncItem.seller_id,
                value: syncItem.id
              };
            }
            return acc;
          }, {}));

      this.deletePrdPop = true;

    },

    async urlPrdUpload() {
      this.indicator = true;

      await useProductApi().urlPrdUpload({"urlPrdValue": this.urlPrdValue}).then(res => {
        if (res.status !== "2000") {
          message.error(res.message);
          this.indicator = false;
          return false;
        }

        message.success('업로드요청 성공하였습니다.');

        this.indicator = false;
        this.urlPrdPop = false;

      });

    },

    async deletePrd() {
      this.indicator = true;
      // 연동 마켓이 있을때 선택한 마켓이 없으면 선택하도록 얼럿
      if (this.deleteOptions.length > 0 && this.deleteCheckList.length === 0) {
        message.warning("삭제할 마켓을 선택해주세요.");
        this.indicator = false;
        return false;
      }

      // 1. 연동 마켓이 없을때
      // ㄴ리스트에서 상품삭제

      // 2. 연동 마켓이 있을때
      // ㄴ부분 마켓선택시 선택된 마켓만 삭제
      // ㄴ전체 선택시 선택된 마켓 삭제 및 리스트에서 상품삭제
      await useProductApi().deletePrd({
        'deleteItems': this.deleteItems,
        'deleteCheckList': this.deleteCheckList
      }).then(res => {
        if (res.status !== "2000") {
          message.error(res.message);
          this.indicator = false;
          return false;
        }

        window.location.reload()
      });

      return true;
    },

    clonePrd() {
      let list = this.getCheckList();
      if (list === undefined || list.length === 0) {
        message.warning("선택된 상품이 없습니다.");
        return false;
      }

      AuthRequest.post(process.env.VUE_APP_API_URL + '/api/clone', list).then((res) => {
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
        param = {list: list};
      }

      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/exceldown", {params: param}).then((res) => {
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
          throw new Error("설정하신 마켓계정 정보가 없습니다. \n마켓계정을 설정해주세요. ");
        }

        for (let i = 0; i < res.data.length; i++) {
          res.data[i].key = i;
        }

        this.options = res.data;
      }).catch((e) => {
        message.error(e.message);
        return false;
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
            this.singleDetail.item_sync_status = res.data.status === 'success';
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

    checkSmartStoreCategory(accountList) {

      const smartstoreAccounts = accountList.filter((item) => item.market_code === 'smartstore')

      let faildItem = [];
      if (smartstoreAccounts.length === 0) {
        return true;
      }

      if (this.singleDetail.item_sync_keyword !== undefined && this.singleDetail.item_sync_keyword !== null) {
        faildItem = this.smartStoreCategory.filter((item) => {
          return this.singleDetail.item_sync_keyword.includes(item.cate_name);

        })
      }

      if (faildItem.length > 0) {
        message.warning(`스마트스토어 금지어: [${faildItem.map((item) => item.cate_name).join(', ')}] 상품명 수정후 마켓연동해 주세요.`)
        return false;
      }
      return true;
    },

    async sendMarket() {

      let accountList = this.singleDetail.item_sync_market.filter(item => item.checked === true);

      if (accountList.length === 0 || accountList.length === undefined) {
        message.warning("선택된 계정이 없습니다.");
        this.indicator = false;
        return false;
      }

      const checkSmartStore = this.checkSmartStoreCategory(accountList);
      if (checkSmartStore === false) {
        return false
      }

      this.indicator = true;
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
      if (marketInfo.market_code === 'smartstore') {
        // check channel_info
        const channelInfo = marketInfo.market_data?.channel_info;

        if (!channelInfo?.url) {
          message.warning("채널정보가 없습니다. 마켓계정관리에서 연동확인 후 다시 시도해주세요.");
          return false;
        }
        url = `${channelInfo.url}/products/${market_prd_code}`;
      } else if (marketInfo.market_code === 'coupang') {
        if (marketInfo.front_code !== undefined) {
          market_prd_code = marketInfo.front_code
        }
        url = this.marketDetailUrls[marketInfo.market_code] + market_prd_code;
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
    },

    async getSmartstoreCategory() {
      await useCategoryApi().getSmartstoreCategory({}).then((res) => {
        if (res.status !== '2000') {
          message.error(res.message);
          return false;
        }

        this.smartStoreCategory = res.data
      }).catch((e) => {
        message.error(e.message);
        return false;
      })

    },

    showHistory(param) {
      this.historyData = param;
      this.historyVisible = true;
    },

    // 상품 엑셀 업로드 (큐텐)
    async addExcelProduct(res) {
      // 업로드중
      if (res.file.status === 'uploading') {
        this.indicator = true;
        return false;
      }

      // 실패
      if (res.file.status === 'error') {
        this.indicator = false;
        message.error(res.error.message);
        return false;
      }

      // 성공
      if (res.file.status === 'done') {
        this.indicator = false;
        message.success(res.file.response.message);
      }
    },


    async productExcelDown() {
      this.indicator = true;
      await useProductApi().downloadProductExcel(this.userinfo).then(res => {
        if (res['status'] !== '2000') {
          message.error("권한이 없는 사용자입니다. \n관리자에게 문의하시길 바랍니다");
          this.indicator = false;
          return false;
        }

        if (res === undefined) {
          message.error("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
          this.indicator = false;
          return false;
        }


        let downloadElement = document.createElement("a");
        let url = window.URL || window.webkitURL || window.moxURL;
        let href = process.env.VUE_APP_API_URL + `/uploads/product-list-all.xlsx?t=` + new Date().getTime();
        downloadElement.href = href;
        downloadElement.download = decodeURI('product-list-all.xlsx');
        this.indicator = false;// 下载后文件名
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        url.revokeObjectURL(href);
      });
    },

    async getUserInfoData() {
      try {
        await useUserApi().getUserInfoData({}).then((res) => {
          if (res.status !== "2000") {
            message.error(res.message);
            return false;
          }
          this.userinfo = res.data;
          if (['jwli', 'irunkorea_02', 'haeju'].includes(res.data['username'])) {
            this.haveDownloadProductPermission = true;
          }

        });
      } catch (error) {
        message.error(error.message);
        return false;
      }
    },
  },


  beforeMount() {
    Promise.all([this.getUserInfoData(), this.getMarketList(), this.getMarketDetailUrls(), this.getList("reload"), this.getSmartstoreCategory()]);
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

.button-blue {
  border-color: #2171e2;
  color: #2171e2;
}

.button-blue:hover {
  background-color: #2171e2;
  border-color: #2171e2;
  color: #ffffff;
}

.primary-button-blue {
  background-color: #2171e2;
  border-color: #2171e2;
  color: #ffffff;
}

.primary-button-blue:hover {
  background-color: #387dde;
  border-color: #2171e2;
  color: #ffffff;
}

.primary-button-yellow {
  background-color: #ffd117;
  border-color: #ffd117;
  color: #000000;
}

.primary-button-yellow:hover {
  background-color: #ffda47;
  border-color: #ffd117;
  color: #000000;
}
</style>
<style>
.ant-pagination .ant-pagination-item.ant-pagination-item-active a {
  background-color: #ffda47;
  border-color: #ffda47;
  color: #000000;
}
</style>
