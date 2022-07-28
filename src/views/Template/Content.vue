<template>
  <div id="container">
    <div id="header" style="height: 30px;" class="center bg-3051d3">
      <div class="w97 h100 bg-white"></div>
    </div>
    <div id="content" class="center">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

//import { defineComponent, reactive, toRefs, watch, onMounted, ref } from "vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({

  setup() {
    const router = useRouter();
  }
});
</script>

<style scoped></style>

<!--<style scoped>-->
<!--.contentBackColor {-->
<!--  height: 100%;-->
<!--  background-color: #f4f8f9;-->
<!--}-->

<!--.contentTitleWrap {-->
<!--  height: 34px;-->
<!--  background-color: #3051d3!important;-->
<!--  text-align: center;-->
<!--  padding-left: 20px;-->
<!--  padding-right: 20px;-->
<!--}-->

<!--.contentBodyWrap {-->
<!--  width: 100%;-->
<!--  padding-left: 20px;-->
<!--  padding-right: 20px;-->
<!--}-->

<!--.contentBody {-->
<!--  background-color: #fff;-->
<!--}-->

<!--.contentBody {-->
<!--  height: 100%;-->
<!--}-->

<!--.contentTitle {-->
<!--  background-color: #fff;-->
<!--  height: 100%;-->
<!--}-->
<!--</style>-->
