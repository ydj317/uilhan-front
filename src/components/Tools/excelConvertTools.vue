<script setup>
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {reactive, ref} from "vue";

const fileList = ref([])
const formStat = reactive({
  list: [
    {name: 'JACKET', percent: 1},
    {name: 'KNIT', percent: 10},
    {name: 'ONEPIECE', percent: 10},
    {name: 'PANTS', percent: 5},
    {name: 'SHIRT', percent: 4},
    {name: 'SKIRT', percent: 10},
    {name: 'T-SHIRT', percent: 10},
  ]
});

const handleChange = info => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};

const handleDrop = (e) => {
  console.log(e);
}
</script>

<template>
  <a-card bordered hoverable title="엑셀 컨버터 툴">
    <div>
      <a-upload-dragger
          v-model:fileList="fileList"
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          @change="handleChange"
          @drop="handleDrop"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">Click or drag file to this area to upload</p>
        <p class="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
          band files
        </p>
      </a-upload-dragger>
    </div>
    <a-divider></a-divider>
    <div>
    <a-list :data-source="formStat.list" :loading="false">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
          <template #title>
            {{ item.name }}
          </template>
          </a-list-item-meta>
          <template #actions>
            <a-input-number v-model:value="item.percent" />%
          </template>
        </a-list-item>
      </template>
      <template #footer style="display: flex;justify-content: center;text-align: center;width: 100%;border:1px solid red;">
        <a-button>저장</a-button>
      </template>
    </a-list>
    </div>
  </a-card>
</template>

<style scoped>

</style>