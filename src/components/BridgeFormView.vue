<template>
  <a-modal v-model:visible="visible" :title="bridgeFormData.type === 'puragent' ? '구매대행 신청' : '배송대행 신청'" width="1000px"
           :confirm-loading="state.confirmLoading" @ok="handleOk" @cancel="onClose">
    <div style="height: 600px;overflow-y: scroll;">
      <a-descriptions title="물류센터를 선택해 주세요." bordered :column="1" :labelStyle="{ width: '100px' }"
                      :contentStyle="{ width: '500px' }">
        <a-descriptions-item label="물류 센터">
          <a-radio-group v-model:value="state.form.region">
            <a-radio value="칭다오">칭다오</a-radio>
          </a-radio-group>
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions class="mt40" title="배송방법을 선택해 주세요." bordered :column="1" :labelStyle="{ width: '100px' }"
                      :contentStyle="{ width: '500px' }">
        <a-descriptions-item label="배송 방법">
          <a-radio-group v-model:value="state.form.ctr_seq">
            <a-radio value="해운">해운</a-radio>
            <a-radio value="항공">항공</a-radio>
          </a-radio-group>
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions class="mt40" title="받는 사람 정보를 입력해 주세요." bordered :column="1" :labelStyle="{ width: '100px' }"
                      :contentStyle="{ width: '500px' }">
        <a-descriptions-item label="받는 사람">
          <a-space>
            <a-input v-model:value="state.form.receiver_name" placeholder="한글" @input="fnHanEng2(state.form.receiver_name, 'receiver_name_en')"/>
            <a-input v-model:value="state.form.receiver_name_en" placeholder="영어(한글 입력시 자동 입력)"/>
            <span>* 사업자는 영문명을 직접 수정하세요.</span>
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="개인통관 고유부호">
          <div style="display: flex;flex-direction: column;gap: 15px">
            <span>
              * 개인통관 고유번호 또는 사업자 번호를 써주세요. (항공은 필수입력입니다!!)
            </span>
            <div style="display: flex;gap: 10px">
              <a-input v-model:value="state.form.personal_customs_clearance_code" style="width: 120px"/>
              <a-button type="primary" class="ml10" @click="RRN_NO_API(state.form.personal_customs_clearance_code)" :loading="state.checkClearanceCodeLoading">개인통관 고유번호 확인</a-button>
              <a-checkbox-group v-model:value="state.form.rrn_no_con" >
                <a-checkbox value="N" name="rrn_no_con">통관번호 불일치</a-checkbox>
              </a-checkbox-group>
            </div>
            <div style="display: flex;flex-direction: column;gap: 5px; color: #DD4A68">
              <span>정확한 통관 번호를 넣으시면 고객의 이름과 통관 번호를 비교하여 자동으로 확인됩니다.</span>
              <span>만약 주민번호 혹은 생년월일 같이 통관 번호가 아닌 다른 양식의 번호일 경우,</span>
              <span>정확히 확인하시고 체크박스에 체크를 제거해 주세요.</span>
              <span>만약 정확하지 않은 번호를 기입하실 경우 비용이 더 발생할 수 있으며,</span>
              <span>통관 기간도 최대 10일 정도 딜레이 될 수 있으니 유의하시기 바랍니다.</span>
              <span>체크 버튼은 마이페이지에 통관 번호 일치 불일치를 나타내어 통관 번호 오기 입을 한눈에 볼 수 있기 위함입니다.</span>
              <span>불일치 되더라도 결제 완료가 되면 자동 출고될 수 있으니 유의해서 기입해주시길 바랍니다.</span>
            </div>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="통관 방법">
          <div>
            <div>
              <a-radio-group v-model:value="state.form.rrn_cd" @change="handleRrnCdChange">
                <a-radio value="목록통관">목록통관</a-radio>
                <a-radio value="사업자통관">사업자통관</a-radio>
                <a-radio value="일반통관">일반통관(개인통관고유번호 필수)</a-radio>
              </a-radio-group>
            </div>
            <div style="display: flex;flex-direction: column;gap: 5px; color: #DD4A68">
              * 목록통관 불가 상품(식품류) 및 총 금액이 150불 이상인 경우, 간이통관으로 진행되며, 수수료 3,000원이 배송비에 포함됩니다.
            </div>
          </div>
        </a-descriptions-item>

        <a-descriptions-item label="사업자 등록증" v-if="state.form.rrn_cd === '사업자통관'">
          <a-upload
              v-model:file-list="state.form.fileList"
              name="Busilicense_bimg"
              :max-count="1"
              :action="state.uploadUrl"
              :headers="state.uploadHeaders"
              @change="handleUploadChange"
          >
            <a-button>
              <upload-outlined></upload-outlined>
              사업자 등록증 업로드
            </a-button>
          </a-upload>
        </a-descriptions-item>
        <a-descriptions-item label="주소 및 연락처">
          <div style="display: flex;flex-direction: column;gap: 15px">
            <div style="display: flex;gap: 10px;align-items: center">
              <span>연락처</span>
              <a-input v-model:value="state.form.receiver_tel1" style="width: 120px"/>
              <span>* 숫자만 입력해 주세요.</span>
            </div>
            <div style="display: flex;gap: 10px;align-items: center">
              <span>우편번호</span>
              <a-input v-model:value="state.form.receiver_post_code" style="width: 80px"/>
              <span>* 지번 주소 기재 시 통관지연이 될 수 있습니다.</span>
            </div>
            <div style="display: flex;gap: 10px;align-items: center">
              <span>도로명 주소</span>
              <a-input v-model:value="state.form.receiver_addr1" style="width: 220px" placeholder="도로명주소(주소선택 후 자동기입)"/>
              <a-input v-model:value="state.form.receiver_addr2" style="width: 220px" placeholder="상세주소(주소선택 후 자동기입)"/>
            </div>
            <div style="display: flex;gap: 10px;align-items: center">
              <span>영문 주소</span>
              <a-input v-model:value="state.form.receiver_addr1_en" style="width: 220px" placeholder="영문주소(주소선택 후 자동기입)" />
              <a-input v-model:value="state.form.receiver_addr2_en" style="width: 220px" placeholder="영문상세주소(주소선택 후 자동기입)"/>
            </div>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="배송 요청사항">
          <div style="display: flex;flex-direction: column;gap: 10px;;align-items: start;justify-content: start">
            <a-input v-model:value="state.form.message" placeholder="배송 요청사항을 입력해 주세요."/>
            <span style="color: #DD4A68">* 국내 배송기사 분께 전달하고자 하는 요청사항을 남겨주세요. (예: 부재 시 휴대폰으로 연락주세요.)</span>
          </div>
        </a-descriptions-item>
      </a-descriptions>

      <div class="mt40">
        <h3>주문하신 상품 정보를 입력해 주세요.</h3>
        <a-descriptions class="mt40" :title="`# 상품 ${index+1}` " v-for="(item,index) in state.form.items" :key="index" bordered :column="1" :labelStyle="{ width: '100px' }"
                        :contentStyle="{ width: '500px' }">
          <a-descriptions-item label="이미지">
            <a-image :src="item.prdImage" fallback="data:image/png;base64,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"
                     style="width: 50px;height: 50px;border-radius: 5px;" />
          </a-descriptions-item>
          <a-descriptions-item label="판매 번호">
            <a-input v-model:value="item.prdCode" style="width: 220px;"/>
          </a-descriptions-item>
          <a-descriptions-item label="쇼핑몰 구매주문 번호">
            <a-input v-model:value="item.MALL_ORD_NO" style="width: 220px;"/>
          </a-descriptions-item>
          <a-descriptions-item label="트래킹 번호">
            <div>
              <div>
                <a-input v-model:value="item.invoiceNumber" style="width: 220px;"/>
              </div>
              <div style="display: flex;flex-direction: column;gap: 5px; color: #DD4A68">
                <span>* 물건 도착 전 트래킹 번호를 꼭 써주시기 바랍니다.</span>
                <span>* 제품 도착 후 트래킹 번호를 써주시면 단기 재고렉으로 가져갔다가 트래킹 번호가 써진 후 다시 찾아서 출고하면 효율이 많이 떨어집니다.</span>
                <span>* 그리고 다른 주문서들이 많이 밀려있는 상황이면 해당 주문서의 처리 기간이 최대 2~3일 정도 늦어질 수 있으니 꼭 정확한 트레킹 번호를 제품 도착 전에 적어주시길 바랍니다.</span>
              </div>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="통관품목">
            <a-select v-model:value="item.arc_seq" style="width: 300px;" placeholder="통관품목을 선택해 주세요." @change="handleCategoryChange(item.arc_seq, item)">
              <a-select-option value="">통관품목을 선택해 주세요.</a-select-option>
              <a-select-option :value="cateItem.ARC_SEQ" v-for="(cateItem,index) in state.categoryData" :key="index">{{ cateItem.ca_gubun }} - [{{ cateItem.ca_han }}]</a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item label="상품명">
            <div>
              <div>
                <a-input v-model:value="item.PRO_NM" placeholder="영문 통관품목 선택 후 자동기입" style="width: 180px;"/> / <a-input v-model:value="item.PRO_NM_CH" placeholder="중문 통관품목 선택 후 자동기입" style="width: 180px;"/>
              </div>
              <span style="color: #DD4A68">* 정확한 작성을 해주셔야 통관지연을 막을 수 있습니다. (대표품목, 특수문자, 한글 입력 금지)</span>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="단가">
            단가: <a-input v-model:value="item.unitPrice" style="width: 120px;"/> x 수량: <a-input v-model:value="item.quantity" style="width: 120px;"/>
          </a-descriptions-item>
          <a-descriptions-item label="옵션">
            <a-input v-model:value="item.prdOptionName" style="width: 420px;"/>
          </a-descriptions-item>
          <a-descriptions-item label="상품 URL">
            <a-input v-model:value="item.prdUrl" placeholder="주문 및 검품을 원하시면 되도록 작성해주세요"/>
          </a-descriptions-item>
          <a-descriptions-item label="이미지 URL">
            <a-input v-model:value="item.prdImage" placeholder="주문 및 검품을 원하시면 되도록 작성해주세요"/>
          </a-descriptions-item>
        </a-descriptions>
      </div>


      <a-descriptions class="mt40" title="요청사항을 입력해 주세요." bordered :column="1" :labelStyle="{ width: '100px' }"
                      :contentStyle="{ width: '500px' }">
        <a-descriptions-item label="검수 옵션">
          <a-checkbox-group v-model:value="state.form.EtcDlvr1">
            <a-checkbox value="29">기본검수[무료]</a-checkbox>
            <a-checkbox value="7">정밀검수[품목5개이하] [2,800 원/품목1개당]</a-checkbox>
            <a-checkbox value="62">제품박스 개봉금지 [무료]</a-checkbox>
          </a-checkbox-group>
          <div style="display: flex;flex-direction: column;gap: 5px; color: #DD4A68">
            <span>* 기본검수는 수량 및 옵션 체크는 하지 않습니다.</span>
            <span>* 정밀검수는 신청서 내에 품목수 5개 미만인 경우에만 신청가능합니다. 품목당 2,800원씩 추가됩니다.</span>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="포장 옵션">
          <a-checkbox-group v-model:value="state.form.EtcDlvr2">
            <a-checkbox value="37">뽁뽁이포장 (기본5M)[1000원] 추가 M당 500원</a-checkbox>
            <a-checkbox value="102">소박스포장 (1,000 원)</a-checkbox>
            <a-checkbox value="8">중박스포장 (2,000 원)</a-checkbox>
            <a-checkbox value="35">대박스포장 (3,000 원)</a-checkbox>
            <a-checkbox value="1">에어캡포장 (기본3M)[2000원] 추가M당 800원</a-checkbox>
            <a-checkbox value="27">폴리백 추가 (300 원)</a-checkbox>
            <a-checkbox value="36">고급폴리백 (1,000 원)</a-checkbox>
            <a-checkbox value="38">마대포장 (3,000 원) [ 추가 : 0 ]</a-checkbox>
          </a-checkbox-group>
          <div style="display: flex;flex-direction: column;gap: 5px; color: #DD4A68">
            <span>* 특수포장-별도문의 [메모 또는 별도로 관리자한테 문의해 주세요]</span>
            <span>* 별도 포장 옵션을 선택하지 않으신 경우, 재포장 없이 하나로 밴딩하여 발송합니다. 포장 옵션이 없는 경우, 부분 이탈 분실 시 책임지지 않습니다.</span>
            <span>* 신발박스의 경우 포장 옵션이 없는 경우 신발박스에 테이프 및 송장이 부착됩니다.</span>
            <span>* 신발 2개 이상인 경우 화물 분실 방지를 위해 폴리백 추가바랍니다.</span>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="제거 옵션">
          <a-checkbox-group v-model:value="state.form.EtcDlvr3">
            <a-checkbox value="10">박스제거[500원]</a-checkbox>
            <a-checkbox value="20">영수증,라벨제거[500원]</a-checkbox>
          </a-checkbox-group>
          <div style="display: flex;flex-direction: column;gap: 5px; color: #DD4A68">
            <span>* 주의! 제거옵션 선택으로 파손된 물품은 본인 책임 입니다. 신발박스 제거 시 폴리백 포장옵션이 자동으로 추가됩니다.</span>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="어댑터">
          <a-checkbox-group v-model:value="state.form.EtcDlvr4">
            <a-checkbox value="11">간편형[800원]</a-checkbox>
          </a-checkbox-group>
        </a-descriptions-item>
        <a-descriptions-item label="기타옵션">
          <a-checkbox-group v-model:value="state.form.EtcDlvr5">
            <a-checkbox value="13">도서산간배송비[3,000원]</a-checkbox>
          </a-checkbox-group>
        </a-descriptions-item>
        <a-descriptions-item label="원산지작업">
          <a-checkbox-group v-model:value="state.form.EtcDlvr6">
            <a-checkbox value="14">스티커라벨[100원]</a-checkbox>
            <a-checkbox value="15">봉제라벨[300원]</a-checkbox>
          </a-checkbox-group>
        </a-descriptions-item>
        <a-descriptions-item label="사업자옵션">
          <a-checkbox-group v-model:value="state.form.EtcDlvr7">
            <a-checkbox value="16">원산지증명서[30,000원]</a-checkbox>
          </a-checkbox-group>
        </a-descriptions-item>
        <a-descriptions-item label="요청사항">
          <a-input v-model:value="state.form.REQ_2" placeholder="검품 담당자에서 하실 말씀을 적어 주세요."/>
        </a-descriptions-item>
      </a-descriptions>

      <a-descriptions class="mt40" title="빠른 배송을 위한 자동 옵션" bordered :column="1" :labelStyle="{ width: '100px' }"
                      :contentStyle="{ width: '500px' }">
        <a-descriptions-item label="자동 결제">
          <a-checkbox v-model:checked="state.form.auto_rls_yn" >자동 결제</a-checkbox>
          <div style="display: flex;flex-direction: column;gap: 5px; color: #DD4A68">
          <span> * 출고신청 이후 배송비 자동결제를 원하시면 선택하세요.</span>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="자동 출고">
          <a-checkbox v-model:checked="state.form.auto_req_yn" >자동출고 신청</a-checkbox>
          <div style="display: flex;flex-direction: column;gap: 5px; color: #DD4A68">
          <span> * 전체입고 이후 자동출고를 원하시면 선택하세요. 검수옵션을 선택하신 경우에는 자동출고는 진행되지 않습니다.</span>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>

