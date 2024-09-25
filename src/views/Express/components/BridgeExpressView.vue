<template>
  <a-modal v-model:open="visible"
           width="100%" wrap-class-name="full-modal"
           :confirm-loading="state.confirmLoading" @cancel="onClose" class="expressView" :footer="null">
	<div class="express-view">
    <a-flex gap="80" class="pb30">
      <a-flex vertical gap="30" class="step1 w50">
        <div class="fs20 font-SCDream6 color-535660">1.배송방법을 선택해주세요.</div>
        <a-flex>
          <a-flex vertical class="address-list-wrap">
            <div class="fs16 color-3F4249 font-SCDream3 fw">지점을 선택하세요.</div>
            <a-flex vertical class="address-list-main mt10" gap="6">
              <template v-for="i in 20">
                <div class="address-list fl-lb p10 cp" :class="i==1?'checked':''" >
                  <a-flex gap="5">
                    <img src="@/assets/img/express/china.png"/>
                    <div class="fs15 font-SCDream3 text">광저우{{i}}</div>
                  </a-flex>
                  <div class="address-list-check"></div>
                </div>
              </template>
            </a-flex>
          </a-flex>
          <a-flex vertical class="fl-tc mlr10" gap="10">
            <RightOutlined class="color-cfd2da h25" />
            <a-divider type="vertical" class="divider-vertical" />
          </a-flex>
          <a-flex vertical class="address-list-wrap">
            <div class="fs16 color-3F4249 font-SCDream3 fw">운송 방법을 선택해주세요.</div>
            <a-flex vertical class="address-list-main mt10" gap="6">
              <template v-for="i in 20">
                <div class="address-list fl-lb p10 cp fl1" :class="i==2?'checked':''" >
                  <a-flex gap="5" class="fl1">
                    <img src="@/assets/img/express/ship.png"/>
                    <div class="fs15 font-SCDream3 text">해운{{i}}</div>
                  </a-flex>
                  <div class="address-list-check"></div>
                </div>
              </template>
            </a-flex>
          </a-flex>
          <a-flex vertical class="fl-tc mlr10" gap="10">
            <RightOutlined class="color-cfd2da h25" />
            <a-divider type="vertical" class="divider-vertical" />
          </a-flex>
          <a-flex vertical class="address-list-wrap">
            <div class="fs16 color-3F4249 font-SCDream3 fw">통관 방법을 선택해주세요.</div>
            <a-flex vertical class="address-list-main mt10" gap="6">
              <template v-for="i in 20">
                <div class="address-list fl-lb p10 cp" :class="i==3?'checked':''" >
                  <a-flex gap="5" class="fl1">
                    <div class="fs15 font-SCDream3 text">목록통관{{i}}</div>
                  </a-flex>
                  <div class="address-list-check"></div>
                </div>
              </template>
            </a-flex>
          </a-flex>
        </a-flex>
      </a-flex>
      <a-divider type="vertical" style="height: inherit;background-color: #E4E7EC" />
      <a-flex vertical class="step2 w50" gap="30">
        <div class="fs20 font-SCDream6 color-535660">2.수령인 정보를 입력해주세요.</div>
        <a-flex class="fl-ta" gap="30">
          <a-flex vertical class="left">
              <a-flex vertical>
                <div class="fs15 color-3F4249">
                  <span>수령인</span><span class="color-2755f9">*</span>
                </div>
                <a-flex class="fl-tc mt10" gap="10">
                  <a-input class="bg-F1F3F8 b0" placeholder="이름을 입력해주세요." style="width: 236px" />
                  <div class="fl-tc fl-la toggle-tab bg-F1F3F8 br10 fs14 color-898f9e p6">
                    <div class="checked fl-cc cp">내국인</div>
                    <div class="cp">외국인</div>
                  </div>
                </a-flex>
              </a-flex>
            <a-flex vertical class="mt20">
              <div class="fs15 color-3F4249">
                <span>연락처</span><span class="color-2755f9">*</span>
              </div>
              <a-flex class="fl-tc mt10" gap="10">
                <a-input class="bg-F1F3F8 b0" placeholder="전화번호를 입력해주세요." style="width: 285px" />
                <a-button class="btn1 h44 br10 color-3F4249 fs14">주소목록</a-button>
              </a-flex>
            </a-flex>
            <a-flex vertical class="mt20">
              <div class="fs15 color-3F4249">
                <span>개인통관고유부호</span><span class="color-2755f9">*</span>
              </div>
              <a-flex class="fl-tc mt10" gap="10">
                <a-input class="bg-F1F3F8 b0" placeholder="P로 시작하는 11자리" style="width: 285px" />
                <a-button class="btn1 h44 br10 bg-535660 t-white fs14">부호검증</a-button>
              </a-flex>
            </a-flex>
            <a-flex vertical class="mt20">
              <div class="fs15 color-3F4249">
                <span>우편번호</span><span class="color-2755f9">*</span>
              </div>
              <a-flex class="fl-tc mt10" gap="10">
                <a-input class="bg-F1F3F8 b0" placeholder="우편번호를 검색하세요." style="width: 285px" />
                <a-button class="btn1 h44 br10 bg-535660 t-white fs14">우편검색</a-button>
              </a-flex>
            </a-flex>
            <a-flex vertical class="mt20">
              <div class="fs15 color-3F4249">
                <span>주소</span><span class="color-2755f9">*</span>
              </div>
              <a-flex class="fl-tc mt10" gap="10">
                <a-input class="bg-F1F3F8 b0" placeholder="주소를 입력해주세요." />
              </a-flex>
              <div class="fs13 color-898f9e mt6">우편검색 시 자동으로 입력됩니다.</div>
            </a-flex>
            <a-flex vertical class="mt20">
              <div class="fs15 color-3F4249">
                <span>상세주소</span><span class="color-2755f9">*</span>
              </div>
              <a-flex class="fl-tc mt10" gap="10">
                <a-input class="bg-F1F3F8 b0" placeholder="상세주소를 입력해주세요." />
              </a-flex>
            </a-flex>
          </a-flex>
          <a-flex vertical class="step2-right" gap="15">
            <div class="fs15 color-3F4249 font-SCDream3">국내 택배사 요청사항</div>
            <a-select ref="select" value="CJ 대한통운">
              <a-select-option value="CJ 대한통운">CJ 대한통운</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
            </a-select>
            <a-select ref="select" value="(선택사항)직접입력">
              <a-select-option value="(선택사항)직접입력">(선택사항)직접입력</a-select-option>
              <a-select-option value="lucy">Lucy</a-select-option>
            </a-select>
            <div class="fs15 color-3F4249">토스토스 물류센터 요청사항</div>
            <a-input placeholder="요청사항이 있다면 입력해주세요." class="bg-F1F3F8" />
          </a-flex>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-flex vertical class="step3 bg-F1F3F8" gap="20">
      <a-flex class="fl-tc">
        <div class="step3-text bg-white fl00">
          <div class="fs20 color-535660 font-SCDream6">3.상품을 추가해주세요.</div>
          <div class="fs16 color-6B6F7C lh24 mt10">상품의 유형 및 총 금액에 따라<br>배송 유형과 통관 방법이 변경됩니다.</div>
          <a-flex class="fl-lb fl-tc mt30">
            <div class="fs15 color-535660">통관유형</div>
            <a-button shape="round" class="fs13 t-white bg-2755f9">주소목록</a-button>
          </a-flex>
          <a-divider class="mtb12" />
          <a-flex class="fl-lb fl-tc">
            <div class="fs15 color-535660">배송유형</div>
            <a-flex class="fl-tc" gap="5">
              <img src="@/assets/img/express/number-one-hui.png" width="18" height="18"/>
              <div class="fs15 color-6B6F7C">단독배송</div>
            </a-flex>
          </a-flex>
          <a-divider class="mtb12" />
          <a-flex class="fl-lb fl-tc">
            <div class="fs15 color-535660">총 수량</div>
            <div class="fs16 color-2755f9 font-SCDream6">1,335개</div>
          </a-flex>
          <a-divider class="mtb12" />
          <a-flex class="fl-lb fl-tc">
            <div class="fs15 color-535660">총 금액</div>
            <div class="fs16 color-2755f9 font-SCDream6">2,961,945원</div>
          </a-flex>
        </div>
        <a-flex vertical class="step3-add-list-wrap-border" gap="30">
          <a-flex class="step3-add-list-wrap plr20" gap="20">
            <div class="step3-add-list fl00" v-for="i in 3">
              <a-flex class="step3-title fl-lb fl-tc h56 plr16">
                <a-flex class="fl-tc" gap="10">
                  <div>5. 상품</div>
                  <a-button shape="round" class="fs13 t-white bg-2755f9">주소목록</a-button>
                </a-flex>
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/copy.png" width="15" height="18"/>
                  <a-divider type="vertical" style="background-color: #E4E7EC;height: 17px;" />
                  <CloseOutlined class="color-969DAE fs17"/>
                </a-flex>
              </a-flex>
              <a-flex vertical class="p16" gap="14">
                <a-flex style="height: 100px" gap="10">
                  <a-upload
                    v-model:file-list="fileList"
                    name="avatar"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    action=""
                    @change=""
                    style="width: 100px"
                  >
                    <img v-if="1!=1" src="@/assets/img/express/copy.png" />
                    <div v-else>
                      <img src="@/assets/img/express/add_photo.png" />
                      <div class="ant-upload-text mt10 fs15 color-969DAE">직접 업로드</div>
                    </div>
                  </a-upload>
                  <a-flex vertical class="fl-lb">
                    <div class="fs13 lh18 color-3F4249">상품의 이미지를 URL로 입력 또는 직접 업로드해주세요.</div>
                    <a-input placeholder="이미지 URL을 입력해주세요." style="height: 44px;border: 0;background: #f1f3f8" />
                  </a-flex>
                </a-flex>
                <a-input placeholder="구매사이트 URL" class="h44 bg-F1F3F8 b0" />
                <a-flex class="step3-order">
                  <a-input placeholder="구매 쇼핑몰의 주문번호를 입력하세요." class="h50 br10" />
                  <div class="placeholder fs13 color-535660">쇼핑몰 주문번호</div>
                </a-flex>
                <a-flex class="fl-lb" gap="10">
                  <a-flex class="step3-order step3-find fl1">
                    <a-input placeholder="트래킹 번호를 입력해주세요." class="h50 br10" />
                    <div class="placeholder fs13 color-2755f9">트래킹 번호</div>
                  </a-flex>
                  <a-button class="fs14 color-3F4249 h50">멀티</a-button>
                </a-flex>
                <div class="fs12 color-898f9e">2개 이상의 트래킹 번호는 ‘멀티’버튼을 눌러 입력해주세요.</div>
                <a-input placeholder="상품 유형을 검색해주세요." class="step3-goods-type h44 bg-F1F3F8 b0">
                  <template #prefix>
                    <span class="color-2755f9">*</span>
                  </template>
                  <template #suffix>
                    <SearchOutlined class="fs17" />
                  </template>
                </a-input>
                <a-flex gap="10">
                  <a-input placeholder="영문 상품명" class="step3-goods-type h44 bg-F1F3F8 b0 w50">
                    <template #prefix>
                      <span class="color-2755f9">*</span>
                    </template>
                  </a-input>
                  <a-input placeholder="중문 상품명" class="step3-goods-type h44 bg-F1F3F8 b0 w50">
                    <template #prefix>
                      <span class="color-2755f9">*</span>
                    </template>
                  </a-input>
                </a-flex>
                <a-flex gap="20">
                  <a-input placeholder="단가(USD, $)" class="step3-goods-type h44 bg-F1F3F8 b0 w50">
                    <template #prefix>
                      <span class="color-2755f9">*</span>
                    </template>
                  </a-input>
                  <a-flex gap="10" class="fl-tc">
                    <div class="step3-number-sub fl-cc fl10"><MinusOutlined class="t-white fs14 cp" /></div>
                    <a-input placeholder="수량" class="step3-goods-type h44 bg-F1F3F8 b0">
                      <template #prefix>
                        <span class="color-2755f9">*</span>
                      </template>
                    </a-input>
                    <div class="step3-number-add fl-cc fl10"><PlusOutlined class="t-white fs14 cp" /></div>
                  </a-flex>
                </a-flex>
                <a-input placeholder="브랜드 및 모델명 (예 : Apple Iphone 15Pro Max)" class="h44 bg-F1F3F8 b0" />
                <a-flex gap="10">
                  <a-input placeholder="색상" class="step3-goods-type h44 bg-F1F3F8 b0 w50" />
                  <a-input placeholder="사이즈" class="step3-goods-type h44 bg-F1F3F8 b0 w50" />
                </a-flex>
              </a-flex>
            </div>
            <a-flex vertical class="step3-add br24 p16 fl-cc fl00">
              <PlusOutlined class="color-898f9e add" />
              <div class="fs20 color-898f9e mt10">새 상품 추가하기</div>
              <a-flex class="fl-lb t-white br10 bg-535660 h44 fl-tc plr16 mt40 w100">
                <div class="fs14">나의 재고 목록</div>
                <div class="fs13">추가하기</div>
              </a-flex>
              <a-flex class="fl-lb t-white br10 bg-535660 h44 fl-tc plr16 mt10 w100">
                <div class="fs14">주문 내역 자동 등록</div>
                <a-button class="bg-2755f9 h26 br8 plr8 t-white b0">Auto</a-button>
              </a-flex>
            </a-flex>
          </a-flex>
          <a-flex class="step3-page h40 fl-cc " gap="10">
            <div class="page-start"><VerticalRightOutlined /></div>
            <div class="page-prev"><LeftOutlined /></div>
            <a-flex class="page-list mlr20" gap="20">
              <div class="fs14 color-3F4249 fw" v-for="i in 6">{{i}}</div>
            </a-flex>
            <div class="page-next"><RightOutlined /></div>
            <div class="page-end"><VerticalLeftOutlined /></div>
            <div class="fs14 color-969DAE">총 6까지</div>
          </a-flex>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-flex class="step4">
      <div class="fs20 color-535660 font-SCDream6">4.신청할 옵션을 선택해주세요.</div>
      <a-flex class="mt30">
        <a-flex vertical>
          <div class="fs16 color-3F4249">검수</div>
          <a-flex class="fl-lb fl-tc">
            <a-flex>

            </a-flex>
          </a-flex>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-flex class="step5"></a-flex>
    <a-flex class="step-agree"></a-flex>
  </div>
  </a-modal>
