<template>
	<a-modal
		width="100%"
		wrap-class-name="full-modal"
		class="expressTwoModal"
		:footer="null"
    :closable="false"
		v-model:open="visible"
    @cancel="visible = false"
	>
    <a-flex justify="space-between" class="action">
      <a-flex gap="10">
        <a-button shape="round" ghost>수정</a-button>
        <a-button shape="round" ghost>출고</a-button>
        <a-button shape="round" ghost>삭제</a-button>
      </a-flex>
      <a-button shape="round" class="close bg-535660" @click="visible = false">목록</a-button>
    </a-flex>
    <a-flex class="mt30">
      <a-descriptions title="주문정보" layout="vertical" :column="6" :label-style="{color:'#898f9e',fontSize:'15px',fontFamily:'SCDream3'}" :content-style="{color:'#535660',fontSize:'16px',fontFamily:'SCDream5'}">
        <a-descriptions-item label="주문번호">1912150266019</a-descriptions-item>
        <a-descriptions-item label="상태">출고완료</a-descriptions-item>
        <a-descriptions-item label="신청종류">배송대행</a-descriptions-item>
        <a-descriptions-item label="관리번호">-</a-descriptions-item>
        <a-descriptions-item label="현지 FTA 세율 적용">N</a-descriptions-item>
        <a-descriptions-item label="관부가세 안내문자">사업자</a-descriptions-item>
      </a-descriptions>
    </a-flex>
    <a-divider class="bg-F1F3F8 h2" />
    <a-flex>
      <a-descriptions title="센터 정보" layout="vertical" :column="6" :label-style="{color:'#898f9e',fontSize:'15px',fontFamily:'SCDream3'}" :content-style="{color:'#535660',fontSize:'16px',fontFamily:'SCDream5'}">
        <a-descriptions-item label="물류센터">
          <a-flex align="center" gap="3">
            <img src="@/assets/img/express/china.png"/>
            <span>광저우</span>
          </a-flex>
        </a-descriptions-item>
        <a-descriptions-item label="상태">해운대행통관</a-descriptions-item>
        <a-descriptions-item label="통관방법"><a-button shape="round" class="t-white bg-2755f9 fs13" s>사업자통관</a-button></a-descriptions-item>
        <a-descriptions-item label="배송방식">일반배송(합배송)</a-descriptions-item>
        <a-descriptions-item label="중량화물 운송">착불</a-descriptions-item>
        <a-descriptions-item label="관부가세 안내문자">사업자</a-descriptions-item>
      </a-descriptions>
    </a-flex>
    <a-divider class="bg-F1F3F8 h2" />
    <a-flex>
      <a-descriptions title="수취인 정보" layout="vertical" :column="5" :label-style="{color:'#898f9e',fontSize:'15px',fontFamily:'SCDream3'}" :content-style="{color:'#535660',fontSize:'16px',fontFamily:'SCDream5'}">
        <a-descriptions-item label="수취인 이름(KR)">러빈비</a-descriptions-item>
        <a-descriptions-item label="연락처">010-6654-0798</a-descriptions-item>
        <a-descriptions-item label="개인통관 고유부호">P2401323132</a-descriptions-item>
      </a-descriptions>
    </a-flex>
    <a-divider class="bg-F1F3F8 h2" />
    <a-flex>
      <a-descriptions layout="vertical" :column="2" :label-style="{color:'#898f9e',fontSize:'15px',fontFamily:'SCDream3'}" :content-style="{color:'#535660',fontSize:'16px',fontFamily:'SCDream5'}">
        <a-descriptions-item label="수취인 주소">(39353) 경상북도 구미시 왕산로 28-12 삼도뷰엔빌 105동 702호</a-descriptions-item>
        <a-descriptions-item label="배송 요청사항">부재 시 문 앞에 놔주세요.</a-descriptions-item>
        <a-descriptions-item></a-descriptions-item>
        <a-descriptions-item label="물류센터 요청사항">-</a-descriptions-item>
      </a-descriptions>
    </a-flex>
    <a-divider class="bg-F1F3F8 h2" />
    <a-flex vertical>
      <a-descriptions title="결제정보" layout="vertical" :label-style="{color:'#898f9e',fontSize:'15px',fontFamily:'SCDream3'}" :content-style="{color:'#535660',fontSize:'16px',fontFamily:'SCDream5'}">
        <a-descriptions-item label="결제 날짜">2019. 12. 21</a-descriptions-item>
        <a-descriptions-item label="결제 종류">신용카드 [신한]</a-descriptions-item>
        <a-descriptions-item label="중량 택배 결제방법">착불</a-descriptions-item>
      </a-descriptions>
      <a-flex class="br16 p24 bg-white w100 mt20" gap="20">
        <a-flex vertical class="fl1" gap="10">
          <a-flex justify="space-between">
            <div class="fs16 color-898f9e">총 배송비</div>
            <div class="fs20 color-3F4249 font-SCDream6">560,000원</div>
          </a-flex>
          <a-divider class="bg-e4e7ec h2 mtb1 " />
          <a-flex justify="space-between">
            <div class="fs15 color-898f9e">배송비</div>
            <div class="fs15 color-535660 font-SCDream4">560,000원</div>
          </a-flex>
          <a-flex justify="space-between">
            <div class="fs15 color-898f9e">사업자통관 접수 수수료</div>
            <div class="fs15 color-535660 font-SCDream4">3,000원</div>
          </a-flex>
          <a-flex justify="space-between">
            <div class="fs15 color-898f9e">옵션금액</div>
            <div class="fs15 color-535660 font-SCDream4">4,000원</div>
          </a-flex>
        </a-flex>
        <div class="fl-cc"><img src="@/assets/img/express/add.png" class="h34"/></div>
        <a-flex vertical class="fl1">
          <a-flex justify="space-between">
            <div class="fs16 color-898f9e">추가 정산 내역</div>
            <div class="fs20 color-3F4249 font-SCDream6">0원</div>
          </a-flex>
          <a-divider class="bg-e4e7ec h2 mtb14" />
        </a-flex>
        <div class="fl-cc"><img src="@/assets/img/express/eq.png" class="h34"/></div>
        <a-flex vertical class="fl1">
          <a-flex justify="space-between" class="color-2755f9 font-SCDream6">
            <div class="fs16">총 결제금액</div>
            <div class="fs20">567,000원</div>
          </a-flex>
          <a-divider class="bg-e4e7ec h2 mtb14" />
          <a-flex justify="space-between" class="fs15">
            <div class="color-898f9e">총 배송비</div>
            <div class="color-535660 font-SCDream4">567,000원</div>
          </a-flex>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-divider class="bg-F1F3F8 h2 mtb50" />
    <a-descriptions title="금액정보" layout="vertical" :column="4" :label-style="{color:'#898f9e',fontSize:'15px',fontFamily:'SCDream3'}" :content-style="{color:'#535660',fontSize:'16px',fontFamily:'SCDream5'}">
      <a-descriptions-item label="할인 받은 금액">0.00 ¥</a-descriptions-item>
      <a-descriptions-item label="현 지역 배송비">0.00 ¥</a-descriptions-item>
      <a-descriptions-item label="현지 세금">0.00 ¥</a-descriptions-item>
      <a-descriptions-item label="총 수량 / 상품 총액">176 / 5,877.28 ¥</a-descriptions-item>
    </a-descriptions>
    <a-divider class="bg-F1F3F8 h2 mtb50" />
    <a-flex vertical class="weight">
      <div class="fs20 color-535660 fw">무게 정보</div>
      <a-flex class="mt20" gap="10">
        <a-flex vertical align="center" justify="center" gap="14" class="br16 p16 bg-white fl1">
          <a-flex align="center" gap="5">
            <div class="br50 check checked"></div>
            <div class="fs15 color-898f9e">실무게(kg)</div>
          </a-flex>
          <div class="fs16 color-535660 font-SCDream6">200.00kg (CBM)</div>
        </a-flex>
        <a-flex vertical align="center" justify="center" gap="14" class="br16 p16 bg-white fl1">
          <a-flex align="center" gap="5">
            <div class="br50 check"></div>
            <div class="fs15 color-898f9e">부피무게(kg)</div>
          </a-flex>
          <div class="fs16 color-535660 font-SCDream6">0.00 kg</div>
        </a-flex>
        <a-flex vertical align="center" justify="center" gap="14" class="br16 p16 bg-white fl1">
          <a-flex align="center" gap="5">
            <div class="fs15 color-898f9e">사이즈(cm)</div>
          </a-flex>
          <div class="fs16 color-535660 font-SCDream6">0 * 0 * 0 cm</div>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-divider class="bg-F1F3F8 h2 mtb50" />
    <a-flex vertical>
      <div class="fs20 color-535660 fw">상품 정보</div>
      <div class="fs15 color-6B6F7C mt10">입고여부는 등록하신 트래킹번호 화물이 도착한 것을 의미합니다.</div>
      <a-flex align="center" class="order-track bg-535660 br16 p16 mt20" gap="10">
        <QuestionCircleOutlined class="color-b9bdc9" />
        <div class="fs16 t-white">중복송장 발견</div>
        <div class="fs15 color-cfd2da">트래킹 번호</div>
        <div class="fs14 t-white">9201KD1032159F39232</div>
        <div class="fs14 t-white">3050230204233</div>
      </a-flex>
    </a-flex>
    <a-flex vertical align="center" class="product-list mt30" gap="15">
      <a-flex class="list p10 br20 bg-white w100" gap="20" v-for="i in 10">
        <div class="img-wrap br10">
          <img src="@/assets/img/express/china.png"/>
          <div class="no br50 bg-969dae fl-cc fs14 t-white">{{i}}</div>
          <div class="name bg-F1F3F8 br30 fl-cc fs14 color-6B6F7C">구매사이트이동</div>
        </div>
        <a-flex vertical class="intro fl1" gap="8">
          <div class="color-898f9e fs15 mt6">상품명 영문/중문 (품목)</div>
          <div class="color-535660 fs15 font-SCDream6">jumper / 夹克 ( - )</div>
          <a-divider class="bg-F1F3F8 h1 mtb0" />
          <a-descriptions layout="vertical" :label-style="{color:'#898f9e',fontSize:'15px',fontFamily:'SCDream3'}" :content-style="{color:'#535660',fontSize:'16px',fontFamily:'SCDream5'}">
            <a-descriptions-item label="단가 * 수량">42.80 * 9 = 385.2</a-descriptions-item>
            <a-descriptions-item label="색상/사이즈">黑色</a-descriptions-item>
            <a-descriptions-item label="HSCODE">61</a-descriptions-item>
          </a-descriptions>
        </a-flex>
        <a-flex justify="center" vertical gap="10">
            <a-flex gap="10">
              <input-on :key="Math.random()" value="240120123124233" placeholder="쇼핑몰 주문번호" width="306"/>
              <input-on :key="Math.random()" value="9201KD1032159F39232"  placeholder="트래킹 번호" width="306" class="code-wrap color-2755f9"/>
            </a-flex>
          <a-flex justify="flex-end" class="fs14 color-898f9e">입고 [지점] 24.00.00.00:00</a-flex>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-flex vertical class="mt30">
      <div class="fs20 color-535660 fw">검수 옵션</div>
      <div class="fs15 color-6B6F7C mt20">검수 옵션이 없는 경우, 개봉하여 검수하지 않습니다.</div>
      <a-flex wrap="wrap" gap="5" class="option-list mt20">
        <div class="br10 p8 bg-white fs14 color-6B6F7C" v-for="i in 20">택배개봉금지</div>
      </a-flex>
      <a-flex wrap="wrap" gap="10" class="option-img-list mt20">
        <img src="@/assets/img/express/ship.png" v-for="i in 20"/>
      </a-flex>
    </a-flex>
    <a-divider class="bg-F1F3F8 h2 mtb20" />
    <a-flex justify="space-between" class="action">
      <a-flex gap="10">
        <a-button shape="round" ghost>수정</a-button>
        <a-button shape="round" ghost>출고</a-button>
        <a-button shape="round" ghost>삭제</a-button>
      </a-flex>
      <a-button shape="round" class="close bg-535660" @click="visible = false">목록</a-button>
    </a-flex>
	</a-modal>
