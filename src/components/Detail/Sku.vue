<template>
  <div id="eModelTitle_3" class="mt20 p20 bg-white">
    <h1><strong>품목정보</strong></h1>
    <!--sku 상단 버튼-->
    <div class="top_button_container" style="display: flex;justify-content: space-between;">
      <!--sku 상단 left 버튼-->
      <div class="top_button_left_item">
        <!--일괄적용-->
        <a-popconfirm title="첫번째 품목값으로 일괄적용하시겠습니까?(재고, 구매원가, 해외운임, 권장가, 판매가)" @confirm="skuBatch">
          <a-button>일괄적용</a-button>
        </a-popconfirm>
        <!--품목삭제-->
        <a-button @click="deleteSku">품목삭제</a-button>
      </div>

      <!--sku 상단 right 버튼-->
      <div class="row" style="display: flex;flex-direction: column;gap: 10px;">
        <!--도매마진-->
        <div class="row right" v-if="false">
          <a-input-group compact>
            <a-select
              class="top_button_right_item_select mr5"
              :options="this.product.wholesale_margin"
              v-model:value="this.product.wholesale_margin_option"
            >
            </a-select>
            <a-button type="primary" @click="setWholesaleMargin">도매마진</a-button>
          </a-input-group>
        </div>

        <!--판매마진-->
        <div class="row right">
          <a-input-group compact>
            <a-select
              class="top_button_right_item_select"
              :options="this.product.selling_margin"
              v-model:value="this.product.selling_margin_option"
            >
            </a-select>
            <a-popconfirm title="판매마진을 수정하시겠습니까? 입력하신 판매가가 수정됩니다." @confirm="setSellingMargin('click')">
              <a-button type="primary" style="border-top-left-radius: unset;border-bottom-left-radius: unset">판매마진</a-button>
            </a-popconfirm>
          </a-input-group>
        </div>

        <!--할인마진-->
        <div class="row right">
          <a-input-group compact>
            <a-select
              class="top_button_right_item_select"
              :options="this.product.disp_margin"
              v-model:value="this.product.disp_margin_option"
            >
            </a-select>
            <a-popconfirm title="권장가를 수정하시겠습니까? 입력하신 권장가가 수정됩니다." @confirm="setDispMargin('click')">
              <a-button type="primary" style="border-top-left-radius: unset;border-bottom-left-radius: unset">권장가</a-button>
            </a-popconfirm>
          </a-input-group>
        </div>

        <!--환율-->
        <div class="row right">
          <a-input-group compact>
            <a-select
              class="top_button_right_item_select"
              :options="this.product.rate_margin"
              v-model:value="this.product.rate_margin_option"
            >
            </a-select>
            <a-popconfirm title="환율을 수정하시겠습니까?" @confirm="setRateMargin">
              <a-button type="primary" style="border-top-left-radius: unset;border-bottom-left-radius: unset">환율</a-button>
            </a-popconfirm>
          </a-input-group>
        </div>
      </div>
    </div>

    <!--이미지 선택 팝업-->
    <div>
      <a-modal
        title="품목 이미지선택"
        @ok="skuImageWindowOk"
        @cancel="skuImageWindowCancel"
        v-model:visible="sku_image_window_visible"
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
        <img :src="previewSrc" alt="Preview Image" />
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
              <a-checkbox v-model:checked="record.checked"></a-checkbox>
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

          <template v-else-if="column.key === 'is_option_reference_price'">
            <div class="center">
              <label class="ant-radio-wrapper" :class="{'ant-radio-wrapper-checked': option_reference_price_key === record.key}">
              <span class="ant-radio" :class="{'ant-radio-checked': option_reference_price_key === record.key}">
                <input @change="setIsOptionReferencePrice" type="radio" v-model="option_reference_price_key" :value="record.key" class="ant-radio-input">
                <span class="ant-radio-inner"></span>
              </span>
              </label>
            </div>
          </template>

          <!--스펙-->
          <template v-else-if="column.key === 'spec'">
            <div
              class="center"
              :style="record.spec.length > 20 ? 'color: red' : ''"
            >
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
            <div v-if="record.original_price_cn === 0 || record.editor === 'T'"  style="border: 1px solid red">
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

          <!--자체가격입력(custom)-->
          <template v-else-if="['wholesale_price', 'selling_price', 'disp_price'].includes(column.key)">
            <a-input @blur="handlerCustomPrice(column.key, index)" :style="
                record.img
                  ? `height: 30px; text-align: center; border: none;`
                  : `height: 30px; text-align: center; border: none;`
              " v-model:value="record['custom_' + column.key]" />
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
import { mapState } from "vuex";
import { lib } from "@/util/lib";
import { forEach } from "lodash";
import { message } from "ant-design-vue";

