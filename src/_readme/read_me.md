```json
{
  "상품": {
    "wholesale_margin_option": "도매마진율 계정 적용값",
    "selling_margin_option": "판매마진율 계정 적용값",
    "disp_margin_option": "할인마진율 계정 적용값"
  },
  "품목": {
    "wholesale_price": "도매가",
    "selling_price": "판매가",
    "disp_price": "할인전가격",
    "original_price_cn": "수집원가-중국",
    "original_price_kor": "수집원가-한국",
    "shipping_fee_cn": "운임-중국",
    "shipping_fee_kor": "운임-한국"
  },
  "계정": {
    "wholesale_margin": "도매마진율 리스트",
    "selling_margin": "판매마진율 리스트",
    "disp_margin": "할인마진율 리스트",
    "rate": "환율 리스트",
    
    "wholesale_margin_option": "도매마진율 계정 적용값",
    "selling_margin_option": "판매마진율 계정 적용값",
    "disp_margin_option": "할인마진율 계정 적용값",
    "rate_option": "환율값"
  }
}
```

# 도매마진율 설정 (중국화페로 계산완료후 환율마진으로 한국화페로 계산함)
도매가 = ( 구매원가 + 중국내 운임 ) * 도매마진율 * 환율마진율
sku[i].wholesale_price = ( sku[i].original_price_cn + sku[i].shipping_fee_cn ) * user.wholesale_margin

# 판매마진율 설정 (중국화페로 계산완료후 환율마진으로 한국화페로 계산함)
판매가 = ( 구매원가 + 중국내 운임 ) * 판매마진율 * 환율마진율
sku[i].selling_price = ( sku[i].original_price_cn + sku[i].shipping_fee_cn ) * user.selling_margin * user.rate

# 할인마진율 설정 (중국화페로 계산완료후 환율마진으로 한국화페로 계산함)
할인가 = 판매가 * 할인마진율 * 환율마진율
sku[i].disp_price = sku[i].disp_price * user.disp_margin * user.rate

# 환율 설정 (sku 에서 환율설정을 제거!!!!!)
[//]: # (도매가 = 도매가 * 환율마진율)
[//]: # (sku[i].wholesale_price = sku[i].wholesale_price * user.rate)