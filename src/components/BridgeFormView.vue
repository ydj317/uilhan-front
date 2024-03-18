<template>
  <a-modal v-model:open="visible" :title="bridgeFormData.type === 'puragent' ? '구매대행 신청' : '배송대행 신청서'" width="100%" wrap-class-name="full-modal"
           :confirm-loading="state.confirmLoading" @ok="handleOk" @cancel="onClose" class="showModal" :footer="null">
    <a-row>
      <a-divider class="divider bg-b mb10"></a-divider>
      <span class="title mb10">서비스 신청 유의사항</span>
      <a-textarea v-model:value="state.textareaValue" disabled class="textarea mb10"/>
      <a-space>
        <a-checkbox></a-checkbox>
        <span class="cor-ora fs12">주의사항을 모두 숙지하였으며 위 약관에 동의합니다.</span>
      </a-space>
      <a-divider class="bg-f mt10"></a-divider>
    </a-row>
    <a-row class="step1">
      <span class="title mb10">STEP 01&nbsp;&nbsp;&nbsp;&nbsp;배송받을 물류센터를 선택해주세요.</span>
      <a-divider class="divider bg-b mt0 mb10"></a-divider>
      <a-flex class="ml30 flex-wrap" vertical>
        <a-radio-group v-model:value="state.radioType">
          <a-radio value="위해해운">위해해운</a-radio>
          <a-radio value="위해항공">위해항공</a-radio>
          <a-radio value="국내3PL">국내3PL</a-radio>
        </a-radio-group>
        <a-textarea :rows="2" class="mt10 mb10 textarea2"/>
        <div class="fs12">※ 00배송에서는 합배송, 단독배송 관련없이 하나의 신청서로 배송신청이 모두 완료됩니다.</div>
      </a-flex>
      <a-divider class="bg-f mt10"></a-divider>
    </a-row>
    <a-row class="mb15">
      <span class="title mb10">STEP 02&nbsp;&nbsp;&nbsp;&nbsp;수입방식을 선택해주세요.</span>
      <a-divider class="divider bg-b mt0 mb10"></a-divider>
      <a-flex class="ml30" vertical>
        <a-radio-group v-model:value="state.radioType">
          <a-radio value="위해해운">위해해운</a-radio>
        </a-radio-group>
      </a-flex>
      <a-divider class="bg-f mt10"></a-divider>
    </a-row>
    <a-row>
      <span class="title mb10">STEP 03&nbsp;&nbsp;&nbsp;&nbsp;수령자 정보를 입력해주세요.</span>
      <a-divider class="divider bg-b mt0 mb0"></a-divider>
    </a-row>
    <a-row class="bottom-border">
      <a-col :span="3" class="center bg-fa">수령자</a-col>
      <a-col :span="21" class="pt10">
        <a-row class="mb10">
          <a-col :span="4" class="center">한글</a-col>
          <a-col :span="15" class="center"><a-input /></a-col>
          <a-col :span="5" class="center"><a-button type="default" class="step3-button bg-f">주소록 가져오기</a-button></a-col>
        </a-row>
        <a-row class="mb5">
          <a-col :span="4" class="center">영문</a-col>
          <a-col :span="15"><a-input placeholder="※ 사업자 영문명은 반드시 수정해주세요."  /></a-col>
          <a-col :span="5" class="center"></a-col>
        </a-row>
        <a-row>
          <a-col :span="4" class="center"></a-col>
          <a-col :span="10" class="fs12">*한글발음 그대로 입력시 통관지연</a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bottom-border">
      <a-col :span="3" class="center bg-fa">수령자 정보</a-col>
      <a-col :span="21" class="mt10 mb10">
        <a-row class="center">
          <a-col :span="9" class="pl70">
            <a-radio-group value="개인통관고유부호">
              <a-radio value="개인통관고유부호" class="mr30">개인통관고유부호
                <a-tooltip>
                <template #title>
                  <div>tip</div>
                </template>
                <QuestionCircleOutlined />
              </a-tooltip>
            </a-radio>
              <a-radio value="사업자등록번호">사업자등록번호</a-radio>
            </a-radio-group>
          </a-col>
          <a-col :span="10">
            <a-input />
          </a-col>
          <a-col :span="5" align="center">
            <a-button type="primary" class="step3-button">개인통관번호 조회</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bottom-border">
      <a-col :span="3" class="center bg-fa">연락처 및주소</a-col>
      <a-col :span="21" class="pt10">
        <a-row class="mb10">
          <a-col :span="4" class="center">연락처</a-col>
          <a-col :span="15" class="center"><a-input /></a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="4" class="center">우편번호</a-col>
          <a-col :span="15" class="center"><a-input /></a-col>
          <a-col :span="5" class="center"><a-button type="default" class="bg-f step3-button">우편번호 검색</a-button></a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="4" class="center">한글주소</a-col>
          <a-col :span="15"><a-input placeholder="※ 시, 군, 구를 띄어쓰기로 정확히 입력해주세요."  /></a-col>
          <a-col :span="5" class="center"></a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="4" class="center"></a-col>
          <a-col :span="10" class="fs12">예시: 서울시 강남구 청담동 123</a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="4" class="center">상세주소</a-col>
          <a-col :span="15"><a-input placeholder="※ 도로명 주소를 입력해주세요."  /></a-col>
          <a-col :span="5" class="center"></a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="4" class="center"></a-col>
          <a-col :span="10" class="fs12">*지번주소 기재시 통관/세관에서 오류분류로 통관지연</a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="4" class="center">영문주소</a-col>
          <a-col :span="15" class="center"><a-input /></a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="4" class="center">영문상세주소</a-col>
          <a-col :span="15" class="center"><a-input /></a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bottom-border">
      <a-col :span="3" class="center bg-fa">배송 요청사항</a-col>
      <a-col :span="21" class="pt10">
        <a-row class="mb10">
          <a-col :span="1"></a-col>
          <a-col :span="18">
            <a-select value="직접기재" class="step3-select">
              <a-select-option value="직접기재">직접기재</a-select-option>
              <a-select-option value="직접기재2">직접기재2</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="1"></a-col>
          <a-col :span="18">
            <a-input placeholder="국내 배송기사님께 전달 요청사항을 남겨주세요." />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bottom-border">
      <a-col :span="3" class="center bg-fa">마킹번호</a-col>
      <a-col :span="21" class="pt10">
        <a-row class="mb10">
          <a-col :span="1"></a-col>
          <a-col :span="18">
            <a-input/>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="mt30">
      <span class="title mb10">STEP 04&nbsp;&nbsp;&nbsp;&nbsp;상품 정보를 입력해주세요.</span>
      <a-divider class="divider bg-b mt0 mb0"></a-divider>
    </a-row>
    <a-row class="mt20 bottom-border pb10">
      <a-col :span="3" class="cor-ora">상품 #01</a-col>
      <a-col :span="21" class="step4-end">
        <a-space>
          <a-button type="primary">장바구니 & 주문복사</a-button>
          <a-button class="bg-black cor-white">상품 불러오기</a-button>
          <a-button class="bg-black cor-white">재고 불러오기</a-button>
          <a-button class="bg-black cor-white">상품복사</a-button>
          <a-button class="bg-black cor-white">+ 상품추가</a-button>
          <a-button class="bg-black cor-white">- 상품삭제</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="bottom-border">
      <a-col :span="3" class="center bg-fa text-center">트래킹번호Tracking No.</a-col>
      <a-col :span="21" class="pt10">
        <a-row class="mb10">
          <a-col :span="1"></a-col>
          <a-col :span="5">
            <a-select value="申通" class="step4-select">
              <a-select-option value="申通">申通</a-select-option>
              <a-select-option value="申通2">申通2</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="18" class="center"><a-input/></a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="1"></a-col>
          <a-col :span="23">
            <a-checkbox class="mr10" checked></a-checkbox>
            <span class="fs12">트래킹번호 나중에 입력</span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bottom-border">
      <a-col :span="3" class="center bg-fa">오더번호</a-col>
      <a-col :span="21" class="pt10">
        <a-row class="mb10">
          <a-col :span="1"></a-col>
          <a-col :span="23">
            <a-input/>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bottom-border">
      <a-col :span="3" class="bg-fa pt30 step4-left">
        <a-row class="ml10">
          <a-upload
                  name="avatar"
                  list-type="picture-card"
                  class="avatar-uploader"
          >
            <img v-if="state.avatar"  alt="avatar"/>
            <div v-else>
              <div class="ant-upload-text fs12">이미지 URL<br>입력해주세요</div>
            </div>
          </a-upload>
        </a-row>
        <a-row>
          <a-button class="bg-black cor-white">이미지등록</a-button>
        </a-row>
      </a-col>
      <a-col :span="21" class="pt10">
        <a-row class="mb10">
          <a-col :span="6" class="step4-right-text pl30">통관품목<span class="red">*</span></a-col>
          <a-col :span="18">
            <a-select value="- 1차 카테고리 -" class="step4-select2">
              <a-select-option value="- 1차 카테고리 -">- 1차 카테고리 -</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="6" class="step4-right-text pl30"></a-col>
          <a-col :span="18">
            <a-select value="품목은 정확하게 선택해주세요. (세관신고)"  class="step4-select2">
              <a-select-option value="품목은 정확하게 선택해주세요. (세관신고)">품목은 정확하게 선택해주세요. (세관신고)</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="6" class="step4-right-text pl30"></a-col>
          <a-col :span="18" class="fs12">
            *카테고리에 없는 품목은 직접 영문명 상세기재 바랍니다.
          </a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="6" class="step4-right-text pl30">상품명 (영문)</a-col>
          <a-col :span="18" class="help-input-wrap">
            <a-input placeholder="※ 대표품목, 특수문자, 한글입력금지" ref="step3-input" @change="step3Input"  />
