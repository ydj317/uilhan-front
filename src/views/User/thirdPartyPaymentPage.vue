<template>
    <a-card title="模拟第三方支付" :bordered="false">
        <a-button @click="handlePay">用户支付完成</a-button>
    </a-card>
</template>


<script setup>

import { useRoute } from 'vue-router';
import { AuthRequest } from "@/util/request";
import { message } from "ant-design-vue";

const route = useRoute();

const handlePay = () => {
  console.log(route.query);
  let arrList = [];
  if (Array.isArray(route.query.orderList)){
    arrList = [...route.query.orderList]
  }else {
    arrList.push(route.query.orderList)
  }
  requestPost('/api/user/order/update/payed',{
    orderIds: arrList
  }, (res) => {
      if (res){
        message.success('确认支付 状态更改成功')
      }
  });
}

const requestPost = (url, params, callback) => {

  AuthRequest.post(process.env.VUE_APP_API_URL + url,
    params
  ).then((res) => {
    /* fail */
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    callback(res.data);


  }).catch((error) => {
    message.error('Error fetching data:', error);
  })

}

</script>

<style scoped>

</style>