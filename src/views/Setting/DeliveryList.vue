<script setup>
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import {AuthRequest} from "@/util/request";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();


let datasource  = ref([]);
let loading = ref(false);
let bloading = ref(false);
const getDeliveryList = () => {
  loading.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delivery/list').then((res) => {
    if (res.status !== '2000') {
      loading.value = false;
      alert(res.message)
      return false;
    }
    loading.value = false;
    datasource.value = res.data;
  }).catch((error) => {
    loading.value = false;
    alert(error.message);
    return false;
  });
}

const table_columns = computed(() => {
  return [
    { title: 'ID', dataIndex: 'id', },
    { title: 'DtIx', dataIndex: 'dtIx', },
    { title: '배송정책명', dataIndex: 'templateName', },
    { title: '시간', dataIndex: 'updDate', },
    { title: '조작', key: 'action', },
  ]
})

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys:',selectedRowKeys, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({

  }),
};

const syncDelivery = () => {
  bloading.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delivery/syncDelivery').then((res) => {
    if (res.status !== '2000') {
      bloading.value = false;
      alert(res.message)
      return false;
    }
    bloading.value = false;
    getDeliveryList()
  }).catch((error) => {
    bloading.value = false;
    alert(error.message);
    return false;
  });
}

onMounted(() => {
  getDeliveryList()
})

</script>

<template>
  <a-card :bordered="false" title="배송정책" :style="{marginBottom:'20px'}">
    <div>
        샘플 텍스트
    </div>
  </a-card>

  <a-card :bordered="false" :loading="loading">
    <a-row type="flex" justify="space-between" :wrap="false" :style="{marginBottom:'10px'}">
      <a-col><a-button type="primary" danger><template #icon><delete-outlined /></template>선택삭제</a-button></a-col>
      <a-col>
        <a-button type="primary" @click="syncDelivery" :loading="bloading"><template #icon><edit-outlined /></template>수집</a-button>
        <a-divider type="vertical"></a-divider>
        <router-link to="/setting/delivery/form"><a-button type="primary" danger><template #icon><plus-outlined /></template>등록</a-button></router-link>
      </a-col>
    </a-row>

    <a-table :columns="table_columns" :data-source="datasource" :row-selection="rowSelection" >
      <template #bodyCell="{ column,record, text }">
        <template v-if="column.dataIndex === 'title'">
          <a>{{ text }}</a>
        </template>

        <template v-else-if="column.key === 'action'">
          <span>
            <router-link :to="`/setting/delivery/form/${record.id}`">
              <a-button type="primary">
                <template #icon><edit-outlined /></template>
              </a-button>
            </router-link>
            <a-divider type="vertical" />
            <a-button type="primary" danger>
              <template #icon><delete-outlined /></template>
            </a-button>
          </span>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<style scoped>

</style>