<template>
  <div class="express-wrap p30">
    <div class="fw mb20 fs18">배송대행지</div>
    <a-flex justify="space-between">
      <a-col class="bor p30 br5 w24">
        <a-flex vertical>
          <a-flex justify="space-between">
            <span class="fw fs16">배송대행 신청서</span>
            <span class="color-hui">비용확인</span>
          </a-flex>
          <a-button type="primary" class="mt40 fw h50 bg-black color-huang">신청서 작성하기</a-button>
        </a-flex>
      </a-col>
      <a-col class="bor p30 br5 w24">
        <a-flex vertical>
          <a-flex justify="space-between">
            <span class="fw fs16">나의 예치금</span>
            <span class="color-lan">90,000원</span>
          </a-flex>
          <a-button type="primary" class="mt40 fw h50">신청서 작성하기</a-button>
        </a-flex>
      </a-col>
      <a-col class="w24">
        <a-flex vertical justify="space-between" class="he100">
          <a-button type="primary" class="fw h77 fs16">중국 출고지 주소</a-button>
          <a-button type="primary" class="fw h77 fs16 bg-hui">노 데이터</a-button>
        </a-flex>
      </a-col>
      <a-col class="bor p30 br5 w24">
        <a-flex vertical>
          <a-flex justify="space-between">
            <span class="fw fs16">배대지 공지사항</span>
            <span class="red cp">more</span>
          </a-flex>
          <a-flex vertical class="color-hui mt20">
            <span class="mb5">[유일공지] 배송지연안내</span>
            <span class="mb5">[유일공지] 송장번호오류안내</span>
            <span>[유일공지] 마켓연동안내</span>
          </a-flex>
        </a-flex>
      </a-col>
    </a-flex>
    <div class="fw mt40 fs18">배대지 현황</div>
    <a-divider />
    <a-flex class="ml50">
      <div class="fw fs18 mr80">배송대행</div>
      <a-flex wrap="wrap" class="w50">
        <a-space class="mr20 mb20" v-for="i in 11">
          <span>접수대기</span>
          <a-badge count="85" class="default" :class="{'blue':i == 2}"/>
        </a-space>
      </a-flex>
    </a-flex>
    <a-divider class="mt0" />
    <a-flex class="ml50">
      <div class="fw fs18 mr80">오류현황</div>
      <a-flex wrap="wrap" class="w50">
        <a-space class="mr20 mb20" v-for="i in 4">
          <span>접수대기</span>
          <a-badge count="85" class="default" :class="{'orange':i == 2}"/>
        </a-space>
      </a-flex>
    </a-flex>
    <a-flex class="ml50 mt10">
      <div class="fw fs18 mr80">반품관리</div>
      <a-flex wrap="wrap" class="w50">
        <a-space class="mr20 mb20" v-for="i in 4">
          <span>접수대기</span>
          <a-badge count="85" class="default" :class="{'red':i == 2}"/>
        </a-space>
      </a-flex>
    </a-flex>
    <a-divider class="mt0" />
    <a-flex vertical class="search-wrap">
      <div class="fw fs18 mb20">배송대행 신청 내역</div>
      <a-flex justify="space-between" class="mb20">
        <a-button type="primary" @click="state.modal.open = true">필터</a-button>
        <a-input-search placeholder="검색어를 입력해 주세요." enter-button="검색"/>
      </a-flex>
    </a-flex>
    <a-divider class="mt0 bottom-border" />
    <div class="list-wrap">
      <a-flex class="header-wrap w100">
        <template v-for="v in state.header">
          <div class="fw">{{v}}</div>
        </template>
      </a-flex>
      <a-divider/>
      <a-flex wrap="wrap" class="content-wrap bor br5 mb20" v-for="(v,k) in state.dataSource">
        <a-flex class="header color-lan w100">
          <div class="w10 text-center">{{ v.No }}</div>
          <div class="w10 text-center">{{ v.number }}</div>
          <div class="w20 text-center">{{ v.dateTime }}</div>
        </a-flex>
        <a-flex class="content w100" align="center" v-for="(v1,k1) in v.goods">
          <div><img :src="v1.img" class="br5"/></div>
          <a-flex vertical style="text-align: left">
            <div class="mb10">{{ v1.name }}</div>
            <div class="fs12">{{ v1.sku }}</div>
          </a-flex>
          <div>{{ v1.number }}</div>
          <div>{{ v1.orderCode }}</div>
          <template v-if="k1 == 0">
            <div>{{ v.orderStatus }}</div>
            <div>{{ v.payStatus }}</div>
            <div>{{ v.type }}</div>
            <div>{{ v.fee }}원</div>
            <div>{{ v.recipientName }}</div>
          </template>
        </a-flex>
      </a-flex>
    </div>
    <a-pagination class="w100 fl-cc mt15"
        current="2"
        page-size="10"
        :total="200"
        :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
    />
    <a-modal v-model:open="state.modal.open"  :closable="false" cancelText="취소" okText="주문검색" width="560px" class="modal-wrap">
      <template #title>
          <a-flex align="center" justify="space-between">
            <div class="fw fs16">배송대행 검색 필터</div>
            <a-button class="reset plr30">초기화</a-button>
          </a-flex>
      </template>
      <a-flex vertical class="mt30">
        <div><strong>검색기간</strong></div>
        <a-form-item name="date" class="mt10 mb10">
          <a-range-picker class="w100"/>
        </a-form-item>
      </a-flex>
      <a-flex class="date-wrap bor br5" align="center" justify="center">
        <a-button ghost>전체기간</a-button>
        <a-divider type="vertical"/>
        <a-button ghost>오늘</a-button>
        <a-divider type="vertical"/>
        <a-button ghost>일주일</a-button>
        <a-divider type="vertical"/>
        <a-button ghost>1개월</a-button>
        <a-divider type="vertical"/>
        <a-button ghost>3개월</a-button>
      </a-flex>
      <a-flex vertical class="mt20">
        <div><strong>주문번호</strong></div>
        <a-form-item name="date" class="mt10 mb10">
          <a-input class="w100" placeholder="쇼핑몰 주문번호를 입력하세요."/>
        </a-form-item>
      </a-flex>
      <a-flex vertical class="mt10">
        <div><strong>수취인</strong></div>
        <a-form-item name="date" class="mt10 mb10">
          <a-input class="w100" placeholder="수취인 이름을 입력하세요."/>
        </a-form-item>
      </a-flex>
      <a-flex vertical class="mt10">
        <div><strong>트래킹번호</strong></div>
        <a-form-item name="date" class="mt10 mb10">
          <a-input class="w100" placeholder="중국 트래킹 번호를 입력하세요."/>
        </a-form-item>
      </a-flex>
      <a-flex vertical class="mt10">
        <div><strong>운송장번호</strong></div>
        <a-form-item name="date" class="mt10 mb10">
          <a-input class="w100" placeholder="운송장번호를 입력하세요."/>
        </a-form-item>
      </a-flex>
    </a-modal>
  </div>