<script setup>
import {toRefs, onMounted, watch, watchEffect, reactive, ref, computed} from 'vue'
import {message} from "ant-design-vue";
import { UploadOutlined } from '@ant-design/icons-vue';
import {useMarketOrderApi} from "@/api/order";
import {NoAuthAjax} from "@/util/request";

const props = defineProps({
  visible: Boolean,
  bridgeFormData: {
    type: Object
  }
})

const {bridgeFormData} = toRefs(props)
const emit = defineEmits(['close','update'])

const state = reactive({
  form: {
    id: '',
    order_id: '',
    app_type: bridgeFormData.value.type === 'puragent' ? '구매대행' : '배송대행',
    region: '칭다오', // 물류센터
    ctr_seq: '해운', // 배송방법
    receiver_name: '',
    receiver_name_en: '',
    receiver_tel1: '',
    receiver_addr1: '',
    receiver_addr2: '',
    receiver_addr1_en: '',
    receiver_addr2_en: '',
    receiver_post_code: '',
    message: '',
    items: [],

    rrn_cd: '목록통관', // 통관방법
    fileList: [], // 사업자등록증첨부파일
    personal_customs_clearance_code: '', // 개인통관 고유번호
    rrn_no_con: ['Y'], // 개인통관 고유번호 확인 오후 8:36 2020-02-21

    EtcDlvr1: [], // 검수옵션
    EtcDlvr2: [], // 포장옵션
    EtcDlvr3: [], // 제거옵션
    EtcDlvr4: [], // 어댓터
    EtcDlvr5: [], // 기타옵션
    EtcDlvr6: [], // 원산지작업
    EtcDlvr7: [], // 원산지작업

    auto_rls_yn: false, // 자동결제여부
    auto_req_yn: false, // 자동출고여부
    market_product_id: '', // 商城商品ID
    req_2: '', // 물류요청사항
  },
  loading: false,
  confirmLoading: false,
  checkClearanceCodeLoading: false,
  categoryData: [],
  uploadHeaders: {},
  uploadUrl: 'http://192.168.56.101/plugin/worldlink/fileUpload.php',
  checkPersonalCustomsClearanceCode : false,
})

