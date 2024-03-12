import {message} from "ant-design-vue";
import {lib} from "@/util/lib";
import {AuthRequest} from "@/util/request";

export class ProductList {
  static defaultParams() {
    return {
      market_code: "all",

      // as-is: 日期区间只能应用一种; to-be 同时应用所有日期区间.
      date_type: "insert_date",
      start_time: "",
      end_time: "",

      // as-is 检索语类型 radio, 只能检索商品code, 商品名, ... 之一。 to-be : 分离了类型，同时检索
      search_key: "item_code",
      search_value: "",

      trans_status: "all",
      sync_status: "all",

      page: 1,
      limit: 10,
    }
  }

  static filterParams(params = this.defaultParams(), type = '') {
    params = {...params}
    params.market_code = lib.isEmpty(params.market_code) ? "all" : params.market_code
    params.sync_status = lib.isEmpty(params.sync_status) ? "all" : params.sync_status

    if (type === "reload" && sessionStorage.marketAccount_page !== undefined) {
      params.page = parseInt(sessionStorage.marketAccount_page)
      params.limit = parseInt(sessionStorage.marketAccount_limit)
    }

    if (type === 'search') {
      params.page = 1
    }

    params.page = (params.page >= 1) ? params.page : 1
    params.limit = isNaN(params.limit) ? 10 : params.limit

    return params
  }

  /**
   * @param {*} params
   * @param {'reload'|'search'|''} type
   * @return {*}
   */
  static getList(params = this.defaultParams(), type = '') {
    params = this.filterParams(params, type);
    return AuthRequest.get(process.env.VUE_APP_API_URL + "/api/prdlist", {params}).then((res) => {
      if (res.status !== "2000") {
        message.error();
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

  static async sendMarket(productList, accountList, smartStoreCategory) {
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

  /**
   *
   * @param {Array} productList 要登录的商品列表
   * @param {Array} accountList 要登录的商城
   * @param {Array} smartStoreCategory
   * @return {boolean}
   */
  static checkSmartStoreCategory(productList, accountList, smartStoreCategory) {
    const smartstoreAccounts = accountList.filter((item) => item.market_code === 'smartstore')
    if(smartstoreAccounts.length === 0) {
      return true;
    }

    let failedItem = [];

    productList.map((prdItem) => {
      failedItem = smartStoreCategory.filter((item) => {
        return prdItem.item_sync_keyword?.includes(item.cate_name);
      })
    })

    if(failedItem.length > 0) {
      message.warning(`스마트스토어 금지어: [${failedItem.map((item) => item.cate_name).join(', ')}] 상품명 수정후 마켓연동해 주세요.`)
      return false;
    }
    return true;
  }
}