<!--            <span class="help-input">입력금지</span>-->
          </a-col>
        </a-row>
        <a-row class="mb10 bottom-border pb10">
          <a-col :span="6" class="step4-right-text pl30"></a-col>
          <a-col :span="18" class="fs12">
            *0000을 해주셔야 통관지인을 막올수 있습니다.
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30">단가<span class="red">*</span></a-col>
          <a-col :span="8">
            <a-input suffix="위안" />
          </a-col>
          <a-col :span="1" class="center">X</a-col>
          <a-col :span="9">
            <a-input suffix="EA" />
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30">옵션<span class="red">*</span></a-col>
          <a-col :span="2" class="center">색상</a-col>
          <a-col :span="6">
            <a-input />
          </a-col>
          <a-col :span="2" class="center">상품단위</a-col>
          <a-col :span="8">
            <a-input placeholder="叫:件/双/千克" />
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30">모멜명/재질/규격/사이즈<span class="red">*</span></a-col>
          <a-col :span="8">
            <a-input placeholder="KF94/100ML*30支/水20ML乳20ML" />
          </a-col>
          <a-col :span="2" class="center">순량(KG)</a-col>
          <a-col :span="8">
            <a-input placeholder="한개/SET 상품의 순량" />
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30">브랜드 (영문)<span class="red">*</span></a-col>
          <a-col :span="18">
            <a-input  value="NO" />
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30">브랜드 (중문)<span class="red">*</span></a-col>
          <a-col :span="18">
            <a-input  value="没有" />
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30">국내판매 쇼핑몰 URL</a-col>
          <a-col :span="18">
            <a-input  value="" />
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30">자체관리 코드</a-col>
          <a-col :span="8">
            <a-input  placeholder="표준상품코드 작성 요망 (请填写标准商品条码)" />
          </a-col>
          <a-col :span="2" class="center">원산지</a-col>
          <a-col :span="8">
            <a-input placeholder="한글 입력금지" />
          </a-col>
        </a-row>
        <a-row class="mb10">
          <a-col :span="6" class="step4-right-text pl30">상품URL<span class="red">*</span></a-col>
          <a-col :span="18">
            <a-input placeholder="※ 배송대행 상품금액 세관신고 증명서류입니다. 중국쇼핑몰 URL 추천합니다."  />
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30"></a-col>
          <a-col :span="18"  class="fs12">
            *검수가 필요하신 분들은 정확한 URL주소를 력하세요. 상품URL이 없는 경우 구매영수증URL을 직 입력하세요.
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30">이미지 URL URL<span class="red">*</span></a-col>
          <a-col :span="18">
            <a-input  value="" />
          </a-col>
        </a-row>
        <a-row class="mb10 pb10">
          <a-col :span="6" class="step4-right-text pl30">오픈마켓 주문번호</a-col>
          <a-col :span="18">
            <a-input  value="" />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="mt10">
      <a-col :span="24" class="step4-money-wrap bg-black pl40">금액 정보</a-col>
    </a-row>
    <a-row class="bg-fa bottom-border pt20 pb20">
      <a-col :span="20" class="pl40">총 수량</a-col>
      <a-col :span="4" class="pr20 text-right"><span class="col-blue fw fs20">2</span> EA</a-col>
    </a-row>
    <a-row class="bg-fa bottom-border pt20 pb20">
      <a-col :span="20" class="pl40">총 금액</a-col>
      <a-col :span="4" class="pr20 text-right"><span class="col-blue fw fs20">1900.00</span>위안</a-col>
    </a-row>
    <a-row class="bg-fa pt20 pb20">
      <a-col :span="24" class="pl40 fs12">※ 세관에 신고되는 금액입니다. (해외직구: 해외 판매처 구매 원가 기재 / 해외구매대행업: 국내 오픈마켓 판매가 기재)</a-col>
      <a-col :span="24" class="pl40 fs12">※ 총 금액이 150달러를 넘을 경우 간이통관 (일반통관)으로 진행되며 관/부가세가 발생할 수 있습니다.</a-col>
    </a-row>
    <a-row class="bg-fa pb20 pr20 btn-wrap" justify="end">
      <a-button type="default" class="mr5">단독배송</a-button>
      <a-button type="default">일반통관</a-button>
    </a-row>
    <a-row class="mt30">
      <span class="title mb10">STEP 05&nbsp;&nbsp;&nbsp;&nbsp;요청사항을 선택해주세요.</span>
      <a-divider class="divider bg-b mt0 mb0"></a-divider>
    </a-row>
  <a-row class="step5 bottom-border">
    <a-col :span="3" class="center bg-fa">검수옵션</a-col>
    <a-col :span="21" class="pt25 pb25 pl20">
        <a-checkbox class="mr15">검수안함&nbsp;<a-tag color="blue">무료</a-tag></a-checkbox>
        <a-checkbox class="mr15">정밀검수&nbsp;<a-tag color="red">3,000원</a-tag></a-checkbox>
        <a-checkbox class="mr15">작동검수&nbsp;<a-tag color="red">3,000원</a-tag></a-checkbox>
        <a-checkbox>기본검수&nbsp;<a-tag color="blue">무료</a-tag></a-checkbox>
    </a-col>
  </a-row>
  <a-row class="step5 bottom-border">
      <a-col :span="3" class="center bg-fa">포장옵션</a-col>
      <a-col :span="21" class="right-content pt25 pb25 pl20">
          <a-checkbox class="mr15 mb10">깨짐주의스티커&nbsp;<a-tag color="blue">무료</a-tag></a-checkbox>
          <a-checkbox class="mr15">박스 재포장&nbsp;<a-tag color="red">1,000원</a-tag></a-checkbox>
          <a-checkbox class="mr15">모서리 보호대&nbsp;<a-tag color="red">2,000원</a-tag></a-checkbox>
          <a-checkbox class="mr15">스틱형 에어캡&nbsp;<a-tag color="red">1,500원</a-tag></a-checkbox>
          <a-checkbox class="mr15">밴딩포장&nbsp;<a-tag color="red">2,000원</a-tag></a-checkbox>
          <a-checkbox class="mr15">폴리백포장&nbsp;<a-tag color="red">500원</a-tag></a-checkbox>
          <a-checkbox class="mr15">고급 폴리백포장&nbsp;<a-tag color="red">1,000원</a-tag></a-checkbox>
          <a-checkbox class="mr15">기본뿌뿌이&nbsp;<a-tag color="red">1,000원</a-tag></a-checkbox>
          <a-checkbox class="mr15">나무 특수포장&nbsp;<a-tag color="red">20,000원</a-tag></a-checkbox>
          <a-checkbox class="mr15">발포지&nbsp;<a-tag color="red">1,000원</a-tag></a-checkbox>
          <a-checkbox>내품보안포장&nbsp;<a-tag color="red">1,000원</a-tag></a-checkbox>
      </a-col>
  </a-row>
  <a-row class="step5 bottom-border">
      <a-col :span="3" class="center bg-fa">제거옵션</a-col>
      <a-col :span="21" class="pt25 pb25 pl20">
          <a-checkbox class="mr15">신발의류박스 제거&nbsp;<a-tag color="blue">무료</a-tag></a-checkbox>
          <a-checkbox>영수증 제거&nbsp;<a-tag color="blue">무료</a-tag></a-checkbox>
      </a-col>
  </a-row>
  <a-row class="step5 bottom-border">
      <a-col :span="3" class="center bg-fa">통관옵션</a-col>
      <a-col :span="21" class="right-content pt25 pb25 pl20">
          <a-checkbox class="mr15 mb10">목록통관&nbsp;<a-tag color="blue">무료</a-tag></a-checkbox>
          <a-checkbox class="mr15">간이통관 수수료&nbsp;<a-tag color="red">3,300원</a-tag></a-checkbox>
          <a-checkbox class="mr15">사업자통관 수수료&nbsp;<a-tag color="red">33,000원</a-tag></a-checkbox>
          <a-checkbox class="mr15">원산지증명발급&nbsp;<a-tag color="red">40,000원</a-tag></a-checkbox>
          <a-checkbox class="mr15">B/L비용&nbsp;<a-tag color="red">30,000원</a-tag></a-checkbox>
          <a-checkbox>컨테이너 작업비&nbsp;<a-tag color="red">30,000원</a-tag></a-checkbox>
      </a-col>
  </a-row>
  <a-row class="step5 bottom-border">
      <a-col :span="3" class="center bg-fa">기타옵션</a-col>
      <a-col :span="21" class="right-content pt25 pb25 pl20">
          <a-checkbox class="mr15 mb10">멀티박스&nbsp;<a-tag color="red">3,000원</a-tag></a-checkbox>
          <a-checkbox class="mr15">관/부가세 선불&nbsp;<a-tag color="red">3,300원</a-tag></a-checkbox>
          <a-checkbox class="mr15">도서산간&nbsp;<a-tag color="red">3,300원</a-tag></a-checkbox>
          <a-checkbox class="mr15">경동택배비용 선불</a-checkbox>
          <a-checkbox class="mr15">220V돼지코&nbsp;<a-tag color="red">1,500원</a-tag></a-checkbox>
          <a-checkbox class="mr15">원산지 작업 (스티커/미싱)&nbsp;<a-tag color="orange">유료</a-tag></a-checkbox>
          <a-checkbox>부피무게&nbsp;<a-tag color="orange">즉정</a-tag></a-checkbox>
      </a-col>
  </a-row>
  <a-row class="step5 bottom-border">
      <a-col :span="3" class="center bg-fa">물류 요청사항</a-col>
      <a-col :span="21" class="right-content pt25 pb25 pl20">
         <a-input></a-input>
      </a-col>
  </a-row>
  <a-row class="btn-wrap mt50">
      <a-col :span="24" class=" center pt25 pb25 pl20">
          <a-button class="mr20">접수대기</a-button>
          <a-button>접수신청</a-button>
      </a-col>
  </a-row>
  <a-row class="bg-black footer-wrap pt30 pb30 mt20">
      <a-col :span="24" class="center pt25 pb25 pl20">
          <div class="mb5"><span class="red">※</span>입고된 물품은 수정이 <span class="under-line">불가능</span>합니다. 트래킹번호 추가 등 수정이 필요하신 경우 <span class="under-line">접수대기</span>를 선택해주세요.<span class="red">※</span></div>
          <div><span class="red">※</span><span class="under-line">접수신청</span>을 완료하신 후 부득이한 사유로 요청서 <span class="under-line">수정</span>이 필요한 경우 <span class="under-line">1:1문의</span>해주세요.<span class="red">※</span></div>
      </a-col>
  </a-row>
  </a-modal>
