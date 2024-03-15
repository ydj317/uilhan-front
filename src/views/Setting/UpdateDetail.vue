<template>
  <a-card :loading="formState.loading" :bordered="false" title="계정설정">
    <a-descriptions bordered :column="1" :labelStyle="{ width: '100px' }"
                    :contentStyle="{ width: '500px' }">
      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>AI추천모드 사용</span>
            <a-tooltip>
              <template #title>
                AI 추천모드는 챗GPT 유료서비스로 충전 후 설정이 가능하고 사용함으로 설정하면 AI가 추천하는 상품명과 키워드로 상품을 등록하게 됩니다.<br>
                챗GPT 충전 관련 문의는 관리자에게 하시기 바랍니다.
              </template>
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>

        <a-switch v-model:checked="formState.settingDatas.use_ai" @change="changeUseAi" checked-children="on" un-checked-children="off" />
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>자동 저장 사용</span>
            <a-tooltip title="자동 저장은 상품등록 시 저장버튼을 클릭하지 않아도 수정된 상품정보를 실시간으로 저장하는 기능입니다.">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-switch v-model:checked="formState.settingDatas.use_auto_save" @change="changeUseAutoSave" checked-children="on" un-checked-children="off" />
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>이미지 자동 번역</span>
            <a-tooltip title="자동 저장은 상품등록 시 저장버튼을 클릭하지 않아도 수정된 상품정보를 실시간으로 저장하는 기능입니다.">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-switch v-model:checked="formState.settingDatas.use_auto_translate" @change="changeUseAutoTranslate" checked-children="on" un-checked-children="off" />
      </a-descriptions-item>
    </a-descriptions>
  </a-card>

  <a-card :loading="formState.loading" :bordered="false">
    <a-descriptions title="환율 / 수익률 / 수수료 설정" bordered :column="1" :labelStyle="{ width: '100px' }"
                    :contentStyle="{ width: '500px' }">
      <a-descriptions-item>
        <!-- label slot-->
        <template #label>
          <a-space>
            <span>환율 설정</span>
            <a-tooltip title="환율설정은 상품수집시 설정한 옵션에 따라 계산되여 수집됩니다.">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-radio-group v-model:value="formState.settingDatas.rate.is_real_rate">
          <a-radio :value="true">실시간 환율</a-radio>
          <a-radio :value="false">직접 입력 환율</a-radio>
        </a-radio-group>
        <a-input-number v-model:value.number="formState.settingDatas.rate.rate_value"
                        :disabled="formState.settingDatas.rate.is_real_rate"
                        :min="0" :max="300" size="small"/>
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>수익률 설정</span>
            <a-tooltip>
              <template #title>
                <div class="mb10">내가 남기고 싶은 수익률을 기입해주세요!</div>
                <div>원가 + (원가환율)*(카드수수료+퍼센트수익))+최소 수익 + 해외배송비 • 알리익스프레스의 경우 별도로 해외배송비용이 없음</div>
              </template>
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-space>
          원가 x
          <span>
            {{
              formState.settingDatas.rate.is_real_rate ? '실시간 환율' : formState.settingDatas.rate.rate_value ? formState.settingDatas.rate.rate_value : '미입력'
            }}
          </span>
          +
          ( 원가 x
          <span>
            {{
              formState.settingDatas.rate.is_real_rate ? '실시간 환율' : formState.settingDatas.rate.rate_value ? formState.settingDatas.rate.rate_value : '미입력'
            }}
          </span> )
          x (
          <a-input-number v-model:value.number="formState.settingDatas.margin.margin_data.card_charge"
                          :disabled="formState.settingDatas.margin.is_auto_setting" :min="1" :max="100" :step="0.01"
                          addon-after="%" size="small" style="width: 100px;"/>
          +
          <a-input-number v-model:value.number="formState.settingDatas.margin.margin_data.margin_value"
                          :disabled="formState.settingDatas.margin.is_auto_setting" :min="0" :max="100" :step="0.1"
                          addon-after="%" size="small" style="width: 100px;"/>
          )
          +
          <a-input-number v-model:value.number="formState.settingDatas.margin.margin_data.min_margin"
                          :disabled="formState.settingDatas.margin.is_auto_setting" :min="0" :max="20000" size="small"
                          style="width: 75px;" :step="1000"/>
          +
          <a-input-number v-model:value.number="formState.settingDatas.margin.margin_data.overseas_shipping_fee"
                          :disabled="formState.settingDatas.margin.is_auto_setting" :min="0" :max="20000" size="small"
                          style="width: 75px;" :step="1000"/>
        </a-space>
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>마켓별 가중치(수수료율) 설정</span>
            <a-tooltip title="설정하신 기본 판매가에서 마켓별 가중치에 따라 적용되어 업로드 됩니다.">
              <QuestionCircleOutlined/>
            </a-tooltip>
          </a-space>
        </template>
        <a-switch v-model:checked="formState.settingDatas.margin_weight.is_use"
                  checked-children="on" un-checked-children="off" />
        <a-descriptions bordered size="small" class="mt15" :column="4">
          <a-descriptions-item :label="market" v-for="(market,index) in formState.marketList" :key="index">
            <a-input-number v-model:value.number="formState.settingDatas.commission_rate.markets[index]" addon-after="%"
                            :min="0" :max="300" size="small" style="width: 150px" defaultValue="0"
                            :disabled="!formState.settingDatas.margin_weight.is_use"/>
          </a-descriptions-item>
        </a-descriptions>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>

  <a-card :loading="formState.loading" :bordered="false" title="상세이미지 설정">
    <a-descriptions bordered :column="1" :labelStyle="{ width: '100px' }"
                    :contentStyle="{ width: '500px' }">
      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>상/하단 이미지 설정</span>
          </a-space>
        </template>

        <a-switch v-model:checked="formState.settingDatas.description_option.top_bottom_image.use"
                  checked-children="on" un-checked-children="off" />

        <div class="upload-container" :class="{ 'is-disabled': !formState.settingDatas.description_option.top_bottom_image.use }">
            <span class="image-fix">
              <span class="title">상단 고정 이미지</span>
              <a-upload
                  name="avatar"
                  :headers="HEADER"
                  :multiple="true"
                  :max-count="1"
                  list-type="picture-card"
                  :beforeUpload="validateUploadImage"
                  :customRequest="(options) => uploadImage(options, 'top')"
                  v-model:file-list="fileListTop"
              >
                <template v-if="fileListTop.length < 1">
                  <div>
                    <loading-outlined v-if="loadingTop" />
                    <plus-outlined v-else />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </template>
              </a-upload>
              <template v-if="fileListTop.length > 0">
                <close-circle-outlined class="delete-icon" @click="removeFileTop" />
              </template>
            </span>
          <span class="image-fix">
              <span class="title">하단 고정 이미지</span>
              <a-upload
                  name="avatar"
                  :headers="HEADER"
                  :multiple="true"
                  :max-count="1"
                  list-type="picture-card"
                  :beforeUpload="validateUploadImage"
                  :customRequest="(options) => uploadImage(options, 'bottom')"
                  v-model:file-list="fileListBottom"
              >
                <template v-if="fileListBottom.length < 1">
                  <div>
                    <loading-outlined v-if="loadingBottom" />
                    <plus-outlined v-else />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </template>
              </a-upload>
              <template v-if="fileListBottom.length > 0">
                <close-circle-outlined class="delete-icon" @click="removeFileBottom" />
              </template>
            </span>
        </div>
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>동영상 노출 설정</span>
          </a-space>
        </template>
        <a-switch v-model:checked="formState.settingDatas.description_option.show_video"
                  checked-children="on" un-checked-children="off" />
      </a-descriptions-item>

      <a-descriptions-item>
        <template #label>
          <a-space>
            <span>옵션 테이블 설정</span>
          </a-space>
        </template>

        <a-switch v-model:checked="formState.settingDatas.description_option.option_table.use"
                  checked-children="on" un-checked-children="off" />
        <div class="select upload-container" :class="{ 'is-disabled': !formState.settingDatas.description_option.option_table.use }">
          <a-select v-model:value="formState.settingDatas.description_option.option_table.show_position"
                    style="width: 120px">
            <a-select-option v-for="selectOption in showPosition" :key="selectOption.value"
                             :value="selectOption.value">
              {{ selectOption.label }}
            </a-select-option>
          </a-select>
          <a-select v-model:value="formState.settingDatas.description_option.option_table.column_length"
                    style="width: 120px">
            <a-select-option v-for="selectOption in columnLength" :key="selectOption.value"
                             :value="selectOption.value">
              {{ selectOption.label }}
            </a-select-option>
          </a-select>
        </div>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>

  <div style="display: flex;justify-content: center;margin-top: 20px;">
    <a-button type="primary" html-type="submit" @click="saveSettings">저장</a-button>
  </div>
