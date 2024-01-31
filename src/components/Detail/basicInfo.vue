<template>
  <div id="eModelTitle_0" class="bg-white" style="padding: 20px">
    <h3><strong>기본정보</strong></h3>

    <div class="detail-basic">
      <a-descriptions bordered :column="1" >

        <a-descriptions-item label="상품명칭" v-if="product.item_is_trans === false">
          <a-input v-model:value="product.item_name" :placeholder="`상품명칭을 입력하세요.`" />
        </a-descriptions-item>
        <a-descriptions-item label="상품명칭" v-else>
          <a-button type="dashed" :href="product.item_url" :target="'_blank'" style="margin-bottom: 10px;">
          <span class="get-market-icon">
              <img :src="getLogoSrc('get-logo', product.item_market.toLowerCase())" alt="">
          </span>
            {{ product.item_name }}
          </a-button>

          <a-button class="ml10" v-if="use_ai" @click="replaceWithAI">AI 추천모드</a-button>

          <a-spin :spinning="product.filter_word_validate_in_process === true || ai_loading === true">
            <a-input
                @focus="product.filter_word_status = false"
                @blur="validateFilterWord(product.item_trans_name)"
                v-model:value="product.item_trans_name"
                :maxlength="max_name_length"
                :showCount="true"
                :placeholder="`상품명칭을 입력하세요.`"
            />
          </a-spin>
        </a-descriptions-item>

        <a-descriptions-item label="금지어">
          <a-tag color="warning" v-if="product.filter_word_status === true">금지어 없음</a-tag >
          <a-tag v-else v-for="(filter_words, i) in product.filter_word_list"
                 @click="deleteFilterWord(filter_words)" color="error" :key="i">
            {{ filter_words }}
          </a-tag >
        </a-descriptions-item>
        <a-descriptions-item label="연관키워드">
          <a-tag>기타</a-tag>
          <a-tag color="error">플레이트</a-tag>
          <a-tag color="success">플레이트</a-tag>
          <a-tag color="processing">잠금</a-tag>
          <a-tag color="default" >DIY</a-tag>
        </a-descriptions-item>
        <a-descriptions-item>
          <template #label>
            상품태그
            <a-tooltip>
              <template #title>
                <div>상품태그에는 상품 카테고리 명칭을 기입 할 수 없습니다.</div>
              </template>
              <QuestionCircleOutlined/>
            </a-tooltip>
          </template>
          <a-form-item>
            <a-spin :spinning="ai_loading === true">
              <a-input v-model:value="product.item_sync_keyword" placeholder="검색어는 '콤마(,)'로 구분하여 작성해주시기 바라며, 최대 255자내로 등록 가능합니다."
                       />
            </a-spin>
          </a-form-item>
        </a-descriptions-item>

      </a-descriptions>

    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { mapState } from "vuex";
import { AuthRequest } from "@/util/request";
import {QuestionCircleOutlined} from '@ant-design/icons-vue';

