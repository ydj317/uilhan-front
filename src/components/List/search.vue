<template>
  <div class="search_body">
    <div class="source_picker">
      <span :style="{ marginRight: '8px' }"> 마켓 :</span>
      <a-radio-group v-model:value="common.market_code">
        <a-radio-button value="all">전체</a-radio-button>
        <a-radio-button value="Tmall">Tmall</a-radio-button>
        <a-radio-button value="Taobao">Taobao</a-radio-button>
        <a-radio-button value="Alibaba">Alibaba</a-radio-button>
      </a-radio-group>

      <span :style="{ marginLeft: '20px' }"> 번역상태 :</span>
      <a-select v-model:value="common.trans_status" style="width: 120px; margin-left: 10px">
        <a-select-option value="all">전체</a-select-option>
        <a-select-option value="0">미번역</a-select-option>
        <a-select-option value="1">번역</a-select-option>
      </a-select>

      <span :style="{ marginLeft: '20px' }"> 연동상태 :</span>
      <a-select v-model:value="common.sync_status" style="width: 120px; margin-left: 10px">
        <a-select-option value="all">전체</a-select-option>
        <a-select-option value="1">성공</a-select-option>
        <a-select-option value="0">실패</a-select-option>
        <a-select-option value="2">미연동</a-select-option>
      </a-select>
    </div>
    <div class="range_picker">
      <span :style="{ marginRight: '8px' }">기간 : </span>
      <a-select v-model:value="common.date_type" style="width: 120px">
        <a-select-option value="insert_date">등록</a-select-option>
        <a-select-option value="update_date">수정</a-select-option>
      </a-select>
      <a-space direction="vertical">
        <a-range-picker
            :value="[common.start_time, common.end_time]"
            format="YYYY-MM-DD"
            :placeholder="['Start Time', 'End Time']"
            @change="onChangeDatePicker"
        />
      </a-space>
    </div>

    <div class="key_picker">
      <span :style="{ marginRight: '8px' }">키워드 : </span>
      <a-select @change="limitChange" v-model:value="common.search_key" style="width: 120px">
        <a-select-option value="item_code">상품코드</a-select-option>
        <a-select-option value="item_name">기존 상품명</a-select-option>
        <a-select-option value="item_trans_name">번역 상품명</a-select-option>
        <a-select-option value="sku_code">품목코드</a-select-option>
      </a-select>
      <a-input style="width: 500px; margin-left: 10px" v-model:value="common.search_value" placeholder="키워드" />
      <a-button @click="getList" style="width: 100px; margin-left: 10px" type="primary">검색</a-button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {AuthRequest} from '../../util/request';
import moment from 'moment';

export default {
  computed: {
    ...mapState([
      'prdlist',
      'common',
    ])
  },

  data() {
    return {
      isChangeLimit: false,
    }
  },

  methods: {
    onChangeDatePicker(value, dateString) {
      this.common.start_time = dateString[0];
      this.common.end_time = dateString[1];
    },

    limitChange() {
      this.isChangeLimit = true;
    },

    getParam() {
      return {
        'market_code': !this.common.market_code? 'all' : this.common.market_code,
        'date_type': this.common.date_type || '',
        'start_time': this.common.start_time || '',
        'end_time': this.common.end_time || '',
        'search_key': this.common.search_key || '',
        'search_value': this.common.search_value || '',
        'trans_status': !this.common.trans_status? 'all' : this.common.trans_status,
        'sync_status': !this.common.sync_status? 'all' : this.common.sync_status,
        'limit': parseInt(this.common.limit),
        'page': this.isChangeLimit ? 1 : parseInt(this.pageNum),
      };
    },

    getList() {
      let param = this.getParam();
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/prdlist', {params: param}).then((res) => {
        if (res.status !== '2000') {
          alert(res.message)
        }

        this.prdlist = res.data.list;
        this.common = param;

        for (let i = 0; i < this.prdlist.length; i++) {
          this.prdlist[i].checked = false;
          this.prdlist[i].item_name_type = '기존 상품명';
          if (this.prdlist[i].item_is_trans === true) {
            this.prdlist[i].item_name_type = '번역 상품명';
          }
        }

        this.searchCount = parseInt(res.data.searchCount);
        this.totalCount = parseInt(res.data.totalCount);
        this.pagination.total = parseInt(res.data.searchCount);
        this.pagination.current = parseInt(res.data.page);
        this.pagination.pageSize = parseInt(res.data.limit);
        this.date = [moment(res.data.start_time), moment(res.data.end_time)];
        this.msg = res.data.msg;
        if (this.isChangeLimit) {
          this.isChangeLimit = false;
        }
      });
    },
  }
};
</script>

<style scoped>

</style>