const onClose = () => {
  emit('close')
}

let visible = computed({
  get: () => props.visible, // getter
  set: (value) => emit('close') // setter
})

const getOrderDetailForBridge = async () => {
  await useMarketOrderApi().getOrderDetailForBridge({id: bridgeFormData.value.record.orderId}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.loading = false
      return false;
    }
    const {marketOrder} = res.data
    state.form.id = marketOrder[0].id
    state.form.order_id = marketOrder[0].orderId
    state.form.receiver_name = marketOrder[0].receiverName
    state.form.receiver_name_en = fnHanEng(marketOrder[0].receiverName)
    state.form.receiver_tel1 = marketOrder[0].receiverTel1
    state.form.receiver_addr1 = marketOrder[0].receiverAddr1
    state.form.receiver_addr2 = marketOrder[0].receiverAddr2
    state.form.receiver_addr1_en = fnHanEng(marketOrder[0].receiverAddr1)
    state.form.receiver_addr2_en = fnHanEng(marketOrder[0].receiverAddr2)
    state.form.receiver_post_code = marketOrder[0].receiverPostCode
    state.form.personal_customs_clearance_code = marketOrder[0].personalCustomsClearanceCode
    state.form.message = marketOrder[0].message
    state.form.items = [];
    marketOrder.forEach(item => {
      state.form.items.push({
        shipNm: 'ycbridge',
        prdCode: item.prdCode,
        orderNo: item.orderNo,
        MALL_ORD_NO: '',
        arc_seq: '',
        prdImage: item.prdImage,
        prdName: item.prdName,
        prdNameCn: item.prdNameCn,
        prdOptionName: item.prdOptionName,
        prdUrl: item.prdUrl,
        quantity: item.quantity,
        unitPrice: item.prdPriceCn,
        itemNo: item.itemNo,
      })
    })
  });
}
const handleOk = () => {

  if(state.form.rrn_cd === '사업자통관') {
    if(state.form.fileList.length === 0) {
      message.error('사업자등록증을 첨부해 주세요.');
      return false;
    }
    if(state.form.fileList[0].response.code !== 2000) {
      message.error(state.form.fileList[0].response.message);
      return false;
    }
  }

  if(!state.form.receiver_name){
    message.error("받는 사람을 입력해 주세요.");
    return false;
  }

  if(!state.form.personal_customs_clearance_code){
    message.error("개인통관고유부호를 입력해 주세요.");
    return false;
  }
  if(state.checkPersonalCustomsClearanceCode === false){
    message.error("개인통관고유부호를 확인해 주세요.");
    return false;
  }

  if(!state.form.receiver_tel1){
    message.error("받는 사람 연락처를 입력해 주세요.");
    return false;
  }

  // check arc_seq
  if (state.form.items.some(item => item.arc_seq === '')) {
    message.error('통관품목을 선택해 주세요.');
    return false;
  }

  // check PRO_NM
  if (state.form.items.some(item => item.PRO_NM === '')) {
    message.error('상품명을 입력해 주세요.');
    return false;
  }

  // check PRO_NM_CH
  if (state.form.items.some(item => item.PRO_NM_CH === '')) {
    message.error('중문 상품명을 입력해 주세요.');
    return false;
  }

  // check unitPrice
  if (state.form.items.some(item => item.unitPrice === '')) {
    message.error('단가를 입력해 주세요.');
    return false;
  }

  // check quantity
  if (state.form.items.some(item => item.quantity === '')) {
    message.error('수량을 입력해 주세요.');
    return false;
  }

  // check prdUrl
  if (state.form.items.some(item => item.prdUrl === '')) {
    message.error('상품 URL을 입력해 주세요.');
    return false;
  }

  // check prdImage
  if (state.form.items.some(item => item.prdImage === '')) {
    message.error('이미지 URL을 입력해 주세요.');
    return false;
  }

  state.confirmLoading = true;
  useMarketOrderApi().registerBridgeOrder(state.form).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.confirmLoading = false
      return false;
    }
    state.confirmLoading = false
    message.success(`${state.form.app_type} 신청서가 등록되었습니다.`);
    emit('update')
    emit('close')
  }).catch(err => {
    message.error(err.message);
    state.confirmLoading = false
  })
};