export default {
  components: {QuestionCircleOutlined},

  computed: {
    ...mapState(["product"]),
  },

  data() {
    return {
      max_name_length: 50,
      item_trans_name: "",
      CONFIG: [
        {
          key: "item_name",
          text: "상품명칭",
          editor: true,
        },
        {
          key: "item_trans_name",
          text: "번역 상품명",
          editor: true,
          hide: !this.item_trans_name,
        },
        {
          key: "item_stock",
          text: "재고",
          editor: true,
        },
        {
          key: "item_code",
          text: "상품 코드",
          editor: false,
        },
        {
          key: "item_lan",
          text: "원산지",
          editor: false,
        },
        {
          key: "item_market",
          text: "마켓",
          editor: false,
        },
      ],
      tempImage: require('../../assets/img/temp_image.png'),
      is_filter_word_list: false,
      use_ai: false,
      ai_loading: false
    };
  },

  methods: {

    getLogoSrc(fileName, marketCode) {
      try {
        return require(`../../assets/img/list/${fileName}/${marketCode}.png`);
      } catch (error) {
        return this.tempImage;
      }
    },

    /**
     * 상품명 금지어 등록 삭제
     * @param sFilterWord
     * @returns {boolean}
     */
    deleteFilterWord(sFilterWord = "") {
      if (this.product.item_is_trans === false) {
        return false;
      }

      this.product.item_trans_name = this.product.item_trans_name.replaceAll(
          sFilterWord,
          ""
      );

      this.product.filter_word_list =
          this.product.filter_word_list.filter((r) => r !== sFilterWord);

      if (this.product.filter_word_list.length === 0) {
        this.product.filter_word_status = true;
      }
    },

    /**
     * 상품명 금지어 체크
     * @returns {boolean}
     */
    validateFilterWord(sTransProductName = "") {
      if (sTransProductName === "") return false;

      this.product.filter_word_validate_in_process = true;
      this.product.filter_word_status = false;
      this.product.filter_word_list = [];

      /* 등록 호출 */
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/filterword", {
        method: "check",
        product_name: sTransProductName,
      }).then((res) => {
        /* 등록실패여부 및 로딩제거 */
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        this.product.filter_word_status = true;
        this.product.filter_word_list = [];

        if (Array.isArray(res.data) && res.data.length > 0) {
          let aFilterWords = [];
          res.data.map((r) => {
            aFilterWords.push(r.filter_word);
          });

          this.product.filter_word_status = false;
          this.product.filter_word_list = aFilterWords;
          this.is_filter_word_list = true
        }

        this.product.filter_word_validate_in_process = false;
        message.success("금지어 체크완료");
      });
    },

    getUserInfo() {
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user/getUserInfoData", {}).then((res) => {
        /* 등록실패여부 및 로딩제거 */
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }

        this.use_ai = (res.data.use_ai === '1');
        this.use_auto_save = (res.data.use_auto_save === '1');


        // 发射一个事件，携带数据
        this.$emit('userinfo-updated', {
          use_auto_save: this.use_auto_save
        });
      });

    },

    replaceWithAI() {
      this.ai_loading = true;
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/imageInfoExtractor/getImageInfo", {
        img_url: this.product.item_thumbnails[0].url
      }).then((res) => {
        /* 등록실패여부 및 로딩제거 */
        if (res.status !== "2000") {
          message.error(res.message);
          this.ai_loading = false;
          return false;
        }

        if (res.data.product_name !== undefined) {
          this.product.item_trans_name = res.data.product_name;
        }

        if (res.data && Array.isArray(res.data.keywords)) {
          this.product.item_sync_keyword = res.data.keywords.join(',');
          let prd_name_keyword = res.data.keywords.join(',');
          this.product.item_trans_name += ' ' + prd_name_keyword.replace(/,/g, ' ')
        } else {
          this.product.item_sync_keyword = '';
        }

        this.validateFilterWord(this.product.item_trans_name)

        this.ai_loading = false;

        message.success('상품명과 키워드가 성공적으로 업데이트 되었습니다. ');
      });

    }
  },

  mounted() {
    this.getUserInfo();

    if (this.product.item_is_trans) {
      this.product.item_trans_name = this.product.item_trans_name.substr(
          0,
          this.max_name_length
      );
    }

    this.item_trans_name = this.product.item_trans_name;


    this.product.filter_word_validate_in_process = false;
    this.product.filter_word_status = true;
    this.product.filter_word_list = [];

    if (this.product.item_is_trans === true) {
      this.validateFilterWord(this.product.item_trans_name);
    }
  },
};
</script>

<style>
.detail-basic .ant-descriptions-item-label {
  width: 200px;
}
</style>

<style scoped>

#eModelTitle_0 .get-market-icon img {
  display: inline-block;
  margin-right: 10px;
  margin-top: -3px;
  width: 16px;
  height: 16px;
}

</style>
