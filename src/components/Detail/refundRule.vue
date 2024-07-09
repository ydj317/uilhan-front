<template>
  <a-modal
      title="유일 구매 및 환불 약관"
      v-model:open="store.state.isRefundModalOpen"
      @ok="handleOk"
      @cancel="handleModalClose"
      okText="동의"
      cancelText="닫기"
      class="policyModal"
  >
    <div class="modal-content">
      <h3>구매약관</h3>
      <p class="sectionTitle">제9조 양도 양수 금지조항</p>
      <div class="paragraph">
        <p>1. "유일"은"솔루션"회원가입 자에 한하여 현금 및 카드 결제를 이용하여 결제대금을 지급한"회원"에 한하여"솔루션"에서 정한 방법으로 결제
          대금만큼 기간을 구매한 회원에 한하여 기간 승인을 진행 후 서비스를 개시합니다.</p>
        <p>2. 서비스의 이용"솔루션"의 승인이 이루어진 직후 즉시 사용가능 하며 서비스이용 시간은 1일24시간 365일을 원칙으로 합니다.</p>
        <p>3."솔루션"이용은 유료 서비스입니다. (요금표 참고)</p>
        <p>4. 메인 계정만 한 계정만 이용 가능하며, 사업자당 이용요금이 별도로 부과된다.</p>
        <p style="text-indent:inherit">(환불약관 서브사업자 관련 참조)</p>
        <p style="text-indent:inherit">기간 승인 후 3일 이후에는 연동한 마켓 API Key값이 고정되어 수정이 불가하다.</p>
        <p>5. 승인 즉시 당일부터 사용 가능하며 승인일을 1일로 포함하여 계산된다.</p>
        <p>6. 추천인 서비스 기간은 중복으로 적용되지 않는다.</p>
        <p>7. “회원"은 이용기간,권한 아이디 등"솔루션"에 관련된 일체 정보 및 권한을 타인에게 양도 양수 할 수 없습니다.</p>
        <p>8. 프로그램 기간 이용시, 일시정지는 1번 사용 가능하며, 일시정지 관련 사항은 고객센터로 연락하여 진행한다.</p>
      </div>

      <h3>환불약관</h3>
      <p class="sectionTitle">제11조 계약의 해지 및 손해배상 환불규정</p>
      <div class="paragraph">
        <p>1. "회원"은 유료서비스 (결제일)기준으로 합니다.</p>
        <p>2. "회원"은 결제 시 제공되는 추천인할인"솔루션"이 제공하는 특별할인 등을 이용한 경우 중도해지시 계산되는 요금은 결제당시 할인되지 않은 정가
          1개월요금으로 환불금액을 산정합니다.</p>
        <p>3. "회원"은 결제기준 7일이내 환불을 요청할 경우 사용금액은 1개월 정가금액 20만원/30일*이용일수 만큼 차감 후 환불된다.
          (할인금액으로 결제를 하였어도 환불 시, 정가금액 기준으로 계산)</p>
        <p>3-2 승인일 기준 7일 이후 환불 요청할 경우, 취소 수수료(결제금액의 10%)가 부과되며, 사용금액은 1개월 정가금액 20만원/30일*이용일수
          만큼 차감 후 환불된다. (할인금액으로 결제를 하였어도 환불 시, 정가금액 기준으로 계산)</p>
        <p>4. "회원"은"솔루션"이 제공한 유로 서비스 이용기간을 1/3이상 지난 경우 계약의 취소 또는 환불이 불가능하며"솔루션"은 취소 또는 환불을 거부할 수 있는 권리를 가집니다.</p>
        <p>5. 특별 환불규정 제11조 4항에 해당하는 경우"회원"과"솔루션"은 원만한합의를 통해 제11조 3항에 의거하여 추가로 20프로를 제외한 금액을 환불할 수 있습니다.</p>
        <p>6. "솔루션"은"회원" 제7조 제10조에 의거하여 계약을 해지할 수 있으며 남은 일수와 상관없이 교환 반품, 환불 등을 거부할 수 있는 권리를 가집니다.</p>
        <p>7. 주말 / 공휴일에 환불 요청시, 월요일에 확인되며 월요일까지 이용금액이 계산된다.</p>
        <p>8. 환불 요청 및 승인 </p>
        <p style="text-indent:inherit">환불요청 시, 유일 고객센터에서 환불금액을 보내드립니다. 영업일 상담시간내에 (오전9시-오후 5시) 확인 답변을 주셔야 그 금액으로 환불처리가 완료되며
          <span style="color:#eb5757">영업시간이 끝난 17시 이후에 확인 답변을 주실 경우 다음 영업일까지 이용금액이 계산되어 환불되는점 참고바랍니다.</span></p>
        <p style="text-indent:inherit">영업일 상담시간: 평일 오전 9시 - 오후 5시 (주말/공휴일 휴무)</p>
      </div>

      <p class="sectionTitle">제15조 서브사업자</p>
      <div class="paragraph">
        <p>1. 서브 사업자는 최초 가입한 본 사업에 이용요금이 남아있을 경우에만 사용가능하며 본 사업자에 남은 이용기간만큼 서브사업자의 할인 된 금액을
        이용할 수 있습니다. (서브사업자 이용 요금표 참조)</p>
        <p>2. 제11조 각항에 의거 환불규정을 다르게 실시합니다.</p>
        <p>3. 승인일 기준 할인되지 않은 결제 금액/30일 이용일수적용 후 환불 취소 수수료 10%</p>
        <p>4. 서브 사업자는 본계정과 명의가 동일해야 합니다.</p>
        <p>5. 서브사업자는 기간별 할인 없이 동일요금표에 나와있는 요금으로 적용됩니다.</p>
        <p>6. 본 계정 만료 시 서브사업자 자동 소멸됩니다.</p>
        <p>7. 본계정을 삭제하고 서브사업자 계정만 사용하고 싶을 경우 본 계정 비용을 추가결제후 진행합니다.</p>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {useStore} from 'vuex';

//通过 useStore从 Vuex 中获取 store 的实例。
const store = useStore();
const handleModalClose = () => {
  store.commit('setIsRefundModalOpen', false);
};
const emit = defineEmits(['agree2']);
const handleOk = () => {
  store.commit('setIsRefundModalOpen', false);
  emit('agree2');
};

</script>

<style>
.policyModal .ant-modal-content {
  padding: 0;
}

.policyModal .ant-modal-header .ant-modal-title {
  padding: 10px 16px;
  background: #ffd117;
}

.policyModal .ant-modal-close {
  top: 10px;
}

.policyModal .ant-modal-body {
  padding: 0 20px 0 25px;
}

.policyModal .ant-modal-footer {
  padding: 8px 20px 20px;
}

.sectionTitle {
  font-weight: bold;
}

.modal-content {
  max-height: 500px;
  padding-right: 12px;
  overflow-y: auto;
}

.paragraph p {
  position: relative;
  text-indent: -1em;
  margin-left: 1em;
}

.paragraph ul {
  padding-left: 20px;
}

.paragraph ul li {
  margin-bottom: 1em;
}
</style>