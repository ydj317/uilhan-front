<template>
	<div class="express-wrap p30">
    <a-flex class="mb60">
      <span class="fs30 mr40 color-f8f100 font-SCDream5">유일 배송대행지</span>
      <span class="fs30 fw font-SCDream4">셀러들의 선택, 정확한 AI배송대행지</span>
    </a-flex>
    <a-flex class="mb30 color-4f0ae7 br20 p8 pl20 bg-fafafa">
      <span class="fs12 font-SCDream5 mr80"><InfoCircleFilled class="mr10" />유일 배송대행지 이벤트 진행중</span>
      <span class="fs11 font-SCDream4">
        <span class="mr10">1,배송대행 VIP 등업</span>
        <span>2.상품포장 내 에어캡 비용 무료</span>
      </span>
    </a-flex>
		<a-flex justify="space-between">
			<a-col class="ptb26 pl45 pr45 br5 w24 bg-f8f100">
				<a-flex vertical>
					<a-flex justify="space-between">
						<span class="fw fs16 font-SCDream6">배송대행 신청서</span>
						<span class="fs12 color-ff6700 font-SCDream5">신청서 가이드라인</span>
					</a-flex>
					<a-button type="ghost" class="h50 font-SCDream5 fs12 bor-black mt25">신청서 작성하기</a-button>
				</a-flex>
			</a-col>
			<a-col class="ptb26 pl45 pr45 br5 w24 bg-ff6700">
				<a-flex vertical>
					<a-flex justify="space-between">
						<span class="fw fs16 font-SCDream6 t-white">나의 출고지 주소</span>
					</a-flex>
					<a-button type="ghost" class="h50 t-white fs12 font-SCDream5 bor-fafafa mt25">신청서 작성하기</a-button>
				</a-flex>
			</a-col>
      <a-col class="ptb26 pl45 pr45 br5 w24 bg-f8f100">
        <a-flex vertical>
          <a-flex justify="space-between">
            <span class="fw fs16 font-SCDream6">배대지 비용 / 분실상품 찾기</span>
          </a-flex>
          <a-flex justify="space-between" class="mt25">
            <a-button type="ghost" class="h50 font-SCDream5 fs12 bor-black plr30">비용 확인하기</a-button>
            <a-button type="ghost" class="h50 font-SCDream5 fs12 bor-black plr30">분실상품 찾기</a-button>
          </a-flex>
        </a-flex>
      </a-col>
			<a-col class="bor ptb26 pl45 pr45 br5 w24">
				<a-flex vertical>
					<a-flex justify="space-between">
						<span class="fw fs16 font-SCDream5">배대지 공지사항</span>
						<span class="red cp fs14 font-SCDream4">more</span>
					</a-flex>
					<a-flex vertical class="mt25 font-SCDream5 fs12">
						<span class="mb14">
              <span class="notice-title br20 plr7 mr5">중요</span>
              배송지연안내
            </span>
						<span>
              <span class="notice-title br20 plr7 mr5">중요</span>
              송장번호 오류안내
            </span>
					</a-flex>
				</a-flex>
			</a-col>
		</a-flex>
    <a-divider class="bg-hui"/>
    <a-flex vertical class="total-main bg-fafafa br10 p10 pl10 pr10 pb30">
      <a-flex class="toggle-wrap center fl1 fs14 mr10 br5 ptb10 bg-434343 color-fefefe h52">
        <template v-for="v in state.totalList">
          <template v-if="v.type == 1">
            <template v-if="state.auth" >
              <a-input class="font-SCDream6 fs14 mr70 color-fefefe" v-model:value="v.title" @blur="setTotalData(v)"></a-input>
            </template>
            <template v-else>
              <span class="font-SCDream6 fs14 mr10 mr70">{{ v.title }}</span>
            </template>
            <a-divider type="vertical" class="bg-white mr30"/>
            <template v-if="state.auth">
              <a-input class="font-SCDream6 fs14 mr10 color-fefefe" v-model:value="v.rq2" @blur="setTotalData(v)"></a-input>
            </template>
            <template v-else>
              <span class="font-SCDream6 fs14 mr10">{{ v.rq2 }}</span>
            </template>
            <span class="font-SCDream4 fs10 br15 mr30 p5 bg-f8f100 t-black">반입예정</span>
            <a-divider type="vertical" class="bg-white mr30"/>
            <template v-if="state.auth">
              <a-input class="font-SCDream6 fs14 mr10 color-fefefe" v-model:value="v.rq1" @blur="setTotalData(v)"></a-input>
            </template>
            <template v-else>
              <span class="font-SCDream6 fs14 mr10">{{ v.rq1 }}</span>
            </template>
            <span class="font-SCDream4 fs10 br15 p5 bg-4f0ae7 t-white">검사예정</span>
            <a-flex class="toggle-btn cp">
              <div @click="toggleTotal">통관일정 자세히&nbsp;∨</div>
            </a-flex>
          </template>
        </template>
      </a-flex>
      <transition name="fade">
        <a-flex class="mt30 pl40 pr30" justify="space-between" v-show="state.toggleTotalActive">
          <template v-for="v in state.totalList" :key="v.id">
            <template v-if="v.type == 2">
              <a-flex vertical class="total-wrap bg-white br10 pt20 pb20 pl40 pr40 w20">
                <template v-if="state.auth">
                  <a-input class="font-SCDream6 fs18 t-c w100" v-model:value="v.title" @blur="setTotalData(v)"></a-input>
                </template>
                <template v-else>
                  <div class="font-SCDream6 fs18 t-c">{{ v.title }}</div>
                </template>
                <!--            <div class="font-SCDream4 fs9 color-hui mt5 t-c">2024.04.08 업데이트 기준</div>-->
                <a-flex align="center" justify="space-between" class="fs14 mt20">
                  <div class="fl1">
                    <template v-if="state.auth">
                      <a-input class="font-SCDream6 w60" v-model:value="v.rq2" @blur="setTotalData(v)"></a-input>
                    </template>
                    <template v-else>
                      <span class="font-SCDream6">{{ v.rq2 }}</span>
                    </template>
                    <span class="font-SCDream4 color-hui ml5">입항 건</span>
                  </div>
                  <div class="font-SCDream4 fs10 br15 p5 bg-f8f100 t-black t-c w30">반입예정</div>
                </a-flex>
                <a-flex align="center" justify="space-between" class="fs14 mt5">
                  <div class="fl1">
                    <template v-if="state.auth">
                      <a-input class="font-SCDream6 color-4f0ae7 w60" v-model:value="v.rq1" @blur="setTotalData(v)"></a-input>
                    </template>
                    <template v-else>
                      <span class="font-SCDream6 color-4f0ae7">{{ v.rq1 }}</span>
                    </template>
                    <span class="font-SCDream4 color-hui ml5">입항 건</span>
                  </div>
                  <div class="font-SCDream4 fs10 br15 p5 bg-4f0ae7 t-white t-c w30">검사예정</div>
                </a-flex>
              </a-flex>
            </template>
          </template>
          <template v-for="v in state.totalList" :key="v.id">
            <template v-if="v.type == 3">
              <a-flex vertical class="total-wrap bg-white br10 pt20 pb20 pl40 pr40 w20">
                <template v-if="state.auth">
                  <a-input class="font-SCDream6 fs18 t-c w100" v-model:value="v.title" @blur="setTotalData(v)"></a-input>
                </template>
                <template v-else>
                  <div class="font-SCDream6 fs18 t-c">{{ v.title }}</div>
                </template>
                <!--            <div class="font-SCDream4 fs9 color-hui mt5 t-c">2024.04.08 업데이트 기준</div>-->
                <a-flex align="center" justify="space-between" class="fs14 mt20">
                  <div class="fl1">
                    <template v-if="state.auth">
                      <a-input class="font-SCDream6 w60" v-model:value="v.rq1" @blur="setTotalData(v)"></a-input>
                    </template>
                    <template v-else>
                      <span class="font-SCDream6">{{ v.rq1 }}</span>
                    </template>
                    <span class="font-SCDream4 color-hui ml5">입항 건</span>
                  </div>
                  <div class="font-SCDream4 fs10 br15 p5 bg-ff6700 t-white t-c w30">오픈예정</div>
                </a-flex>
              </a-flex>
            </template>
          </template>
          <a-flex vertical class="pt20 pb20 pl40 pr40 font-SCDream5 fs10 color-ff6700 center ">
            <span>*</span>
            <span>통관일정은 <span style="text-decoration: underline;">매일 오전 10시</span>에 업데이트되며</span>
            <span>통관업체의 사정에 따라 지연될 수 있습니다.</span>
          </a-flex>
        </a-flex>
      </transition>
    </a-flex>
    <a-flex vertical class="bg-fafafa br10 p30 mb40 mt30">
        <a-flex vertical>
          <a-space>
            <span class="fs14 font-SCDream5">배송현황</span>
            <span><img src="@/assets/img/car.png" class="mr10 color-hui" /></span>
          </a-space>
          <a-flex wrap="wrap" class="mt15 tab-wrap">
            <div v-for="(v,k) in state.tabs.send.tab" :class="{active:k == state.tabs.send.active}" @click="tabToggle('send',k)">
              <span class="fs12 font-SCDream5">{{ v.text }}</span>
              <span class="fs12 font-SCDream6 color-4f0ae7">{{ v.number }}건</span>
            </div>
          </a-flex>
        </a-flex>
      <a-divider class="bg-hui"/>
      <a-flex>
        <a-flex vertical>
          <a-space>
            <span class="fs14 font-SCDream5">오류현황</span>
            <span><ExclamationCircleOutlined class="mr10 color-hui" /></span>
          </a-space>
          <a-flex wrap="wrap" class="mt15 tab-wrap tab-wrap2">
            <div v-for="(v,k) in state.tabs.error.tab" :class="{active:k == state.tabs.error.active}" @click="tabToggle('error',k)">
              <span class="fs12 font-SCDream5">{{ v.text }}</span>
              <span class="fs12 font-SCDream6 color-ff6700">{{ v.number }}건</span>
            </div>
          </a-flex>
        </a-flex>
        <a-flex vertical>
          <a-space>
            <span class="fs14 font-SCDream5">반품현황</span>
            <span><img src="@/assets/img/reset.png" class="mr10 color-hui" /></span>
          </a-space>
          <a-flex wrap="wrap" class="mt15 tab-wrap tab-wrap2">
            <div v-for="(v,k) in state.tabs.back.tab" :class="{active:k == state.tabs.back.active}" @click="tabToggle('back',k)">
              <span class="fs12 font-SCDream5">{{ v.text }}</span>
              <span class="fs12 font-SCDream6 color-ff6700">{{ v.number }}건</span>
            </div>
          </a-flex>
        </a-flex>
      </a-flex>
    </a-flex>

