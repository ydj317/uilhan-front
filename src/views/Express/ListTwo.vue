<template>
	<div class="list-two-wrap fl-c fl-tc bg-F1F3F8">
    <a-flex align="center" gap="6" class="status-wrap fs14 p6 bg-white font-SCDream5">
      <div class="status-list fl-cc fl-c cp" v-for="v in state.statusList">
        <div>{{ v.name }}</div>
        <div class="mt5" :class="v.num == 0 ? 'color-abb1be':'color-2755f9'">{{v.num}}</div>
      </div>
      <div class="show-more br10 p10 fl-cc"><DownOutlined /></div>
      <QuestionCircleOutlined class="fs15 color-b9bdc9 ml2" />
      <div class="email-wrap fl-cc fl-c">
        <div class="fs12">사서함 번호</div>
        <div class="color-2755f9 fw pt5">#70203</div>
      </div>
    </a-flex>
    <a-flex class="rq-wrap mt12">
      <a-collapse accordion v-model:activeKey="state.collapseActiveKey" :bordered="false">
        <a-collapse-panel key="1" :showArrow="false">
          <template #header>
            <a-flex class="t-white fl-tc fl-lb">
              <div class="fs13">중국 통관일정</div>
              <div>매일 오전 10시에 갱신되며,  통관업체의 사정에 따라 지연될 수 있습니다.</div>
              <div class="rq-wrap-arrow bg-898F9E br50 fl-cc"><UpOutlined class="arrow fs12 t-white " :class="{'down':state.collapseActiveKey != 1}" /></div>
            </a-flex>
          </template>
          <a-flex wrap="wrap" class="rq-list-wrap fl-ts" gap="10">
            <div class="rq-list p16 bg-white" v-for="v in state.rqList">
              <a-flex class="rq-type fl-lb fl-tc font-SCDream6">
                <div class="fl-cc">
                  <div class="fs16">{{v.location}}</div>
                  <img src="@/assets/img/express/ship.png" class="ml5 mb4"/>
                  <div class="fs13 ml5 color-2755f9">{{v.type}}</div>
                </div>
                <div class="color-abb1be">{{v.rq}}({{v.week}})</div>
              </a-flex>
              <a-divider class="color-e4e7ec mtb10" />
              <a-flex vertical gap="6">
                <a-flex class="fl-lb fl-tc" v-if="v.rqRange">
                  <div class="fl-tc font-SCDream4">
                    <div class="color-2755f9 fs16">{{v.rqRange}}</div>
                    <div class="ml5 fs12 color-898f9e">입항</div>
                  </div>
                  <a-button class="fs12 br20 bg-2755f9 t-white">반입예정</a-button>
                </a-flex>
                <a-flex class="fl-lb fl-tc" v-if="v.rqRange2">
                  <span>{{v.rqRange2}}<span class="ml5">입항</span></span>
                  <a-button class="fs12 br20 bg-898F9E t-white">검사예정</a-button>
                </a-flex>
              </a-flex>
            </div>
          </a-flex>
          <div class="rq-footer w100 fl-le fl-tc mt12">
            <div class="color-e4e7ec">항공 또는 다른 국가는 배송일정표를 확인해주세요.</div>
            <a-button ghost class="ml10 br20">배송일정표</a-button>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-flex>
    <a-flex class="card-wrap fl-lb mt12 mb20">
      <a-flex vertical class="card-list bg-white p16 fl-lb">
        <a-flex class="fl-lb">
          <img src="@/assets/img/express/ship.png" class="avatar br50"/>
          <a-flex vertical class="fl-te">
            <div class="fs14 color-898f9e font-SCDream4">파트너사업자 회원</div>
            <div class="fs20 color-3F4249 font-SCDream6 mt5">강형민</div>
          </a-flex>
        </a-flex>
        <a-flex wrap="wrap" class="card-btn-wrap fs14 color-3F4249">
          <a-button type="default" shape="round">
            <template #icon>
              <SettingOutlined />
            </template>
            사용자설정
          </a-button>
          <a-button type="default" shape="round">
            <template #icon>
              <img src="@/assets/img/express/excel.png" class="mr6"/>
            </template>
            내역받기
          </a-button>
          <a-button type="default" shape="round" class="bg-535660 t-white">트래킹번호 입력</a-button>
          <a-button type="default" shape="round" class="bg-2755f9 t-white">신청서 작성하기</a-button>
        </a-flex>
      </a-flex>
      <a-flex vertical class="card-list bg-white p16 fl-lb">
        <a-tabs v-model:activeKey="state.tabActiveKey" class="w100">
          <a-tab-pane key="1" tab="내역보기">
            <a-flex vertical class="h40">
              <a-flex class="fl-lb fl-tc color-2755f9">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol.png" class="symbol mr6"/>
                  <span>예치금</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
            <a-flex vertical class="h40 mt10">
              <a-flex class="fl-lb fl-tc color-3F4249">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol2.png" class="symbol mr6"/>
                  <span>토스머니</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
          </a-tab-pane>
          <a-tab-pane key="2" tab="예치금 환불">
            <a-flex vertical class="h40">
              <a-flex class="fl-lb fl-tc color-2755f9">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol.png" class="symbol mr6"/>
                  <span>예치금</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
            <a-flex vertical class="h40 mt10">
              <a-flex class="fl-lb fl-tc color-3F4249">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol2.png" class="symbol mr6"/>
                  <span>토스머니</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
          </a-tab-pane>
          <a-tab-pane key="3" tab="예치금 충전">
            <a-flex vertical class="h40">
              <a-flex class="fl-lb fl-tc color-2755f9">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol.png" class="symbol mr6"/>
                  <span>예치금</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
            <a-flex vertical class="h40 mt10">
              <a-flex class="fl-lb fl-tc color-3F4249">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/symbol2.png" class="symbol mr6"/>
                  <span>토스머니</span>
                </a-flex>
                <div class="fs20 font-SCDream6">95,473,940<span class="fs14 ml2">원</span></div>
              </a-flex>
            </a-flex>
          </a-tab-pane>
        </a-tabs>
      </a-flex>
      <a-flex vertical class="card-list bank-wrap p16 fl-lb">
        <img src="@/assets/img/express/bank-card.png" class="bank-card"/>
        <div class="fl-cc t-white fs15">현대카드 5115</div>
        <a-flex wrap="wrap" class="card-btn-wrap fs14">
          <a-button ghost shape="round" class="t-white">카드관리</a-button>
          <a-button ghost shape="round" class="t-white">카드추가</a-button>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-flex class="search-wrap bg-white fl-lb fl-tc">
      <a-flex class="search-left fl-tc" gap="5">
        <a-select v-model:value="state.search.location">
          <a-select-option value="">토스토스 지점</a-select-option>
          <a-select-option value="칭다오">칭다오</a-select-option>
          <a-select-option value="광저우">광저우</a-select-option>
          <a-select-option value="웨이하이">웨이하이</a-select-option>
          <a-select-option value="B2B">B2B</a-select-option>
          <a-select-option value="오리건">오리건</a-select-option>
          <a-select-option value="캘리포니아">캘리포니아</a-select-option>
          <a-select-option value="영국">영국</a-select-option>
          <a-select-option value="독일">독일</a-select-option>
          <a-select-option value="도쿄">도쿄</a-select-option>
          <a-select-option value="인천">인천</a-select-option>
          <a-select-option value="3PL">3PL</a-select-option>
          <a-select-option value="지구별">지구별</a-select-option>
        </a-select>
        <a-divider type="vertical" class="mlr5" :style="{background:'#CFD2DA'}" />
        <a-date-picker v-model:value="state.search.rqStart" placeholder="시작일" class="rqStart"/>
        <span>~</span>
        <a-date-picker v-model:value="state.search.rqEnd" placeholder="종료일" class="rqEnd"/>
        <a-divider type="vertical" class="mlr5" :style="{background:'#CFD2DA'}" />
        <a-input-group compact class="search-group fl-tc">
          <a-select v-model:value="state.search.searchKey">
            <a-select-option value="받는사람">받는사람</a-select-option>
            <a-select-option value="전화번호">전화번호</a-select-option>
            <a-select-option value="트래킹번호">트래킹번호</a-select-option>
            <a-select-option value="운송장번호">운송장번호</a-select-option>
            <a-select-option value="운송장번호">구매주문번호</a-select-option>
            <a-select-option value="운송장번호">신청서주문번호</a-select-option>
            <a-select-option value="운송장번호">상품명</a-select-option>
            <a-select-option value="운송장번호">쇼핑몰관리번호</a-select-option>
          </a-select>
          <a-input-search
            v-model:value="state.search.searchValue"
            placeholder="이름 첫 글자부터 입력"
            class="search-btn"
          >
          </a-input-search>
        </a-input-group>
      </a-flex>
      <a-flex class="search-right fl-tc" gap="20">
        <div class="cp color-969DAE fl fl00" :class="{'color-2755f9':state.search.weight}" @click="state.search.weight = !state.search.weight">
          <div>중량화물</div>
          <div class="ml5"><CheckOutlined /></div>
        </div>
        <a-select v-model:value="state.search.sort">
          <a-select-option value="">정렬기준</a-select-option>
          <a-select-option value="등록일">등록일</a-select-option>
          <a-select-option value="처리일">처리일</a-select-option>
          <a-select-option value="입고시간">입고시간</a-select-option>
        </a-select>
        <a-select v-model:value="state.search.pageSize">
          <a-select-option value="">페이지당 개수</a-select-option>
          <a-select-option value="30">30개</a-select-option>
          <a-select-option value="50">50개</a-select-option>
          <a-select-option value="100">100개</a-select-option>
        </a-select>
      </a-flex>
    </a-flex>
    <a-flex vertical class="table-list-wrap" gap="20">
      <a-flex vertical class="table-list"  v-for="i in 3">
        <a-flex class="table-list-header fl-tc fl-lb w100 h54">
          <a-flex class="fl-tc">
            <img src="@/assets/img/express/pending.png"/>
            <span class="ml10 fs16 color-969DAE">접수대기</span>
          </a-flex>
          <a-flex class="fl-tc" gap="10">
            <span class="color-898f9e fs13">접수 24. 00. 00 00:00</span>
            <span class="fs14">
              <span class="color-6B6F7C">주문번호: </span>
              <span class="color-2755f9 font-SCDream6">240101</span>
              <span class="color-3F4249">-8294112</span>
            </span>
            <span class="color-6B6F7C fs14">주문상세 <RightOutlined /></span>
            <a-checkbox v-model:checked="checked" />
          </a-flex>
        </a-flex>
        <a-flex class="table-list-content mb20" gap="20">
            <a-flex vertical class="table-content-left">
              <div class="h34 fs20 color-3F4249 fl-tc">김재현</div>
              <a-flex gap="16" class="mt18 h34">
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/USA.png"/>
                  <div class="ml7">오리건</div>
                </a-flex>
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/flight.png"/>
                  <div class="ml7">항공</div>
                </a-flex>
                <a-flex class="fl-tc">
                  <img src="@/assets/img/express/number-one.png"/>
                  <div class="ml7">단독배송</div>
                  <div class="ml7 color-2755f9">5개</div>
                </a-flex>
              </a-flex>
              <a-flex class="fl-tc fl-lb mt10">
                <a-flex wrap="wrap" gap="6" class="fs13">
                  <div class="check-list">택배개봉금지</div>
                  <div class="check-list">택배개봉금지</div>
                  <div class="check-list">택배개봉금지</div>
                  <div class="check-list">택배개봉금지</div>
                  <div class="check-list">택배개봉금지</div>
                  <QuestionCircleOutlined class="ml5" />
                </a-flex>
                <img src="@/assets/img/express/china.png" width="80" height="80"/>
              </a-flex>
              <a-flex vertical class="mt10">
                <a-flex class="fl-lb fl-tc">
                  <a-flex class="fl-tc fs13" gap="6">
                    <div class="color-898f9e">멀티박스</div>
                    <div class="color-2755f9">0건</div>
                    <div class="bg-F1F3F8 br5 p5">중량착불</div>
                  </a-flex>
                  <DownOutlined />
                </a-flex>
                <a-flex class="fl-tc mt10">
                  <div class="bg-898F9E br5 p6 t-white fs14">Master BL   TOS0000000</div>
                  <img src="@/assets/img/express/copy.png" class="ml6 cp"/>
                </a-flex>
                <a-flex class="fl-tc fl-lb mt10">
                  <a-flex vertical class="fl-lc" gap="6">
                    <a-flex class="fl-tc" gap="6">
                      <span>1.</span>
                      <img src="@/assets/img/express/cj.png"/>
                      <span>0000000000000</span>
                      <img src="@/assets/img/express/copy.png" class="cp"/>
                    </a-flex>
                    <div class="mt6 fs13 color-898f9e">지점출고 24. 00. 00 00:00</div>
                  </a-flex>
                  <a-button shape="round" class="t-white fs14 bg-2755f9">배송조회</a-button>
                </a-flex>
              </a-flex>
            </a-flex>
            <a-flex vertical class="table-content-center font-SCDream4">
              <a-flex vertical gap="15">
                  <a-flex class="fl-lb">
                    <a-flex class="fl-tc" gap="5">
                      <a-button class="t-white fs13 bg-ff3049">중복송장</a-button>
                      <a-button class="t-white fs13 bg-6b6f7c">목록통관</a-button>
                      <div class="fs14 color-6B6F7C">총 금액</div>
                      <div class="fs14 color-3F4249 font-SCDream6">USD $239.96</div>
                    </a-flex>
                    <a-flex gap="5" class="fs14 fl-tc fl-le">
                      <span class="color-6B6F7C">총 수량</span>
                      <span>86개</span>
                      <DownOutlined />
                    </a-flex>
                  </a-flex>
              </a-flex>
              <a-divider class="mtb15" />
              <a-flex vertical class="center-list" gap="40">
                <a-flex class="fl-lb" gap="20" v-for="i in 6">
                  <a-flex vertical gap="15">
                    <div class="fs14 color-3F4249 font-SCDream6">장난감 (playing toys)</div>
                    <a-flex class="fs13 color-6B6F7C fl-lb">
                      <div>옵션</div>
                      <div>2개</div>
                    </a-flex>
                    <a-flex class="fs13 color-6B6F7C fl-lb">
                      <div>단가</div>
                      <div class="color-3F4249 font-SCDream6">USD $119.98</div>
                    </a-flex>
                    <input-on @input="handleInput" :key="Math.random()" />
                    <input-on @input="handleInput" :key="Math.random()" />
                  </a-flex>
                  <img src="@/assets/img/express/cj.png" width="140" height="140"/>
                </a-flex>
              </a-flex>
            </a-flex>
          <a-flex vertical class="table-content-right">
            <a-flex vertical class="right-status" gap="10">
              <a-flex vertical class="bg-F1F3F8 br15 w100 p20">
                <a-flex class="fl-tc fl-le fs14">
                  <div>메모</div>
                  <img src="@/assets/img/express/memo-add.png" class="ml5"/>
                  <div class="ml25">문의</div>
                  <img src="@/assets/img/express/support_agent_hui.png" class="ml5"/>
                </a-flex>
                <div class="fs16 color-3F4249 mt30 font-SCDream6">트래킹 번호를 입력하세요.</div>
                <div class="fs14 color-6B6F7C mt10">트래킹 번호를 입력해야 접수 신청이 완료됩니다.</div>
                <a-button shape="round" class="t-white fs14 bg-2755f9 mt20 h40">입력하기</a-button>
              </a-flex>
              <a-flex gap="10">
                <a-button class="color-3F4249 fs14 bg-F1F3F8 w50 b0 h40">신청서 수정</a-button>
                <a-button class="color-3F4249 fs14 bg-F1F3F8 w50 b0 h40">접수 취소</a-button>
              </a-flex>
            </a-flex>
