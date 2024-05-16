<script setup>

import {EditOutlined, PlusOutlined, DeleteOutlined, PushpinTwoTone, EyeOutlined} from "@ant-design/icons-vue";
import {computed, onBeforeMount, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {AuthRequest} from "@/util/request";
import { message } from "ant-design-vue";

const router = useRouter();

let datasource = ref([]);
let total = ref(0);
let loading = ref(false);
let checked = ref(true);
let deleteLoading = ref(false);
let selectedRowKeys = ref([]);

const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    params: {
      type: '',
      title: '',
      page: 1,
      pageSize: 20,
    },
  }
});

const rowSelection = {
  onChange: (Keys, Rows) => {
    selectedRowKeys.value = Keys
    console.log('selectedRowKeys:', Keys, 'selectedRows: ', Rows);
  }
};

const getBoardList = () => {
  state.tableData.loading = true

  //const params = ''
  const params = {params: state.tableData.params}
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/list', params).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }
    const { total, rows } = res.data
    state.tableData.total = total
    state.tableData.data = rows

  }).catch((error) => {
    message.error(error.message+' - ')
    return false;
  }).finally(() => {
    state.tableData.loading = false;
  });
}

/**
 * 선택삭제
 */
const deleteSelectedData = () => {
  deleteLoading.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + '/api/board/remove', {ids: selectedRowKeys.value}).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      deleteLoading.value = false;
      return false;
    }

    let data = res.data;
    message.success(data.message);

    deleteLoading.value = false;
    selectedRowKeys.value = [];
    getBoardList()
  }).catch((error) => {
    message.error(error.message);
    deleteLoading.value = false;
    return false;
  });
}

const pageChangeHandler = (page) => {
  state.tableData.params.page = page;
  getBoardList();
}

onBeforeMount(() => {
  getBoardList()
})
</script>

<template>
  <a-card :bordered="false" :loading="loading">
    <a-row type="flex" justify="space-between" :wrap="false" :style="{marginBottom:'10px'}">
      <a-col>
        <a-popconfirm
            title="선택한 공지사항을 삭제하시겠습니까?"
            ok-text="네"
            cancel-text="아니요"
            @confirm="deleteSelectedData"
            :disabled="Array.isArray(selectedRowKeys) && selectedRowKeys.length === 0"
        >
          <a-button type="primary" :loading="deleteLoading"
                     :disabled="Array.isArray(selectedRowKeys) && selectedRowKeys.length === 0">
            <template #icon>
              <delete-outlined/>
            </template>
            선택삭제
          </a-button>
        </a-popconfirm>
      </a-col>
      <a-col>
        <router-link to="/board/form">
          <a-button type="primary">
            <template #icon>
              <plus-outlined/>
            </template>
            등록
          </a-button>
        </router-link>
      </a-col>
    </a-row>
    <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :rowSelection="rowSelection"
             :pagination="false" :defaultExpandAllRows="true" size="small" class="mt15"
    >
      <a-table-column title="ID" dataIndex="id" key="id" />
      <a-table-column title="제목" dataIndex="title" key="title" />
      <a-table-column title="시간" dataIndex="insDate" key="insDate" />
      <a-table-column title="수정" dataIndex="controller" key="controller">
        <template #default="{ record }">
          <router-link :to="`/board/form/${record.id}`">
            <a-button type="primary" size="small">
              <template #icon><edit-outlined/></template>
            </a-button>
          </router-link>
        </template>
      </a-table-column>
    </a-table>
    <a-pagination :total="state.tableData.total" :page-size="state.tableData.params.pageSize"
                  :current="state.tableData.params.page" @change="pageChangeHandler" class="mt15" />
  </a-card>
</template>