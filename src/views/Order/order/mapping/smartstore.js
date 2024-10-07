
export class SmartStore {
  #orderData
  constructor(orderData) {
    this.#orderData = orderData;
  }

  getOrderParam() {
    const { items } = this.mappingItems();

    const { ordererTel, payLocationType, depositDate,additionalMessage } = this.#orderData.orgData || {};

    const {
      receiverName,
      receiverAddr1,
      receiverAddr2,
      receiverPostCode,
      receiverTel1,
      courierName,
      invoiceNumber,
      personalCustomsClearanceCode,
    } = this.#orderData.items.find(item => item.receiverName) || {};

    return {
      id: this.#orderData.id,
      orderNo: this.#orderData.orderNo,
      accountId: this.#orderData.accountId,
      receiverName,
      receiverAddr1,
      receiverAddr2,
      receiverPostCode,
      receiverTel1,
      receiverTel2: '-',
      personalCustomsClearanceCode,
      courierName,
      invoiceNumber,
      payDate: depositDate,
      payLocation: payLocationType,
      message: additionalMessage,
      items: items,
      key: this.#orderData.key,
      ordererName: this.#orderData.ordererName,
      ordererTel: ordererTel,
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
        prdOptionNameCn: item.prdOptionNameCn,
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

        deliveryFee: item.itemOrgData?.productOrder?.deliveryFeeAmount ?? 0,

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