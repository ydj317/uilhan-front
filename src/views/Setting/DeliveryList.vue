<script setup>
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import {AuthRequest} from "@/util/request";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SyncOutlined
} from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();


let datasource  = ref([]);
let loading = ref(false);
let buttonLoading = ref(false);

/**
 * 배송정책 리스트
 */
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

/** 테이블 헤드*/
const table_columns = computed(() => {
  return [
    { title: 'ID', dataIndex: 'id', },
    { title: 'DtIx', dataIndex: 'dtIx', },
    { title: '배송정책명', dataIndex: 'templateName', },
    { title: '시간', dataIndex: 'updDate', },
    { title: '수정', key: 'action', },
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
  buttonLoading.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delivery/syncDelivery').then((res) => {
    if (res.status !== '2000') {
      buttonLoading.value = false;
      alert(res.message)
      return false;
    }
    buttonLoading.value = false;
    getDeliveryList()
  }).catch((error) => {
    buttonLoading.value = false;
    alert(error.message);
    return false;
  });
}

const syncDeliveryOutAddress = () => {
  buttonLoading.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delivery/syncDeliveryOutAddress').then((res) => {
    if (res.status !== '2000') {
      buttonLoading.value = false;
      alert(res.message)
      return false;
    }
    buttonLoading.value = false;
    getDeliveryList()
  }).catch((error) => {
    buttonLoading.value = false;
    alert(error.message);
    return false;
  });
}

const syncDeliveryInAddress = () => {
  buttonLoading.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/delivery/syncDeliveryInAddress').then((res) => {
    if (res.status !== '2000') {
      buttonLoading.value = false;
      alert(res.message)
      return false;
    }
    buttonLoading.value = false;
    getDeliveryList()
  }).catch((error) => {
    buttonLoading.value = false;
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
        <a-button type="primary" @click="syncDelivery" :loading="buttonLoading"><template #icon><sync-outlined/></template>수집</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button type="primary" @click="syncDeliveryOutAddress" :loading="buttonLoading"><template #icon><sync-outlined /></template>출고지 수집</a-button>
        <a-divider type="vertical"></a-divider>
        <a-button type="primary" @click="syncDeliveryInAddress" :loading="buttonLoading"><template #icon><sync-outlined /></template>교환/반품지 수집</a-button>
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