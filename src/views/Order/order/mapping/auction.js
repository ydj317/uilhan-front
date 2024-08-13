export class Auction {
  #orderData
  constructor(orderData) {
    this.#orderData = orderData;
  }
  getOrderParam() {
    const {
      items
    } = this.mappingItems();

    const {
      PayDate,
      BuyerMobileTel,
      DelMemo
    } = this.#orderData.orgData || {};

    const {
      receiverName,
      receiverAddr1,
      receiverAddr2,
      receiverPostCode,
      receiverTel1,
      receiverTel2,
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
      receiverTel2,
      personalCustomsClearanceCode: personalCustomsClearanceCode || '-',
      courierName: courierName || '-',
      invoiceNumber: invoiceNumber || '-',
      payDate: PayDate ?? '',
      payLocation: '-',
      message: DelMemo || '-',
      items: items,
      key: this.#orderData.key,
      ordererName: this.#orderData.ordererName,
      ordererTel: BuyerMobileTel,
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

        deliveryFee: parseInt(item.itemOrgData.ShippingFee) ?? 0,

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