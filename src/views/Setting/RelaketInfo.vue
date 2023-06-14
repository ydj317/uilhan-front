<script setup>
import {AuthRequest} from "@/util/request";
import {onMounted} from "vue";

const getRelaketInfo = () => {
  AuthRequest.post(process.env.VUE_APP_API_URL + '/api/setting/relaketInfo').then((res) => {
    if (res.status !== '2000') {
      alert(res.message)
      return false;
    }

    alert('수동 주문수집이 요청 되었습니다.' + "\n" + '수집이 완료되기까지 대략 5분정도 소요 됩니다.');
  });
};
onMounted(() => {
  getRelaketInfo();
})
</script>

<template>
  <h1>릴라켓정보</h1>
</template>

<style scoped>

</style>