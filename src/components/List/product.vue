<template>
  <div class="search_body">
    <table style="width: 100%">
      <tr>
        <td style="width: 2%"><a-checkbox v-model:checked="checked" @change="checkItem"></a-checkbox></td>
        <td style="width: 75%; display: flex; align-items: center;">
          <div style="width: 300px">
            전체 상품 건수 <span style="color: #d4380d">{{totalCount}}</span> / 검색 상품 건수 <span style="color: #d4380d">{{searchCount}}</span>
          </div>
          <a-select
              v-model:value="marketList"
              mode="tags"
              style="width: 400px;margin-left: 100px"
              placeholder="연동가능 제휴사"
              :options="options"
              @change="marketListChange"
          >
          </a-select>
          <a-button style="margin-left: 20px;" type="primary" @click="testsync('multi')">제휴사 상품연동</a-button>
          <!--          <a-button style="margin-left: 20px" type="primary" @click="testPop">팝업</a-button>-->

        </td>
        <td>
          <a-popconfirm
              title="삭제하시겠습니까?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deletePrd"
          >
            <a-button style="margin-left: 10px; float: right" type="primary">상품삭제</a-button>
          </a-popconfirm>
          <a-popconfirm
              v-if="this.roles.length > 0 && this.roles.indexOf('ROLE_RELAKET') > -1"
              title="릴라켓에 연동하시겠습니까?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="sendMarket"
          >
            <a-button style="margin-right: 10px; float: right" type="primary">릴라켓연동</a-button>
          </a-popconfirm>
        </td>
      </tr>
    </table>
  </div>

  <a-list
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="prdlist"
  >
    <template #renderItem="{ item, index }">
      <a-list-item key="item.pno">
        <template #extra>
          <img
              width="100"
              height="80"
              alt="logo"
              :src="item.item_thumb[0]"
          />
        </template>
        <a-list-item-meta :description="item.item_info[0]">
          <template #title>
            <ul style="list-style-type: none; padding: 0; margin: 0;">
              <li style="float: left; width: 30px">
                <a-checkbox v-if="item.checked !== undefined" v-model:checked="item.checked"></a-checkbox>
              </li>
              <li v-if="item.item_is_trans === true">
                <a :href="item.item_href">{{ item.item_name_type }} : {{ item.item_trans_name }}</a><br>
                <a style="color: #6d737b" :href="item.item_href">기존 상품명 : {{ item.item_name }}</a>
              </li>
              <li v-else ><a :href="item.item_href">기존 상품명 : {{ item.item_name }}</a></li>
            </ul>
          </template>
        </a-list-item-meta>
        <a-typography-title :level="5">
          마켓 : {{item.item_market}}
          <span> | </span>
          마켓 상품 바로가기 : <a :href="item.item_url" target="_blank">{{item.item_code}}</a>
          <span> | </span>
          등록일 : {{item.item_ins}}
          <span> | </span>
          수정일 : {{item.item_upd}}
        </a-typography-title>
        <div v-if="this.roles.length > 0 && this.roles.indexOf('ROLE_RELAKET') > -1">
          연동 상태:
          <span v-if="item.item_sync_date === null && item.item_sync_status === false">
              미연동
            </span>
          <span v-else-if="item.item_sync_date !== null && item.item_sync_status === false">
              <a-tooltip>
              <template #title>{{msg[item.item_code]}}</template>
              <span style="color: #d4380d">연동실패</span>
              </a-tooltip>
               | 연동일시 : {{item.item_sync_date}}
            </span>
          <span v-else-if="item.item_sync_date !== null && item.item_sync_status === true">
              연동성공 | 연동일시 : {{item.item_sync_date}}
            </span>
          <a-button type="dashed" style="margin-left: 20px" @click="singlePop(item)">제휴사연동정보</a-button>
        </div>
      </a-list-item>
    </template>

  </a-list>

  <a-select
      style="width: 150px; margin-left: 20px; text-align: center"
      v-model:value="common.limit"
      @change="limitChange"
  >
    <a-select-option value="10">10개씩보기</a-select-option>
    <a-select-option value="20">20개씩보기</a-select-option>
    <a-select-option value="50">50개씩보기</a-select-option>
    <a-select-option value="100">100개씩보기</a-select-option>
  </a-select>

  <a-modal width="600px" :maskClosable="false" v-model:visible="singleSyncPop" @ok="">
    <template #title>
      <h3 style="text-align: center; display: inline-block; width: 90%"><b>제휴사 상품연동</b></h3>
    </template>
    <a-checkbox style="margin-left: 20px" v-model:checked="checkAll" @click="checkAllMarket(checkAll)">전체선택</a-checkbox>
    <!--    <a-checkbox style="margin-left: 20px" v-model:checked="checkAll" @click="checkAllMarket(checkAll)">실패상품선택</a-checkbox>-->
    <!--    <a-checkbox style="margin-left: 20px" v-model:checked="checkAll" @click="checkAllMarket(checkAll)">미연동상품선택</a-checkbox>-->

    <a-list :data-source="this.singleDetail.item_sync_market" style="height: 600px;overflow-y:scroll;">
      <template #renderItem="{ item }">
        <a-list-item>
          <div v-if="item.status !== 'unsync'" :class="item.status + ` prdSyncResult`">
            <a-checkbox v-model:checked="item.checked"></a-checkbox>
            <span style="margin-left: 10px"><b>연동계정 : {{item.market_account}}</b></span><br/>
            <span style="margin-left: 20px;"><b>등록시간 : {{item.ins_time}}</b></span><br/>
            <span style="margin-left: 20px;"><b>재연동시간 : {{item.upd_time}}</b></span><br/>
            <span style="margin-left: 20px;"><b>연동결과 : {{item.result}}</b></span>
          </div>
          <div v-else :class="item.status + ` prdSyncResult`">
            <a-checkbox v-model:checked="item.checked"></a-checkbox>
            <span style="margin-left: 10px"><b>연동계정 : {{item.market_account}}</b></span><br/>
            <span style="margin-left: 25px"><b>미연동</b></span>
          </div>
        </a-list-item>
      </template>
    </a-list>
    <template v-slot:footer>
      <a-button type="primary" @click="testsync('single')">선택제휴사연동</a-button>
      <a-button type="primary" @click="closeResultPop('single')">확인</a-button>
    </template>
  </a-modal>

  <a-modal width="600px" :maskClosable="false" v-model:visible="marketSyncPop" title="제휴사연동결과" @ok="">
    <!--   marketSyncSuccess
marketSyncFailed
marketSyncTotal     <p v-for="( message ) in excelUploadResult">{{ message }}</p>-->
    <h3><b>총{{this.marketSyncTotal}}개 상품 / 성공 {{this.marketSyncSuccess}} / 실패 {{this.marketSyncFailed}}</b></h3>
    <a-list v-if="this.marketSyncResult.length > 0" :data-source="this.marketSyncResult">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card :title="item.market_account" style="width: 100%">
            <p v-for="( prd ) in item.products">{{ prd.prd_code }} - {{prd.result}}</p>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <template v-slot:footer>
      <a-button  type="primary" @click="searchFailed">실패상품검색</a-button>
      <a-button type="primary" @click="closeResultPop('multi')">확인</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'product',
};
</script>

<style scoped>

</style>