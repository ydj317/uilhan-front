<template>
  <div id="eModelTitle_0" class="bg-white">
    <h3><strong>기본정보</strong></h3>
    <table class="basic-info-table" style="width: 100%; border-collapse: collapse;">
      <colgroup>
        <col style="width: 150px">
        <col>
      </colgroup>
      <tr>
        <th>
          <img :src="product.item_thumbnails[0]?.url" style="width: 100px;height: 100px" alt="" class="cp" @click="translatePopup"/>
        </th>
        <td>
          <div style="display: flex;flex-direction: column;gap: 5px;width: 100%">
            <div style="display: flex;gap: 10px">
              <a-input
                :disabled="keyword.loading"
                v-model:value.trim="keyword.search_value"
                placeholder="검색 키워드를 입력하세요"
                @keyup.enter="searchKeyword"
              />
              <a-button
                :loading="keyword.loading"
                type="primary"
                style="background-color: #1e44ff;color: white"
                @click="searchKeyword"
              >키워드 검색</a-button>
            </div>

            <a-spin v-model:spinning="keyword.loading">
              <div class="keyword-list" v-show="keyword.list.length > 0 || keyword.loading">
                <a-tag
                  v-for="item in keyword.list" :key="item.id"
                  :color="item.reg ? 'red' : ''"
                  :class="{ 'default-tag': ! item.reg, 'is-using': item.is_using }"
                  :bordered="! item.is_using || item.reg"
                  :title="item.brand"
                  @click="addKeyword(item)"
                >{{item.word}}</a-tag>
              </div>
            </a-spin>
          </div>
        </td>
      </tr>

      <tr>
        <th>상품명</th>
        <td style="display: flex;flex-direction: column; gap: 5px;">
          <div style="display: flex;gap: 5px;">
            <div style="flex: 1">
            <a-spin :spinning="product.filter_word_validate_in_process === true || ai_loading === true" >
              <a-input
                  @blur="validateFilterWord(product.item_trans_name)"
                  v-model:value="product.item_trans_name"
                  :maxlength="max_name_length"
                  :showCount="true"
                  :placeholder="`상품명칭을 입력하세요.`"
              />
            </a-spin>
            </div>
            <a-button type="primary" style="background-color: #1e44ff;color: white" @click="replaceWithAI">AI 추천모드</a-button>
          </div>
          <div style="display: flex; gap: 5px;">
            <a-tag
              v-for="word in product.filter_word_list"
              :key="word"
              :color="'red'"
              @close="deleteFilterWord(word)"
              closable
            >
              {{word}}
            </a-tag>
          </div>

        </td>
      </tr>
      <tr>
        <th>상품태그</th>
        <td>
          <a-spin :spinning="ai_loading === true">
            <a-textarea v-model:value="product.item_sync_keyword" placeholder="상품태그는 '콤마(,)' 혹은 '띄어쓰기'로 구분하여 작성해 주시고 최대 20개까지 등록이 가능합니다. " @input="itemSyncKeywordCountCheck" @change="itemSyncKeywordCountCheck" :showCount="false"
            />
          </a-spin>
        </td>
      </tr>
      <tr>
        <th>상품고시</th>
        <td>
          <a-select v-model:value="product.item_mandatory" placeholder="상품고시 선택해주세요." style="width: 100%">
            <a-select-option value="선택">선택</a-select-option>
            <a-select-option v-for="(item, key) in mandatory" :key="key" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </td>
      </tr>
    </table>
    <image-translate-tools v-model:visible="imageTranslateToolsVisible"
                           @update:visible="imageTranslateToolsVisible = false" :translateImageList="translateImageList"
                           @update:translateImageList="updateTranslateImageList" />
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { mapState } from "vuex";
import { AuthRequest } from "@/util/request";
import {QuestionCircleOutlined,CheckCircleOutlined} from '@ant-design/icons-vue';
import {useMandatoryApi} from "@/api/mandatory";
import {lib} from "@/util/lib";
import ImageTranslateTools from "@/components/Detail/ImageTranslateTools.vue";

