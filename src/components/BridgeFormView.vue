<template>
	<a-spin v-model:spinning="state.loading" />
  <a-modal id="bridgeForm" v-model:open="visible"
           width="100%" wrap-class-name="full-modal"
           :confirm-loading="state.confirmLoading" @cancel="onClose" class="showModal" :footer="null">
    <div style="padding: 0 200px; height: calc(100vh - 100px) ;overflow-y: scroll; margin-right: 20px;">
      <span class="mb10 fs24">배송대행 신청서</span>
      <a-row>
        <a-divider class="divider bg-b mb10"></a-divider>
        <span class="title mb20">서비스 신청 유의사항</span>
        <a-textarea v-model:value="state.textareaValue" disabled class="textarea mb10"/>
        <a-space>
          <a-checkbox ><span class="cor-ora fs12">주의사항을 모두 숙지하였으며 위 약관에 동의합니다.</span></a-checkbox>
        </a-space>
        <a-divider class="bg-f mt10"></a-divider>
      </a-row>
      <a-row class="step1">
        <span class="title mb10">STEP 01&nbsp;&nbsp;&nbsp;&nbsp;배송받을 물류센터를 선택해주세요.</span>
        <a-divider class="divider bg-b mt0 mb10"></a-divider>
        <a-flex class="ml30 flex-wrap" vertical>
          <a-radio-group v-model:value="state.form.ctr_seq">
            <a-radio value="1">위해-인천1자가장치장</a-radio>
            <a-radio value="2019">위해항공</a-radio>
            <a-radio value="2030">위해-평택해운</a-radio>
            <a-radio value="2031">위해-인천2지정장치장</a-radio>
          </a-radio-group>
          <a-textarea disabled :rows="2" class="mt10 mb10 textarea2"/>
          <div class="fs12">※ 넥스트배송에서는 합배송, 단독배송 관련없이 하나의 신청서로 배송신청이 모두 완료됩니다.</div>
        </a-flex>
        <a-divider class="bg-f mt10"></a-divider>
      </a-row>
      <a-row class="mb15">
        <span class="title mb10">STEP 02&nbsp;&nbsp;&nbsp;&nbsp;수입방식을 선택해주세요.</span>
        <a-divider class="divider bg-b mt0 mb10"></a-divider>
        <a-flex class="ml30" vertical>
          <a-radio-group v-model:value="state.form.importation_mode">
            <a-radio value="3">개인전자상거래</a-radio>
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
            <a-col :span="15" class="center">
              <a-input v-model:value="state.form.receiver_name" />
            </a-col>
          </a-row>
          <a-row class="mb5">
            <a-col :span="4" class="center">영문</a-col>
            <a-col :span="15">
              <a-input v-model:value="state.form.receiver_name_en" />
            </a-col>
            <a-col :span="5" class="center"></a-col>
          </a-row>
          <a-row>
            <a-col :span="4" class="center"></a-col>
            <a-col :span="10" class="fs12">※ 사업자 영문명은 반드시 수정해주세요.(한글발음 그대로 입력시 통관지연)</a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row class="bottom-border">
        <a-col :span="3" class="center bg-fa">수령자 정보</a-col>
        <a-col :span="21" class="mt10 mb10">
          <a-row class="center">
            <a-col :span="9" class="pl70">
              <a-radio-group v-model:value="state.form.receiver_info_type">
                <a-radio value="1" class="mr30">개인통관고유부호
                  <a-tooltip>
                    <template #title>
                      <div>tip</div>
                    </template>
                    <QuestionCircleOutlined/>
                  </a-tooltip>
                </a-radio>
                <a-radio value="2">사업자등록번호</a-radio>
              </a-radio-group>
            </a-col>
            <a-col :span="10">
              <a-input v-model:value="state.form.personal_customs_clearance_code"/>
            </a-col>
            <a-col :span="5" align="center">
              <a-button
				  v-if="state.form.receiver_info_type === '1'"
				  type="primary"
				  class="step3-button"
				  @click="RRN_NO_API"
			  >
				  개인통관번호 조회
			  </a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row class="bottom-border">
        <a-col :span="3" class="center bg-fa">연락처 및주소</a-col>
        <a-col :span="21" class="pt10">
          <a-row class="mb10">
            <a-col :span="4" class="center">연락처</a-col>
            <a-col :span="15" class="center">
              <a-input v-model:value="state.form.receiver_tel1" />
            </a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="4" class="center">우편번호</a-col>
            <a-col :span="15" class="center">
              <a-input v-model:value="state.form.receiver_post_code" />
            </a-col>
            <a-col :span="5" class="center">
              <a-button type="default" @click="showExpressModal(item)" class="bg-f step3-button">우편번호 검색</a-button>
            </a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="4" class="center">한글주소</a-col>
            <a-col :span="15">
              <a-input v-model:value="state.form.receiver_addr1" placeholder="※ 시, 군, 구를 띄어쓰기로 정확히 입력해주세요."/>
            </a-col>
            <a-col :span="5" class="center"></a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="4" class="center"></a-col>
            <a-col :span="10" class="fs12">* 주소는 시,군,구를 띄어쓰기하여 정확히 입력해주시기 바랍니다. ex) 서울시 강남구 일원동 741</a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="4" class="center">상세주소</a-col>
            <a-col :span="15">
              <a-input v-model:value="state.form.receiver_addr2" placeholder="※ 도로명 주소를 입력해주세요."/>
            </a-col>
            <a-col :span="5" class="center"></a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="4" class="center"></a-col>
            <a-col :span="11" class="fs12">* 도로명 주소를 써주세요. 지번 주소 기재 시 통관/세관에서 오류로 분류시켜 통관지연이 될 수 있습니다.</a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="4" class="center">영문주소</a-col>
            <a-col :span="15" class="center">
              <a-input v-model:value="state.form.receiver_addr1_en" />
            </a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="4" class="center">영문상세주소</a-col>
            <a-col :span="15" class="center">
              <a-input v-model:value="state.form.receiver_addr2_en" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row class="bottom-border">
        <a-col :span="3" class="center bg-fa">배송 요청사항</a-col>
        <a-col :span="21" class="pt10">
          <a-row class="mb10">
            <a-col :span="1"></a-col>
            <a-col :span="18">
              <a-select @change="setMessage" v-model:value="state.form.messageType" class="step3-select">
                <a-select-option value="">직접기재</a-select-option>
                <a-select-option value="배송 전 연락 바랍니다">배송 전 연락 바랍니다</a-select-option>
                <a-select-option value="부재시 경비실에 맡겨주세요">부재시 경비실에 맡겨주세요</a-select-option>
                <a-select-option value="부재시 집앞에 놔주세요">부재시 집앞에 놔주세요</a-select-option>
                <a-select-option value="택배함에  맡겨주세요">택배함에  맡겨주세요</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row class="mb10">
            <a-col :span="1"></a-col>
            <a-col :span="18">
              <a-input v-model:value="state.form.message"/>
              <span class="fs12">
                * 국내 배송기사 분께 전달하고자 하는 요청사항을 남겨주세요(예: 부재 시 휴대폰으로 연락주세요.)
              </span>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row class="mt30">
        <span class="title mb10">STEP 04&nbsp;&nbsp;&nbsp;&nbsp;상품 정보를 입력해주세요.</span>
        <a-divider class="divider bg-b mt0 mb0"></a-divider>
      </a-row>
      <div  v-for="(item,index) in state.form.items" :key="index" >
        <a-row class="mt20 bottom-border pb10">
          <a-col :span="3" class="cor-ora">상품 #{{index + 1}}</a-col>
          <a-col :span="21" class="step4-end">
            <a-space>
              <a-button type="primary" @click="parseMarketOrder(index)">장바구니 & 주문복사</a-button>
              <a-button class="bg-black cor-white" @click="copyItem(index)">상품복사</a-button>
              <a-button class="bg-black cor-white" @click="addItem(item)">+ 상품추가</a-button>
              <a-button class="bg-black cor-white" @click="removeItem(index)">- 상품삭제</a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-row class="bottom-border">
          <a-col :span="3" class="center bg-fa text-center">트래킹번호<br>Tracking No.</a-col>
          <a-col :span="21" class="pt10">
            <a-row class="mb10">
              <a-col :span="1"></a-col>
              <a-col :span="23" class="center">
                <a-input v-model:value="item.invoiceNumber"/>
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
                <a-input v-model:value="item.cn_order_id"/>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row class="bottom-border">
          <a-col :span="3" class="bg-fa pt30 step4-left">
            <a-row class="ml10">
              <a-upload
				  v-model:file="item.prdImage"
				  name="file"
				  :max-count="1"
				  :headers="state.uploadHeaders"
                  list-type="picture-card"
                  class="avatar-uploader"
				  :customRequest="(file) => handleUploadChange(file, index)"
				  :beforeUpload="validateUploadImage"
              >
                <img v-if="item.prdImage" alt="avatar" :src="item.prdImage"/>
                <div v-else>
                  <div class="ant-upload-text fs12">이미지 URL<br>입력해주세요</div>
                </div>
              </a-upload>
            </a-row>
          </a-col>
          <a-col :span="21" class="pt10">
            <a-row class="mb10">
              <a-col :span="6" class="step4-right-text pl30">통관품목<span class="red">*</span></a-col>
              <a-col :span="16">
                <a-input v-model:value="item.arc_seq"/>
              </a-col>
              <a-col :span="2"  class="right">
                <div style="align-items: center; display: flex;">
                  <a-button style="width: 60px;" type="primary" @click="getCategory(item.arc_seq, index)">조회</a-button>
                </div>
              </a-col>
            </a-row>
            <a-row class="mb10">
              <a-col :span="6" class="step4-right-text pl30"></a-col>
              <a-col :span="18" class="fs12"></a-col>
            </a-row>
            <a-row class="mb10">
              <a-col :span="6" class="step4-right-text pl30">상품명 (영문)<span class="red">*</span></a-col>
              <a-col :span="18" class="help-input-wrap">
                <a-input ref="step3-input" @change="step3Input" v-model:value="item.prd_name_en"/>
