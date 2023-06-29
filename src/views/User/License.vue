<template>
  <a-card :loading="cartLoading" :bordered="false" title="서비스 리스트">
    <a-row type="flex" justify="space-between" :wrap="false" :style="{marginBottom:'10px'}">
      <a-col>
        <a-button>선택삭제</a-button>
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

    <a-table :columns="table_columns" :data-source="licenseList"
             :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
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
        <template v-if="column.key === 'is_use'">
          <a-tag v-if="record.is_use === 1" color="success">사용중</a-tag>
          <a-tag v-else color="error">사용안함</a-tag>
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

// loading
const cartLoading = ref(true);

const licenseList = ref([]);
const table_columns = ref([
  {
    title: "서비스명",
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
    key: "is_use",
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

function onSelectChange(selectedKeys) {
  selectedRowKeys.value = selectedKeys;

  for (let i = 0; i < licenseList.value.length; i++) {
    licenseList.value[i].checked = selectedRowKeys.value.includes(licenseList.value[i].key);
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

      licenseList.value = res.data;

      for (let i = 0; i < licenseList.value.length; i++) {
        licenseList.value[i].key = i;
        licenseList.value[i].checked = false;
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