<template>
  <div class="contentBackColor">
    <div class="contentTitleWrap">
      <div class="contentTitle"></div>
    </div>
    <div class="contentBodyWrap">
      <div class="contentBody">
        <router-view></router-view>
      </div>
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

<style scoped>
.contentBackColor {
  height: 100%;
  background-color: #f4f8f9;
}

.contentTitleWrap {
  height: 34px;
  background-color: #3051d3!important;
  text-align: center;
  padding-left: 12px;
  padding-right: 12px;
}

.contentBodyWrap {
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
}

.contentBody {
  background-color: #fff;
}

.contentBody {
  height: 100%;
}

.contentTitle {
  background-color: #fff;
  height: 100%;
}
</style>
