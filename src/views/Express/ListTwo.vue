<template>
	<div class="list-two-wrap fl-c fl-tc bg-F1F3F8">
    <a-flex align="center" gap="6" class="status-wrap fs14 p6 bg-white font-SCDream5">
      <div class="status-list fl-cc fl-c" v-for="v in state.statusList">
        <div>{{ v.name }}</div>
        <div class="mt5">{{v.num}}</div>
      </div>
      <div class="show-more br10 p10 fl-cc"><DownOutlined /></div>
      <QuestionCircleOutlined class="fs15 color-b9bdc9 ml2" />
      <div class="email-wrap fl-cc fl-c">
        <div class="fs12">사서함 번호</div>
        <div class="color-2755f9 fw pt5">#70203</div>
      </div>
    </a-flex>
    <a-flex class="rq-wrap mt12">
      <a-collapse accordion v-model:activeKey="state.collapseActiveKey" :bordered="false">
        <a-collapse-panel key="1" :showArrow="false">
          <template #header>
            <a-flex class="t-white fl-tc fl-lb">
              <div class="fs13">중국 통관일정</div>
              <div>매일 오전 10시에 갱신되며,  통관업체의 사정에 따라 지연될 수 있습니다.</div>
              <div class="rq-wrap-arrow bg-898F9E br50 fl-cc"><UpOutlined class="arrow fs12 t-white " :class="{'down':state.collapseActiveKey != 1}" /></div>
            </a-flex>
          </template>
          <a-flex wrap="wrap" class="rq-list-wrap fl-ts" gap="10">
            <div class="rq-list p16 bg-white" v-for="v in state.rqList">
              <a-flex class="rq-type fl-lb fl-tc font-SCDream6">
                <div class="fl-cc">
                  <div class="fs16">{{v.location}}</div>
                  <img src="@/assets/img/express/ship.png" class="ml5 mb4"/>
                  <div class="fs13 ml5 color-2755f9">{{v.type}}</div>
                </div>
                <div class="color-abb1be">{{v.rq}}({{v.week}})</div>
              </a-flex>
              <a-divider class="color-e4e7ec mtb10" />
              <a-flex vertical gap="6">
                <a-flex class="fl-lb fl-tc" v-if="v.rqRange">
                  <div class="fl-tc font-SCDream4">
                    <div class="color-2755f9 fs16">{{v.rqRange}}</div>
                    <div class="ml5 fs12 color-898f9e">입항</div>
                  </div>
                  <a-button class="fs12 br20 bg-2755f9 t-white">반입예정</a-button>
                </a-flex>
                <a-flex class="fl-lb fl-tc" v-if="v.rqRange2">
                  <span>{{v.rqRange2}}<span class="ml5">입항</span></span>
                  <a-button class="fs12 br20 bg-898F9E t-white">검사예정</a-button>
                </a-flex>
              </a-flex>
            </div>
          </a-flex>
          <div class="rq-footer w100 fl-le fl-tc mt12">
            <div class="color-e4e7ec">항공 또는 다른 국가는 배송일정표를 확인해주세요.</div>
            <a-button ghost class="ml10 br20">배송일정표</a-button>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-flex>
    <a-flex class="card-wrap fl-lb mt12 mb20">
      <a-flex vertical class="card-list bg-white p16 fl-lb">
        <a-flex class="fl-lb">
          <img src="@/assets/img/express/ship.png" class="avatar br50"/>
          <a-flex vertical class="fl-te">
            <div class="fs14 color-898f9e font-SCDream4">파트너사업자 회원</div>
            <div class="fs20 color-3F4249 font-SCDream6 mt5">강형민</div>
          </a-flex>
        </a-flex>
        <a-flex wrap="wrap" class="card-btn-wrap fs14 color-3F4249">
          <a-button type="default" shape="round">
            <template #icon>
              <SettingOutlined />
            </template>
            사용자설정
          </a-button>
          <a-button type="default" shape="round">
            <template #icon>
              <img src="@/assets/img/express/excel.png" class="mr6"/>
            </template>
            내역받기
          </a-button>
          <a-button type="default" shape="round" class="bg-535660 t-white">트래킹번호 입력</a-button>
          <a-button type="default" shape="round" class="bg-2755f9 t-white">신청서 작성하기</a-button>
        </a-flex>
      </a-flex>
      <a-flex vertical class="card-list bg-white p16 fl-lb">
        <a-tabs v-model:activeKey="state.tabActiveKey" class="w100">
          <a-tab-pane key="1" tab="내역보기">
            <a-flex vertical class="h40">
              <a-flex class="fl-lb fl-tc color-2755f9">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol.png" class="symbol mr6"/>
                  <span>예치금</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
            <a-flex vertical class="h40 mt10">
              <a-flex class="fl-lb fl-tc color-3F4249">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol2.png" class="symbol mr6"/>
                  <span>토스머니</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
          </a-tab-pane>
          <a-tab-pane key="2" tab="예치금 환불">
            <a-flex vertical class="h40">
              <a-flex class="fl-lb fl-tc color-2755f9">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol.png" class="symbol mr6"/>
                  <span>예치금</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
            <a-flex vertical class="h40 mt10">
              <a-flex class="fl-lb fl-tc color-3F4249">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol2.png" class="symbol mr6"/>
                  <span>토스머니</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
          </a-tab-pane>
          <a-tab-pane key="3" tab="예치금 충전">
            <a-flex vertical class="h40">
              <a-flex class="fl-lb fl-tc color-2755f9">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol.png" class="symbol mr6"/>
                  <span>예치금</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
            <a-flex vertical class="h40 mt10">
              <a-flex class="fl-lb fl-tc color-3F4249">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol2.png" class="symbol mr6"/>
                  <span>토스머니</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
          </a-tab-pane>
        </a-tabs>
      </a-flex>
      <a-flex vertical class="card-list bank-wrap p16 fl-lb">
        <img src="@/assets/img/express/bank-card.png" class="bank-card"/>
        <div class="fl-cc t-white fs15">현대카드 5115</div>
        <a-flex wrap="wrap" class="card-btn-wrap fs14">
          <a-button ghost shape="round" class="t-white">카드관리</a-button>
          <a-button ghost shape="round" class="t-white">카드추가</a-button>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-flex class="search-wrap bg-white fl-lb fl-tc">
      <a-flex class="search-left fl-tc" gap="5">
        <a-select
          v-model:value="state.search.location"
          :options="state.locationList"
        ></a-select>
        <a-divider type="vertical" class="mlr5" :style="{background:'#CFD2DA'}" />
        <a-date-picker v-model:value="state.search.rqStart" placeholder="시작일" class="rqStart"/>
        <span>~</span>
        <a-date-picker v-model:value="state.search.rqEnd" placeholder="종료일" class="rqEnd"/>
        <a-divider type="vertical" class="mlr5 bg-cfd2da" :style="{background:'#CFD2DA'}" />

        <a-input-group compact>
          <a-select v-model:value="state.search.searchKey">
            <a-select-option value="받는사람">받는사람</a-select-option>
            <a-select-option value="전화번호">전화번호</a-select-option>
            <a-select-option value="트래킹번호">트래킹번호</a-select-option>
            <a-select-option value="운송장번호">운송장번호</a-select-option>
            <a-select-option value="운송장번호">구매주문번호</a-select-option>
            <a-select-option value="운송장번호">신청서주문번호</a-select-option>
            <a-select-option value="운송장번호">상품명</a-select-option>
            <a-select-option value="운송장번호">쇼핑몰관리번호</a-select-option>
          </a-select>
          <a-input-search
            v-model:value="state.search.searchValue"
            style="width: 250px"
            placeholder="이름 첫 글자부터 입력"
          >
          <template #enterButton>
            <a-button>Custom</a-button>
          </template>
          </a-input-search>
        </a-input-group>
      </a-flex>
      <a-flex class="search-right fl-tc" gap="20">
        <div>
          <span>중량화물</span>
          <span><CheckOutlined /></span>
        </div>
        <a-select v-model:value="value3">
          <a-select-option value="Zhejiang">Zhejiang</a-select-option>
          <a-select-option value="Jiangsu">Jiangsu</a-select-option>
        </a-select>
        <a-select v-model:value="value3">
          <a-select-option value="Zhejiang">Zhejiang</a-select-option>
          <a-select-option value="Jiangsu">Jiangsu</a-select-option>
        </a-select>
      </a-flex>
    </a-flex>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from "vue";
