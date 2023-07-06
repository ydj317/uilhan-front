<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cartLoading" :bordered="false" title="서비스 관리">
    <a-row type="flex" justify="space-between" :wrap="false" :style="{marginBottom:'10px'}">
      <a-col>
        <a-popconfirm title="삭제하시겠습니까?" @confirm="selectedDelete">
          <a-button>선택삭제</a-button>
        </a-popconfirm>
      </a-col>
      <a-col>
        <router-link to="/user/licenseForm">
          <a-button type="primary">
            <plus-outlined />
            등록
          </a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-table :columns="table_columns" :data-source="licenseData"
             :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :pagination="pagination">
      <template #bodyCell="{ column,record, text }">
        <!--서비스명-->
        <template v-if="column.key === 'name'">
          <div style="text-align: left">
            {{ record.name }}
            <a-tag style="margin-left: 10px;">{{ record.day }}일</a-tag>
          </div>
        </template>

        <!--가격-->
        <template v-if="column.key === 'price'">
          {{ record.price.toLocaleString() }}
        </template>

        <!--사용여부-->
        <template v-if="column.key === 'status'">
          <a-tag v-if="record.status === '1'" color="success">사용중</a-tag>
          <a-tag v-if="record.status === '0'" color="error">사용중지</a-tag>
        </template>

        <!--수정-->
        <template v-if="column.key === 'edit'">
          <router-link :to="`/user/licenseForm/${record.id}`">
            <a-button type="primary" size="small">
              <template #icon>
                <edit-outlined />
              </template>
            </a-button>
          </router-link>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import { AuthRequest } from "@/util/request";
import { onMounted, ref } from "vue";
import { EditOutlined, PlusOutlined } from "@ant-design/icons-vue";
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";

// loading
const indicator = ref(false);
const cartLoading = ref(true);

const licenseData = ref([]);
const table_columns = ref([
  {
    title: "서비스 명",
    key: "name",
    align: "center"
  },
  {
    title: "가격",
    key: "price",
    width: "15%",
    align: "center"
  },
  {
    title: "사용여부",
    key: "status",
    width: "15%",
    align: "center"
  },
  {
    title: "수정",
    key: "edit",
    width: "5%",
    align: "center"
  }
]);
const selectedRowKeys = ref([]);
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

function selectedDelete() {
  const filteredIds = licenseData.value
    .filter(item => item.checked === true)
    .map(item => item.id);

  const newLicense = licenseData.value.filter(item => item.checked === false);

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/license/delete", { ids: filteredIds }).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
        indicator.value = false;
        return false;
      }

      licenseData.value = newLicense;

      indicator.value = false;
    }
  );
}

function onSelectChange(selectedKeys) {
  selectedRowKeys.value = selectedKeys;

  for (let i = 0; i < licenseData.value.length; i++) {
    licenseData.value[i].checked = selectedRowKeys.value.includes(licenseData.value[i].key);
  }
}

function getLicense() {
  const requestParams = {
    orderBy: "desc"
  };
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/license/list", { params: requestParams }).then((res) => {
      if (res.status !== "2000") {
        alert(res.message);
      }

      licenseData.value = res.data;

      for (let i = 0; i < licenseData.value.length; i++) {
        licenseData.value[i].key = i;
        licenseData.value[i].checked = false;
      }

      cartLoading.value = false;
    }
  );
}

onMounted(() => {
  getLicense();
});
</script>

<style scoped>
</style>