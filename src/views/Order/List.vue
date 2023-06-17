<template>
    <loading v-model:active="bLoading"
             :can-cancel="false"
             :is-full-page="true"/>

    <div id="searchForm" class="pl20 pr20 pt20">

        <h2>기본검색</h2>
        <table>
            <tr class="tbtrb">
                <th style="width: 200px;">기간</th>
                <td>
                    <a-space direction="vertical" :size="12">
                        <a-range-picker v-model:value="searchParam.regdate" />
                    </a-space>
                </td>
            </tr>
            <tr class="tbtrb">
                <th>주문번호</th>
                <td>
                    <a-input-group compact>
                        <a-select v-model:value="searchParam.numberType">
                            <a-select-option value="oid">주문번호</a-select-option>
                            <a-select-option value="od_ix">주문상세번호(상품별)</a-select-option>
                            <a-select-option value="co_oid">마켓 주문번호</a-select-option>
                            <a-select-option value="co_od_ix">마켓 주문고유번호</a-select-option>
                        </a-select>
                        <a-input v-model:value="searchParam.numberValue" style="width: 50%" />
                    </a-input-group>
                </td>
            </tr>
            <tr class="tbtrb">
                <th>주문자/수취인</th>
                <td>
                    <a-input-group compact>
                        <a-select v-model:value="searchParam.nameType">
                            <a-select-option value="bname">주문자</a-select-option>
                            <a-select-option value="rname">수취인</a-select-option>
                        </a-select>
                        <a-input v-model:value="searchParam.nameValue" style="width: 50%" />
                    </a-input-group>
                </td>
            </tr>
            <tr class="tbtrb">
                <th>주문상태</th>
                <td>
                    <a-checkbox-group v-model:value="searchParam.status" :options="statusOptions" />

                </td>
            </tr>
            <tr class="tbtrb">
                <th>판매채널</th>
                <td>
                    <a-checkbox-group v-model:value="searchParam.orderFrom" :options="siteOptions" />
                </td>
            </tr>
        </table>

        <div class="mt25" style="text-align: center;">
            <a-button @click="setTableData" style="width: 100px;" type="primary">
                <template #icon><SearchOutlined /></template>
                검색
            </a-button>
            <a-button class="ml10" @click="initSearchParam()" style="width: 100px;" type="">초기화</a-button>
        </div>

        <br>
    </div>

    <br/>

    <div id="list" class="p20 bg-white">

        <div class="mb10" style="display: flex; justify-content: flex-end;">
            <a-button @click="requestCollect" style="width: 130px; margin-left: 10px" type="primary">
                <template #icon><InsertRowAboveOutlined /></template>
                수동 주문수집
            </a-button>
            <a-button @click="excelDownload" style="width: 130px; margin-left: 10px" type="primary">
                <template #icon><DownloadOutlined /></template>
                엑셀 다운로드
            </a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination">
            <template #bodyCell="{ column, text }">
                <template v-if="column.dataIndex === 'displayChannel'">
                    <div style="text-align: center;">
                        <p v-html="text"></p>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'displayNumber'">
                    <div style="text-align: center;">
                        <p v-html="text"></p>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'displayProduct'">
                    <div style="text-align: center;">
                        <p v-html="text"></p>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'displayCount'">
                    <div style="text-align: center;">
                        <p v-html="text"></p>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'displayName'">
                    <div style="text-align: center;">
                        <p v-html="text"></p>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'displayPrice'">
                    <div style="text-align: right;">
                        <p v-html="text"></p>
                    </div>
                </template>
                <template v-if="column.dataIndex === 'displayDate'">
                    <div style="text-align: center;">
                        <p v-html="text"></p>
                    </div>
                </template>
            </template>
        </a-table>

    </div>

</template>

<script setup>

import {onMounted, reactive, ref} from "vue";
import {AuthRequest} from "@/util/request";
import Cookie from "js-cookie";
import Loading from "vue-loading-overlay";
import {FileAddOutlined, SearchOutlined, InsertRowAboveOutlined, DownloadOutlined} from "@ant-design/icons-vue";
import _ from "lodash";
import moment from "moment";