<!--                            <span class="help-input">입력금지</span>-->
              </a-col>
            </a-row>
            <a-row class="mb10  pb10">
              <a-col :span="6" class="step4-right-text pl30"></a-col>
              <a-col :span="18" class="fs12">
                * 정확한 작성을 해주셔야 통관지연을 막을 수 있습니다. (대표품목, 특수문자, 한글 입력 금지)
              </a-col>
            </a-row>
            <a-row class="mb10 bottom-border">
              <a-col :span="6" class="step4-right-text pl30">상품명 (중문)</a-col>
              <a-col :span="18" class="help-input-wrap">
                <a-input ref="step3-input" @change="step3Input" v-model:value="item.prd_name_cn"/>
              </a-col>
            </a-row>
            <a-row class="mb10">
              <a-col :span="6" class="step4-right-text pl30">HS 코드<span class="red">*</span></a-col>
              <a-col :span="18" class="help-input-wrap">
                <a-input v-model:value="item.hs_code" />
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30">단가<span class="red">*</span></a-col>
              <a-col :span="8">
                <a-input-number
                    :precision="2"
                    min="0"
                    :controls="false"
                    size="middle"
                    style="width: 100%"
                    v-model:value="item.unitPrice"
                    @blur="calculateTotal"
                    addon-after="위안"
                />
              </a-col>
              <a-col :span="1" class="center">X</a-col>
              <a-col :span="9">
                <a-input-number
					:precision="0"
					min="1"
					style="width: 100%"
					:controls="false"
					size="middle"
					v-model:value="item.quantity"
					@blur="calculateTotal"
					addon-after="개"
				/>
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30">옵션<span class="red">*</span></a-col>
              <a-col :span="2" class="center">색상</a-col>
              <a-col :span="6">
                <a-input v-model:value="item.option_color"/>
              </a-col>
              <a-col :span="2" class="center">상품단위</a-col>
              <a-col :span="8">
                <a-input v-model:value="item.product_unit" placeholder="예 : 件/双/千克"/>
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30">모멜명/재질/규격/사이즈<span class="red">*</span></a-col>
              <a-col :span="8">
                <a-input v-model:value="item.option_size" placeholder="예 : KF94/100ML*30支/水20ML乳20ML"/>
              </a-col>
              <a-col :span="2" class="center">순량(KG)</a-col>
              <a-col :span="8">
                <a-input v-model:value="item.product_weight" placeholder="한개/SET 상품의 순량"/>
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30">브랜드 (영문)</a-col>
              <a-col :span="18">
                <a-input v-model:value="item.brand_en" placeholder="no"/>
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30">브랜드 (중문)</a-col>
              <a-col :span="18">
                <a-input v-model:value="item.brand_cn" placeholder="한글 입력금지 (没有)"/>
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30">국내판매 쇼핑몰 URL</a-col>
              <a-col :span="18">
                <a-input v-model:value="item.prdUrl_kr"/>
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30">자체관리 코드</a-col>
              <a-col :span="8">
                <a-input v-model:value="item.user_code" placeholder="표준상품코드 작성 요망 (请填写标准商品条码)"/>
              </a-col>
              <a-col :span="2" class="center">원산지</a-col>
              <a-col :span="8">
                <a-input v-model:value="item.origin_text" placeholder="한글 입력금지"/>
              </a-col>
            </a-row>
            <a-row class="mb10">
              <a-col :span="6" class="step4-right-text pl30">상품 URL<span class="red">*</span></a-col>
              <a-col :span="18">
                <a-input v-model:value="item.prdUrl" placeholder="※ 배송대행 상품금액 세관신고 증명서류입니다. 중국쇼핑몰 URL 추천합니다."/>
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30"></a-col>
              <a-col :span="18" class="fs12">
                *검수가 필요하신 분들은 정확한 URL주소를 넣어주세요. 상품URL이 없는 경우 구매영수증URL 을 꼭 넣으세요.
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30">이미지 URL<span class="red">*</span></a-col>
              <a-col :span="18">
                <a-input v-model:value="item.prdImage"/>
              </a-col>
            </a-row>
            <a-row class="mb10 pb10">
              <a-col :span="6" class="step4-right-text pl30">오픈마켓 주문번호</a-col>
              <a-col :span="18">
                <a-input v-model:value="item.orderNo"/>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>

      <a-row class="mt10">
        <a-col :span="24" class="step4-money-wrap bg-black pl40">금액 정보</a-col>
      </a-row>
      <a-row class="bg-fa bottom-border pt20 pb20">
        <a-col :span="20" class="pl40">총 수량</a-col>
        <a-col :span="4" class="pr20 text-right"><span class="col-blue fw fs20">{{state.form.total_quantity}}</span> 개</a-col>
      </a-row>
      <a-row class="bg-fa bottom-border pt20 pb20">
        <a-col :span="20" class="pl40">총 금액</a-col>
        <a-col :span="4" class="pr20 text-right"><span class="col-blue fw fs20">{{state.form.total_amount}}</span>위안</a-col>
      </a-row>
      <a-row class="bg-fa pt20 pb20">
        <a-col :span="24" class="pl40 fs12">※ 세관에 신고되는 금액입니다. (해외직구: 해외 판매처 구매 원가 기재 / 해외구매대행업: 국내 오픈마켓 판매가 기재)</a-col>
        <a-col :span="24" class="pl40 fs12">※ 총 금액이 150달러를 넘을 경우 간이통관 (일반통관)으로 진행되며 관/부가세가 발생할 수 있습니다.</a-col>
      </a-row>