</template>

<script setup>
import {toRefs, watchEffect, reactive, computed} from 'vue'
import {message} from "ant-design-vue";
import {ExclamationCircleOutlined, UploadOutlined} from '@ant-design/icons-vue';
import {useMarketOrderApi} from "@/api/order";
import {useBridgeApi} from "@/api/bridge";
import Cookie from "js-cookie";
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import {
  QuestionCircleOutlined,
} from "@ant-design/icons-vue";

const props = defineProps({
  visible: Boolean,
  bridgeFormData: {
    type: Object
  }
})

const {bridgeFormData} = toRefs(props)
const emit = defineEmits(['close','update'])

const state = reactive({
  form: {
    id: '',
    order_id: '',
    app_type: bridgeFormData.value.type === 'puragent' ? '구매대행' : '배송대행',
    region: '칭다오', // 물류센터
    ctr_seq: '해운', // 배송방법
    receiver_name: '',
    receiver_name_en: '',
    receiver_tel1: '',
    receiver_addr1: '',
    receiver_addr2: '',
    receiver_addr1_en: '',
    receiver_addr2_en: '',
    receiver_post_code: '',
    message: '',
    items: [],

    rrn_cd: '목록통관', // 통관방법
    fileList: [], // 사업자등록증첨부파일
    personal_customs_clearance_code: '', // 개인통관 고유번호
    rrn_no_con: ['Y'], // 개인통관 고유번호 확인 오후 8:36 2020-02-21

    EtcDlvr1: [], // 검수옵션
    EtcDlvr2: [], // 포장옵션
    EtcDlvr3: [], // 제거옵션
    EtcDlvr4: [], // 어댓터
    EtcDlvr5: [], // 기타옵션
    EtcDlvr6: [], // 원산지작업
    EtcDlvr7: [], // 원산지작업

    auto_rls_yn: false, // 자동결제여부
    auto_req_yn: false, // 자동출고여부
    market_product_id: '', // 商城商品ID
    req_2: '', // 물류요청사항
  },
  loading: false,
  confirmLoading: false,
  checkClearanceCodeLoading: false,
  categoryData: [],
  uploadHeaders: {
    token: Cookie.get("token")
  },
  uploadUrl: process.env.VUE_APP_API_URL + '/api/bridge/BusilicenseBimgUpload',
  checkPersonalCustomsClearanceCode : false,
  textareaValue:`1. 주문서에 작성된 모든 정보는 세관신고서에 반영되므로 정확하게 작성하셔야 합니다.
  허위정보작성 및 정보 미기재에 의해 발생하는 불이익은 “00배송”에서 책임지지 않습니다.
  2. 주문서에 작성된 모든 정보는 세관신고서에 반영되므로 정확하게 작성하셔야 합니다.
  3. 허위정보작성 및 정보 미기재에 의해 발생하는 불이익은 "00배송”에서 책임지지 않습니다.
  4. 주문서에 작성된 모든 정보는 세관신고서에 반명되므로 정확하게 작성하셔야 합니다.
  5. 허위정보작성 및 정보 미기재에 의해 발생하는 불이익은 “00배송”에서 책임지지 않습니다.`,
  radioType:'위해해운',
  avatar:''
})
const step3Input = ()=>{

}
const onClose = () => {
  emit('close')
}

