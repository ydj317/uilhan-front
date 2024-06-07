<template>
	<div class="express-wrap p30">
    <a-flex class="mb60">
      <span class="fs30 mr40 color-FEDB41 font-SCDream5">유일 배송대행지</span>
      <span class="fs30 fw font-SCDream4">셀러들의 선택, 정확한 AI배송대행지</span>
    </a-flex>
    <a-flex class="mb30 color-2171E2 br20 p8 pl20 bg-fafafa">
      <span class="fs12 font-SCDream5 mr80"><InfoCircleFilled class="mr10" />유일 배송대행지 이벤트 진행중</span>
      <span class="fs11 font-SCDream4">
        <span class="mr10">1,배송대행 VIP 등업</span>
        <span>2.상품포장 내 에어캡 비용 무료</span>
      </span>
    </a-flex>
		<a-flex justify="space-between" class="board-wrap">
			<a-col class="ptb26 pl45 pr45 br5 w24 bg-FEDB41">
				<a-flex vertical>
					<a-flex justify="space-between">
						<span class="fw fs16 font-SCDream6">배송대행 신청서</span>
						<a-button class="fs12 color-FB6F3E font-SCDream5 more" href="https://zh8g.com/Front/Page/UserPage.asp?gMnu1=202&gMnu2=20210" target="_blank">신청서 가이드라인</a-button>
					</a-flex>
					<a-button type="ghost" class="h50 font-SCDream5 fs12 bor-black mt25" href="https://zh8g.com/Front/Acting/Acting_W.asp?gMnu1=202&gMnu2=20202" target="_blank">신청서 작성하기</a-button>
				</a-flex>
			</a-col>
			<a-col class="ptb26 pl45 pr45 br5 w24 bg-FB6F3E">
				<a-flex vertical>
					<a-flex justify="space-between">
						<span class="fw fs16 font-SCDream6 t-white">나의 출고지 주소</span>
					</a-flex>
					<a-button type="ghost" class="h50 t-white fs12 font-SCDream5 bor-fafafa mt25" href="https://zh8g.com/library/html/PopAdd.asp?CTR_SEQ=1" target="_blank">나의 중국 출고지 주소</a-button>
				</a-flex>
			</a-col>
      <a-col class="ptb26 pl45 pr45 br5 w24 bg-FEDB41">
        <a-flex vertical>
          <a-flex justify="space-between">
            <span class="fw fs16 font-SCDream6">배대지 비용 / 분실상품 찾기</span>
          </a-flex>
          <a-flex justify="space-between" class="mt25">
            <a-button type="ghost" class="h50 font-SCDream5 fs12 bor-black fl1 mr10" href="https://www.zh8g.com/Front/Introduction/DlvrMny.asp?gMnu1=201&gMnu2=20107" target="_blank">비용 확인하기</a-button>
            <a-button type="ghost" class="h50 font-SCDream5 fs12 bor-black fl1" href="https://www.zh8g.com/Front/Acting/NoData_S.asp?gMnu1=205&gMnu2=20512" target="_blank">분실상품 찾기</a-button>
          </a-flex>
        </a-flex>
      </a-col>
			<a-col class="bor ptb26 pl45 pr45 br5 w24">
				<a-flex vertical>
					<a-flex justify="space-between">
						<span class="fw fs16 font-SCDream5">배대지 공지사항</span>
						<a-button class="color-FB6F3E cp fs14 font-SCDream4 more" href="https://www.zh8g.com/Front/Board/Bbs_S.asp?gMnu1=205&gMnu2=20501&sBB_CODE=1" target="_blank">more</a-button>
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
            <span class="font-SCDream4 fs10 br15 mr30 p5 bg-FEDB41 t-black">반입예정</span>
            <a-divider type="vertical" class="bg-white mr30"/>
            <template v-if="state.auth">
              <a-input class="font-SCDream6 fs14 mr10 color-fefefe" v-model:value="v.rq1" @blur="setTotalData(v)"></a-input>
            </template>
            <template v-else>
              <span class="font-SCDream6 fs14 mr10">{{ v.rq1 }}</span>
            </template>
            <span class="font-SCDream4 fs10 br15 p5 bg-2171E2 t-white">검사예정</span>
            <a-flex class="toggle-btn cp">
              <div @click="toggleTotal">통관일정 자세히&nbsp;∨</div>
            </a-flex>
          </template>
        </template>
      </a-flex>
      <transition name="fade">
        <a-flex class="mt30 pl40 pr30" gap="20" justify="space-between" v-show="state.toggleTotalActive">
          <template v-for="v in state.totalList" :key="v.id">
            <template v-if="v.type == 2">
              <a-flex vertical class="total-wrap bg-white br10 p20 fl1">
                <template v-if="state.auth">
                  <a-input class="font-SCDream6 fs18 t-c w100" v-model:value="v.title" @blur="setTotalData(v)"></a-input>
                </template>
                <template v-else>
                  <div class="font-SCDream6 fs18 t-c">{{ v.title }}</div>
                </template>
                <!--            <div class="font-SCDream4 fs9 color-hui mt5 t-c">2024.04.08 업데이트 기준</div>-->
                <a-flex align="center" justify="space-between" class="fs14 mt20">
                  <div class="mr10">
                    <template v-if="state.auth">
                      <a-input class="font-SCDream6 w60" v-model:value="v.rq2" @blur="setTotalData(v)"></a-input>
                    </template>
                    <template v-else>
                      <span class="font-SCDream6">{{ v.rq2 }}</span>
                    </template>
                    <span class="font-SCDream4 color-hui ml5">입항 건</span>
                  </div>
                  <div class="font-SCDream4 fs10 br15 p5 bg-FEDB41 t-black t-c">반입예정</div>
                </a-flex>
                <a-flex align="center" justify="space-between" class="fs14 mt5">
                  <div class="mr10">
                    <template v-if="state.auth">
                      <a-input class="font-SCDream6 color-2171E2 w60" v-model:value="v.rq1" @blur="setTotalData(v)"></a-input>
                    </template>
                    <template v-else>
                      <span class="font-SCDream6 color-2171E2">{{ v.rq1 }}</span>
                    </template>
                    <span class="font-SCDream4 color-hui ml5">입항 건</span>
                  </div>
                  <div class="font-SCDream4 fs10 br15 p5 bg-2171E2 t-white t-c">검사예정</div>
                </a-flex>
              </a-flex>
            </template>
          </template>
          <template v-for="v in state.totalList" :key="v.id">
            <template v-if="v.type == 3">
              <a-flex vertical class="total-wrap bg-white br10 p20 fl1">
                <template v-if="state.auth">
                  <a-input class="font-SCDream6 fs18 t-c w100" v-model:value="v.title" @blur="setTotalData(v)"></a-input>
                </template>
                <template v-else>
                  <div class="font-SCDream6 fs18 t-c">{{ v.title }}</div>
                </template>
                <!--            <div class="font-SCDream4 fs9 color-hui mt5 t-c">2024.04.08 업데이트 기준</div>-->
                <a-flex align="center" justify="space-between" class="fs14 mt20">
                  <div class="mr10">
                    <template v-if="state.auth">
                      <a-input class="font-SCDream6 w60" v-model:value="v.rq1" @blur="setTotalData(v)"></a-input>
                    </template>
                    <template v-else>
                      <span class="font-SCDream6">{{ v.rq1 }}</span>
                    </template>
                    <span class="font-SCDream4 color-hui ml5">입항 건</span>
                  </div>
                  <div class="font-SCDream4 fs10 br15 p5 bg-FB6F3E t-white t-c">오픈예정</div>
                </a-flex>
              </a-flex>
            </template>
          </template>
          <a-flex vertical class="p20 font-SCDream5 fs10 color-FB6F3E center fl1">
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
            <div v-for="(v,k) in state.tabs.send.tab" :class="{active:k === state.tabs.send.active}" @click="tabToggle('send',k)">
              <span class="fs12 font-SCDream5">{{ v.text }}</span>
              <span class="fs12 font-SCDream6 color-2171E2">{{ v.number }}건</span>
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
              <span class="fs12 font-SCDream6 color-FB6F3E">{{ v.number }}건</span>
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
              <span class="fs12 font-SCDream6 color-FB6F3E">{{ v.number }}건</span>
            </div>
          </a-flex>
        </a-flex>
      </a-flex>
    </a-flex>
		<a-flex class="search-wrap" justify="space-between">
			<a-flex justify="space-between" align="center" class="mb20">
				<div class="fw fs16 font-SCDream5 mr30">배송대행 신청 내역</div>
				<a-button type="primary" class="fs14 font-SCDream6" @click="state.modal.open = true">필터</a-button>
				<a-button id="qna" type="primary" class="fs14 font-SCDream6 m2 bg-2171E2 t-white ml10" @click="moveToQna">문의하기</a-button>
			</a-flex>
      <a-input-search
          class="search-btn"
          placeholder="상품명을 입력해 주세요."
          enter-button="검색"
          @search="searchKeyword"
          v-model:value="state.searchParams.keyword"
      />
		</a-flex>
		<a-divider class="mt0 bottom-border" />
		<a-spin size="large" :spinning="state.listLoading">
			<div class="list-wrap">
				<a-flex class="header-wrap w100 font-SCDream6 mb10">
					<template v-for="v in state.header">
						<div class="fw">{{v}}</div>
					</template>
				</a-flex>
				<a-divider/>
				<a-flex
					wrap="wrap"
					class="content-wrap bor br5 mb10"
					v-for="(order, key) in state.bridgeList"
					:key="key"
				>
					<a-flex class="header color-2171E2 w100 font-SCDream5 fs14">
						<div class="w10 text-center">No.{{ order['id'] }}</div>
						<div class="w40 text-left">
							<span class="cp" @click="openDetail(order['bridgeOrderId'])">{{ order['bridgeOrderId'] ?? '' }}</span>
							&nbsp;{{ order['items'][0]['orderNo'] ? '(판매처 주문번호:' + order['items'][0]['orderNo'] + ')' : '' }}
						</div>
						<div class="w20 text-left">{{ order['insDate'] ?? '' }}</div>
						<a-button
							v-if="order['bridgeOrderStatus'] === '결제대기'"
							style="margin-left: auto;margin-top: -7px;"
							@click="moveToPay"
						>
							결제하기
						</a-button>
					</a-flex>
					<a-flex class="content w100" align="center" v-for="(item, index) in order['items']" :key="index">
						<div><img :src="item['prdImage']" class="br5" :alt="order['id']"/></div>
						<a-flex vertical style="text-align: left;">
							<div class="mb10 fs14 font-SCDream5">{{ item['prd_name_en'] || item['prdName'] || '' }}</div>
							<div class="fs10 font-SCDream4">{{ getOptionName(item) }}</div>
						</a-flex>
						<div class="fs14 font-SCDream4">{{ item['quantity'] ?? 0 }}</div>
            <a-flex class="fs14 font-SCDream4">
              <a-input v-model:value="item['tracking_no']">
                  <template #addonAfter>
                    <CheckOutlined @click="updateTracking(item, order['bridgeOrderId'])"/>
                  </template>
              </a-input>
            </a-flex>
						<div class="fs14 font-SCDream4">{{ item['invoice_no'] ?? ''}}</div>
						<template v-if="index === 0">
							<div class="fs14 font-SCDream4">{{ order['bridgeOrderStatus'] ?? '' }}</div>
