
<template>
	<a-card :loading="formState.loading" :bordered="false">
      <template #title>
        배대지 계정 연동
          <a-tooltip placement="right">
            <template #title>
              넥스트배송에 가입된 아이디,휴대전화,이메일을 모두 입력해 주세요.배대지 계정 연동후 배송대행 신청이 가능합니다.
            </template>
            <QuestionCircleOutlined/>
          </a-tooltip>
      </template>
		<a-descriptions bordered :column="1" :labelStyle="{ width: '170px' }"
						:contentStyle="{ width: 'auto' }">
			<a-descriptions-item label="배대지 ID:" :labelStyle="{textAlign: 'right'}">
				<a-input v-model:value="formState.settingData.bind_bridge_id" style="width: 200px;" placeholder="배대지 ID를 입력해주세요" allow-clear
						 @input="formState.settingData.is_bridge_sync = false" />
			</a-descriptions-item>
			<a-descriptions-item label="휴대전화:" :labelStyle="{textAlign: 'right'}">
          <a-input v-model:value="formState.settingData.bind_bridge_phone1" style="width: 150px;" placeholder="휴대전화" allow-clear
                   @input="formState.settingData.is_bridge_sync = false"
          />
          <a-input v-model:value="formState.settingData.bind_bridge_phone2" style="width: 150px;margin-left: 10px" placeholder="휴대전화" allow-clear
                   @input="formState.settingData.is_bridge_sync = false"
          />
          <a-input v-model:value="formState.settingData.bind_bridge_phone3" style="width: 150px;margin-left: 10px" placeholder="휴대전화" allow-clear
                   @input="formState.settingData.is_bridge_sync = false"
          />
			</a-descriptions-item>
			<a-descriptions-item label="Email:" :labelStyle="{textAlign: 'right'}">
				<a-input v-model:value="formState.settingData.bind_bridge_email" style="width: 200px;" placeholder="Email을 입력해주세요" allow-clear
						 @input="formState.settingData.is_bridge_sync = false"
				/>
			</a-descriptions-item>
<!--			<a-descriptions-item label="배대지 비밀번호:" :labelStyle="{textAlign: 'right'}">-->
<!--				&lt;!&ndash; 크롬 자동입력 방지 하기위하여 추가 &ndash;&gt;-->
<!--				<a-input type="password" style="position: absolute; opacity: 1; width: 1px; height: 1px; z-index: 1;" />-->
<!--				&lt;!&ndash; 실제 비밀번호 입력 인풋 &ndash;&gt;-->
<!--				<a-input type="password" v-model:value="formState.settingData.bind_bridge_password" size="small" style="position: relative; z-index: 2; width: 200px;" allow-clear @input="formState.settingData.is_bridge_sync = false" />-->
<!--			</a-descriptions-item>-->
			<a-descriptions-item label="사서함번호:" :labelStyle="{textAlign: 'right'}" v-if="formState.showItem">
				{{formState.settingData.bind_bridge_mb_id}}
				<a-space>
					<a-tag v-if="formState.settingData.is_bridge_sync" color="green">연동완료</a-tag>
					<a-tag v-else color="red">미연동</a-tag>
				</a-space>
			</a-descriptions-item>
			<a-descriptions-item label="연동확인" :labelStyle="{textAlign: 'right'}">
				<a-button type="primary" size="small" @click.prevent="bridgeSyncCheck">연동확인</a-button>
			</a-descriptions-item>
		</a-descriptions>
<!--		<div style="display: flex;justify-content: center" class="mt15">-->
<!--			<a-button type="primary" @click="handleSaveUserData" :disabled="!formState.settingData.is_bridge_sync">저장</a-button>-->
<!--		</div>-->

	</a-card>
</template>

<script setup>
import {onMounted, reactive, watchEffect} from "vue";
import {useUserApi} from "@/api/user";
import {message} from "ant-design-vue";
import {useBridgeApi} from "@/api/bridge";
import router from "@/router";
import {QuestionCircleOutlined} from "@ant-design/icons-vue";
import {right} from "core-js/internals/array-reduce";

const formState = reactive({
	settingData: {
		bind_bridge_id: '',
		bind_bridge_mb_id: '',
		bind_bridge_phone1: '',
		bind_bridge_phone2: '',
		bind_bridge_phone3: '',
		bind_bridge_phone: '',
		bind_bridge_email: '',
		is_bridge_sync: false,
		bind_bridge_password: '',
	},
	loading: false,
	showItem: false
})

const emit = defineEmits(['formUpdated']);

