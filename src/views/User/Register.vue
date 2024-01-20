<template>
  <div class="login-bg"></div>

  <div id="userRegister">
    <div class="item">
      <div style="display: flex;justify-content: center;width: 100%">
        <img src="@/assets/logo_icon.png"  key="logo-light">
      </div>
      <div>
        <h5>회원 기본정보</h5>
      </div>
      <!--      :rules="rulesRef"-->
      <a-form
          :rules="rulesRef"
          ref="formRef"
          class="registerForm"
          :layout="`vertical`"
          :model="formState"
          @finish="handleFinish"
          @finishFailed="handleFinishFailed"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >
        <a-descriptions-item>
          <span class="required"><strong>아이디</strong></span>
          <a-form-item name="username" has-feedback>
            <a-input v-model:value="formState.username" placeholder="아이디"/>
          </a-form-item>
          <div class="help">최소 5자 최대 20자이내로 입력해주십시오</div>
        </a-descriptions-item>
        <a-descriptions-item>
          <span class="required"><strong>비밀번호</strong></span>
          <a-form-item name="password" has-feedback>
            <a-input-password v-model:value="formState.password" type="password" placeholder="비밀번호"/>
          </a-form-item>
          <div class="help">비밀번호 길이는 최소 8자 최대 20자 이내로 입력해주십시오</div>
        </a-descriptions-item>

        <a-descriptions-item>
          <span class="required"><strong>비밀번호 확인</strong></span>
          <a-form-item name="password_confirm" has-feedback>
            <a-input-password v-model:value="formState.password_confirm" type="password" placeholder="비밀번호 확인"/>
          </a-form-item>
          <div class="help">비밀번호와 같게 입력해주십시오</div>
        </a-descriptions-item>

        <a-descriptions-item>
          <span class="required"><strong>사용자명</strong></span>
          <a-form-item name="name" has-feedback>
            <a-input v-model:value="formState.name" placeholder="사용자명"/>
          </a-form-item>
          <div class="help">최소 2자 최대 20자이내로 입력해주십시오</div>
        </a-descriptions-item>

        <a-descriptions-item>
          <span class="required"><strong>Email</strong></span>
          <a-form-item name="email" has-feedback>
            <a-input v-model:value="formState.email" placeholder="Email"/>
          </a-form-item>
          <div class="help">Email을 입력해주십시오</div>
        </a-descriptions-item>

        <a-descriptions-item>
          <span class="required"><strong>휴대전화</strong></span>
          <div class="center init-pmbo" style="align-items: flex-start !important;">
            <a-form-item name="phone1" class="w32 mr12" has-feedback>
              <a-input v-model:value="formState.phone1" placeholder="휴대전화" :maxlength="3"
                       @input="(event) => changeToInput(event, 3, phone2Input)"/>
            </a-form-item>
            <a-form-item name="phone2" class="w32 mr12" has-feedback>
              <a-input v-model:value="formState.phone2" placeholder="휴대전화" :maxlength="4"
                       @input="(event) => changeToInput(event, 4, phone3Input)" ref="phone2Input"/>
            </a-form-item>
            <a-form-item name="phone3" class="w32" has-feedback>
              <a-input v-model:value="formState.phone3" placeholder="휴대전화" :maxlength="4" ref="phone3Input"/>
            </a-form-item>
          </div>
          <div class="help">휴대전화를 입력해주십시오</div>
        </a-descriptions-item>

        <div style="margin-top: 50px; border-top: 1px solid #eee">
          <h5>사업자 정보</h5>
        </div>

        <a-descriptions-item>
          <span class="required"><strong>업체명/사업자명</strong></span>
          <a-form-item name="com_name" has-feedback>
            <a-input v-model:value="formState.com_name" placeholder="업체명/사업자명"/>
          </a-form-item>
          <div class="help">최소 2자 최대 20자이내로 입력해주십시오</div>
        </a-descriptions-item>

        <a-descriptions-item>
          <span class="required"><strong>사업자번호</strong></span>
          <a-form-item name="com_number" has-feedback>
            <a-input v-model:value="formState.com_number" placeholder="사업자번호"/>
          </a-form-item>
          <div class="help">사업자번호를 입력해주십시오</div>
        </a-descriptions-item>

        <a-descriptions-item>
          <span class="required"><strong>사업장 전화번호</strong></span>
          <div class="center init-pmbo" style="align-items: flex-start !important;">
            <a-form-item name="com_phone1" class="w32 mr12" has-feedback>
              <a-input v-model:value="formState.com_phone1" placeholder="사업장 전화번호" :maxlength="3"
                       @input="(event) => changeToInput(event, 3, comPhone2Input)"/>
            </a-form-item>
            <a-form-item name="com_phone2" class="w32 mr12" has-feedback>
              <a-input v-model:value="formState.com_phone2" placeholder="사업장 전화번호" :maxlength="4"
                       @input="(event) => changeToInput(event, 4, comPhone3Input)" ref="comPhone2Input"/>
            </a-form-item>
            <a-form-item name="com_phone3" class="w32" has-feedback>
              <a-input v-model:value="formState.com_phone3" placeholder="사업장 전화번호" :maxlength="4"
                       ref="comPhone3Input"/>
            </a-form-item>
          </div>
          <div class="help">사업장 전화번호를 입력해주십시오</div>
        </a-descriptions-item>

        <a-descriptions-item>
          <span class="required"><strong>대표자명</strong></span>
          <a-form-item name="com_ceo" has-feedback>
            <a-input v-model:value="formState.com_ceo" placeholder="대표자명"/>
          </a-form-item>
          <div class="help">최소 2자 최대 20자이내로 입력해주십시오</div>
        </a-descriptions-item>

        <a-descriptions-item>
          <span class="no_required"><strong>유선전화</strong></span>
          <div class="center init-pmbo" style="align-items: flex-start !important;">
            <a-form-item name="tel1" class="w32 mr12" has-feedback>
              <a-input v-model:value="formState.tel1" placeholder="유선전화" :maxlength="3"
                       @input="(event) => changeToInput(event, 3, tell2Input)"/>
            </a-form-item>
            <a-form-item name="tel2" class="w32 mr12" has-feedback>
              <a-input v-model:value="formState.tel2" placeholder="유선전화" :maxlength="4"
                       @input="(event) => changeToInput(event, 4, tell3Input)" ref="tell2Input"/>
            </a-form-item>
            <a-form-item name="tel3" class="w32" has-feedback>
              <a-input v-model:value="formState.tel3" placeholder="유선전화" :maxlength="4" ref="tell3Input"/>
            </a-form-item>
          </div>
          <div class="help">유선전화를 입력해주십시오</div>
        </a-descriptions-item>

        <a-descriptions-item>
          <span class="no_required"><strong>추천코드</strong></span>
          <a-form-item name="com_name" has-feedback>
            <a-input v-model:value="formState.recommend_code" placeholder="추천코드"/>
          </a-form-item>
          <div class="help">추천코드가 있다면 기입해주세요.</div>
        </a-descriptions-item>

        <!-- 가입시 입력 안해되는 항목 -->
        <div v-if="false">
          <a-descriptions-item>
            <span class="required"><strong>수수료율</strong></span>
            <a-form-item name="commission" has-feedback>
              <a-input v-model:value="formState.commission" placeholder="수수료율 [필수]">
                <template #prefix>
                  <LockOutlined style="color: rgba(0, 0, 0, 0.25)"/>
                </template>
              </a-input>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item>
            <span class="required"><strong>도매 수수료</strong></span>
            <a-form-item name="wholesale_commission" has-feedback>
              <a-input v-model:value="formState.wholesale_commission" placeholder="도매 수수료 [필수]">
                <template #prefix>
                  <LockOutlined style="color: rgba(0, 0, 0, 0.25)"/>
                </template>
              </a-input>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item>
            <span class="no_required"><strong>정산상품 기간설정</strong></span>
            <a-form-item name="ac_expect_date" has-feedback>
              <a-tooltip color="white" placement="left">
                <template #title>
                  <span style="color: #848a8a" v-html="tooltip.ac_expect_date"/>
                </template>
                <a-input v-model:value="formState.ac_expect_date" placeholder="정산상품 기간설정"/>
              </a-tooltip>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item>
            <span class="required"><strong>정산방식</strong></span>
            <a-form-item name="account_type" v-bind="validateInfos.account_type">
              <a-tooltip color="white" placement="left">
                <template #title>
                  <span style="color: #848a8a" v-html="tooltip.account_type"/>
                </template>
                <a-select v-model:value="formState.account_type">
                  <a-select-option value="0">선택해주세요</a-select-option>
                  <a-select-option value="1">판매가</a-select-option>
                  <a-select-option value="2">매입가</a-select-option>
                  <a-select-option value="4">선불</a-select-option>
                </a-select>
              </a-tooltip>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item>
            <span class="required"><strong>정산유형</strong></span>
            <a-form-item name="account_div" v-bind="validateInfos.account_div">
              <a-select v-model:value="formState.account_div">
                <a-select-option value="0">선택해주세요</a-select-option>
                <a-select-option value="c">카테고리별 설정</a-select-option>
                <a-select-option value="s">셀러별 설정</a-select-option>
              </a-select>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="정산일자유형">
            <span class="no_required"><strong>정산일자유형</strong></span>
            <a-form-item name="ac_delivery_type">
              <a-select v-model:value="formState.ac_delivery_type">
                <a-select-option value="0">선택해주세요</a-select-option>
                <a-select-option value="IC">입금확인</a-select-option>
                <a-select-option value="DI">배송중</a-select-option>
                <a-select-option value="DC">배송완료</a-select-option>
                <a-select-option value="BF">구매확정</a-select-option>
              </a-select>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item>
            <span class="no_required"><strong>결제유형</strong></span>
            <a-form-item name="account_method">
              <a-select v-model:value="formState.account_method">
                <a-select-option value="0">선택해주세요</a-select-option>
                <a-select-option value="10">현금</a-select-option>
                <a-select-option value="12">예치금</a-select-option>
              </a-select>
            </a-form-item>
          </a-descriptions-item>
        </div>

        <div class="foorterSetting">
          <a-checkbox v-model:checked="checked">회원약관 동의.
            <a-button class="init" type="link">[관리자페이지]</a-button>
          </a-checkbox>
        </div>

        <div class="foorterSetting">
          <a-checkbox v-model:checked="formState.is_bridge_sync">
            배대지 동시가입
          </a-checkbox>
          <a-button type="primary" size="small" @click.prevent="bridgeSyncCheck"
                    :disabled="formState.is_bridge_sync === false">중복확인
          </a-button>
          <div style="color: #999999">배대지 아이디가 있을경우 동시가입 체크 해제후 가입해주시고 계정관리에서 바인딩해 주세요.</div>
        </div>

        <a-form-item class="buttons">
          <a-button type="primary" html-type="submit"
                    :disabled="formState.is_bridge_sync === true && bridge_sync_pass !== true"
                    style="font-weight: bold;color: black"
          >회원가입
          </a-button>
          <a-button class="init" type="link" :href="'/user/login'">
            <UserOutlined/>
            이미 회원이신가요? 로그인하기
          </a-button>
        </a-form-item>

      </a-form>
    </div>
  </div>
