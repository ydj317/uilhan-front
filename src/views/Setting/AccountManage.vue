<template>
    <a-card class="mt20" :loading="formState.loading" :bordered="false" :title="'계정 정보 수정'">

        <a-form :rules="rulesRef" :model="formState" name="user_form" class="user_form" autocomplete="off"
                @finish="onFinish" @finishFailed="onFinishFailed">

            <a-form-item label="아이디">
                {{ formState.username }}
            </a-form-item>
            <a-form-item label="비밀번호" name="password">
                <span class="mr30">*******</span>
                <a-button type="primary" @click="showModal">비밀번호 변경</a-button>
            </a-form-item>

            <a-form-item label="추천코드">
                <a-button @click="copyText(formState.recommend_code)">
                    {{ formState.recommend_code }}
                    <CopyOutlined/>
                </a-button>
            </a-form-item>

            <a-form-item label="사용자명" name="name" has-feedback>
                <a-input v-model:value="formState.name" placeholder="사용자명을 입력해주시오"/>
            </a-form-item>

            <a-form-item label="Email" name="email" has-feedback>
                <a-input v-model:value="formState.email" placeholder="Email을 입력해주시오"/>
            </a-form-item>

            <a-form-item label="휴대전화" name="phone1">
                <a-row :gutter="10">
                    <a-col style="width: 160px;">
                        <a-form-item name="phone1" class="phone" has-feedback>
                            <a-input v-model:value="formState.phone1" placeholder="휴대전화"/>
                        </a-form-item>
                    </a-col>
                    <a-col style="width: 160px;">
                        <a-form-item name="phone2" class="phone" has-feedback>
                            <a-input v-model:value="formState.phone2" placeholder="휴대전화"/>
                        </a-form-item>
                    </a-col>
                    <a-col style="width: 160px;">
                        <a-form-item name="phone3" class="phone" has-feedback>
                            <a-input v-model:value="formState.phone3" placeholder="휴대전화"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form-item>

            <a-form-item label="업체명/사업자명" name="com_name" has-feedback>
                <a-input v-model:value="formState.com_name" placeholder="업체명/사업자명을 입력해주시오"/>
            </a-form-item>

            <a-form-item label="사업자번호" name="com_number" has-feedback>
                <a-input v-model:value="formState.com_number" placeholder="사업자번호를 입력해주시오"/>
            </a-form-item>

            <a-form-item label="사업장 전화번호" name="com_phone1">
                <a-row :gutter="10">
                    <a-col style="width: 160px;">
                        <a-form-item name="com_phone1" class="phone" has-feedback>
                            <a-input v-model:value="formState.com_phone1" placeholder="전화번호"/>
                        </a-form-item>
                    </a-col>
                    <a-col style="width: 160px;">
                        <a-form-item name="com_phone2" class="phone" has-feedback>
                            <a-input v-model:value="formState.com_phone2" placeholder="전화번호"/>
                        </a-form-item>
                    </a-col>
                    <a-col style="width: 160px;">
                        <a-form-item name="com_phone3" class="phone" has-feedback>
                            <a-input v-model:value="formState.com_phone3" placeholder="전화번호"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form-item>

            <a-form-item label="대표자명" name="com_ceo" has-feedback>
                <a-input v-model:value="formState.com_ceo" placeholder="대표자명을 입력해주시오"/>
            </a-form-item>

            <a-form-item label="유선전화" name="tel1">
                <a-row :gutter="10">
                    <a-col style="width: 160px;">
                        <a-form-item name="tel1" class="phone" has-feedback>
                            <a-input v-model:value="formState.tel1" placeholder="유선전화"/>
                        </a-form-item>
                    </a-col>
                    <a-col style="width: 160px;">
                        <a-form-item name="tel2" class="phone" has-feedback>
                            <a-input v-model:value="formState.tel2" placeholder="유선전화"/>
                        </a-form-item>
                    </a-col>
                    <a-col style="width: 160px;">
                        <a-form-item name="tel3" class="phone" has-feedback>
                            <a-input v-model:value="formState.tel3" placeholder="유선전화"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form-item>

            <div style="display: flex;justify-content: center;margin-top: 20px;">
                <a-button type="primary" html-type="submit">저장</a-button>
                <a-button style="margin-left: 10px" @click="router.back()">취소</a-button>
            </div>
        </a-form>

    </a-card>
    <!--    yl+ 表格  -->
    <a-card class="mt20" :loading="formState.loading" :bordered="false" :title="'직원 계정관리'">
        <template #extra>
            <a-button type="primary" @click="showModal2">계정 등록</a-button>
        </template>
        <a-table :columns="columns" :data-source="data" bordered :pagination="false">
            <template #headerCell="{ column }">
            </template>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button type="primary" html-type="submit" class="mr20">수정</a-button>
                    <a-button type="default" html-type="submit">삭제</a-button>
                </template>
            </template>
        </a-table>
    </a-card>
    
    <!--    修改密码-->
    <a-modal v-model:open="formState.pwdOpen" width="1000px"  :footer="null" :closable="false">
        <a-card :bordered="false" :title="'비밀번호 변경'">

            <a-form :rules="rulesRef" :model="formState" name="user_form2" class="user_form" autocomplete="off"
                    @finish="onFinish2" @finishFailed="onFinishFailed2">

                <a-form-item label="기존 비밀번호" name="password" has-feedback>
                    <a-input-password v-model:value="formState.password"
                                      type="password" placeholder="기존 비밀번호를 입력해주십시오" />
                </a-form-item>

                <a-form-item label="새로운 비밀번호" name="new_password" has-feedback>
                    <a-input-password v-model:value="formState.new_password"
                                      type="password" placeholder="새로운 비밀번호 길이는 최소 8자 최대 20자 이내로 입력해주십시오" />
                </a-form-item>

                <a-form-item label="비밀번호 확인" name="password_confirm" has-feedback>
                    <a-input-password v-model:value="formState.password_confirm"
                                      type="password" placeholder="새로운 비밀번호를 한번 더 입력해주십시오" />
                </a-form-item>

                <div style="display: flex;justify-content: center;margin-top: 20px;">
                    <a-button  @click="handleCancel">취 소</a-button>
                    <a-button style="margin-left: 10px" type="primary" html-type="submit" :loading="formState.pwdLoading">저장</a-button>
                </div>
            </a-form>

        </a-card>
    </a-modal>
    <!--    注冊账户-->
    <a-modal v-model:open="formState.regOpen" width="1000px"  :footer="null" :closable="false">
        <a-card :bordered="false" :title="'직원 계정 등록'">

            <a-form :rules="rulesRef" :model="formState" name="user_form3" class="user_form" autocomplete="off"
                    @finish="onFinish3" @finishFailed="onFinishFailed3">

                <a-form-item label="직원 아이디" name="ID" has-feedback>
                    <a-input v-model:value="formState.ID" placeholder="최소 5자 최대 20자이내로 입력해주십시오" />
                </a-form-item>
                <a-form-item label="비밀번호" name="reg_new_password" has-feedback>
                    <a-input-password v-model:value="formState.reg_new_password" placeholder="비밀번호 길이는 최소 8자 최대 20자 이내로 입력해주십시오" />
                </a-form-item>
                <a-form-item label="비밀번호 확인" name="reg_password_confirm" has-feedback>
                    <a-input-password v-model:value="formState.reg_password_confirm" placeholder="비밀번호와 같게 입력해주십시오" />
                </a-form-item>
                <a-form-item label="권한설정" name="auth">
                    <a-checkbox-group v-model:value="formState.auth" :options="authOptions" />
                </a-form-item>
                <a-form-item label="할당량" name="number" has-feedback>
                    <a-space>
                        <a-input v-model:value="formState.number" suffix="개" />
                    </a-space>
                </a-form-item>

                <div style="display: flex;justify-content: center;margin-top: 20px;">
                    <a-button  @click="handleCancel2">취 소</a-button>
                    <a-button style="margin-left: 10px" type="primary" html-type="submit" :loading="formState.regLoading">저장</a-button>
                </div>
            </a-form>

        </a-card>
    </a-modal>
