<template>
  <a-layout class="wrap">
    <a-layout-sider class="menu-wrap">
      <div class="logo-wrap fl-cc">
        <img src="@/assets/logo_icon.png">
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" v-model:openKeys="openKeys">
        <template v-for="v in menuList">
          <template v-if="v.children">
            <a-sub-menu key="sub1">
              <template #title>
                <span>
                  <user-outlined />
                  <span>{{ v.name }}</span>
                </span>
              </template>
              <a-menu-item key="1" v-for="v2 in v.children">{{ v2.name }}</a-menu-item>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-menu-item key="2">
              <user-outlined />
              <span class="nav-text">{{ v.name }}</span>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header-wrap"></a-layout-header>
      <a-layout-content>
        <div class="layout-content-wrap">
          <div class="teacher-wrap">
            <div class="font-SCDream5 fs30 pl60">아카데미</div>
            <a-flex wrap="wrap" justify="center" class="list-wrap">
              <div class="list fl-c cp" v-for="v in state.teacherList" :class="`shadow-`+v.color" @click="goTeacherUrl(v.id)">
                <div class="avatar-wrap fl-cc" :class="`bg-`+v.color"><img :src="v.avatar" class="avatar"></div>
                <div class="name fl-cc font-SCDream6 fs20 fw">{{v.name}}</div>
<!--                <div class="title font-SCDream5 fs16 fw mt36 text-center" v-html="v.title"></div>-->
<!--                <div class="intro fl-cc font-SCDream4 fs12 color-949494 mt20 text-center" v-html="v.intro"></div>-->
<!--                <div class="finish fl-cc fl-tc font-SCDream4 fs11 color-949494 mt20"><EyeOutlined class="mr5 fs16" />{{v.finish}}명 수강완료</div>-->
              </div>
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
  teacherList:[
    {
      avatar:require(`@/assets/img/teacher/avatar.png`),
      name:'유능한 강사님들 모집합니다.',
      title:`<span class="border-bottom-black">스마트스토어</span><span class="color-F75F82 border-bottom-F75F82">30분만에</span><span class="border-bottom-black">제대로 시작하기</span>`,
      intro:'스마트스토어 어떻게 시작해야 할지 모르시겠다고요?<br>그렇다면 이 강의를 들어보세요.<br>키워드 찾는 법부터 고객 확보꿀팁까지 스마트스토어에 <br>필요한 내용을 배울 수 있는 강의예요.',
      finish:'3144',
      color:'F75F82',
    },
    {
      avatar:require(`@/assets/img/teacher/avatar.png`),
      name:'유능한 강사님들 모집합니다.',
      title:`<span class="border-bottom-black">스마트스토어</span><span class="color-FD9249 border-bottom-FD9249">30분만에</span><span class="border-bottom-black">제대로 시작하기</span>`,
      intro:'스마트스토어 어떻게 시작해야 할지 모르시겠다고요?<br>그렇다면 이 강의를 들어보세요.<br>키워드 찾는 법부터 고객 확보꿀팁까지 스마트스토어에 <br>필요한 내용을 배울 수 있는 강의예요.',
      finish:'3144',
      color:'FD9249',
    },
    {
      avatar:require(`@/assets/img/teacher/avatar.png`),
      name:'유능한 강사님들 모집합니다.',
      title:`<span class="border-bottom-black">스마트스토어</span><span class="color-082B49 border-bottom-082B49">30분만에</span><span class="border-bottom-black">제대로 시작하기</span>`,
      intro:'스마트스토어 어떻게 시작해야 할지 모르시겠다고요?<br>그렇다면 이 강의를 들어보세요.<br>키워드 찾는 법부터 고객 확보꿀팁까지 스마트스토어에 <br>필요한 내용을 배울 수 있는 강의예요.',
      finish:'3144',
      color:'082B49',
    },
    {
      avatar:require(`@/assets/img/teacher/avatar.png`),
      name:'유능한 강사님들 모집합니다.',
      title:`<span class="border-bottom-black">스마트스토어</span><span class="color-757A1D border-bottom-757A1D">30분만에</span><span class="border-bottom-black">제대로 시작하기</span>`,
      intro:'스마트스토어 어떻게 시작해야 할지 모르시겠다고요?<br>그렇다면 이 강의를 들어보세요.<br>키워드 찾는 법부터 고객 확보꿀팁까지 스마트스토어에 <br>필요한 내용을 배울 수 있는 강의예요.',
      finish:'3144',
      color:'757A1D',
    },
    {
      avatar:require(`@/assets/img/teacher/avatar.png`),
      name:'유능한 강사님들 모집합니다.',
      title:`<span class="border-bottom-black">스마트스토어</span><span class="color-9C8DFB border-bottom-9C8DFB">30분만에</span><span class="border-bottom-black">제대로 시작하기</span>`,
      intro:'스마트스토어 어떻게 시작해야 할지 모르시겠다고요?<br>그렇다면 이 강의를 들어보세요.<br>키워드 찾는 법부터 고객 확보꿀팁까지 스마트스토어에 <br>필요한 내용을 배울 수 있는 강의예요.',
      finish:'3144',
      color:'9C8DFB',
    },
    {
      avatar:require(`@/assets/img/teacher/avatar.png`),
      name:'유능한 강사님들 모집합니다.',
      title:`<span class="border-bottom-black">스마트스토어</span><span class="color-D2D2D2 border-bottom-D2D2D2">30분만에</span><span class="border-bottom-black">제대로 시작하기</span>`,
      intro:'스마트스토어 어떻게 시작해야 할지 모르시겠다고요?<br>그렇다면 이 강의를 들어보세요.<br>키워드 찾는 법부터 고객 확보꿀팁까지 스마트스토어에 <br>필요한 내용을 배울 수 있는 강의예요.',
      finish:'3144',
      color:'D2D2D2',
    },
  ],
});
const goTeacherUrl = (id) => {
  location.href = '/teacher/detail';
};
</script>
<style>
.teacher-wrap .shadow-F75F82{
  box-shadow:15px 15px 25px rgba(247,95,130,0.3);
}
.teacher-wrap .shadow-FD9249{
  box-shadow:15px 15px 25px rgba(253,146,73,0.3);
}
.teacher-wrap .shadow-082B49{
  box-shadow:15px 15px 25px rgba(8,43,73,0.3);
}
.teacher-wrap .shadow-757A1D{
  box-shadow:15px 15px 25px rgba(117,122,29,0.3);
}
.teacher-wrap .shadow-9C8DFB{
  box-shadow:15px 15px 25px rgba(156,141,251,0.3);
}
.teacher-wrap .shadow-D2D2D2{
  box-shadow:15px 15px 25px rgba(210,210,210,0.3);
}
</style>
<style scoped>
.list-wrap{
  margin-top: 232px;
  gap: 271px 144px;
}
.list-wrap .list{
  width: 360px;
  min-height: 400px;
  background: #fff;
  border-radius: 15px;
  position: relative;
  padding: 176px 30px 20px;
}
.list-wrap .avatar-wrap{
  width: 280px;
  height: 280px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%,-50%);
}
.list-wrap .avatar{
  max-width: 190px;
  max-height: 190px;
  object-fit: contain;
}
.list-wrap .title{
  line-height: 24px;
}
.list-wrap .intro{
  line-height: 16px;
}
</style>