let bLoading = ref(false);

const statusOptions = [
    {label: '결제완료', value: 'IC'},
    {label: '배송준비중', value: 'DR'},
    {label: '배송중', value: 'DI'},
    {label: '배송완료', value: 'DC'},
    {label: '거래완료', value: 'BF'},
    {label: '교환요청', value: 'EA'},
    {label: '교환거부', value: 'EY'},
    {label: '교환승인', value: 'EI'},
    {label: '교환상품배송중', value: 'ED'},
    {label: '교환상품회수완료', value: 'ET'},
    {label: '교환보류', value: 'EF'},
    {label: '교환불가', value: 'EM'},
    {label: '교환반품확정', value: 'EC'},
    {label: '반품요청', value: 'RA'},
    {label: '반품거부', value: 'RY'},
    {label: '반품승인', value: 'RI'},
    {label: '반품상품배송중', value: 'RD'},
    {label: '반품회수완료', value: 'RT'},
    {label: '반품보류', value: 'RF'},
    {label: '반품불가', value: 'RM'},
    {label: '반품확정', value: 'RC'},
    {label: '취소요청', value: 'CA'},
    {label: '취소완료', value: 'CC'},
];
const siteOptions = reactive([]);

const $searchPram = {
    numberType: 'oid',
    numberValue: '',
    status: [],
    regdate: [
        moment(new Date()).subtract(6, 'days'),
        moment(new Date())
    ],
    nameType: 'bname',
    nameValue: '',
    orderFrom: []
};
const searchParam = ref(_.clone($searchPram));
const initSearchParam = () => {
    searchParam.value = _.clone($searchPram);
};

const requestCollect = () => {
    AuthRequest.post(process.env.VUE_APP_API_URL + '/api/order/requestCollect').then((res) => {
        if (res.status !== '2000') {
            alert(res.message)
            return false;
        }

        alert('수동 주문수집이 요청 되었습니다.' + "\n" + '수집이 완료되기까지 대략 5분정도 소요 됩니다.');
    });
};


const columns = [
    {title: 'No', dataIndex: 'index', key: 'index'},
    {title: '판매채널', dataIndex: 'displayChannel', key: 'displayChannel'},
    {title: '주문번호 주문상세번호(상품별)', dataIndex: 'displayNumber', key: 'displayNumber'},
    {title: '주문상태', dataIndex: 'displayStatus', key: 'displayStatus', width: '100px'},
    {title: '상품명 / 옵션명', dataIndex: 'displayProduct', key: 'displayProduct'},
    {title: '개수', dataIndex: 'displayCount', key: 'displayCount'},
    {title: '주문자 / 수취인', dataIndex: 'displayName', key: 'displayName'},
    {title: '가격', dataIndex: 'displayPrice', key: 'displayPrice', width: '200px'},
    {title: '주문일시', dataIndex: 'displayDate', key: 'displayDate'},
];

const pagination = ref({
    total: 200,
    current: 1,
    pageSize: 10,
    position: ['bottomCenter'],
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: page => {
        pagination.value.current = page;
        setTableData();
    },
    onShowSizeChange: (current, pageSize) => {
        pagination.value.current = 1;
        pagination.value.pageSize = pageSize;
        setTableData();
    },
});

const data = ref([]);

const roles = ref(Cookie.get('member_roles'));
onMounted(async () => {

    console.log('====== onMounted ======');

    if (roles.value === null) {
        return false;
    }

    await setMarketList();

    await setTableData();
});

const Cache = {
    setCache: (key, value) => {
        key = key + Cookie.get('member_name');
        localStorage.setItem(key, JSON.stringify({
            exp: new Date().getTime() + (1000 * 60 * 60 * 2),
            value: value
        }));
    },
    getCache: (key) => {
        key = key + Cookie.get('member_name');
        let value = localStorage.getItem(key)
        if (value !== null) {
            const data = JSON.parse(value);
            if (data.exp < new Date().getTime()) {
                return null;
            }

            return data.value;
        }

        return null;
    }
};

