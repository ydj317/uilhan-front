<template>
  <div v-if="product.loading" style="display: flex;justify-content: center;align-items:center;min-height: 300px">
    <a-spin v-if="product.loading" size="large"/>
  </div>
  <div v-else id="eModelTitle_3" class="mt20 p20 bg-white">
    <h3><strong>옵션정보</strong></h3>
    <!--sku 상단 버튼-->
    <div class="top_button_container" style="display: flex;justify-content: space-between;">
      <!--sku 상단 left 버튼-->
      <div class="top_button_left_item" style="display: flex;gap: 10px;align-items: center">
        <!--일괄적용-->
        <a-popconfirm title="첫번째 품목값으로 일괄적용하시겠습니까?(재고, 구매원가, 판매가)" @confirm="skuBatch">
          <a-button>일괄적용</a-button>
        </a-popconfirm>
        <!--품목삭제-->
        <a-button @click="deleteSku" :disabled="product.is_sync === 'T'">품목삭제</a-button>
        <a-divider type="vertical"></a-divider>
        <div style="display: flex;gap: 5px">
          <a-input-group compact>
          <a-select v-model:value="setting_price_type">
            <a-select-option value="min_price">옵션가 기준 50%</a-select-option>
          </a-select>
          <a-button type="primary" @click="settingSkuPrice">적용</a-button>
          </a-input-group>

          <a-tooltip class="ml5">
            <template #title>
              <div>옵션가 50%±허용 범위를 벗어 나는 옵션들을 자동으로 비활성화 합니다.</div>
            </template>
            <QuestionCircleOutlined/>
          </a-tooltip>
        </div>
      </div>

      <!--sku 상단 right 버튼-->
      <div class="row" style="display: flex;flex-direction: column;gap: 10px;">

        <div>
          <a-space>
            <a-tooltip>
              <template #title>
                <div>무료배송 박스 체크 시 배송비를 상품 판매가 내 추가하여 등록 할 수 있는 기능입니다.</div>
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
                  쿠팡 배송비 정책 자세히 보러가기 (삼각형 클릭)
                  <a-button type="link">▶</a-button>
                </a-popover>
              </template>
              <QuestionCircleOutlined/>
            </a-tooltip>
            <a-checkbox v-model:checked="product.item_is_free_delivery" @change="handleShippingFeeDeliveryChange">
              무료 배송
            </a-checkbox>
            <a-input-number v-model:value.number="product.item_shipping_fee" placeholder="배송비 입력" :step="1000"
                            :min="0" style="width: 80px" @change="handleShippingFeeChange"/>
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
    <div>
      <a-table
          :bordered="true"
          :columns="sku_columns"
          :pagination="sku_pagination"
          :data-source="this.product.sku"
      >
        <!--bodyCell-->
        <template v-slot:bodyCell="{ record, column, index }">
          <!--선택-->
          <template v-if="column.key === 'checked'">
            <div class="center">
              <a-checkbox v-model:checked="record.checked" :disabled="product.is_sync === 'T'"></a-checkbox>
            </div>
          </template>

          <!--이미지-->
          <template v-else-if="column.key === 'img'">
            <div class="col center">
              <div>
                <img
                    class="sku_image"
                    alt=""
                    v-if="record.img"
                    :src="record.img"
                    @click="translatePopup(record, record.img)"
                />
              </div>
              <a-button
                  class="sku_image_button"
                  @click="skuImageWindowVisible(record.key)"
              >선택
              </a-button>
            </div>
          </template>

          <!--품목코드-->
          <template v-else-if="column.key === 'code'">
            <div class="center">
              {{ record.code }}
            </div>
            <div class="center pt5">
              <a-input
                  class="w90"
                  :style="
                  record.img
                    ? `height: 30px; text-align: center; border: none;`
                    : `height: 30px; text-align: center; border: none;`
                " v-model:value="record['barcode']"
              />
            </div>
          </template>

          <template v-else-if="column.key === 'is_option_reference_price'">
            <div class="center">
              <label class="ant-radio-wrapper" :class="{'ant-radio-wrapper-checked': record.is_option_reference_price === 'T' }">
                <span class="ant-radio" :class="{'ant-radio-checked': record.is_option_reference_price === 'T' }">
                  <span class="ant-radio-inner" @click="setIsOptionReferencePrice(record.key)"></span>
                </span>
              </label>
            </div>
          </template>

          <!--스펙-->
          <template v-else-if="column.key === 'spec'">
            <div class="center" :style="record.spec.length > 20 ? 'color: red' : ''">
              {{ record.spec }}
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
              <span>{{ record.original_price_ko }}</span>
              <div style="position: absolute;top: 20px;">
                <sub><span style="color: #999999">{{ record.original_price_cn }}위안</span></sub>
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

          <!--입력-->
          <template
              v-else-if="['stock', 'shipping_fee_cn'].includes(column.key)"
          >
            <a-input
                :style="
                record.img
                  ? `height: 30px; text-align: center; border: none;`
                  : `height: 30px; text-align: center; border: none;`
              "
                @blur="handlerShippingFee(column.key, index)"
                v-model:value="record[column.key]"
            />
          </template>

          <!-- 판매가 -->
          <template v-else-if="column.key === 'selling_price'">
            <a-input
                :style="
                  record.img
                    ? `height: 30px; text-align: center; border: none;`
                    : `height: 30px; text-align: center; border: none;`
                "
                @blur="handlerCustomPrice(column.key, index)"
                v-model:value="record[column.key]"
            />
            <div v-if="isManager"
                 :style="`text-align: center; border: none;`"
            >
              <div v-if="record.selling_price_cn > 0">
                <sub><span style="color: #999999">{{ record.selling_price_cn }}위안</span></sub>
              </div>
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
            >
              {{ record[column.key] }}
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import {mapState, useStore} from "vuex";
import {lib} from "@/util/lib";
import {forEach} from "lodash";
import {message} from "ant-design-vue";
import {computed, reactive, ref, defineComponent} from "vue";
import {QuestionCircleOutlined} from "@ant-design/icons-vue";

