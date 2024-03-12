
export class Tmon {
  #orderData
  constructor(orderData) {
    this.#orderData = orderData;
  }

  getOrderParam() {
    const { items } = this.mappingItems();

    const { receiverName, receiverPhone, receiverAddress, depositDate,userPhone,additionalMessage } = this.#orderData.orgData || {};

    const {
      courierName,
      invoiceNumber,
      personalCustomsClearanceCode,
    } = this.#orderData.items.find(item => item.receiverName) || {};

    return {
      id: this.#orderData.id,
      orderNo: this.#orderData.orderNo,
      accountId: this.#orderData.accountId,
      receiverName,
      receiverAddr1: receiverAddress?.address ?? '-',
      receiverAddr2: receiverAddress?.addressDetail ?? '-',
      receiverPostCode: receiverAddress?.zipCode ?? '-',
      receiverTel1: receiverPhone || '-',
      receiverTel2: userPhone || '-',
      personalCustomsClearanceCode,
      courierName: courierName || '-',
      invoiceNumber: invoiceNumber || '-',
      payDate: depositDate,
      payLocation: '-',
      message: additionalMessage || '-',
      items: items,
      key: this.#orderData.key,
      ordererName: this.#orderData.ordererName || '-',
      ordererTel: this.#orderData.orgData?.userPhone || '-',
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

        deliveryFee: (item.itemOrgData?.deliveryFee?.amount - item.itemOrgData?.deliveryFee?.partnerAmount) ?? 0,

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