</template>
<script setup>
import {AuthRequest} from "@/util/request";

import {onMounted, reactive, ref} from "vue";
import Cookie from "js-cookie";
import {message} from "ant-design-vue";
import {useUserApi} from "@/api/user";
import {CloseCircleOutlined, LoadingOutlined, PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons-vue";
import router from "@/router";

import {useMarketApi} from "@/api/market";

const recharge = ref(0);

const formState = reactive({
  settingDatas: {
    use_ai: false,
    use_auto_save: false,
    use_auto_translate: false,
    license_remaining_days: "",

    rate: {
      is_real_rate: true, // 실시간환율(true),고정환율(false) 여부
      rate_value: 0, // 고정환율일 경우 환율값
    },
    // 마진
    margin: {
      is_auto_setting: false, // 자동설정(true),수동설정(false) 여부
      // 수동설정일 경우
      margin_data: {
        card_charge: '1', // 수동설정일 경우 카드수수료
        margin_value: '0', // 수동설정일 경우 마진값
        min_margin: '0', // 수동설정일 경우 최소마진
        overseas_shipping_fee: '0', // 수동설정일 경우 해외배송비
      },
    },
    // 마켓별 마진가중치
    margin_weight: {
      is_use: false, // 사용(true),미사용(false) 여부
      markets: {},
    },

    commission_rate: {
      markets: {},
    },


    description_option:{
      top_bottom_image : {
        use : false,
        top_image_url: "",
        bottom_image_url: "",
      },

      show_video: false,

      option_table: {
        use: true,
        show_position : "top",
        column_length :2
      },
    },
  },
  loading: false,
  marketList: [],
});

const isAdmin = ref(Cookie.get("member_roles").split(",").includes("ROLE_ADMIN"));

//--------Account---------------
function changeUseAi() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", {
    use_ai: formState.settingDatas.use_ai,
  }).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }
  });
}