function getUserInfoData() {
	formState.loading = true;
	useUserApi().getUserInfoData({}).then((res) => {
		if (res.status !== "2000") {
			message.error(res.message);
			formState.loading = false;
			return false;
		}

		const { bridge_mb_id, is_bridge_sync, bridge_phone, bridge_email, bridge_id } = res.data;

		formState.settingData.bind_bridge_id = bridge_id
		formState.settingData.bind_bridge_mb_id = bridge_mb_id
    formState.settingData.bind_bridge_phone1 = bridge_phone.split('-')[0]
    formState.settingData.bind_bridge_phone2 = bridge_phone.split('-')[1]
    formState.settingData.bind_bridge_phone3 = bridge_phone.split('-')[2]
    formState.settingData.bind_bridge_phone = bridge_phone
		formState.settingData.bind_bridge_email= bridge_email
		formState.settingData.bind_bridge_password = ''
		formState.settingData.is_bridge_sync = is_bridge_sync

		setTimeout(() => {
			formState.loading = false;
		}, 500);

	});
}

const handleSaveUserData = () => {
	if (checkValidation() === false) {
		return false;
	}
	useUserApi().bindBridge(formState.settingData).then((res) => {
		if (res.status !== "2000") {
			message.error(res.message);
			return false;
		}

		message.success('저장 되었습니다.');
		getUserInfoData();
	});
}

const bridgeSyncCheck = () => {
	if (checkValidation() === false) {
		return false;
	}
  formState.settingData.bind_bridge_phone = formState.settingData.bind_bridge_phone1 + '-' + formState.settingData.bind_bridge_phone2 + '-' + formState.settingData.bind_bridge_phone3;
	useBridgeApi().syncCheckIsMember(formState.settingData).then((res) => {
		if (res.status !== "2000") {
			message.error(res.message);
			return false;
		}

		if (! 'MEM_CODE' in res.data) {
			message.error(res.message);
			return false;
		}

		message.success('연동 성공');
		formState.settingData.is_bridge_sync = true;
		formState.settingData.bind_bridge_mb_id = res.data['MEM_CODE'];
	});
}

// 유효성 체크
const checkValidation = () => {
	if (formState.settingData.bind_bridge_id === '') {
		message.error("배대지 ID를 입력해주세요.");
		return false;
	}

	if (formState.settingData.bind_bridge_phone1 === '' || formState.settingData.bind_bridge_phone2 === '' || formState.settingData.bind_bridge_phone3 === '') {
		message.error("배대지 휴대전화를 입력해주세요.");
		return false;
	}

	if (formState.settingData.bind_bridge_email === '') {
		message.error("배대지 Email을 입력해주세요.");
		return false;
	}

	// if (formState.settingData.bind_bridge_password === '') {
	// 	message.error("배대지 비밀번호를 입력해주세요.");
	// 	return false;
	// }

	return true;
}

const handleFormUpdate = () => {
	emit('formUpdated', {
		bind_bridge_id: formState.settingData.bind_bridge_id,
		bind_bridge_mb_id: formState.settingData.bind_bridge_mb_id,
		bind_bridge_phone: formState.settingData.bind_bridge_phone,
		bind_bridge_phone1: formState.settingData.bind_bridge_phone1,
		bind_bridge_phone2: formState.settingData.bind_bridge_phone2,
		bind_bridge_phone3: formState.settingData.bind_bridge_phone3,
		bind_bridge_email: formState.settingData.bind_bridge_email,
		is_bridge_sync: formState.settingData.is_bridge_sync,
	});
};

watchEffect(() => {
	formState.showItem = formState.settingData.is_bridge_sync;
	if (! formState.settingData.is_bridge_sync) formState.settingData.bind_bridge_mb_id = '';
	handleFormUpdate();
});

onMounted(() => {
	getUserInfoData();
});
</script>
<style>
.bridge_from .ant-form-item {
	margin-bottom: 0;
}

.bridge_from .ant-form-item-label {
	border: 1px solid #eeeeee;
	background-color: #fafafa;
	width: 170px;
	padding: 10px;
	margin-bottom: -1px;
}

.bridge_from .ant-form-item-control {
	border: 1px solid #eeeeee;
	padding: 10px;
	margin-left: -1px;
	margin-bottom: -1px;
}

.bridge_from .ant-form-item-control:nth-last-child {
	border-bottom: 1px solid #eeeeee;
}

.bridge_from .phone .ant-form-item-control {
	border: none;
	padding: 0;
	margin: 0;
}

.bridge_from .phone .ant-form-item-control:nth-last-child {
	border-bottom: none;
}
</style>