export default defineComponent({
  name: "productDetailSku",
  components: {QuestionCircleOutlined},

  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    }),
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
          title: "선택",
          key: "checked",
          width: "1%",
        },
        {
          title: "옵션이미지",
          key: "img",
          width: "1%",
        },
        {
          title: "옵션가 기준",
          key: "is_option_reference_price",
          width: "6%",
        },
        {
          title: "품목코드 / 바코드",
          key: "code",
          width: "12%",
        },
        {
          title: "옵션명",
          key: "spec",
          width: "18%",
        },
        {
          title: "재고/개",
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
      sku_pagination: {
        total: 0,
        defaultPageSize: 10,
        // showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize),
      },
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

    handlerShippingFee(key, index) {

      //예상수익
      let expected_return = (Number(this.product.sku[index].selling_price) - Number(this.product.sku[index].original_price_ko)).toFixed(0);
      this.product.sku[index].expected_return = Number(expected_return);
    },

    handlerCustomPrice(key, index) {
      //자체입력으로 의한 가격 동기화(권장가, 판매가, 예상수익)
      if (key === "selling_price") {
        let sellingPrice = Number(this.product.sku[index][key]);
        let expected_return = (Number(sellingPrice) - Number(this.product.sku[index].original_price_ko)).toFixed(0);
        this.product.sku[index].expected_return = Number(expected_return);
      }
    },

    // 품목삭제
    deleteSku() {
      if (
          !lib.isArray(
              this.product.sku.filter((data) => data.checked === true),
              true
          )
      ) {
        message.warning("선택된 품목이 없습니다.");
        return false;
      }

      // 삭제
      this.product.sku = this.product.sku.filter(
          (data) => data.checked !== true
      );

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
          if (["original_price_ko"].includes(columns.key)) {
            this.product.sku[i]["original_price_ko"] = Number(this.product.sku[0]["original_price_ko"]);
          }
          if (!["checked", "code", "spec", "img", "is_option_reference_price"].includes(columns.key)) {
            this.product.sku[i][columns.key] = this.product.sku[0][columns.key];
            // this.product.sku[i].price_kor = this.product.sku[0].price_kor;
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
      this.productTranslateImage(this.product.aPhotoCollection, false)
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
          el.style.backgroundColor = "#f7fdff";
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

    handleShippingFeeDeliveryChange() {
      if (this.product.item_is_free_delivery) {
        message.warn('배송비가 판매가에 적용됩니다.');
      } else {
        message.warn('배송비가 운임에 적용됩니다.');
      }
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
    isManager() {
      return ['jwli', 'irunkorea_02', 'haeju'].includes(lib.getCookie("member_name"));
    }
  },

  mounted() {
    this.css();
    this.shippingFeeInit();
    //예상수익
    this.handleShippingFeeChange(this.product.item_shipping_fee);
    this.setExpectedReturn();
  },
});
</script>

<style scoped>
.ant-radio-wrapper {
  position: relative;;
  border: 1px solid #ccc;
  width: 17px;
  height: 17px;
  border-radius: 100%;
}
.ant-radio-wrapper.ant-radio-wrapper-checked {
  border: 1px solid #ffd117;
}

.ant-radio-inner {
  cursor: pointer;
  position: absolute;
  top: -5px;
  left: -5px;
  display: inline-block;
  width: 17px;
  height: 17px;
}

.ant-radio {
  display: inline-block;
  position: absolute;
  top: 4px;
  left: 4px;
  width: 7px;
  height: 7px;
  background: #ccc;
  border-radius: 100%;
}
.ant-radio.ant-radio-checked {
  background: #ffd117;
}

.top_button_container {
  height: 38px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
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

</style>