function changeUseAutoSave() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", {
    use_auto_save: formState.settingDatas.use_auto_save,
  }).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }
  });
}

function changeUseAutoTranslate() {
  AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", {
    use_auto_translate: formState.settingDatas.use_auto_translate,
  }).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }
  });
}


const checkValidation = () => {
  if (formState.settingDatas.rate.is_real_rate === false) {
    if (!formState.settingDatas.rate.rate_value) {
      message.error("환율을 입력해주세요.");
      return false;
    }
  }

  if (formState.settingDatas.margin.is_auto_setting === false) {

    if (!formState.settingDatas.margin.margin_data.margin_value) {
      message.error("마진율을 입력해주세요.");
      return false;
    }

    if (!formState.settingDatas.margin.margin_data.card_charge) {
      message.error("카드수수료를 입력해주세요.");
      return false;
    }

    if (formState.settingDatas.margin.margin_data.min_margin !== 0 && !formState.settingDatas.margin.margin_data.min_margin) {
      message.error("최소마진을 입력해주세요.");
      return false;
    }

    if (formState.settingDatas.margin.margin_data.overseas_shipping_fee !== 0 && !formState.settingDatas.margin.margin_data.overseas_shipping_fee) {
      message.error("해외배송비를 입력해주세요.");
      return false;
    }
  }

  const isValid = checkCommissionRates();
  if (!isValid) {
    // 如果检查失败，返回以阻止进一步的提交逻辑
    return false;
  }

  return true;
}