<!--            <a-flex vertical class="right-status" gap="10">-->
<!--              <a-flex vertical class="bg-F1F3F8 br15 w100 p20">-->
<!--                <a-flex class="fl-tc fl-le fs14">-->
<!--                  <div>메모</div>-->
<!--                  <img src="@/assets/img/express/memo-add.png" class="ml5"/>-->
<!--                  <div class="ml25">문의</div>-->
<!--                  <img src="@/assets/img/express/support_agent_hui.png" class="ml5"/>-->
<!--                </a-flex>-->
<!--                <div class="fs16 color-3F4249 mt30 font-SCDream6">배송비를 결제해주세요.</div>-->
<!--                <div class="fs14 color-6B6F7C mt10">결제완료 후 출고를 시작합니다.</div>-->
<!--                <a-flex vertical class="bg-white br15 p20 mt20" gap="15">-->
<!--                  <a-flex class="fl-lb fs13 color-3F4249">-->
<!--                    <div>가로*세로*높이</div>-->
<!--                    <div>16 * 25 * 11</div>-->
<!--                  </a-flex>-->
<!--                  <a-flex class="fl-lb fs13 color-969DAE">-->
<!--                    <div class="fl-tc">-->
<!--                      <CheckOutlined />-->
<!--                      <span class="ml5">부피무게</span>-->
<!--                    </div>-->
<!--                    <div>0.7kg</div>-->
<!--                  </a-flex>-->
<!--                  <a-flex class="fl-lb fs13 color-2755f9">-->
<!--                    <div class="fl-tc">-->
<!--                      <CheckOutlined />-->
<!--                      <span class="ml5">실무게</span>-->
<!--                    </div>-->
<!--                    <div>0.2kg</div>-->
<!--                  </a-flex>-->
<!--                  <a-flex class="fl-lb fs13 color-3F4249">-->
<!--                    <div>결제 금액</div>-->
<!--                    <div class="color-2755f9 font-SCDream6">6,600원</div>-->
<!--                  </a-flex>-->
<!--                  <a-button class="t-white fs14 bg-2755f9 b0 h40">결제하기</a-button>-->
<!--                </a-flex>-->
<!--                <div class="fl-cc color-2755f9 fs14 mt20">반품 신청</div>-->
<!--              </a-flex>-->
<!--              <a-flex gap="10">-->
<!--                <a-button class="color-3F4249 fs14 bg-F1F3F8 w50 b0 h40">배송 방법 변경</a-button>-->
<!--                <a-button class="color-3F4249 fs14 bg-F1F3F8 w50 b0 h40">수령인 변경</a-button>-->
<!--              </a-flex>-->
<!--            </a-flex>-->
<!--            <a-flex vertical class="right-status" gap="10">-->
<!--              <a-flex vertical class="bg-F1F3F8 br15 w100 p20">-->
<!--                <a-flex class="fl-tc fl-lb fs14">-->
<!--                  <img src="@/assets/img/express/memo-add.png" class="br50" width="34" height="34"/>-->
<!--                  <a-flex class="fl-tc">-->
<!--                    <div class="memo-bg"></div>-->
<!--                    <div class="ml25">문의</div>-->
<!--                    <img src="@/assets/img/express/support_agent_hui.png" class="ml5"/>-->
<!--                  </a-flex>-->
<!--                </a-flex>-->
<!--                <div class="fs16 color-3F4249 mt30 font-SCDream6">접수 신청 완료</div>-->
<!--                <div class="fs14 color-6B6F7C mt10">상품이 아직 지점으로 도착하지 않았습니다.</div>-->
<!--              </a-flex>-->
<!--              <a-flex gap="10">-->
<!--                <a-button class="color-3F4249 fs14 bg-F1F3F8 w50 b0 h40">신청서 수정</a-button>-->
<!--                <a-button class="color-3F4249 fs14 bg-F1F3F8 w50 b0 h40">접수 취소</a-button>-->
<!--              </a-flex>-->
<!--            </a-flex>-->
          </a-flex>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-pagination
      class="w100 fl-cc mt15 font-SCDream4"
      v-model:current="state.search.page"
      v-model:page-size="state.search.pageSize"
      @change="onPageChange"
      :total="state.search.total"
      :show-total="(total, range) => `[총 ${total}개]  검색결과 - ${range[0]}-${range[1]}`"
      :showSizeChanger="false"
    />
    <a-flex vertical align="center" class="mt50 bg-3f4249 w100 p50" gap="14">
      <a-flex class="fs24 t-white font-SCDream6 fl-tc">
        <img src="@/assets/img/express/union.png" height="23"/>
        <div class="ml10">노데이터</div>
      </a-flex>
      <div class="fs16 color-cfd2da font-SCDream4">신청서에 등록되지 않은 트래킹 번호</div>
      <a-flex class="fs16 bg-535660 t-white font-SCDream4 p10 br10 w100 fl-lc" gap="20">
          <div>1. 입고일 기준 3개월 이후 폐기(보상불가)됩니다. </div>
          <div>2. 판매자가 물건을 나눠서 배송했을 수 있습니다. </div>
          <div>3. 트래킹번호 확인 후 신청서에 등록 시 사라집니다. </div>
      </a-flex>
      <a-flex wrap="wrap" class="footer-list mt20 w80 pl80" gap="20">
        <a-flex class="footer-list-main bg-white br15" gap="10" v-for="i in 5">
          <div class="footer-list-img fl-cc">
            <template v-if="i == 1">
              <div class="upload-wrap fl-cc bg-F1F3F8">
                <a-upload name="file">
                  <a-button shape="round" class="fs14 bg-2755f9 t-white fl-cc">사진요청</a-button>
                </a-upload>
              </div>
            </template>
            <template v-if="i == 2">
              <div class="img-wrap">
                <img src="@/assets/img/express/symbol.png" class="br10"/>
                <div class="img-num t-white fs13 fl-cc">+3</div>
              </div>
            </template>
            <template v-if="i > 2">
              <div class="upload-wrap fl-cc fl-c bg-F1F3F8">
                <a-flex wrap="wrap" class="fs12 color-898f9e fl-cc w100" gap="5">
                  <div class="fl-cc">사진요청 일시</div>
                  <div class="fl-cc">24.00.00.00:00</div>
                </a-flex>
                <a-upload name="file" class="mt5">
                  <a-button shape="round" class="fs14 bg-535660 t-white fl-cc">요청취소</a-button>
                </a-upload>
              </div>
            </template>
          </div>
          <a-flex vertical>
            <a-flex class="fl-tc fl-lb">
              <a-flex class="fl-tc" gap="5">
                <img src="@/assets/img/express/china.png"/>
                <div class="fs16 color-3F4249">광저우</div>
                <div class="fs13 color-898f9e">24.07.03 16:51</div>
              </a-flex>
              <div class="footer-list-close fl-cc"><CloseOutlined class="t-white" /></div>
            </a-flex>
            <input-on class="mt10" width="240" :edit="false" :key="Math.random()" readonly  />
          </a-flex>
        </a-flex>
      </a-flex>
      <a-divider class="bg-6b6f7c w90" />
      <a-flex vertical align="center" gap="14" class="w100">
        <div class="fs24 t-white font-SCDream4 fl-cc">미입고 트래킹 번호</div>
        <div class="fs16 color-cfd2da font-SCDream4 fl-cc">지점에 도착한 화물의 외관이 파손 되었거나 해외 판매자가 회수요청을 한 경우</div>
        <a-flex wrap="wrap" class="footer-list mt20 w80 pl80" gap="20">
          <a-flex class="footer-list-main bg-white br15" gap="10" v-for="i in 2">
            <div class="footer-list-img fl-cc">
              <div class="img-wrap no-image">
                <img src="@/assets/img/express/symbol.png" class="br10"/>
              </div>
            </div>
            <a-flex vertical gap="10">
              <a-flex class="fl-tc fl-lb">
                <a-flex class="fl-tc" gap="5">
                  <img src="@/assets/img/express/china.png"/>
                  <div class="fs16 color-3F4249">광저우</div>
                </a-flex>
                <div class="footer-list-close fl-cc"><CloseOutlined class="t-white" /></div>
              </a-flex>
              <a-flex vertical class="fs15" gap="10">
                <div class="fs13 color-898f9e">접수: 24.07.03 16:51</div>
                <span class="color-898f9e">사유:<span class="color-3F4249">파손 수취 거부</span></span>
              </a-flex>
              <input-on class="mt10" width="240" :edit="false" :key="Math.random()" readonly />
            </a-flex>
          </a-flex>
        </a-flex>
      </a-flex>
    </a-flex>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from "vue";
