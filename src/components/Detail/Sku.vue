<template>
  <div id="eModelTitle_3" class="mt20 p20 bg-white">
    <h1><strong>품목</strong></h1>

    <!--sku 상단 버튼-->
    <div class="top_button_container">
      <!--sku 상단 left 버튼-->
      <div class="top_button_left_item">
        <a-button class="top_button_left_item_button" type="primary" @click="skuBatch">일괄적용</a-button>
        <a-button class="top_button_left_item_button" type="primary" @click="deleteSku">품목삭제</a-button>
      </div>

      <!--sku 상단 right 버튼-->
      <div class="top_button_right_item">
        <a-button class="top_button_right_item_button" type="primary" @click="skuBatch">설정</a-button>
        <a-select
            class="top_button_right_item_select"
            :options="product.user.margin"
            @change="selectMargin"
            v-model:value="product.margin_default"
        >
        </a-select>
        <a-select
            class="top_button_right_item_select"
            :options="product.user.rate"
            @change="selectRate"
            v-model:value="product.rate_default"
        >
        </a-select>
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
            v-for="(item_thumbnails, i) in product.item_thumbnails"
            :src="item_thumbnails.url"
            :class="`${selected_sku_image_index === i? 'checkedEl': 'checkedNot'}`"
            @click="selectSkuImage(i, item_thumbnails.url)"
        >
      </a-modal>
    </div>

    <!--sku table-->
    <div>
      <a-table
          :bordered="true"
          :columns="columnConfig"
          :pagination="pagination"
          :data-source="product.sku"
      >
        <template
            v-for="col in column"
            #[col]="{ text, record ,index }"
            :key="col"
        >
          <div>
            <!--id-->
            <template v-if="col === 'id'">
              <a-checkbox v-model:checked="record.checked"></a-checkbox>
            </template>

            <!--품목 이미지-->
            <template v-else-if="col === 'img'">
              <div>
                <img class="sku_image" v-if="text" :src="text" @click="imageEditorVisible(record, text)" alt=""/>
              </div>
              <a-button class="sku_image_button" @click="skuImageWindowVisible(record.key)">선택</a-button>
            </template>

            <!--품목명-->
            <template v-else-if="col === 'spec'">
              <div :style="text.length > 20? 'color: red': ''">{{ text }}</div>
            </template>

            <!--기타 (입력가능)-->
            <a-input
                v-else-if="!['id', 'img', 'spec'].includes(col)"
                :style="product.sku[index].img?
                `height: 130px; text-align: center; border: none;`:
                 `height: 30px; text-align: center; border: none;`"
                v-model:value="product.sku[index][col]"
            />
          </div>
        </template>
      </a-table>
    </div>

    <!-- 편집기 세트 -->
    <ImageEditorGroup ref="imageEditorGroup" @pushImageData="pushImageData"></ImageEditorGroup>
  </div>
</template>

<script>
import {forEach} from 'lodash-es';
import {mapState} from 'vuex';
import {lib} from '../../util/lib';
import ImageEditorGroup from '../ImageEditor/imageEditorGroup.vue';