function checkCommissionRates() {
  if (formState.settingDatas.margin_weight.is_use) {
    for (const [index, rate] of Object.entries(formState.settingDatas.commission_rate.markets)) {
      if (rate === null || rate === undefined || rate === '') {
        message.error("마켓별 수수료율을 입력해주세요.");
        return false;
      }
    }
  }
  return true;
}



// 마켓 리스트 가져오기
const getMarketList = () => {
  useMarketApi().getMarketList().then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    formState.marketList = res.data;
  });
}


const showPosition = reactive([
  { label: '상단에', value: 'top' },
  { label: '하단에', value: 'bottom' },
]);

const columnLength = reactive([
  { label: '두줄로 추가', value: 2 },
  { label: '네줄로 추가', value: 4 },
]);


const fileListTop = ref([]);

const fileListBottom = ref([]);
const loadingTop = ref(false);
const loadingBottom = ref(false);

const HEADER =ref({
  token: Cookie.get("token"),
  "Content-Type": "multipart/form-data",
})

function uploadImage(option,position) {
  const formData = new FormData();
  formData.append("file", option.file);
  formData.append("image_type", "product");
  formData.append("relation_type", "product");

  if (position === 'top') loadingTop.value = true;
  else loadingBottom.value = true;

  AuthRequest.post(
      process.env.VUE_APP_API_URL + "/api/image",
      formData
  ).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }

    let response = res.data;
    if (!response || Object.keys(response).length === 0) {
      message.error("upload failed");
      return false;
    }

    message.success(res.message);

    // 上传成功处理
    let imgUrl = res.data.img_url;

    let newFileList = [{
      uid: '-1',
      name: 'option.file.name',
      status: 'done',
      url: imgUrl,
    }];

    // 根据位置更新状态和文件列表
    if (position === 'top') {
      formState.settingDatas.description_option.top_bottom_image.top_image_url = imgUrl;
      fileListTop.value.splice(0, fileListTop.value.length, ...newFileList);
      console.log(fileListTop.value);

      loadingTop.value = false;
    } else if (position === 'bottom') {
      formState.settingDatas.description_option.top_bottom_image.bottom_image_url = imgUrl;
      fileListBottom.value = newFileList;
      loadingBottom.value = false;
    }
  }).catch((error) => {
    message.error(`Upload failed: ${error.message}`);
    if (position === 'top') loadingTop.value = false;
    else loadingBottom.value = false;
  });
}

function validateUploadImage(file) {
  const isJPG = file.type === "image/jpeg";
  const isJPEG = file.type === "image/jpeg";
  const isGIF = file.type === "image/gif";
  const isPNG = file.type === "image/png";

  if (!(isJPG || isJPEG || isPNG || isGIF)) {
    message.warning("허용되는 이미지 격식이 아닙니다.");
    return false;
  }
  return true;
}

function removeFileTop(){
  fileListTop.value = [];
}
function removeFileBottom(){
  fileListBottom.value = [];
}

async function saveSettings(){
  if (checkValidation() === false) {
    return false;
  }

  const isSwitchOn = formState.settingDatas.description_option.top_bottom_image.use;
  if (isSwitchOn && fileListTop.value.length === 0 && fileListBottom.value.length === 0)
  {
    message.error('상/하단 이미지를 등록하여 주세요.');
    return; // 阻止执行后续保存操作
  }

  // 检查并清除空的图片URL
  if (fileListTop.value.length === 0) {
    formState.settingDatas.description_option.top_bottom_image.top_image_url = '';
  }
  if (fileListBottom.value.length === 0) {
    formState.settingDatas.description_option.top_bottom_image.bottom_image_url = '';
  }

  try {
    const updateResponse = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", {
      settingDatas: formState.settingDatas
    });

    if (updateResponse.status !== '2000') {
      message.error(updateResponse.message);
      return;
    }

    await useUserApi().saveUserData(formState.settingDatas);
    console.log('Data saved successfully');
    message.success(updateResponse.message);

    // 在所有数据保存操作完成后获取最新的用户信息
    getUserInfoData();
  } catch (error) {
    console.error('Failed to save data:', error);
    message.error('\'Failed to save data:\', error');
  }
}