</template>

<script setup>
    import {AuthRequest} from "@/util/request";
    import {
        CopyOutlined
    } from "@ant-design/icons-vue";
    import {onMounted, reactive} from "vue";
    import router from "@/router";
    import {message} from "ant-design-vue";
    import {useUserApi} from "@/api/user";

    import "vue-loading-overlay/dist/vue-loading.css";
    import Loading from "vue-loading-overlay";



    const formState = reactive({
        username: "",
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

        loading: false,
        //yl+
        //修改密码
        pwdLoading:false,
        pwdOpen:false,
        password: "",
        new_password: "",
        password_confirm: "",
        formRef:"",
        //注册账户
        regLoading:false,
        regOpen:false,
        reg_new_password: "",
        reg_password_confirm: "",
        //默认拥有的账号权限
        auth: ['상품관리 (삭제 제외)', ' 상품삭제'],
    });

    const copyText = (recommend_code) => {
        var textArea = document.createElement("textarea");
        textArea.value = recommend_code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        message.success('복사성공 하였습니다.');
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

    let validateComCeo = async (rule, value) => {
        if (value === "" || value === null) {
            return Promise.reject("대표자명을 입력해주십시오");
        } else {
            if (value.length < 2 || value.length > 10) {
                return Promise.reject("대표자명은 최소 2자 최대 10자이내로 입력해주십시오");
            }
        }

        return Promise.resolve();
    };

    let validatePass = async (rule, value) => {
        if (value === "") {
            return Promise.reject("기존 비밀번호를 입력해주십시오");
        }

        return Promise.resolve();
    };

    let validateNewPass = async (rule, value) => {
        if (value === "") {
            return Promise.reject("새로운 비밀번호를 입력해주십시오");
        } else {
            if (value.length < 8 || value.length > 20) {
                return Promise.reject("새로운 비밀번호 길이는 최소 8자 최대 20자이내로 입력해주십시오");
            }

            if (formState.password_confirm !== "") {
                formState.formRef.validateFields("password_confirm");
            }

            return Promise.resolve();
        }
    };

    let validatePassConfirm = async (rule, value) => {
        if (value === "") {
            return Promise.reject("비밀번호가 일치하지 않습니다");
        } else if (value !== formState.new_password) {
            return Promise.reject("비밀번호가 일치하지 않습니다");
        } else {
            return Promise.resolve();
        }
    };

    const rulesRef = reactive({
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
        tel1: [
            {
                validator: validatePhoneFirst,
                trigger: "blur"
            }
        ],
        tel2: [
            {
                validator: _validatePhone,
                trigger: "blur"
            }
        ],
        tel3: [
            {
                validator: validatePhone,
                trigger: "blur"
            }
        ],
        password: [
            {
                required: true,
                validator: validatePass,
                trigger: "blur"
            }
        ],
        new_password: [
            {
                required: true,
                validator: validateNewPass,
                trigger: "blur"
            }
        ],
        password_confirm: [
            {
                required: true,
                validator: validatePassConfirm,
                trigger: "blur"
            }
        ]
    });

    const onFinish = () => {
        let user = {
            name: formState.name,
            email: formState.email,
            phone: formState.phone1 + "-" + formState.phone2 + "-" + formState.phone3,
            tel: formState.tel1 + "-" + formState.tel2 + "-" + formState.tel3,
            com_name: formState.com_name,
            com_number: formState.com_number,
            com_phone: formState.com_phone1 + "-" + formState.com_phone2 + "-" + formState.com_phone3,
            com_ceo: formState.com_ceo,
        };

        AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", user).then((res) => {
            if (res.status !== '2000') {
                message.error(res.message)
                return false;
            }

            message.success(res.message);
            getUserInfoData();
        });
    };

    const onFinishFailed = errorInfo => {
        console.log("Failed:", errorInfo);
    };

    function splitPhone(key, phone) {
        if (phone === undefined || phone === null || phone === '') {
            return false
        }

        if (phone.includes("-")) {
            const phoneArray = phone.split("-");
            formState[key + 1] = phoneArray[0]
            formState[key + 2] = phoneArray[1]
            formState[key + 3] = phoneArray[2]
        } else {
            formState[key + 1] = '';
            formState[key + 2] = phone.slice(-8, -4);
            formState[key + 3] = phone.slice(-4);

            if (phone.length > 8) {
                formState[key + 1] = phone.slice(0, -8);
            }
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

            formState.username = res.data.username
            formState.name = res.data.name
            formState.email = res.data.email
            splitPhone('phone', res.data.phone)
            formState.com_name = res.data.com_name;
            formState.com_number = res.data.com_number;
            splitPhone('com_phone', res.data.com_phone)
            formState.com_ceo = res.data.com_ceo;
            formState.recommend_code = res.data.recommend_code;
            splitPhone('tel', res.data.tel)

            setTimeout(() => {
                formState.loading = false;
            }, 500);

        });
    }

    onMounted(() => {
        getUserInfoData();
    });
    //yl+
    const columns = [
        {
            title: 'No.',
            dataIndex: 'No',
            key: 'No',
            width:'5%',
        },
        {
            title: '직원 아이디',
            dataIndex: 'ID',
            key: 'ID',
            width:'20%',
        },
        {
            title: '비밀번호',
            dataIndex: 'pwd',
            key: 'pwd',
            width:'20%',
        },
        {
            title: '권한',
            key: 'auth',
            dataIndex: 'auth',
            width:'20%',
        },
        {
            title: '계정 등록시간',
            key: 'insDate',
            dataIndex: 'insDate',
            width:'20%',
        },
        {
            title: '관리',
            key: 'action',
            width:'15%',
        }
    ];
    const data = [
        {
            key: '1',
            No: 9999,
            ID: '직원1직원1직원1',
            pwd: '密码1密码1密码1密码1密码1密码',
            auth: 'auth1auth1auth1',
            insDate: '2023-12-20',
        },
        {
            key: '2',
            No: 2,
            ID: '직원2',
            pwd: '密码2',
            auth: 'auth2auth2au',
            insDate: '2023-12-20',
        },
    ];

    //修改密码模态框
    const showModal = () => {
        formState.pwdOpen = true;
    };
    const handleCancel = () => {
        formState.pwdOpen = false;
    };
    const onFinish2 = () => {
        let user = {
            password: formState.password,
            new_password: formState.new_password
        };

        formState.pwdLoading = true;
        AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", user).then((res) => {
            if (res.status !== "2000") {
                message.error(res.message);
                formState.pwdLoading = false;
                return false;
            }
            console.log(res);

            message.success(res.message);

            formState.pwdLoading = false;
            formState.pwdOpen = false;
        });
    };

    const onFinishFailed2 = errorInfo => {
        console.log("Failed:", errorInfo);
    };
    //注册账户模态框
    const showModal2 = () => {
        formState.regOpen = true;
    };
    const handleCancel2 = () => {
        formState.regOpen = false;
    };

    const authOptions = ['전체', '상품관리 (삭제 제외)', ' 상품삭제', ' 주문관리'];
    const onFinish3 = () => {
        let user = {
            password: formState.password,
            new_password: formState.new_password
        };

        formState.regLoading = true;
        // AuthRequest.post(process.env.VUE_APP_API_URL + "/api/updateUserDetail", user).then((res) => {
        //     if (res.status !== "2000") {
        //         message.error(res.message);
        //         formState.regLoading = false;
        //         return false;
        //     }
        //     console.log(res);
        //
        //     message.success(res.message);
        //
        //     formState.regLoading = false;
        //     formState.regOpen = false;
        // });
    };

    const onFinishFailed3 = errorInfo => {
        console.log("Failed:", errorInfo);
    };
</script>
<style>
    .user_form .ant-form-item {
        margin-bottom: 0;
    }

    .user_form .ant-form-item-label {
        border: 1px solid #eeeeee;
        background-color: #fafafa;
        width: 170px;
        padding: 10px;
        margin-bottom: -1px;
    }

    .user_form .ant-form-item-control {
        border: 1px solid #eeeeee;
        padding: 10px;
        margin-left: -1px;
        margin-bottom: -1px;
    }

    .user_form .ant-form-item-control:nth-last-child {
        border-bottom: 1px solid #eeeeee;
    }

    .user_form .phone .ant-form-item-control {
        border: none;
        padding: 0;
        margin: 0;
    }

    .user_form .phone .ant-form-item-control:nth-last-child {
        border-bottom: none;
    }
</style>
<style scoped>

</style>