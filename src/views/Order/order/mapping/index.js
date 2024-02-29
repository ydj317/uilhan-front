import { Tmon } from './tmon';
import { SmartStore } from './smartstore';
import { Lotteon } from './lotteon';
import { Interpark } from './interpark';
import { Coupang } from "./coupang";
import { Qoo10sg } from "./qoo10sg";
import { Sk11st } from "./sk11st";

export class OrderMapping {
  marketCode;
  marketClassMap;
  constructor(marketCode) {
    this.marketCode = marketCode.toLowerCase();
    this.marketClassMap = {
      'tmon': Tmon,
      'smartstore': SmartStore,
      'lotteon': Lotteon,
      'interpark': Interpark,
      'coupang': Coupang,
      'qoo10sg': Qoo10sg,
      'sk11st': Sk11st,
    };
  }

  /** marketCode 에 따라 class를 new*/
  mappingMarketOrder(orderData) {
    const MarketClass = this.marketClassMap[this.marketCode];
    if (!MarketClass) {
      throw new Error('지원하지 않는 marketCode 입니다.');
    }
    const market = new MarketClass(orderData);
    return market.getOrderParam();
  }
}