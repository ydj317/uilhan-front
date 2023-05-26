<template>
  <div id="userRegister">
    <div class="header">
      <div class="icon">
        <img src="../../assets/img/logo-light.png" alt="">
      </div>
<!--      <div class="tip">-->
<!--        <h5>저희 릴라켓플러스 이용해주셔서 감사합니다!</h5>-->
<!--      </div>-->
    </div>
    <div class="item">
        <div>
          <h5>회원가입</h5>
        </div>
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
<!--          <a-descriptions title="" :column="1" :bordered="true" :contentStyle="{'padding-top':'45px'}">-->
          <a-descriptions-item label="아이디 [필수]" :labelStyle="{color: 'red',width: '220px'}">
            <span><strong>아이디 [필수]</strong></span>
            <a-form-item name="username" has-feedback>
              <a-input
                  class="inputStyle"
                  v-model:value="formState.username"
                  placeholder="아이디 [필수]"
              >
              </a-input>
            </a-form-item>
          </a-descriptions-item>
          <a-descriptions-item label="비밀번호 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>비밀번호 [필수]</strong></span>
          <a-form-item name="password" has-feedback>
            <a-input
                class="inputStyle"
                v-model:value="formState.password"
                type="password"
                placeholder="비밀번호 [필수]"
            >
            </a-input>
          </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="비밀번호 확인 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>비밀번호 확인 [필수]</strong></span>
          <a-form-item name="password_confirm" has-feedback>
            <a-input
                class="inputStyle"
                v-model:value="formState.password_confirm"
                type="password"
                placeholder="비밀번호 확인 [필수]">
            </a-input>
          </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="사용자명/사업자명 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>사용자명/사업자명 [필수]</strong></span>
          <a-form-item name="name" has-feedback>
            <a-input
                class="inputStyle"
                v-model:value="formState.name"
                placeholder="사용자명/사업자명 [필수]"
            >
            </a-input>
          </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="Email [필수]" :labelStyle="{color: 'red'}">
            <span><strong>Email [필수]</strong></span>
          <a-form-item name="email" has-feedback>
            <a-input
                class="inputStyle"
                v-model:value="formState.email"
                placeholder="Email [필수]"
            >
            </a-input>
          </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="휴대전화 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>휴대전화 [필수]</strong></span>
            <div class="center init-pmbo">
              <a-form-item name="phone1" class="w32 mr12" has-feedback>
                <a-input
                    v-model:value="formState.phone1"
                    placeholder="휴대전화 [필수]"
                    :maxlength="4"
                >
                </a-input>
              </a-form-item>
              <a-form-item name="phone2" class="w32 mr12" has-feedback>
                <a-input
                    v-model:value="formState.phone2"
                    placeholder="휴대전화 [필수]"
                    :maxlength="4"
                >
                </a-input>
              </a-form-item>
              <a-form-item name="phone3" class="w32" has-feedback>
                <a-input
                    v-model:value="formState.phone3"
                    placeholder="휴대전화 [필수]"
                    :maxlength="4"
                >
                </a-input>
              </a-form-item>
            </div>
          </a-descriptions-item>

          <a-descriptions-item label="업체명/사업자명 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>업체명/사업자명 [필수]</strong></span>
            <a-form-item name="com_name" has-feedback>
              <a-input
                  class="inputStyle"
                  v-model:value="formState.com_name"
                  placeholder="업체명/사업자명 [필수]"
              >
              </a-input>
            </a-form-item>
          </a-descriptions-item>

            <a-descriptions-item label="사업자번호 [필수]" :labelStyle="{color: 'red'}">
              <span><strong>사업자번호 [필수]</strong></span>
          <a-form-item name="com_number" has-feedback>
            <a-input
                class="inputStyle"
                v-model:value="formState.com_number"
                placeholder="사업자번호 [필수]"
            >
            </a-input>
          </a-form-item>
            </a-descriptions-item>
          <a-descriptions-item label="사업장 전화번호 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>사업장 전화번호 [필수]</strong></span>
            <div class="center init-pmbo">
              <a-form-item name="com_phone1" class="w32 mr12" has-feedback>
                <a-input
                    v-model:value="formState.com_phone1"
                    placeholder="사업장 전화번호 [필수]"
                    :maxlength="4"
                >
                </a-input>
              </a-form-item>
              <a-form-item name="com_phone2" class="w32 mr12" has-feedback>
                <a-input
                    v-model:value="formState.com_phone2"
                    placeholder="사업장 전화번호 [필수]"
                    :maxlength="4"
                >
                </a-input>
              </a-form-item>
              <a-form-item name="com_phone3" class="w32" has-feedback>
                <a-input
                    v-model:value="formState.com_phone3"
                    placeholder="사업장 전화번호 [필수]"
                    :maxlength="4"
                >
                </a-input>
              </a-form-item>
            </div>
          </a-descriptions-item>

          <a-descriptions-item label="대표자명 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>대표자명 [필수]</strong></span>
          <a-form-item name="com_ceo" has-feedback>
            <a-input
                class="inputStyle"
                v-model:value="formState.com_ceo"
                placeholder="대표자명"
            >
            </a-input>
          </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="수수료율 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>수수료율 [필수]</strong></span>
          <a-form-item name="commission" has-feedback>
            <a-input class="inputStyle" v-model:value="formState.commission" placeholder="수수료율 [필수]">
              <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
            </a-input>
          </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="도매 수수료 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>도매 수수료 [필수]</strong></span>
          <a-form-item name="wholesale_commission" has-feedback>
            <a-input class="inputStyle" v-model:value="formState.wholesale_commission" placeholder="도매 수수료 [필수]">
              <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
            </a-input>
          </a-form-item>
          </a-descriptions-item>

            <a-descriptions-item label="유선전화">
              <span><strong>유선전화</strong></span>
              <div class="center init-pmbo">
                <a-form-item name="tel1" class="w32 mr12" has-feedback>
                  <a-input
                      v-model:value="formState.tel1"
                      placeholder="유선전화"
                      :maxlength="4"
                  >
                  </a-input>
                </a-form-item>
                <a-form-item name="tel2" class="w32 mr12" has-feedback>
                  <a-input
                      v-model:value="formState.tel2"
                      placeholder="유선전화"
                      :maxlength="4"
                  >
                  </a-input>
                </a-form-item>
                <a-form-item name="tel3" class="w32" has-feedback>
                  <a-input
                      v-model:value="formState.tel3"
                      placeholder="유선전화"
                      :maxlength="4"
                  >
                  </a-input>
                </a-form-item>
              </div>
            </a-descriptions-item>

            <a-descriptions-item label="정산상품 기간설정">
              <span><strong>정산상품 기간설정</strong></span>
          <a-form-item name="ac_expect_date" has-feedback>
            <a-tooltip color="white"  placement="left">
              <template #title>
                <span style="color: #848a8a" v-html="tooltip.ac_expect_date" />
              </template>
              <a-input
                  class="inputStyle"
                  v-model:value="formState.ac_expect_date"
                  placeholder="정산상품 기간설정"
              >
              </a-input>
            </a-tooltip>
          </a-form-item>
            </a-descriptions-item>

          <a-descriptions-item label="정산방식 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>정산방식 [필수]</strong></span>
            <a-form-item name="account_type" v-bind="validateInfos.account_type">
              <a-tooltip color="white"  placement="left">
                <template #title>
                  <span style="color: #848a8a" v-html="tooltip.account_type" />
                </template>
                <a-select
                    class="inputStyle"
                    v-model:value="formState.account_type"
                >
                  <a-select-option value="0">정산방식 [필수]</a-select-option>
                  <a-select-option value="1">판매가</a-select-option>
                  <a-select-option value="2">매입가</a-select-option>
                  <a-select-option value="4">선불</a-select-option>
                </a-select>
              </a-tooltip>
            </a-form-item>
          </a-descriptions-item>

          <a-descriptions-item label="정산유형 [필수]" :labelStyle="{color: 'red'}">
            <span><strong>정산유형 [필수]</strong></span>
            <a-form-item name="account_div" v-bind="validateInfos.account_div">
              <a-select
                  class="inputStyle"
                  v-model:value="formState.account_div"
              >
                <a-select-option value="0">정산유형 [필수]</a-select-option>
                <a-select-option value="c">카테고리별 설정</a-select-option>
                <a-select-option value="s">셀러별 설정</a-select-option>
              </a-select>
            </a-form-item>
          </a-descriptions-item>

            <a-descriptions-item label="정산일자유형" >
              <span><strong>정산일자유형</strong></span>
          <a-form-item name="ac_delivery_type">
            <a-select
                class="inputStyle"
                v-model:value="formState.ac_delivery_type"
            >
              <a-select-option value="0">처리상태를 선택해주세요</a-select-option>
              <a-select-option value="IC">입금확인</a-select-option>
              <a-select-option value="DI">배송중</a-select-option>
              <a-select-option value="DC">배송완료</a-select-option>
              <a-select-option value="BF">구매확정</a-select-option>
            </a-select>
          </a-form-item>
            </a-descriptions-item>

            <a-descriptions-item label="결제유형">
              <span><strong>결제유형</strong></span>
          <a-form-item name="account_method">
            <a-select
                class="inputStyle"
                v-model:value="formState.account_method"
            >
              <a-select-option value="0">결제유형을 선택해주세요</a-select-option>
              <a-select-option value="10">현금</a-select-option>
              <a-select-option value="12">예치금</a-select-option>
            </a-select>
          </a-form-item>
            </a-descriptions-item>

          <div class="foorterSetting">
            <a-checkbox v-model:checked="checked">회원약관 동의. <a-button class="init" type="link">[관리자페이지]</a-button></a-checkbox>
          </div>

          <a-form-item class="buttons">
            <a-button
                type="primary"
                html-type="submit"
                class="loginButton"
                style="float: left"
            >
              회원가입
            </a-button>