<!--							<div class="fs14 font-SCDream4">{{ order['isPaid'] === 1 ? '결제완료' : '입금대기'}}</div>-->
<!--							<div class="fs14 font-SCDream4">{{ order['ctrSeq'] ?? '' }}</div>-->
							<div class="fs14 font-SCDream4"></div>
<!--							<div class="fs14 font-SCDream4">{{ order['fee'] ?? 0 }}원</div>-->
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
					<a-button class="reset plr30" @click="initSearch">초기화</a-button>
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
						v-model:value="state.searchParams.bridge_order_id"
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
						v-model:value="state.searchParams.tracking_no"
					/>
				</a-form-item>
			</a-flex>
			<a-flex vertical class="mt10">
				<div><strong>운송장번호</strong></div>
				<a-form-item name="date" class="mt10 mb10">
					<a-input
						class="w100"
						placeholder="운송장번호를 입력하세요."
						v-model:value="state.searchParams.invoice_no"
					/>
				</a-form-item>
			</a-flex>
		</a-modal>

		<ExpressDetail :visible="modalVisible" :bridgeDetail="bridgeDetail" @close="modalVisible = false" />
	</div>
</template>

<script setup>
import {computed, onBeforeUpdate, onMounted, reactive, ref, watch} from "vue";
import {message} from "ant-design-vue";
import {useBridgeApi} from "@/api/bridge";
import moment from "moment";
import { InfoCircleFilled,ExclamationCircleOutlined,CheckOutlined } from '@ant-design/icons-vue';
import {useExpressApi} from "@/api/express";
import Cookie from "js-cookie";
import ExpressDetail from "@/views/express/components/ExpressDetail.vue";

