import {message} from "ant-design-vue";
import moment from "moment";
import {lib} from "@/util/lib";
import {AuthRequest} from "@/util/request";

export class ProductList {
  static defaultParams() {
    return {
      market_code: "all",
      date_type: "insert_date",
      search_key: "item_code",
      start_time: "",
      end_time: "",
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

    params.page = (params.page > 1) ? params.page : 1
    params.limit = isNaN(params.limit) ? 10 : params.limit

    return params
  }

  /**
   * @param {*} params
   * @param type
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
}