let visible = computed({
  get: () => props.visible, // getter
  set: (value) => emit('close') // setter
})

// 주문정보 불러오기
const getOrderDetailForBridge = async () => {
  state.loading = true
  await useMarketOrderApi().getOrderDetailForBridge({id: bridgeFormData.value.record.orderId}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    const {marketOrder} = res.data
    state.form.id = marketOrder[0].id
    state.form.order_id = marketOrder[0].orderId
    state.form.receiver_name = marketOrder[0].receiverName
    state.form.receiver_name_en = fnHanEng(marketOrder[0].receiverName)
    state.form.receiver_tel1 = marketOrder[0].receiverTel1
    state.form.receiver_addr1 = marketOrder[0].receiverAddr1
    state.form.receiver_addr2 = marketOrder[0].receiverAddr2
    state.form.receiver_addr1_en = fnHanEng(marketOrder[0].receiverAddr1)
    state.form.receiver_addr2_en = fnHanEng(marketOrder[0].receiverAddr2)
    state.form.receiver_post_code = marketOrder[0].receiverPostCode
    state.form.personal_customs_clearance_code = marketOrder[0].personalCustomsClearanceCode
    state.form.message = marketOrder[0].message
    state.form.items = [];
    marketOrder.forEach(item => {
      state.form.items.push({
        shipNm: 'ycbridge',
        prdCode: item.prdCode,
        orderNo: item.orderNo,
        MALL_ORD_NO: '',
        arc_seq: '',
        prdImage: item.prdImage,
        prdName: item.prdName,
        prdNameCn: item.prdNameCn,
        prdOptionName: item.prdOptionName,
        prdUrl: item.prdUrl,
        quantity: item.quantity,
        unitPrice: item.prdPriceCn,
        itemNo: item.itemNo,
      })
    })
  }).catch(err => {
    message.error(err.message);
  }).finally(() => {
    state.loading = false
  })
}