const modalVisible = ref(false);
const bridgeDetail = ref({});

const openDetail = (bridgeOrderId) => {
	bridgeDetail.value = state.bridgeList.find(order => order['bridgeOrderId'] === bridgeOrderId);
	modalVisible.value = true;
}

const state = reactive({
	// header: ['No','상품정보','수량','트래킹번호','운송장번호','주문상태','결제상태','운송방식','배송대행료','수취인'],
	header: ['No','상품정보','수량','트래킹번호','운송장번호','주문상태','운송방식','수취인'],
	bridgeList: [],
	total: 0,
	listLoading: false,
	searchParams: {
		page: 1,
		pageSize: 10,
		keyword: '',
		bridge_order_id: '',
		receiver_name: '',
		tracking_no: '', // cn
		invoice_no: '', // kr
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
          {text:'접수신청',number:0},
          {text:'입고완료',number:0},
          {text:'결제대기',number:0},
          {text:'결제완료',number:0},
          {text:'출고준비',number:0},
          {text:'출고대기',number:0},
          {text:'출고완료',number:0},
          {text:'통관중',number:0},
          {text:'국내도착',number:0},
          {text:'배송완료',number:0},
        ],
        active: -1
      },
    error:{
        tab:[
          {text:'노데이터',number:0},
          {text:'주문오류',number:0},
        ],
        active: -1
    },
    back:{
        tab:[
          {text:'반품신청',number:0},
          {text:'반품준비',number:0},
          {text:'통관실패',number:0},
          {text:'접수취소',number:0},
          {text:'반품배송',number:0},
        ],
        active: -1
    },
  },
  toggleTotalActive:true,
  auth:false,
  totalList:[],
  expressModalOpen:false
});
state.auth = Cookie.get("member_name") == 'jwli' ? true :false;
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
	initTabs();
	getBridgeList();
}

