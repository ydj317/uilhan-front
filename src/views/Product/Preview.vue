<template>
  <!--동기화상품 미리보기-->
  <div id="previewContainer">
    <!--로딩-->
    <loading
      :can-cancel="false"
      :is-full-page="true"
      v-model:active="visibleOfLoading"
    />

    <!--상품명 Module-->
    <a-collapse
      v-model:activeKey="visibleOfModuleSwitch[0]"
      class="pl20 pr20 pb20 mb30 bg-white"
    >
      <a-collapse-panel key="1" header="상품명">
        <span>{{ dataOfProduct.item_name }}</span>
      </a-collapse-panel>
    </a-collapse>

    <!--판매자닉네임 Module-->
    <a-collapse
      v-model:activeKey="visibleOfModuleSwitch[1]"
      class="pl20 pr20 pb20 mb30 bg-white"
    >
      <a-collapse-panel key="1" header="판매자닉네임">
        <span>{{ dataOfProduct.seller_nick }}</span>
      </a-collapse-panel>
    </a-collapse>

    <!--대표이미지 Module-->
    <a-collapse
      v-model:activeKey="visibleOfModuleSwitch[2]"
      class="pl20 pr20 pb20 mb30 bg-white"
    >
      <a-collapse-panel key="1" header="대표이미지">
        <img
          @click="visibleOfPreview = true"
          :src="dataOfProduct.item_thumbnails"
          alt=""
          style="width: 240px; height: 320px"
        />
        <!--대표이미지 미리보기-->
        <a-modal
          @cancel="visibleOfPreview = false"
          :footer="null"
          :visible="visibleOfPreview"
        >
          <img
            :src="dataOfProduct.item_thumbnails"
            alt="example"
            style="width: 100%"
          />
        </a-modal>
      </a-collapse-panel>
    </a-collapse>

    <!--옵션 Module-->
    <a-collapse
      v-model:activeKey="visibleOfModuleSwitch[3]"
      class="pl20 pr20 pb20 mb30 bg-white"
    >
      <a-collapse-panel key="1" header="옵션">
        <a-table :columns="columnsOfProps" :data-source="dataSourceOfProps">
          <!--body-->
          <template #bodyCell="{ column, record }">
            <!--옵션값-->
            <template v-if="column.key === 'items'">
              <a-tag
                v-for="props in record[column.key]"
                :key="props.name"
                class="mb10"
                color="blue"
                >{{ props.name }}</a-tag
              >
            </template>
          </template>
        </a-table>
      </a-collapse-panel>
    </a-collapse>

    <!--품목 Module-->
    <a-collapse
      v-model:activeKey="visibleOfModuleSwitch[4]"
      class="pl20 pr20 pb20 mb30 bg-white"
    >
      <a-collapse-panel key="1" header="품목">
        <a-table
          :columns="columnsOfSku"
          :data-source="dataSourceOfSku"
        ></a-table>
      </a-collapse-panel>
    </a-collapse>

    <!--상세설명 Module-->
    <a-collapse
      v-model:activeKey="visibleOfModuleSwitch[5]"
      class="pl20 pr20 pb20 mb30 bg-white"
    >
      <a-collapse-panel key="1" header="상세설명">
        <div
          style="
            border: 1px solid gray;
            height: 600px;
            display: flex;
            overflow-y: scroll;
            justify-content: center;
          "
        >
          <div
            v-html="dataOfProduct.item_detail"
            class="content"
            style="width: 934px"
          ></div>
        </div>
      </a-collapse-panel>
    </a-collapse>

    <!--버튼-->
    <a-affix :offset-bottom="0">
      <div style="display: flex; justify-content: center">
        <a-button
          @click="onClickToMarketDetail(dataOfProduct.item_code)"
          type="primary"
          >마켓상세</a-button
        >
        <a-button @click="onClickToAppList" type="primary" class="ml5"
          >메뉴가기</a-button
        >
      </div>
    </a-affix>
  </div>
</template>
<script>
import router from "@/router";
import { message } from "ant-design-vue";
import Loading from "vue-loading-overlay";
import { AuthRequest } from "util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "PreviewComponent",
  components: { Loading },
  setup() {
    const visibleOfPreview = ref(false);
    const visibleOfLoading = ref(false);
    const visibleOfModuleSwitch = ref([0, 0, 0, 0, 0, 0]);

    const dataOfProduct = ref({});

    const columnsOfSku = [
      {
        key: "names",
        align: "center",
        title: "품목명",
        width: 100,
        dataIndex: "names",
      },
      {
        key: "stock",
        align: "center",
        title: "품목재고",
        width: 100,
        dataIndex: "stock",
      },
      {
        key: "price",
        align: "center",
        title: "품목가격",
        width: 100,
        dataIndex: "price",
      },
    ];
    const dataSourceOfSku = ref([]);

    const columnsOfProps = [
      {
        key: "name",
        align: "center",
        title: "옵션명",
        width: 100,
        dataIndex: "name",
      },
      {
        key: "items",
        align: "center",
        title: "옵션값",
        width: 100,
        dataIndex: "items",
      },
    ];
    const dataSourceOfProps = ref([]);

    const onClickToAppList = () => {
      router.push("/product/domeggook");
    };
    const onClickToMarketDetail = (sItemCode) => {
      open("https://domeggook.com/" + sItemCode);
    };

    const onPostMarketProductDetail = () => {
      visibleOfLoading.value = true;
      let sMarketPrdCode = location.pathname.split("preview/")[1];

      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/domeggook/detail", {
        no: sMarketPrdCode,
      }).then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          visibleOfLoading.value = false;
          return false;
        }

        let oMarketProduct = res.data;

        /* 상품데이터 */
        dataOfProduct.value = {
          item_sku: oMarketProduct.item_sku,
          item_name: oMarketProduct.item_name,
          item_code: oMarketProduct.item_code,
          item_props: oMarketProduct.item_props,
          item_detail: oMarketProduct.item_detail,
          seller_nick: oMarketProduct.seller_nick,
          item_thumbnails: oMarketProduct.item_thumbnails,
        };

        /* 옵션데이터 */
        dataSourceOfProps.value = [];
        oMarketProduct.item_props.map((oItemProps) =>
          dataSourceOfProps.value.push({
            key: oItemProps.name,
            name: oItemProps.name,
            items: oItemProps.items,
          })
        );

        /* 품목데이터 */
        dataSourceOfSku.value = [];
        oMarketProduct.item_sku.map((oItemSku) =>
          dataSourceOfSku.value.push({
            key: oItemSku.names,
            names: oItemSku.names,
            stock: oItemSku.stock,
            price: oItemSku.price,
          })
        );

        /* 전체모듈열기 */
        visibleOfModuleSwitch.value.map(
          (r, i) => (visibleOfModuleSwitch.value[i] = 1)
        );

        visibleOfLoading.value = false;
      });
    };

    onMounted(async () => onPostMarketProductDetail());

    return {
      visibleOfPreview,
      visibleOfLoading,
      visibleOfModuleSwitch,

      dataOfProduct,

      columnsOfSku,
      dataSourceOfSku,

      columnsOfProps,
      dataSourceOfProps,

      onClickToAppList,
      onClickToMarketDetail,

      onPostMarketProductDetail,
    };
  },
});
</script>

<style>
/* 페이징 center */
#previewContainer .ant-table-pagination {
  display: flex;
  justify-content: center;
}

/* 모듈 title 글자체 */
#previewContainer .ant-collapse-header {
  font-size: 18px;
  font-weight: 600;
}
</style>
