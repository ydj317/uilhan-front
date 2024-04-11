<template>
	<div class="express-wrap p30">
		<div class="fw mb20 fs18">배송대행지</div>
		<a-flex justify="space-between">
			<a-col class="bor p30 br5 w24">
				<a-flex vertical>
					<a-flex justify="space-between">
						<span class="fw fs16">배송대행 신청서</span>
						<span class="color-hui">비용확인</span>
					</a-flex>
					<a-button type="primary" class="mt40 fw h50 bg-black color-huang">신청서 작성하기</a-button>
				</a-flex>
			</a-col>
			<a-col class="bor p30 br5 w24">
				<a-flex vertical>
					<a-flex justify="space-between">
						<span class="fw fs16">나의 예치금</span>
						<span class="color-lan">90,000원</span>
					</a-flex>
					<a-button type="primary" class="mt40 fw h50">신청서 작성하기</a-button>
				</a-flex>
			</a-col>
			<a-col class="w24">
				<a-flex vertical justify="space-between" class="he100">
					<a-button type="primary" class="fw h77 fs16">중국 출고지 주소</a-button>
					<a-button type="primary" class="fw h77 fs16 bg-hui">노 데이터</a-button>
				</a-flex>
			</a-col>
			<a-col class="bor p30 br5 w24">
				<a-flex vertical>
					<a-flex justify="space-between">
						<span class="fw fs16">배대지 공지사항</span>
						<span class="red cp">more</span>
					</a-flex>
					<a-flex vertical class="color-hui mt20">
						<span class="mb5">[유일공지] 배송지연안내</span>
						<span class="mb5">[유일공지] 송장번호오류안내</span>
						<span>[유일공지] 마켓연동안내</span>
					</a-flex>
				</a-flex>
			</a-col>
		</a-flex>
		<div class="fw mt40 fs18">배대지 현황</div>
		<a-divider />
		<a-flex class="ml50">
			<div class="fw fs18 mr80">배송대행</div>
			<a-flex wrap="wrap" class="w50">
				<a-space class="mr20 mb20">
					<span>접수대기</span>
					<a-badge count="85" class="default" :class="{'blue':true}"/>
					<span>접수신청</span>
					<a-badge count="85" class="default" :class="{'blue':true}"/>
					<a @click="searchByStatus" :style="{ color: state.selectStatus === '입고완료' ? 'blue' : 'inherit' }">
						입고완료
					</a>
					<a-badge :count="bridgeCount('입고완료')" class="default" :class="{'blue':true}"/>
					<span>결제대기</span>
					<a-badge count="85" class="default" :class="{'blue':true}"/>
					<span>결제완료</span>
					<a-badge count="85" class="default" :class="{'blue':true}"/>
					<span>출고준비</span>
					<a-badge count="85" class="default" :class="{'blue':true}"/>
					<span>출고대기</span>
					<a-badge count="85" class="default" :class="{'blue':true}"/>
					<span>출고완료</span>
					<a-badge count="85" class="default" :class="{'blue':true}"/>
					<span>통관중</span>
					<a-badge count="85" class="default" :class="{'blue':true}"/>
					<span>국내도착</span>
					<a-badge count="85" class="default" :class="{'blue':true}"/>
					<span>배송완료</span>
					<a-badge count="1" class="default"/>
				</a-space>
			</a-flex>
		</a-flex>
		<a-divider class="mt0" />
		<a-flex class="ml50">
			<div class="fw fs18 mr80">오류현황</div>
			<a-flex wrap="wrap" class="w50">
				<a-space class="mr20 mb20">
					<a @click="searchByStatus" :style="{ color: state.selectStatus === '노데이터' ? 'blue' : 'inherit' }">
						노데이터
					</a>
					<a-badge :count="bridgeCount('노데이터')" class="default" :class="{ 'orange': state.selectStatus === '노데이터'}"/>
					<a @click="searchByStatus" :style="{ color: state.selectStatus === '결제대기' ? 'blue' : 'inherit' }">
						결제대기
					</a>
					<a-badge count="85" class="default" :class="{ 'orange': state.selectStatus === '결제대기'}"/>
				</a-space>
			</a-flex>
		</a-flex>
		<a-flex class="ml50 mt10">
			<div class="fw fs18 mr80">반품관리</div>
			<a-flex wrap="wrap" class="w50">
				<a-space class="mr20 mb20">
					<span>반품신청</span>
					<a-badge count="85" class="default" :class="{'red':true}"/>
					<span>반품준비</span>
					<a-badge count="85" class="default" :class="{'red':true}"/>
					<span>통관실패</span>
					<a-badge count="85" class="default" :class="{'red':true}"/>
					<span>접수취소</span>
					<a-badge count="85" class="default" :class="{'red':true}"/>
					<span>반품배송</span>
					<a-badge count="85" class="default" :class="{'red':true}"/>
				</a-space>
			</a-flex>
		</a-flex>
		<a-divider class="mt0" />
		<a-flex vertical class="search-wrap">
			<div class="fw fs18 mb20">배송대행 신청 내역</div>
			<a-flex justify="space-between" class="mb20">
				<a-button type="primary" @click="state.modal.open = true">필터</a-button>
				<a-input-search
					placeholder="검색어를 입력해 주세요."
					enter-button="검색"
					@search="searchKeyword"
					v-model:value="state.searchParams.keyword"
				/>
			</a-flex>
		</a-flex>
		<a-divider class="mt0 bottom-border" />
		<a-spin size="large" :spinning="state.listLoading">
			<div class="list-wrap">
				<a-flex class="header-wrap w100">
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
					<a-flex class="header color-lan w100">
						<div class="w10 text-center">{{ order['id'] ?? '' }}</div>
						<div class="w10 text-center">{{ order['bridgeOrderId'] ?? '' }}</div>
						<div class="w20 text-center">{{ order['ins_date'] ?? '' }}</div>
					</a-flex>
					<a-flex class="content w100" align="center" v-for="(item, index) in order['items']" :key="index">
						<div><img :src="item['prdImage']" class="br5"/></div>
						<a-flex vertical style="text-align: left">
							<div class="mb10">{{ item['prdName'] ?? '' }}</div>
							<div class="fs12">{{ item['prdOptionName'] ?? '' }}</div>
						</a-flex>
						<div>{{ item['quantity'] ?? 0 }}</div>
						<div>{{ item['invoiceNumber'] ?? ''}}</div>
						<template v-if="index === 0">
							<div>{{ order['bridgeOrderStatus'] ?? '' }}</div>
							<div>{{ order['isPaid'] === 1 ? '결제완료' : '입금대기'}}</div>
							<div>{{ order['ctr_seq'] ?? '' }}</div>
							<div>{{ order['fee'] ?? 0 }}원</div>
							<div>{{ order['receiverName'] ?? '' }}</div>
						</template>
					</a-flex>
				</a-flex>
			</div>
		</a-spin>
		<a-pagination
			class="w100 fl-cc mt15"
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

watch(() => state.modal.open, () => {
	// 处理 open 属性的变化
	initSearchParams()
});

onMounted(() => {
	Promise.all([
		getBridgeList(),
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
.bor{
	border: 1px solid #F0F0F0;
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
.bg-hui{
	background: #F0F0F0;
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
</style>