<!--      <a-row class="bg-fa pb20 pr20 btn-wrap" justify="end">-->
<!--        <a-button type="default" class="mr5">단독배송</a-button>-->
<!--        <a-button type="default">일반통관</a-button>-->
<!--      </a-row>-->

      <div>
        <a-row class="mt30">
          <span class="title mb10">STEP 05&nbsp;&nbsp;&nbsp;&nbsp;구매물품보상보험 안심케어 서비스에 가입하세요.</span>
          <a-divider class="divider bg-b mt0 mb0"></a-divider>
        </a-row>
        <a-row class="mt30" style="justify-content: space-between;">
          <a-checkbox :checked="state.form.is_care" @click="showCareInfo"><span class="cor-ora fs14">해외직구보험 가입 & 내용확인하기(필수)</span></a-checkbox>
          <span class="fw fs14">안심케어 비용 : <span style="color: #cf1322">{{ state.form.carePrice }}</span> 원</span>
        </a-row>
        <a-divider class="bg-f mt10"></a-divider>

        <a-row  style="height: 150px;">
          <a-col :span="6" class="center bg-fa" style="line-height: 0.5; text-align: center;">
            <a-col :span="24" class="pt10" style="line-height: 0.5; text-align: center;">
              <p>해외에서 직접구매하신 물품의</p>
              <p class="red fw">파손,도난분실,오배송 + 반송비용 보상</p>
              <p> ※ 자세한 보장내용은 공지사항 참고해주세요</p>
            </a-col>
          </a-col>
          <a-col :span="18" class="p10">
            <p>※ 본 보험상품의 정식명칭은 에이스손해보험사에서 제공하는 구매물품보상보험 입니다.</p>
            <p>※ 넥스트익스프레스 안심케어 미가입 물품의 파손, 분실, 도난, 오배송 손해에 대해 넥스트익스프레스는
              책임을 지지 않습니다.</p>
            <p>※ 깨짐에 취약한 상품이나 부피가 큰 상품의 경우 반드시 포장보완 또는 안전포장을 진행하셔야 합니다.<br>
              [ 배송이 시작되면 Safe 케어 가입내용이 연락처로 안내됩니다. ]</p>
            <p class="red fw">※ 구매하신 URL이 정확하지 않으면 보험 가입이 되어도 보상이 불가능합니다.</p>
          </a-col>
        </a-row>
      </div>


      <a-row class="mt40">
        <span class="title mb10">STEP 06&nbsp;&nbsp;&nbsp;&nbsp;요청사항을 선택해주세요.</span>
        <a-divider class="divider bg-b mt0 mb0"></a-divider>
      </a-row>
      <a-row class="step5 bottom-border">
        <a-col :span="3" class="center bg-fa">검수옵션</a-col>
        <a-col :span="21" class="pt25 pb25 pl20">
			<a-checkbox-group v-model:value="state.form.EtcDlvr1">
				<a-checkbox class="mr15" value="81">
					검수안함&nbsp;<a-tag color="blue">무료</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="7">
					정밀검수&nbsp;<a-tag color="red">3,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="82">
					작동검수&nbsp;<a-tag color="red">3,000원</a-tag>
				</a-checkbox>
				<a-checkbox value="29">
					기본검수&nbsp;<a-tag color="blue">무료</a-tag>
				</a-checkbox>
			</a-checkbox-group>
        </a-col>
      </a-row>
      <a-row class="step5 bottom-border">
        <a-col :span="3" class="center bg-fa">포장옵션</a-col>
        <a-col :span="21" class="right-content pt25 pb25 pl20">
			<a-checkbox-group v-model:value="state.form.EtcDlvr2">
				<a-checkbox class="mr15 mb10" value="98">
					깨짐주의스티커&nbsp;<a-tag color="blue">무료</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="69">
					추천포장&nbsp;<a-tag color="orange">유료</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="103">
					박스 재포장&nbsp;<a-tag color="red">1,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="99">
					모서리 보호대&nbsp;<a-tag color="red">2,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="96">
					스틱형 에어캡&nbsp;<a-tag color="red">1,500원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="100">
					밴딩포장&nbsp;<a-tag color="red">2,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="27">
					폴리백포장&nbsp;<a-tag color="red">500원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="102">
					고급 폴리백포장&nbsp;<a-tag color="red">1,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="95">
					기본뿌뿌이&nbsp;<a-tag color="red">1,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="104">
					나무 특수포장&nbsp;<a-tag color="red">30,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="97">
					발포지&nbsp;<a-tag color="red">1,500원</a-tag>
				</a-checkbox>
				<a-checkbox value="101">
					내품보안포장&nbsp;<a-tag color="red">500원</a-tag>
				</a-checkbox>
			</a-checkbox-group>
        </a-col>
      </a-row>
      <a-row class="step5 bottom-border">
        <a-col :span="3" class="center bg-fa">제거옵션</a-col>
        <a-col :span="21" class="pt25 pb25 pl20">
			<a-checkbox-group v-model:value="state.form.EtcDlvr3">
				<a-checkbox class="mr15" value="10">
					신발의류박스 제거&nbsp;<a-tag color="blue">무료</a-tag>
				</a-checkbox>
				<a-checkbox value="94">
					영수증 제거&nbsp;<a-tag color="blue">무료</a-tag>
				</a-checkbox>
			</a-checkbox-group>
        </a-col>
      </a-row>
      <a-row class="step5 bottom-border">
        <a-col :span="3" class="center bg-fa">통관옵션</a-col>
        <a-col :span="21" class="right-content pt25 pb25 pl20">
			<a-checkbox-group v-model:value="state.form.EtcDlvr4">
				<a-checkbox class="mr15 mb10" value="83">
					목록통관&nbsp;<a-tag color="blue">무료</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="51">
					간이통관 수수료&nbsp;<a-tag color="red">3,300원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="57">
					사업자통관 수수료&nbsp;<a-tag color="red">33,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="88">
					원산지증명발급&nbsp;<a-tag color="red">30,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="86">
					B/L비용&nbsp;<a-tag color="red">30,000원</a-tag>
				</a-checkbox>
				<a-checkbox value="138">
					컨테이너 작업비&nbsp;<a-tag color="red">20,000원</a-tag>
				</a-checkbox>
			</a-checkbox-group>
        </a-col>
      </a-row>
      <a-row class="step5 bottom-border">
        <a-col :span="3" class="center bg-fa">기타옵션</a-col>
        <a-col :span="21" class="right-content pt25 pb25 pl20">
			<a-checkbox-group v-model:value="state.form.EtcDlvr5">
				<a-checkbox class="mr15 mb10" value="54">
					멀티박스&nbsp;<a-tag color="red">3,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="92">
					관/부가세 선불&nbsp;<a-tag color="red">3,300원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="56">
					도서산간&nbsp;<a-tag color="red">6,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="93">
					경동택배비용 선불
				</a-checkbox>
				<a-checkbox class="mr15" value="151">
					PDF 인쇄출력&nbsp;<a-tag color="red">200원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="91">
					220V돼지코&nbsp;<a-tag color="red">1,000원</a-tag>
				</a-checkbox>
				<a-checkbox class="mr15" value="124">
					원산지 작업 (스티커/미싱)&nbsp;<a-tag color="orange">유료</a-tag>
				</a-checkbox>
				<a-checkbox value="55">
					부피무게&nbsp;<a-tag color="orange">측정</a-tag>
				</a-checkbox>
			</a-checkbox-group>
        </a-col>
      </a-row>
      <a-row class="step5 bottom-border">
        <a-col :span="3" class="center bg-fa">물류 요청사항</a-col>
        <a-col :span="21" class="right-content pt25 pb25 pl20">
          <a-input v-model:value="state.form.req_2"></a-input>
        </a-col>
      </a-row>
      <a-row class="btn-wrap mt50">
        <a-col :span="24" class=" center pt25 pb25 pl20">
          <a-button @click="handleOk">접수신청</a-button>
        </a-col>
      </a-row>
      <a-row class="bg-black footer-wrap pt30 pb30 mt20">
        <a-col :span="24" class="center pt25 pb25 pl20">
          <div class="mb5"><span class="red">※</span>입고된 물품은 수정이 <span class="under-line">불가능</span>합니다. 트래킹번호 추가 등 수정이
            필요하신 경우 <span class="under-line">접수대기</span>를 선택해주세요.<span class="red">※</span></div>
          <div><span class="red">※</span><span class="under-line">접수신청</span>을 완료하신 후 부득이한 사유로 요청서 <span
              class="under-line">수정</span>이 필요한 경우 <span class="under-line">1:1문의</span>해주세요.<span class="red">※</span>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
  <parse-market-order-zh-cn v-model="parseMarketOrderData" />
  <OverseasCareDetail v-model:data="OverseasCareData" />