</template>

<script>
import router, {setFilterRouteList} from "router/index.js";
import {AuthRequest, LoginRequest, NoAuthAjax} from "util/request";
import {defineComponent, reactive, onBeforeMount, ref} from "vue";
import {UserOutlined, LockOutlined} from "@ant-design/icons-vue";
import Cookie from "js-cookie";
import {isLogin, cookieInit} from "util/auth";
import {useForm} from "ant-design-vue/es/form";
import Loading from "vue-loading-overlay";
import {message} from "ant-design-vue";
import {useBridgeApi} from "@/api/bridge";
import {lib} from "@/util/lib";
import {useRoute} from "vue-router";


export default defineComponent({
  components: {
    Loading,
    UserOutlined,
    LockOutlined
  },

  setup() {
    onBeforeMount(() => {
      if (isLogin() === true) {
        router.push("/product");
        return false;
      }
    });

    let route = useRoute();
    setTimeout(function () {
      window.document.title = route?.meta?.title;
    });

    const bridge_sync_pass = ref(false);
    const formRef = ref();
    const formState = reactive({
      username: "",
      password: "",
      password_confirm: "",
      //[필수] 사용자명/사업자명
      name: "",
      //[필수] 이메일
      email: "",
      //[필수] 휴대전화
      phone1: "",
      phone2: "",
      phone3: "",
      //유선전화
      tel1: "",
      tel2: "",
      tel3: "",
      //[필수] 사업자명/업체명
      com_name: "",
      //[필수] 사업자번호
      com_number: "",
      //사업장전화번호
      com_phone1: "",
      com_phone2: "",
      com_phone3: "",
      //대표자명
      com_ceo: "",
      //업종
      //com_business_category: formState.com_business_category,
      //업태
      //com_business_status: formState.com_business_status,
      //[필수] 정산방식 : 기본값( 미입력시 ) - 1
      account_type: "1",
      //정산 상품 기간설정 : 기본값( 미입력시 ) - 1
      account_info: "",
      //정산일자 IC - 입금확인
      ac_delivery_type: "IC",
      //정산 상품 기간설정 : 1 ~ 30 일
      ac_expect_date: "10",
      //정산 유형 : 기본값( 미입력시 ) - 10
      account_method: "10",
      //[필수] 정산방식 : 기본값( 미입력시 ) - s
      account_div: "c",
      //[필수]수수료율
      commission: "0",
      //[필수]도매 수수료
      wholesale_commission: "0",
      is_bridge_sync: false,
      // 추천코드
      recommend_code: ""
    });

    const tooltip = {
      account_type: "판매가: 정산방식 판매가에 수수료 적용 후 정산처리됩니다. " +
          "<br/><br/>매입가: 정산방식 공급가로 정산되며, 하단 수수료에 0이 아닌 숫자를 입력시 그 숫자의 % 만큼 차감후 정산처리됩니다." +
          "<br/><br/>선불: 공급가로 정산되며, 발주 요청시 송금처리",
      ac_expect_date: "정산상품 기간설정은 1~30일내로 입력가능합니다."
    };

    const handleFinish = () => {
      if (!checked.value) {
        message.warning('회원가입 하시러면 회원약관 내용을 읽어보시고 약관 동의가 필요합니다.');
        return false;
      }

      let user = {
        username: formState.username,
        password: formState.password,
        name: formState.name,
        email: formState.email,
        phone: formState.phone1 + "-" + formState.phone2 + "-" + formState.phone3,
        tel: formState.tel1 + "-" + formState.tel2 + "-" + formState.tel3,
        com_name: formState.com_name,
        com_number: formState.com_number,
        com_phone: formState.com_phone1 + "-" + formState.com_phone2 + "-" + formState.com_phone3,
        com_ceo: formState.com_ceo,
        //com_business_category: formState.com_business_category,
        //com_business_status: formState.com_business_status,
        account_type: formState.account_type,
        account_info: formState.account_info,
        ac_delivery_type: formState.ac_delivery_type,
        ac_expect_date: formState.ac_expect_date,
        account_method: formState.account_method,
        account_div: formState.account_div,
        commission: formState.commission,
        wholesale_commission: formState.wholesale_commission,
        is_bridge_sync: formState.is_bridge_sync,
        recommend_code: formState.recommend_code
      };

      NoAuthAjax.post(
          process.env.VUE_APP_API_URL + "/api/register", user).then((res) => {
        if (res.data === undefined) {
          message.error("데이터처리중 오류가 발생했습니다. 오류가 지속될시 관리자에게 문의하시길 바랍니다.");
          return false;
        }

        let returnData = res.data;
        if (returnData.status === undefined || returnData.status !== "2000") {
          message.error(returnData.message);
          return false;
        }

        let loginUser = {
          username: formState.username,
          password: formState.password
        };

        LoginRequest.post(
            process.env.VUE_APP_API_URL + "/api/login", loginUser).then((res) => {
          if (res.status === undefined || res.status !== "2000") {
            message.error("일시적인 서버장애로 로그인에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.");
            Cookie.remove("token");
            Cookie.remove("member_name");
            Cookie.remove("member_roles");
            router.push("/user/login");
            return false;
          }

          let returnData = res.data;
          if (returnData.member_roles === undefined || returnData.member_name === undefined) {
            message.error("일시적인 로그인 권한오류가 발생하였습니다. 로그인페이지에서 재시도 해주시길 바랍니다.");
            Cookie.remove("token");
            Cookie.remove("member_name");
            Cookie.remove("member_roles");
            router.push("/user/login");
            return false;
          }

          Cookie.set("member_name", returnData.member_name);
          Cookie.set("member_roles", returnData.member_roles);
          const menuList = setFilterRouteList();
          router.addRoute(menuList[0])
          message.success("회원가입에 성공하였습니다.");
          router.push("/market/accounts/list");
          return false;
        });
      });
    };

    let oldName = "";
    let validateUsername = async (rule, value) => {
      if (value === "") {
        return Promise.reject("아이디를 입력해주십시오");
      } else {
        if (oldName === value) {
          return Promise.resolve();
        }

        if (value.length < 5 || value.length > 20) {
          return Promise.reject("최소 5자 최대 20자이내로 입력해주십시오");
        }

        let returnData = await NoAuthAjax.post(
            process.env.VUE_APP_API_URL + "/api/checkname", value).then((res) => {
          return res.data;
        });

        if (returnData === undefined || returnData.status === undefined) {
          message.warning("서버장애로 인해 회원가입에 실패하였습니다. \n 잠시후 시도해주시길 바랍니다.");
          return false;
        }

        if (returnData.status !== "2000") {
          return Promise.reject("이미 존재하는 아이디입니다.");
        }

        oldName = value;
        return Promise.resolve();
      }
    };

    let validatePass = async (rule, value) => {
      if (value === "") {
        return Promise.reject("비밀번호를 입력해주십시오");
      } else {
        //let password = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$";
        if (value.length < 8 || value.length > 20) {
          return Promise.reject("비밀번호 길이는 최소 8자 최대 20자이내로 입력해주십시오");
        }

        if (formState.password_confirm !== "") {
          formRef.value.validateFields("password_confirm");
        }

        return Promise.resolve();
      }
    };

    let validatePassConfirm = async (rule, value) => {
      if (value === "") {
        return Promise.reject("비밀번호가 일치하지 않습니다");
      } else if (value !== formState.password) {
        return Promise.reject("비밀번호가 일치하지 않습니다");
      } else {
        return Promise.resolve();
      }
    };

    let validateName = async (rule, value) => {
      if (value === "") {
        return Promise.reject("사용자명을 입력해주십시오");
      } else {
        if (value.length < 2 || value.length > 20) {
          return Promise.reject("사용자명은 최소 2자 최대 20자이내로 입력해주십시오");
        }
      }

      return Promise.resolve();
    };

    let validateEmail = async (rule, value) => {
      if (value === "") {
        return Promise.reject("메일을 입력해주십시오");
      } else {
        let regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        if (regEmail.test(value) !== true) {
          return Promise.reject("메일 격식이 옳바르지 않습니다.");
        }
      }

      return Promise.resolve();
    };

    let validatePhone = async (rule, value) => {
      if (value === "") {
        return Promise.reject("번호를 입력해주십시오");
      } else {
        let regPhone = /^\d{4}$/;
        if (regPhone.test(value) !== true) {
          return Promise.reject("숫자를 입력해주십시오");
        }
      }

      return Promise.resolve();
    };

    let _validatePhone = async (rule, value) => {
      if (value === "") {
        return Promise.reject("번호를 입력해주십시오");
      } else {
        let regPhone = /^\d{4}$/;
        if (regPhone.test(value) !== true) {
          return Promise.reject("숫자를 입력해주십시오");
        }
      }

      return Promise.resolve();
    };

    let validatePhoneFirst = async (rule, value) => {
      if (value === "") {
        return Promise.reject("번호를 입력해주십시오");
      } else {
        let regPhone = /^\d{2,3}$/;
        if (regPhone.test(value) !== true) {
          return Promise.reject("숫자를 입력해주십시오");
        }
      }

      return Promise.resolve();
    };

    let validateComname = async (rule, value) => {
      if (value === "") {
        return Promise.reject("업체 또는 사업자명을 입력해주십시오");
      } else {
        if (value.length < 2 || value.length > 20) {
          return Promise.reject("업체명은 최소 2자 최대 20자이내로 입력해주십시오");
        }
      }

      return Promise.resolve();
    };

    let validateComnumber = async (rule, value) => {
      if (value === "") {
        return Promise.reject("사업자번호를 입력해주십시오");
      } else {
        let comnumber = /^([0-9]{3})-?([0-9]{2})-?([0-9]{5})$/;

        if (comnumber.test(value) !== true) {
          return Promise.reject("사업자번호 격식이 옳바르지 않습니다.");
        }
      }

      return Promise.resolve();
    };

    let validateCommission = async (rule, value) => {
      if (value === "") {
        return Promise.reject("수수료율을 입력해주십시오");
      } else {
        let commission = /^[0-9]*$/;
        if (commission.test(value) !== true) {
          return Promise.reject("수수료율 격식이 옳바르지 않습니다.");
        }
      }

      return Promise.resolve();
    };

    let validateWholesale = async (rule, value) => {
      if (value === "") {
        return Promise.reject("도매수수료를 입력해주십시오");
      } else {
        let wholesale = /^[0-9]*$/;
        if (wholesale.test(value) !== true) {
          return Promise.reject("도매수수료 격식이 옳바르지 않습니다.");
        }
      }

      return Promise.resolve();
    };

    let validateAcctype = async (rule, value) => {
      if (value === "0") {
        return Promise.reject("정선방식을 선택해주십시오");
      }

      return Promise.resolve();
    };

    let validateAccdiv = async (rule, value) => {
      if (value === "0") {
        return Promise.reject("정선유형을 선택해주십시오");
      }

      return Promise.resolve();
    };

    let validateExdate = async (rule, value) => {
      if (value.length > 0) {
        if (value < 1 || value > 30) {
          return Promise.reject("최소 1일 최대 30일까지 가능합니다.");
        }

        return Promise.resolve();
      }
    };

    let validateTel = async (rule, value) => {
      if (value.length > 0) {
        let tel = /^(0(2|3[1-9]|4[1-9]|5[1-9]|6[1-9]))-?(\d{3,4})-?(\d{4})$/;
        if (tel.test(value) !== true) {
          return Promise.reject("전화번호 격식이 옳바르지 않습니다.");
        }
      }

      return Promise.resolve();
    };

    let validateComphone = async (rule, value) => {
      if (value === "") {
        return Promise.reject("사업장전화번호 입력해주십시오");
      } else {
        if (value.length > 0) {
          let tel = /^(0(2|3[1-9]|4[1-9]|5[1-9]|6[1-9]))-?(\d{3,4})-?(\d{4})$/;
          if (tel.test(value) !== true) {
            return Promise.reject("사업장전화번호 격식이 옳바르지 않습니다.");
          }
        }
      }

      return Promise.resolve();
    };

    let validateComCeo = async (rule, value) => {
      if (value === "") {
        return Promise.reject("대표자명을 입력해주십시오");
      } else {
        if (value.length < 2 || value.length > 10) {
          return Promise.reject("대표자명은 최소 2자 최대 10자이내로 입력해주십시오");
        }
      }

      return Promise.resolve();
    };

    const handleFinishFailed = () => {
      //message.warning('Login Error')
    };

    const phone2Input = ref(null);
    const phone3Input = ref(null);
    const comPhone2Input = ref(null);
    const comPhone3Input = ref(null);
    const tell2Input = ref(null);
    const tell3Input = ref(null);
    const changeToInput = (event, maxLength, targetInput) => {
      if (event.target.value.length === maxLength) {
        targetInput.focus();
      }
    };

    const remember = false;

    const rulesRef = reactive({
      username: [
        {
          required: true,
          validator: validateUsername,
          trigger: "blur"
        }
      ],
      password: [
        {
          validator: validatePass,
          trigger: "blur"
        }
      ],
      password_confirm: [
        {
          validator: validatePassConfirm,
          trigger: "blur"
        }
      ],
      name: [
        {
          required: true,
          validator: validateName,
          trigger: "blur"
        }
      ],
      email: [
        {
          required: true,
          validator: validateEmail,
          trigger: "blur"
        }
      ],
      phone1: [
        {
          required: true,
          validator: validatePhoneFirst,
          trigger: "blur"
        }
      ],
      phone2: [
        {
          required: true,
          validator: _validatePhone,
          trigger: "blur"
        }
      ],
      phone3: [
        {
          required: true,
          validator: validatePhone,
          trigger: "blur"
        }
      ],
      com_name: [
        {
          required: true,
          validator: validateComname,
          trigger: "blur"
        }
      ],
      com_number: [
        {
          required: true,
          validator: validateComnumber,
          trigger: "blur"
        }
      ],
      com_phone1: [
        {
          required: true,
          validator: validatePhoneFirst,
          trigger: "blur"
        }
      ],
      com_phone2: [
        {
          required: true,
          validator: _validatePhone,
          trigger: "blur"
        }
      ],
      com_phone3: [
        {
          required: true,
          validator: validatePhone,
          trigger: "blur"
        }
      ],
      com_ceo: [
        {
          required: true,
          validator: validateComCeo,
          trigger: "blur"
        }
      ],
      commission: [
        {
          required: true,
          validator: validateCommission,
          trigger: "blur"
        }
      ],
      wholesale_commission: [
        {
          required: true,
          validator: validateWholesale,
          trigger: "blur"
        }
      ],
      account_type: [
        {
          required: true,
          validator: validateAcctype,
          trigger: "change"
        }
      ],
      account_div: [
        {
          required: true,
          validator: validateAccdiv,
          trigger: "change"
        }
      ],
      ac_expect_date: [
        {
          validator: validateExdate,
          trigger: "blur"
        }
      ]
    });

    const {resetFields, validate, validateInfos} = useForm(formState, rulesRef);

    const checked = ref(false);

    const bridgeSyncCheck = () => {
      if (formState.is_bridge_sync === true) {

        NoAuthAjax.post(
            process.env.VUE_APP_API_URL + "/api/bridge/syncCheck", {
              mb_id: formState.username
            }).then((res) => {

          if (res.data.status !== "2000") {
            message.error(res.data.message);
            return false;
          }

          if (res.data.data.code !== "2000") {
            message.error(res.data.data.message);
            return false;
          }

          message.success("배대지 동시가입 가능 합니다. 회원가입 진행 해주세요.");
          bridge_sync_pass.value = true;
        });
      }
    };

    return {
      checked,
      labelCol: {
        style: {
          width: "400px"
        }
      },
      wrapperCol: {
        span: 25
      },
      tooltip,
      formRef,
      rulesRef,
      resetFields,
      validate,
      validateInfos,
      remember,
      formState,
      handleFinish,
      handleFinishFailed,
      phone2Input,
      phone3Input,
      comPhone2Input,
      comPhone3Input,
      tell2Input,
      tell3Input,
      changeToInput,
      bridge_sync_pass,
      bridgeSyncCheck,
      lib
    };
  }
});
</script>

