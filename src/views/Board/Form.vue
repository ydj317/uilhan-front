<script setup>
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount, reactive, ref} from "vue";
import {AuthRequest} from "@/util/request";
import BoardEditor from "@/components/ImageEditor/BoardEditor.vue";
import { message } from "ant-design-vue";
import { setFilterRouteList } from "@/router"
import { lib } from "@/util/lib";

const route = useRoute();
const router = useRouter();
let board = ref([]);
let indicator = ref(false);
let buttonLoading = ref(false);

let formState = reactive({
  id: '',
  title: '',
  content: '',
  is_popup: false,
  is_fixtop: false,
  type: 'notice',
  status: '0',
  sort: '0',
  menuList: [],
  menu: '',
  menuOld: '',
});

const contentUpdate = (tinymce) => {
  formState.content = tinymce.editors[0].getContent();
}

const getBoardDetail = (id) => {
  if (!id) return false;
  indicator.value = true;
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/detail',{params:{id:id}}).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      indicator.value = false;
      router.push('/board/list')
      return false;
    }

    formState.id = res.data.id
    formState.title = res.data.title
    formState.content = res.data.content
    formState.is_popup = res.data.isPopup
    formState.is_fixtop = res.data.isFixtop
    formState.type = res.data.type
    formState.menu = res.data.menu
    formState.menuOld = res.data.menu
    indicator.value = false;
  }).catch((error) => {
    message.error(error.message);
    indicator.value = false;
    return false;
  });
}

const onFinish = values => {
  const is_fixtop = formState.is_fixtop ? '1' : '0';
  values = Object.assign(values, {id: formState.id, is_fixtop: is_fixtop, type: formState.type,menu:formState.menu})
  buttonLoading.value = true;
  AuthRequest.post(process.env.VUE_APP_API_URL + '/api/board/save', values).then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      buttonLoading.value = false;
      return false;
    }
    if(localStorage.getItem(formState.id + formState.menuOld)){
      localStorage.removeItem(formState.id + formState.menuOld);
    }
    getNoticePopupList()
    let data = res.data;
    message.success(data.message);

    buttonLoading.value = false;
    router.push('/board/list')

  }).catch((error) => {
    message.error(error.message);
    buttonLoading.value = false;
    return false;
  });
};
const getNoticePopupList = async () => {
  AuthRequest.get(process.env.VUE_APP_API_URL + '/api/board/noticePopupList').then((res) => {
    if (res.status !== '2000') {
      message.error(res.message)
      return false;
    }
    let noticeList = JSON.parse(localStorage.getItem('noticeList'));
    let newNoticeList = res.data.map(item=>{
      let notice = noticeList.find(item2=>item.id == item2.id && item.menu == item2.menu);
      if(notice){
        item.show = notice.show;
        item['open' + item.id] = notice['open' + notice.id];
        item['close' + item.id] = notice['close' + notice.id];
      }else{
        item.show = false;
        item['open' + item.id] = true;
        item['close' + item.id] = false;
      }
      return {...item};
    });
    localStorage.setItem('noticeList', JSON.stringify(newNoticeList));
  }).catch((error) => {
    message.error(error.message);
    return false;
  });
}
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

onBeforeMount(() => {
  getBoardDetail(route.params.id)
  if(lib.isWorldLink()) {
    formState.menuList = setFilterRouteList()[0].children
  } else {
    const hideMenu = [
      '/user',
      '/blog'
    ];
    formState.menuList = setFilterRouteList()[0].children.filter(item=>!hideMenu.includes(item.path) && item.path.indexOf('http') !== 0)
  }
})
const handleChange = (value ) => {
  formState.menu = value;
};
</script>

<template>
  <a-card :bordered="false" title="게시글 등록/수정" :loading="indicator">
    <a-form :model="formState" name="board_form" @finish="onFinish"
            @finishFailed="onFinishFailed" autocomplete="off" :scrollToFirstError="true" layout="horizontal"
            class="board_form">
      <a-form-item label="상단고정" name="is_fixtop">
        <a-switch v-model:checked="formState.is_fixtop" checked-children="On" un-checked-children="Off"/>
      </a-form-item>

      <a-form-item label="팝업설정" name="is_popup" v-if="formState.type === 'notice'">
        <a-switch v-model:checked="formState.is_popup" checked-children="On" un-checked-children="Off"/>
      </a-form-item>
      <a-form-item label="노출메뉴" name="is_show" v-if="formState.is_popup" >
        <a-select v-model:value="formState.menu"  @change="handleChange">
          <template v-for="(menu,key) in formState.menuList">
              <template v-if="menu.children && !menu.meta.isHide">
                <a-select-opt-group :label="menu.meta.title">
                  <template v-for="(menu2,key2) in menu.children">
                    <a-select-option :value="menu2.path" v-if="!menu2.meta.isHide">{{ menu2.meta.title }}</a-select-option>
                  </template>
                </a-select-opt-group>
              </template>
            <template v-else>
              <a-select-option :value="menu.path" v-if="!menu.meta.isHide">{{ menu.meta.title }}</a-select-option>
            </template>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="제목" name="title"
                   :rules="[{ required: true, message: '제목을 입력해 주세요.' }]">
        <a-input v-model:value="formState.title" allow-clear placeholder="제목을 입력해 주세요."/>
      </a-form-item>

      <a-form-item label="내용" name="content">
        <BoardEditor
            ref="editor"
            v-model:value="formState.content"
            @contentUpdate="contentUpdate"
        />
      </a-form-item>


      <div style="display: flex;justify-content: center;margin-top: 20px;">
        <a-button type="primary" html-type="submit" :loading="buttonLoading">저장</a-button>
        <a-button style="margin-left: 10px" @click="router.back()">취소</a-button>
      </div>
    </a-form>
  </a-card>
</template>

<style>
.board_form .ant-form-item {
  margin-bottom: 0;
}

.board_form .ant-form-item-label {
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  width: 170px;
  padding: 10px;
  margin-bottom: -1px;
}

.board_form .ant-form-item-control {
  border: 1px solid #eeeeee;
  padding: 10px;
  margin-left: -1px;
  margin-bottom: -1px;
}

.board_form .ant-form-item-control:nth-last-child {
  border-bottom: 1px solid #eeeeee;
}

</style>