function getUserInfoData() {
  formState.loading = true;
  useUserApi().getUserInfoData({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      formState.loading = false;
      return false;
    }

    formState.settingDatas.recharge = res.data.recharge;
    formState.settingDatas.use_ai = (res.data.use_ai === '1');
    formState.settingDatas.use_auto_save = (res.data.use_auto_save === '1');
    formState.settingDatas.use_auto_translate = (res.data.use_auto_translate === '1');

    //--------Margin--------------------
    const { user_data } = res.data;
    if(!user_data || user_data.length < 1){
      formState.loading = false;
      return false;
    }

    if (user_data.margin_weight === undefined) {
      formState.loading = false;
      return false;
    }

    if (user_data.commission_rate === undefined) {
      formState.loading = false;
      return false;
    }

    // 빈 json 일때 백앤드에선 []로 저장되기에 추후에 버그가 생길수 있어서 프론트단에서 []받을시 강제로 {}로 전환
    if (Array.isArray(user_data.margin_weight.markets) && user_data.margin_weight.markets.length === 0) {
      user_data.margin_weight.markets = {};
    }

    // 빈 json 일때 백앤드에선 []로 저장되기에 추후에 버그가 생길수 있어서 프론트단에서 []받을시 강제로 {}로 전환
    if (Array.isArray(user_data.commission_rate.markets) && user_data.commission_rate.markets.length === 0) {
      user_data.commission_rate.markets = {};
    }


    //ImageDetail

    //更新顶部和底部图片的文件列表
    if (user_data.description_option && user_data.description_option.top_bottom_image) {
      const top_image_url = user_data.description_option.top_bottom_image.top_image_url;
      const bottom_image_url = user_data.description_option.top_bottom_image.bottom_image_url;

      // 如果有顶部图片 URL，则创建对应的文件列表项
      if (top_image_url) {
        fileListTop.value = [{
          uid: '-1',
          name: 'Top Image',
          status: 'done',
          url: top_image_url,
        }];
      }

      if (bottom_image_url) {
        fileListBottom.value = [{
          uid: '-2',
          name: 'Bottom Image',
          status: 'done',
          url: bottom_image_url,
        }];
      }
    }

    formState.settingDatas = user_data; //更新状态

    setTimeout(() => {
      formState.loading = false;
    }, 500);
  }).catch((error)=>{
    message.error('실패: ${error.message}');
    formState.loading = false;
  });
}

onMounted(() => {
  getMarketList();
  getUserInfoData();
});

</script>


<style scoped>
  .ant-btn-default{
    margin-right:20px;
  }

  :deep .ant-descriptions.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-content{
    padding: 8px 5px;
  }

  :deep .ant-descriptions.ant-descriptions-bordered .ant-descriptions-view >table{
    table-layout:fixed;
  }

.select{
    display:block;
    margin-top:10px;
  }

  .select .ant-select:first-child{
    margin-right:10px;
  }

  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .upload{
    display:block;
  }
  .image-fix{
    position:relative;
    display:inline-block;
    margin-top:10px;
  }
  .ant-upload-select-picture-card{
    margin-top:10px !important;
  }

  .upload-container.is-disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  :deep .ant-upload-list-item-actions {
    display: none;
  }

  :deep .ant-upload-list-item::before{
    display:none;
  }

  :deep .ant-upload-list-item-custom {
    position: relative;
  }

  :deep .delete-icon {
    color: red;
    position: absolute;
    right: 100px;
    top: 20px;
    cursor: pointer;
  }

</style>