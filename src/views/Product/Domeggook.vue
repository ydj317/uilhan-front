<template>
  <div id="DomeggookContainer">
    <!--로딩-->
    <loading
      v-model:active="visibleOfLoading"
      :can-cancel="false"
      :is-full-page="true"
    />

    <!--이미지 미리보기-->
    <a-modal
      :visible="visibleOfPreviewImage"
      :footer="null"
      @cancel="visibleOfPreviewImage = false"
    >
      <img
        alt="example"
        style="width: 100%; border: 1px solid #f0f0f0"
        :src="dataOfPreviewImageSrc"
      />
    </a-modal>

    <!--검색-->
    <div class="mb30 bg-white" style="padding: 20px 20% 20px 20%">
      <a-form
        :label-col="{ span: 10 }"
        :wrapper-col="{ span: 100 }"
        :layout="'vertical'"
      >
        <!--검색어-->
        <a-form-item label="검색어" v-bind="dataOfSearchForm.validateInfos.kw">
          <a-input
            v-model:value="dataOfSearchFormValues.kw"
            @blur="
              dataOfSearchForm
                .validate('kw', { trigger: 'blur' })
                .catch(() => {})
            "
            placeholder="검색어를 입력해주세요."
          />
        </a-form-item>

        <!--상품번호-->
        <a-form-item
          label="상품번호"
          v-bind="dataOfSearchForm.validateInfos.itemNo"
        >
          <a-input
            v-model:value="dataOfSearchFormValues.itemNo"
            @blur="
              dataOfSearchForm
                .validate('itemNo', { trigger: 'blur' })
                .catch(() => {})
            "
            placeholder="상품번호를 입력해주세요."
          />
        </a-form-item>

        <!--카테고리-->
        <a-form-item
          label="카테고리"
          v-bind="dataOfSearchForm.validateInfos.ca"
        >
          <a-cascader
            v-model:value="dataOfSearchFormValues.ca"
            @change="onChangeCategory"
            :options="optionsOfCategory"
            :load-data="loadDataOfCategory"
            placeholder="카테고리를 선택해주세요."
            change-on-select
          />
        </a-form-item>

        <!--판매자 아이디-->
        <a-form-item
          label="판매자 아이디"
          v-bind="dataOfSearchForm.validateInfos.id"
        >
          <a-input
            v-model:value="dataOfSearchFormValues.id"
            @blur="
              dataOfSearchForm
                .validate('id', { trigger: 'blur' })
                .catch(() => {})
            "
            placeholder="판매자 아이디를 입력해주세요."
          />
        </a-form-item>

        <!--최저/최대 가격대-->
        <a-form-item
          label="최저/최대 가격대"
          v-bind="dataOfSearchForm.validateInfos.mnp"
          style="display: flex"
        >
          <a-input
            v-model:value="dataOfSearchFormValues.mnp"
            @blur="
              dataOfSearchForm
                .validate('mnp', { trigger: 'blur' })
                .catch(() => {})
            "
            placeholder="최저가격대를 입력해주세요."
            style="width: 50%"
          />
          <a-input
            v-model:value="dataOfSearchFormValues.mxp"
            @blur="
              dataOfSearchForm
                .validate('mxp', { trigger: 'blur' })
                .catch(() => {})
            "
            placeholder="최대가격대를 입력해주세요."
            style="width: 50%"
          />
        </a-form-item>

        <!--검색결과 정렬방식-->
        <a-form-item
          label="검색결과 정렬방식"
          v-bind="dataOfSearchForm.validateInfos.so"
        >
          <a-select
            v-model:value="dataOfSearchFormValues.so"
            allow-clear
            placeholder="검색결과 정렬방식을 선택해주세요."
          >
            <a-select-option value="se"
              >정확도순 (검색어 사용시 외에는 사용불가 / 검색어 사용시
              기본값)</a-select-option
            >
            <a-select-option value="rd"
              >도매꾹랭킹순 (검색어 미사용시 기본값)</a-select-option
            >
            <a-select-option value="ha">인기상품순</a-select-option>
            <a-select-option value="aa">낮은가격순</a-select-option>
            <a-select-option value="ad">높은가격순</a-select-option>
            <a-select-option value="sd">신규판매자순</a-select-option>
            <a-select-option value="qa">적은판매단위순</a-select-option>
            <a-select-option value="qd">많은판매단위순</a-select-option>
            <a-select-option value="da"
              >최근등록순(상품정보등록/수정일 최근순)--></a-select-option
            >
          </a-select>
        </a-form-item>

        <!--검색버튼-->
        <a-form-item
          :wrapper-col="{ span: 14, offset: 4 }"
          style="text-align: center"
        >
          <a-button
            type="primary"
            @click.prevent="onClickSearchProductList"
            style="width: 120px; margin-left: 14%"
            >검색</a-button
          >
        </a-form-item>
      </a-form>
    </div>

    <!--리스트-->
    <a-table
      class="p20 bg-white"
      :bordered="false"
      :columns="columnsOfProductList"
      :data-source="dataSourceOfProductList"
      :row-selection="rowSelectionOfProductList"
      :pagination="{
        hideOnSinglePage: true,
        disabled: true,
        pageSize: pageSizeOfProductList,
      }"
    >
      <!--head-->
      <template #headerCell="{ column }">
        <!--일괄동기화버튼-->
        <template v-if="column.key === 'sync_product'">
          <div style="text-align: center">
            <a-button
              type="primary"
              danger
              @click="
                onClickSyncProduct(
                  dataOfProductListRowSelection,
                  dataOfProductListRowSelection.value
                )
              "
              >일괄동기화</a-button
            >
          </div>
        </template>

        <!--항목명-->
        <template v-else>
          <div style="text-align: center">
            {{ column.title }}
          </div>
        </template>
      </template>

      <!--body-->
      <template #bodyCell="{ column, record }">
        <!--이미지-->
        <template v-if="column.key === 'product_image'">
          <div style="text-align: center">
            <img
              style="width: 100px; height: 100px"
              @click="
                visibleOfPreviewImage = true;
                dataOfPreviewImageSrc = record.product_image;
              "
              :src="record.product_image"
              alt=""
            />
          </div>
        </template>

        <!--상품정보-->
        <template v-if="column.key === 'product_info'">
          <div style="text-align: left">
            <div class="mb5">
              <a
                @click="
                  onClickToPreviewProductDetail(
                    '/product/preview/' + record.key
                  )
                "
                href="javascript:void(0)"
                >{{ record.product_info }}</a
              >
            </div>

            <div class="mb5">
              <span>이미지 사용허용 여부 : </span>
              <a-tag
                v-if="record.desc_license_usable === 'true'"
                color="#87d068"
                >사용 가능함</a-tag
              >
              <a-tag
                v-else-if="record.desc_license_usable === 'false'"
                color="#f50"
                >사용 불가함</a-tag
              >
              <a-spin v-else size="small" />
            </div>

            <div class="mb5">
              상품 가격 :
              <span>{{ record.item_price }}</span>
            </div>

            <div class="mb5">
              상품 바로가기 :
              <a target="_blank" :href="record.product_url">{{ record.key }}</a>
            </div>

            <div
              v-for="(sync_product_id, i) in record.sync_product_id"
              :key="i"
              class="mb5"
            >
              <span v-if="sync_product_id">
                동기화상품 바로보기 :
                <a target="_blank" :href="sync_product_id">{{ record.key }}</a>
              </span>
            </div>
          </div>
        </template>

        <!--동기화상태-->
        <template v-if="column.key === 'sync_status'">
          <div style="text-align: center">
            <a-tag v-if="record.sync_status === true" color="#87d068"
              >동기화 완료</a-tag
            >
            <a-tag v-else-if="record.sync_status === false" color="default"
              >동기화 안함</a-tag
            >
            <a-tag v-else-if="record.sync_status === 'error'" color="#f50"
              >동기화 실패</a-tag
            >
            <a-spin v-else />
          </div>
        </template>

        <!--동기화버튼-->
        <template v-if="column.key === 'sync_product'">
          <div style="text-align: center">
            <a-spin
              v-if="
                ['true', 'false'].includes(record.desc_license_usable) === false
              "
            />
            <a-button
              v-else
              ghost
              danger
              @click="onClickSyncProduct([record.key], record.key)"
              >상품동기화</a-button
            >
          </div>
        </template>
      </template>
    </a-table>

    <!--paging-->
    <a-pagination
      class="w100 center top h50"
      style="background-color: white"
      v-model:current="currentOfProductList"
      :show-total="onLoadShowTotal"
      :page-size-options="pageSizeOptionsOfProductList"
      :total="totalOfProductList"
      show-size-changer
      :page-size="pageSizeOfProductList"
      @change="onChangeProductPaging"
    >
    </a-pagination>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, toRaw } from "vue";
