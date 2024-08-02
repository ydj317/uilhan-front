<template>
  <a-layout class="wrap">
    <a-layout-sider class="menu-wrap">
      <div class="logo-wrap fl-cc">
        <img src="@/assets/logo_icon.png">
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" v-model:openKeys="openKeys">
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>讲师管理</span>
            </span>
          </template>
          <a-menu-item key="1">讲师管理</a-menu-item>
          <a-menu-item key="2">添加讲师</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header-wrap"></a-layout-header>
      <a-layout-content>
        <div class="layout-content-wrap">
          <div class="teacher-detail-wrap">
            <div class="font-SCDream5 fs30">아카데미</div>
            <a-flex class="main-wrap mt56">
              <a-flex vertical class="left-wrap">
                <div class="video-wrap bg-9C8DFB br10"></div>
                <a-flex vertical class="intro-wrap mt30">
                  <div class="font-SCDream5 fs24">{{state.detail.title}}</div>
                  <div class="intro font-SCDream4 fs16 color-949494 mt20" v-html="state.detail.intro"></div>
                  <div class="font-SCDream4 fs14 color-949494 mt20"><EyeOutlined class="mr5 fs16" />{{state.detail.finish}}명 수강완료</div>
                </a-flex>
                <a-flex class="card-wrap bg-fafafa br15 mt43">
                  <div class="avatar-wrap fl-cc">
                    <img :src="state.detail.avatar" class="avatar">
                  </div>
                  <a-flex vertical class="ml64">
                    <div class="font-SCDream6 fs18">{{state.detail.name}}</div>
                    <div class="font-SCDream4 fs14 color-949494 mt15" v-html="state.detail.intro2"></div>
                    <a-flex align="center" wrap="wrap" gap="20" class="mt36">
                      <div class="range-wrap fl-tc" v-for="(v,i) in state.detail.range">
                        <div class="range" :class="`range`+i"></div>
                        <span class="ml8">{{v}}</span>
                      </div>
                    </a-flex>
                  </a-flex>
                </a-flex>
                <a-flex vertical class="video-list-wrap mt16 bor-F0F0F0 br20" v-if="state.videoList.length">
                  <div class="font-SCDream6 fs18 mb30">강의 {{state.videoList.length}}</div>
                  <a-flex align="center" class="video-list" v-for="v in state.videoList">
                    <div class="video bg-9C8DFB fl10"></div>
                    <a-flex vertical class="text-wrap ml30">
                      <div class="font-SCDream4 fs18">{{ v.title }}</div>
                      <div class="content font-SCDream4 fs12 mt15">{{ v.content }}</div>
                    </a-flex>
                  </a-flex>
                </a-flex>
              </a-flex>
              <a-flex class="right-wrap ml40">
                <div class="list fl-c fl-tc" :class="`shadow-`+state.detail.color">
                  <div class="avatar-wrap fl-cc" :class="`bg-`+state.detail.color"><img :src="state.detail.avatar" class="avatar"></div>
                  <div class="name fl-cc font-SCDream6 fs18 fw">{{state.detail.name}}</div>
                  <span class="title font-SCDream5 fs18 color-9C8DFB mt30 border-bottom-9C8DFB">수강이 궁금하다면 ?</span>
                  <a-button class="pay-btn fl-cc font-SCDream5 fs16 color-FEDB41 mt30 bg-black br20">결제하기</a-button>
                </div>
              </a-flex>
            </a-flex>
          </div>
        </div>
      </a-layout-content>
      <a-layout-footer class="layout-footer-wrap"></a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { reactive, ref } from "vue";