<!--            <a-button class="loginButton" @click="resetFields">Reset</a-button>-->
            <a-button class="init" type="link" :href="'/user/login'"><UserOutlined />이미 회원이신가요? 로그인하기</a-button>
          </a-form-item>
<!--          </a-descriptions>-->
        </a-form>
      </div>
  </div>
</template>
<script>
import router from "router/index.js";
import {LoginRequest, NoAuthAjax} from 'util/request';
import { defineComponent, reactive, onBeforeMount, ref } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import Cookie from "js-cookie";
import { isLogin, cookieInit } from "util/auth";
import {useForm} from "ant-design-vue/es/form";


export default defineComponent({
  components: {
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

    const formRef = ref();
    const formState = reactive({
      username: '',
      password: '',
      password_confirm: '',
      //[필수] 사용자명/사업자명
      name: '',
      //[필수] 이메일
      email: '',
      //[필수] 휴대전화
      phone1: '',
      phone2: '',
      phone3: '',
      //유선전화
      tel1: '',
      tel2: '',
      tel3: '',
      //[필수] 사업자명/업체명
      com_name: '',
      //[필수] 사업자번호
      com_number: '',
      //사업장전화번호
      com_phone1: '',
      com_phone2: '',
      com_phone3: '',
      //대표자명
      com_ceo: '',
      //업종
      //com_business_category: formState.com_business_category,
      //업태
      //com_business_status: formState.com_business_status,
      //[필수] 정산방식 : 기본값( 미입력시 ) - 1
      account_type: '0',
      //정산 상품 기간설정 : 기본값( 미입력시 ) - 1
      account_info: '',
      //정산일자 IC - 입금확인
      ac_delivery_type: '0',
      //정산 상품 기간설정 : 1 ~ 30 일
      ac_expect_date: '',
      //정산 유형 : 기본값( 미입력시 ) - 10
      account_method: '0',
      //[필수] 정산방식 : 기본값( 미입력시 ) - s
      account_div: '0',
      //[필수]수수료율
      commission: '',
      //[필수]도매 수수료

      wholesale_commission: '',
    });

    const tooltip = {
      account_type: '판매가: 정산방식 판매가에 수수료 적용 후 정산처리됩니다. ' +
          '<br/><br/>매입가: 정산방식 공급가로 정산되며, 하단 수수료에 0이 아닌 숫자를 입력시 그 숫자의 % 만큼 차감후 정산처리됩니다.' +
          '<br/><br/>선불: 공급가로 정산되며, 발주 요청시 송금처리',
      ac_expect_date: '정산상품 기간설정은 1~30일내로 입력가능합니다.',
    };

    const handleFinish = () => {
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
      };

      NoAuthAjax.post(
        process.env.VUE_APP_API_URL + '/api/register', user).then((res) => {
        console.log(res)

        if (res.data === undefined) {
          alert('데이터처리중 오류가 발생했습니다. 오류가 지속될시 관리자에게 문의하시길 바랍니다.');
          return false;
        }

        let returnData = res.data;
        if (returnData.status === undefined || returnData.status !== '2000') {
          alert(returnData.message);
          return false;
        }

        let loginUser = {
          username: formState.username,
          password: formState.password
        };

        LoginRequest.post(
          process.env.VUE_APP_API_URL + '/api/login', loginUser).then((res) => {
          if (res.status === undefined || res.status !== '2000') {
            alert('일시적인 서버장애로 로그인에 실패하였습니다. 잠시 후 시도해주시길 바랍니다.');
            Cookie.remove('token');
            Cookie.remove('member_name');
            Cookie.remove('member_roles');
            router.push("/user/login");
            return false;
          }

          let returnData = res.data;
          if (returnData.member_roles === undefined || returnData.member_name === undefined) {
            alert('일시적인 로그인 권한오류가 발생하였습니다. 로그인페이지에서 재시도 해주시길 바랍니다.');
            Cookie.remove('token');
            Cookie.remove('member_name');
            Cookie.remove('member_roles');
            router.push("/user/login");
            return false;
          }

          Cookie.set('member_name', returnData.member_name);
          Cookie.set('member_roles', returnData.member_roles);
          alert('회원가입에 성공하였습니다.');
          router.push("/product");
          return false;
        });
      });
    };

    let oldName = '';
    let validateUsername = async (rule, value) => {
      if (value === '') {
        return Promise.reject('아이디를 입력해주십시오');
      } else {
        if (oldName === value) {
          return Promise.resolve();
        }

        if (value.length < 5 || value.length > 20) {
          return Promise.reject('최소 5자 최대 20자이내로 입력해주십시오');
        }

        let returnData = await NoAuthAjax.post(
            process.env.VUE_APP_API_URL + '/api/checkname', value).then((res) => {
          return res.data;
        });

        if (returnData === undefined || returnData.status === undefined) {
          alert("서버장애로 인해 회원가입에 실패하였습니다. \n 잠시후 시도해주시길 바랍니다.");
          return false;
        }

        if (returnData.status !== '2000') {
          return Promise.reject('이미 존재하는 아이디입니다.');
        }

        oldName = value;
        return Promise.resolve();
      }
    };

    let validatePass = async (rule, value) => {
      if (value === '') {
        return Promise.reject('비밀번호를 입력해주십시오');
      } else {
        //let password = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$";
        if (value.length < 8 || value.length > 20) {
          return Promise.reject('비밀번호 길이는 최소 8자 최대 20자이내로 입력해주십시오');
        }

        if (formState.password_confirm !== '') {
          formRef.value.validateFields('password_confirm');
        }

        return Promise.resolve();
      }
    };

    let validatePassConfirm = async (rule, value) => {
      if (value === '') {
        return Promise.reject('비밀번호가 일치하지 않습니다');
      } else if (value !== formState.password) {
        return Promise.reject("비밀번호가 일치하지 않습니다");
      } else {
        return Promise.resolve();
      }
    };

    let validateName = async (rule, value) => {
      if (value === '') {
        return Promise.reject('사업자명을 입력해주십시오');
      } else {
        if (value.length < 2 || value.length > 20) {
          return Promise.reject('사업자명은 최소 2자 최대 20자이내로 입력해주십시오');
        }
      }

      return Promise.resolve();
    };

    let validateEmail = async (rule, value) => {
      if (value === '') {
        return Promise.reject('메일을 입력해주십시오');
      } else {
        let regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        if (regEmail.test(value) !== true) {
          return Promise.reject('메일 격식이 옳바르지 않습니다.');
        }
      }

      return Promise.resolve();
    };

    let validatePhone = async (rule, value) => {
      if (value === '') {
        return Promise.reject('번호를 입력해주십시오');
      } else {
        let regPhone = /^\d{4}$/;
        if (regPhone.test(value) !== true) {
          return Promise.reject('');
        }
      }

      return Promise.resolve();
    };

    let _validatePhone = async (rule, value) => {
      if (value === '') {
        return Promise.reject('번호를 입력해주십시오');
      } else {
        let regPhone = /^\d{3,4}$/;
        if (regPhone.test(value) !== true) {
          return Promise.reject('');
        }
      }

      return Promise.resolve();
    };

    let validatePhoneFirst = async (rule, value) => {
      if (value === '') {
        return Promise.reject('휴대폰번호를 입력해주십시오');
      } else {
        let regPhone = /^\d{2,4}$/;
        if (regPhone.test(value) !== true) {
          return Promise.reject('');
        }
      }

      return Promise.resolve();
    };

    let validateComname = async (rule, value) => {
      if (value === '') {
        return Promise.reject('업체명을 입력해주십시오');
      } else {
        if (value.length < 2 || value.length > 20) {
          return Promise.reject('업체명은 최소 2자 최대 20자이내로 입력해주십시오');
        }
      }

      return Promise.resolve();
    };

    let validateComnumber = async (rule, value) => {
      if (value === '') {
        return Promise.reject('사업자번호를 입력해주십시오');
      } else {
        let comnumber = /^([0-9]{3})-?([0-9]{2})-?([0-9]{5})$/;

        if (comnumber.test(value) !== true) {
          return Promise.reject('사업자번호 격식이 옳바르지 않습니다.');
        }
      }

      return Promise.resolve();
    };

    let validateCommission = async (rule, value) => {
      if (value === '') {
        return Promise.reject('수수료율을 입력해주십시오');
      } else {
        let commission = /^[0-9]*$/;
        if (commission.test(value) !== true) {
          return Promise.reject('수수료율 격식이 옳바르지 않습니다.');
        }
      }

      return Promise.resolve();
    };

    let validateWholesale = async (rule, value) => {
      if (value === '') {
        return Promise.reject('도매수수료를 입력해주십시오');
      } else {
        let wholesale = /^[0-9]*$/;
        if (wholesale.test(value) !== true) {
          return Promise.reject('도매수수료 격식이 옳바르지 않습니다.');
        }
      }

      return Promise.resolve();
    };

    let validateAcctype = async (rule, value) => {
      if (value === '0') {
        return Promise.reject('정선방식을 선택해주십시오');
      }

      return Promise.resolve();
    };

    let validateAccdiv = async (rule, value) => {
      if (value === '0') {
        return Promise.reject('정선유형을 선택해주십시오');
      }

      return Promise.resolve();
    };

    let validateExdate = async (rule, value) => {
      if (value.length > 0) {
        if (value < 1 || value > 30) {
          return Promise.reject('최소 1일 최대 30일까지 가능합니다.');
        }

        return Promise.resolve();
      }
    };

    let validateTel = async (rule, value) => {
      if (value.length > 0) {
        let tel = /^(0(2|3[1-9]|4[1-9]|5[1-9]|6[1-9]))-?(\d{3,4})-?(\d{4})$/
        if (tel.test(value) !== true) {
          return Promise.reject('전화번호 격식이 옳바르지 않습니다.');
        }
      }

      return Promise.resolve();
    };

    let validateComphone = async (rule, value) => {
      if (value === '') {
        return Promise.reject('사업장전화번호 입력해주십시오');
      } else {
        if (value.length > 0) {
          let tel = /^(0(2|3[1-9]|4[1-9]|5[1-9]|6[1-9]))-?(\d{3,4})-?(\d{4})$/
          if (tel.test(value) !== true) {
            return Promise.reject('사업장전화번호 격식이 옳바르지 않습니다.');
          }
        }
      }

      return Promise.resolve();
    };

    let validateComCeo = async (rule, value) => {
      if (value === '') {
        return Promise.reject('대표자명을 입력해주십시오');
      } else {
        if (value.length < 2 || value.length > 10) {
          return Promise.reject('대표자명은 최소 2자 최대 10자이내로 입력해주십시오');
        }
      }

      return Promise.resolve();
    };

    const handleFinishFailed = () => {
      //alert('Login Error')
    };

    const remember = false;

    const rulesRef = reactive({
      username: [
        {
          required: true,
          validator: validateUsername,
          trigger: 'blur',
        },
      ],
      password: [
        {
          validator: validatePass,
          trigger: 'blur',
        },
      ],
      password_confirm: [
        {
          validator: validatePassConfirm,
          trigger: 'blur',
        },
      ],
      name: [
        {
          required: true,
          validator: validateName,
          trigger: 'blur',
        },
      ],
      email: [
        {
          required: true,
          validator: validateEmail,
          trigger: 'blur',
        },
      ],
      phone1: [
        {
          required: true,
          validator: validatePhoneFirst,
          trigger: 'blur',
        },
      ],
      phone2: [
        {
          required: true,
          validator: _validatePhone,
          trigger: 'blur',
        },
      ],
      phone3: [
        {
          required: true,
          validator: validatePhone,
          trigger: 'blur',
        },
      ],
      com_name: [
        {
          required: true,
          validator: validateComname,
          trigger: 'blur',
        },
      ],
      com_number: [
        {
          required: true,
          validator: validateComnumber,
          trigger: 'blur',
        },
      ],
      com_phone1: [
        {
          required: true,
          validator: validatePhoneFirst,
          trigger: 'blur'
        },
      ],
      com_phone2: [
        {
          required: true,
          validator: _validatePhone,
          trigger: 'blur'
        },
      ],
      com_phone3: [
        {
          required: true,
          validator: validatePhone,
          trigger: 'blur'
        },
      ],
      com_ceo: [
        {
          required: true,
          validator: validateComCeo,
          trigger: 'blur'
        },
      ],
      commission: [
        {
          required: true,
          validator: validateCommission,
          trigger: 'blur',
        },
      ],
      wholesale_commission: [
        {
          required: true,
          validator: validateWholesale,
          trigger: 'blur',
        },
      ],
      account_type: [
        {
          required: true,
          validator: validateAcctype,
          trigger: 'change',
        },
      ],
      account_div: [
        {
          required: true,
          validator: validateAccdiv,
          trigger: 'change',
        },
      ],
      tel1: [
        {
          validator: validatePhoneFirst,
          trigger: 'blur',
        },
      ],
      tel2: [
        {
          validator: _validatePhone,
          trigger: 'blur',
        },
      ],
      tel3: [
        {
          validator: validatePhone,
          trigger: 'blur',
        },
      ],
      ac_expect_date: [
        {
          validator: validateExdate,
          trigger: 'blur',
        },
      ],
    });

    const { resetFields, validate, validateInfos } = useForm(formState, rulesRef);

    const checked = ref(false);

    return {
      checked,
      labelCol: {
        style: {
          width: '400px',
        },
      },
      wrapperCol: {
        span: 25,
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
    };
  },
});
</script>