export default {
  components: {QuestionCircleOutlined,CheckCircleOutlined,ImageTranslateTools},

  computed: {
    ...mapState({
      product: (state) => state.product.detail,
    }),
  },
  emits: ['suggestCategory'],
  watch: {
    "product.item_trans_name"() {
      this.keyword.list.forEach(d => {
        d.is_using = this.isUsingKeyword(d.word)
      })
    },
    "product.item_sync_keyword"() {
      this.keyword.list.forEach(d => {
        d.is_using = this.isUsingKeyword(d.word)
      })
    }
  },

  data() {
    return {
      max_name_length: 50,
      max_sync_keyword_length: 150,// 상품태그 최대 길이
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
      mandatory: [],
      is_filter_word_list: false,
      use_ai: false,
      ai_loading: false,
      keyword: {
        loading: false,
        search_value: '',
        list: [],
      },
      imageTranslateToolsVisible: false,
      translateImageList: [],
    };
  },

  methods: {
    itemSyncKeywordCountCheck() {

      const keyword1 = this.product.item_sync_keyword && this.product.item_sync_keyword.split(' ')
      const keyword2 = this.product.item_sync_keyword && this.product.item_sync_keyword.split(',')

      const keyword = [...keyword1, ...keyword2]

      if (keyword.length > 20) {
        message.error('상품태그는 최대 20개까지 등록이 가능합니다.')
        this.product.item_sync_keyword = keyword.slice(0, 20).join(' ')
      }

      for (const keywordElement of keyword) {
        if (keywordElement.length > this.max_sync_keyword_length) {
          message.error(`상품태그는 최대 ${this.max_sync_keyword_length}자까지 등록이 가능합니다.`)
          this.product.item_sync_keyword = this.product.item_sync_keyword.replace(keywordElement, '')
        }
      }
    },
    async searchKeyword() {
      this.keyword.loading = true
      this.keyword.list = []
      const params = {keyword: this.keyword.search_value}
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/naver/keywords", params).then(res => {
        this.initKeywords(res.data.keywords)
        this.$emit('suggestCategory', res.data.category)
      }).catch(() => {
        message.error("처리중 오류가 발생하였습니다. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.")
      }).finally(() => {
        this.keyword.loading = false
      })
    },
    isUsingKeyword(word) {
      const in_name = this.product.item_trans_name?.split(' ')?.includes(word)
      const in_tags = this.product.item_sync_keyword?.split(' ')?.includes(word)
      return in_name || in_tags
    },
    initKeywords(keywords) {
      if (! Array.isArray(keywords)) return
      if (keywords.length === 0) return

      // 最多显示 48 个
      this.keyword.list = keywords.slice(0, 40).map(item => {
        return {
          id: lib.uuid(),
          word: item.word,
          brand: item.brand,
          reg: item.reg === 1,  // reg: 1|0
          is_using: this.isUsingKeyword(item.word),
        }
      })
      //超过48个 商品tags显示20个未注册 yinliang+
      keywords.slice(48, 60).map(item => {
        //最多20个tags
        let tagsLength = this.product.item_sync_keyword.split(' ').length;
        if(tagsLength < 20 && item.reg == 0){
          this.addKeyword(item,2);
        }
      })
    },
    addKeyword(keywordInfo,from = 1) {

      let use = false
      if(from == 1){ //yinliang+
        const newName = [this.product.item_trans_name, keywordInfo.word].filter(d => !!d).join(' ')
        if (newName.length <= this.max_name_length) {
          this.product.item_trans_name = newName
          use = true
        }
      }

      const newKeyword = [this.product.item_sync_keyword, keywordInfo.word].filter(d => !!d).join(' ')
      // if (newKeyword.length <= this.max_sync_keyword_length) {
      if (this.max_sync_keyword_length) {//yinliang+
        this.product.item_sync_keyword = [this.product.item_sync_keyword, keywordInfo.word].filter(d => !!d).join(' ')
        use = true
      }

      if (use) {
        keywordInfo.is_using = true
      }
      this.validateFilterWord(this.product.item_trans_name)
      this.itemSyncKeywordCountCheck()
    },
    getMandatory() {
      useMandatoryApi().getList().then((res) => {
        this.mandatory = res.data;
      })
    },

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
      });
    },

    getUserInfo() {
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/user/getUserInfoData", {}).then((res) => {
        /* 등록실패여부 및 로딩제거 */
        if (res.status !== "2000") {
          message.error(res.message);
          return false;
        }
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
          this.product.item_sync_keyword = res.data.keywords.join(' ');
          let prd_name_keyword = res.data.keywords.join(' ');
          this.product.item_trans_name += ' ' + prd_name_keyword.replace(/,/g, ' ')
        } else {
          this.product.item_sync_keyword = '';
        }

        this.validateFilterWord(this.product.item_trans_name)

        this.ai_loading = false;

        message.success('상품명과 키워드가 성공적으로 업데이트 되었습니다. ');
      });

    },
    translatePopup() {
      let aImagesUrl = [
        {checked: true, order: 0, url: this.product.item_thumbnails[0].url}
      ];
      this.imageTranslateToolsVisible = true;
      this.translateImageList = aImagesUrl;
    },
    updateTranslateImageList(imageList) {
      if (imageList[0].translate_status === true) {
        this.product.item_thumbnails[0].url =  imageList[0].translate_url;
      }
    },
  },

  mounted() {
    this.getUserInfo();
    this.getMandatory();
    console.log(this.product);
    //首次进来以空格分隔显示 yinliang+
    if(this.product.item_sync_keyword){
      this.product.item_sync_keyword = this.product.item_sync_keyword.split(/,\s*|\s+/).join(' ');
    }
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

<style scoped>

#eModelTitle_0 .get-market-icon img {
  display: inline-block;
  margin-right: 10px;
  margin-top: -3px;
  width: 16px;
  height: 16px;
}

.basic-info-table {
  border-collapse: collapse;
  width: 100%;
}

.basic-info-table th {
  text-align: right;
  padding: 10px 20px;
  font-weight: bold;
  color: #666;
}

.basic-info-table td {
  padding: 10px 20px 10px 25px;
}

.keyword-list {
  background-color: #eeeeee;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(12,1fr);
  gap: 5px;
  justify-content: center;
  align-items: center;
  min-height: 42px;
}

.keyword-list :deep(.ant-tag) {
  cursor: pointer;
}

.keyword-list :deep(.default-tag) {
  background-color: #fff;
  color: #000000;
}
.keyword-list :deep(.is-using) {
  background-color: #f5f5f5;
}
</style>