</template>

<script setup>
import {reactive} from "vue";

const state = reactive({
  header: ['No','상품정보','수량','트래킹번호','주문상태','결제상태','운송방식','배송대행료','수취인'],
  dataSource:[
    {
      key: '1',
      No: 'No.1',
      number:'신청번호0000',
      dateTime:'2023-12-30 11:38 - 2024-01-13 09:00',
      goods: [
        {img:'../../assets/img/avatar.png',name:'노랑 스마일 귀여운 LED 벽걸이 인테리어 무드등',sku:'M사이즈 / 노랑',number:0,orderCode:'7777888899990'},
        {img:'../../assets/img/avatar.png',name:'노랑 스마일 귀여운 LED 벽걸이 인테리어 무드등',sku:'M사이즈 / 화이트',number:1,orderCode:'7777888899991'}
      ],
      goodsNumber: 1,
      orderCode: '777788889999',
      orderStatus: '배송준비중',
      payStatus: '결제완료',
      type: '해운',
      fee: '11,000',
      recipientName: '홍길동',
    },
    {
      key: '2',
      No: 'No.2',
      number:'신청번호00002',
      dateTime:'2023-12-30 11:38 - 2024-01-13 09:02',
      goods: [
        {img:'',name:'노랑 스마일 귀여운 LED 벽걸이 인테리어 무드등',sku:'M사이즈2 / 노랑',number:1,orderCode:'7777888899992'},
      ],
      goodsNumber: 2,
      orderCode: '7777888899992',
      orderStatus: '배송준비중2',
      payStatus: '결제완료2',
      type: '해운2',
      fee: '11,002',
      recipientName: '홍길동2',
    }
  ],
  modal:{open:false},
});
</script>