<!--		<a-flex class="ml50">-->
<!--			<div class="fw fs18 mr80">배송대행</div>-->
<!--			<a-flex wrap="wrap" class="w50">-->
<!--				<a-space class="mr20 mb20">-->
<!--					<span>접수대기</span>-->
<!--					<a-badge count="85" class="default" :class="{'blue':true}"/>-->
<!--					<span>접수신청</span>-->
<!--					<a-badge count="85" class="default" :class="{'blue':true}"/>-->
<!--					<a @click="searchByStatus" :style="{ color: state.selectStatus === '입고완료' ? 'blue' : 'inherit' }">-->
<!--						입고완료-->
<!--					</a>-->
<!--					<a-badge :count="bridgeCount('입고완료')" class="default" :class="{'blue':true}"/>-->
<!--					<span>결제대기</span>-->
<!--					<a-badge count="84" class="default" :class="{'blue':true}"/>-->
<!--					<span>결제완료</span>-->
<!--					<a-badge count="85" class="default" :class="{'blue':true}"/>-->
<!--					<span>출고준비</span>-->
<!--					<a-badge count="85" class="default" :class="{'blue':true}"/>-->
<!--					<span>출고대기</span>-->
<!--					<a-badge count="85" class="default" :class="{'blue':true}"/>-->
<!--					<span>출고완료</span>-->
<!--					<a-badge count="85" class="default" :class="{'blue':true}"/>-->
<!--					<span>통관중</span>-->
<!--					<a-badge count="85" class="default" :class="{'blue':true}"/>-->
<!--					<span>국내도착</span>-->
<!--					<a-badge count="85" class="default" :class="{'blue':true}"/>-->
<!--					<span>배송완료</span>-->
<!--					<a-badge count="1" class="default"/>-->
<!--				</a-space>-->
<!--			</a-flex>-->
<!--		</a-flex>-->
<!--		<a-divider class="mt0" />-->
<!--		<a-flex class="ml50">-->
<!--			<div class="fw fs18 mr80">오류현황</div>-->
<!--			<a-flex wrap="wrap" class="w50">-->
<!--				<a-space class="mr20 mb20">-->
<!--					<a @click="searchByStatus" :style="{ color: state.selectStatus === '노데이터' ? 'blue' : 'inherit' }">-->
<!--						노데이터-->
<!--					</a>-->
<!--					<a-badge :count="bridgeCount('노데이터')" class="default" :class="{ 'orange': state.selectStatus === '노데이터'}"/>-->
<!--					<a @click="searchByStatus" :style="{ color: state.selectStatus === '결제대기' ? 'blue' : 'inherit' }">-->
<!--						결제대기-->
<!--					</a>-->
<!--					<a-badge count="85" class="default" :class="{ 'orange': state.selectStatus === '결제대기'}"/>-->
<!--				</a-space>-->
<!--			</a-flex>-->
<!--		</a-flex>-->
<!--		<a-flex class="ml50 mt10">-->
<!--			<div class="fw fs18 mr80">반품관리</div>-->
<!--			<a-flex wrap="wrap" class="w50">-->
<!--				<a-space class="mr20 mb20">-->
<!--					<span>반품신청</span>-->
<!--					<a-badge count="85" class="default" :class="{'red':true}"/>-->
<!--					<span>반품준비</span>-->
<!--					<a-badge count="85" class="default" :class="{'red':true}"/>-->
<!--					<span>통관실패</span>-->
<!--					<a-badge count="85" class="default" :class="{'red':true}"/>-->
<!--					<span>접수취소</span>-->
<!--					<a-badge count="85" class="default" :class="{'red':true}"/>-->
<!--					<span>반품배송</span>-->
<!--					<a-badge count="85" class="default" :class="{'red':true}"/>-->
<!--				</a-space>-->
<!--			</a-flex>-->
<!--		</a-flex>-->
<!--		<a-divider class="mt0" />-->
		<a-flex class="search-wrap" justify="space-between">
			<a-flex justify="space-between" align="center" class="mb20">
        <div class="fw fs16 font-SCDream5 mr30">배송대행 신청 내역</div>
        <a-button type="primary" class="fs14 font-SCDream6" @click="state.modal.open = true">필터</a-button>
			</a-flex>
      <a-input-search
          class="search-btn"
          placeholder="검색어를 입력해 주세요."
          enter-button="검색"
          @search="searchKeyword"
          v-model:value="state.searchParams.keyword"
      />
		</a-flex>
		<a-divider class="mt0 bottom-border" />
		<a-spin size="large" :spinning="state.listLoading">
			<div class="list-wrap">
				<a-flex class="header-wrap w100 font-SCDream6">
					<template v-for="v in state.header">
						<div class="fw">{{v}}</div>
					</template>
				</a-flex>
				<a-divider/>
				<a-flex
					wrap="wrap"
					class="content-wrap bor br5 mb20"
					v-for="(order, key) in state.bridgeList"
					:key="key"
				>
					<a-flex class="header color-lan w100 font-SCDream5 fs14">
						<div class="w10 text-center">{{ order['id'] ?? '' }}</div>
						<div class="w10 text-center">{{ order['bridgeOrderId'] ?? '' }}</div>
						<div class="w20 text-center">{{ order['ins_date'] ?? '' }}</div>
					</a-flex>
					<a-flex class="content w100" align="center" v-for="(item, index) in order['items']" :key="index">
						<div><img :src="item['prdImage']" class="br5"/></div>
						<a-flex vertical style="text-align: left">
							<div class="mb10 fs14 font-SCDream5">{{ item['prdName'] ?? '' }}</div>
							<div class="fs10 font-SCDream4">{{ item['prdOptionName'] ?? '' }}</div>
						</a-flex>
						<div class="fs14 font-SCDream4">{{ item['quantity'] ?? 0 }}</div>
						<div class="fs14 font-SCDream4">{{ item['invoiceNumber'] ?? ''}}</div>
						<template v-if="index === 0">
							<div class="fs14 font-SCDream4">{{ order['bridgeOrderStatus'] ?? '' }}</div>
							<div class="fs14 font-SCDream4">{{ order['isPaid'] === 1 ? '결제완료' : '입금대기'}}</div>
							<div class="fs14 font-SCDream4">{{ order['ctr_seq'] ?? '' }}</div>
							<div class="fs14 font-SCDream4">{{ order['fee'] ?? 0 }}원</div>
							<div class="fs14 font-SCDream4">{{ order['receiverName'] ?? '' }}</div>
						</template>
					</a-flex>
				</a-flex>
			</div>
		</a-spin>
		<a-pagination
			class="w100 fl-cc mt15 font-SCDream4"
			v-model:current="state.searchParams.page"
			v-model:page-size="state.searchParams.pageSize"
			@change="onPageChange"
			:total="state.total"
			:show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
		/>
		<a-modal
			v-model:open="state.modal.open"
			:closable="false"
			cancelText="취소"
			okText="주문검색"
			width="560px"
			class="modal-wrap"
			@ok="searchBridgeOrderByFilter"
		>
			<template #title>
				<a-flex align="center" justify="space-between">
					<div class="fw fs16">배송대행 검색 필터</div>
					<a-button class="reset plr30" @click="initSearchParams">초기화</a-button>
				</a-flex>
			</template>
			<a-flex vertical class="mt30">
				<div><strong>검색기간</strong></div>
				<a-form-item name="date" class="mt10 mb10">
					<a-range-picker class="w100" :value="dateValue" @change="onChangeDatePicker"/>
				</a-form-item>
			</a-flex>
			<a-flex class="date-wrap bor br5" align="center" justify="center">
				<a-button ghost @click="all">전체기간</a-button>
				<a-divider type="vertical"/>
				<a-button ghost @click="today">오늘</a-button>
				<a-divider type="vertical"/>
				<a-button ghost @click="selectRange(1, 'week')">일주일</a-button>
				<a-divider type="vertical"/>
				<a-button ghost @click="selectRange(1, 'months')">1개월</a-button>
				<a-divider type="vertical"/>
				<a-button ghost @click="selectRange(3, 'months')">3개월</a-button>
			</a-flex>
			<a-flex vertical class="mt20">
				<div><strong>주문번호</strong></div>
				<a-form-item name="date" class="mt10 mb10">
					<a-input
						class="w100"
						placeholder="쇼핑몰 주문번호를 입력하세요."
						v-model:value="state.searchParams.order_id"
					/>
				</a-form-item>
			</a-flex>
			<a-flex vertical class="mt10">
				<div><strong>수취인</strong></div>
				<a-form-item name="date" class="mt10 mb10">
					<a-input
						class="w100"
						placeholder="수취인 이름을 입력하세요."
						v-model:value="state.searchParams.receiver_name"
					/>
				</a-form-item>
			</a-flex>
			<a-flex vertical class="mt10">
				<div><strong>트래킹번호</strong></div>
				<a-form-item name="date" class="mt10 mb10">
					<a-input
						class="w100"
						placeholder="중국 트래킹 번호를 입력하세요."
						v-model:value="state.searchParams.invoiceNumber"
					/>
				</a-form-item>
			</a-flex>
			<a-flex vertical class="mt10">
				<div><strong>운송장번호</strong></div>
				<a-form-item name="date" class="mt10 mb10">
					<a-input
						class="w100"
						placeholder="운송장번호를 입력하세요."
						v-model:value="state.searchParams.bridge_order_id"
					/>
				</a-form-item>
			</a-flex>
		</a-modal>
	</div>
