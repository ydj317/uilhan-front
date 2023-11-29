<script setup>

import {PushpinTwoTone, EyeOutlined} from "@ant-design/icons-vue";
import {computed, onBeforeMount, onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {AuthRequest} from "@/util/request";
import { message } from "ant-design-vue";

const router = useRouter();

let datasource = ref([]);
let total = ref(0);
let loading = ref(false);
let checked = ref(true);
let selectedRowKeys = ref([]);

const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    params: {
      type: 'notice',
      title: '',
      page: 1,
      pageSize: 20,
    },
  }
});

const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total, range) => `현재 ${range[0]}-${range[1]}건 / 총 ${total}건`,
  pageSizeOptions: ['10', '20', '50'],
  onChange: page => {
    pagination.value.current = page;
  },
  onShowSizeChange: (current, pageSize) => {
    pagination.value.current = 1;
    pagination.value.pageSize = pageSize;
  },
});

/** 테이블 헤드 */
const table_columns = computed(() => {
  return [
    {title: 'ID', dataIndex: 'id', width: 50},
    {title: '제목', dataIndex: 'title',},
    {title: '시간', dataIndex: 'insDate', width: '20%'},
    {title: '보기', key: 'action', fixed: 'right', width: 100, align: 'center',},
  ]
})

/**
 * 게시판 리스트
 */
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

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

const handleSearch = () => {
  getBoardList();
}

const pageChangeHandler = (page) => {
  state.tableData.params.page = page;
  getBoardList();
}

onMounted(() => {
  getBoardList()
})
</script>

<template>
  <a-card :bordered="false" :loading="state.tableData.loading" title="공지사항">
    <div style="display: flex;justify-content: right;">
    <a-space>
      <a-input v-model:value="state.tableData.params.title" style="width: 200px;" allowClear/>
      <a-button type="primary" @click.prevent="handleSearch" >검색</a-button>
    </a-space>
    </div>

    <a-table :data-source="state.tableData.data" :loading="state.tableData.loading" :rowSelection="rowSelection"
             :pagination="false" :defaultExpandAllRows="true" size="small" class="mt15"
    >
      <a-table-column title="ID" dataIndex="id" key="id" />
      <a-table-column title="제목" dataIndex="title" key="title" />
      <a-table-column title="시간" dataIndex="insDate" key="insDate" />
      <a-table-column title="보기" dataIndex="controller" key="controller">
        <template #default="{ record }">
        <router-link :to="`/board/notice/view/${record.id}`">
          <a-button type="primary" size="small">
            <template #icon><eye-outlined/></template>
          </a-button>
        </router-link>
        </template>
      </a-table-column>
    </a-table>
    <a-pagination :total="state.tableData.total" :page-size="state.tableData.params.pageSize"
                  :current="state.tableData.params.page" @change="pageChangeHandler" class="mt15" />
  </a-card>
</template>