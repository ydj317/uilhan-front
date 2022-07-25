<template>
  <div class="container main">
    <div>

      <div>
        <h4><strong>상품수집마켓</strong></h4>
        <a-radio-group v-model:value="common.market_code">
          <a-radio-button v-for="data in MARKET_CODE" :class="data.class" :value="data.value">{{ data.label }}</a-radio-button>
        </a-radio-group>
      </div>

      <div style="display: inline-block; margin-top: 7px;">
        <h4><strong>번역</strong></h4>
        <a-radio-group v-model:value="common.trans_status">
          <a-radio-button v-for="data in TRANS_STATUS" :class="data.class" :value="data.value">{{ data.label }}</a-radio-button>
        </a-radio-group>
      </div>

      <div style="display: inline-block; margin: 7px 0 0 30px;">
        <h4><strong>릴라켓연동</strong></h4>
        <a-radio-group v-model:value="common.sync_status">
          <a-radio-button v-for="data in SYNC_STATUS" :class="data.class" :value="data.value">{{ data.label }}</a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <div style="margin-top: 7px;">
      <h4><strong>릴라켓연동</strong></h4>
      <a-select v-model:value="common.date_type" style="width: 120px; margin: 0 5px 5px 0">
        <a-select-option value="insert_date">등록</a-select-option>
        <a-select-option value="update_date">수정</a-select-option>
      </a-select>
      <a-space direction="vertical">
        <a-range-picker
            v-model:value="common.date"
            format="YYYY-MM-DD"
            :placeholder="['Start Time', 'End Time']"
            @change="onChangeDatePicker"
        />
      </a-space>
    </div>

    <div style="margin-top: 7px;">
      <div>
        <h4><strong>키워드</strong></h4>
        <a-select @change="limitChange" v-model:value="common.search_key" style="width: 120px; margin: 0 5px 5px 0">
          <a-select-option value="item_code">상품코드</a-select-option>
          <a-select-option value="item_name">기존 상품명</a-select-option>
          <a-select-option value="item_trans_name">번역 상품명</a-select-option>
          <a-select-option value="sku_code">품목코드</a-select-option>
        </a-select>
        <a-input style="width: 358px; margin: 0" v-model:value="common.search_value" placeholder="키워드 입력" />
        <a-button @click="getList" style="width: 100px; margin-left: 10px" type="primary">검색</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {AuthRequest} from '../../util/request';
import moment from 'moment';
import Cookie from 'js-cookie';
// import {lib} from 'util/lib';

export default {
  computed: {
    ...mapState([
      'common',
      'prdlist',
    ])
  },

  data() {
    return {
      MARKET_CODE: [
        {
          label: '전체',
          value: 'all',
          class: 'market_code_default',
        },
        {
          label: 'Tmall',
          value: 'Tmall',
          class: 'market_code'
        },
        {
          label: 'Taobao',
          value: 'Taobao',
          class: 'market_code'
        },
        {
          label: 'Alibaba',
          value: 'Alibaba',
          class: 'market_code'
        },
      ],
      TRANS_STATUS: [
        {
          label: '전체',
          value: 'all',
          class: 'trans_status_default',
        },
        {
          label: '번역',
          value: '1',
          class: 'trans_status',
        },
        {
          label: '미번역',
          value: '0',
          class: 'trans_status',
        }
      ],
      SYNC_STATUS: [
        {
          label: '전체',
          value: 'all',
          class: 'sync_status_default',
        },
        {
          label: '성공',
          value: '1',
          class: 'sync_status',
        },
        {
          label: '실패',
          value: '0',
          class: 'sync_status',
        },
        {
          label: '미연동',
          value: '2',
          class: 'sync_status',
        },
      ],
    };
  },

  methods: {
    limitChange() {
      this.common.isChangeLimit = true;
    },

    onChangeDatePicker(value, dateString) {
      this.common.start_time = dateString[0];
      this.common.end_time = dateString[1];
    },

    getList() {
      let param = this.getParam();
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/prdlist', {params: param}).then((res) => {
        this.prdlist = res.data.list;

        for (let i = 0; i < this.prdlist.length; i++) {
          this.prdlist[i].checked = false;
          this.prdlist[i].item_name_type = '기존 상품명';
          if (this.prdlist[i].item_is_trans === true) {
            this.prdlist[i].item_name_type = '번역 상품명';
          }
        }

        this.common.searchCount = parseInt(res.data.searchCount);
        this.common.totalCount = parseInt(res.data.totalCount);
        this.common.pagination.total = parseInt(res.data.searchCount);
        this.common.pagination.current = parseInt(res.data.page);
        this.common.pagination.pageSize = parseInt(res.data.limit);
        this.common.date = [moment(res.data.start_time), moment(res.data.end_time)];
        this.common.msg = res.data.msg;
        if (this.common.isChangeLimit) {
          this.common.isChangeLimit = false;
        }
      });
    },

    getParam() {
      return {
        'market_code': this.common.market_code || 'all',
        'date_type': this.common.date_type || 'insert_date',
        'start_time': this.common.start_time || '',
        'end_time': this.common.end_time || '',
        'search_key': this.common.search_key || 'item_code',
        'search_value': this.common.search_value || '',
        'trans_status': this.common.trans_status || 'all',
        'sync_status': this.common.sync_status || 'all',
        'limit': parseInt(this.common.limit) || 10,
        'page': this.common.isChangeLimit ? 1 : parseInt(this.common.pageNum),
      };
    },

    setPrivilege() {
      this.common.roles = Cookie.get('member_roles');
    },

    getMarketList() {
      AuthRequest.get(process.env.VUE_APP_API_URL + '/api/marketlist').then((res) => {
        let returnData = res.data;
        if (returnData.status === undefined || returnData.status !== '2000') {
          alert(returnData.msg);
          return false;
        }

        this.common.options = returnData.data;
      });
    },
  }
};
</script>

<style scoped>
/* ant css bug */
.ant-radio-button-wrapper:not(:first-child)::before {
  content: none;
}

.market_code_default {
  color: white !important;
  border: 1px solid #3ddc97 !important;
  border-radius: 5px !important;
  background-color: #3ddc97 !important;
}
.market_code {
  margin-left: 10px !important;
  color: #f06543 !important;
  border: 1px solid #f06543 !important;
  border-radius: 5px !important;
  background-color: white !important;
}

.trans_status_default,
.sync_status_default
{
  color: white !important;
  border: 1px solid #3051d3 !important;
  border-radius: 5px !important;
  background-color: #3051d3 !important;
}
.trans_status,
.sync_status
{
  color: #212529 !important;
  border: 1px solid #eff2f7 !important;
  margin-left: 10px !important;
  border-radius: 5px !important;
  background-color: #eff2f7 !important;
}

.inline_block {
  display: inline-block;
}
.margin_left_30 {
  margin-left: 30px;
}
.margin_bottom_35 {
  margin-bottom: 35px;
}
.margin_bottom_10 {
  margin-bottom: 10px;
}

.container.main {
  /*border: 1px solid black;*/
  /*color: white;*/
  /*border: 1px solid #3ddc97;*/
  /*border-radius: 5px;*/
  background-color: white;
  margin: 30px;
  padding: 10px 20px 20px 10px;
  /*content: none !important;*/
}
</style>