</template>

<script setup>
import {computed, onMounted, reactive, watch} from "vue";
import {message} from "ant-design-vue";
import {useBridgeApi} from "@/api/bridge";
import moment from "moment";
import { InfoCircleFilled,ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {useExpressApi} from "@/api/express";
import {useMarketOrderApi} from "@/api/order";

const state = reactive({
	header: ['No','상품정보','수량','트래킹번호','주문상태','결제상태','운송방식','배송대행료','수취인'],
	bridgeList: [],
	total: 0,
	listLoading: false,
	searchParams: {
		page: 1,
		pageSize: 10,
		keyword: '',
		bridge_order_id: '',
		receiver_name: '',
		order_id: '',
		invoiceNumber: '',
		start_time: '',
		end_time: '',
		bridge_order_status: '',
	},
	selectStatus: '',
	modal: {
		open:false
	},
  tabs:{
      send:{
        tab:[
          {text:'접수대기',number:1},
          {text:'접수신청',number:1},
          {text:'입고완료',number:0},
          {text:'결제대기',number:1},
          {text:'결제완료',number:0},
          {text:'출고준비',number:0},
          {text:'출고대기',number:1},
          {text:'출고완료',number:1},
          {text:'통관중',number:1},
          {text:'국내도착',number:1},
          {text:'배송완료',number:0},
        ],
        active:0
      },
    error:{
        tab:[
          {text:'노데이터',number:1},
          {text:'결제대기',number:1},
        ],
        active:0
    },
    back:{
        tab:[
          {text:'반품신청',number:0},
          {text:'반품준비',number:1},
          {text:'통관실패',number:0},
          {text:'접수취소',number:0},
          {text:'반품배송',number:1},
        ],
        active:0
    },
  },
  toggleTotalActive:true,
  auth:true,
  totalList:[
    {id:0,type:1,title:'위해2  해운',rq1:'3.29 입항 건',rq2:'4.1 - 4.2 입항 건',upd_date:'2024.04.08'},
    {id:0,type:2,title:'인천1  해운',rq1:'3.29',rq2:'4.1 - 4.2',upd_date:'2024.04.08'},
    {id:0,type:2,title:'인천2  해운',rq1:'4.3',rq2:'4.4',upd_date:'2024.04.08'},
    {id:0,type:2,title:'평택  해운',rq1:'4.3',rq2:'4.4',upd_date:'2024.04.08'},
    {id:0,type:3,title:'평택  해운',rq1:'4.4',upd_date:'2024.04.08'},
  ]
});

const dateValue = computed( () => {
	return (!state.searchParams.start_time && !state.searchParams.end_time) ? null : [moment(state.searchParams.start_time), moment(state.searchParams.end_time)]
})

const onChangeDatePicker = (value, dateString) => {
	state.searchParams.start_time = dateString[0];
	state.searchParams.end_time = dateString[1];
};

const all = () => {
	onChangeDatePicker(null, ['', ''])
};

const today = () => {
	const today = moment().format('YYYY-MM-DD')
	onChangeDatePicker(null, [today, today])
};

const selectRange = (val, type) => {
	const end = moment()
	const start = moment().subtract(val, type)
	onChangeDatePicker(null, [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')])
}

const searchBridgeOrderByFilter = () => {
	state.searchParams.page = 1;
	state.searchParams.pageSize = 10;

	state.modal.open = false;

	getBridgeList();
}

const initSearchParams = () => {
	state.searchParams.keyword = '';
	state.searchParams.bridge_order_status = '';
    state.searchParams.bridge_order_id = '';
    state.searchParams.receiver_name = '';
    state.searchParams.order_id = '';
    state.searchParams.invoiceNumber = '';
    state.searchParams.start_time = '';
    state.searchParams.end_time = '';
}

const onPageChange = (page, pageSize) => {
	state.searchParams.page = page;
	state.searchParams.pageSize = pageSize;
	getBridgeList();
};

const filterParams = () => {

	state.searchParams.page = Number(state.searchParams.page);
	state.searchParams.pageSize = Number(state.searchParams.pageSize);

	return state.searchParams;
}

const searchKeyword = () => {
    state.searchParams.page = 1;
    getBridgeList();
}

const searchByStatus = (event) => {
	state.searchParams.page = 1;
	state.selectStatus = event.target.innerText;
	state.searchParams.bridge_order_status = event.target.innerText;
	getBridgeList();
}

const bridgeCount = (status) => {
	const statusOrderList = state.bridgeList.filter(item => item['bridgeOrderStatus'] === status);

	return statusOrderList.length ?? 0;
}

async function getBridgeList(params = {}) {
	params = filterParams(params);

	state.listLoading = true;
	await useBridgeApi().getBridgeOrderList({...params}).then((res) => {
		if (res.status !== "2000") {
			state.listLoading = false
			throw new Error("배송대행지 주문을 가져올수 없습니다. 다시 한번 시도 부탁드립니다.");
		}

		state.bridgeList = res.data.list;
		state.total = res.data.total;

	}).catch((e) => {
		message.error(e.message);
		return false;
	}).finally(() => {
		state.listLoading = false;
	});
}
const  tabToggle = (type,k) =>{
  state.tabs[type].active = k;
}
const toggleTotal = ()=>{
  state.toggleTotalActive = !state.toggleTotalActive;
}
const getTotalData = () =>{
  useExpressApi().getExpressList({
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.totalList = res.data;
  }).finally(() => {
  });
}
const setTotalData = (v) =>{
  useExpressApi().save({
    data:v
  }).then(res => {
    if (res.status !== "2000") {
      message.error(res.data.message);
      return false;
    }
    // message.success(res.message);
  }).finally(() => {
  });
}
watch(() => state.modal.open, () => {
	// 处理 open 属性的变化
	initSearchParams()
});

onMounted(() => {
	Promise.all([
		getBridgeList(),
    getTotalData(),
	]);
})

</script>

<style>
.express-wrap .default .ant-badge-count{
	background: #F6F6F6;
	color: #9F9F9F;
	padding: 0 12px;
}
.express-wrap .blue .ant-badge-count{
	background: #2270E3;
	color: white;
}
.express-wrap .orange .ant-badge-count{
	background: #FB6F3E;
	color: white;
}
.express-wrap .red .ant-badge-count{
	background: #F9433F;
	color: white;
}
.express-wrap .search-wrap .ant-input-search{
	width: 300px!important;
}
.express-wrap .search-btn span{
  font-family: SCDream6;
}
.express-wrap .total-main .ant-input{
  background: none;
  width: 10%;
}
.modal-wrap .ant-btn.reset{
	background: #2270E3;
	color: white;
}
.modal-wrap .ant-modal-content{
	padding: 30px 50px;
}
.modal-wrap .ant-picker-input{
	height: 34px;
}
.modal-wrap .date-wrap .ant-divider{
	background: #FEEA91;
}
.modal-wrap .date-wrap .ant-btn-background-ghost{
	color: black;
}
.modal-wrap .ant-modal-footer{
	margin-top: 40px;
}
</style>
<style scoped>
@font-face {
  font-family: 'SCDream1';
  src: url('../../assets/font/SCDream1.woff');
}
@font-face {
  font-family: 'SCDream2';
  src: url('../../assets/font/SCDream2.woff');
}
@font-face {
  font-family: 'SCDream3';
  src: url('../../assets/font/SCDream3.woff');
}
@font-face {
  font-family: 'SCDream4';
  src: url('../../assets/font/SCDream4.woff');
}
@font-face {
  font-family: 'SCDream5';
  src: url('../../assets/font/SCDream5.woff');
}
@font-face {
  font-family: 'SCDream6';
  src: url('../../assets/font/SCDream6.woff');
}
@font-face {
  font-family: 'SCDream7';
  src: url('../../assets/font/SCDream7.woff');
}
@font-face {
  font-family: 'SCDream8';
  src: url('../../assets/font/SCDream8.woff');
}
@font-face {
  font-family: 'SCDream9';
  src: url('../../assets/font/SCDream9.woff');
}
.font-SCDream1{
  font-family: 'SCDream1';
}
.font-SCDream2{
  font-family: 'SCDream2';
}
.font-SCDream3{
  font-family: 'SCDream3';
}
.font-SCDream4{
  font-family: 'SCDream4';
}
.font-SCDream5{
  font-family: 'SCDream5';
}
.font-SCDream6{
  font-family: 'SCDream6';
}
.font-SCDream7{
  font-family: 'SCDream7';
}
.font-SCDream8{
  font-family: 'SCDream8';
}
.font-SCDream9{
  font-family: 'SCDream9';
}
.bor{
	border: 1px solid #F0F0F0;
}
.bor-black{
  border: 1px solid black;
}
.bor-fafafa{
  border: 1px solid #fafafa;
}
.bottom-border{
	height: 2px;
	background: black;
}
.color-huang{
	color: #FFDB40;
}
.color-hui{
	color: #B8B8B8;
}
.color-lan{
	color: #2071E4;
}
.color-f8f100{
  color: #f8f100;
}
.color-4f0ae7{
  color: #4f0ae7;
}
.color-ff6700{
  color: #ff6700;
}
.color-fefefe{
  color: #fefefe;
}
.bg-hui{
	background: #F0F0F0;
}
.bg-f8f100{
  background: #f8f100;
}
.bg-4f0ae7{
  background: #4f0ae7;
}
.bg-ff6700{
  background: #ff6700;
}
.bg-434343{
  background: #434343;
}
.bg-fafafa{
  background: #fafafa;
}
.he100{
	height: 100%;
}
.header-wrap > div,.content > div{
	text-align: center;
}
.header-wrap > div:nth-of-type(1),.header-wrap > div:nth-of-type(4),.header-wrap > div:nth-of-type(5),.header-wrap > div:nth-of-type(6),.header-wrap > div:nth-of-type(7),.header-wrap > div:nth-of-type(8),.header-wrap > div:nth-of-type(9),.content > div:nth-of-type(1),.content > div:nth-of-type(4),.content > div:nth-of-type(5),.content > div:nth-of-type(6),.content > div:nth-of-type(7),.content > div:nth-of-type(8),.content > div:nth-of-type(9){
	width: 10%;
}
.header-wrap > div:nth-of-type(2),.content > div:nth-of-type(2){
	width: 25%;
}
.header-wrap > div:nth-of-type(3),.content > div:nth-of-type(3){
	width: 5%;
}
.content-wrap .header{
	background: #FAFAFA;
	height: 40px;
	padding: 10px 0;
}
.content-wrap .content{
	padding: 10px 0;
}
.content-wrap .content img{
	width: 70px;
	height: 70px;
}
.content-wrap .content:not(:last-child){
	position: relative;
}
.content-wrap .content:not(:last-child):before{
	position: absolute;
	content: '';
	left: 0;
	bottom: 0;
	width: 50%;
	background: #F2F2F2;
	height: 1px;
}
.modal-wrap input{
	height: 40px;
}
.modal-wrap .date-wrap{
	height: 40px;
}
a {
	color: black;
}
.notice-title{
  color: #ff2828;
  border: 1px solid #ff2828;
}
.tab-wrap > div{
  width: 120px;
  height: 46px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background: #fff;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin:0 8px 8px 0;
  cursor: pointer;
}
.tab-wrap > div.active{
  border: 1px solid #4f0ae7;
}
.tab-wrap2 > div.active{
  border: 1px solid #ff6700;
}
.toggle-wrap{
  position: relative;
}
.toggle-wrap .toggle-btn{
  position: absolute;
  content: '';
  right: 10px;
  top: 18px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.total-wrap{
  box-shadow: 6px 6px 6px #B8B8B8;
}
</style>