import {DownOutlined,QuestionCircleOutlined,UpOutlined,SettingOutlined,CheckOutlined} from "@ant-design/icons-vue";

const state = reactive({
	statusList: [
    {name:'접수대기',num:0},
    {name:'접수신청',num:0},
    {name:'부분입고',num:0},
    {name:'오류입고',num:0},
    {name:'재포장',num:0},
    {name:'전체입고',num:0},
    {name:'출고확정',num:0},
    {name:'결제대기',num:0},
    {name:'결제완료',num:0},
    {name:'출고완료',num:0},
    {name:'배송완료',num:0},
  ],
  collapseActiveKey:'1',
  tabActiveKey:'1',
  rqList:[
    {
      location:'칭다오',
      type:'해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.29 ~ 7.1',
    },
    {
      location:'칭다오',
      type:'평택해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.28 ~ 6.29',
      rqRange2:'6.24',
    },
    {
      location:'칭다오',
      type:'자이언트해상',
      rq:'7.3',
      week:'수',
      rqRange:'6.28 ~ 6.29',
      rqRange2:'6.24',
    },
    {
      location:'광저우',
      type:'해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.28',
    },
    {
      location:'웨이하이',
      type:'해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.28',
    },
    {
      location:'B2B',
      type:'해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.28',
    }
  ],
  locationList:[
    {value:'토스토스 지점'},
    {value:'칭다오'},
    {value:'광저우'},
    {value:'웨이하이'},
    {value:'B2B'},
    {value:'오리건'},
    {value:'캘리포니아'},
    {value:'영국'},
    {value:'독일'},
    {value:'도쿄'},
    {value:'인천'},
    {value:'3PL'},
    {value:'지구별'},
  ],
  searchKeyList:[

  ],
  search: {
    location:'토스토스 지점',
    rqStart:'',
    rqEnd:'',
    searchKey:'',
    searchValue:'',
    weight:false,
    sort:'',
    pageSize:0,
  },
});
onMounted(()=>{
  $('.ant-layout-content').css({'margin':"0"});
})
onUnmounted(()=>{
  $('.ant-layout-content').css({'margin':"0 20px"});
})
</script>
<style>
.list-two-wrap .rq-wrap .ant-collapse{
  width: 100%;
}
.list-two-wrap .ant-collapse-content-box{
  padding: 10px 8px!important;
}
.list-two-wrap .ant-tabs-tab-btn{
  color: #3F4249!important;
}
.list-two-wrap .ant-tabs-tab-active .ant-tabs-tab-btn{
  color: #fff!important;
}
.list-two-wrap .ant-tabs-ink-bar{
  width: 0!important;
}
.list-two-wrap .ant-tabs-tab-active{
  background: #535660;
  border-radius: 30px;
  padding: 10px 16px;
}
.list-two-wrap .ant-tabs-nav{
  padding-bottom: 20px;
}
.list-two-wrap .rqStart .ant-picker-input,.list-two-wrap .rqEnd .ant-picker-input{
  width: 120px;
}
</style>
<style scoped>
.status-wrap{
  width: 1080px;
  height: 77px;
  border-radius: 0 0 16px 16px;
  border: 1px solid #E4E7EC;
  border-top: 0;
  padding: 6px;
  box-shadow: 3px 4px 4px 0 rgba(0,0,0,0.1);
}
.status-list{
  width: 74px;
  height: 65px;
}
.show-more{
  width: 76px;
  height: 44px;
  border: 1px solid #E4E7EC;
}
.email-wrap{
  width: 84px;
  height: 38px;
}
.rq-wrap{
  width: 1080px;
  gap: 10px;
  border-radius: 16px;
  background: #535660;
}
.rq-wrap-arrow{
  width: 24px;
  height: 24px;
}
.rq-wrap-arrow .arrow.down{
  transform: rotate(180deg);
}
.rq-list{
  width: 258px;
  border-radius: 16px;
}
.card-wrap{
  width: 1080px;
  height: 200px;
}
.card-list{
  width: 350px;
  height: 200px;
  border-radius: 16px;
}
.card-list .avatar{
  width: 50px;
  height: 50px;
}
.card-list .symbol{
  width: 19px;
  height: 19px;
}
.card-btn-wrap{
  gap: 10px;
}
.card-btn-wrap button{
  width: 150px;
  height: 40px;
}
.bank-wrap{
  background: linear-gradient(180deg, #25272C 0%, #31394B 100%);
}
.card-list .bank-card{
  width: 117px;
  height: 24px;
}
.search-wrap{
  width:100%;
  height: 80px;
  padding: 0 140px;
  box-shadow: 2px 4px 10px 0 rgba(0,0,0,0.1);
}
</style>
