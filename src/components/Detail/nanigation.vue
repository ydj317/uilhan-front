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
            <AppstoreTwoTone v-if="name === '기본 정보'"/>
            <PictureTwoTone v-if="name === '상품 이미지'" />
            <SettingTwoTone v-if="name === 'Spec'" />
            <TagsTwoTone v-if="name === 'SKU'" />
            <BankTwoTone v-if="name === '통관정보'" />
            <SlidersTwoTone v-if="name === '배송설정'" />
            <ProjectTwoTone v-if="name === '간략설명'" />
            <BuildTwoTone v-if="name === '상세설명'" />
            {{ name }}
          </a-button>
        </div>
      </a-affix>
    </div>
  </div>
</template>

<script>
import {
  FileWordTwoTone,
  AppstoreTwoTone,
  PictureTwoTone,
  SettingTwoTone,
  TagsTwoTone,
  BankTwoTone,
  SlidersTwoTone,
  ProjectTwoTone,
  BuildTwoTone,
} from '@ant-design/icons-vue';
import {mapState} from 'vuex';
import { message } from "ant-design-vue";

export default {
  components: {
    FileWordTwoTone,
    AppstoreTwoTone,
    PictureTwoTone,
    SettingTwoTone,
    TagsTwoTone,
    BankTwoTone,
    SlidersTwoTone,
    ProjectTwoTone,
    BuildTwoTone,
  },

  computed: {
    ...mapState([
      'product'
    ])
  },

  data() {
    return {
      test: '<AppstoreTwoTone v-if="name === \'기본 정보\'" twoToneColor="red" />',
      label: [
        '기본 정보',
        '상품 이미지',
        'Spec',
        'SKU',
        '통관정보',
        // '배송설정',
        '간략설명',
        '상세설명',
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