import {DownOutlined,QuestionCircleOutlined,UpOutlined,SettingOutlined,CheckOutlined,RightOutlined,CloseOutlined} from "@ant-design/icons-vue";
import InputOn from "@/components/inputOn.vue";

const state = reactive({
	statusList: [
    {name:'접수대기',num:2},
    {name:'접수신청',num:0},
    {name:'부분입고',num:0},
    {name:'오류입고',num:0},
    {name:'재포장',num:0},
    {name:'전체입고',num:0},
    {name:'출고확정',num:0},
    {name:'결제대기',num:0},
    {name:'결제완료',num:0},
    {name:'출고완료',num:0},
    {name:'배송완료',num:0},
  ],
  collapseActiveKey:'1',
  tabActiveKey:'1',
  rqList:[
    {
      location:'칭다오',
      type:'해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.29 ~ 7.1',
    },
    {
      location:'칭다오',
      type:'평택해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.28 ~ 6.29',
      rqRange2:'6.24',
    },
    {
      location:'칭다오',
      type:'자이언트해상',
      rq:'7.3',
      week:'수',
      rqRange:'6.28 ~ 6.29',
      rqRange2:'6.24',
    },
    {
      location:'광저우',
      type:'해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.28',
    },
    {
      location:'웨이하이',
      type:'해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.28',
    },
    {
      location:'B2B',
      type:'해운',
      rq:'7.3',
      week:'수',
      rqRange:'6.28',
    }
  ],
  search: {
    location:'',
    rqStart:'',
    rqEnd:'',
    searchKey:'받는사람',
    searchValue:'',
    weight:false,
    sort:'',
    page:1,
    pageSize:10,
    total:100,
  },
});
const getList = () => {
  
};
const handleInput = (val) => {
  console.log('handleInput',val);
};
const onPageChange = (page, pageSize) => {
  state.search.page = page;
  state.search.pageSize = pageSize;
  getList();
};
onMounted(()=>{
  $('.ant-layout-content').css({'margin':"0"});
})
onUnmounted(()=>{
  $('.ant-layout-content').css({'margin':"0 20px"});
})
</script>
<style>
.list-two-wrap .rq-wrap .ant-collapse{
  width: 100%;
}
.list-two-wrap .ant-collapse-content-box{
  padding: 10px 8px!important;
}
.list-two-wrap .ant-tabs-tab-btn{
  color: #3F4249!important;
}
.list-two-wrap .ant-tabs-tab-active .ant-tabs-tab-btn{
  color: #fff!important;
}
.list-two-wrap .ant-tabs-ink-bar{
  width: 0!important;
}
.list-two-wrap .ant-tabs-tab-active{
  background: #535660;
  border-radius: 30px;
  padding: 10px 16px;
}
.list-two-wrap .ant-tabs-nav{
  padding-bottom: 20px;
}
.list-two-wrap .rqStart .ant-picker-input,.list-two-wrap .rqEnd .ant-picker-input{
  width: 120px;
  height: 40px;
  padding: 0 11px;
}
.list-two-wrap .ant-select-selector{
  height: 40px!important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.list-two-wrap .search-group .ant-input-group-addon{
  background-color: transparent;
}
.list-two-wrap .search-group .ant-select-selector,.list-two-wrap .search-group input,.list-two-wrap .search-group button{
  background: #F1F3F8;
  border: 0;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.list-two-wrap .search-group input,.list-two-wrap .search-group button{
  padding: 2px;
  justify-content: left;
}
.list-two-wrap .search-group .ant-select-selector{
  border-start-start-radius: 20px!important;
  border-end-start-radius: 20px!important;
}
.list-two-wrap .ant-input-group button{
  border-start-end-radius: 20px!important;
  border-end-end-radius: 20px!important;
}
</style>
<style scoped>
.status-wrap{
  width: 1080px;
  height: 77px;
  border-radius: 0 0 16px 16px;
  border: 1px solid #E4E7EC;
  border-top: 0;
  padding: 6px;
  box-shadow: 3px 4px 4px 0 rgba(0,0,0,0.1);
}
.status-list{
  width: 74px;
  height: 65px;
}
.status-list:hover{
  background: #F1F3F8;
  border-radius: 10px;
}
.show-more{
  width: 76px;
  height: 44px;
  border: 1px solid #E4E7EC;
}
.email-wrap{
  width: 84px;
  height: 38px;
}
.rq-wrap{
  width: 1080px;
  gap: 10px;
  border-radius: 16px;
  background: #535660;
}
.rq-wrap-arrow{
  width: 24px;
  height: 24px;
}
.rq-wrap-arrow .arrow.down{
  transform: rotate(180deg);
}
.rq-list{
  width: 258px;
  border-radius: 16px;
}
.card-wrap{
  width: 1080px;
  height: 200px;
}
.card-list{
  width: 350px;
  height: 200px;
  border-radius: 16px;
}
.card-list .avatar{
  width: 50px;
  height: 50px;
}
.card-list .symbol{
  width: 19px;
  height: 19px;
}
.card-btn-wrap{
  gap: 10px;
}
.card-btn-wrap button{
  width: 150px;
  height: 40px;
}
.bank-wrap{
  background: linear-gradient(180deg, #25272C 0%, #31394B 100%);
}
.card-list .bank-card{
  width: 117px;
  height: 24px;
}
.search-wrap{
  width:100%;
  height: 80px;
  padding: 0 60px;
  box-shadow: 2px 4px 10px 0 rgba(0,0,0,0.1);
}
.search-btn{
  width: 250px;
}
.rqStart,.rqEnd{
  padding: 0;
}
.table-list-wrap{
  margin: 20px 140px;
}
.table-list{
  max-height: 507px;
  border-radius: 24px;
  border: 1px solid #E4E7EC;
  padding: 6px 16px 16px;
  background: #fff;
  box-shadow: 2px 4px 10px 0 rgba(0,0,0,0.1);
}
.table-content-center{
  height: 281px;
}
.check-list{
  border: 1px solid #e9eefe;
  border-radius: 6px;
  padding: 4px 6px;
}
.center-list{
  overflow: hidden;
  overflow-y: scroll;
}
.center-list::-webkit-scrollbar{
  display: none;
}
.right-status{
  //width: 360px;
}
.memo-bg{
  width: 71px;
  height: 34px;
  background: url("../../assets/img/express/memo.png") no-repeat;
}
.footer-list-main{
  width: 366px;
  padding: 12px;
}
.upload-wrap,.img-wrap{
  width: 92px;
  height: 92px;
  border-radius: 10px;
  position: relative;
  z-index: 1;
}
.img-wrap img{
  width: 92px;
  height: 92px;
  border-radius: 10px;
}
.img-num{
  position: absolute;
  top: 5px;
  right: 5px;
  border-radius: 10px;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.5);
}
.img-wrap.no-image{
  background: #E4E7EC;
  z-index: 2;
}
.img-wrap.no-image img{
  display: none;
}
.img-wrap.no-image:before{
  content: 'NO IMAGE';
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #898F9E;
}
.footer-list-img button{
  width: 80px;
  height: 34px;
}
.footer-list-close{
  width: 24px;
  height: 24px;
  background: #3F4249;
  border-radius: 50%;
}
</style>
