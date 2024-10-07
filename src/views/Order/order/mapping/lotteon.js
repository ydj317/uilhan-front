
export class Lotteon {
  #orderData
  constructor(orderData) {
    this.#orderData = orderData;
  }

  getOrderParam() {
    const { items } = this.mappingItems();

    const {
      courierName,
      invoiceNumber,
      itemOrgData,
    } = this.#orderData.items.find(item => item.prdCode) || {};

    const { odCmptDttm, dvMsg,dvpCustNm, dvpTelNo, dvpMphnNo,dvpZipNo, dvpStnmZipAddr, dvpStnmDtlAddr,odrNm, telNo, indvCstmPclrNo } = itemOrgData || {}

    return {
      id: this.#orderData.id,
      orderNo: this.#orderData.orderNo,
      accountId: this.#orderData.accountId,
      receiverName: dvpCustNm,
      receiverAddr1: dvpStnmZipAddr,
      receiverAddr2: dvpStnmDtlAddr,
      receiverPostCode: dvpZipNo,
      receiverTel1: dvpTelNo,
      receiverTel2: dvpMphnNo,
      personalCustomsClearanceCode: indvCstmPclrNo,
      courierName: courierName || '-',
      invoiceNumber: invoiceNumber || '-',
      payDate: odCmptDttm,
      payLocation: '-',
      message: dvMsg,
      items: items,
      key: this.#orderData.key,
      ordererName: odrNm,
      ordererTel: telNo,
      insDate: this.#orderData.insDate,
      orderDate: this.#orderData.orderDate,
      updDate: this.#orderData.updDate,
      orgData: {...this.#orderData.orgData}
    }
  }

  mappingItems() {
    const items = this.#orderData.items.map(item => {
      return {
        id: item.id,
        key: item.key,
        accountId: item.accountId,

        orderId: item.orderId,
        orderNo: item.orderNo,
        prdCode: item.prdCode,
        prdImage: item.prdImage,
        prdName: item.prdName,
        prdNameCn: item.prdNameCn,
        prdOptionName: item.prdOptionName,
        PrdOptionNameCn: item.PrdOptionNameCn,
        prdOptionNo: item.prdOptionNo,
        prdPriceCn: item.prdPriceCn,
        prdUrl: item.prdUrl,
        prdMarket: item.prdMarket,

        receiverName: item.receiverName,
        receiverAddr1: item.receiverAddr1,
        receiverAddr2: item.receiverAddr2,
        receiverPostCode: item.receiverPostCode,
        receiverTel1: item.receiverTel1,
        shippingBoxNo: item.shippingBoxNo,

        price: item.price,
        quantity: item.quantity,
        claimQuantity: item.claimQuantity,
        status: item.status,

        deliveryFee: item.itemOrgData?.dvCst ?? 0,

        totalPaymentAmount: item.totalPaymentAmount,
        unitPrice: item.unitPrice,
        discountAmount: 0,

        insDate: item.insDate,
        updDate: item.updDate,
        lastDate: item.lastDate,
        message: item.message,

        itemNo: item.itemNo,
        itemOrgData: {...item.itemOrgData},
        personalCustomsClearanceCode: item.personalCustomsClearanceCode,

        courierName: item.courierName,
        invoiceNumber: item.invoiceNumber,
      }
    })

    return { items };
  }
}