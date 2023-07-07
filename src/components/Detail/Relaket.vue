<template>
  <div v-if="product.relaket_visivle" class="plrb20 bg-white" style="margin-top: -1px;">
    <!--title-->
    <div>
      <span hidden><strong>릴라켓 연동</strong></span>
      <a-switch hidden @change="syncSwitchChange" v-model:checked="isSync"/>
    </div>
    <div v-if="isSync === true">

      <div class="detail-basic">
        <a-descriptions bordered :column="{ xs: 1, sm: 1, md: 1}" >
          <a-descriptions-item label="카테고리">
            <a-form-item>
              <a-cascader
                v-model:value="formState.category"
                :options="formState.options"
                :load-data="loadData"
                placeholder="카테고리를 선택해 주세요."
                change-on-select
                dropdownClassName="categorySelect"
                @change="onCategoryChange"

              />
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="카테고리 검색">
            <a-form-item>
              <a-alert
                show-icon
                v-if="recommendCategory.bAlertShow"
                :type="recommendCategory.sAlertType"
                :message="recommendCategory.sAlertMessage"
                :closable="recommendCategory.bAlertClosable"
                :afterClose="recommendCategory.mAlertAfterClose"
              />
              <a-select
                v-if="!recommendCategory.bAlertShow"
                v-model:value="recommendCategory.aSearchValue"
                mode="tags"

                :maxTagCount="1"
                :showArrow="true"
                :allowClear="true"
                :defaultOpen="recommendCategory.bDefaultOpen"
                :autoClearSearchValue="true"
                :options="recommendCategory.aOptions"
                :notFoundContent="'추천 카테고리가 존재하지 않습니다. 수동으로 입력해 주세요.'"

                :onFocus="recommendCategory.clickTheInputBox"
                :onSearch="recommendCategory.clickTheInputBox"
                :onChange="recommendCategory.selectListOptions"
                :onSelect="recommendCategory.selectListOptions"
                :onInputKeyDown="recommendCategory.enterKeywords"
              >
                <template v-if="cateLoading" #notFoundContent>
                  <a-spin size="small"/>
                </template>
              </a-select>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="상품고시 / 통관유형">
            <div class="row w40">
              <a-form-item class="w100">
                <a-select v-model:value="formState.mandatory_val" :options="formState.mandatory" placeholder="상품고시 선택해주세요.">
                </a-select>
              </a-form-item>
              <a-form-item class="ml20 w100">
                <a-select v-model:value="formState.surtax" placeholder="통관유형 선택해주세요.">
                  <a-select-option value="Y">면세</a-select-option>
                  <a-select-option value="N">과세</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </a-descriptions-item>

          <a-descriptions-item label="배송 정책">
            <p>
              <a-checkbox v-model:checked="formState.item_is_free_delivery">무료 배송</a-checkbox>
            </p>
            <a-form-item>
              <a-select
                v-if="formState.delivery_template_sea_list !== undefined && formState.delivery_template_sea_list.length > 0"
                v-model:value="formState.delivery_template_sea_val" :options="formState.delivery_template_sea_list"
                style="width: 150px; float: left;" @change="isSelected('sea')">
              </a-select>
              <a-select
                v-if="formState.delivery_template_sky_list !== undefined && formState.delivery_template_sky_list.length > 0"
                v-model:value="formState.delivery_template_sky_val" :options="formState.delivery_template_sky_list"
                style="width: 150px; float: left; margin-left: 10px" @change="isSelected('sky')">
              </a-select>
              <a-select
                v-if="formState.delivery_template_furniture_list !== undefined && formState.delivery_template_furniture_list.length > 0"
                v-model:value="formState.delivery_template_furniture_val"
                :options="formState.delivery_template_furniture_list" style="width: 150px; float: left; margin-left: 10px"
                @change="isSelected('furniture')">
              </a-select>
              <a-select
                v-if="formState.delivery_template_high_list !== undefined && formState.delivery_template_high_list.length > 0"
                v-model:value="formState.delivery_template_high_val" :options="formState.delivery_template_high_list"
                style="width: 150px; float: left; margin-left: 10px" @change="isSelected('high')">
              </a-select>
              <a-select
                v-if="formState.delivery_template_other_list !== undefined && formState.delivery_template_other_list.length > 0"
                v-model:value="formState.delivery_template_other_val" :options="formState.delivery_template_other_list"
                style="width: 150px; float: left; margin-left: 10px" @change="isSelected('other')">
              </a-select>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="키워드">
            <a-form-item>
              <a-input v-model:value="formState.keyword" placeholder="최대 255자내로 입력해주세요"/>
            </a-form-item>
          </a-descriptions-item>
        </a-descriptions>
      </div>

    </div>
  </div>
