<template>
  <a-flex class="input-on-wrap fl-tc" :class="{focus:state.isFocus || state.inputValue != ''}">
    <a-input
      ref="inputRef"
      v-model:value="state.inputValue"
      @blur="handleBlur"
      @focus="handleFocus"
      :allowClear="state.isFocus && state.inputValue"
      :disabled="(!state.isFocus && state.inputValue != '') || readonly"
      :style="{
        border: `1px solid ${state.isFocus ? focusColor : defaultColor}`,
        width:`${width}px`,
        height:`${height}px`,
      }"
    />
    <div class="placeholder">{{placeholder}}</div>
    <a-flex gap="10" class="btn-wrap" v-if="!state.isFocus && state.inputValue != ''">
      <img src="@/assets/img/express/copy.png" class="cp" @click="copyContent(state.inputValue)" v-if="copy"/>
      <img src="@/assets/img/express/edit.png" class="cp" @click="handleFocus" v-if="edit"/>
    </a-flex>
  </a-flex>
</template>

<script setup>
import { reactive, ref,nextTick  } from "vue";
import { message } from "ant-design-vue";
const inputRef = ref(null);
const emit = defineEmits(['input'])
const props = defineProps({
  width:{
    type: Number,
    default: 408,
  },
  height:{
    type: Number,
    default: 50,
  },
  defaultColor: {
    type: String,
    default: '#e4e7ec',
  },
  focusColor: {
    type: String,
    default: '#2755f9',
  },
  placeholder: {
    type: String,
    default: '',
  },
  copy: {
    type: Boolean,
    default: true,
  },
  edit: {
    type: Boolean,
    default: true,
  },
  value: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});
const state = reactive({
  inputValue:props.value,
  isFocus :false,
});
const handleFocus = async  () => {
  state.isFocus = true;
  await nextTick();
  if (inputRef.value) {
    inputRef.value.focus();
  }
};
const handleBlur = () => {
  state.isFocus = false;
  emit("input", state.inputValue);
};
const copyContent = (value) => {
  const el = document.createElement('textarea');
  el.value = value;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  message.success('성공적으로 복사되었습니다');
}
</script>
<style>
.input-on-wrap .ant-input-affix-wrapper{
  height: 50px;
  border-radius: 10px;
  padding: 10px;
}
.input-on-wrap .ant-input-affix-wrapper input{
  width: 100%;
  height: 30px;
}
.input-on-wrap .ant-input-affix-wrapper.ant-input-affix-wrapper-disabled,.input-on-wrap .ant-input-affix-wrapper input.ant-input-disabled{
  background: #fff;
  cursor: inherit!important;
  color: inherit;
}
</style>
<style scoped>
.input-on-wrap{
  position: relative;
  width: fit-content;
}
.placeholder{
  position: absolute;
  left: 16px;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  pointer-events: none;
  transition: all 0.5s;
  font-size: 14px;
  color: #535660;
}
.input-on-wrap.focus .placeholder {
  top: 1px;
  font-size: 10px;
  background: white;
  padding: 0 4px;
}
.btn-wrap{
  position: absolute;
  right: 10px;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
}
.btn-wrap img{
  height: 18px;
}
</style>