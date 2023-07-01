<template>
  <!--상품명 금지어-->
  <div id="filterWordContainer">
    <!--로딩-->
    <loading
      v-model:active="loading"
      :can-cancel="false"
      :is-full-page="true"
    />

    <!--등록창-->
    <div>
      <a-modal
        v-model:visible="visible"
        title="상품명 금지어 추가"
        @ok="handleOk"
        :ok-text="'추가'"
        :cancel-text="'취소'"
      >
        <a-textarea :autosize="true" v-model:value="filterWord"></a-textarea>
      </a-modal>
    </div>

    <!--검색-->
    <div id="FilterProductWordsHeader" class="pl20 pr20 pb20 pt20 mb30 bg-white">
      <div class="mb5">
        <a-tag color="#2db7f5" class="w100">검색 유형을 선택해주세요.</a-tag>
      </div>
      <div class="mt5">
        <!--셀렉박스-->
        <a-select
          class="mr10"
          ref="select"
          v-model:value="searchType"
          style="width: 146px"
          @change="searchApi"
        >
          <a-select-option value="search_filter_word">금지어</a-select-option>
          <a-select-option value="search_user_name" :hidden="isAdmin !== 1"
            >등록자</a-select-option
          >
        </a-select>
        <!--입력-->
        <a-input style="width: 500px" v-model:value="searchValue" />
        <!--검색버튼-->
        <a-button
          @click="searchApi"
          style="width: 100px; margin-left: 10px"
          type="primary"
          >검색</a-button
        >
      </div>
    </div>

    <!--리스트-->
    <div id="FilterProductWordsBody" class="p20 bg-white">
      <!--선택검색-->
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <!--사용자/관리자 버튼-->
        <div>
          <a-radio-group
            @change="searchApi"
            v-model:value="searchViewType"
            :buttonStyle="'solid'"
          >
            <a-radio-button value="user">{{
              isAdmin === 1 ? "사용자" : "나의 금지어"
            }}</a-radio-button>
            <a-radio-button value="admin">{{
              isAdmin === 1 ? "관리자" : "기본 금지어"
            }}</a-radio-button>
          </a-radio-group>
        </div>
        <!--금지어 추가 버튼-->
        <div>
          <a-button
            @click="showModal"
            style="width: 100px; background-color: #2db7f5; border: none"
            type="primary"
            >추가</a-button
          >
        </div>
      </div>
      <div>
        <a-tag color="#2db7f5" class="w100"></a-tag>
      </div>
      <a-table
        :bordered="false"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="rowSelection"
        :pagination="{ hideOnSinglePage: true, disabled: true, pageSize: pageSize }"
      >
        <!--head-->
        <template #headerCell="{ column }">
          <!--등록자명-->
          <template v-if="column.key === 'user_name'">
            <div style="text-align: center">
              {{ column.title }}
            </div>
          </template>
          <!--금지어내용-->
          <template v-else-if="column.key === 'filter_word'">
            <div style="text-align: center">{{ column.title }}</div>
          </template>
          <!--삭제버튼-->
          <template v-else-if="column.key === 'delete'">
            <div
              :hidden="searchViewType === 'admin' && isAdmin !== 1"
              style="text-align: center"
            >
              <a-button
                type="primary"
                danger
                @click="deleteApi(checkedId, checkedId.value)"
                >선택삭제</a-button
              >
            </div>
          </template>
        </template>

        <!--body-->
        <template #bodyCell="{ column, record }">
          <!--등록자명-->
          <template v-if="column.key === 'user_name'">
            <div
              v-if="searchViewType !== 'admin' || isAdmin === 1"
              style="text-align: center"
            >
              {{ record.user_name }}
            </div>
            <div v-else style="text-align: center">관리자</div>
          </template>
          <!--금지어내용-->
          <template v-if="column.key === 'filter_word'">
            <div style="text-align: center">{{ record.filter_word }}</div>
          </template>
          <!--삭제버튼-->
          <template v-if="column.key === 'delete'">
            <div
              v-if="searchViewType !== 'admin' || isAdmin === 1"
              style="text-align: center"
            >
              <a-button ghost danger @click="deleteApi([record.id], record.id)"
                >단일삭제</a-button
              >
            </div>
            <div v-else style="text-align: center"></div>
          </template>
        </template>
      </a-table>
    </div>

    <!--paging-->
    <div class="w100 center top h50" style="background-color: white">
      <a-pagination
        v-model:current="current"
        :page-size-options="pageSizeOptions"
        :total="total"
        show-size-changer
        :page-size="pageSize"
        @change="onChange"
      >
      </a-pagination>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import Cookie from "js-cookie";