// ------------------------------------------------------------------------------
// 한글->영문 이름 번역
// ------------------------------------------------------------------------------
const fnHanEng = (pVal) => {

  let sCho, sJung, sChong;

  sCho = [ "G", "Gg", "N", "D", "Tt", "R", "M", "B", "Pp", "S", "Ss", "O",
    "J", "Jj", "Ch", "K", "T", "P", "H" ];
  sJung = [ "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae",
    "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i" ];
  sChong = [ "", "g", "gg", "gs", "n", "nz", "nh", "d", "l", "lg", "lm",
    "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s", "ss", "ng", "z",
    "ch", "k", "t", "p", "h" ];

  var sVal = pVal;

  var t = "";
  var tmp = "";
  var n, n1, n2, n3;
  var c, d;
  let i;
  for (i = 0; i < sVal.length; i++) {
    c = sVal.charAt(i);
    n = parseInt(escape(c).replace(/%u/g, ''), 16);
    if (n >= 0xAC00 && n <= 0xD7A3) {
      n = n - 0xAC00;
      n1 = Math.floor(n / (21 * 28));
      n = n % (21 * 28);
      n2 = Math.floor(n / 28);
      n3 = Math.floor(n % 28);
      tmp = sCho[n1] + sJung[n2] + sChong[n3];
      if (tmp.length > 1 && tmp.charAt(0) == 'O')
        tmp = ("" + tmp.charAt(1)).toUpperCase() + tmp.substring(2);
      if (i == 0) {
        // tmp ="KWON" ;
        if (c == "권") {
          tmp = "KWON";
        } else if (c == "김") {
          tmp = "KIM";
        } else if (c == "이") {
          tmp = "LEE";
        } else if (c == "류") {
          tmp = "RYU";
        } else if (c == "박") {
          tmp = "PARK";
        } else if (c == "최") {
          tmp = "CHOI";
        } else if (c == "오") {
          tmp = "OH";
        } else if (c == "우") {
          tmp = "WOO";
        } else if (c == "주") {
          tmp = "JOO";
        }
      }
      t += tmp;
    } else
      t += c;

  }
  t = t.toUpperCase();
  return t;
}
const fnHanEng2 = (pVal,Target) => {

  let sCho, sJung, sChong;

  sCho = [ "G", "Gg", "N", "D", "Tt", "R", "M", "B", "Pp", "S", "Ss", "O",
    "J", "Jj", "Ch", "K", "T", "P", "H" ];
  sJung = [ "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae",
    "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i" ];
  sChong = [ "", "g", "gg", "gs", "n", "nz", "nh", "d", "l", "lg", "lm",
    "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s", "ss", "ng", "z",
    "ch", "k", "t", "p", "h" ];

  var sVal = pVal;

  var t = "";
  var tmp = "";
  var n, n1, n2, n3;
  var c, d;
  let i;
  for (i = 0; i < sVal.length; i++) {
    c = sVal.charAt(i);
    n = parseInt(escape(c).replace(/%u/g, ''), 16);
    if (n >= 0xAC00 && n <= 0xD7A3) {
      n = n - 0xAC00;
      n1 = Math.floor(n / (21 * 28));
      n = n % (21 * 28);
      n2 = Math.floor(n / 28);
      n3 = Math.floor(n % 28);
      tmp = sCho[n1] + sJung[n2] + sChong[n3];
      if (tmp.length > 1 && tmp.charAt(0) == 'O')
        tmp = ("" + tmp.charAt(1)).toUpperCase() + tmp.substring(2);
      if (i == 0) {
        // tmp ="KWON" ;
        if (c == "권") {
          tmp = "KWON";
        } else if (c == "김") {
          tmp = "KIM";
        } else if (c == "이") {
          tmp = "LEE";
        } else if (c == "류") {
          tmp = "RYU";
        } else if (c == "박") {
          tmp = "PARK";
        } else if (c == "최") {
          tmp = "CHOI";
        } else if (c == "오") {
          tmp = "OH";
        } else if (c == "우") {
          tmp = "WOO";
        } else if (c == "주") {
          tmp = "JOO";
        }
      }
      t += tmp;
    } else
      t += c;

  }
  t = t.toUpperCase();
  state.form[Target] = t;
}