import "vue-loading-overlay/dist/vue-loading.css";
import { Form, message } from "ant-design-vue";
import { AuthRequest } from "@/util/request";
import { lib } from "@/util/lib";
import Loading from "vue-loading-overlay";

export default defineComponent({
  name: "DomeggookComponent",
  components: { Loading },
  setup() {
    const optionsOfCategory = ref([]);
    const optionsOfCategoryArray = ref([]);
    const loadDataOfCategory = (selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];

      /* 최하위 카테고리 조회 */
      if (targetOption.isLeaf === false) {
        onPostSearchMarketCategory(targetOption.value, targetOption);
      }
    };
    const onChangeCategory = (aCateValues, aCateInfo) => {
      if (aCateValues === undefined) {
        dataOfIsLastCategory.value = true;
        return;
      }

      let iCurrent = aCateValues.length - 1;
      let oCurrentInfo = aCateInfo[iCurrent];
      dataOfIsLastCategory.value = oCurrentInfo.isLeaf;

      if (oCurrentInfo.isLeaf === true) {
        optionsOfCategoryArray.value = dataOfSearchFormValues.ca;
        message.success("최하위 카테고리 선택완료.");
      }
    };

    const visibleOfLoading = ref(false);
    const visibleOfPreviewImage = ref(false);
    const visibleOfCategoryLoading = ref(false);

    const dataOfPreviewImageSrc = ref("");
    const dataOfSyncProductList = ref([]);
    const dataOfIsLastCategory = ref(true);
    const dataOfProductListRowSelection = ref([]);

    const dataOfSearchFormValues = reactive({
      ca: [],
      so: [],
      id: "",
      kw: "",
      mnp: "",
      mxp: "",
      itemNo: "",
    });
    const dataOfSearchFormRules = reactive({
      ca: [
        {
          required: true,
          message: "",
        },
      ],
      so: [
        {
          required: false,
          message: "",
        },
      ],
      id: [
        {
          required: true,
          message: "",
        },
      ],
      kw: [
        {
          required: true,
          message: "",
        },
      ],
      mnp: [
        {
          required: false,
          message: "",
        },
      ],
      mxp: [
        {
          required: false,
          message: "",
        },
      ],
      itemNo: [
        {
          required: true,
          message: "",
        },
      ],
    });
    const dataOfSearchForm = Form.useForm(
      dataOfSearchFormValues,
      dataOfSearchFormRules
    );

    const totalOfProductList = ref(0);
    const columnsOfProductList = [
      {
        title: "상품이미지",
        dataIndex: "product_image",
        key: "product_image",
        width: "15%",
      },
      {
        title: "상품정보",
        dataIndex: "product_info",
        key: "product_info",
        width: "50%",
      },
      {
        title: "동기화상태",
        dataIndex: "sync_status",
        key: "sync_status",
        width: "15%",
      },
      {
        title: "상품동기화",
        dataIndex: "sync_product",
        key: "sync_product",
        width: "20%",
      },
    ];
    const currentOfProductList = ref(1);
    const pageSizeOfProductList = ref(10);
    const dataSourceOfProductList = ref([]);
    const rowSelectionOfProductList = {
      /* 동기화할 상품선택 (체크박스) */
      onChange: (selectedRowKeys) => {
        dataOfProductListRowSelection.value = selectedRowKeys;
      },
      /* 체크박스속성 (선택불가) */
      getCheckboxProps: (record) => ({
        name: record.name,
        /* 상품상세조회시 선택불가 */
        disabled:
          ["true", "false"].includes(record.desc_license_usable) === false,
      }),
    };
    const pageSizeOptionsOfProductList = ref(["10", "20", "30", "40", "50"]);

    const onLoadShowTotal = () => {
      if (totalOfProductList.value === 0) {
        return "";
      }
      return `전체 상품 건수 ${totalOfProductList.value} `;
    };
    const onClickSyncProduct = (aSyncProduct) => {
      if (lib.isArray(aSyncProduct, true) === false) {
        message.warning("동기화 진행할 상품을 선택해 주세요.");
        return false;
      }

      /* 선택한 상품동기화 (마켓상품코드 기준) */
      let aSyncProducts = dataOfSyncProductList.value.filter((r) =>
        aSyncProduct.includes(String(r.item_code))
      );
      aSyncProducts = JSON.parse(JSON.stringify(aSyncProducts));

      aSyncProducts.map((r) => {
        _updateSyncStatus(r.item_code, "");
        AuthRequest.post(
          process.env.VUE_APP_API_URL + "/api/domeggook/sync/detail",
          {
            sync_product: r,
          }
        ).then((res) => {
          let mSync = true;
          /* 상품동기화 실패 */
          if (res.status !== "2000") {
            message.error(res.message);
            mSync = "error";
          }

          _updateSyncStatus(r.item_code, mSync);
        });
      });

      message.success("상품동기화신청완료되었습니다.");
    };
    const onChangeProductPaging = (iCurrent, iPageSize) => {
      currentOfProductList.value = iCurrent;
      pageSizeOfProductList.value = iPageSize;
      onClickSearchProductList();
    };
    const onClickSearchProductList = () => {
      /* 필수항목 체크 */
      _validateSearchParams();
      dataOfSearchForm
        .validate()
        .then(() => {
          onPostSearchProductList(toRaw(dataOfSearchFormValues));
        })
        .catch(() => {
          if (
            lib.isEmpty(dataOfSearchFormValues.ca) === false &&
            dataOfIsLastCategory.value === false
          ) {
            message.warning("카테고리를 최하위까지 선택해주세요.");
            return false;
          }
          message.warning("필수항목은 최소1개 입력 필요합니다.");
        });
    };
    const onClickToPreviewProductDetail = (sUrl) => {
      let oHistory = {
        paging: {
          sz: pageSizeOfProductList.value,
          pg: currentOfProductList.value,
        },
        form: dataOfSearchFormValues,
        category: optionsOfCategory.value,
        category_array: optionsOfCategoryArray.value,
      };
      sessionStorage.domeggooke_history = JSON.stringify(oHistory);
      location.href = sUrl;
    };

    const onPostSearchProductList = (oParams) => {
      let oParam = JSON.parse(JSON.stringify(oParams));

      /* 최하위 카테고리만 전송 */
      if (lib.isArray(oParam.ca, true) === true) {
        let iCurrent = oParam.ca.length - 1;
        oParam.ca = oParam.ca[iCurrent];
      }

      /* 파람 빈값제거 */
      let oRequestParam = {};
      Object.keys(oParam).map((r) => {
        if (lib.isString(oParam[r], true) === true) {
          oRequestParam[r] = oParam[r];
        }
      });

      /* 기존정보가 없으면 현재 데이터 사용 */
      oRequestParam.sz =
        oRequestParam.sz !== undefined
          ? oRequestParam.sz
          : pageSizeOfProductList.value;

      oRequestParam.pg =
        oRequestParam.pg !== undefined
          ? oRequestParam.pg
          : currentOfProductList.value;

      oRequestParam.market =
        oRequestParam.market !== undefined ? oRequestParam.market : "dome";

      visibleOfLoading.value = true;

      let oRequest = AuthRequest.post(
        process.env.VUE_APP_API_URL + "/api/domeggook",
        oRequestParam
      );

      oRequest.then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          visibleOfLoading.value = false;
          return false;
        }

        dataOfSyncProductList.value = res.data.list;

        totalOfProductList.value = Number(res.data.total);
        currentOfProductList.value = Number(res.data.offset);
        pageSizeOfProductList.value = Number(res.data.limit);

        let aTempDataSource = [];
        res.data.list.map((r) => {
          aTempDataSource.push({
            key: r.item_code,
            product_image: r.item_thumbnail,
            product_info: r.item_name,
            product_url: r.item_url,
            desc_license_usable: "",
            item_price: r.item_price,
          });
          onPostSearchProductDetail(r.item_code);
        });
        dataSourceOfProductList.value = aTempDataSource;

        visibleOfLoading.value = false;
      });
    };
    const onPostSearchProductDetail = (sItemCode = "") => {
      let oRequest = AuthRequest.post(
        process.env.VUE_APP_API_URL + "/api/domeggook/detail",
        {
          no: sItemCode,
        }
      );

      oRequest.then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        let aTempDataSource = dataSourceOfProductList.value;
        aTempDataSource.map((r, i) => {
          if (String(r.key) === String(res.data.item_code)) {
            r.desc_license_usable = res.data.desc_license_usable;
            r.sync_status = res.data.sync_status;
            r.sync_product_id = res.data.sync_product_id;
            aTempDataSource[i] = r;
          }
        });
        dataSourceOfProductList.value = aTempDataSource;

        dataOfSyncProductList.value.map((r, i) => {
          if (String(r.item_code) === String(res.data.item_code)) {
            let oTemp = res.data;
            delete oTemp.seller_nick;
            delete oTemp.sync_status;
            delete oTemp.desc_license_usable;
            delete oTemp.sync_product_id;
            dataOfSyncProductList.value[i] = oTemp;
          }
        });
      });
    };
    const onPostSearchMarketCategory = (sCatePid, targetOption) => {
      /* targetOption 하위카테고리 선택시 Object */

      if (targetOption) {
        targetOption.loading = true;
      }

      let oRequest = AuthRequest.post(
        process.env.VUE_APP_API_URL + "/api/domeggook/category",
        {
          cate_market: "Domeggook",
          cate_pid: sCatePid,
        }
      );

      /* 하위카테고리 데이터 */
      oRequest.then((res) => {
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        /* 카테고리 데이터 */
        let aCategory = res.data;

        /* 대분류 조회시 처리안함 */
        if (sCatePid === "0" && !targetOption) {
          optionsOfCategory.value = aCategory;
          dataOfIsLastCategory.value = false;
          return;
        }

        /* 하위카테고리 조회시 */
        targetOption.loading = false;
        targetOption.children = aCategory;
        optionsOfCategory.value = [...optionsOfCategory.value];
        //dataOfIsLastCategory.value = false;
      });
    };

    const _updateSyncStatus = (sItemCode, mStatus = "") => {
      let aTempDataSource = dataSourceOfProductList.value;
      aTempDataSource.map((r, i) => {
        if (String(r.key) === String(sItemCode)) {
          r.sync_status = mStatus;
          aTempDataSource[i] = r;
        }
      });
      dataSourceOfProductList.value = aTempDataSource;
    };
    const _validateSearchParams = () => {
      let bRequired =
        lib.isString(dataOfSearchFormValues.id, true) === false &&
        lib.isString(dataOfSearchFormValues.kw, true) === false &&
        lib.isString(dataOfSearchFormValues.itemNo, true) === false &&
        lib.isEmpty(dataOfSearchFormValues.ca) === true;

      ["ca", "id", "kw", "itemNo"].map((r) => {
        dataOfSearchFormRules[r][0].required = bRequired;
      });
    };

    const _initSearch = () => {
      if (sessionStorage.domeggooke_history !== undefined) {
        let oHistory = JSON.parse(sessionStorage.domeggooke_history);
        delete sessionStorage.domeggooke_history;

        let _optionsOfCategory = [];
        oHistory.category.map((r) => {
          _optionsOfCategory.push(reactive(r));
        });
        optionsOfCategory.value = _optionsOfCategory;
        optionsOfCategory.value = [...optionsOfCategory.value];

        dataOfSearchFormValues.ca = oHistory.category_array;
        dataOfSearchFormValues.so = [oHistory.form.so];

        Object.keys(oHistory.form).map((r) => {
          if (r !== "ca" || r !== "so") {
            dataOfSearchFormValues[r] = oHistory.form[r];
          }
        });

        dataOfIsLastCategory.value = true;

        currentOfProductList.value = oHistory.paging.pg;
        pageSizeOfProductList.value = oHistory.paging.sz;

        let oParam = JSON.parse(JSON.stringify(dataOfSearchFormValues));

        onPostSearchProductList(oParam);

        return;
      }

      onPostSearchMarketCategory("0");
    };

    onMounted(async () => {
      _initSearch();
    });

    return {
      optionsOfCategory,

      totalOfProductList,
      currentOfProductList,
      columnsOfProductList,
      pageSizeOfProductList,
      dataSourceOfProductList,
      rowSelectionOfProductList,
      pageSizeOptionsOfProductList,

      visibleOfLoading,
      visibleOfPreviewImage,
      visibleOfCategoryLoading,

      dataOfSearchForm,
      dataOfIsLastCategory,
      dataOfSyncProductList,
      dataOfPreviewImageSrc,
      dataOfSearchFormValues,
      dataOfProductListRowSelection,

      onLoadShowTotal,
      onChangeCategory,
      loadDataOfCategory,
      onClickSyncProduct,
      onChangeProductPaging,
      onClickSearchProductList,
      onClickToPreviewProductDetail,

      onPostSearchProductList,
      onPostSearchProductDetail,
      onPostSearchMarketCategory,
    };
  },
});
</script>

<style>
/* table 페이징 노출안함 */
#DomeggookContainer .ant-pagination-disabled {
  display: none !important;
}
</style>
