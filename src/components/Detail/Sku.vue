<template>
  <div id="eModelTitle_3" class="mt20 p20 bg-white">
    <!--sku 상단 버튼-->
    <div class="top_button_container">
      <!--sku 상단 left 버튼-->
      <div class="top_button_left_item">
        <!--일괄적용-->
        <a-button class="top_button_left_item_button" @click="skuBatch"
          >일괄적용
        </a-button>
        <!--품목삭제-->
        <a-button class="top_button_left_item_button" @click="deleteSku"
          >품목삭제
        </a-button>
      </div>

      <!--sku 상단 right 버튼-->
      <div class="w63 row">
        <!--도매마진-->
        <div class="w33 row right">
          <a-select
            class="top_button_right_item_select mr5"
            :options="this.product.wholesale_margin"
            v-model:value="this.product.wholesale_margin_option"
          >
          </a-select>
          <a-button
            class="top_button_right_item_button"
            @click="setWholesaleMargin"
            >도매마진
          </a-button>
        </div>

        <!--판매마진-->
        <div class="w33 row right">
          <a-select
            class="top_button_right_item_select mr5"
            :options="this.product.selling_margin"
            v-model:value="this.product.selling_margin_option"
          >
          </a-select>
          <a-button
            class="top_button_right_item_button"
            @click="setSellingMargin"
            >판매마진
          </a-button>
        </div>

        <!--할인마진-->
        <div class="w31 row right">
          <a-select
            class="top_button_right_item_select mr5"
            :options="this.product.disp_margin"
            v-model:value="this.product.disp_margin_option"
          >
          </a-select>
          <a-button class="top_button_right_item_button" @click="setDispMargin"
            >할인전
          </a-button>
        </div>

        <!--환율-->
        <div class="w29 row right">
          <a-select
            class="top_button_right_item_select mr5"
            :options="this.product.rate_margin"
            v-model:value="this.product.rate_margin_option"
          >
          </a-select>
          <a-button class="top_button_right_item_button" @click="setRateMargin"
            >환율
          </a-button>
        </div>
      </div>
    </div>

    <!--이미지 선택 팝업-->
    <div>
      <a-modal
        title="Sku 이미지선택"
        @ok="skuImageWindowOk"
        @cancel="skuImageWindowCancel"
        v-model:visible="sku_image_window_visible"
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
        />
      </a-modal>
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
        <template v-slot:bodyCell="{ record, column }">
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
            <div style="border: 1px solid red"
              v-if="record.original_price_cn > 0 && record.editor !== 'T'"
              class="center"
              :style="
                record.img
                  ? `height: 30px; text-align: center; border: none;`
                  : `height: 30px; text-align: center; border: none;`
              "
            >
              <span>{{ record.original_price_ko }}</span
              ><span> (CNY {{ record.original_price_cn }})</span>
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
              @blur="setRateMargin"
              v-model:value="record[column.key]"
            />
          </template>

          <!--자체가격입력(custom)-->
          <template v-else-if="['wholesale_price', 'selling_price', 'disp_price'].includes(column.key)">
            <div style="height: 30px; text-align: center; border: none;">{{ record[column.key] }}</div>
            <a-input :style="'height: 30px; text-align: center;'" v-model:value="record['custom_' + column.key]" />
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
          title: "옵션코드",
          key: "code",
          width: "15%",
        },
        {
          title: "옵션명",
          key: "spec",
          width: "20%",
        },
        {
          title: "재고",
          key: "stock",
          width: "9%",
        },
        {
          title: "구매원가",
          key: "original_price_cn", // 한국돈 = 수집원가*설정환율
          width: "9%",
        },
        {
          title: "중국내 운임",
          key: "shipping_fee_cn", // 기본 0, 별도 기입
          width: "9%",
        },
        {
          title: "도매가",
          key: "wholesale_price", // (구매원가+중국내 운임)*도매마진
          width: "9%",
        },
        {
          title: "할인전 가격",
          key: "disp_price", // 할인가*할인전 가격설정
          width: "9%",
        },
        {
          title: "판매가",
          key: "selling_price", // (구매원가+중국내 운임)*마진율
          width: "9%",
        },
        {
          title: "운임",
          key: "shipping_fee_ko",
          width: "9%",
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
    setSellingMargin() {
      this.product.sku.map((data, i) => {
        let selling_price = (
          (Number(data["original_price_cn"]) +
            Number(data["shipping_fee_cn"])) *
          (1 + Number(this.product["selling_margin_option"]) / 100) *
          Number(this.product.rate_margin_option)
        ).toFixed(0);
        this.product.sku[i].selling_price =
          Math.ceil(Number(selling_price) / 100) * 100;
      });
      this.product.item_selling_margin_option =
        this.product.selling_margin_option;
    },

    /**
     * 할인마진율 설정
     * 할인가 = 할인가 * 할인마진율
     * sku[i].disp_price = sku[i].selling_price * user.disp_margin
     */
    setDispMargin() {
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
      });
      this.product.item_disp_margin_option = this.product.disp_margin_option;
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
        alert("선택된 품목이 없습니다.");
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
          if (!["code", "spec", "img"].includes(columns.key)) {
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

    // 이미지 선택 팝업 확인
    skuImageWindowOk() {
      this.product.sku.map((data, i) => {
        if (data.key === this.selected_sku_image_key) {
          this.product.sku[i].img = this.selected_sku_image_url;
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
      if (record.img.indexOf("https://i.tosoiot.com/") !== -1) {
        this.requestXiangji([url]);

        return false;
      }

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
        return false;
      }

      this.setWholesaleMargin();
      this.setSellingMargin();
      this.setDispMargin();
    },
  },

  mounted() {
    this.css();
    this.marginInit();
  },
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
  width: 150px;
  color: #3051d3;
}

.sku_window_image {
  width: 100px;
  height: 120px;
}

.sku_image {
  width: 100px;
  height: 100px;
}

.sku_image_button {
  width: 100px;
  height: 30px;
}
</style>
