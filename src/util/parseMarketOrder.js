/**
 *
 * return data interface
 * orders = [
 * {
 *  orderNo: '1234567890123456789',
 *  orderDate: '2021-01-01',
 *  totalPrice: '10000',
 *  items: [
 *  {
 *  prdName: '상품명',
 *  sku: '상품SKU',
 *  prdUrl: '상품URL',
 *  imgUrl: '이미지URL',
 *  price: '상품가격',
 *  quantity: '상품수량',
 *  }
 *  ],
 */

export function useMarketOrderParser() {
  function parser(type,text) {
    switch (type) {
      case 'taobao':
        return taobaoParser(text);
      case 'alibaba':
        return alibabaParser(text);
      default:
        return '';
    }
  }

  return {
    parser
  }
}

function taobaoParser(text) {
  // html이 포함된 text 에서 span 에 포함된 订单号 를 찾아서 해당 ELEMENT 를 찾기
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const tbodyEl = doc.querySelectorAll('tbody');
  let orders = [];
  if (tbodyEl.length !== 0) {
    let orderData = {};
    orderData.items = [];
    for (let i = 0; i < tbodyEl.length; i++) {
      if(!!tbodyEl[i].textContent){
        if(tbodyEl[i].className.includes('bought-wrapper-mod__head')){
          if (!!tbodyEl[i].textContent) {
            orderData.orderNo = tbodyEl[i].textContent.match(/\d{19}/)[0];
            orderData.orderDate = tbodyEl[i].textContent.match(/\d{4}-\d{2}-\d{2}/)[0];
          }

        } else {

          const trEl = tbodyEl[i].querySelectorAll('tr');
          for (let j = 0; j < trEl.length; j++) {
            const tdEl = trEl[j].querySelectorAll('td');
            let itemData = {};
            for (let k = 0; k < tdEl.length; k++) {
              // 상품URL, 이미지URL
              if(tdEl[k]?.firstChild?.className?.includes('production-mod__production')) {
                if(tdEl[k]?.firstChild?.firstChild?.childNodes[0]?.href) {
                  itemData.prdUrl = tdEl[k]?.firstChild?.firstChild?.childNodes[0]?.href;
                }
                if(tdEl[k]?.firstChild?.firstChild?.childNodes[0]?.firstChild?.src) {
                  itemData.imgUrl = tdEl[k]?.firstChild?.firstChild?.childNodes[0]?.firstChild?.src;
                }
              } else if (tdEl[k]?.firstChild?.className?.includes('price-mod__price')) {
                // 상품가격
                itemData.price = tdEl[k].firstChild.textContent;
              } else if (tdEl[k].className.includes('bought-wrapper-mod__quantity')) {
                itemData.quantity = tdEl[k].textContent;
              } else if (tdEl[k].className.includes('bought-wrapper-mod__status')) {
                itemData.status = tdEl[k].textContent;
              }
            }

            // 상품명
            if(!!tdEl[0].textContent) {
              const prdInfo = tdEl[0].textContent.split('[交易快照]');
              if(prdInfo.length > 1) {
                itemData.prdName = prdInfo[0];
                itemData.sku = prdInfo[1];
              }
            }

            // 수량
            itemData.quantity = tdEl[2].textContent;

            // 총 가격
            if(!!tdEl[4]?.textContent) {
              orderData.totalPrice = tdEl[4].textContent;
            }

            // 유효한 데이터시 itemData에 추가
            if(itemData.prdUrl && itemData.imgUrl) {
              orderData.items.push(itemData);
            }
          }
        }
      }
    }
    orders.push(orderData)
  }

  console.log(orders);
  return orders[0];
}

function alibabaParser(text) {
  return text;
}