<style>
.express-wrap .default .ant-badge-count{
  background: #F6F6F6;
  color: #9F9F9F;
  padding: 0 12px;
}
.express-wrap .blue .ant-badge-count{
  background: #2270E3;
  color: white;
}
.express-wrap .orange .ant-badge-count{
  background: #FB6F3E;
  color: white;
}
.express-wrap .red .ant-badge-count{
  background: #F9433F;
  color: white;
}
.express-wrap .search-wrap .ant-input-search{
  width: 300px!important;
}
.modal-wrap .ant-btn.reset{
  background: #2270E3;
  color: white;
}
.modal-wrap .ant-modal-content{
  padding: 30px 50px;
}
.modal-wrap .ant-picker-input{
  height: 34px;
}
.modal-wrap .date-wrap .ant-divider{
  background: #FEEA91;
}
.modal-wrap .date-wrap .ant-btn-background-ghost{
  color: black;
}
.modal-wrap .ant-modal-footer{
  margin-top: 40px;
}
</style>
<style scoped>
.bor{
  border: 1px solid #F0F0F0;
}
.bottom-border{
  height: 2px;
  background: black;
}
.color-huang{
  color: #FFDB40;
}
.color-hui{
  color: #B8B8B8;
}
.color-lan{
  color: #2071E4;
}
.bg-hui{
  background: #F0F0F0;
}
.he100{
  height: 100%;
}
.header-wrap > div,.content > div{
  text-align: center;
}
.header-wrap > div:nth-of-type(1),.header-wrap > div:nth-of-type(4),.header-wrap > div:nth-of-type(5),.header-wrap > div:nth-of-type(6),.header-wrap > div:nth-of-type(7),.header-wrap > div:nth-of-type(8),.header-wrap > div:nth-of-type(9),.content > div:nth-of-type(1),.content > div:nth-of-type(4),.content > div:nth-of-type(5),.content > div:nth-of-type(6),.content > div:nth-of-type(7),.content > div:nth-of-type(8),.content > div:nth-of-type(9){
  width: 10%;
}
.header-wrap > div:nth-of-type(2),.content > div:nth-of-type(2){
  width: 25%;
}
.header-wrap > div:nth-of-type(3),.content > div:nth-of-type(3){
  width: 5%;
}
.content-wrap .header{
  background: #FAFAFA;
  height: 40px;
  padding: 10px 0;
}
.content-wrap .content{
  padding: 10px 0;
}
.content-wrap .content img{
  width: 70px;
  height: 70px;
}
.content-wrap .content:not(:last-child){
  position: relative;
}
.content-wrap .content:not(:last-child):before{
  position: absolute;
  content: '';
  left: 0;
  bottom: 0;
  width: 50%;
  background: #F2F2F2;
  height: 1px;
}
.modal-wrap input{
  height: 40px;
}
.modal-wrap .date-wrap{
  height: 40px;
}
</style>