// 저장
const handleOk = () => {

  if(state.form.rrn_cd === '사업자통관') {
    if(state.form.fileList.length === 0) {
      message.error('사업자등록증을 첨부해 주세요.');
      return false;
    }
    if(state.form.fileList[0].response.data.code !== 2000) {
      message.error(state.form.fileList[0].response.data.message);
      return false;
    }
  }

  if(!state.form.receiver_name){
    message.error("받는 사람을 입력해 주세요.");
    return false;
  }

  if(!state.form.personal_customs_clearance_code){
    message.error("개인통관고유부호를 입력해 주세요.");
    return false;
  }
  if(state.checkPersonalCustomsClearanceCode === false){
    message.error("개인통관고유부호를 확인해 주세요.");
    return false;
  }

  if(!state.form.receiver_tel1){
    message.error("받는 사람 연락처를 입력해 주세요.");
    return false;
  }

  // check arc_seq
  if (state.form.items.some(item => item.arc_seq === '')) {
    message.error('통관품목을 선택해 주세요.');
    return false;
  }

  // check PRO_NM
  if (state.form.items.some(item => item.PRO_NM === '')) {
    message.error('상품명을 입력해 주세요.');
    return false;
  }

  // check PRO_NM_CH
  if (state.form.items.some(item => item.PRO_NM_CH === '')) {
    message.error('중문 상품명을 입력해 주세요.');
    return false;
  }

  // check unitPrice
  if (state.form.items.some(item => item.unitPrice === '')) {
    message.error('단가를 입력해 주세요.');
    return false;
  }

  // check quantity
  if (state.form.items.some(item => item.quantity === '')) {
    message.error('수량을 입력해 주세요.');
    return false;
  }

  // check prdUrl
  if (state.form.items.some(item => item.prdUrl === '')) {
    message.error('상품 URL을 입력해 주세요.');
    return false;
  }

  // check prdImage
  if (state.form.items.some(item => item.prdImage === '')) {
    message.error('이미지 URL을 입력해 주세요.');
    return false;
  }

  showConfirm()
};

