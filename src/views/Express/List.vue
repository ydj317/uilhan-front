<template>
  <div class="express-list-wrap p40 fl-lc fl-c bg-F1F3F8">
    <div class="fs24 color-3F4249 fw fl-cc">배송대행지를 선택해주세요.</div>
    <a-flex class="mt40 fl-lc" gap="100">
      <a-flex class="list-wrap color-3F4249" gap="20" v-for="(v,i) in state.list">
        <div class="left-wrap fl-c p40 cp">
          <div class="text1 fs14 color-6B6F7C">{{ v.title }}</div>
          <div class="text2 fs28 fw mt6">{{ v.title2 }}</div>
          <div class="img-wrap fl-cc">
            <img :src="v.img"/>
          </div>
          <div class="fl-cc">
            <a-button class="btn fs14 plr16 color-3F4249 bg-F1F3F8" @click="goUrl(i)">바로가기</a-button>
          </div>
        </div>
        <div class="right-wrap fs16 t-white mask-top mask-bottom">
            <div class="right-list p24" v-for="v2 in v.introList">
              <div class="img-wrap fl-cc">
                <img :src="v2.img"/>
              </div>
              <div class="text1 mt10">{{ v2.title }}</div>
            </div>
        </div>
      </a-flex>
    </a-flex>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from "vue";
import "@/util/jQuery_v1.10.2";
import { useRouter } from "vue-router";
const router = useRouter()
const state = reactive({
  list: [
    {
      title:'해외 구매/배송 대행지',
      title2:'넥스트 배송',
      img:require(`@/assets/img/express/image1.png`),
      introList:[
        {
          img:require(`@/assets/img/express/star.svg`),
           title:'유일 제휴 코드 입력 시 VIP등급',
        },
        {
          img:require(`@/assets/img/express/weight.svg`),
          title:'부피무게 없이 실무게 배송비 적용',
        },
        {
          img:require(`@/assets/img/express/apartment.svg`),
          title:'인천 세관 자가장치장 운영(자체통관라인, 1~3일 소요)',
        },
        {
          img:require(`@/assets/img/express/support_agent.svg`),
          title:'한국 CS 담당마스터 직원 소통',
        }
      ],
    },
    {
      title:'해외 구매/배송 대행지 ',
      title2:'토스토스',
      img:require(`@/assets/img/express/image2.png`),
      introList:[
        {
          img:require(`@/assets/img/express/account_tree.svg`),
          title:'구매대행에 최적화된 배송대행 솔루션',
        },
        {
          img:require(`@/assets/img/express/airline_stops.svg`),
          title:'중국, 미국, 일본, 영국, 독일 총 8개 지점과 국내 3PL 연계',
        },
        {
          img:require(`@/assets/img/express/drag_click.svg`),
          title:'통관업체 선택지정 및 자가장치장 당일통관부터 평택, 군산까지',
        },
        {
          img:require(`@/assets/img/express/shopping_cart_checkout.svg`),
          title:'1688 맞춤형 구매대행 및B2B전용 지점 별도 운영',
        },
        {
          img:require(`@/assets/img/express/rocket_launch.svg`),
          title:'간편 LCL등록 및국내외 로켓그로스 출고',
        },
        {
          img:require(`@/assets/img/express/block.svg`),
          title:'노데이터 매칭,긴급 출고중지 시스템',
        },
        {
          img:require(`@/assets/img/express/support_agent_purple.svg`),
          title:'카카오 알림톡 및한국 고객상담센터 운영',
        }
      ],
    }
  ],
});
const goUrl = (i) => {
  if(i == 0){
    location.href = '/express/listone';
  }
  if(i == 1){
    location.href = '/express/listtwo';
  }
};
onMounted(()=>{
  $('.ant-layout-content').css({'margin':"0"});
  $('.ant-layout-footer').css({ 'display': 'none' });
  $('body').css({ 'overflow-y': 'hidden' });
})
onUnmounted(()=>{
  $('.ant-layout-content').css({'margin':"0 20px"});
  $('.ant-layout-footer').css({ 'display': 'block' });
  $('body').css({ 'overflow-y': 'scroll' });
})

</script>
<style scoped>
.express-list-wrap{
  width: 1720px;
  min-height: calc(100vh - 60px);
}
.list-wrap{
  height: 460px;
}
.left-wrap{
  width: 300px;
  height: 460px;
  background: #fff;
  border: 1px solid #E4E7EC;
  box-shadow: 2px 4px 10px 0 rgba(0,0,0,0.1);
  border-radius: 24px;
}
.list-wrap:first-child .left-wrap:hover{
  border: 2px solid #FF4200;
}
.list-wrap:last-child .left-wrap:hover{
  border: 2px solid #2755F9;
}
.left-wrap .text1{
  line-height: 21px;
}
.left-wrap .text2{
  line-height: 36px;
}
.img-wrap{
  width: 220px;
  height: 283px;
}
.btn{
  height: 34px;
  border-radius: 30px;
  border: 0;
}
.right-wrap{
  overflow: hidden;
  overflow-y: scroll;
  position: relative;
  height: 460px;
}
.right-wrap::-webkit-scrollbar{
  display: none;
}
.right-wrap.mask-top:before{
  content: '';
  position: sticky;
  left: 0;
  right: 0;
  height: 40px;
  top: 0;
  background: linear-gradient(to top, rgba(241, 243, 248, 0) 0%, rgba(241, 243, 248, 1) 100%);
}
.right-wrap.mask-bottom:after{
  content: '';
  position: sticky;
  left: 0;
  right: 0;
  height: 40px;
  bottom: 0;
  background: linear-gradient(to top, rgba(241, 243, 248, 1) 0%, rgba(241, 243, 248, 0) 100%);
}
/* 控制渐变效果的显示 */
.right-wrap.mask-top:before {
  display: block;
}
.right-wrap.mask-bottom:after {
  display: block;
}
/* 如果内容未溢出，则隐藏渐变效果 */
.right-wrap:not(.mask-top):before,
.right-wrap:not(.mask-bottom):after {
  display: none;
}
.right-list{
  max-width: 300px;
  border-radius: 24px;
  background: #535660;
  box-shadow: 2px 4px 10px 0 rgba(0,0,0,0.1);
  margin-bottom: 16px;
  display: table;
}
.right-list:last-child{
  margin-bottom: 0;
}
.right-list .img-wrap{
  width: 32px;
  height: 32px;
}
.right-list img{
  width: 22px;
  height: 22px;
}
.right-list .text1{
  line-height: 24px;
}
</style>