import Loading from "vue-loading-overlay";
import { AuthRequest } from "util/request";
import "vue-loading-overlay/dist/vue-loading.css";
import { lib } from "@/util/lib";
export default defineComponent({
  components: { Loading },
  setup() {
    /* 로딩 Ref */
    const loading = ref(false);

    /* 기본 Ref */
    const userId = ref(0);
    const isAdmin = ref(0);
    const userName = Cookie.get("member_name");

    /* 등록창 Ref */
    const visible = ref(false);
    const filterWord = ref("");
    /* 등록창 Method */
    const handleOk = () => {
      insertApi();
      visible.value = false;
    };
    const showModal = () => {
      visible.value = true;
    };

    /* 검색 Ref */
    const searchType = ref("search_filter_word");
    const searchValue = ref("");
    const searchViewType = ref("user");

    /* 리스트 Ref */
    const checkedId = ref([]);
    const dataSource = ref([]);
    /* 리스트 Fixed */
    const columns = [
      {
        title: "등록자",
        dataIndex: "user_name",
        key: "user_name",
        width: 100,
      },
      {
        title: "금지어 내용",
        dataIndex: "filter_word",
        key: "filter_word",
        width: 100,
      },
      {
        title: "삭제",
        dataIndex: "delete",
        key: "delete",
        width: 100,
      },
    ];
    const rowSelection = {
      /* 체크박스선택 */
      onChange: (selectedRowKeys) => {
        checkedId.value = selectedRowKeys;
      },
      /* 체크박스설정 (선택불가) */
      getCheckboxProps: (record) => ({
        disabled: searchViewType.value === "admin" && isAdmin.value !== 1,
        name: record.name,
      }),
    };

    /* 페이징 Ref */
    const total = ref(0);
    const current = ref(1);
    const pageSizeRef = ref(10);
    const pageSizeOptions = ref(["10", "20", "30", "40", "50"]);
    /* 페이징 Method */
    const onChange = (iCurrent, iPageSize) => {
      current.value = iCurrent;
      pageSizeRef.value = iPageSize;
      searchApi();
    };

    /* Api Method */
    const insertApi = () => {
      /* 파람 받아오기 */
      let sFilterProductWords = filterWord.value;
      /* 빈자리 존재하면 지워버림 */
      sFilterProductWords = sFilterProductWords.trim().replaceAll(" ", "");

      /* 등록할 데이터 없음 처리안함 */
      if (lib.isString(sFilterProductWords, true) === false) {
        message.warning("정확한 상품명 금지어를 입력해 주세요.");
        return false;
      }

      /* 콤마로 구분함 */
      let aFilterProductWords = sFilterProductWords.split(",");
      /* 같은 데이터는 삭제함 */
      aFilterProductWords = [...new Set(aFilterProductWords)];

      /* 등록할 데이터 없음 처리안함 */
      if (lib.isArray(aFilterProductWords, true) === false) {
        message.warning("정확한 상품명 금지어를 입력해 주세요.");
        return false;
      }

      /* 단어길이 체크 최대 10자 */
      let aFail = aFilterProductWords.filter(
        (sFilterWord) => sFilterWord.length >= 100
      );
      if (aFail.length > 0) {
        message.warning(
          "상품명 금지어 최대길이는 100자 이내로 입력해 주세요.\n여러개 등록시 콤마로 구분합니다."
        );
        return false;
      }

      /* 등록시작 로딩 */
      loading.value = true;

      /* 등록 호출 */
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/filterword", {
        method: "add",
        filter_word: aFilterProductWords,
      }).then((res) => {
        /* 등록실패여부 및 로딩제거 */
        if (res.status !== "2000") {
          message.error(res.message);
          loading.value = false;
          return false;
        }

        filterWord.value = "";
        searchApi("insert");
        // message.success("성공");
        // loading.value = false;
      });
    };
    const deleteApi = (aDelete) => {
      if (lib.isArray(aDelete, true) === false) {
        message.warning("삭제할 금지어를 선택해 주세요.");
        return false;
      }

      loading.value = true;
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/filterword", {
        id: aDelete,
        method: "delete",
      }).then((res) => {
        /* 실패 로딩제거 */
        if (res.status !== "2000") {
          message.error(res.message);
          loading.value = false;
          return false;
        }

        searchApi("delete");

        // message.success("성공");
        // loading.value = false;
      });
    };
    const searchApi = (sStatus = "") => {
      let iOffset = (current.value - 1) * pageSizeRef.value;
      iOffset = iOffset < 0 ? 0 : iOffset;

      /* 최초열기 혹은 추가시 자동으로 타입선택 */
      if (["init", "insert"].includes(sStatus) === true) {
        let bIsAdmin = Cookie.get("member_roles").indexOf("ROLE_ADMIN") !== -1;
        searchViewType.value = bIsAdmin ? "admin" : "user";
      }

      let oParam = {
        method: "search",
        limit: pageSizeRef.value,
        offset: iOffset,
        search_type: searchType.value,
        search_value: searchValue.value,
        search_view_type: searchViewType.value,
      };

      loading.value = true;

      AuthRequest.post(
        process.env.VUE_APP_API_URL + "/api/filterword",
        oParam
      ).then((res) => {
        /* 실패 로딩제거 */
        if (res.status !== "2000") {
          message.error(res.message);
          loading.value = false;
          return false;
        }

        total.value = Number(res.data.count);
        userId.value = Number(res.data.user_id);
        isAdmin.value = Number(res.data.is_admin);

        let aTempDataSource = [];
        res.data.list.map((r) => {
          aTempDataSource.push({
            key: r.id,
            id: r.id,
            user_name: r.user_name,
            filter_word: r.filter_word,
          });
        });
        dataSource.value = aTempDataSource;

        if (["insert", "delete"].includes(sStatus) === true) {
          message.success("성공");
        }
        loading.value = false;
      });
    };

    /* Init */
    onMounted(async () => {
      searchApi("init");
    });

    return {
      /* 로딩 Ref */
      loading,

      /* 기본 Ref */
      userId,
      isAdmin,
      userName,

      /* 검색 Ref */
      searchType,
      searchValue,
      searchViewType,

      /* 등록창 Ref */
      visible,
      filterWord,
      /* 등록창 Method */
      handleOk,
      showModal,

      /* 리스트 Ref */
      checkedId,
      dataSource,
      /* 리스트 Fixed */
      columns,
      rowSelection,

      /* 페이징 Ref */
      total,
      current,
      pageSize: pageSizeRef,
      pageSizeOptions,
      /* 페이징 Method */
      onChange,

      /* Api Method */
      insertApi,
      searchApi,
      deleteApi,
    };
  },
});
</script>
<style>
#filterWordContainer .ant-pagination-disabled {
  display: none !important;
}
</style>