const showConfirm = () => {
  Modal.confirm({
    title: '추가 수정 사항은 없으신가요?',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', {style: 'color:red;'}, '*주문 건 정보 수정은 배대지 사이트에서만 가능합니다.'),
    onOk() {
      state.confirmLoading = true;
      useMarketOrderApi().registerBridgeOrder(state.form).then(res => {
        if (res.status !== "2000") {
          message.error(res.message);
          state.confirmLoading = false
          return false;
        }
        state.confirmLoading = false
        message.success(`${state.form.app_type} 신청서가 등록되었습니다.`);
        emit('update')
        emit('close')
      }).catch(err => {
        message.error(err.message);
        state.confirmLoading = false
      })
    },
    onCancel() {
      console.log('Cancel');
    },
    class: 'test',
  });
}

// 한글->영문 이름 번역
const fnHanEng = (pVal) => {

  let sCho, sJung, sChong;

  sCho = [ "G", "Gg", "N", "D", "Tt", "R", "M", "B", "Pp", "S", "Ss", "O",
    "J", "Jj", "Ch", "K", "T", "P", "H" ];
  sJung = [ "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae",
    "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i" ];
  sChong = [ "", "g", "gg", "gs", "n", "nz", "nh", "d", "l", "lg", "lm",
    "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s", "ss", "ng", "z",
    "ch", "k", "t", "p", "h" ];

  var sVal = pVal;

  var t = "";
  var tmp = "";
  var n, n1, n2, n3;
  var c, d;
  let i;
  for (i = 0; i < sVal.length; i++) {
    c = sVal.charAt(i);
    n = parseInt(escape(c).replace(/%u/g, ''), 16);
    if (n >= 0xAC00 && n <= 0xD7A3) {
      n = n - 0xAC00;
      n1 = Math.floor(n / (21 * 28));
      n = n % (21 * 28);
      n2 = Math.floor(n / 28);
      n3 = Math.floor(n % 28);
      tmp = sCho[n1] + sJung[n2] + sChong[n3];
      if (tmp.length > 1 && tmp.charAt(0) == 'O')
        tmp = ("" + tmp.charAt(1)).toUpperCase() + tmp.substring(2);
      if (i == 0) {
        // tmp ="KWON" ;
        if (c == "권") {
          tmp = "KWON";
        } else if (c == "김") {
          tmp = "KIM";
        } else if (c == "이") {
          tmp = "LEE";
        } else if (c == "류") {
          tmp = "RYU";
        } else if (c == "박") {
          tmp = "PARK";
        } else if (c == "최") {
          tmp = "CHOI";
        } else if (c == "오") {
          tmp = "OH";
        } else if (c == "우") {
          tmp = "WOO";
        } else if (c == "주") {
          tmp = "JOO";
        }
      }
      t += tmp;
    } else
      t += c;

  }
  t = t.toUpperCase();
  return t;
}
const fnHanEng2 = (pVal,Target) => {

  let sCho, sJung, sChong;

  sCho = [ "G", "Gg", "N", "D", "Tt", "R", "M", "B", "Pp", "S", "Ss", "O",
    "J", "Jj", "Ch", "K", "T", "P", "H" ];
  sJung = [ "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae",
    "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i" ];
  sChong = [ "", "g", "gg", "gs", "n", "nz", "nh", "d", "l", "lg", "lm",
    "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s", "ss", "ng", "z",
    "ch", "k", "t", "p", "h" ];

  var sVal = pVal;

  var t = "";
  var tmp = "";
  var n, n1, n2, n3;
  var c, d;
  let i;
  for (i = 0; i < sVal.length; i++) {
    c = sVal.charAt(i);
    n = parseInt(escape(c).replace(/%u/g, ''), 16);
    if (n >= 0xAC00 && n <= 0xD7A3) {
      n = n - 0xAC00;
      n1 = Math.floor(n / (21 * 28));
      n = n % (21 * 28);
      n2 = Math.floor(n / 28);
      n3 = Math.floor(n % 28);
      tmp = sCho[n1] + sJung[n2] + sChong[n3];
      if (tmp.length > 1 && tmp.charAt(0) == 'O')
        tmp = ("" + tmp.charAt(1)).toUpperCase() + tmp.substring(2);
      if (i == 0) {
        // tmp ="KWON" ;
        if (c == "권") {
          tmp = "KWON";
        } else if (c == "김") {
          tmp = "KIM";
        } else if (c == "이") {
          tmp = "LEE";
        } else if (c == "류") {
          tmp = "RYU";
        } else if (c == "박") {
          tmp = "PARK";
        } else if (c == "최") {
          tmp = "CHOI";
        } else if (c == "오") {
          tmp = "OH";
        } else if (c == "우") {
          tmp = "WOO";
        } else if (c == "주") {
          tmp = "JOO";
        }
      }
      t += tmp;
    } else
      t += c;

  }
  t = t.toUpperCase();
  state.form[Target] = t;
}

