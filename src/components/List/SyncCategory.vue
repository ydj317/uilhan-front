<script setup>
import {AuthRequest} from "@/util/request";
import {onBeforeMount, ref} from "vue";

const categorys = ref('');
const options = ref([]);
const loding = ref(false);
const categoryID = ref('');

const loadData = selectedOptions => {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  let param = {
    pid: targetOption.value,
    cate_market: "Relaket"
  }
  setTimeout(() => {
    AuthRequest.get(process.env.VUE_APP_API_URL + '/api/getcate', {params: param}).then((res) => {
      if (res.status !== '2000') {
        alert(res.message)
      }
      targetOption.loading = false;
      targetOption.children = JSON.parse(JSON.stringify(res.data))

      options.value = [...options.value];
    });
  }, 100)


};


const getCategory = (param, type) => {
  param.cate_market = "Relaket";
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/getcate', {params: param}).then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
    }

    options.value = JSON.parse(JSON.stringify(res.data))
  });
};

const getParentAll = (cid) => {
  if (!cid) {
    alert('카테고리ID를 입력해주세요.')
    return;
  }

  loding.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + "/api/category/sync", {
    params: {
      market_code: 'relaket',
      cid: cid
    }
  }).then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
    }
    alert(`[${cid}] 수집완료`)
    loding.value = false;
  });
}

const parentCateIds = [
  {'cid': '001000000000000', 'cn_name': '家具/室内装', 'kor_name': '가구/인테리어'},
  {'cid': '002000000000000', 'cn_name': '家用电器', 'kor_name': '가전'},
  {'cid': '003000000000000', 'cn_name': '健康', 'kor_name': '건강'},
  {'cid': '004000000000000', 'cn_name': '数字的', 'kor_name': '디지털'},
  {'cid': '005000000000000', 'cn_name': '短语', 'kor_name': '문구'},
  {'cid': '006000000000000', 'cn_name': '宠物用品', 'kor_name': '반려동물 용품'},
  {'cid': '007000000000000', 'cn_name': '美丽', 'kor_name': '뷰티'},
  {'cid': '008000000000000', 'cn_name': '品牌时尚', 'kor_name': '브랜드패션'},
  {'cid': '009000000000000', 'cn_name': '日用品/厨房', 'kor_name': '생필품/주방'},
  {'cid': '010000000000000', 'cn_name': '运动/休闲', 'kor_name': '스포츠/레저'},
  {'cid': '011000000000000', 'cn_name': '食物', 'kor_name': '식품'},
  {'cid': '012000000000000', 'cn_name': '衣服', 'kor_name': '의류'},
  {'cid': '013000000000000', 'cn_name': '汽车/工具', 'kor_name': '자동차/공구'},
  {'cid': '014000000000000', 'cn_name': '东西', 'kor_name': '잡화'},
  {'cid': '015000000000000', 'cn_name': '分娩/育儿', 'kor_name': '출산/육아'},
  {'cid': '016000000000000', 'cn_name': '爱好', 'kor_name': '취미'},
  {'cid': '017000000000000', 'cn_name': '计算机', 'kor_name': '컴퓨터'},
  {'cid': '018000000000000', 'cn_name': '海外直购/代购', 'kor_name': '해외직구/구매대행'},
  {'cid': '019000000000000', 'cn_name': '海外品牌', 'kor_name': '해외브랜드'},
  {'cid': '020000000000000', 'cn_name': '其他(ETC)', 'kor_name': '기타(ETC)'}
]

onBeforeMount(() => {
  getCategory({pid: 0}, 0)
})
</script>

<template>
  <a-card title="카테고리 확인" :bordered="true" hoverable>
    <div>{{ categorys }}</div>
    <a-cascader
        v-model:value="categorys"
        :options="options"
        :load-data="loadData"
        placeholder="카테고리를 선택해 주세요."
        change-on-select
        dropdownClassName="categorySelect"
        style="width: 100%"
    />
  </a-card>
  <a-divider></a-divider>
  <a-card title="카테고리 개별수집" :bordered="true" hoverable>
    <a-input v-model:value="categoryID" placeholder="수집할 카테고리 입력" style="width: 200px;margin-right: 5px;"/>
    <a-button @click="getParentAll(categoryID)" :loading="loding">수집</a-button>
  </a-card>
  <a-divider></a-divider>
  <a-card title="카테고리 대분류수집" :bordered="true" hoverable>
    <a-list item-layout="horizontal" :data-source="parentCateIds">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta
              :description="item.cn_name"
          >
            <template #title>
              {{ item.kor_name }}
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-button @click="getParentAll(item.cid)" :loading="loding">수집</a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<style scoped>

</style>