export default {
  name: "productDetailSku",

  computed: {
    ...mapState(["product"]),
  },

  data() {
    return {
      selected_sku_image_key: 0,
      selected_sku_image_url: "",
      selected_sku_image_index: 0,
      sku_image_window_visible: false,
      option_reference_price_key: "",
      showPreview: false,
      previewSrc: '',
      sku_columns: [
        {
          title: "선택",
          key: "checked",
          width: "1%",
        },
        {
          title: "품목이미지",
          key: "img",
          width: "1%",
        },
        {
          title: "품목가 기준",
          key: "is_option_reference_price",
          width: "6%",
        },
        {
          title: "품목코드",
          key: "code",
          width: "12%",
        },
        {
          title: "품목명",
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
          title: "해외운임/원",
          key: "shipping_fee_cn", // 기본 0, 별도 기입
          width: "8%",
        },
        // {
        //   title: "도매가",
        //   key: "wholesale_price", // (구매원가+중국내 운임)*도매마진
        //   width: "9%",
        // },
        {
          title: "권장가/원",
          key: "disp_price", // 할인가*할인전 가격설정
          width: "8%",
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
    setIsOptionReferencePrice() {
      forEach(this.product.sku, (item, index) => {
        if (item.key === this.option_reference_price_key) {
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

          // 구매원가 (한국화폐)
          this.product.sku[i].original_price_ko =
            Math.ceil(
              Number(
                record["original_price_cn"] *
                Number(this.product.rate_margin_option)
              ) / 100
            ) * 100;

          // 도매가
          let wholesale_price = (
            (Number(data["original_price_cn"]) +
              Number(data["shipping_fee_cn"])) *
            (1 + Number(this.product["wholesale_margin_option"]) / 100) *
            Number(this.product.rate_margin_option)
          ).toFixed(0);
          this.product.sku[i].wholesale_price =
            Math.ceil(Number(wholesale_price) / 100) * 100;

          // 판매가
          let selling_price = (
            (Number(data["original_price_cn"]) +
              Number(data["shipping_fee_cn"])) *
            (1 + Number(this.product["selling_margin_option"]) / 100) *
            Number(this.product.rate_margin_option)
          ).toFixed(0);
          this.product.sku[i].selling_price =
            Math.ceil(Number(selling_price) / 100) * 100;
          //custom_selling_price
          this.product.sku[i].custom_selling_price = Number(this.product.sku[i].selling_price);

          let expected_return = (Number(this.product.sku[i].selling_price) - Number(this.product.sku[i].original_price_ko) - Number(this.product.sku[i].selling_price) * 0.12).toFixed(0);
          this.product.sku[i].expected_return = Number(expected_return);

          // 할인가
          let disp_price = (
            (Number(data["original_price_cn"]) +
              Number(data["shipping_fee_cn"])) *
            (1 + Number(this.product["selling_margin_option"]) / 100) *
            (1 + Number(this.product["disp_margin_option"]) / 100) *
            Number(this.product.rate_margin_option)
          ).toFixed(0);
          this.product.sku[i].disp_price =
            Math.ceil(Number(disp_price) / 100) * 100;
          //custom_disp_price
          this.product.sku[i].custom_disp_price = Number(this.product.sku[i].disp_price);
        }
      });
    },

    /**
     * 도매마진율 설정
     * 도매가 = ( 구매원가 + 중국내 운임 ) * 도매마진율
     * sku[i].original_price = ( sku[i].original_price + sku[i].shipping_fee_cn ) * user.wholesale_margin
     */
    setWholesaleMargin() {
      this.product.sku.map((data, i) => {
        let wholesale_price = (
          (Number(data["original_price_cn"]) +
            Number(data["shipping_fee_cn"])) *
          (1 + Number(this.product["wholesale_margin_option"]) / 100) *
          Number(this.product.rate_margin_option)
        ).toFixed(0);
        this.product.sku[i].wholesale_price =
          Math.ceil(Number(wholesale_price) / 100) * 100;
      });
      this.product.item_wholesale_margin_option =
        this.product.wholesale_margin_option;
    },

    /**
     * 판매마진율 설정
     * 판매가 = ( 구매원가 + 중국내 운임 ) * 판매마진율
     * sku[i].selling_price = ( sku[i].original_price + sku[i].shipping_fee_cn ) * user.selling_margin
     */
    setSellingMargin(type) {
      this.product.sku.map((data, i) => {
        let selling_price = (
          (Number(data["original_price_cn"]) +
            Number(data["shipping_fee_cn"])) *
          (1 + Number(this.product["selling_margin_option"]) / 100) *
          Number(this.product.rate_margin_option)
        ).toFixed(0);
        this.product.sku[i].selling_price =
          Math.ceil(Number(selling_price) / 100) * 100;
        if (type === "click") {
          this.product.sku[i].custom_selling_price = Number(this.product.sku[i].selling_price);
        }
      });
      if (type === "click") {
        this.setExpectedReturn();
      }
      this.product.item_selling_margin_option =
        this.product.selling_margin_option;
    },

    /**
     * 할인마진율 설정
     * 할인가 = 할인가 * 할인마진율
     * sku[i].disp_price = sku[i].selling_price * user.disp_margin
     */
    setDispMargin(type) {
      this.product.sku.map((data, i) => {
        let disp_price = (
          (Number(data["original_price_cn"]) +
            Number(data["shipping_fee_cn"])) *
          (1 + Number(this.product["selling_margin_option"]) / 100) *
          (1 + Number(this.product["disp_margin_option"]) / 100) *
          Number(this.product.rate_margin_option)
        ).toFixed(0);
        this.product.sku[i].disp_price =
          Math.ceil(Number(disp_price) / 100) * 100;
        if (type === "click") {
          this.product.sku[i].custom_disp_price = Number(this.product.sku[i].disp_price);
        }
      });
      this.product.item_disp_margin_option = this.product.disp_margin_option;
    },
    handlerShippingFee(key, index) {
      if (["shipping_fee_cn"].includes(key)) {
        let original_price_cn = this.product.sku[index]["original_price_cn"];
        let shipping_fee_cn = this.product.sku[index]["shipping_fee_cn"];
        //도매가
        let wholesale_price = (
          (Number(original_price_cn) +
            Number(shipping_fee_cn)) *
          (1 + Number(this.product["wholesale_margin_option"]) / 100) *
          Number(this.product.rate_margin_option)
        ).toFixed(0);
        this.product.sku[index].wholesale_price =
          Math.ceil(Number(wholesale_price) / 100) * 100;

        //disp_price
        let disp_price = (
          (Number(original_price_cn) +
            Number(shipping_fee_cn)) *
          (1 + Number(this.product["selling_margin_option"]) / 100) *
          (1 + Number(this.product["disp_margin_option"]) / 100) *
          Number(this.product.rate_margin_option)
        ).toFixed(0);
        this.product.sku[index].disp_price =
          Math.ceil(Number(disp_price) / 100) * 100;
        this.product.sku[index].custom_disp_price = Number(this.product.sku[index].disp_price);

        //selling_price
        let selling_price = (
          (Number(original_price_cn) +
            Number(shipping_fee_cn)) *
          (1 + Number(this.product["selling_margin_option"]) / 100) *
          Number(this.product.rate_margin_option)
        ).toFixed(0);
        this.product.sku[index].selling_price =
          Math.ceil(Number(selling_price) / 100) * 100;
        this.product.sku[index].custom_selling_price = Number(this.product.sku[index].selling_price);

        //예상수익
        let expected_return = (Number(this.product.sku[index].selling_price) - Number(this.product.sku[index].original_price_ko) - Number(this.product.sku[index].selling_price) * 0.12).toFixed(0);
        this.product.sku[index].expected_return = Number(expected_return);
      }
    },
    handlerCustomPrice(key, index) {
      //자체입력으로 의한 가격 동기화(권장가, 판매가, 예상수익)
      if (["selling_price", "disp_price"].includes(key)) {
        //가격 동기화
        this.product.sku[index][key] = Number(this.product.sku[index]["custom_" + key]);
        //예상수익 셋팅
        if (key === "selling_price") {
          let sellingPrice = Number(this.product.sku[index][key]);
          let expected_return = (Number(sellingPrice) - Number(this.product.sku[index].original_price_ko) - Number(sellingPrice) * 0.12).toFixed(0);
          this.product.sku[index].expected_return = Number(expected_return);
        }
      }
    },

    /**
     * 환율 설정
     * 도매가 = 도매가 * 환율마진율
     * sku[i].wholesale_price = sku[i].wholesale_price * 선택한 환율
     */
    setRateMargin() {
      this.setWholesaleMargin();
      this.setSellingMargin();
      this.setDispMargin();
      this.setCustomPrice(false);
      this.setExpectedReturn();
      this.product.item_rate_margin_option = this.product.rate_margin_option;
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
    },

    // 일괄적용
    skuBatch() {
      this.product.sku.map((sku, i) => {
        this.sku_columns.map((columns) => {
          //custom price
          if (["selling_price", "disp_price"].includes(columns.key)) {
            this.product.sku[i]["custom_" + columns.key] = Number(this.product.sku[0]["custom_" +  columns.key]);
          }
          //original_price_ko
          if (["original_price_cn"].includes(columns.key)) {
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
          if(!this.selected_sku_image_url){
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
          translate_status: false,
        },
      ];
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

    // 전체 마진자동셋팅
    marginInit() {
      if (this.product.is_modify === "T") {
        //custom price 동기화
        this.setCustomPrice(true);
        return false;
      }

      this.setWholesaleMargin();
      this.setSellingMargin();
      this.setDispMargin();
      //custom price 동기화
      this.setCustomPrice(true);
    },
    /**
     * setCustomPrice
     * bInit true(가격 초기화) false(액션시 가격 동기화)
     *
     * @param bInit
     */
    setCustomPrice(bInit) {
      this.product.sku.map((data, i) => {
        if (bInit === true) {
          if (this.product.sku[i].custom_selling_price === null) {
            this.product.sku[i].custom_selling_price = Number(this.product.sku[i].selling_price);
          } else {
            this.product.sku[i].selling_price = Number(this.product.sku[i].custom_selling_price);
          }
          if (this.product.sku[i].custom_disp_price === null) {
            this.product.sku[i].custom_disp_price = Number(this.product.sku[i].disp_price);
          } else {
            this.product.sku[i].disp_price = Number(this.product.sku[i].custom_disp_price);
          }
        } else {
          //custom 가격 셋팅
          this.product.sku[i].custom_selling_price = Number(this.product.sku[i].selling_price);
          this.product.sku[i].custom_disp_price = Number(this.product.sku[i].disp_price);
        }
      });
    },
    setExpectedReturn() {
      this.product.sku.map((data, i) => {
        let expected_return = (Number(data.selling_price) - Number(data.original_price_ko) - Number(data.selling_price) * 0.12).toFixed(0);
        this.product.sku[i].expected_return = Number(expected_return);
      });
    }
  },

  mounted() {
    this.css();
    this.marginInit();
    //예상수익
    this.setExpectedReturn();
  },
  created() {
    forEach(this.product.sku, (item) => {
      if (item?.is_option_reference_price === "T") {
        this.option_reference_price_key = item.key;
      }
    });
  }
};
</script>

<style scoped>
.top_button_container {
  height: 38px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.top_button_left_item {
  width: 180px;
  display: flex;
  justify-content: space-between;
}

.top_button_left_item_button {
  background-color: #f06543;
  color: white;
  border: none;
  border-radius: 5px;
}

.top_button_left_item_button:first-child {
  background-color: #3ddc97;
}

.top_button_right_item_button {
  background-color: #3ddc97;
  color: white;
  border: none;
  border-radius: 5px;
}

.top_button_right_item_select {
  width: 140px;
  color: #3051d3;
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
</style>
