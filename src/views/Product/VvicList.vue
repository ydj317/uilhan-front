<template>
  <!--검색-->
  <a-card :bordered="false" title="Vvic 상품관리" :style="{ marginBottom: '20px' }">
    <div id="header">
      <!--검색기간-->
      <div>
        <div class="inline-block mr17 mt10">
          <h1>검색기간</h1>
          <a-input-group compact>
            <a-date-picker v-model:value="tableData.param.date" format="YYYY-MM-DD" placeholder="날자 선택" />
          </a-input-group>
        </div>

        <!--검색입력창-->
        <div class="inline-block mt10">
          <h1>키워드</h1>
          <a-input-group compact>
            <a-select v-model:value="tableData.param.search_key" style="width: 150px;">
              <a-select-option v-for="config in SEARCH_KEYWORD_CONFIG" :value="config.key">
                {{ config.label }}
              </a-select-option>
            </a-select>
            <a-input v-model:value="tableData.param.search_value" placeholder="키워드" style="width: 300px;" allow-clear />
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
  <a-card :bordered="false" :loading="tableData.listLoading">
    <!--top-->
    <div id="content-header" class="row space-between">
      <!--left button-->
      <div style="display: flex;gap: 15px;">
        <!--상품삭제-->
        <a-popconfirm title="삭제하시겠습니까?" @confirm.prevent="removeSelectionVvicProduct">
          <a-button type="danger">상품삭제</a-button>
        </a-popconfirm>

        <div>
          <a-button @click="vvicSelectionInsertIntoProduct()" type="primary"
            :disabled="((processCount - 1) !== processTotal) || selectionTableData.length < 1">선택상품등록
          </a-button>
          <a-progress :percent="processPercent" size="small" :show-info="false" />
        </div>
      </div>

      <!--right button-->
      <div class=" pl5" style="display: flex;flex-direction: row;gap: 20px;">

        <div>
          <a-date-picker v-model:value="collectDate" style="width: 120px;" placeholder="수집일 선택" format="YYYY-MM-DD"
            :disabled-date="disabledDate" />
          <a-popconfirm title="상품 수집시 시간이 다소 소요될수 있습니다! 계속하시겠습니까?" ok-text="예" cancel-text="아니요"
            @confirm="vvicProductCollect">
            <a-button type="danger" class="mr10" :loading="collectLoading">
              <template #icon>
                <RetweetOutlined />
              </template>
              Vvic상품수집
            </a-button>
          </a-popconfirm>

        </div>
      </div>
    </div>

    <!--content-->
    <div id="content-content" class="pt20">

      <!--전체선택-->
      <a-table ref="vvicListTableDataRef" :columns="LIST_COLUMNS_CONFIG" :data-source="tableData.list" :pagination="false"
        :row-selection="rowSelection" class="mb15">
        <!--table body-->
        <template v-slot:bodyCell="{ text, record, index, column }">
          <!--사진-->
          <template v-if="column.key === 'item_thumb'">
            <a-image :src="record.itemThumbnails[0]" style="width: 50px; height: 50px;" />
          </template>

          <!--상품코드-->
          <template v-if="column.key === 'item_code'">
            <a-button type="dashed" :href="record.itemUrl" :target="'_blank'">
              {{ record.itemCode }}
            </a-button>
          </template>

          <!--상품명-->
          <template v-if="column.key === 'item_name'">
            <div class="item-name">
              <a :href="record.itemUrl" target="_blank">
                {{ record.itemName }}
              </a>
            </div>
          </template>

          <!--판매가-->
          <template v-if="column.key === 'item_price'">
            <div>{{ getMinSkuPrice(record.itemSku) }}</div>
          </template>

          <!--등록상태-->
          <template v-if="column.key === 'status'">
            <a-tag v-if="!record.status">미등록</a-tag>
            <a-tag v-else color="success">등록</a-tag>
          </template>

          <!-- 수집일 -->
          <template v-if="column.key === 'create_at'">
            <div>{{ record.createAt.split(" ")[0] }}</div>
          </template>

          <!--上新일-->
          <template v-if="column.key === 'item_up_time'">
            <div>{{ record.itemUpTime }}</div>
          </template>

          <template v-if="column.key === 'operation'">
            <div class="center">
              <a-button type="primary" shape="round" @click="vvicInsertIntoProduct(record)">등록</a-button>
            </div>
          </template>

        </template>
      </a-table>
      <a-pagination v-model:current="tableData.param.pageNum" v-model:page-size="tableData.param.limit"
        :total="tableData.total" :show-total="total => `전체 상품 건수 ${total} / 한페이지 ${tableData.param.limit}`"
        @change="pageChangeHandler" />
    </div>
  </a-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { AuthRequest } from "@/util/request";
