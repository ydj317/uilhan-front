
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
  let orderData = {};
  if (tbodyEl.length !== 0) {
    console.log(tbodyEl[1]);
    // tbodyEl[1] 에서 tr 을 찾아서 각각의 tr 에서 td 를 찾아서 데이터를 추출
    const tdEl = tbodyEl[1].querySelector('td');
    tdEl.querySelectorAll('span')[0]

  }
  console.log(orderData);
  return text;
}

function alibabaParser(text) {
  return text;
}