import { UserOutlined,EyeOutlined} from "@ant-design/icons-vue";
const selectedKeys = ref(['1']);
const openKeys = ref(['sub1']);
const state = reactive({
  videoList:[
    {
      url:'',
      title:'1강 온라인에서 돈 벌려면 물류를 무조건 해야하는 이유',
      content:'소개소개 소개소개 소개글 소개소개 소개소개 소개글 소개소개 소개소개 소개글 소개소개 소개소개 소개글소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글소개글 소개소개 소개소개 소개글 소개글 소개소개 소개소개 소개글 소개글 소개소개 소개소개 소개글 소개글 소개소개 소개소개 소개글'
    },
    {
      url:'',
      title:'1강 온라인에서 돈 벌려면 물류를 무조건 해야하는 이유',
      content:'소개소개 소개소개 소개글 소개소개 소개소개 소개글 소개소개 소개소개 소개글 소개소개 소개소개 소개글소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글소개글 소개소개 소개소개 소개글 소개글 소개소개 소개소개 소개글 소개글 소개소개 소개소개 소개글 소개글 소개소개 소개소개 소개글'
    },
    {
      url:'',
      title:'1강 온라인에서 돈 벌려면 물류를 무조건 해야하는 이유',
      content:'소개소개 소개소개 소개글 소개소개 소개소개 소개글 소개소개 소개소개 소개글 소개소개 소개소개 소개글소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글소개글 소개소개 소개소개 소개글 소개글 소개소개 소개소개 소개글 소개글 소개소개 소개소개 소개글 소개글 소개소개 소개소개 소개글'
    },
  ],
  detail:{
    avatar:require(`@/assets/img/teacher/avatar.png`),
    name:'N잡하는 허대리',
    title:'내 사업을 만드는 비즈니스 기획법',
    intro:`스마트스토어 어떻게 시작해야 할지 모르시겠다고요? 그렇다면 이 강의를 들어보세요.<br>키워드 찾는 법부터 고객 확보꿀팁까지 스마트스토어에 필요한 내용을 배울 수 있는 강의예요.`,
    intro2:`구독자 20만 소개소개 소개소개 소개글<br>소개글 소개글 소개글<br>소개글 소개소개 소개소개 소개글`,
    finish:'1920',
    color:'9C8DFB',
    range:['유튜브','인스타그램','블로그'],
  },
});
</script>
<style scoped>
.wrap .logo-wrap{
  width: 100%;
  height: 60px;
}
.wrap .logo-wrap img{
  height: 30px;
  display: none;
}
.wrap .layout-header-wrap{
  background: #fff;
  height: 60px;
}
.wrap .layout-content-wrap{
  background: #fff;
  min-height: calc(100vh - 160px);
  padding: 20px;
}
.wrap .layout-footer-wrap{
  background: #fff;
  height: 100px;
}
:deep(.ant-menu-item-selected) {
  font-weight: bold;
  color: #001529;
}
</style>
<style>
.teacher-detail-wrap .shadow-9C8DFB{
  box-shadow:15px 15px 25px rgba(156,141,251,0.3);
}
</style>
<style scoped>
.range{
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
.range.range0{
  background: red;
}
.range.range1{
  background-image: linear-gradient(to bottom left, #F67398 , #F18EE1);
}
.range.range2{
  background: #57BB13;
}
.range.range3{
  background: blue;
}
.range.range4{
  background: peru;
}
.range.range5{
  background: palegoldenrod;
}
.range.range6{
  background: yellow;
}
.range.range7{
  background: cyan;
}
.range.range8{
  background: darkgrey;
}
.range.range9{
  background: lightblue;
}
.range.range10{
  background: lightcyan;
}
.teacher-detail-wrap{
  padding: 0 125px 67px 60px;
}
.left-wrap{
  width: calc(100% - 355px);
}
.video-wrap{
  height: 620px;
}
.left-wrap .intro{
  line-height: 24px;
}
.card-wrap{
  padding: 47px 53px;
}
.card-wrap .avatar-wrap{
  width: 136px;
  height: 136px;
  border-radius: 50%;
  background: #fff;
}
.card-wrap .avatar{
  width: 90px;
  height: 90px;
  object-fit: contain;
}
.video-list-wrap{
  padding: 20px 50px;
}
.video-list-wrap .content{
  line-height: 16px;
}
.video-list{
  margin-bottom: 20px;
}
.video-list:last-child{
  margin-bottom: 0;
}
.video{
  width: 205px;
  height: 115px;
  border-radius: 15px;
}
.right-wrap{
  margin-top: 278px;
}
.right-wrap .list{
  width: 310px;
  height: 344px;
  background: #fff;
  border-radius: 15px;
  position: relative;
  padding: 156px 36px 48px 45px;
}
.right-wrap .avatar-wrap{
  width: 240px;
  height: 240px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%,-50%);
}
.right-wrap .avatar{
  max-width: 190px;
  max-height: 190px;
  object-fit: contain;
}
.right-wrap .pay-btn{
  width: 229px;
  height: 44px;
}
</style>