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
          <a-spin v-model:spinning="imgLoading">
          <img :src="product.item_thumbnails[0]?.url" style="width: 100px;height: 100px" alt="" class="cp" @click="translatePopup"/>
          </a-spin>
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
            <div v-show="this.showKeywordTip" style="color: #999999;">빨간색 라벨 키워드는 상표권에 등록된 단어입니다.</div>
            <a-spin v-model:spinning="keyword.loading">
              <a-button v-if="this.showTrademarkBtn" size="small" type="primary" style="margin-bottom: 10px" @click="searchKeyword('', true)">상표권 확인</a-button>
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
                  @blur="validateFilterWord($event,product.item_trans_name)"
                  v-model:value="product.item_trans_name"
                  :maxlength="max_name_length"
                  :showCount="true"
                  :placeholder="`상품명칭을 입력하세요.`"
              />
            </a-spin>
            </div>
            <a-button v-if="this.use_ai" type="primary" style="background-color: #1e44ff;color: white" @click="replaceWithAI">AI 추천모드</a-button>
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
          <div style="display: flex;flex-direction: column;gap: 5px;width: 100%" class="mb10">
            <div style="display: flex;gap: 10px">
              <a-input
                  :disabled="tagKeyword.loading"
                  v-model:value.trim="tagKeyword.search_value"
                  placeholder="검색 상품태그를 입력하세요"
                  @keyup.enter="searchTagKeyword"
              />
              <a-button
                  :loading="tagKeyword.loading"
                  type="primary"
                  style="background-color: #1e44ff;color: white"
                  @click="searchTagKeyword"
              >상품태그 추천</a-button>
            </div>
          </div>
          <a-spin :spinning="ai_loading === true || tagKeyword.loading === true">
            <a-textarea v-model:value="product.item_sync_keyword" placeholder="상품태그는 '콤마(,)' 혹은 '띄어쓰기'로 구분하여 작성해 주시고 최대 20개까지 등록이 가능합니다. " @input="itemSyncKeywordCountCheck" @change="itemSyncKeywordCountCheck" :showCount="false" @blur="tagKeywordBlur($event,2)"
            />
            <div class="fl-le" style="color: #00000073">{{!product.item_sync_keyword ? 0 : product.item_sync_keyword?.split(/,\s*|\s+/).filter(d => !!d).length }} / {{keywordMaxLength}}</div>
          </a-spin>
          <a-spin v-model:spinning="tagKeyword.loading">
            <div class="keyword-list" v-show="tagKeyword.list.length > 0 || tagKeyword.loading" style="margin-bottom: 10px">
              <a-tag
                  v-for="item in tagKeyword.list" :key="item.id"
                  :color="item.reg ? 'red' : ''"
                  :class="{ 'default-tag': ! item.reg, 'is-using': item.is_using }"
                  :bordered="! item.is_using || item.reg"
                  :title="item.brand"
                  @click="addKeyword(item,2)"
              >{{item.word}}</a-tag>
            </div>
          </a-spin>
        </td>
      </tr>
      <tr>
        <th>상품고시</th>
        <td>
          <a-select v-model:value="product.item_mandatory" placeholder="상품고시 선택해주세요." style="width: 100%">
            <a-select-option value="">선택</a-select-option>
            <a-select-option v-for="(item, key) in mandatory" :key="key" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </td>
      </tr>
    </table>
    <image-translate-tools ref="imageTranslateTools" v-model:visible="imageTranslateToolsVisible"
                           @update:visible="imageTranslateToolsVisible = false" :translateImageList="translateImageList"
                           @update:translateImageList="updateTranslateImageList" :xjParams="xjParams" @update:xjParams="setXjParams" />
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
  props: {
    activeKey: {
      type: String,
      default: '1'
    },
  },
  watch: {
    "product.item_trans_name"() {
      this.keyword.list.forEach(d => {
        d.is_using = this.isUsingKeyword(d.word, 1)
      })
    },
    "product.item_sync_keyword"() {
      this.tagKeyword.list.forEach(d => {
        d.is_using = this.isUsingKeyword(d.word, 2)
      })
    },
    activeKey: {
      handler() {
        if(this.activeKey == 1){
          if(!this.xjParams.requestIds.length){
            this.imgLoading = true;
            this.$nextTick(() => {
              this.getRequestIds();
            });
          }
        }
      },
    },
    product: {
      handler() {
        if(this.activeKey == 1){
          this.imgLoading = true;
          this.$nextTick(() => {
            this.getRequestIds();
          });
        }
      },
      immediate: true,
    },
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
      tagKeyword: {
        loading: false,
        search_value: '',
        list: [],
      },
      imageTranslateToolsVisible: false,
      translateImageList: [],
      blurIndex: {
        type:0,
        index:false,
      },
      keywordMaxLength:20,
      showTrademarkBtn: false,
      showKeywordTip: false,
      imgLoading:false,
      xjParams:{
        isMany:true,
        action:'',
        currentIndex:0,
        requestIds:[],
        recharge:0
      },
    };
  },

  methods: {
    itemSyncKeywordCountCheck(event) {
      const keyword = this.product.item_sync_keyword && this.product.item_sync_keyword.split(/,\s*|\s+/)
      if (keyword && keyword.length > 20) {
        event.target.value = event.target.value.substring(0, event.target.value.lastIndexOf(' '));
        message.error('상품태그는 최대 20개까지 등록이 가능합니다.')
        this.product.item_sync_keyword = keyword.slice(0, 20).join(' ')
      }
    },
    async searchKeyword(e = e, onlyDb = false) {
      if (this.keyword.search_value.trim().length === 0) {
        message.info('검색할 키워드를 입력해주세요.');
        return false;
      }
      this.keyword.loading = true
      const params = {keyword: this.keyword.search_value, onlyDb: onlyDb}
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/searchKeywords", params).then(res => {
        if (res.status !== '2000') {
          if ( onlyDb === false) {
            message.error('키워드 검색중 오류가 발생하였습니다. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.');
          }
          return false;
        }
        this.keyword.list = [];
        this.showTrademarkBtn = res.data.needKipRis;
        this.showKeywordTip = !res.data.needKipRis;
        this.initKeywords(res.data.keyword_data)

        if (this.showTrademarkBtn === true && onlyDb === true) {
          message.info('상표권 확인중입니다. 잠시후 다시 클릭하여 확인하여 주세요.');
        }

        if (this.showTrademarkBtn === false && onlyDb === true) {
          message.success('상표권 확인완료 하였습니다.');
        }

        //this.$emit('suggestCategory', res.data.category)
      }).catch(() => {
        message.error("처리중 오류가 발생하였습니다. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.")
      }).finally(() => {
        this.keyword.loading = false
      })
    },
    async searchTagKeyword() {
      if (this.tagKeyword.search_value.trim().length === 0) {
        message.info('검색할 상품태그를 입력해주세요.');
        return false;
      }
      this.tagKeyword.loading = true
      this.tagKeyword.list = []
      const params = {keyword: this.tagKeyword.search_value}
      AuthRequest.post(process.env.VUE_APP_API_URL + "/api/searchKeywords", params).then(res => {
        this.initKeywords(res.data.keyword_data,2)
      }).catch(() => {
        message.error("처리중 오류가 발생하였습니다. 오류가 지속될경우 관리자에게 문의하시길 바랍니다.")
      }).finally(() => {
        this.tagKeyword.loading = false
      })
    },
    isUsingKeyword(word, type) {
      if (type == 1) {
        return this.product.item_trans_name?.split(' ')?.includes(word);
      } else if (type == 2) {
        return this.product.item_sync_keyword?.split(' ')?.includes(word);
      }
      return false;
    },
    initKeywords(keywords,type = 1) {
      if (! Array.isArray(keywords)) return
      if (keywords.length === 0) return
      // 最多显示 40 个
      if(type == 1){
        this.keyword.list = keywords.slice(0, 40).map(item => {
          return {
            id: lib.uuid(),
            word: item.word,
            brand: item.brand,
            reg: item.reg === 1,  // reg: 1|0
            is_using: this.isUsingKeyword(item.word, type),
          }
        })
        //超过50个 剩下未注册的插入关键词,关键词最多20个
        keywords.slice(50).map(item => {
          //最多20个tags
          let tagsLength = this.product.item_sync_keyword.split(' ').length;
          if(tagsLength < 20 && item.reg == 0){
            this.addKeyword(item,2);
          }
        })
      }
      if(type == 2){
        this.tagKeyword.list = keywords.slice(0, 40).map(item => {
          return {
            id: lib.uuid(),
            word: item.word,
            brand: item.brand,
            reg: false,  // reg: 1|0
            is_using: this.isUsingKeyword(item.word, type),
          }
        })

        // 상품태그에 20개 안되면 넣어주기
        if (this.product.item_sync_keyword.length === 0) {
          if (this.product.item_sync_keyword.includes(',')) {
            this.product.item_sync_keyword = this.product.item_sync_keyword.replace(/,/g, ' ').trim();
          }
          let productTags = this.product.item_sync_keyword.trim().split(' ');
          if (productTags.length < 20) {
            let addLength = 21 - productTags.length;
            let addTags = this.tagKeyword.list.slice(0, addLength).map(item => {
              return item.word
            })
            this.tagKeyword.list = this.tagKeyword.list.slice(addLength)
            productTags = productTags.concat(addTags);
            this.product.item_sync_keyword = productTags.join(' ').trim();
          }
        }
      }
    },
    addKeyword(keywordInfo,from = 1) {
      let use = false
      let keyword = [];
      let keywordBefore = '';
      let keywordAfter = '';
      if(from == 1){
        //插入光标处
        if(this.blurIndex.type == 1){
          if(this.product.item_trans_name){
            keywordBefore = this.product.item_trans_name.slice(0,this.blurIndex.index).trim();
            keywordAfter  = this.product.item_trans_name.slice(this.blurIndex.index).trim();
          }
          keyword = [keywordBefore, keywordInfo.word,keywordAfter];
        }else{
          keyword = [this.product.item_trans_name, keywordInfo.word];
        }
        const newName = keyword.filter(d => !!d).join(' ')
        if (newName.length <= this.max_name_length) {
          this.product.item_trans_name = newName
          this.blurIndex.index += keywordInfo.word.length + 1;
          use = true
        }

        this.validateFilterWord(null,this.product.item_trans_name)
      }
      if(from == 2) {
        if(this.blurIndex.type == 2){//光标插
          if(this.product.item_sync_keyword){
            keywordBefore = this.product.item_sync_keyword.slice(0,this.blurIndex.index).trim();
            keywordAfter  = this.product.item_sync_keyword.slice(this.blurIndex.index).trim();
          }
          keyword = [keywordBefore, keywordInfo.word,keywordAfter];
        }else{//正常插
          keyword = [this.product.item_sync_keyword, keywordInfo.word];
        }
        let newKeyword = keyword.filter(d => !!d).join(' ');

        if(newKeyword.split(' ').length <= 20){
          //点击关键词消失
          this.tagKeyword.list.splice(this.tagKeyword.list.indexOf(keywordInfo),1);
          this.product.item_sync_keyword = newKeyword;
          this.blurIndex.index += keywordInfo.word.length + 1;
        }else{
          message.error('상품태그는 최대 20개까지 등록이 가능합니다.');
          return;
        }
        use = true
        this.itemSyncKeywordCountCheck()
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
    validateFilterWord(e,sTransProductName = "") {
      if(e){
        this.tagKeywordBlur(e,1);
      }
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
        this.product.recharge = res.data.recharge;
        this.use_ai = res.data.user_data.use_ai;
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

        // 키워드 ai 기능 안쓴대서 주석
        // if (res.data && Array.isArray(res.data.keywords)) {
        //   this.product.item_sync_keyword = res.data.keywords.join(' ');
        //   let prd_name_keyword = res.data.keywords.join(' ');
        //   this.product.item_trans_name += ' ' + prd_name_keyword.replace(/,/g, ' ')
        // } else {
        //   this.product.item_sync_keyword = '';
        // }

        this.validateFilterWord(null,this.product.item_trans_name)

        this.ai_loading = false;

        message.success('상품명이 성공적으로 업데이트 되었습니다.');
      });

    },
    translatePopup() {
      this.imageTranslateToolsVisible = true;
    },
    updateTranslateImageList(imageList) {
      let item_thumbnails = [];
      for (let i = 0; i < imageList.length; i++) {
        let url = imageList[i].translate_status === true ? imageList[i].translate_url :  imageList[i].url;
        item_thumbnails.push({'name':i,'url':url});
      }
      this.product.item_thumbnails = item_thumbnails;
    },
    tagKeywordBlur(e,type){
      this.blurIndex.type = type;
      this.blurIndex.index = e.srcElement.selectionStart;
    },
    //获取图片requestIds
    getRequestIds(){
      let aImagesUrl = this.product.item_thumbnails;
      let imgList =aImagesUrl.map((item,index)=>{
        let tmp = [];
        tmp['checked'] = false;
        if(index == 0){
          tmp['checked'] = true;
        }
        tmp['order'] = index;
        tmp['request_id'] = '';
        tmp['url'] = item['url'];
        let pos = item['url'].indexOf('request_id');
        if(pos != -1){
          tmp['request_id'] = item['url'].slice(pos+11);
          tmp['url'] = item['url'].slice(0,pos-1);
        }
        return tmp;
      })
      this.$refs.imageTranslateTools.translateImage({isTranslate: false,type: 1,imglist:imgList});
    },
    setXjParams(params){
      this.imgLoading = false;
      this.xjParams = params;
    }
  },

  mounted() {
    this.getUserInfo();
    this.getMandatory();
    //首次进来以空格分隔显示
    if(this.product.item_sync_keyword){
      if (this.product.item_sync_keyword === 'null') {
        this.product.item_sync_keyword = '';
      }
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
      this.validateFilterWord(null,this.product.item_trans_name);
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
  background-color: #fafafa;
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
