<template>
  <div>
    <a-modal width="60%" v-model:open="data.show" title="구매물품보상 보험 해외직구 안심서비스">
      <a-divider class="divider bg-b mt0 mb0"></a-divider>
      <div class="modal-content mt20">
        <div>
          <table class="table-content">
            <colgroup>
              <col span="2" class="batman" />
              <col span="2" class="flash" />
            </colgroup>
            <thead>
              <tr>
                <th>보상내용</th>
                <th>지급금액</th>
                <th>보험기간</th>
                <th>가입금액 & 보험료</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                  <td>
                    1. 파손, 망실, 도난, 분실 <br>
                    2. 반품 배송비용 <br>
                    *해외 운송일로부터 90일까지 보상
                  </td>
                  <td>
                    1. 물품 구매금액 또는 수리비<br>
                    2. 10만원과 구매물품가격 중 낮은금액<br>
                  </td>
                  <td>
                    배송 기준일로부터 90일 이내<br>
                    (물품 수령 선도래시 배송종료시점)
                  </td>
                  <td>
                    구매물품가격 : KRW {{ data.total_amount_kr }}<br>
                    보험료 : KRW {{ data.care_price }}
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <a-textarea v-model:value="state.textareaValue" disabled class="textarea mt20"/>
        </div>
        <div class="mt20">
          <div class="tooltip">
            <span class="tool-th"> - 클레임 발생 시 처리절차</span>
           <a-button size="small" type="link" target="_blank" href="https://zh8g.com/UpFile/Care_Claim.jpg" style="background-color: #a9a6a6; color: #fff;">자세히보기</a-button>
          </div>
          <div class="tooltip mt5">
            <span class="tool-th">- 보험약관</span>
            <a-button size="small" type="link" target="_blank" href="https://zh8g.com/UpFile/Care_TOS.pdf" style="background-color: #a9a6a6; color: #fff;">자세히보기</a-button>
          </div>
        </div>
        <div class="mt20 plus">
          <a-collapse expandIconPosition="end" :v-model:activeKey="1" ghost>
            <a-collapse-panel key="1" header="+ 단체 가입을 위한 고지사항">
              <div class="p10">
                1.	해주국제무역상사㈜는 보험계약자를 해주국제무역상사㈜로, 해주국제무역상사㈜의 회원을 피보험자 및 보험수익자로 하는 단체(취급)계약을 체결할 수 있습니다.<br>
                단, 보험금의 종류가 사망보험금인 경우에는 그 보험수익자를 피보험자의 법정상속인으로 합니다.<br>
                2.	보험계약의 수익자인 회원은 해주국제무역상사㈜에서 제공하는 서비스를 제공받는 자로 정합니다.<br>
                3.	회원은 제1항의 보험계약에 따른 담보항목 및 내용을 해주국제무역상사㈜가 제공하는 범주 내에서 자유롭게 선택할 수 있으며 보험료를 직접 해주국제무역상사㈜에 납부하여야 합니다.<br>
                4.	제2항에 따라 보험료를 직접 납부한 회원은 계약자의 권리를 행사할 수 있습니다.<br>
                5.	보험계약에 관한 세부사항은 보험사가 제공하는 보험약관에 따릅니다.<br>
                6.	본 서비스는해주국제무역상사㈜ 회원만 이용하실 수 있습니다.<br>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
      <template v-slot:footer>
        <div style="display: flex; justify-content: center">
          <a-button type="primary" @click="checkIsCare">확인</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
import {ref, toRefs, reactive} from 'vue';
const props = defineProps(['data'])
const {data} = toRefs(props)