export default {
  components: {
    ImageEditorGroup,
  },

  computed: {
    ...mapState([
      'common',
      'product',
    ]),
  },

  data() {
    return {
      sku_col_visible: {},
      selected_sku_image_key: 0,
      selected_sku_image_url: '',
      selected_sku_image_index: 0,
      sku_image_window_visible: false,

      columnConfig: [
        {
          title: '',
          dataIndex: 'id',
          width: '1px',
          slots: {
            customRender: 'id',
          },
        },
        {
          title: '이미지',
          dataIndex: 'img',
          width: '100px',
          slots: {
            customRender: 'img',
          },
        },
        {
          title: '품목코드',
          dataIndex: 'code',
          width: '10%',
          slots: {
            customRender: 'code',
          },
        },
        {
          title: '스펙',
          dataIndex: 'spec',
          width: '15%',
          slots: {
            customRender: 'spec',
          },
        },
        {
          title: '판매가',
          dataIndex: 'selling_price',
          width: '10%',
          slots: {
            customRender: 'selling_price',
          },
        },
        {
          title: '마진',
          dataIndex: 'margin',
          width: '10%',
          slots: {
            customRender: 'margin',
          },
        },
        {
          title: '환율',
          dataIndex: 'rate',
          width: '10%',
          slots: {
            customRender: 'rate',
          },
        },
        {
          title: '재고',
          dataIndex: 'stock',
          width: '5%',
          slots: {
            customRender: 'stock',
          },
        },
        {
          title: '운임',
          dataIndex: 'shipping_fee',
          width: '5%',
          slots: {
            customRender: 'shipping_fee',
          },
        },
        {
          title: '길이',
          dataIndex: 'length',
          width: '5%',
          slots: {
            customRender: 'length',
          },
        },
        {
          title: '넓이',
          dataIndex: 'width',
          width: '5%',
          slots: {
            customRender: 'width',
          },
        },
        {
          title: '높이',
          dataIndex: 'height',
          width: '5%',
          slots: {
            customRender: 'height',
          },
        },
        {
          title: '중량',
          dataIndex: 'weight',
          width: '5%',
          slots: {
            customRender: 'weight',
          },
        },
      ],
      pagination: {
        total: 0,
        defaultPageSize: 10,
        // showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15', '20'],
        onShowSizeChange: (current, pageSize) => this.pageSize = pageSize,
      },
      column: [
        'id',
        'img',
        'code',
        'spec',
        'selling_price',
        'margin',
        'rate',
        'stock',
        'shipping_fee',
        'length',
        'width',
        'height',
        'weight',
      ],

      aBakDetailImages: {},
    };
  },

  methods: {
    // 상단 margin 선택
    selectMargin(value) {
      let marginVal = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
      if (marginVal > 0) {
        forEach(this.product.sku, (val, key) => {
          if (parseFloat(val.margin) === 0 || val.margin === null || val.custom_margin === false) {
            this.product.sku[key].margin = Math.ceil(
                parseFloat(marginVal / 100 * val.selling_price) + parseFloat(val.selling_price));
          }
        });
      }

      this.selectRate(this.product._rate_default);
    },

    // 상단 rate 선택
    selectRate(value) {
      let rateVal = isNaN(parseFloat(value)) ? 0 : parseFloat(value);

      if (rateVal > 0) {
        forEach(this.product.sku, (val, key) => {
          if (parseFloat(val.rate) === 0 || val.rate === null || val.custom_rate === false) {
            this.product.sku[key].rate = Math.ceil(val.margin * rateVal);
          }
        });
      }
    },

    // 품목삭제
    deleteSku() {
      if (!lib.isArray(this.product.sku.filter(data => data.checked === true), true)) {
        alert('선택된 품목이 없습니다.');
        return false;
      }

      // 삭제
      this.product.sku = this.product.sku.filter(data => data.checked !== true);
    },

    // 일괄적용
    skuBatch() {
      forEach(this.product.sku, (val, key) => {
        this.product.sku[key].selling_price = this.product.sku[0].selling_price;
        this.product.sku[key].dips_price = this.product.sku[0].dips_price;
        this.product.sku[key].margin = this.product.sku[0].margin;
        this.product.sku[key].rate = this.product.sku[0].rate;
        this.product.sku[key].weight = this.product.sku[0].weight;
        this.product.sku[key].width = this.product.sku[0].width;
        this.product.sku[key].length = this.product.sku[0].length;
        this.product.sku[key].height = this.product.sku[0].height;
        this.product.sku[key].stock = this.product.sku[0].stock;
        this.product.sku[key].shipping_fee = this.product.sku[0].shipping_fee;
        this.product.sku[key].custom_rate = true;
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
      this.selected_sku_image_url = '';
      this.selected_sku_image_index = 0;
      this.sku_image_window_visible = false;
    },

    imageEditorVisible(record, url) {
      this.$refs.imageEditorGroup.aPhotoCollection = [];
      Object.values([{url: url, key: record.key}]).map((oImageInfo) => {
        this.$refs.imageEditorGroup.aPhotoCollection.push({
          'msg': '',
          'key': oImageInfo.key,
          'name': '',
          'order': '',
          'checked': true,
          'visible': true,
          'original_url': oImageInfo.url,
          'translate_url': '',
          'translate_status': false,
        });
      });

      this.$refs.imageEditorGroup.mInitEditorImage(false);
    },

    pushImageData(key, url) {
      if (this.$refs.imageEditorGroup.bProductDetailsEditor === true) {
        let content = this.$refs.editor.contentValue;
        if (content === undefined) {
          return false;
        }

        this.$refs.editor.contentValue = content.replace(this.aBakDetailImages[key], url);
        return false;
      }

      Object.values(this.product.sku).map((oDataSource, i) => {
        if (oDataSource.key === key) {
          this.product.sku[i].img = url;
        }
      });
    },

    css() {
      // sku table 需要改 ant vue 底层 css
      Object.values(document.querySelectorAll('.ant-table-row-cell-break-word')).map((el, i) => {
        if (el.tagName === 'TH') {
          el.style.backgroundColor = '#f7fdff';
          el.style.height = '33px';
          el.style.fontSize = '15px';
        }
        el.style.padding = 0;
        el.style.textAlign = 'center';
      });
    },
  },

  mounted() {
    this.css();
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
  background-color: #3ddc97;
  color: white;
  border: none;
  border-radius: 5px;
}

.top_button_right_item {
  width: 370px;
  display: flex;
  justify-content: space-between;
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