// ------------------------------------------------------------------------------
// 기능 :  관세 API 오전 8:57 2020-03-02
// ------------------------------------------------------------------------------
function RRN_NO_API(ORDNO) {
  if(!state.form.personal_customs_clearance_code){
    message.error("먼저 개인통관고유부호를 입력해 주세요.");
    return false;
  }
  if(!state.form.receiver_name){
    message.error("먼저 받는 사람을 입력해 주세요.");
    return false;
  }
  if(!state.form.receiver_tel1){
    message.error("먼저 받는 사람 연락처를 입력해 주세요.");
    return false;
  }

  state.checkClearanceCodeLoading = true;

  NoAuthAjax.get("http://192.168.56.101/plugin/worldlink/ajax.app.prn.api.php", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    },
    params: {
      ORD_NO: ORDNO,
      ADRS_KR: state.form.receiver_name,
      MOB_NO: state.form.receiver_tel1.replace(/-/gi, ""),
    }
  }).then((res) => {
    state.checkPersonalCustomsClearanceCode = true;
    if (res.data.tCnt === "1") {
      state.form.rrn_no_con = ["Y"];
      message.success("개인통관고유부호가 확인되었습니다.");
    } else if (res.data.tCnt === "0") {
      if (res.data.len === "6") {
        state.form.rrn_no_con = ["Y"];
      } else {
        state.form.rrn_no_con = ["N"];
      }
      message.warning(res.data.txt);
    } else {
      state.form.rrn_no_con = ["N"];
      message.warning(res.data.txt);
    }
    state.checkClearanceCodeLoading = false;
  }).catch(err => {
    state.checkClearanceCodeLoading = false;
    message.error(err);
  })
}