</template>

<script setup>
import {computed, createVNode, onMounted, reactive, ref, toRefs, watchEffect} from "vue";
import {message, Modal} from "ant-design-vue";
import {ExclamationCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons-vue";
import {useMarketOrderApi} from "@/api/order";
import {useBridgeApi} from "@/api/bridge";
import Cookie from "js-cookie";
import ParseMarketOrderZhCn from "@/components/ParseMarketOrderZhCn.vue";
import OverseasCareDetail from "@/components/OverseasCareDetail.vue";
import {AuthRequest} from "@/util/request";
import {lib} from "@/util/lib";

const props = defineProps({
  visible: Boolean,
  bridgeFormData: {
    type: Object
  }
});

const {bridgeFormData} = toRefs(props);
const emit = defineEmits(["close", "update"]);


const state = reactive({
	form: {
		id: "",
		order_id: "",
		app_type: "배송대행",
		ctr_seq: "1", // 배송방법
		receiver_name: "",
		receiver_name_en: "",
		receiver_tel1: "",
		receiver_addr1: "",
		receiver_addr2: "",
		receiver_addr1_en: "",
		receiver_addr2_en: "",
		receiver_post_code: "",
		message: "",
		items: [],

		rrn_cd: "목록통관", // 통관방법
		fileList: [], // 사업자등록증첨부파일
		personal_customs_clearance_code: "", // 개인통관 고유번호
		rrn_no_con: ["Y"], // 개인통관 고유번호 확인 오후 8:36 2020-02-21

		EtcDlvr1: [], // 검수옵션
		EtcDlvr2: [], // 포장옵션
		EtcDlvr3: [], // 제거옵션
		EtcDlvr4: [], // 통관옵션
		EtcDlvr5: [], // 기타옵션

		auto_rls_yn: false, // 자동결제여부
		auto_req_yn: false, // 자동출고여부
		market_product_id: "", // 商城商品ID
		req_2: "", // 물류요청사항

		importation_mode: "3", // 수입방식
		receiver_info_type :"1", // 받는 사람 정보 (1:개인통관고유번호, 2:사업자등록번호)
		avatar: "", // 이미지 URL
		messageType: "", // 배송 요청사항
		carePrice: 0, // 보험료?
		is_care: false, // 보험 가입 여부
		total_amount: 0,
        total_quantity: 0,
	},
  total_amount_kr: 0,
  loading: false,
  confirmLoading: false,
  checkClearanceCodeLoading: false,
  categoryData: [],
  uploadHeaders: {
	  token: Cookie.get("token"),
	  "Content-Type": "multipart/form-data",
  },
  uploadUrl: process.env.VUE_APP_API_URL + "/api/bridge/imgUpload",
  checkPersonalCustomsClearanceCode: false,
  textareaValue: `1. 주문서에 작성된 모든 정보는 세관신고서에 반영되므로 정확하게 작성하셔야 합니다.
   허위정보작성 및 정보 미기재에 의해 발생하는 불이익은 "넥스트배송"에서 책임지지 않습니다.

2. "넥스트배송"은 관련법규를 철저히 준수하며, 가품 및 이미테이션제품은 절대 진행하지 않습니다.

3. 상품이미지 미등록의 경우, 통관 시 세관문의에 "넥스트배송"에서 선대응이 어려워 통관이 지연될 수 있습니다.

4. 정확한 상품 영문명을 기입해 주시기 바랍니다. 부정확한 상품정보로 통관 시 과태료가 부과될 수 있습니다.

5. 선적이 불가능 하거나 수입 금지된 품목 구매로 인해 발생하는 불이익은 "넥스트배송"에서 책임지지 않습니다.

6. $150달러 이상 또는 수량 과다 시 목록통관 취하로 과세 될 수 있습니다. 상품명, 수량, 금액이 실제품과 다를 시 과태료가 나올 수 있습니다.

7. 합배송의 경우에도 하나의 배송요청서로 작성해주시면 되며, 접수대기 상태에서는 상품의 추가등록, 배송지 정보 수정이 가능합니다.
   단, 입고가 완료된 상품의 내용 수정은 불가능합니다.

8. 합포장 신청은 여러 쇼핑몰에서 구매하시거나, 같은 쇼핑몰에서 다르게 결제한 주문을 "넥스트배송" 1개 배송신청서(주문번호)에
   신청할 경우 가능합니다.

9. 묶음배송 신청은 2개 이상의 배송신청서(주문번호)를 묶음으로 배송요청하실 경우에 해당하며 ‘입고 전’ 상태에서 무료로 제공됩니다.
   단, 제품입고 후 묶음신청 시 경우에 따라 묶음이 불가능할 수 있습니다.

10. 한 배송신청서(한 개의 주문번호)에 작성된 상품은 최대한 합포장으로 진행되며 배송비 책정이 완료된 이후 추가적인 합포장,
    묶음배송신청은 불가능합니다.

11. 넥스트배송 의 묶음포장용 최대박스는 세변의 합 150cm, 박스의 최대 무게는 15kg(±2kg)까지 입니다.
    초과시 중형화물 착불을 피하기 위해 창고포장팀의 판단에 의해 여 러개의 박스로 포장될 수 있습니다.
    (여러개 박스 발송 - 첫 박스를 제외한 추가 박스당 3,000원씩 비용이 발생합니다. 여러 개의 박스 발송은 멀티박스"라고 칭합니다. )

12. 트래킹번호를 반드시 입력해주셔야 빠르고 정확한 입고확인이 가능합니다.
    트래킹번호가 부정확하거나 사서함번호가 없이 입고된 경우 입고확인이 늦어지거나 누락배송 될 수 있습니다.
    트래킹번호 부정확으로 누락될 시 누락건의 배송요금은 고객부담으로 배송됩니다.

13. 트래킹번호 오입력, 판매자 착불 발송일 경우 제품이 계속 ‘입고전’상태로 보여 질 수 있습니다.
    모든 상품에 입력하신 트래킹번호의 정확, 부정확의 여부는 "넥스트배송"에서 확인이 어렵습니다.
    또한 제품이 입고되어도 센터 입고 절차가 완료될 때까지 ‘입고전’으로 표시될 수 있습니다.

14. 트래킹번호는 3개까지 기본검수로 가능하며, 4개째부터는 개당 1,000원의 합배송 비용이 발생합니다.

15. 보관은 입고일부터 30일까지 무료 보관이며 31일부터 1일씩 1,000원의 보관 수수료가 발생합니다.
    45일 이후에는 자동 사전 고지 없이 폐기 처분 되오며 보관료로 충당됩니다.

16. 재고보관의 경우 입고일부터 30일까지 무료 보관이며 31일부터 1일씩 1,000원의 보관 수수료가 발생 합니다.
    45일 이후에는 자동 사전 고지 없이 폐기 처리 됩니다.

17. 상품명이 부정확하거나 언더밸류로 의심되는 경우와 동일 선적 날 주소, 전화번호, 이름이 중복되는 경우 출고가 보류될 수 있습니다.

18. 요청되지 않은 착불제품은 "넥스트배송"에서 수취하지 않습니다. 판매자 착불 발송 시 물류센터 요청사항에 반드시 기재바랍니다.
    (트래킹번호 기재)

19. 멀티박스, 창고보관료, 그 외 부가서비스비용 등은 물류센터 현장의 판단이나 "넥스트배송" 정책에 의해 추가 비용이 발생할 수 있습니다.

20. 결제처리 전, 제공되는 무료실사촬영을 통해 반드시 제품 오류입고 및 파손여부를 확인하시고 결제하시기 바랍니다.
    정밀검수 옵션 미 체크 시 디자인, 품질, 불량 및 오배송(미입고) 등은 센터에서 확인하고 있지 않으며,
    제품상태에 대해 "넥스트배송"이 책임지지 않습니다.
    확인을 요하는 부분은 결제전 반드시 문의해주시고, 결제완료는 모든것을 확인하셨다는 것으로 간주됩니다.
    추후 발생하는 손해에 대해 어떠한 책임도 없음을 안내드립니다.

21. 결제 금액 불일치 또는 입금자명이 불일치할 경우 출고 지연이 발생될 수 있습니다

22. 배송비 결제완료 이후 수취인 정보 변경 및 반송처리가 불가능합니다.

23. 출고 마감시간은 오전 10시 입니다. 오전 9시까지 결재확인 된 주문건만 당일 출고됩니다.

24. 국내세관 통관심사 시, 관/부가세 납부 대상 상품의 경우 관, 부가세 납부 후 반출되며, 이후 택배배송이 가능합니다.

25. 전자제품은 한사람당 한 개만 전파인증, 전기안전인증이 면제되며, 1개초과 구매수량은 통관과정에서 폐기대상이 될 수 있으므로 유의 바랍니다.
    식품이나 식물은 검역대상이 될 수 있으며 검역불가로 인한 보류, 폐기에 대해서는 “넥스트배송”에서 책임지지 않습니다.

26. 샘플을 무료로 받은 물품도 모두 신청서 상에 기재하시고 물품을 받으셔야 합니다.
    무료라고 하더라도, 세관 신고 시 무료는 신고자체가 되지 않기 때문에 최소 $0 이상으로 기재해 주셔야 하며, 면세범위가
    초과되는 경우 과세 추징될 수 있습니다

27. 세관 수입 통관 시에 물품을 1+1으로 받아서 하나를 무료로 받았다고 하더라도, 고객님께서 판단하에 금액을 반 반 씩
    기재할 수는 있지만 실제 그 물품의
    판매가격으로 신고를 하셔야 합니다. 불성실신고 시 세관에서 과세 추징될 수 있습니다.

28. 사은품(특히 식품)등 신청서 미기재 제품은 통관시 문제 발생소지가 높아 자동으로 폐기하고 있습니다.
    구매하신 제품은 반드시 신청서에 함께 기재하여 폐기되는 일이 없도록 부탁드립니다.

29. 제품 반품, 교환관련 문제는 해당 판매자와 협의 후, "넥스트배송" 고객센터에 주문번호와 함께 반품정보를 알려주시면
    진행 가능합니다. 주문서는 반드시 리턴신청으로 처리해주셔야 출고가 되지 않습니다.
\t(리턴대행 수수료 1,000원, 중국내 택배비 별도)

30. 국제배송 시 파손 가능성이 있는 제품(유리, 모니터, TV, 조명, 도자기 등 부피가 큰 제품)은 고객님 요청시 특수포장으로
    보완처리 해드리나, 출고 후 파손에 대해서는 넥스트배송에서 책임지지 않으니 고객님의 각별한 주의를 부탁드립니다.
    (화물보험에 넥스트배송에 지불하신 배송비는 포함되어 있지 않습니다.)

31. CJ대한통운, 한진택배에서 지정한 기준 무게, 부피 초과시 추가 운임 비용 부과됩니다. (CJ,한진택배 할증운임)


32. 국내배송은 국내 택배사와 연계하여 진행되며 택배사의 규정상 한 상품의 부피가 가로+세로+높이를 합한 값이
    160cm를 초과, 한 변의 길이가 95cm를 초과, 중량이 20kg 초과일 경우 중량화물운송사에 위탁되어 배송이 진행됩니다.
    또한 택배사 정책에 의거한 취급불가 제품 (쉽게 파손되는 제품)도 중량 화물로 진행 됩니다.

33. "넥스트배송"에서는 전자상거래에서는 무게운임만 적용합니다.
    단, 부피 무게가 발생하는 제품이 지속적으로 선적될 경우 사전 안내 후 부피 무게를 청구할 수 있습니다.
\t
    (항공:가로(cm)×세로(cm)×높이(cm) ÷6000= 부피무게)
    (해운:가로(cm)×세로(cm)×높이(cm) ÷5000= 부피무게)

34. 정밀검수, 추가 부가서비스 포장 옵션을 선택하지 않은 상품의 경우, 파손에 대해서는 "넥스트배송"에서 책임지지 않으니
    고객님의 각별한 주의를 부탁드립니다.
    “넥스트배송”에서 정상출고 된 화물에 대해서는 “넥스트배송”에서 어떠한 것도 책임이 없음을 안내드립니다.

35. 사업자통관(LCL)은 1CBM = 200KG 기준으로 계산되어 해상운임이 청구됩니다.

36. 사업자통관(LCL) 상품의 수취인은 필요한 통관서류를 미리 확보하셔야 빠른 통관이 가능합니다.

37. 위 주의사항에 동의 하고 배송대행/구매대행/사업자통관(LCL) 을 신청함에 따라 주의사항 미숙지로 인한 불이익에
    어떠한 이의를 제기할 수 없습니다.

[구매대행 유의사항]

1. 기본 견적은 국제 배송비를 제외한 상품가격(중국택배포함)+ “넥스트배송” 기본 대행 수수료를 기본 견적으로 합니다.

2. “넥스트배송”의 기본대행수수료는 상품가격(중국택배포함)의 5%입니다. (최저수수료 2,000원)

3. 구매 견적에서 확인된 금액은 예치금 결제 및 무통장 입금만 가능합니다..

4. 구매대행에 따른 환율 적용은 당사 홈페이지상 환율기준으로 진행합니다. 구매대행에 따른 환율, 이용수수료, 배송비
등을 확인하고 신청합니다.

5.  “넥스트배송”은 고객님의 서비스 이용 요청이 다음 각 호의 어느 하나에 해당하는 경우 서비스 제공을 거절할 수 있습니다.
① 신청내용에 허위, 기재누락, 오기가 있는 경우
② 이용자가 요청한 서비스의 제공이 회사의 경영상 또는 기술상의 이유로 현저히 곤란한 경우
③ 이용자가 불법 또는 부당한 목적을 위해 서비스를 이용하는 것으로 판단되는 경우

6. 상품 파손, 오염, 재고 없음으로 인하여 배송이 불가능한 경우에는 환불이 가능하지만 주문완료 이후 고객 변심에 의한 취소 처리는 불가능하며
   환불 역시 불가능합니다. (1차 구매비용지불 이전에는 언제든지 취소 가능합니다)

7. 구매대행으로 구입하신 제품의 AS요청시 고객님이 직접 판매자와 대화하셔야 하며 “넥스트배송” 에서는 AS요청 서비스를 제공하지 않습니다.
   그리고 제품의 반송시 고객님이 직접 판매자에게 중국으로 반송해 주셔야 합니다.

8. 검수 및 재포장
① “넥스트배송”은 고객님의 구매 신청한 상품 등에 대하여 동일성 여부 및 하자·파손 여부 등의 확인을 위해 해당 상품의 개봉·검수를 반드시
   진행하셔야 합니다.
② “넥스트배송”은 상품의 하자, 파손 등을 발견한 경우, 고객님에게 이를 통보하고 고객님의 요청에 따라 계약을 해제 또는 해지하거나,
    상품 등의 인도를 진행합니다.
③ 고객님이 구매 신청한 상품 등에 대하여 회사가 검수를 통해 악취, 액체누수 등의 이상이 있다고 판단한 경우 이용자에게
   이러한 사실을 통지하고 해당 상품을 취소할 수 있습니다.`
});



const OverseasCareData = ref({show: false, checked : false, total_amount_kr: state.total_amount_kr, care_price : state.form.carePrice})

const calculateTotal = async () => {
  // 총 금액
  state.form.total_amount = state.form.items.reduce((acc, cur) => {
    return Number(acc) + Number(cur.unitPrice) * Number(cur.quantity);
  }, 0);
  // 총 수량
  state.form.total_quantity = state.form.items.reduce((acc, cur) => {
    return Number(acc) + Number(cur.quantity);
  }, 0);

  // 안심케어 비용 계산
  calculateCarePrice()
}

const calculateCarePrice = () => {
  state.total_amount_kr = Math.round(state.form.total_amount * 185);
  switch (true) {
    case state.total_amount_kr > 0 && state.total_amount_kr < 100000:
      state.form.carePrice = 500;
      break;
    case state.total_amount_kr > 100000 && state.total_amount_kr <= 150000:
      state.form.carePrice = 1000;
      break;
    case state.total_amount_kr > 150000 && state.total_amount_kr <= 200000:
      state.form.carePrice = 5000;
      break;
    case state.total_amount_kr > 200000 && state.total_amount_kr <= 250000:
      state.form.carePrice = 6000;
      break;
    case state.total_amount_kr > 250000 && state.total_amount_kr <= 300000:
      state.form.carePrice = 7000;
      break;
    case state.total_amount_kr > 300000 && state.total_amount_kr <= 350000:
      state.form.carePrice = 8000;
      break;
    case state.total_amount_kr > 350000 && state.total_amount_kr <= 400000:
      state.form.carePrice = 9000;
      break;
    case state.total_amount_kr > 400000 && state.total_amount_kr <= 450000:
      state.form.carePrice = 10000;
      break;
    case state.total_amount_kr > 450000 && state.total_amount_kr <= 500000:
      state.form.carePrice = 12000;
      break;
    case state.total_amount_kr > 500000 && state.total_amount_kr <= 550000:
      state.form.carePrice = 14000;
      break;
    case state.total_amount_kr > 550000 && state.total_amount_kr <= 600000:
      state.form.carePrice = 16000;
      break;
    case state.total_amount_kr > 600000 && state.total_amount_kr <= 650000:
      state.form.carePrice = 18000;
      break;
    case state.total_amount_kr > 650000 && state.total_amount_kr <= 700000:
      state.form.carePrice = 20000
      break;
    case state.total_amount_kr > 700000 && state.total_amount_kr <= 750000:
      state.form.carePrice = 21000
      break;
    case state.total_amount_kr > 750000 && state.total_amount_kr <= 800000:
      state.form.carePrice = 22000
      break;
    case state.total_amount_kr > 800000 && state.total_amount_kr <= 850000:
      state.form.carePrice = 23000
      break;
    case state.total_amount_kr > 850000 && state.total_amount_kr <= 900000:
      state.form.carePrice = 24000
      break;
    case state.total_amount_kr > 900000 && state.total_amount_kr <= 1000000:
      state.form.carePrice = 25000
      break;
    default:
      state.form.carePrice = 0;
  }

  OverseasCareData.value.total_amount_kr = state.total_amount_kr;
  OverseasCareData.value.care_price = state.form.carePrice;
}
const step3Input = () => {

};
const onClose = () => {
  emit("close");
};

let visible = computed({
  get: () => props.visible, // getter
  set: (value) => emit("close") // setter
});

// 주문정보 불러오기
const getOrderDetailForBridge = async () => {
  state.loading = true;
  if (bridgeFormData.value.record.orderId === "") {
    return false;
  }
  await useMarketOrderApi().getOrderDetailForBridge({id: bridgeFormData.value.record.orderId}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    const {marketOrder} = res.data;
    state.form.id = marketOrder[0].id;
    state.form.order_id = marketOrder[0].orderId;
    state.form.receiver_name = marketOrder[0].receiverName;
    state.form.receiver_name_en = fnHanEng(marketOrder[0].receiverName);
    state.form.receiver_tel1 = marketOrder[0].receiverTel1;
    state.form.receiver_addr1 = marketOrder[0].receiverAddr1;
    state.form.receiver_addr2 = marketOrder[0].receiverAddr2;
    state.form.receiver_addr1_en = fnHanEng(marketOrder[0].receiverAddr1);
    state.form.receiver_addr2_en = fnHanEng(marketOrder[0].receiverAddr2);
    state.form.receiver_post_code = marketOrder[0].receiverPostCode;
    state.form.personal_customs_clearance_code = marketOrder[0].personalCustomsClearanceCode;
    state.form.message = marketOrder[0].message;
    state.form.items = [];
    marketOrder.forEach(item => {
      state.form.items.push({
		  shipNm: "ycbridge",
		  prdCode: item.prdCode,
		  orderNo: item.orderNo,
		  prdImage: item.prdImage,
		  prdName: item.prdName,
		  prdNameCn: item.prdNameCn,
		  prdOptionName: item.prdOptionName,
		  prdUrl: item.prdUrl,
		  quantity: item.quantity,
		  unitPrice: item.prdPriceCn,
		  itemNo: item.itemNo,
		  message: item.message,
      });
    });
  }).catch(err => {
    message.error(err.message);
  }).finally(() => {
    state.loading = false;
  });
};