const initSearchParams = () => {
	state.searchParams.keyword = '';
	state.searchParams.bridge_order_status = '';
    state.searchParams.bridge_order_id = '';
    state.searchParams.receiver_name = '';
    state.searchParams.invoice_no = '';
    state.searchParams.tracking_no = '';
    state.searchParams.start_time = '';
    state.searchParams.end_time = '';
	state.searchParams.page = 1;
	state.searchParams.pageSize = 10;
}

const initSearch = () => {
    initSearchParams();
	initTabs();
	state.modal.open = false;
    getBridgeList();
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
	if (state.searchParams.keyword.trim() === '') {
		initSearchParams();
	}
    state.searchParams.page = 1;
	state.searchParams.pageSize = 10;
	initTabs();
    getBridgeList();
}

const getBridgeList = async (params = {}) => {
	params = filterParams(params);

	state.listLoading = true;
	useBridgeApi().getBridgeOrderList({...params}).then((res) => {
		if (res.status !== "2000") {
			state.listLoading = false
			throw new Error("배송대행지 주문을 가져올수 없습니다. 다시 한번 시도 부탁드립니다.");
		}

		state.bridgeList = res.data.list;
		//TODO 배송대행료 계산
		state.total = res.data.total;

	}).catch((e) => {
		message.error(e.message);
		return false;
	}).finally(() => {
		state.listLoading = false;
	});
}

const getTotalBridgeList = async () => {
	useBridgeApi().getBridgeOrderListCount().then((res) => {
		if (res.status === "2000" && res.data) {
			bridgeCount(res.data['totalListByUserId']);
		}
	});
}

const bridgeCount = (totalBridgeList) => {
	totalBridgeList.forEach(item => {
		const tabs = {
			send: state.tabs.send.tab,
			error: state.tabs.error.tab,
			back: state.tabs.back.tab
		};

		Object.keys(tabs).forEach(key => {
			const tab = tabs[key];
			const index = tab.findIndex(t => t.text === item['bridgeOrderStatus']);
			if (index !== -1) {
				state.tabs[key].tab[index].number++;
			}
		});
	});
}

