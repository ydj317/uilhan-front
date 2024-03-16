<template>
  <a-range-picker
    :value="dateValue"
    :format="format"
    value-format="string"
    :locale="locale"
    @change="onChangeDatePicker"
    style="width: 100%"
  />
  <div class="shortcut-list">
    <a-button type="ghost" @click="all">전체기간</a-button>
    <a-divider type="vertical" style="background-color: #ffd82c"/>
    <a-button type="ghost" @click="today">오늘</a-button>
    <a-divider type="vertical" style="background-color: #ffd82c"/>
    <a-button type="ghost" @click="selectRange(1, 'week')">일주일</a-button>
    <a-divider type="vertical" style="background-color: #ffd82c"/>
    <a-button type="ghost" @click="selectRange(1, 'months')">1개월</a-button>
    <a-divider type="vertical" style="background-color: #ffd82c"/>
    <a-button type="ghost" @click="selectRange(3, 'months')">3개월</a-button>
  </div>
</template>

<script setup>
import {computed, ref, toRefs, watch} from "vue";
import moment from "moment/moment";
import locale from 'ant-design-vue/es/date-picker/locale/ko_KR';

const format = 'YYYY-MM-DD'

const props = defineProps(['start', 'end'])
const emit = defineEmits(['update:start', 'update:end'])
const {start, end} = toRefs(props)
const dateValue = computed( () => {
  return (! start.value && !end.value) ? null : [moment(start.value), moment(end.value)]
})

function all() {
  onChangeDatePicker(null, ['', ''])
}

function today() {
  const today = moment().format(format)
  onChangeDatePicker(null, [today, today])
}

function selectRange(val, type) {
  const end = moment()
  const start = moment().subtract(val, type)
  onChangeDatePicker(null, [start.format(format), end.format(format)])
}

function onChangeDatePicker(value, dateString) {
  emit('update:start', dateString[0])
  emit('update:end', dateString[1])
}

</script>

<style scoped>
.shortcut-list {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 15px;
  border: 1px solid #dddddd;
  border-radius: 5px;
}
</style>