const showExpressModal = () =>{
  new daum.Postcode({
    oncomplete: function(data) {
      state.form.receiver_post_code = data.zonecode;
      state.form.receiver_addr1 = data.roadAddress;
      state.form.receiver_addr1_en = data.roadAddressEnglish;
    }
  }).open();
}

// 저장
const handleOk = () => {
  if (!state.form.receiver_name) {
    message.error("받는 사람을 입력해 주세요.");
    return false;
  }

  if (!state.form.personal_customs_clearance_code) {
    message.error("개인통관고유부호를 입력해 주세요.");
    return false;
  }
  if (state.checkPersonalCustomsClearanceCode === false) {
    message.error("개인통관고유부호를 확인해 주세요.");
    return false;
  }

  if (!state.form.receiver_tel1) {
    message.error("받는 사람 연락처를 입력해 주세요.");
    return false;
  }

  // check arc_seq
  if (state.form.items.some(item => item.arc_seq === "")) {
    message.error("통관품목을 선택해 주세요.");
    return false;
  }

  // // check PRO_NM
  // if (state.form.items.some(item => item.PRO_NM === "")) {
  //   message.error("상품명을 입력해 주세요.");
  //   return false;
  // }
  //
  // // check PRO_NM_CH
  // if (state.form.items.some(item => item.PRO_NM_CH === "")) {
  //   message.error("중문 상품명을 입력해 주세요.");
  //   return false;
  // }

  // check unitPrice
  if (state.form.items.some(item => item.unitPrice === "")) {
    message.error("단가를 입력해 주세요.");
    return false;
  }

  // check quantity
  if (state.form.items.some(item => item.quantity === "")) {
    message.error("수량을 입력해 주세요.");
    return false;
  }

  // check prdUrl
  if (state.form.items.some(item => item.prdUrl === "")) {
    message.error("상품 URL을 입력해 주세요.");
    return false;
  }

  // check prdImage
  if (state.form.items.some(item => item.prdImage === "")) {
    message.error("이미지 URL을 입력해 주세요.");
    return false;
  }

  showConfirm();
};

