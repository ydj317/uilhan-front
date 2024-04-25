import {message} from "ant-design-vue";
import {lib} from "@/util/lib";
import {AuthRequest} from "@/util/request";

const KEY_PRD_LIST_PARAMS = "KEY_PRD_LIST_PARAMS";

export class ServiceProduct {
  /**
   * 列表搜索的默认参数
   * @return {{search_value: string, date_type: string, search_key: string, end_time: string, item_upd_end: string, market_code: string, item_sync_end: string, item_upd_start: string, item_no: string, start_time: string, item_ins_start: string, item_ins_end: string, item_sync_start: string, prd_code: string, limit: number, sync_status: string, page: number, keyword: string}}
   */
  static defaultParams() {
    return {
      // 旧 params
      // market_code: 'all',
      // date_type: "insert_date",
      // start_time: "",
      // end_time: "",
      // search_key: "item_code",
      // search_value: "",
      // sync_status: "all",
      trans_status: "all",  // 没有界面设置，无脑传 all

      // 新 params
      market_code: "all",   // 상품수집마켓  Taobao|Tmall|Alibaba|Aliexpress
      sync_status: "all",   // 처리상태  'all'|연동성공('1')|연동실패('0')|연동전('2')
      item_ins_start: '',   // 수집조회 (日期)
      item_ins_end: '',     // 수집조회 (日期)
      item_sync_start: '',  // 연동조회 (日期)
      item_sync_end: '',    // 연동조회 (日期)
      item_upd_start: '',   // 수정조회 (日期)
      item_upd_end: '',     // 수정조회 (日期)
      prd_code: '',         // 상품코드
      item_no: '',          // 품목코드
      keyword: '',          // 右侧快捷搜索

      page: 1,
      limit: 10,
    }
  }

  static getCacheParams() {
    return JSON.parse(sessionStorage[KEY_PRD_LIST_PARAMS] || "{}")
  }

  static setCacheParams(params) {
    sessionStorage[KEY_PRD_LIST_PARAMS] = JSON.stringify(params)
  }

  /**
   * 列表搜索前过滤参数
   * @param params
   * @param type
   * @return {{search_value: string, date_type: string, start_time: string, search_key: string, end_time: string, limit: number, sync_status: string, page: number, market_code: string, trans_status: string}}
   */
  static filterParams(params = {}) {
    params = Object.assign(this.defaultParams(), params)
    params.market_code = lib.isEmpty(params.market_code) ? "all" : params.market_code
    params.sync_status = lib.isEmpty(params.sync_status) ? "all" : params.sync_status

    params.page = (params.page >= 1) ? params.page : 1
    params.limit = isNaN(params.limit) ? 10 : params.limit

    return params
  }

  /**
   * @param {*} params
   * @param {'reload'|'search'|''} type
   * @return {*}
   */
  static async getList(params = {}) {
    params = this.filterParams(params);
    this.setCacheParams(params)
    return AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prdlist", {params}).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return
      }

      const dataList = res.data.list
      for (let i = 0; i < dataList.length; i++) {
        dataList[i].key = i;
        dataList[i].checked = false;
        dataList[i].item_name_type = "기존 상품명";
        if (dataList[i].item_is_trans === true) {
          dataList[i].item_name_type = "번역 상품명";
        }

        // SKU 최저가~최대가
        let selectedPrice = 0;
        let show_price = 0;
        if (!dataList[i].item_sku || dataList[i].item_sku.length === 0) {
          dataList[i]["show_price"] = "0원";
          continue;
        }

        selectedPrice = dataList[i].item_sku.filter(item => item.is_option_reference_price === 'T')
        .map(item => item.selling_price);

        if (selectedPrice.length === 0) {
          selectedPrice = dataList[i].item_sku.map(item => item.selling_price);
        }

        show_price = selectedPrice[0];
        dataList[i]["show_price"] = show_price.toLocaleString() + "원";
      }
      res.data.list = dataList
      return res
    }).catch(() => {
      message.error("상품 리스트 조회 실패하였습니다.")
    })
  }

  static checkBeforeSendMarket(productList, accountList, smartStoreCategory) {
    if (productList === "," || productList.length === 0) {
      message.warning('선택된 상품이 없습니다.');
      return false;
    }

    if (accountList.length === undefined || accountList.length === 0) {
      message.warning("선택된 계정이 없습니다.");
      return false;
    }

    const checkSmartStore = this.checkSmartStoreCategory(productList, accountList, smartStoreCategory);
    if(checkSmartStore === false) {
      return false
    }

    return true
  }

  /**
   *
   * @param {Array} productList 要登录的商品列表
   * @param {Array} accountList 要登录的商城
   * @param {Array} smartStoreCategory
   * @return {Promise<false|any[]>}
   */
  static async sendMarket(productList, accountList, smartStoreCategory) {
    // @see this.checkBeforeSendMarket().
    // 由于前置验证太快，可能导致 sendMarket对应的 loading 闪屏，因此单独拎出去。
    try {
      let res = await AuthRequest.post(process.env.VUE_APP_API_URL + "/api/send_market", {
        productList: productList.map(d => d.item_id).join(','),
        accountList: accountList
      });

      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }

      if (res.data !== undefined && res.data.length === 0) {
        message.error("해당요청에 오류가 발생하였습니다. \n재시도하여 오류가 지속될시 관리자에게 문의하여 주십시오.");
        return false;
      }

      let returnData = res.data;
      return [
        returnData.success,
        returnData.failedCode,
        returnData.failed,
        returnData.total,
        returnData.data,
      ]
    } catch (e) {
      message.error(e.message);
      return false;
    }
  }

  static checkSmartStoreCategory(productList, accountList, smartStoreCategory) {
    const smartstoreAccounts = accountList.filter((item) => item.market_code === 'smartstore')
    if(smartstoreAccounts.length === 0) {
      return true;
    }

    let failedItem = [];


    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    productList.forEach((prdItem) => {
      smartStoreCategory.forEach((item) => {
        const boundary = "(?:\\s|^|$)";
        const regexPattern = `${boundary}${escapeRegExp(item.cate_name)}${boundary}`;
        const regex = new RegExp(regexPattern, 'i');
        if (prdItem.item_sync_keyword && regex.test(prdItem.item_sync_keyword)) {
          failedItem.push(item);
        }
      });
    })

    if(failedItem.length > 0) {
      message.warning(`스마트스토어 금지어: [${failedItem.map((item) => item.cate_name).join(', ')}] 상품태그 수정 후 다시 등록해 주세요.`)
      return false;
    }
    return true;
  }
}