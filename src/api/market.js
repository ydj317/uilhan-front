import {AuthRequest} from "@/util/request";
import { marketList } from "./mock/marketList";

export function useMarketApi() {
    return {
        // 마켓목록
        getMarketList: (data) => {
            // return Promise marketList
            return Promise.resolve(marketList)
        },

    }
}