<template>
  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 300px">
    <a-spin v-if="product.loading" size="large"/>
  </div>

  <h3><strong>가격설정</strong></h3>
  <table class="price-setting-table">
    <colgroup>
      <col style="width: 15%">
      <col>
      <col style="width: 15%">
      <col>
    </colgroup>
    <tr>
      <th>판매가 할인율</th>
      <td>
        <a-input-number v-model:value="this.product.item_discount_rate"
                        :min="0"
                        :max="100"
                        :step="1"
                        style="width: 38.8%"
                        addon-after="%"
                        placeholder="숫자를 입력해주세요" />
      </td>
      <th style="text-align:right">배송비 설정
        <a-tooltip>
          <template #title>
            <div>
              <div style="font-weight: bold">[무료배송 기능]</div>
              <div style="line-height: 1.8;">무료배송 박스 체크 시 배송비를 상품 판매가 내 추가하여 등록 할 수 있는 기능입니다.</div>
            </div>
            <div>
              <div style="font-weight: bold; margin-top: 10px">[쿠팡 배송 정책]</div>
              <a-popover v-model:open="popoverVisible" title="해외 (해외구매대행 포함)" trigger="click" placement="rightTop"
                         style="z-index: 999">
                <template #content>
                  <table border="1" style="border: 1px solid #999" class="popoverTable">
                    <tr>
                      <th>항목</th>
                      <th>상품 가격 기준</th>
                      <th>배송비</th>
                    </tr>
                    <tr>
                      <td rowspan="3">전체 카테고리</td>
                      <td><strong>상품가</strong> &lt;&equals; 20,000</td>
                      <td>최대 15,000</td>
                    </tr>
                    <tr>
                      <td>20,000 &lt; <strong>상품가</strong> &lt;&equals; 40,000</td>
                      <td>최대 20,000</td>
                    </tr>
                    <tr>
                      <td><strong>상품가</strong> &gt; 40,000</td>
                      <td>최대 30,000</td>
                    </tr>
                  </table>
                </template>
                쿠팡 배송비 정책 자세히 보러 가기 (삼각형 클릭)
                <a-button type="link">▶</a-button>
              </a-popover>
            </div>
            <div>
              <div style="font-weight: bold; margin-top: 10px">[티몬 배송 정책]</div>
              <div style="line-height: 1.8;">티몬의 경우 무료배송을 체크하지 않을 시 배송비용과 반품비용이 동일하게 적용됩니다.</div>
              <div style="line-height: 1.8; margin-top: 10px">무료배송으로 선택 시 기존에 설정되어 있는 반품 비용으로 적용됩니다.</div>
            </div>
          </template>
          <QuestionCircleOutlined/>
        </a-tooltip>
      </th>
      <td>
        <a-radio-group v-model:value="this.product.item_is_free_delivery">
          <a-tooltip>
            <template #title>배송비가 판매가에 적용됩니다.</template>
            <a-radio :value="true">무료배송</a-radio>
          </a-tooltip>
          <a-tooltip>
            <template #title>배송비가 운임에 적용됩니다.</template>
            <a-radio :value="false">유료배송</a-radio>
          </a-tooltip>
        </a-radio-group>
      </td>
    </tr>

    <tr>
      <th>판매가 인상/인하 설정</th>
      <td class="">
          <a-input-number :min="0" :step="1000" style="width: 30%;" v-model:value="this.item_price_change_value" addon-after="원">
            <template #addonBefore >
              <a-select v-model:value="this.item_price_change_type" style="width: 60px">
                <a-select-option value="add">+</a-select-option>
                <a-select-option value="minus">-</a-select-option>
              </a-select>
            </template>
          </a-input-number>
        <a-button style="margin-left: 5px" @click="changeSellingPrice">적용</a-button>
      </td>
      <th></th>
      <td>
        <a-input-number @change="handleShippingFeeChange"
                        v-model:value.number="product.item_shipping_fee"
                        :min="0"
                        :step="1000"
                        style="width: 50%"
                        addon-after="원"
                    />
      </td>
    </tr>
  </table>

  <div id="eModelTitle_3" class="mt20 bg-white">
    <h3><strong>옵션정보</strong></h3>
    <!--sku 상단 버튼-->
    <div class="top_button_container" style="display: flex;justify-content: space-between;">
      <!--sku 상단 left 버튼-->
      <div class="top_button_left_item" style="display: flex;gap: 10px;align-items: center">
        <!--품목삭제-->
        <a-button @click="deleteSku" >삭제</a-button>
        <!--일괄적용-->
        <a-popconfirm title="첫번째 품목값으로 일괄적용하시겠습니까?(재고, 판매가)" @confirm="skuBatch">
          <a-button>일괄변경</a-button>
        </a-popconfirm>
        <div style="display: flex;gap: 5px">
          <a-input-group compact>
            <a-select v-model:value="setting_price_type" style="width: 175px">
              <a-select-option value="min_price">옵션가 기준 50%</a-select-option>
            </a-select>
            <a-button type="primary" @click="settingSkuPrice">적용</a-button>
          </a-input-group>

          <a-tooltip class="ml5">
            <template #title>
              <div>옵션가 50%±허용 범위를 벗어 나는 옵션들을 자동으로 삭제 합니다.</div>
            </template>
            <QuestionCircleOutlined/>
          </a-tooltip>
        </div>
      </div>

      <!--sku 상단 right 버튼-->
      <div class="row" style="display: flex;flex-direction: column;gap: 10px;">

        <div>
          <a-space>
            <a-button @click="showOptionConPop" >옵션 미리보기</a-button>
            <a-button @click="showOptionPop" >옵션 수정</a-button>
            <a-button type="primary" @click="resetOption" class="reset">옵션정보 초기화</a-button>
          </a-space>
        </div>
      </div>
    </div>

    <!--이미지 선택 팝업-->
    <div>
      <a-modal
          title="품목 이미지선택"
          @ok="skuImageWindowOk"
          @cancel="skuImageWindowCancel"
          v-model:open="sku_image_window_visible"
          okText="선택"
          cancelText="닫기"
      >
        <img
            class="sku_window_image"
            alt=""
            v-for="(item_thumbnails, i) in this.product.item_thumbnails"
            :key="i"
            :src="item_thumbnails.url"
            :class="`${
            selected_sku_image_index === i ? 'checkedEl' : 'checkedNot'
          }`"
            @click="selectSkuImage(i, item_thumbnails.url)"
            @dblclick="openPreview(item_thumbnails.url)"
        />
      </a-modal>
      <div v-if="showPreview" class="preview-overlay" @click="closePreview">
        <img :src="previewSrc" alt="Preview Image"/>
      </div>
    </div>

    <!--sku table-->
    <div class="table-scroll-container">
      <a-table
          :bordered="true"
          :columns="sku_columns"
          :pagination=false
          :data-source="sortedData"
          :row-selection="{selectedRowKeys: selectedRowKeys, onChange: handleRowSelectionChange}"
          @change="skuTableChange"
          :locale="tableLocale"
      >
        <!--bodyCell-->
        <template v-slot:bodyCell="{ record, column, index }">
          <!--선택-->
          <template v-if="column.key === 'checked'">
            <div class="center">
              <a-checkbox v-model:checked="record.checked" ></a-checkbox>
            </div>
          </template>

          <!--이미지-->
          <template v-else-if="column.key === 'img'">
            <div class="col center image-pic">
              <div class="big-img-wrap">
                <a-image
                    :width="100"
                    :height="100"
                    alt=""
                    v-if="record.img"
                    :src="record.img"
                    @click="translatePopup(record, record.img)"
                />
                <img :src="record.img" class="big-img">
              </div>
              <a-button
                  class="sku_image_button"
                  @click="skuImageWindowVisible(record.key)"
              >선택
              </a-button>
              <a-button>
                <EditOutlined @click="translateImg(record)" />
              </a-button>
            </div>
          </template>

          <!--스펙-->
          <template v-else-if="column.key === 'spec'">
            <div>
              {{ record.spec }}
            </div>
            <div class="barcode barcode-option-height">
              <div>{{ record.code }}</div>
            </div>
          </template>

          <!--구매원가-->
          <template v-else-if="['original_price_cn'].includes(column.key)">
            <div v-if="record.original_price_cn > 0 && record.editor !== 'T'"
                 class="center"
                 :style="
                record.img
                  ? `height: 30px; text-align: center; border: none;`
                  : `height: 30px; text-align: center; border: none;`
              "
                 style="display: flex;flex-direction: column;position: relative;"
            >
              <span>{{ formatNumber(record.original_price_ko) }}</span>
              <div>
                <sub style="padding:2px 6px;background-color: #f0f0f0;border-radius:4px;">
                  <span style="color: #999999">￥ {{ formatNumber(record.original_price_cn) }}</span>
                </sub>
              </div>
            </div>
            <div v-if="record.original_price_cn === 0 || record.editor === 'T'" style="border: 1px solid red">
              <a-input
                  :style="
                  record.img
                    ? `height: 30px; text-align: center; border: none;`
                    : `height: 30px; text-align: center; border: none;`
                "
                  @input="setOriginalPrice(record)"
                  v-model:value="record[column.key]"
              />
            </div>
          </template>

          <!--재고수량-->
          <template
              v-else-if="['stock', 'shipping_fee_cn'].includes(column.key)"
          >
            <a-input-number
                :style="
                record.img
                  ? `height: 30px; text-align: center; border: none;border: none;`
                  : `height: 30px; text-align: center; border: none;border: none;`
              "
                style="display: flex;flex-direction: column;margin-top:-20px;"
                min="0"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                v-model:value="record[column.key]"
            />
          </template>

          <!-- 판매가 -->
          <template v-else-if="column.key === 'selling_price'">
            <a-input-number
                :style="
                  record.imgs
                    ? `height: 30px; text-align: center; border: none;border: none;`
                    : `height: 30px; text-align: center; border: none;border: none;`
                "
                step="1000"
                min="0"
                @change="watchExpectedReturn(column.key, index)"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                v-model:value="record[column.key]"
            />
            <div style="text-align:center">
              <span style="font-size:12px;">옵션가기준</span>
              <label class="ant-radio-wrapper" :class="{'ant-radio-wrapper-checked': record.is_option_reference_price === 'T' }">
                  <span class="ant-radio" :class="{'ant-radio-checked': record.is_option_reference_price === 'T' }">
                    <span class="ant-radio-inner" @click="setIsOptionReferencePrice(record.key)"></span>
                  </span>
              </label>
            </div>
          </template>
          <!--보여주기-->
          <template v-else>
            <div
                class="center"
                :style="
                record.img
                  ? `height: 130px; text-align: center; border: none;`
                  : `height: 30px; text-align: center; border: none;`
              "
                style="margin-top:-20px;"
            >
              {{ formatNumber(record[column.key]) }}
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <image-translate-tools ref="imageTranslateTools" v-model:visible="imageTranslateToolsVisible"
                         @update:visible="imageTranslateToolsVisible = false" :translateImageList="translateImageList"
                         @update:translateImageList="updateTranslateImageList"/>
</template>

<script>
import {mapState} from "vuex";
import {lib} from "@/util/lib";
import {cloneDeep, forEach} from "lodash";
import {message, Modal} from "ant-design-vue";
import {defineComponent, nextTick} from "vue";
import {EditOutlined, QuestionCircleOutlined} from "@ant-design/icons-vue";
import ImageTranslateTools from "@/components/Detail/ImageTranslateTools.vue";


export default defineComponent({
  name: "productDetailSku",
  components: {ImageTranslateTools, QuestionCircleOutlined,EditOutlined},

  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    }),
    sortedData() {
      return this.sortData(this.product.sku);
    },
  },
  props: {
    activeKey: {
      type: String,
      default: '1'
    },
  },
  watch: {
    activeKey: {
      handler() {
        if(this.activeKey == 2){
          const requestIdsLength = this.$refs.imageTranslateTools.xjParams.requestIds.length;
          if(!requestIdsLength){
            this.$nextTick(() => {
              this.getRequestIds();
            });
          }
        }
      },
    },
    product: {
      handler() {
        if(this.activeKey == 2){
          this.$nextTick(() => {
            this.getRequestIds();
          });
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      selected_sku_image_key: 0,
      selected_sku_image_url: "",
      selected_sku_image_index: 0,
      sku_image_window_visible: false,
      showPreview: false,
      popoverVisible: false,
      previewSrc: '',
      setting_price_type: 'min_price',
      sku_columns: [
        {
          title: "옵션이미지",
          key: "img",
          width: "1%",
        },
        {
          title: "옵션명/품목코드",
          key: "spec",
          width: "18%",
        },
        {
          title: "재고수량/개",
          key: "stock",
          width: "7%",
        },
        {
          title: "구매원가/원",
          key: "original_price_cn", // 한국돈 = 수집원가*설정환율
          width: "9%",
        },
        {
          title: "판매가/원",
          key: "selling_price", // (구매원가+중국내 운임)*마진율
          width: "8%",
          sorter: true,
          sortOrder: null,
        },
        {
          title: "운임/원",
          key: "shipping_fee_ko",
          width: "6%",
        },
        {
          title: "예상수익/원",
          key: "expected_return",
          width: "7%",
        },
      ],
      tableLocale: {
        triggerDesc: '클릭시 판매가 높은 순/낮은 순으로 배열합니다.',
        triggerAsc: '클릭시 판매가 높은 순/낮은 순으로 배열합니다.',
        cancelSort: '클릭시 판매가 높은 순/낮은 순으로 배열합니다.',
      },

      sku_pagination: {
        total: 0,
        defaultPageSize: 10,
        // showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },

      selectedRows: [],
      selectedRowKeys: [],

      // 판매가 인상인하 사용값
      item_price_change_type : 'add',
      item_price_change_value : 0,
      imageTranslateToolsVisible: false,
      translateImageList: [],
      translateSkuCode: false,
      specGroupVisible:true,
      // 韩国MarketList
      KrMarketList: ['Domeggook', 'Alibaba'],

      sortOrder: null,
      sortColumn: null,
    };
  },

  methods: {
    settingSkuPrice() {
      if (!Array.isArray(this.product.sku) || this.product.sku.length === 0) {
        return false;
      }

      // 获取相应的 selling_price 值
      const objWithT = this.product.sku.find(obj => obj.is_option_reference_price === 'T');
      const targetPrice = objWithT ? objWithT.selling_price : this.product.sku[0].selling_price;

      // this.product.sku에서 selling_price가 targetPrice 보다 50%이상이거나 50%이하일때 경고창 띄우기
      for (const skuItem of this.product.sku) {
        const {selling_price} = skuItem;
        // 경고창 띄운 후에도 selling_price가 targetPrice 보다 50%이상이거나 50%이하일때 this.product.sku 에서 삭제
        if (selling_price > targetPrice * 1.5 || selling_price < targetPrice * 0.5) {
          // this.product.sku에서 삭제
          this.product.sku = this.product.sku.filter(item => item.key !== skuItem.key);
        }
      }

      // this.product.sku에서 is_option_reference_price가 모두 F일시 최소값을 T로 변경
      const hasTrueOption = this.product.sku.some(skuItem => skuItem.is_option_reference_price === 'T');

      if (!hasTrueOption) {
        for (const skuItem of this.product.sku) {
          // 선택된 skuItem만 T로 변경
          skuItem.is_option_reference_price = 'F';
          if (skuItem.selling_price === targetPrice) {
            skuItem.is_option_reference_price = 'T';
          }
        }
      }

      const use_pvs = [];
      for (const skuItem of this.product.sku) {
        if (skuItem.pvs.includes(';')) {
          // 如果包含分号，按分号分割字符串并循环插入数组
          const valuesArray = skuItem.pvs.split(';');
          for (const value of valuesArray) {
            use_pvs.push(value);
          }
        } else {
          // 如果不包含分号，直接插入数组
          use_pvs.push(skuItem.pvs);
        }
      }

      if (!Array.isArray(use_pvs) || use_pvs.length === 0) {
        return false;
      }

      // 使用 filter 过滤 item_option
      this.product.item_option = this.product.item_option.map(item => {
        // 过滤掉 data 中 key 包含在 use_pvs 中的项
        item.data = item.data.filter(dataItem => use_pvs.includes(dataItem.key));

        // 过滤掉 data 数组为空的项
        return item.data.length > 0 ? item : null;
      }).filter(Boolean);

      return true;
    },

    setIsOptionReferencePrice(key) {
      forEach(this.product.sku, (item, index) => {
        if (item.key === key) {
          this.product.sku[index].is_option_reference_price = "T";
        } else {
          this.product.sku[index].is_option_reference_price = "F";
        }
      });
    },
    /**
     * 새로운 품목 구매원가 입력 (CN)
     */
    setOriginalPrice(record) {
      this.product.sku.map((data, i) => {
        if (data.key === record.key) {
          // 구매원가 (중국화폐) 수정여부
          this.product.sku[i].editor = "T";

          //custom_selling_price
          this.product.sku[i].custom_selling_price = Number(this.product.sku[i].selling_price);

          let expected_return = (Number(this.product.sku[i].selling_price) - Number(this.product.sku[i].original_price_ko)).toFixed(0);
          this.product.sku[i].expected_return = Number(expected_return);
        }
      });
    },

    watchExpectedReturn(key, index) {
      //예상수익
      let expected_return = (Number(this.product.sku[index].selling_price) - Number(this.product.sku[index].original_price_ko)).toFixed(0);
      this.product.sku[index].expected_return = Number(expected_return);
    },

    handlerCustomPrice(key, index) {
      //자체입력으로 의한 가격 동기화(권장가, 판매가, 예상수익)
      if (key === "selling_price") {
        // 从 tempFormattedValues 中解析原始数字
        this.product.sku[index][key] = this.parseNumber(this.tempFormattedValues[`${index}_${key}`]); // 更新原始数据模型

        let sellingPrice = Number(this.product.sku[index][key]);
        let expected_return = (Number(sellingPrice) - Number(this.product.sku[index].original_price_ko)).toFixed(0);
        this.product.sku[index].expected_return = Number(expected_return);
      }
    },

    // 품목삭제
    deleteSku() {
      if (this.selectedRows.length === 0) {
        message.warning("선택된 품목이 없습니다.");
        return false;
      }
      if (this.selectedRows.length === this.product.sku.length) {
        message.warning("최소 한개의 품목은 보류해 주세요.");
        return false;
      }
      // this.product.sku 에서 this.selectedRows 에 있는것을 삭제
      this.product.sku  = this.product.sku.filter((data) => !this.selectedRows.includes(data));
      // 선택품목 초기화
      this.selectedRows = [];
      // 옵션기준가 품목이 삭제되면 처음거로 세팅
      const hasTrueOption = this.product.sku.some(skuItem => skuItem.is_option_reference_price === 'T');

      if (!hasTrueOption) {
        let index = 0;
        for (const skuItem of this.product.sku) {
          // 첨의 품목 skuItem만 T로 변경
          skuItem.is_option_reference_price = 'F';
          if (index === 0) {
            skuItem.is_option_reference_price = 'T';
          }
          index++;
        }
      }

      const use_pvs = [];
      for (const skuItem of this.product.sku) {
        if (skuItem.pvs.includes(';')) {
          // 如果包含分号，按分号分割字符串并循环插入数组
          const valuesArray = skuItem.pvs.split(';');
          for (const value of valuesArray) {
            use_pvs.push(value);
          }
        } else {
          // 如果不包含分号，直接插入数组
          use_pvs.push(skuItem.pvs);
        }
      }

      if (!Array.isArray(use_pvs) || use_pvs.length === 0) {
        return false;
      }

      // 使用 filter 过滤 item_option
      this.product.item_option = this.product.item_option.map(item => {
        // 过滤掉 data 中 key 包含在 use_pvs 中的项
        item.data = item.data.filter(dataItem => use_pvs.includes(dataItem.key));

        // 过滤掉 data 数组为空的项
        return item.data.length > 0 ? item : null;
      }).filter(Boolean);
    },

    // 일괄적용
    skuBatch() {
      this.product.sku.map((sku, i) => {
        this.sku_columns.map((columns) => {
          //custom price
          if (["selling_price"].includes(columns.key)) {
            this.product.sku[i]["custom_" + columns.key] = Number(this.product.sku[0]["custom_" + columns.key]);
          }
          //original_price_ko
          // if (["original_price_ko"].includes(columns.key)) {
          //   this.product.sku[i]["original_price_ko"] = Number(this.product.sku[0]["original_price_ko"]);
          // }
          if (!["checked", "code", "spec", "img", "is_option_reference_price", "original_price_cn"].includes(columns.key)) {
            this.product.sku[i][columns.key] = this.product.sku[0][columns.key];
            // this.product.sku[i].price_kor = this.product.sku[0].price_kor;
            this.product.sku[i].expected_return = (Number(this.product.sku[i].selling_price) - Number(this.product.sku[i].original_price_ko)).toFixed(0);
          }
        });
      });
    },

    // 이미지 선택 팝업 노출
    skuImageWindowVisible(key) {
      this.selected_sku_image_key = key;
      this.sku_image_window_visible = true;
    },

    // 이미지 선택 팝업에서 이미지 선택
    selectSkuImage(i, url) {
      this.selected_sku_image_index = i;
      this.selected_sku_image_url = url;
    },
    openPreview(url) {
      this.previewSrc = url;
      this.showPreview = true;
    },
    closePreview() {
      this.showPreview = false;
      this.previewSrc = '';
    },
    // 이미지 선택 팝업 확인
    skuImageWindowOk() {
      this.product.sku.map((data, i) => {
        if (data.key === this.selected_sku_image_key) {
          if (!this.selected_sku_image_url) {
            this.product.sku[i].img = this.product.item_thumbnails[0].url
          } else {
            this.product.sku[i].img = this.selected_sku_image_url;
          }

        }
      });

      this.sku_image_window_visible = false;
    },

    // 이미지 선택 팝업 취소
    skuImageWindowCancel() {
      this.selected_sku_image_key = 0;
      this.selected_sku_image_url = "";
      this.selected_sku_image_index = 0;
      this.sku_image_window_visible = false;
    },

    translatePopup(record, url = "") {
      // 변역완료된 상품은 편집
      // if (record.img.indexOf("https://i.tosoiot.com/") !== -1) {
      //   this.requestXiangji([url]);
      //
      //   return false;
      // }
      this.product.xiangjiVisible = true;
      this.product.bProductDetailsEditor = false;
      this.product.bProductImageEditor = false;
      this.product.bImageEditorModule = true;
      this.product.aPhotoCollection = [
        {
          msg: "",
          key: record.key,
          name: "",
          order: "",
          checked: true,
          visible: true,
          original_url: url,
          translate_url: "",
          translate_status: record.translate_status,
        },
      ];
      //this.productTranslateImage(this.product.aPhotoCollection, false)
    },
//상품이미지 번역
    productTranslateImage(aImagesInfo, isTranslate) {
      this.product.isTranslate = isTranslate
      this.product.translateImage(aImagesInfo, (oTranslateInfo) => {
        let sTranslateUrl = oTranslateInfo[aImagesInfo[0].key].translate_url;
        this.requestXiangji([sTranslateUrl]);
      });
    },
    // 이미지 편집
    requestXiangji(aImagesUrl) {
      this.product.requestXiangji(aImagesUrl, (oRequestId) => {
        Object.keys(oRequestId).map((sRequestId) => {
          this.product.sku.map((data, i) => {
            if (
                lib.isString(data.img, true) === true &&
                data.img.split("/").includes(sRequestId) === true
            ) {
              this.product.sku[i].img = oRequestId[sRequestId];
            }
          });
          // SKU 使用 SPEC 图片编辑时 同时 更新 SPEC 图片 (图片编辑器 只认ID 不认图片)
          this.product.item_thumbnails.map((data, i) => {
            if (
                lib.isString(data.url, true) === true &&
                data.url.split("/").includes(sRequestId) === true
            ) {
              this.product.item_thumbnails[i].url = oRequestId[sRequestId];
            }
          });
        });

        // 이미지 편집기 닫기
        this.product.bImageEditorModule = false;
        this.product.xiangjiVisible = false;
      });
    },

    // style
    css() {
      // sku table 需要改 ant vue 底层 css
      Object.values(
          document.querySelectorAll("#eModelTitle_3 th.ant-table-cell")
      ).map((el) => {
        if (el.tagName === "TH") {
          el.style.backgroundColor = "#fafafa";
          el.style.height = "33px";
          el.style.fontSize = "15px";
        }
        el.style.padding = "0";
        el.style.textAlign = "center";
      });
    },

    handleShippingFeeChange(val) {
      this.product.sku = this.product.sku.map(data => ({ ...data, shipping_fee_ko: val }));
    },

    setExpectedReturn() {
      this.product.sku.map((data, i) => {
        let expected_return = (Number(data.selling_price) - Number(data.original_price_ko)).toFixed(0);
        this.product.sku[i].expected_return = Number(expected_return);
      });
    },
    // 전체 마진자동셋팅
    shippingFeeInit() {

    },

    showOptionConPop(){
      this.$nextTick(() => {
        this.$store.commit('product/setShowOptionPreview', true)
      });
    },

    showOptionPop() {
      // D:\xampp81\htdocs\worldlink-front\src\store\modules\product.js 의  showOptionModify = true 로 설정
      this.$store.commit('product/setShowOptionModify', true);

      const repeats = document.getElementsByClassName("repeat");
      for (const el of repeats) {
        el.style.height = "auto";
      }
      nextTick(() => {
        let maxHeight = 0;
        const repeats = document.getElementsByClassName("repeat");
        for (const el of repeats) {
          maxHeight = Math.max(el.clientHeight, maxHeight);
        }
        for (const el of repeats) {
          el.style.height = maxHeight + "px";
        }
      });
    },

    // 옵션 초기화  (수집시 옵션으로)
    resetOption() {
      if (!this.product.item_org_sku|| !this.product.item_org_option || this.product.item_org_sku.length === 0 || !this.product.item_org_option.length === 0) {
        message.error('기존 상품은 옵션정보가 존재하지 않습니다.')
        return false;
      }
      const _this = this;
      Modal.confirm({
        title: '옵션정보를 초기화 하시겠습니까?',
        content: '편집된 옵션정보는 삭제되고 상품 수집시 옵션정보로 초기화됩니다.',
        onOk() {
          _this.product.item_option = cloneDeep(_this.product.item_org_option);
          // _this.product.sku = _this.product.item_org_sku;
          // #270 초기화하여도 이미지는 자동번역버전으로 보여줘야함
          if (_this.KrMarketList.includes(_this.product.item_market)) {
            _this.product.sku = _this.product.item_org_sku;
          }else {
            _this.product.sku = _this.product.item_org_sku.map((item, index) => {
              for (let i = 0; i < _this.product.item_option[0].data.length; i++) {
                if (item.pvs.includes(_this.product.item_option[0].data[i].key)) {
                  item.img = _this.product.item_option[0].data[i].img;
                  break;
                }
              }
              return item;
            });
          }
          _this.selectedRowKeys = [];
          _this.selectedRows = [];
          _this.handleShippingFeeChange(_this.product.item_shipping_fee);
          _this.setExpectedReturn();
          _this.product.resetOption = true;

          // 重置排序顺序和列高亮
          _this.sortOrder = null;
          _this.sortColumn = null;
          _this.sku_columns.filter((item) => {
            if (item.key === 'selling_price') {
              item.sortColumn = _this.sortColumn
              item.sortOrder = _this.sortOrder;
            }
          });
          message.success('옵션정보가 초기화 되었습니다.')
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() {},
      });
    },

    handleRowSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },

    formatNumber(value) {
      const number = Number(value);
      return !isNaN(number) ? number.toLocaleString() : '';
    },

    changeSellingPrice(){
      if (Number(this.item_price_change_value) === 0) {
        return false;
      }
      this.product.sku.forEach((sku,index) => {
        if (this.item_price_change_type === 'add') {
          sku.selling_price = Number(sku.selling_price) + Number(this.item_price_change_value);
        } else  {
          sku.selling_price = Number(sku.selling_price) - Number(this.item_price_change_value);
          if (sku.selling_price < 0) {
            sku.selling_price = 0;
          }
        }
        this.watchExpectedReturn('selling_price', index)
      });
    },
    translateImg(record) {
      this.translateSkuCode = record.code;
      let aImagesUrl = [
        {url: record.img}
      ];
      let imgList =aImagesUrl.map((item,index)=>{
        let tmp = [];
        tmp['checked'] = false;
        if(index == 0){
          tmp['checked'] = true;
        }
        tmp['order'] = index;
        tmp['request_id'] = '';
        tmp['url'] = item['url'];
        let pos = item['url'].indexOf('request_id');
        if(pos != -1){
          tmp['request_id'] = item['url'].slice(pos+11);
          tmp['url'] = item['url'].slice(0,pos-1);
        }
        return tmp;
      })
      this.$refs.imageTranslateTools.translateImage({isTranslate: false,type: 1,imglist:imgList},()=>{
        this.imageTranslateToolsVisible = true;
      });
    },
    updateTranslateImageList(imageList) {
      this.product.sku.map(v=>{
        if(v.code == this.translateSkuCode){
          v.img = imageList[0].url;
          if (imageList[0].translate_status === true) {
            v.img = imageList[0].translate_url;
          }
        }
      });
    },
    //获取图片requestIds
    getRequestIds(){
      this.$refs.imageTranslateTools.translateImage({isTranslate: false,type: 1,imglist:[]});
    },

    sortData(data) {
      if (!this.sortColumn || !this.sortOrder) return data;
      const sortedData = [...data].sort((a, b) => {
        const result = a[this.sortColumn] - b[this.sortColumn];
        return this.sortOrder === 'ascend' ? result : -result;
      });
      return sortedData;
    },

    skuTableChange(pagination, filters, sorter) {
      this.sortColumn = sorter.columnKey;
      this.sortOrder = sorter.order;

      this.sku_columns.filter((item) => {
        if (item.key === 'selling_price') {
          item.sortColumn = sorter.columnKey;
          item.sortOrder = sorter.order;
        }
      });
    },

  },

  mounted() {
    this.css();
    this.shippingFeeInit();
    //예상수익
    this.handleShippingFeeChange(this.product.item_shipping_fee);
    this.setExpectedReturn();

    this.rowSelection = {
      onChange: this.handleRowSelectionChange,
      onSelect: this.handleRowSelect,
      onSelectAll: this.handleSelectAll,
    };
  },
});
</script>

<style scoped>

.ant-input-affix-wrapper{
  border:1px solid #f1f1f1;
}

.ant-radio-wrapper {
  position: relative;;
  height: 17px;
  border-radius: 100%;
}

.ant-radio-inner {
  cursor: pointer;
  position: absolute;
  top: 2px;
  left: 2px;
  display: inline-block;
  width: 12px;
  height: 12px;
}

.ant-radio-inner:after{
  content:"";
  top: 7px;
  left: 7px;
  box-sizing: border-box;
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  display: block;
  width: 12px;
  height: 12px;
  margin-block-start: -8px;
  margin-inline-start: -8px;
  background-color: #fff;
  border-block-start: 0;
  border-inline-start: 0;
  border-radius: 16px;
  border: 1px solid #ccc;
}

.ant-radio {
  display: inline-block;
  position: absolute;
  top: 4px;
  left: 7px;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 100%;
}

.ant-radio.ant-radio-checked {
  background: #ffd117;
}

.ant-radio.ant-radio-checked .ant-radio-inner:after{
  transform: scale(0.375);
  opacity: 1;
  transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  border:none;
}

.top_button_container {
  height: 38px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.price_setting .ant-input-number-group-wrapper{
  width:79% !important;
}

.price-setting-table .add{
  margin-left:8px;
}

:deep(.ant-input-group.ant-input-group-compact) > .ant-select >.ant-select-selector{
  border-radius:6px !important;
}

.ant-input-group.ant-input-group-compact>*:last-child{
  margin-left:5px;
  border-end-start-radius: 6px;
  border-start-start-radius: 6px;
}


.top_button_left_item {
  display: flex;
  justify-content: space-between;
}

.sku_window_image {
  margin: 3px;
  width: 100px;
  height: 120px;
}

.sku_window_image.checkedEl {
  border: 2px solid #1890ff;
}

.sku_window_image.checkedNot {
  border: 2px solid #eee;
}

.sku_image {
  width: 100px;
  height: 100px;
}

.sku_image_button {
  width: 100px;
  height: 30px;
}

.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.preview-overlay img {
  max-width: 80%;
  max-height: 80%;
}

.popoverTable {
  width: 100%;
  border-collapse: collapse;
}

.popoverTable th {
  background-color: #f5f5f5;
  padding: 5px;
  text-align: center;
}

.popoverTable td {
  padding: 5px;
}

.price-setting-table {
  border-collapse: collapse;
  background-color: #fafafa;
  width: 100%;
  border-top:1px solid #f1f1f1;
  border-bottom:1px solid #f1f1f1;
}


.price-setting-table th {
  text-align: left;
  padding: 10px 15px;
  font-weight: bold;
  color: #666;
}

.price-setting-table td {
  padding: 10px 20px;
}

.ant-btn-primary.reset{
  color:#fff;
  background-color: #2171e2;
}

.image-pic{
  position:relative;
}

.image-pic button{
  position:absolute;
  bottom:0;
  right:5px;
  color:#fff;
  border:unset;
  background:#4C73D8;
}

.image-pic .ant-btn{
  height:23px;
  padding:1px 5px;
  border-radius: 0;
}


.barcode{
  margin:10px 0;
}
.barcode-option-height{
  line-height:18px;
}

:deep(.ant-table-wrapper .ant-table-thead) > tr > th,
:deep(.ant-table-wrapper .ant-table.ant-table-bordered) > .ant-table-container > .ant-table-content > table > tbody > tr > td {
  border-inline-end:none !important;
}

:deep(.ant-table-wrapper .ant-table.ant-table-bordered) > .ant-table-container {
  border-inline-start:none;
  border-radius:0;
}

:deep(.ant-table-wrapper .ant-table-container table) > thead > tr:first-child > *:last-child {
  border-start-end-radius:0;
}

:deep(.ant-table-wrapper .ant-table-container table) > thead > tr:first-child > *:first-child {
  border-start-start-radius:0;
}

:deep(.ant-table-wrapper .ant-table.ant-table-bordered) > .ant-table-container > .ant-table-content > table {
  border-top:2px solid #f0f0f0;
  border-radius:0;
}

.table-scroll-container{
  max-height: 500px;
  overflow-y: auto;
}

:deep(.ant-table-selection-column) {
  width:1%;
  height:50px !important;
}

:deep(.ant-table-thead) {
  position:sticky;
  top:0;
  z-index:1;
}

:deep(.ant-table-cell:nth-child(4)),
:deep(.ant-table-cell:nth-child(6)){
  text-align: -webkit-center;
}
.big-img-wrap{
  position: relative;
}
.big-img-wrap .big-img{
  width: 800px;
  height: 850px;
  position: fixed;
  z-index: 99;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}
.big-img-wrap:hover .big-img{
  display: block;
}

:deep .ant-table-wrapper .ant-table-column-sorters {
  padding: 0 55px;
}
</style>