</template>
<script setup>
import { computed, watch } from "vue";
import {QuestionCircleOutlined} from '@ant-design/icons-vue';
import InputOn from "@/components/inputOn.vue";
const emit = defineEmits(["close"]);
const props = defineProps({
  visible: Boolean,
  bridgeDetail: {
    type: Object
  }
});
let visible = computed({
  get: () => props.visible,
  set: (value) => emit("close")
});
watch(visible, val => {
  if (val){
    $('body').css({ 'overflow': 'hidden' });
  }else{
    $('body').css({ 'overflow': 'auto' });
  }
},{ immediate: true })
</script>
<style>
.expressTwoModal .ant-modal-content{
  background: #f1f3f8;
  padding: 40px 200px;
  width: fit-content;
  height: 100%!important;
}
.expressTwoModal .ant-descriptions-title{
  font-size: 20px;
  color: #535660;
}
.expressTwoModal .ant-descriptions-item-label::after{
  content: '';
}
.expressTwoModal .intro .ant-descriptions-item{
  padding-bottom: 0;
}
</style>
<style scoped>
:deep(.input-on-wrap.code-wrap .placeholder){
  color: #2755F9!important;
}
:deep(.input-on-wrap .placeholder){
  font-size: 13px!important;
}
.action button{
  border: 1px solid #cfd2da;
  color: #3F4249;
  font-size: 14px;
}
.action button:not(.close):hover{
  border: 1px solid #2755F9;
  color: #2755F9;
}
.action .close{
  color:white;
}
.weight .check{
  width: 24px;
  height: 24px;
  background: #d9d9d9;
  position: relative;
}
.weight .check:before{
  content: '';
  position: absolute;
  width: 13px;
  height: 7px;
  left: 50%;
  top: 43%;
  transform: translate(-50%,-50%) rotate(-45deg);
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
}
.weight .check.checked{
  background: #2755F9;
  position: relative;
}
.order-track{
  width: 536px;
}
.product-list{
  overflow: hidden;
  overflow-y: scroll;
  height: 720px;
}
.product-list::-webkit-scrollbar {
  display: none;
}
.product-list .img-wrap{
  width: 124px;
  height: 124px;
  position: relative;
  border: 1px solid #f1f3f8;
}
.product-list .img-wrap .no{
  position: absolute;
  top: 5px;
  left: 5px;
  width: 24px;
  height: 24px;
}
.product-list .img-wrap .name{
  position: absolute;
  bottom: 6px;
  left: 6px;
  width: 112px;
  height: 34px;
  box-shadow: 2px 4px 10px 0 rgba(0,0,0,.1);
}
.product-list .img-wrap img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-list .intro{
  width: 622px;
}
.option-list > div{
  border: 1px solid #E4E7EC;
}
.option-img-list img{
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: contain;
}
</style>