<!--container-->
<style>
/*::-webkit-scrollbar {*/
/*  width: 0 !important;*/
/*}*/

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

  background-image: url(../../assets/img/bg-pattern.png);
  background-color: #3051d3;

  --uim-primary-opacity: 1;
  --uim-secondary-opacity: 0.70;
  --uim-tertiary-opacity: 0.50;
  --uim-quaternary-opacity: 0.25;
  --uim-quinary-opacity: 0;

  --blue: #3051D3;
  --indigo: #564ab1;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #F06543;
  --orange: #f1734f;
  --yellow: #e4cc37;
  --green: #3ddc97;
  --teal: #008080;
  --cyan: #00A7E1;
  --white: #fff;
  --gray: #7c8a96;
  --gray-dark: #343a40;
  --primary: #3051D3;
  --secondary: #7c8a96;
  --success: #3ddc97;
  --info: #00A7E1;
  --warning: #e4cc37;
  --danger: #F06543;
  --light: #eff2f7;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: "Nunito",sans-serif;
  --font-family-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
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

#userRegister .icon img {
  width: 180px;
  height: 40px;
}

#userRegister .tip {
  margin-top: 9px;
}

#userRegister .tip h5 {
  font-size: 16px !important;
  color: rgba(255,255,255,.5) !important;
  font-weight: 600;
  text-align: center !important;
  font-family: Nunito, sans-serif;
}
</style>

<!--item-->
<style>
#userRegister .item {
  width: 736px;
  margin-top: 80px;
  background-color: white;
  padding: 24px;
}
#userRegister .item h5 {
  width: 672px;
  height: 22px;
  background-color: white;
  margin-bottom: 48px;
  text-align: center;
  font-size: 1.1375rem;
  font-weight: 600;
  color: #495057;
}
#userRegister .ant-descriptions-item-content input {
  width: 100%;
  height: 45px;
}
#userRegister input,
#userRegister .ant-select,
#userRegister .ant-select-selector {
  width: 100%;
  height: 45px !important;
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

#userRegister .buttons .ant-form-item-control-input-content button:first-child {
  background-color: #3ddc97;
  border: 1px solid #3ddc97;
}

#userRegister .buttons .ant-form-item-control-input-content button:last-child {
  margin-top: 20px;
  color: gray;
}
</style>