const setMarketList = async () => {

    let marketList = Cache.getCache('MARKET_LIST');

    if (marketList === null) {
        const res = await AuthRequest.get(process.env.VUE_APP_API_URL + '/api/marketlist');

        if (res.status !== '2000') {
            alert(res.message)
            return false;
        }

        marketList = res.data;

        Cache.setCache('MARKET_LIST', marketList);

    }

    /* site_code: order_from, site_id: */
    marketList.item.forEach((e,i) => {
        siteOptions.push({
            label: `${e.site_code}(${e.site_id})`,
            value: `${e.site_code}::${e.site_id}`
        })
    })

}

const setTableData = async () => {
    bLoading.value = true;

    let regdateBegin = '';
    let regdateEnd = '';

    if (searchParam.value.regdate != null && searchParam.value.regdate.length > 0) {
        let mmTmp = searchParam.value.regdate[0];
        regdateBegin = mmTmp === undefined ? '' : mmTmp.format('YYYY-MM-DD');
        mmTmp = searchParam.value.regdate[1];
        regdateEnd = mmTmp === undefined ? '' : mmTmp.format('YYYY-MM-DD');
    }

    const res = await AuthRequest.get(process.env.VUE_APP_API_URL + "/api/order/list", {
        params: {
            regdateBegin: regdateBegin,
            regdateEnd: regdateEnd,
            numberType: searchParam.value.numberType,
            numberValue: searchParam.value.numberValue,
            nameType: searchParam.value.nameType,
            nameValue: searchParam.value.nameValue,
            status: searchParam.value.status,
            orderFrom: searchParam.value.orderFrom,
            page: pagination.value.current, // 페이지
            limit: pagination.value.pageSize // 리미트
        },
    });

    bLoading.value = false;

    data.value = res.data.list;
    pagination.value.total = res.data.total;
    pagination.value.current = res.data.page;
    pagination.value.pageSize = res.data.limit;

}

const excelDownload = () => {
    bLoading = true;

    let regdateBegin = '';
    let regdateEnd = '';

    if (searchParam.value.regdate != null && searchParam.value.regdate.length > 0) {
        let mmTmp = searchParam.value.regdate[0];
        regdateBegin = mmTmp === undefined ? '' : mmTmp.format('YYYY-MM-DD');
        mmTmp = searchParam.value.regdate[1];
        regdateEnd = mmTmp === undefined ? '' : mmTmp.format('YYYY-MM-DD');
    }

    AuthRequest.get(
        process.env.VUE_APP_API_URL + "/api/order/download",
        {
            responseType: 'blob',
            params: {
                regdateBegin: regdateBegin,
                regdateEnd: regdateEnd,
                numberType: searchParam.value.numberType,
                numberValue: searchParam.value.numberValue,
                nameType: searchParam.value.nameType,
                nameValue: searchParam.value.nameValue,
                status: searchParam.value.status,
                orderFrom: searchParam.value.orderFrom,
                page: pagination.value.current, // 페이지
                limit: pagination.value.pageSize // 리미트
            },

        }
    ).then((res) => {
        let response = res;
        if (response === undefined) {
            alert("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
            bLoading = false;
            return false;
        }

        let fileName = 'order.xlsx';
        let blob = new Blob([response], {type: 'charset=utf-8'});
        let downloadElement = document.createElement('a');
        let url = window.URL || window.webkitURL || window.moxURL
        let href = url.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = decodeURI(fileName); // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        url.revokeObjectURL(href);
        bLoading.value = false;
    });
}


</script>

<style>

#searchForm {
    padding: 0 50px 0 50px;
    background-color: #ffffff;
}
#searchForm th {
    padding: 20px 0 10px 0;
}
#searchForm .tbtrt {
    border-top: 1px dotted #c5bfbf;
}
#searchForm .tbtrb {
    border-bottom: 1px dashed #c5bfbf;
}

#searchForm .ant-checkbox-group {
    float: left;
}
#searchForm .ant-checkbox-wrapper.ant-checkbox-group-item {
    width: 200px;
}
</style>