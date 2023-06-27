<script setup>
import {useRoute, useRouter} from "vue-router";
import {computed, onBeforeMount, reactive, ref} from "vue";
import { message } from 'ant-design-vue';
import {AuthRequest} from "@/util/request";
import {
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();

let datasource  = ref([]);
let loading = ref(true);

const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total,range) => `현재 ${range[0]}-${range[1]}건 / 총 ${total}건`,
  pageSizeOptions: ['10', '20', '50'],
  onChange: page => {
    pagination.value.current = page;
  },
  onShowSizeChange: (current, pageSize) => {
    pagination.value.current = 1;
    pagination.value.pageSize = pageSize;
  },
});
const status = [
  {name:'연동대기',style:''},
  {name:'연동중',style:'green'},
]

/**
 * 배송정책 리스트
 */
const getDeliveryList = () => {
  loading.value = true
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delivery/list').then((res) => {
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

/** 테이블 헤드 */
const table_columns = computed(() => {
  return [
    { title: 'ID', dataIndex: 'dt_ix', },
    { title: '배송정책명', dataIndex: 'template_name', },
    { title: '배송비', dataIndex: 'delivery_price', },
    { title: '수정', key: 'action', fixed: 'right', width: 100,align:'center',},
  ]
})

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys:',selectedRowKeys, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({

  }),
};

onBeforeMount(() => {
  getDeliveryList()
})

</script>

<template>
  <a-card :bordered="false" title="배송정책" :style="{marginBottom:'20px'}">

<!--    <div>-->
<!--        샘플 텍스트-->
<!--    </div>-->
  </a-card>

  <a-card :bordered="false" :loading="loading">
    <a-row type="flex" justify="space-between" :wrap="false" :style="{marginBottom:'10px'}">
      <a-col>
<!--        <a-button type="primary" danger><template #icon><delete-outlined /></template>선택삭제</a-button>-->
      </a-col>
      <a-col>
        <router-link to="/setting/delivery/form"><a-button type="primary" danger><template #icon><plus-outlined /></template>등록</a-button></router-link>
      </a-col>
    </a-row>

    <a-table :columns="table_columns" :data-source="datasource" :row-selection="rowSelection" :pagination="pagination">
      <template #bodyCell="{ column,record, text }">
        <template v-if="column.dataIndex === 'status'">
          <a><a-tag :color="status[text]['style']">{{ status[text]['name'] }}</a-tag></a>
        </template>

        <template v-else-if="column.key === 'action'">
          <span>
            <router-link :to="`/setting/delivery/form/${record.dt_ix}`">
              <a-button type="primary" size="small">
                <template #icon><edit-outlined /></template>
              </a-button>
            </router-link>
<!--            <a-divider type="vertical" />-->
<!--            <a-button type="primary" danger>-->
<!--              <template #icon><delete-outlined /></template>-->
<!--            </a-button>-->
          </span>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<style scoped>

</style>