<!--container-->
<style scoped>
/*::-webkit-scrollbar {*/
/*  width: 0 !important;*/
/*}*/

.login-bg {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background: #ffdb41;
}

#userRegister .init {
  margin: 0 !important;
  padding: 0 !important;
}

#userRegister {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  width: 100%;
  /*position: fixed;*/
  /*overflow-y: hidden;*/
}

#userRegister .header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-top: 153px;
  width: 100%;
  height: 89px;
}

#userRegister .icon {
  z-index: 1;
}

#userRegister .tip {
  margin-top: 9px;
}

#userRegister .tip h5 {
  font-size: 16px !important;
  color: rgba(255, 255, 255, .5) !important;
  font-weight: 600;
  text-align: center !important;
  font-family: Nunito, sans-serif;
}
</style>

<!--item-->
<style>
#userRegister .item {
  width: 1080px;
  margin-top: 80px;
  margin-bottom: 80px;
  background-color: white;
  padding: 60px;
  border-radius: 30px;
  z-index: 1;
}

#userRegister .item h5 {
  margin: 20px 0 30px;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
}

#userRegister .item .required, #userRegister .item .no_required {
  display: block;
  padding-bottom: 5px;
}

#userRegister .item .required:after {
  content: '*';
  padding-left: 3px;
  color: red;
}

#userRegister .item .help {
  margin: -20px 0 20px;
  padding-left: 10px;
  font-size: 12px;
  color: #999;
}

#userRegister .item .ant-form-item-with-help {
  margin-bottom: 19px;
}

#userRegister .item .ant-form-item-with-help + .help {
  display: none;
}

#userRegister .ant-descriptions-item-content input {
  width: 100%;
  height: 45px;
}

#userRegister input,
#userRegister .ant-select,
#userRegister .ant-select-selector {
  width: 100%;
  height: 30px !important;
}

#userRegister .ant-select-selection-item {
  padding-top: 7px !important;
  text-align: center;
}

#userRegister .foorterSetting {
  margin-bottom: 18px;
}

#userRegister .buttons .ant-form-item-control-input-content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 90px;
}

#userRegister .buttons .ant-form-item-control-input-content button {
  height: 39px;
  border-radius: 5px;
}


#userRegister .buttons .ant-form-item-control-input-content button:last-child {
  margin-top: 20px;
  color: gray;
}
</style>
