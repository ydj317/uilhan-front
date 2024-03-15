<template>
  <div id="eModelTitle_0" class="mt20 bg-white" style="padding: 20px">
    <h3><strong>기본정보</strong></h3>
    <table class="basic-info-table" style="width: 100%; border-collapse: collapse;">
      <colgroup>
        <col style="width: 15%">
        <col >
      </colgroup>
      <tr>
        <th>
          <img :src="product.item_thumbnails[0]?.url" style="width: 100px;height: 100px" alt=""/>
        </th>
        <td style="display: flex;align-items: flex-start">
          <div style="display: flex;flex-direction: column;gap: 5px;width: 100%">
            <div style="display: flex;gap: 10px">
              <a-input v-model:value.trim="keyword.search_value" placeholder="검색 키워드를 입력하세요" />
              <a-button
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
                  @click="addKeyword(item)"
                >{{item.word}}</a-tag>
              </div>
            </a-spin>
          </div>
        </td>
      </tr>

      <tr>
        <th>상품명</th>
        <td style="display: flex;gap: 5px;">
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
        </td>
      </tr>
      <tr>
        <th>상품태그</th>
        <td>
          <a-spin :spinning="ai_loading === true">
            <a-input v-model:value="product.item_sync_keyword" placeholder="검색어는 '콤마(,)'로 구분하여 작성해주시기 바라며, 최대 255자내로 등록 가능합니다." :maxlength="max_sync_keyword_length" :showCount="true"
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

  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { mapState } from "vuex";
import { AuthRequest } from "@/util/request";
import {QuestionCircleOutlined,CheckCircleOutlined} from '@ant-design/icons-vue';
import {useMandatoryApi} from "@/api/mandatory";
import {lib} from "@/util/lib";

export default {
  components: {QuestionCircleOutlined,CheckCircleOutlined},

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
      max_sync_keyword_length: 255,
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
    };
  },

  methods: {
    async searchKeyword() {
      if (! this.keyword.search_value) return

      // 如果没有搜索到 keywords, 该怎么版？  显示 div 内容不是 a-tag 列表，而是 空内容的文字提示？

      // this.keyword.loading = true
      // this.keyword.list = []
      // const params = {keyword: this.keyword.search_value}
      // AuthRequest.get(process.env.VUE_APP_API_URL + "/api/naver/keywords", params).then(res => {
      //   console.log('---', res)
      //   this.initKeywords(res.data.keyword)  // @todo 替换位置
      //   this.$emit('changeKeywords', res.data.category)   // res.data.category: string[]
      // }).catch(() => {
      //   message.error("상품 리스트 조회 실패하였습니다.")
      // }).finally(() => {
      //   this.keyword.loading = false
      // })

      this.keyword.loading = true
      this.keyword.list = []
      setTimeout(() => {
        // @todo 以下内容 -> 替换位置
        this.initKeywords([
          {word: '겨울', reg: 0},
          {word: 'aaa', reg: 1},
          {word: 'bbb', reg: 0},
          {word: '부츠', reg: 0},
          {word: '스포츠', reg: 1},
          {word: 'ccc', reg: 0},
        ])
        this.$emit('suggestCategory', ['화장품/미용',  '헤어케어', '헤어팩'])

        this.keyword.loading = false
      }, 1000)

    },
    isUsingKeyword(word) {
      const in_name = this.product.item_trans_name?.split(' ')?.includes(word)
      const in_tags = this.product.item_sync_keyword?.split(',')?.includes(word)
      return in_name || in_tags
    },
    initKeywords(keywords) {
      if (! Array.isArray(keywords)) return
      if (keywords.length === 0) return

      // 最多显示 40 个
      this.keyword.list = keywords.slice(0, 40).map(item => {
        return {
          id: lib.uuid(),
          word: item.word,
          reg: item.reg === 1,  // reg: 1|0
          is_using: this.isUsingKeyword(item.word),
        }
      })
    },
    addKeyword(keywordInfo) {
      let use = false
      const newName = [this.product.item_trans_name, keywordInfo.word].filter(d => !!d).join(' ')
      if (newName.length <= this.max_name_length) {
        this.product.item_trans_name = newName
        use = true
      }

      const newKeyword = [this.product.item_sync_keyword, keywordInfo.word].filter(d => !!d).join(',')
      if (newKeyword.length <= this.max_sync_keyword_length) {
        this.product.item_sync_keyword = [this.product.item_sync_keyword, keywordInfo.word].filter(d => !!d).join(',')
        use = true
      }

      if (use) {
        keywordInfo.is_using = true
      }
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

        this.use_ai = (res.data.use_ai === '1');
        this.use_auto_save = (res.data.use_auto_save === '1');
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
    this.getMandatory();
    console.log(this.product);
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
  padding: 10px 20px;
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
