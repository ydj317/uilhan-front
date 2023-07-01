<script setup>

import {EditOutlined, PlusOutlined, DeleteOutlined, PushpinTwoTone} from "@ant-design/icons-vue";
import {computed, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import {AuthRequest} from "@/util/request";

const router = useRouter();

let datasource = ref([]);
let loading = ref(false);
let checked = ref(true);
let deleteLoading = ref(false);
let selectedRowKeys = ref([]);

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
  loading.value = true

  const params = {params: {type: 'question'}}

  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/questionList', params).then((res) => {
    if (res.status !== '2000') {
      loading.value = false;
      alert(res.message)
      return false;
    }

    datasource.value = Object.values(res.data)
    loading.value = false;

  }).catch((error) => {
    loading.value = false;
    alert(error.message);
    return false;
  });
}

onBeforeMount(() => {
  getBoardList()
})
</script>

<template>
  <a-card :bordered="false" :loading="loading">
    <a-row type="flex" justify="space-between" :wrap="false" :style="{marginBottom:'10px'}">
      <a-col>

      </a-col>
      <a-col>
        <router-link to="/board/question/form">
          <a-button type="primary">
            <template #icon>
              <plus-outlined/>
            </template>
            등록
          </a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-table :columns="table_columns" :data-source="datasource" :pagination="pagination">
      <template #bodyCell="{ column,record, text }">
        <template v-if="column.dataIndex === 'title'">
          <router-link :to="`/board/question/view/${record.id}`">
            <pushpin-two-tone two-tone-color="#eb2f96" v-if="record.isFixtop === true"/>
            {{ text }}
          </router-link>
        </template>

        <template v-if="column.dataIndex === 'type'">
          <a-tag color="pink" v-if="text === 'question'">{{ text }}</a-tag>
          <a-tag v-else>{{ text }}</a-tag>
        </template>

        <template v-if="column.key === 'action'">
          <span>
            <router-link :to="`/board/question/form/${record.id}`">
              <a-button type="primary" size="small">
                <template #icon><edit-outlined/></template>
              </a-button>
            </router-link>
          </span>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<style scoped>

</style>