const state = reactive({
  textareaValue: `∎ 본 상품의 정식명칭은 에이스손해보험의 구매물품보상보험입니다.
∎ 계약 체결 전 자세한 내용은 상품설명서와 약관을 참조하시기 바랍니다
∎ 이 보험계약은 예금자보호법에 따라 예금보험공사가 보호하되, 보호 한도는 본 보험회사에 있는 귀하의 모든 예금 보호대상 금융상품의 해약환급금(또는 만기 시 보험금이나 사고보험금)에 기타 지급금을 합하여 1인당 ‘ 최고 5천만원’이며, 5천만원을 초과하는 나머지 금액을 보호하지 않습니다. 다만, 보험 계약자 및 보험료 납부자가 법인인 보험계약은 예금자보호법에 따라 예금보험공사가 보호하지 않습니다.
∎ 지급한도, 면책사항 등에 따라 보험금 지급이 제한될 수 있습니다.
∎ 본 계약의 단체계약자는 해주국제무역상사㈜ 이며 피보험자 및 보험수익자는 해주국제무역상사㈜ 회원이고 해주국제무역상사㈜의 회원이 아닌 경우 보험가입이 불가능합니다. 파손, 도난, 망실 담보의 위험을 보장하는 다른 계약이 있을 경우 약관에 따라 비례 보상합니다. 수리 또는 교환 시 발송되는 배송비용은 수리비 또는 물품금액에 포함되지 않습니다.
     ✔ 망실: 주문한 물건이 도착하지 않은 경우(주문과 상이한 물건이 도착한 경우)
     ✔ 도난: 주문한 물건이 발송 확인된 이후 도난으로 도착하지 않은 경우
     ✔ 파손 및 파괴: 배송 중에 발생한 파손으로 인해 손실이 발생한 경우
∎ 본 상품의 보장기간은 운송장 번호가 고지된 시점을 포함하여 90일 혹은 배송종료시점 중 먼저 도달하는 기간입니다.
∎ 배송이 시작된 이후 (보험기간이 시작된 이후) 보험계약 해지 및 보험료 환불이 불가합니다.
∎ 배송이 확정되면 동의하신 연락처로 보험가입내용과 사고 시 보상청구 절차가 안내됩니다.
∎ 본 상품의 보장 내용과 관련한 자세한 내용은 아래 자료를 참고 해주시기 바랍니다.
∎ 클레임 발생 시 처리 절차는 아래 첨부 자료를 참고하시기 바랍니다.
∎ 사고접수 및 보험문의: Claim@ilnoir.us 로 보내주시면 신속히 처리해 드리도록 하겠습니다
∎ 보상하지 않는 손해는 다음과 같습니다.
 1. 계약자, 피보험자, 피보험자와 세대를 같이하는 친족 혹은 고용인의 고의, 사기 또는 중대한 과실
 2. 선박, 항공기, 이들의 모터, 장비와 부속용품, 토지, 건물, 영구적으로 설치된 장치, 시설 및 구조물등
 3. 여행자 수표, 모든 종류의 티켓, 양도성 증서, 금은괴, 희귀하거나 고가의 동전, 현금 또는 동등한 물물, 수집 우표 또는 화폐, 상품권, 고가의 보석,
     귀금속, 귀중품
 4. 해충에 의한 파손 / 식물 또는 동물 / 부패하기 쉬운 또는 온도변화에 민감한 화물
 5. 피보험자의 변경작업(절단, 재봉, 톱질 또는 변형을 포함합니다)에 의하여 파손된 제품
 6. 정상적인 마모와 균열, 잘못된 사용, 부정 수단, 점진적인 악화, 오용에 의한 손해
 7. 제품의 근본적인 결함, 하자 및 잠정적으로 내재하고 있는 결함, 하자
 8. 전쟁 또는 모든 유형의 적대행위(침략, 폭동, 내란, 소요 또는 시민소동 등), 핵연료물질 또는 핵연료 물질에 의하여 오염된 물질의 방사성, 폭발성,
     방사능 오염으로 인한 손해
 9. 정부, 공공기관 또는 세관공무원의 공권력의 행사로 생긴 손해 / 밀수품(또는 금제품), 불법행위
 10. 천재지변(홍수, 태풍, 지진 등을 포함하나 이에 한정되지는 않습니다)
 11. 일반대중 또는 단체의 이용, 회원집단에 개방되어 있는 위치나 장소에서 잠금장치나 보호없이 피보험자 또는 기타 책임자가 팔이 닿을 수 있는
     거리보다 멀게 공공장소에서 방치하거나 주의, 보관, 관리에 태만하여 도난을 당한 물품. 단, 피보험자의 근무처, 학교, 종교사원은 공공장소에
     포함되지 않습니다.
 12. 건설현장에 보관된 제품 / 피보험자의 책임 하에 있는 렌트, 리스 또는 빌린 물품
 13. 불법행위에 대하여 아무런 증거 없이 분실한 물품과 원인 불명으로 사라진 물품(분실의 유일한 증거가 설명되지 못하거나 그 물품에 어떤 일이
      발생하였는지를 보여주는 아무런 실질적인 증거가 없는 경우)
 14. 제조사 또는 판매사의 품질보증정책(구매만족보장 등의 서비스 포함)에 해당하는 손해
 15. 중고품인 경우 보험의 목적에 이미 손상되어 있던 손해 / 포장불량으로 인한 여하한 손해
 16. 받는 사람의 정확한 주소를 기재하지 않아 발생한 손해
 17. 운송업자의 운송장 상에서 면책품목으로 명기된 보험의 목적.
 18. 운송 중 확연히 드러난 외부의 물리적 영향에 의한 것이 아닌 기계적, 전기 혹은 전자기적 결함
 19. 손해 입은 보험의 목적을 수리 혹은 복구함에 따라 발생한 가치하락분 및 감가상각에 해당하는 비용
 20. 무검수, 포장불완전, 우손, 냄새, 녹, 산화, 오염, 곰팡이, 퇴색으로 인한 손해. 미미한손해.
 21. 컴퓨터, 컴퓨터 시스템, 컴퓨터 소프트웨어 프로그램, 악성코드, 컴퓨터 바이러스, 운영체제, 전기적 시스템 사용에 따른 손해.
 22. 판매자의 물품 미발송으로 인한 불착손(포장단위의 구매물품이 전부 목적지에 도착하지 않는 경우)
 23. 단순 변심에 의한 손해청구 또는 반송비용은 부담보`
})


const checkIsCare = e => {
  props.data.checked = true;
  props.data.show = false;
};

</script>


<style scoped>
.textarea {
  color: black !important;
  cursor: inherit !important;
  padding: 20px;
  height: 280px !important;
  resize: none !important;
  line-height: 1.5 !important;
}

.table-content {
  width: 100%;
  border:1px solid #ddd;
}

.table-content thead th {
  height: 40px;
  font-weight: bold;
  background: #f5f5f5;
  font-size: 14px;
  border: 1px solid #d9d9d9;
}

.table-content tbody td {
  text-align: left;
  font-size: 13px;
  font-weight: bold;
  padding: 12px;
  line-height: 160%;
  border: 1px solid #d9d9d9;
}

.tooltip {
  font-size: 13px;
  font-weight: 500;
}

.tool-th {
  display: inline-block;
  width: 230px;
}
.btn_small28 span {
  background-color: #c5c5c5;
  height: 23px;
  line-height: 23px;
  color: #fff;
  text-align: center;
}
.plus {
  background-color: #fafafa;
}
</style>