</template>

<script>
import {AuthRequest} from '@/util/request';
import {mandatoryList} from 'config/Relaket/mandatory'
import {ref, reactive, computed, onBeforeUnmount} from 'vue';
import {mapState, useStore} from 'vuex';
import {lib} from '@/util/lib';

export default {
  components: { mandatoryList},

  computed: {
    ...mapState([
      'product',
    ])
  },

  setup() {
    const store = useStore()
    const aProduct = computed(() => store.state.product)
    const formState = reactive({
      pid: '',
      co_pid: '',
      category: '',
      options: [],
      surtax: 'Y',
      mandatory: mandatoryList(),
      mandatory_val: '선택',
      delivery_template_sea_list: [],
      delivery_template_sea_val: '선택',
      delivery_template_sky_list: [],
      delivery_template_sky_val: '선택',
      delivery_template_furniture_list: [],
      delivery_template_furniture_val: '선택',
      delivery_template_high_list: [],
      delivery_template_high_val: '선택',
      delivery_template_other_list: [],
      delivery_template_other_val: '선택',
      delivery_template_real_val: null,
      delivery_template_list: [],
      last_cate: null,
      category_check_last: false,
      keyword: null,
      item_is_free_delivery: false,
    });

    const isSync = ref(false);
    const keyStatus = ref(false);
    const syncSwitchChange = () => {
      if (isSync.value === true && !formState.last_cate) {
        //getCategory({pid: 0}, 0);
      }

      let template = formState.delivery_template_list;

      if (template.length !== undefined && template.length === 0) {
        alert("릴라켓 배송정책정보 얻기에 실패하였습니다. \n1, 세션키가 유효한지 확인하시길바랍니다. \n2, 릴라켓 어드민에서 배송정책을 추가하였는지 확인하시길 바랍니다. \n3, 릴라켓측 IP허용설정이 되여있는지 관리자와 확인하시길 바랍니다.");
        isSync.value = false;
        return false;
      }

      if (keyStatus.value === false) {
        alert("릴라켓 연동에 필요한 API KEY가 없습니다.\n API KEY는 릴라켓어드민 > 나의 오피스 > 기본정보 > API 사용관리에서 확인하실수 있습니다.");
        isSync.value = false;
        return false;
      }

      recommendCategory.switchInit();
    }

    const isSelected = (type) => {
      let typeList = ['sea', 'sky', 'furniture', 'high', 'other'];
      let isOtherSelected = false;
      for (let i = 0; i < typeList.length; i++) {
        if (type === typeList[i]) {
          continue;
        }

        let value = formState['delivery_template_' + typeList[i] + '_val'];
        if (value !== '선택') {
          isOtherSelected = true;
          break;
        }
      }

      if (isOtherSelected === true) {
        alert("배송정책류형은 하개만 선택가능합니다.");

        for (let i = 0; i < typeList.length; i++) {
          if (type !== typeList[i]) {
            formState['delivery_template_' + typeList[i] + '_val'] = '선택';
          }
        }
      }

      formState.delivery_template_real_val = formState['delivery_template_' + type + '_val'];

      if (!lib.isEmpty(formState.delivery_template_real_val) && formState.delivery_template_real_val !== '선택') {
        let aDelivery = formState['delivery_template_' + type + '_list'].filter(data => data.value === formState.delivery_template_real_val);
        aProduct.value.sku.map((data, i) => {
          aProduct.value.sku[i].shipping_fee_ko = aDelivery[0].shipping_fee_ko;
        });
      }
    }

    const recommendCategory = reactive({
      sMarket: '',
      bDisposable: false,
      aOptions: [],
      aSearchValue: [],
      bDefaultOpen: false,
      bCustomizeSearchStatus: false,

      bAlertShow: false,
      sAlertType: '',
      sAlertMessage: '',
      bAlertClosable: false,

      // 关闭 提示
      mAlertAfterClose: () => {
        let _ = recommendCategory;
        _.bAlertShow = false;
      },

      // 打开 提示
      mAlert: (sAlertMessage = '', sAlertType = 'info', iClosingTime = 3) => {
        let _ = recommendCategory;

        _.bAlertClosable = false;
        if (['warning', 'error'].includes(sAlertType) === true) {
          _.bAlertClosable = true;
          _.initData();
        }

        _.bAlertShow = true;
        _.sAlertType = sAlertType;
        _.sAlertMessage = sAlertMessage;
        setTimeout(() => {
          _.bAlertShow = false;
        }, iClosingTime * 1000);
      },

      // 初始化数据
      initData: () => {
        let _ = recommendCategory;

        _.aSearchValue = [];
        _.bDefaultOpen = false;
        _.bCustomizeSearchStatus = false;
      },

      // 点击搜索栏
      clickTheInputBox: () => {
        let _ = recommendCategory;
        _.switchInit();
        _.aSearchValue = [];
      },

      // 设置 自定义搜索状态
      enterKeywords: () => {
        let _ = recommendCategory;
        _.bCustomizeSearchStatus = true;
      },

      // 打开 联动
      switchInit: (onece = false) => {
        try {
          let _ = recommendCategory;

          if (_.aOptions.length === 0 && _.bDisposable === false) {
            _.bDisposable = true;
            let sChineseProductName = document.querySelector('#eModelTitle_0 input').value;
            let sKeyWords = _.automaticGenerate(sChineseProductName);

            _.mAlert('추천 카테고리 조회중...');
            _.getData(options => {
              _.initData();
              _.aOptions = options;
            }, sKeyWords);
          }
        } catch (e) {
          if (onece === false) {
            setTimeout(() => {
              recommendCategory.switchInit(true);
            }, 1000)
          }
        }
      },

      // 点击下拉列表
      selectListOptions: (recommendCateId) => {
        let _ = recommendCategory;
        if (Array.isArray(recommendCateId) === true) {
          return false;
        }

        // 自定义搜索 关键字
        if (_.bCustomizeSearchStatus === true) {
          let sSearchValue = _.aSearchValue[0];
          let oFilter = /[ \da-zA-Z`:_.~!@#$%^&*()\+=<>?"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；\-‘’，。、]/g;

          if (oFilter.test(sSearchValue) === true) {
            _.mAlert('검색어에 빈자리, 특수문자, 영문, 수자 허용하지 않습니다.', 'warning');
            return false;
          }
          if (sSearchValue.trim().length < 2) {
            _.mAlert('최소 검색어 1글짜 이상입니다.', 'warning');
            return false;
          }

          let sLanguageTypeSearched = _.getLanguageType(sSearchValue);

          if (sLanguageTypeSearched === '') {
            _.mAlert('검색 가능한 언어는 한국어, 중국어 만 지원합니다.', 'warning');
            return false;
          }
          if (sLanguageTypeSearched === 'multilingual') {
            _.mAlert('여러 국가 언어를 동시에 사용할수 없다습니다.', 'warning');
            return false;
          }

          let sKeyWords = _.automaticGenerate(sSearchValue);

          _.mAlert('추천 카테고리 조회중...');
          _.getData(options => {
            _.initData();
            _.aOptions = options;
            _.bDefaultOpen = true;
          }, sKeyWords, sLanguageTypeSearched);

          return false;
        }

        // 用 叶子类目 获取 全部分类
        _.mAlert('전체 카테고리 자동셋팅중...');
        _.automaticallySetAllCategories(recommendCateId);
      },

      // 获取推荐分类
      getData: (callback, sKeyWord = '', sLanguageTypeSearched = 'cn') => {
        let _ = recommendCategory;

        let oKoreanRegular = /[\uac00-\ud7ff]/gi;
        if (oKoreanRegular.test(sKeyWord) && _.sMarket === 'Aliexpress') {
          sLanguageTypeSearched = 'kor';
        }
        if (oKoreanRegular.test(sKeyWord) && _.sMarket === 'Domeggook') {
          sLanguageTypeSearched = 'kor';
        }

        _.requestData(
            {
              keyword_of_JSON_type: sKeyWord,
              language_type_searched: sLanguageTypeSearched,
            },
            res => {
              callback(res);
            },
        );
      },

      // 获取语言类型
      getLanguageType: (sKeyWord) => {
        let sLanguageTypeSearched = '';
        let oChineseRegular = /[\u4e00-\u9fa5]/gi;
        let oKoreanRegular = /[\uac00-\ud7ff]/gi;

        if (oChineseRegular.test(sKeyWord) === false && oKoreanRegular.test(sKeyWord) === false) {
          return '';
        }
        if (oChineseRegular.test(sKeyWord) === true && oKoreanRegular.test(sKeyWord) === true) {
          return 'multilingual';
        }
        if (oChineseRegular.test(sKeyWord) === true) {
          return 'cn';
        }
        if (oKoreanRegular.test(sKeyWord) === true) {
          return 'kor';
        }
      },

      // 自动设置所有类别
      automaticallySetAllCategories: (recommendCateId) => {
        let _ = recommendCategory;

        _.requestData(
            {
              recommend_cate_id: recommendCateId,
            },
            res => {
              try {
                let aFullCate = res.full_cate;
                let aSelectCate = [];
                delete res.full_cate;

                Object.values(res).map((oFullCate, i) => {
                  let aTempOptions = [];
                  aFullCate.map(oCate => {
                    if (parseInt(oCate.cate_level) - 1 === i) {
                      aTempOptions.push({
                        label: oCate.kor_name,
                        value: oCate.cate_id,
                      });

                    }
                  });
                  aSelectCate.push(oFullCate.label)
                });

                formState.category = aSelectCate.join('/')
                formState.last_cate = recommendCateId;

              } catch (e) {
                _.mAlert('조회 실패', 'error');
              }

              _.initData();
            },
        );
      },

      // 请求数据
      requestData: (oRequestParameters, callback) => {
        let _ = recommendCategory;

        oRequestParameters.cate_market = "Relaket";
        AuthRequest.get(
            process.env.VUE_APP_API_URL + '/api/getcate',
            {
              params: oRequestParameters,
            },
        ).then((res) => {

          if (res.status !== '2000') {
            _.mAlert('조회 실패', 'error');
            return false;
          }

          let options = res.data || [];
          callback(options);
        });
      },

      // 自动生成 关键字
      automaticGenerate: (sParamChineseProductName) => {
        class AutomaticGenerateSQL {
          sFilterMultipleCharacters; // 过滤多个字符
          sFilterSingleCharacter; // 过滤单个字符
          sChineseProductName; // 中文产品名称
          sImportantKeywords; // 重要关键词
          iMatchRuleOptions; // 匹配规则选项
          sSearchKeywords; // 搜索关键字
          iQueryMaximum; // 查询最大值

          constructor() {
          }

          // 执行
          execute(oParameter) {
            if (!oParameter.sChineseProductName) {
              return false;
            }

            this.mVariableAssignment(oParameter);
            this.mFilterCharacters();
            this.mImportantKeywords();

            let aQuery = [];
            let sQuery = '';
            let sQuery1 = '';
            let sQuery2 = '';
            if (this.sImportantKeywords !== '' && this.iMatchRuleOptions !== 2) {
              this.mSearchKeywords();
              aQuery.push(this.sSearchKeywords);
            }

            aQuery.push(this.mNoKeywordSearch());

            return JSON.stringify(aQuery);
          }

          // 变量赋值
          mVariableAssignment(oParameter) {
            this.sChineseProductName = oParameter.sChineseProductName
                ? oParameter.sChineseProductName
                : '';

            // 匹配规则选项 1/2/3
            // 1: 范围小 匹配度高 (使用规则1时: 搜索结果为 0 时 自动使用 `规则2` 搜索)
            // 2: 范围大 匹配度低 (使用规则2时: 无视 `规则1` 直接使用 `规则2` 搜索)
            // 3: 范围大 匹配度一般 (1 和 2 的 联合搜索)
            this.iMatchRuleOptions = oParameter.iMatchRuleOptions
                ? oParameter.iMatchRuleOptions
                : 3;

            this.sFilterMultipleCharacters = oParameter.aFilterMultipleCharacters
                ? oParameter.aFilterMultipleCharacters.join('|')
                : '男士|女士|成人|老人|户外';

            this.sFilterSingleCharacter = oParameter.aFilterSingleCharacter
                ? oParameter.aFilterSingleCharacter.join('|')
                : '男|女';

            this.iQueryMaximum = oParameter.iQueryMaximum
                ? oParameter.iQueryMaximum
                : 30;
          }

          // 过滤字符
          mFilterCharacters() {
            let sStr = this.sChineseProductName;
            let oRegExp;

            sStr = sStr.replace(/[\da-zA-Z`:_.~!@#$%^&*()\+=<>?"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；\-‘’，。、]/g, '');

            oRegExp = new RegExp(`(${this.sFilterMultipleCharacters})`, 'g');
            sStr = sStr.replace(oRegExp, '');

            oRegExp = new RegExp(`(${this.sFilterSingleCharacter})`, 'g');
            sStr = sStr.replace(oRegExp, '');

            this.sChineseProductName = sStr.replaceAll(' ', '');
          }

          // 重要关键字
          mImportantKeywords() {
            let s = this.sChineseProductName.split('');
            let r = new Set(s);
            r = [...r];
            let t = {};
            for (let i = 0; i < r.length; i++) {
              t[i] = [];
            }
            for (let i = 0; i < r.length; i++) {
              for (let j = 0; j < s.length; j++) {
                if (r[i] == s[j]) {
                  t[i].push(s[j]);
                }
              }
            }

            let val = Object.values(t);
            val.sort((a, b) => b.length - a.length);

            if (val[0].length > 1) {
              this.sImportantKeywords = val[0][0];
              return false;
            }

            this.sImportantKeywords = '';
          }

          // 搜索关键字
          mSearchKeywords() {
            let aImportantKeywords = [];
            let sImportantKeywords = this.sImportantKeywords;
            let aChineseProductName = this.sChineseProductName.split(
                sImportantKeywords);

            aChineseProductName.map((sChineseProductName, i) => {
              sChineseProductName = sChineseProductName.replaceAll(' ', '');
              let aTempChineseProductName = sChineseProductName.split('');

              if (i === 0 && aTempChineseProductName.length > 0) {
                aImportantKeywords.push(sChineseProductName.split('')[sChineseProductName.length - 1] + sImportantKeywords);
              }

              if (i < aChineseProductName.length - 1 && aTempChineseProductName.length > 0) {
                aImportantKeywords.push(sImportantKeywords + sChineseProductName.split('')[0]);
                aImportantKeywords.push(sChineseProductName.split('')[sChineseProductName.length - 1] + sImportantKeywords);
              }

              if (i === aChineseProductName.length - 1 && aTempChineseProductName.length > 0) {
                aImportantKeywords.push(sImportantKeywords + sChineseProductName.split('')[0]);
                aImportantKeywords.push(sChineseProductName.split('')[sChineseProductName.length - 1] + sImportantKeywords);
              }
            });

            this.sSearchKeywords = aImportantKeywords.join('|');
          }

          // 无关键字拆分
          mNoKeywordSplit(iSplitLength, sChineseProductName) {
            let aChineseProductName = [];

            for (let i = 0; i < sChineseProductName.length; i += iSplitLength) {
              let sTempChineseProductName = sChineseProductName.slice(i, i + iSplitLength);
              sTempChineseProductName = sTempChineseProductName.replaceAll(' ', '');

              if (sTempChineseProductName !== '' && sTempChineseProductName.length === iSplitLength) {
                aChineseProductName.push(sTempChineseProductName);
              }
            }

            return aChineseProductName;
          }

          // 无关键字搜索
          mNoKeywordSearch() {
            let sChineseProductName = this.sChineseProductName;

            let aChineseProductName2 = this.mNoKeywordSplit(2, sChineseProductName);
            let aChineseProductName22 = this.mNoKeywordSplit(2, sChineseProductName.substr(1));
            let aChineseProductName3 = this.mNoKeywordSplit(3, sChineseProductName);
            let aChineseProductName33 = this.mNoKeywordSplit(3, sChineseProductName.substr(1));

            aChineseProductName2 = aChineseProductName2.concat(aChineseProductName22);
            aChineseProductName3 = aChineseProductName3.concat(aChineseProductName33);
            let aChineseProductName = aChineseProductName2.concat(aChineseProductName3);

            return Array.from(new Set(aChineseProductName)).join('|');
          }
        }

        let oSQL = new AutomaticGenerateSQL();
        return oSQL.execute({
          sChineseProductName: sParamChineseProductName,
        });
      }
    })

    let cateLoading = false;

    const getCategory = (param, type) => {
      param.cate_market = recommendCategory.sMarket === "Domeggook" ? "Domeggook" : "Relaket";
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/getcate', {params: param}).then((res) => {
        if (res.status !== '2000') {
          alert(res.message)
        }

        formState.options = JSON.parse(JSON.stringify(res.data))
      });
    };

    const onCategoryChange = (targetOption,aCateInfo) => {
      let iCurrent = targetOption.length - 1;
      let oCurrentInfo = aCateInfo[iCurrent];
      if(oCurrentInfo.isLeaf){
        formState.last_cate = oCurrentInfo.value;
      } else {
        formState.last_cate = null;
      }
    }
    const loadData = selectedOptions => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      let param = {
        pid: targetOption.value,
        cate_market: "Relaket"
      }

      if (targetOption.isLeaf === false) {
        setTimeout(() => {
          AuthRequest.get(process.env.VUE_APP_API_URL + '/api/getcate', {params: param}).then((res) => {
            if (res.status !== '2000') {
              alert(res.message)
            }
            targetOption.loading = false;
            targetOption.children = JSON.parse(JSON.stringify(res.data))

            formState.options = [...formState.options];
          });
        }, 100)
      }

    };

    /**
     * 카테고리에 노출할 카테고리명배열
     * @param cateIds
     */
    let cateNames = ref([])
    const getCategoryNames = (cateIds) => {
      if (Array.isArray(cateIds) && cateIds.length === 0) return;
      setTimeout(() => {
        let param = {
          cid: cateIds.filter(Boolean),
          cate_market: "Relaket"
        }
        AuthRequest.get(process.env.VUE_APP_API_URL + '/api/getCateNames', {params: param}).then((res) => {
          if (res.status !== '2000') {
            alert(res.message)
          }
          cateNames.value.push(res.data || [])
        });
      }, 100)
    }

    return {
      aProduct,
      recommendCategory,
      formState,
      isSync,
      syncSwitchChange,
      isSelected,
      keyStatus,
      cateLoading,
      loadData,
      getCategory,
      getCategoryNames,
      cateNames,
      onCategoryChange
    }
  }
  ,

  mounted() {
    // 사양대로 무조건 노출
    this.recommendCategory.sMarket = this.product.item_market;
    this.product.relaket_visivle = true;
    this.isSync = true;

    this.getCategory({pid: 0}, 0)

    if (this.product.relaket_visivle) {
      this.keyStatus = this.product.key_status;
      if (this.product.cates !== undefined && this.product.cates !== null) {
        this.isSync = true;

        this.getCategoryNames(this.product.cates.val)
        this.formState.category = this.cateNames
        this.formState.last_cate = this.product.cates.val.filter(Boolean)[this.product.cates.val.filter(Boolean).length - 1]

        this.formState.mandatory_val = this.product.item_mandatory;

        if (this.product.item_sync_keyword === 'null') {
          this.product.item_sync_keyword = '';
        }
        this.formState.keyword = this.product.item_sync_keyword;
        this.formState.surtax = this.product.item_surtax;

        let _ = this.recommendCategory;
      }

      let delvTmp = this.product.delivery_template_list;
      if (delvTmp === undefined || delvTmp.error === true) {
        this.delivery_template_list = [];
      } else {
        this.formState.item_is_free_delivery = this.product.item_is_free_delivery === 'T';
        let sea = this.product.delivery_template_list.sea;
        this.formState.delivery_template_list = this.product.delivery_template_list;
        if (sea !== undefined && sea !== null) {
          this.formState.delivery_template_sea_list = sea;
        }

        let sky = this.product.delivery_template_list.sky;
        if (sky !== undefined && sky !== null) {
          this.formState.delivery_template_sky_list = sky;
        }

        let furniture = this.product.delivery_template_list.furniture;
        if (furniture !== undefined && furniture !== null) {
          this.formState.delivery_template_furniture_list = furniture;
        }

        let high = this.product.delivery_template_list.high;
        if (high !== undefined && high !== null) {
          this.formState.delivery_template_high_list = high;
        }

        let other = this.product.delivery_template_list.other;
        if (other !== undefined && other !== null) {
          this.formState.delivery_template_other_list = other;
        }

        let value = this.product.item_delivery_template;
        let type = this.product.delivery_template_list.delivery_type;
        if (type !== undefined && type !== null) {
          switch (type) {
            case 'sea':
              this.formState.delivery_template_sea_val = value;
              break;
            case 'sky':
              this.formState.delivery_template_sky_val = value;
              break;
            case 'furniture':
              this.formState.delivery_template_furniture_val = value;
              break;
            case 'high':
              this.formState.delivery_template_high_val = value;
              break;
            case 'other':
              this.formState.delivery_template_other_val = value;
              break;
            default:
              break;
          }

          this.formState.delivery_template_real_val = value;
        }
      }

      // 데이터 관리용
      this.product.formState = this.formState;
      this.product.isSync = this.isSync;

      this.syncSwitchChange();
    }

  }
}

</script>

<style>
.detail-basic .ant-descriptions-item-label {
  width: 200px;
}

.detail-basic .ant-form-item {
  margin-bottom: 0;
}

.categorySelect .ant-cascader-menus .ant-cascader-menu {
  height: 350px;
}

</style>
