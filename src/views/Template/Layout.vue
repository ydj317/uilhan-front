<template>
  <div id="Layout" class="row">
    <div id="Layout-left" class="w13">
      <Sider></Sider>
    </div>
    <div id="Layout-right" class="w87 col space-between bg-f4f8f9">
      <div>
        <Header class="h100 bg-3051d3"></Header>
        <Content class="plrb20 bg-f4f8f9"></Content>
      </div>
      <Footer class="h60 bg-white"></Footer>
    </div>
  </div>
</template>

<script>
import 'assets/css/global.css'
import 'ant-design-vue/dist/antd.css';
import Sider from 'views/Template/Sider.vue';
import Header from 'views/Template/Header.vue';
import Content from 'views/Template/Content.vue';
import Footer from 'views/Template/Footer.vue';

export default {
  components: {
    Sider,
    Header,
    Content,
    Footer
  },

  mounted() {
    ['Layout', 'Layout-left', 'Layout-right'].map(id => {
      document.querySelector(`#${id}`).style.minHeight = window.innerHeight + 'px';
    })
  }
};

</script>

<style scoped></style>