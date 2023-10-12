<template>
  <a-card title="주문관리">
    <div>
      <div class="inline-block mr17">
        <h1>검색기간</h1>
        <a-input-group compact>
          <a-select v-model:value="date_type" style="width: 150px;">
            <a-select-option v-for="data in SEARCH_DATE_CONFIG" :value="data.key">{{ data.label }}</a-select-option>
          </a-select>
          <a-range-picker v-model:value="date" :placeholder="['Start Time', 'End Time']" format="YYYY-MM-DD"
            @change="onChangeDatePicker" style="width: 300px;" />
        </a-input-group>
      </div>
    </div>
  </a-card>

  <a-card>
    <div>
      <a-button type="primary" @click="handleCreateOrder">주문수집</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" rowKey="id">

    </a-table>
  </a-card>
</template>

<script setup>

const getTableData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: 1,
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
          },
          {
            id: 2,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
          },
          {
            id: 3,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
          },
        ],
        total: 3,
      })
    }, 1000)
  })
}

</script>