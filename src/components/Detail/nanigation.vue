<template>
  <div class="bg-white">
    <div class="wrap">
      <a-affix :style="{width: '100%'}">
        <div class="pt10 pb10" style="width: 100%; background-color: white;z-index: 0;box-shadow: 0 2px 4px rgba(173,173,173,0.2);">
<!--          <a-button danger @click="textTransModal">-->
<!--            <FileWordTwoTone twoToneColor="white" />-->
<!--            텍스트 번역-->
<!--          </a-button>-->
          <a-button @click="setNavigation('eModelTitle_' + i)" v-for="(name, i) in label">
            <AppstoreOutlined v-if="name === '기본 정보'"/>
            <PictureOutlined v-if="name === '대표 이미지'" />
            <SettingOutlined v-if="name === '옵션설정'" />
            <TagsOutlined v-if="name === '옵션정보'" />
            <SlidersOutlined v-if="name === '배송설정'" />
            <BuildOutlined v-if="name === '상세페이지'" />
            {{ name }}
          </a-button>
        </div>
      </a-affix>
    </div>
  </div>
</template>
<script>
import {
  AppstoreOutlined,
  PicCenterOutlined,
  PictureOutlined,
  SettingOutlined,
  TagsOutlined,
  BankOutlined,
  SlidersOutlined,
  ProjectOutlined,
  BuildOutlined,
} from '@ant-design/icons-vue';
import {mapState} from 'vuex';
import { message } from "ant-design-vue";

export default {
  components: {
    AppstoreOutlined,
    PicCenterOutlined,
    PictureOutlined,
    SettingOutlined,
    TagsOutlined,
    BankOutlined,
    SlidersOutlined,
    ProjectOutlined,
    BuildOutlined,
  },

  computed: {
    ...mapState([
      'product'
    ])
  },
  data() {
    return {
      test: '<AppstoreOutlined v-if="name === \'기본 정보\'" twoToneColor="red" />',
      label: [
        '기본 정보',
        '대표 이미지',
        '옵션설정',
        '옵션정보',
        // '배송설정',
        '상세페이지',
      ],
    };
  },

  methods: {
    textTransModal() {
      if (this.product.item_is_trans === true) {
        message.warning('이미 번역한 상품입니다.');
        return false;
      }

      this.product.text_trans_visible = true;
    },

    setNavigation(sIdName) {
      document.getElementById(sIdName).scrollIntoView({block: 'start', inline: 'nearest'});
      document.documentElement.scrollTop = document.documentElement.scrollTop - 50;
    },
  },
};
</script>

<style scoped>
button {
  height: 40px;
  text-align: left;
  padding-right: 20px;
  margin-left: 10px;
  border-radius: 5px;
}
/*button:first-child {*/
/*  color: white;*/
/*  border: 1px solid #3ddc97;*/
/*  margin-left: -4px;*/
/*  background-color: #3ddc97;*/
/*}*/
</style>