// 관세 API
function RRN_NO_API(ORDNO) {
  if(!state.form.personal_customs_clearance_code){
    message.error("먼저 개인통관고유부호를 입력해 주세요.");
    return false;
  }
  if(!state.form.receiver_name){
    message.error("먼저 받는 사람을 입력해 주세요.");
    return false;
  }
  if(!state.form.receiver_tel1){
    message.error("먼저 받는 사람 연락처를 입력해 주세요.");
    return false;
  }

  state.checkClearanceCodeLoading = true;
  useBridgeApi().checkPersonalCustomsClearanceCode({
    ORD_NO: ORDNO,
    ADRS_KR: state.form.receiver_name,
    MOB_NO: state.form.receiver_tel1.replace(/-/gi, ""),
  }).then(res => {
    state.checkPersonalCustomsClearanceCode = true;
    if (res.status !== "2000") {
      message.error(res.message);
      state.checkClearanceCodeLoading = false;
      return false;
    }
    if (res.data.tCnt === "1") {
      state.form.rrn_no_con = ["Y"];
      message.success("개인통관고유부호가 확인되었습니다.");
    } else if (res.data.tCnt === "0") {
      if (res.data.len === "6") {
        state.form.rrn_no_con = ["Y"];
      } else {
        state.form.rrn_no_con = ["N"];
      }
      message.warning(res.data.txt);
    } else {
      state.form.rrn_no_con = ["N"];
      message.warning(res.data.txt);
    }
    state.checkClearanceCodeLoading = false;
  }).catch(err => {
    state.checkClearanceCodeLoading = false;
    message.error(err);
  })
}

