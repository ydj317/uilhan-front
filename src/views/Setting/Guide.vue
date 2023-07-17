<template>
  <loading
    v-model:active="indicator"
    :can-cancel="false"
    :is-full-page="true"
  />
  <a-card :loading="cardLoading" :bordered="false" title="안내정보">
    <a-row type="flex" justify="space-between" :wrap="false" :style="{marginBottom:'10px'}">
      <a-col>
        <a-popconfirm title="삭제하시겠습니까?" @confirm="selectedDelete">
          <a-button>선택삭제</a-button>
        </a-popconfirm>
      </a-col>
      <a-col>
        <router-link to="/setting/guideForm">
          <a-button type="primary">
            <plus-outlined />
            등록
          </a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-table :columns="table_columns" :data-source="guideData"
             :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :pagination="pagination">
      <template #bodyCell="{ column,record, text }">
        <!--안내정보명-->
        <template v-if="column.key === 'name'">
          <div style="text-align: left">
            {{ record.name }}
            <a-tag v-if="record.isDefault === '1'" style="margin-left: 10px;">기본</a-tag>
          </div>
        </template>

        <!--수정-->
        <template v-if="column.key === 'edit'">
          <router-link :to="`/setting/guideForm/${record.id}`">
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
import "vue-loading-overlay/dist/vue-loading.css";
import Loading from "vue-loading-overlay";
import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";
import { EditOutlined, PlusOutlined } from "@ant-design/icons-vue";

// loading
const indicator = ref(false);
const cardLoading = ref(true);

const guideData = ref([]);
const table_columns = ref([
  {
    title: "안내정보명",
    key: "name",
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
  const filteredIds = guideData.value
    .filter(item => item.checked === true)
    .map(item => item.id);

  const newData = guideData.value.filter(item => item.checked === false);

  indicator.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/guide/delete", { ids: filteredIds }).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        indicator.value = false;
        return false;
      }

      guideData.value = newData;

      indicator.value = false;
    }
  );
}

function onSelectChange(selectedKeys) {
  selectedRowKeys.value = selectedKeys;

  for (let i = 0; i < guideData.value.length; i++) {
    guideData.value[i].checked = selectedRowKeys.value.includes(guideData.value[i].key);
  }
}

function getGuide() {
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/guide/list").then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
      }

      guideData.value = res.data;

      for (let i = 0; i < guideData.value.length; i++) {
        guideData.value[i].key = i;
        guideData.value[i].checked = false;
      }

      cardLoading.value = false;
    }
  );
}

onMounted(() => {
  getGuide();
});

</script>

<style scoped>
</style>