import moment from "moment";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Cookie from "js-cookie";
import { mapState } from "vuex";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  DollarTwoTone, SearchOutlined,
  RetweetOutlined
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    SearchOutlined,
    DollarTwoTone,
    Loading,
    Cookie,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    LinkOutlined,
    RetweetOutlined
  },

  computed: {

  },

  data() {
    return {
      tableData: {
        list: [],
        total: 0,
        listLoading: false,
        param: {
          search_key: "itemCode",
          search_value: "",
          date: null,
          pageNum: 1,
          limit: 10
        },
        date: ""
      },
      processPercent: 0,
      processTotal: 0,
      processCount: 1,
      collectDate: dayjs().subtract(1, 'day'),
      collectLoading: false,
      SEARCH_DATE_CONFIG: [
        {
          key: "insert_date",
          label: "등록"
        }
      ],
      SEARCH_KEYWORD_CONFIG: [
        {
          key: "itemCode",
          label: "상품코드"
        },
        {
          key: "itemName",
          label: "상품명"
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
          align: "center"
        },
        {
          title: "판매가",
          key: "item_price",
          width: "12%",
          align: "center"
        },
        {
          title: "등록상태",
          key: "status",
          width: "8%",
          align: "center"
        },
        {
          title: "수집일",
          key: "create_at",
          width: "10%",
          align: "center"
        },
        {
          title: "상신일",
          key: "item_up_time",
          width: "10%",
          align: "center"
        },
        {
          title: "관리",
          key: "operation",
          width: "8%",
          align: "center"
        }
      ],
      selectionTableData: [],
      pageChangeHandler: (page) => {
        this.tableData.param.pageNum = page;
        this.getList();
      },
      rowSelection: {
        checkStrictly: false,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectionTableData = selectedRows;
        }
      },
      vvicListTableDataRef: ref(null)
    };
  },

  methods: {
    initSearchParam() {
      this.tableData.param.date_type = "insert_date";
      this.date = [];
      this.tableData.param.search_key = "itemCode";
      this.tableData.param.search_value = "";
    },
    getList() {
      this.tableData.listLoading = true;
      AuthRequest.get(process.env.VUE_APP_API_URL + "/api/product/getVvicList", { params: this.tableData.param }).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
        }

        const { list, total } = res.data;

        this.tableData.list = list;
        this.tableData.total = total;
        this.date = [moment(res.data.start_time), moment(res.data.end_time)];
        this.tableData.listLoading = false;
      });
    },
    vvicInsertIntoProductAPI(row) {
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/product/vvicInsertIntoProduct", row).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          this.processPercent = 0;
          this.processTotal = 0;
          this.processCount = 1;
          return false;
        }

        if (this.processCount === this.processTotal) {
          this.processPercent = 100;
        } else {
          this.processPercent = Math.floor((this.processCount / this.processTotal) * 100);
        }

        message.success(`[${row.itemCode}]상품이 등록 되였습니다.`);
        this.processCount++;
      });
    },

    async vvicInsertIntoProduct(row) {
      this.processCount = 1;
      this.processTotal = 1;
      await this.vvicInsertIntoProductAPI(row);
    },

    async vvicSelectionInsertIntoProduct() {
      if (this.selectionTableData.length < 1) {
        message.warning("상품을 선택해주세요.");
        return false;
      }
      this.processCount = 1;
      this.processTotal = this.selectionTableData.length;
      for (const item of this.selectionTableData) {
        await this.vvicInsertIntoProductAPI(item);
      }
    },

    callRemoveVvicProductAPI(row) {

      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/product/vvicRemoveProduct", row).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        message.success(row.itemCode + "상품삭제 되였습니다.");
      });
    },

    // 상품삭제
    async removeSelectionVvicProduct() {
      if (this.selectionTableData.length < 1) {
        message.warning("상품을 선택해주세요.");
        return false;
      }

      // promise all 로 처리
      Promise.all(this.selectionTableData.map((item) => this.callRemoveVvicProductAPI(item)))
        .then(() => {
          this.getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 상품 수집
    async vvicProductCollect() {
      if (this.collectDate === null) {
        message.error('수집일을 선택해주세요.');
        return false
      }
      this.collectLoading = true;
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/product/vvicProductCollect", { collectDate: this.collectDate }).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          this.collectLoading = false;
          return false;
        }
        this.collectLoading = false;
        message.success("상품수집이 요청 되었습니다. 3~5분 소요됩니다.");
      });
    },

    getMinSkuPrice(sku) {
      // 최소가격
      let minPrice = 0;
      sku.map((item) => {
        if (minPrice === 0) {
          minPrice = item.price;
        } else {
          if (minPrice > item.price) {
            minPrice = item.price;
          }
        }
      });
      return minPrice;
    },

    disabledDate(current) {
      // Can not select days before today and today
      return current && current > dayjs().endOf('day');
    },
  },

  // watch this.processPercent
  watch: {
    processPercent: function (val) {
      if (val === 100) {
        setTimeout(() => {
          this.processPercent = 0;
          this.processTotal = 0;
          this.processCount = 1;
          this.getList();
        }, 1000);
      }
    }
  },
  beforeMount() {
    this.getList("reload");
  }

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