const getCategory = async () => {
  NoAuthAjax.get("http://192.168.56.101/plugin/worldlink/arc_seq.php", {}).then((res) => {
    if(res.status !== 200){
      message.error("통관유형을 불러오기 실패하였습니다. 새로고침후 다시 시도해 주세요.");
      return false;
    }
    state.categoryData = res.data;
  }).catch(err => {
    message.error(err);
  })
}

const handleCategoryChange = (value, item) => {
  item.PRO_NM = state.categoryData.find(item => item.ARC_SEQ === value).ca_eng
  item.PRO_NM_CH = state.categoryData.find(item => item.ARC_SEQ === value).ca_chn
  item.hs_code = state.categoryData.find(item => item.ARC_SEQ === value).hs_code
}

const handleUploadChange = (info) => {
  const {status} = info.file;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    if(info.fileList[0].response.code !== 2000) {
      message.error(info.fileList[0].response.message);
      return false;
    }
    message.success(`${info.file.name} 파일 업로드 성공.`);
  } else if (status === 'error') {
    message.error(`${info.file.name} 파일 업로드 실패.`);
  }
}

const handleRrnCdChange = (value) => {
  if(state.form.rrn_cd === '사업자통관') {
    state.form.fileList = []
    message.info('사업자통관은 33,000원 통관비가 적용됩니다.');
  }
}

watchEffect(() => {
  if (visible.value) {
    getOrderDetailForBridge()
    getCategory()
  }
})
</script>