</template>

<script setup>
import {computed, createVNode, reactive, ref, toRefs, watchEffect} from "vue";
import {
  RightOutlined,
  CloseOutlined,
  SearchOutlined,
  MinusOutlined,
  PlusOutlined,
  VerticalRightOutlined,
  LeftOutlined,
  VerticalLeftOutlined,
} from "@ant-design/icons-vue";
import InputOn from "@/components/inputOn.vue";
const state = reactive({
  confirmLoading:false,
});
const emit = defineEmits(["close", "update"]);
const props = defineProps({
  visible: Boolean,
});
let visible = computed({
  get: () => !props.visible, // getter
  set: (value) => emit("close") // setter
});
const onClose = () => {
  emit("close");
};
</script>
<style>
.expressView .ant-modal-content{
  background: #fff;
  padding: 40px 200px;
  height: 100%!important;
}
.express-view .step2 input{
  height: 44px;
}
.express-view .step3 .ant-upload-select{
  width: 100px;
  height: 100px;
  border: none!important;
  background: #f1f3f8!important;
  border-radius: 16px!important;
}
.express-view .step3-goods-type input{
  background: #f1f3f8;
}
</style>
<style scoped>
.step1{
  height: 584px;
}
.address-list-wrap{
  width: 226px;
  height: 584px;
}
.address-list.checked{
  border: 2px solid #2755F9;
  border-radius: 10px;
  background: #f1f3f8;
}
.address-list-main{
  overflow: hidden;
  overflow-y: scroll;
}
.address-list-main::-webkit-scrollbar {
  display: none;
}
.address-list-check{
  width: 24px;
  height: 24px;
  background: #f1f3f8;
  border-radius: 50%;
  position: relative;
}
.address-list-check:before{
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%) rotate(-45deg);
  width: 11px;
  height: 6px;
  border-left: 3px solid #cfd2da;
  border-bottom: 3px solid #cfd2da;
}
.address-list.checked .address-list-check{
  background: #2755F9;
}
.address-list.checked .text{
  color: #2755F9;
}
.address-list.checked .address-list-check:before{
  border-left: 3px solid white;
  border-bottom: 3px solid white;
}
.divider-vertical{
  height: 540px;
  background-color: #E4E7EC;
}
.step2 .left{
  width: 375px;
}
.toggle-tab{
  width: 129px;
  height: 44px;
}
.toggle-tab .checked{
  width: 54px;
  height: 34px;
  color: #2755F9;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 2px 4px 10px 0 rgba(0,0,0,0.1);
}
.step2-right{
  width: 375px;
}
.step3{
  width: 100%;
  height: 882px;
}
.step3-text{
  width: 340px;
  height: 882px;
  padding: 60px 40px;
  border: 1px solid #E4E7EC;
  box-shadow: 4px 4px 20px 0 rgba(0,0,0,.1);
}
.step3-add-list-wrap-border{
  width: calc(100% - 340px);
}
.step3-add-list-wrap{
  width: 100%;
  height: 730px;
  overflow: hidden;
  overflow-x: auto;
}
.step3-add-list-wrap::-webkit-scrollbar{
  height: 6px;
}
.step3-add-list-wrap::-webkit-scrollbar-track {
  background-color: transparent;
}
.step3-add-list-wrap::-webkit-scrollbar-thumb {
  background-color: #cfd2da;
  border-radius: 10px;
}
.step3-add-list{
  width: 340px;
  height: 706px;
  background: #fff;
  border-radius: 24px;
  border: 1px solid #E4E7EC;
  box-shadow: 2px 4px 10px 0 rgba(0,0,0,.1);
}
.step3-title{
  border-bottom: 1px solid #E4E7EC;
}
.step3-order{
  position: relative;
}
.step3-order .placeholder{
  position: absolute;
  top: -8px;
  left: 10px;
  background: #fff;
  padding: 0 6px;
}
.step3-order input{
  border: 2px solid #cfd2da;
}
.step3-order.step3-find input{
  border: 2px solid #5277fa;
}
.step3-number-sub,.step3-number-add{
  width: 30px;
  height: 30px;
  background: #6b6f7c;
  border-radius: 50%;
}
.step3-add{
  width: 340px;
  height: 706px;
  border: 2px solid #cfd2da;
}
.step3-add .add{
  font-size: 34px;
  color: #898F9E;
}
.step3-page .page-start,.step3-page .page-end,.step3-page .page-prev,.step3-page .page-next{
  width: 40px;
  height: 40px;
  border: 1px solid #E4E7EC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>