const showConfirm = () => {
  Modal.confirm({
    title: "추가 수정 사항은 없으신가요?",
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode("div", {style: "color:red;"}, "*주문 건 정보 수정은 배대지 사이트에서만 가능합니다."),
    onOk() {
      state.confirmLoading = true;
      useMarketOrderApi().registerBridgeOrder(state.form).then(res => {
        if (res.status !== "2000") {
          message.error(res.message);
          state.confirmLoading = false;
          return false;
        }
        state.confirmLoading = false;
        message.success(`${state.form.app_type} 신청서가 등록되었습니다.`);
        emit("update");
        emit("close");
      }).catch(err => {
        message.error(err.message);
        state.confirmLoading = false;
      });
    },
    onCancel() {
      console.log("Cancel");
    },
    class: "test"
  });
};

// 한글->영문 이름 번역
const fnHanEng = (pVal) => {

  let sCho, sJung, sChong;

  sCho = ["G", "Gg", "N", "D", "Tt", "R", "M", "B", "Pp", "S", "Ss", "O",
    "J", "Jj", "Ch", "K", "T", "P", "H"];
  sJung = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae",
    "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];
  sChong = ["", "g", "gg", "gs", "n", "nz", "nh", "d", "l", "lg", "lm",
    "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s", "ss", "ng", "z",
    "ch", "k", "t", "p", "h"];

  var sVal = pVal;

  var t = "";
  var tmp = "";
  var n, n1, n2, n3;
  var c, d;
  let i;
  for (i = 0; i < sVal.length; i++) {
    c = sVal.charAt(i);
    n = parseInt(escape(c).replace(/%u/g, ""), 16);
    if (n >= 0xAC00 && n <= 0xD7A3) {
      n = n - 0xAC00;
      n1 = Math.floor(n / (21 * 28));
      n = n % (21 * 28);
      n2 = Math.floor(n / 28);
      n3 = Math.floor(n % 28);
      tmp = sCho[n1] + sJung[n2] + sChong[n3];
      if (tmp.length > 1 && tmp.charAt(0) == "O")
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
};
const fnHanEng2 = (pVal, Target) => {

  let sCho, sJung, sChong;

  sCho = ["G", "Gg", "N", "D", "Tt", "R", "M", "B", "Pp", "S", "Ss", "O",
    "J", "Jj", "Ch", "K", "T", "P", "H"];
  sJung = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae",
    "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];
  sChong = ["", "g", "gg", "gs", "n", "nz", "nh", "d", "l", "lg", "lm",
    "lb", "ls", "lt", "lp", "lh", "m", "b", "bs", "s", "ss", "ng", "z",
    "ch", "k", "t", "p", "h"];

  var sVal = pVal;

  var t = "";
  var tmp = "";
  var n, n1, n2, n3;
  var c, d;
  let i;
  for (i = 0; i < sVal.length; i++) {
    c = sVal.charAt(i);
    n = parseInt(escape(c).replace(/%u/g, ""), 16);
    if (n >= 0xAC00 && n <= 0xD7A3) {
      n = n - 0xAC00;
      n1 = Math.floor(n / (21 * 28));
      n = n % (21 * 28);
      n2 = Math.floor(n / 28);
      n3 = Math.floor(n % 28);
      tmp = sCho[n1] + sJung[n2] + sChong[n3];
      if (tmp.length > 1 && tmp.charAt(0) == "O")
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
};

// 관세 API
function RRN_NO_API() {
  if (!state.form.personal_customs_clearance_code) {
    message.error("먼저 개인통관고유부호를 입력해 주세요.");
    return false;
  }
  if (!state.form.receiver_name) {
    message.error("먼저 받는 사람을 입력해 주세요.");
    return false;
  }
  if (!state.form.receiver_tel1) {
    message.error("먼저 받는 사람 연락처를 입력해 주세요.");
    return false;
  }

  state.checkClearanceCodeLoading = true;
  useBridgeApi().checkPersonalCustomsClearanceCode({
	  personal_customs_clearance_code: state.form.personal_customs_clearance_code,
	  receiver_name: state.form.receiver_name,
	  receiver_tel: state.form.receiver_tel1.replace(/-/gi, "")
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
  });
}

// 통관 품목 불러오기
const getCategory = async (arc_seq, index) => {
	if (!arc_seq) {
		message.error('통관품목을 입력해 주세요.');
		return false;
	}

	state.loading = true;
	useBridgeApi().getArcSeq({arc_seq: arc_seq}).then(res => {
		console.log(res)
		if (res.status !== "2000") {
			message.error("통관품목을 불러오기 실패하였습니다. 새로고침후 다시 시도해 주세요.");
			return false;
		}

		const ArcSeqInfo = res?.data['RESULT_DATA'];
		if (ArcSeqInfo['HS'][0] === false || ArcSeqInfo['HS'] === 'NONE') {
			message.error("정확한 통관품목을 입력해 주세요.");
			return false;
		}

		state.form.items[index].prd_name_en = ArcSeqInfo['EN'] ?? '';
		state.form.items[index].hs_code = ArcSeqInfo['HS'][0]['CODE'] ?? '';

	}).catch(err => {
		message.error(err);
	}).finally(() => {
		state.loading = false;
	});
};

const validateUploadImage = (file) => {
	const isJPG = file.type === "image/jpeg";
	const isJPEG = file.type === "image/jpeg";
	const isGIF = file.type === "image/gif";
	const isPNG = file.type === "image/png";

	if (!(isJPG || isJPEG || isPNG || isGIF)) {
		message.warning("허용되는 이미지 격식이 아닙니다.");
		return false;
	}

	return true;
}

const handleUploadChange = (option, index) => {

	console.log(option)

	// const formData = new FormData();
	// formData.append("file", option.file);
	// formData.append("image_type", "product");
	// formData.append("relation_type", "product");
	// formData.append("product_idx", state.form.order_id);
	//
	// AuthRequest.post(
	// 	process.env.VUE_APP_API_URL + "/api/image",
	// 	formData
	// ).then(res => {
	// 	console.log(res)
	// })
}

// 개인통관부호 change 이벤트
const handleRrnCdChange = (value) => {
  if (state.form.rrn_cd === "사업자통관") {
    state.form.fileList = [];
    message.info("사업자통관은 33,000원 통관비가 적용됩니다.");
  }
};

const setMessage = (message, options) => {
  state.form.message = message;
};

const copyItem = (index) => {
  state.form.items.push(JSON.parse(JSON.stringify(state.form.items[index])));
  calculateTotal();
};

const parseMarketOrderData = reactive({show : false, orderData : {} })
const parseMarketOrder = (index) => {
  parseMarketOrderData.show = true
};

// item 기본구조 정의
const initItem = {
    unitPrice: 0,
    quantity: 1,
    prdUrl: "",
    prdImage: "",
    hs_code: "",
    rrn_no_con: "N",
    prdUrl_kr: "",
    origin_text: "",
    user_code: "",
    brand_en: "",
    brand_cn: "",
    product_weight: "",
    option_color: "",
    option_size: "",
    product_unit: "",
    cn_order_id: "",
    arc_seq: "",
    prd_name_en: "",
    prd_name_cn: "",
}

const addItem = () => {
  state.form.items.push(initItem);
  calculateTotal();
};

const removeItem = (index) => {
  if (state.form.items.length === 1) {
    message.error("한개 이상의 상품이 필요합니다.");
    return false;
  }
  state.form.items.splice(index, 1);
  calculateTotal();
}

const showCareInfo = () => {
  if (state.form.total_amount === 0) {
    message.error("상품 정보가 입력이 안되면 보험 가입이 불가능합니다. 상품정보를 입력해주세요.");
    return;
  }

  if (state.form.total_amount * 185 > 1000000) {
    message.error("보험료 요율 구간이 최대 한화 기준 100만원 이상이면 보험 가입이 불가능합니다.");
    return;
  }

  if (state.form.is_care === true) {
    OverseasCareData.value.checked = false;
    state.form.is_care = false;
    return;
  }
  OverseasCareData.value.show = true;
}

watchEffect(() => {
  if (visible.value && (bridgeFormData.value.record.orderId === "" || bridgeFormData.value.record.orderId !== state.form.order_id)) {
    getOrderDetailForBridge();
    calculateTotal();
  }

  if (OverseasCareData.value.checked === true) {
    state.form.is_care = true;
  }

  // 장바구니 & 주문복사 에서 데이타 넘어오면 실행
  if (parseMarketOrderData.orderData.hasOwnProperty('items')) {
    // parseMarketOrderData.orderDat 의 데이타를 initItem 구조에 맞게 매핑하고
    // state.form.items 에 넣어준다.
    state.form.items = parseMarketOrderData.orderData.items.map(item => {
      const newItem = {...initItem};
      newItem.cn_order_id = parseMarketOrderData.orderData.orderNo;
      newItem.unitPrice = item.price;
      newItem.prd_name_cn = item.prdName;
      newItem.prdUrl = item.prdUrl;
      newItem.prdImage = item.imgUrl;
      newItem.option_color = item.sku;
      return newItem;
    });
    calculateTotal();
    parseMarketOrderData.orderData = {}
  }

});

</script>
<style>
.showModal::-webkit-scrollbar {
  display: none;
}

.fw {
  font-weight: bold;
}

.fs12 {
  font-size: 12px;
}

.fs20 {
  font-size: 20px;
}

.cor-ora {
  color: #DA8464;
}

.cor-white {
  color: white;
}

.col-blue {
  color: #2A6BD0;
}

.title {
  font-weight: bold;
  font-size: 16px;
}

.mt0 {
  margin-top: 0;
}

.bg-b {
  background-color: black;
}

.bottom-border {
  border-bottom: 1px solid #F3F3F3;
}

.bg-f {
  background-color: #F0F0F0;
}

.bg-fa {
  background-color: #FAFAFA;
}

.mb0 {
  margin-bottom: 0;
}

.divider {
  height: 2px;
}

.textarea {
  color: black !important;
  cursor: inherit !important;
  padding: 20px;
  height: 160px !important;
  resize: none !important;
  line-height: 1.5 !important;
}

.textarea2 {
  width: 80%;
  resize: none !important;
}

#bridgeForm .showModal input, #bridgeForm .ant-select, #bridgeForm .ant-select-selector, #bridgeForm .ant-select-selection-item {
  height: 40px !important;
  line-height: 40px !important;
}

#bridgeForm .ant-modal .ant-modal-content {
  padding-bottom: 0;
}

.ant-tag-blue, .ant-tag-red, .ant-tag-orange {
  background: none;
  border-radius: 10px;
}

.btn-wrap button {
  width: 150px;
  height: 40px;
  border: 0;
}

.btn-wrap button:first-child {
  border: 1px solid #EFEAC1;
}

.btn-wrap button:last-child {
  background-color: #FFDA41;
}

.help-input-wrap {
  position: relative;
}

.help-input {
  position: absolute;
  color: red;
  font-weight: bold;
  z-index: 99;
  left: 182px;
  top: 9px;
}

.help-input-wrap input:focus:empty + .help-input {
  display: block;
}

.help-input-wrap input:focus:not(:empty) + .help-input {
  display: none;
}

.help-input-wrap input:not(:focus):empty + .help-input {
  display: block;
}

.step1 .flex-wrap {
  width: 100%;
}

#bridgeForm .step3-select {
  width: 100%;
}

.step3-button {
  min-width: 150px;
  height: 40px;
}

.step4-end {
  display: flex;
  justify-content: flex-end;
}

#bridgeForm .step4-select {
  width: 200px;
}

#bridgeForm .step4-select2 {
  width: 100%;
}

.step4-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.step4-right-text {
  display: flex;
  align-items: center;
}

.step4-money-wrap {
  height: 40px;
  color: #F6E87A;
  display: flex;
  align-items: center;
}

.footer-wrap {
  border-radius: 5px 5px 0 0;
  color: white;
}

.footer-wrap .ant-col {
  flex-direction: column;
}

.footer-wrap .under-line {
  padding-bottom: 2px;
  border-bottom: 1px solid white;
}

#bridgeForm .ant-modal-content {
  height: 100% !important;
}
</style>