// 통관 품목 불러오기
const getCategory = async () => {
  useBridgeApi().getArcSeq().then(res => {
    if(res.status !== "2000"){
      message.error("통관품목을 불러오기 실패하였습니다. 새로고침후 다시 시도해 주세요.");
      return false;
    }
    state.categoryData = res.data;
  }).catch(err => {
    message.error(err);
  })
}

// 통관 품목 change 이벤트
const handleCategoryChange = (value, item) => {
  item.PRO_NM = state.categoryData.find(item => item.ARC_SEQ === value).ca_eng
  item.PRO_NM_CH = state.categoryData.find(item => item.ARC_SEQ === value).ca_chn
  item.hs_code = state.categoryData.find(item => item.ARC_SEQ === value).hs_code
}

// 사업자 등록증 업로드 change 이벤트
const handleUploadChange = (info) => {

  const {status} = info.file;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    if(info.fileList[0].response.data.code !== 2000) {
      message.error(info.fileList[0].response.data.message);
      return false;
    }
    message.success(`${info.file.name} 파일 업로드 성공.`);
  } else if (status === 'error') {
    message.error(`${info.file.name} 파일 업로드 실패.`);
  }
}

// 개인통관부호 change 이벤트
const handleRrnCdChange = (value) => {
  if(state.form.rrn_cd === '사업자통관') {
    state.form.fileList = []
    message.info('사업자통관은 33,000원 통관비가 적용됩니다.');
  }
}

watchEffect(() => {
  if (visible.value) {
    getOrderDetailForBridge()
    getCategory()
  }
})
</script>
<style>
  .showModal::-webkit-scrollbar{
    display:none;
  }
  .fw{
      font-weight: bold;
  }
  .fs12{
    font-size: 12px;
  }
  .fs20{
      font-size: 20px;
  }
  .cor-ora{
    color: #DA8464;
  }
  .cor-white{
    color: white;
  }
  .col-blue{
    color: #2A6BD0;
  }
  .title{
    font-weight: bold;
    font-size: 16px;
  }
  .mt0{
    margin-top: 0;
  }
  .bg-b{
    background-color:black;
  }
  .bottom-border{
    border-bottom: 1px solid #F3F3F3;
  }
  .bg-f{
    background-color:#F0F0F0;
  }
  .bg-fa{
    background-color: #FAFAFA;
  }
  .mb0{
    margin-bottom: 0;
  }
  .divider{
    height: 2px;
  }
  .textarea{
    color: black!important;
    cursor: inherit!important;
    padding: 20px;
    height: 160px!important;
    resize: none!important;
    line-height: 1.5!important;
  }
  .textarea2{
    width: 80%;
    resize: none!important;
  }
  .showModal input,.ant-select,.ant-select-selector,.ant-select-selection-item{
    height: 40px!important;
    line-height: 40px!important;
  }
  .ant-modal .ant-modal-content{
      padding-bottom: 0;
  }
  .ant-tag-blue,.ant-tag-red,.ant-tag-orange{
      background: none;
      border-radius: 10px;
  }
  .btn-wrap button{
    width: 150px;
    height: 40px;
    border: 0;
  }
  .btn-wrap button:first-child{
    border: 1px solid #EFEAC1;
  }
  .btn-wrap button:last-child{
    background-color: #FFDA41;
  }
  .help-input-wrap{
      position: relative;
  }
  .help-input{
    position: absolute;
    color: red;
    font-weight: bold;
    z-index: 99;
    left: 182px;
    top: 9px;
  }
  .help-input-wrap input:focus:empty + .help-input{
      display: block;
  }
  .help-input-wrap input:focus:not(:empty) + .help-input{
    display: none;
  }
  .help-input-wrap input:not(:focus):empty + .help-input{
      display: block;
  }
  .step1 .flex-wrap{
      width: 100%;
  }
    .step3-select{
        width: 100%;
    }
    .step3-button{
        min-width: 150px;
        height: 40px;
    }
    .step4-end{
        display: flex;
        justify-content: end;
    }
    .step4-select{
        width: 200px;
    }
    .step4-select2{
      width: 100%;
    }
    .step4-left{
        display: flex;
        flex-direction: column;
        justify-content: center;
      align-items: center;
    }
    .step4-right-text{
        display: flex;
        align-items: center;
    }
    .step4-money-wrap{
        height: 40px;
        color: #F6E87A;
        display: flex;
        align-items: center;
    }
  .footer-wrap{
      border-radius: 5px 5px 0 0;
      color: white;
  }
  .footer-wrap .ant-col{
      flex-direction: column;
  }
  .footer-wrap .under-line{
      padding-bottom: 2px;
      border-bottom: 1px solid white;
  }
  .ant-modal-content{
    height: 100% !important;
  }
</style>