// tab init
const initTabs = () => {
	for (const key in state.tabs) {
		state.tabs[key].active = -1
	}
}

const tabToggle = (type,k) =>{
	initSearchParams();
	initTabs();
	state.searchParams.bridge_order_status = state.tabs[type].tab[k].text;
	state.tabs[type].active = k;
	getBridgeList();
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
  useExpressApi().save(v).then(res => {
    if (res.status !== "2000") {
      message.error(res.data.message);
      return false;
    }
  }).finally(() => {
  });
}

const getOptionName = (item) => {
	let optionName = '';
	if (item['option_color']) {
		optionName = item['option_color'];
		if (item['option_size']) {
			optionName += '/' + item['option_size'];
		}
	} else {
		optionName = item['prdOptionName'] ?? '';
	}

	return optionName;
}

const moveToPay = () => {
	window.open('https://zh8g.com/Front/Acting/Pay_S4.asp');
}

const moveToQna = () => {
	window.open('https://pf.kakao.com/_HxgyZG');
}

const updateTracking = (item, bridgeOrderId) => {
  if (!item['tracking_no'] || item['tracking_no'].trim() === '') {
    message.error('트래킹번호를 입력해주세요');

    return false;
  }

  state.listLoading = true;
  useBridgeApi().updateBridgeOrderItems({...item, bridgeOrderId}).then((res) => {
    if (res.status !== "2000") {
      throw new Error('트래킹번호 업데이트 실패');
    }

    message.success('트래킹번호 업데이트 성공');

  }).catch((e) => {
    message.error(e.message);

    return false;
  }).finally(() => {
    state.listLoading = false;
  });
}

const updateBridgeOrder = (item, bridgeOrderId) => {
	useBridgeApi().updateBridgeOrder({...item, bridge_order_id: bridgeOrderId}).then((res) => {
		if (res.status !== "2000") {
			throw new Error('신청서 업데이트 실패');
		}

		message.success('신청서 업데이트 성공');

	}).catch((e) => {
		message.error(e.message);

		return false;
	}).finally(() => {
		state.listLoading = false;
	});
}

watch(() => state.modal.open, () => {
	// 处理 open 属性的变化
	initSearchParams()
});

onMounted(async () => {
	await Promise.all([
		getBridgeList(),
		getTotalBridgeList(),
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
.express-wrap .board-wrap a.ant-btn{
  display: flex;
  align-items: center;
  justify-content: center;
}
.express-wrap .board-wrap .more.ant-btn{
  background: none;
  box-shadow: none;
  border: 0;
  padding: 0;
  height: inherit;
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
.bor-0505050f{
  border: 1px solid #0505050f;
}
.bottom-border{
	height: 2px;
	background: black;
}
.top-border-000{
  border-top: 2px solid #000;
}
.bottom-border-f0f0f0{
  border-bottom: 2px solid #f0f0f0;
}
.color-huang{
	color: #FFDB40;
}
.color-hui{
	color: #B8B8B8;
}
.color-FEDB41{
  color: #FEDB41;
}
.color-2171E2{
  color: #2171E2;
}
.color-FB6F3E{
  color: #FB6F3E;
}
.color-fefefe{
  color: #fefefe;
}
.color-bababa{
  color: #bababa;
}
.color-2071E1{
  color: #2071E1;
}
.bg-hui{
	background: #F0F0F0;
}
.bg-FEDB41{
  background: #FEDB41;
}
.bg-2171E2{
  background: #2171E2;
}
.bg-FB6F3E{
  background: #FB6F3E;
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
	width: 20%;
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
  color: #F9443D;
  border: 1px solid #F9443D;
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
  border: 1px solid #2171E2;
}
.tab-wrap2 > div.active{
  border: 1px solid #FB6F3E;
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
.status-wrap img{
  width: 20px;
  height: 20px;
}
.status-wrap button{
  padding: 12px 46px;
  height: auto;
  border: 1px solid #FFDB41;
}
.expressForm .area-wrap .row-content{
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#qna:hover{
	background-color: #3399ff;
}
</style>
