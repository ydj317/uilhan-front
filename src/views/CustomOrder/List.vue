<template>
  <loading v-model:active="state.indicator.table" :can-cancel="false" :is-full-page="true"/>
  <div style="display: flex; gap: 10px">
    <a-card title="검색"  style=" width: 60%">
      <div id="header">
          <a-descriptions bordered :column="1" size="middle">
            <a-descriptions-item>
              <template #label>
                검색기간
                <a-tooltip>
                  <template #title>
                    <div>검색기간은 30일 단위로 조회 가능합니다.</div>
                  </template>
                  <QuestionCircleOutlined/>
                </a-tooltip>
              </template>
              <a-input-group compact>
                <a-space direction="vertical" :size="12">
                  <a-range-picker v-model:value="state.order_date" @change="onChangeDatePicker"/>
                </a-space>
              </a-input-group>
            </a-descriptions-item>
            <a-descriptions-item label="검색어">
              <a-input-group compact style="display: flex;">
                <a-select v-model:value="state.tableData.params.search_type" style="width: 150px;">
                  <a-select-option value="order_no">주문번호</a-select-option>
                  <a-select-option value="prd_name">상품명</a-select-option>
                  <a-select-option value="prd_code">상품코드</a-select-option>
                  <a-select-option value="item_no">품목코드</a-select-option>
                  <a-select-option value="barcode">고객사코드</a-select-option>
                  <a-select-option value="prd_option_name">옵션명</a-select-option>
                  <a-select-option value="prd_size_option">사이즈</a-select-option>
                  <a-select-option value="purchase_order_no">구매번호</a-select-option>
                  <a-select-option value="purchase_invoice_no">중국택배번호</a-select-option>
                  <a-select-option value="package_status_memo">택배현황 메모</a-select-option>
                  <a-select-option value="memo">메모</a-select-option>
                </a-select>
                <a-input v-model:value="state.tableData.params.search_value" style="width: 400px;" allowClear/>
              </a-input-group>
            </a-descriptions-item>

            <a-descriptions-item label="구매상태">
              <a-radio-group v-model:value="state.tableData.params.order_status" button-style="solid"
                             @change="handleOrderStatusChange">
                <a-radio-button value="">전체</a-radio-button>

                <a-radio-button v-for="option in state.orderStatus" :value="option.value">
                  {{ option.label }}
                  <a-spin v-if="state.indicator.count"></a-spin>
                  <span v-else>({{ state[option.value + 'Count'] }})</span>
                </a-radio-button>
              </a-radio-group>
            </a-descriptions-item>

            <a-descriptions-item label="입출고상태">

              <a-radio-group v-model:value="state.tableData.params.shipping_status" button-style="solid"
                             @change="handleOrderStatusChange">
                <a-radio-button value="">전체</a-radio-button>
                <a-radio-button v-for="option in state.shippingStatus" :value="option.value">
                  {{ option.label }}
                  <a-spin v-if="state.indicator.count"></a-spin>
                  <span v-else>({{ state[option.value + 'Count'] }})</span>
                </a-radio-button>
              </a-radio-group>
            </a-descriptions-item>
          </a-descriptions>



        <div style="display: flex;justify-content: center;">
          <a-button type="primary" @click.prevent="handleSearch" class="mt15">검색</a-button>
          <a-button @click="getTableData" class="ml15 mt15">초기화</a-button>
        </div>
      </div>
    </a-card>
    <a-card title="스캔" style="width: 100%;flex: 1;">
          <a-descriptions bordered :column="1" size="middle">
            <a-descriptions-item style="height: 100px;">
              <template #label>
                택배번호 스캔
              </template>
              <a-input
                  v-model:value="state.tableData.params.scan_package_no"
                    @keyup.enter="openDetailPopup"
                />

            </a-descriptions-item>
            <a-descriptions-item style="height: 100px;">
              <template #label>
                출고스캔
              </template>
              <a-input
                  v-model:value="state.tableData.params.scan_barcode"
                  @keyup.enter="searchWithBarcode"
              />

            </a-descriptions-item>
          </a-descriptions>
    </a-card>
  </div>
  <a-card class="mt15">
    <div class="mb15" style="display: flex;justify-content: space-between;">
      <div>
        <a-popconfirm title="삭제하시겠습니까?" @confirm="deleteCustomOrder">
          <a-button>삭제</a-button>
        </a-popconfirm>
        <a-popconfirm v-if="state.tableData.params.order_status === 'paid'" title="접수완료 처리 하시겠습니까?" @confirm="receiptCompleted">
          <a-button style="margin-left: 10px;">접수완료</a-button>
        </a-popconfirm>
      </div>
      <div class="right-div" style="display: flex;align-items: center;gap: 5px">
        <!--상품삭제-->
        <a-button style="margin-right: 5px;" @click="downloadCustomOrderExcel" type="primary">
          주문 다운로드
          <template #icon>
            <DownloadOutlined/>
          </template>
        </a-button>
        <a-spin v-if="state.indicator.download"/>

        <a-upload
            :action="state.uploadCustomOrderPath"
            v-model:fileList="state.fileList"
            name="file"
            :max-count="1"
            :headers="state.headers"
            :multiple="false"
            :showUploadList="false"
            @change="excelUploadCustomOrder"
        >
          <a-button class="custom-button" style="margin-right: 5px;" type="primary">
            주문 업로드
            <template #icon>
              <UploadOutlined/>
            </template>
          </a-button>
          <a-spin v-if="state.indicator.upload"/>
        </a-upload>
      </div>
    </div>
    <table class="header-table">
      <thead style="position: sticky;top: 0; background: #7273de; z-index: 100">
      <tr>
        <th rowspan="3">
          <a-checkbox @click.self="handleCheckAll"/>
        </th>
        <th style="width: 150px;">
          주문번호
        </th>
        <th style="width: 200px;" rowspan="3">상품명</th>
        <th rowspan="3">옵션이미지</th>
        <th>상품코드</th>
        <th>옵션명</th>
        <th  style="width: 20px;" rowspan="3">주문수량</th>
        <th>원가</th>
        <th>택배번호</th>
        <th rowspan="3">수수료</th>
        <th rowspan="3">금액</th>
        <th rowspan="3">구매번호</th>
        <th rowspan="3">실도착수량</th>
        <th rowspan="3">메모</th>
        <th rowspan="3">바코드</th>
        <th rowspan="3">입출고상태</th>
        <th style="width: 90px;" rowspan="3">액션</th>
      </tr>
      <tr>
        <th>주문일자</th>
        <th>품목코드</th>
        <th>사이즈</th>
        <th>실구매가</th>
        <th>택배현황</th>
      </tr>
      <tr>
        <th>구매상태</th>
        <th>고객사코드</th>
        <th></th>
        <th>현지운임</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="state.tableData.loading">
        <td colspan="8" style="padding: 80px;background-color: white">
          <a-spin size="large"/>
        </td>
      </tr>
      <template v-else v-for="(item, key) in state.tableData.data" :key="key">
        <tr :class="isInPattern(key+1) ? 'bg-blue' : 'bg-white'">
          <td rowspan="3" style="cursor: pointer;" @click.self="handleOrderChecked(item)">
            <a-checkbox v-model:checked="item.checked" @click.self="handleOrderChecked(item)"></a-checkbox>
          </td>
          <td>{{ item.order_no }}</td><!--주문번호-->
          <td rowspan="3">{{ item.prd_name }}</td><!--상품명-->
          <td rowspan="3">
            <a-image
                :src="item.prd_image"
                fallback="data:image/png;base64,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"
                style="z-index: -1; width: 60px; height: 60px; border-radius: 10px"
            />
          </td>
          <td>{{ item.prd_code }}</td><!--상품코드-->
          <td>{{ item.prd_option_name }}</td><!--옵션명-->
          <td rowspan="3">{{ item.quantity }}</td><!--주문수량-->
          <td>{{ item.original_price }}</td><!--원가-->
          <td>
            <a-input
                v-if="state.editableData[item.key]"
                v-model:value="state.editableData[item.key]['purchase_invoice_no']"
                style="margin: -5px 0"
            />
            <span v-else>
              {{ item.purchase_invoice_no }}
            </span>
          </td><!--택배번호-->

          <!--수수료-->
          <td rowspan="3">
            <a-input-number
                v-if="state.editableData[item.key]"
                v-model:value="state.editableData[item.key]['charge']"
                size="small"
                :min="0"
            />
            <span v-else>
              {{ item.charge }}
            </span>
          </td>

          <!--금액-->
          <td rowspan="3">
            <a-input-number
                v-if="state.editableData[item.key]"
                v-model:value="state.editableData[item.key]['total_payment_amount']"
                size="small"
                :min="0"
            />
            <span v-else>
              {{ item.total_payment_amount }}
            </span>
          </td>

          <!--구매번호-->
          <td rowspan="3">
            <a-input
                v-if="state.editableData[item.key]"
                v-model:value="state.editableData[item.key]['purchase_order_no']"
                size="small"
            />
            <span v-else>
              {{ item.purchase_order_no }}
            </span>
          </td>

          <!--실도착수량-->
          <td rowspan="3">
            <a-input
                v-if="state.editableData[item.key]"
                v-model:value="state.editableData[item.key]['arrival_quantity']"
                size="small"
            />
            <span v-else>
              {{ item.arrival_quantity }}
            </span>
          </td>

          <!--메모-->
          <td rowspan="3">
            <a-input
                v-if="state.editableData[item.key]"
                v-model:value="state.editableData[item.key]['memo']"
                size="small"
            />
            <span v-else>
              {{ item.memo }}
            </span>
          </td>

          <!--바코드-->
          <td rowspan="3">
            <a-button
                @click.prevent="openBarcodePopup(item)"
                size="small"
                style="z-index: 99"
            >
              <template #icon>
                <ExportOutlined/>
              </template>
              출력
            </a-button>
          </td>

          <!--입출고상태-->
          <td rowspan="3">
            <a-select
                size="small"
                v-model:value="item.shipping_status"
                @change="updateStatus(item, 'shipping_status')"
                style="width: 100px;">
              <a-select-option v-for="option in state.shippingStatus" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </td>

          <!--   액션-->
          <td rowspan="3">
            <div class="editable-row-operations">
              <span v-if="state.editableData[item.key]">
                <a-typography-link @click="save(item.key)">저장</a-typography-link>
                <a-popconfirm title="취소 하시겠습니까?" @confirm="cancel(item.key)">
                  <a>취소</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="edit(item.key)">수정</a>
              </span>
            </div>
          </td>
        </tr>
        <tr :class="isInPattern(key+1) ? 'bg-blue' : 'bg-white'">
          <td>{{ moment(item.ins_date).format('YYYY-MM-DD HH:mm:ss') }}</td><!--주문일자-->
          <!--품목코드-->
          <td>
            <a-button type="link" @click="openPrdCodePopup(item)">
              {{ item.item_no }}
            </a-button>
          </td>
          <td>{{ item.prd_size_option }}</td><!--사이즈-->

          <!--실구매가-->
          <td>
            <a-input-number
                :min="0"
                v-if="state.editableData[item.key]"
                v-model:value="state.editableData[item.key]['purchase_price']"
                size="small"
            />
            <span v-else>
                {{ item.purchase_price }}
              </span>
          </td>

          <!--택배현황-->
          <td>
            <a-input
                v-if="state.editableData[item.key]"
                v-model:value="state.editableData[item.key]['package_status_memo']"
                size="small"
            />
            <span v-else>
              {{ item.package_status_memo }}
            </span>
          </td>
        </tr>
        <tr :class="isInPattern(key+1) ? 'bg-blue' : 'bg-white'">
          <td> <!--구매관리-->
            <a-select
                v-model:value="item.order_status"
                size="small"
                @change="updateStatus(item, 'order_status')"
                style="width: 100px;">
              <a-select-option v-for="option in state.orderStatus" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </td>
          <td class="{{}}">{{ item.barcode }}</td><!--고객사코드-->
          <td></td>
          <!--현지운임-->
          <td>
            <a-input-number
                :min="0"
                v-if="state.editableData[item.key]"
                v-model:value="state.editableData[item.key]['local_shipping_fee']"
                size="small"
            />
            <span v-else>
              {{ item.local_shipping_fee }}
            </span>
          </td>
          <td>

          </td>

        </tr>
      </template>
      </tbody>
    </table>
  </a-card>


  <a-modal
      v-model:open ="state.showDetailModal"
      title="주문 상세"
      @ok="saveDetail(state.detailModalData)"
      width="1000px"
  >
    <template #footer>
      <a-button key="close" @click="()=>{state.showDetailModal=false}">닫기</a-button>
      <a-button key="save" type="primary" :loading="state.indicator.saveDetail" @click="saveDetail(state.detailModalData)">저장</a-button>
    </template>


      <a-descriptions bordered :column="2" :labelStyle="{ width: '220px' }" :contentStyle="{ width: '500px' }" size="small">

        <a-descriptions-item label="주문번호">{{ state.detailModalData.order_no }}</a-descriptions-item>
        <a-descriptions-item label="주문일자">{{ state.detailModalData.ins_date }}</a-descriptions-item>
        <a-descriptions-item label="구매상태">
          <a-select
              v-model:value="state.detailModalData.order_status"
              size="small"
              style="width: 100px;">
            <a-select-option v-for="option in state.orderStatus" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-descriptions-item>

        <a-descriptions-item label="상품명">{{ state.detailModalData.prd_name }}</a-descriptions-item>
        <a-descriptions-item label="옵션이미지">
          <a-image :src="state.detailModalData.prd_image"
                   fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                   style="width:50px;height:50px;border-radius: 5px;" />
        </a-descriptions-item>
        <a-descriptions-item label="상품코드">{{ state.detailModalData.prd_code }}</a-descriptions-item>
        <a-descriptions-item label="품목코드">{{ state.detailModalData.item_no }}</a-descriptions-item>
        <a-descriptions-item label="고객사코드">{{ state.detailModalData.bar_code }}</a-descriptions-item>
        <a-descriptions-item label="옵션명">{{ state.detailModalData.prd_option_name }}</a-descriptions-item>
        <a-descriptions-item label="사이즈">{{ state.detailModalData.prd_size_option }}</a-descriptions-item>
        <a-descriptions-item label="주문수량">{{ state.detailModalData.quantity }}</a-descriptions-item>
        <a-descriptions-item label="원가">{{ state.detailModalData.origin_price }}</a-descriptions-item>

        <a-descriptions-item label="실구매가">
          <a-input v-model:value="state.detailModalData.purchase_price" />
        </a-descriptions-item>

        <a-descriptions-item label="현지운임">
          <a-input v-model:value="state.detailModalData.local_shipping_fee" />
        </a-descriptions-item>

        <a-descriptions-item label="택배번호">
          <a-input v-model:value="state.detailModalData.purchase_invoice_no" />
        </a-descriptions-item>

        <a-descriptions-item label="택배현황">
          <a-input v-model:value="state.detailModalData.package_status_memo" />
        </a-descriptions-item>

        <a-descriptions-item label="수수료">
          <a-input v-model:value="state.detailModalData.charge" />
        </a-descriptions-item>

        <a-descriptions-item label="금액">
          <a-input v-model:value="state.detailModalData.total_payment_amount" />
        </a-descriptions-item>

        <a-descriptions-item label="구매번호">
          <a-input v-model:value="state.detailModalData.purchase_order_no" />
        </a-descriptions-item>

        <a-descriptions-item label="실도착수량">
          <a-input ref="inputRef"  v-model:value="state.detailModalData.arrival_quantity" />
        </a-descriptions-item>

        <a-descriptions-item label="메모">
          <a-input v-model:value="state.detailModalData.memo" />
        </a-descriptions-item>

        <a-descriptions-item label="바코드">
          <a-button
              @click.prevent="openBarcodePopup(state.detailModalData)"
              size="small"
          >
            <template #icon>
              <ExportOutlined/>
            </template>
            출력
          </a-button>
        </a-descriptions-item>

        <a-descriptions-item label="입출고상태">
          <a-select
              size="small"
              v-model:value="state.detailModalData.shipping_status"
              style="width: 100px;">
            <a-select-option v-for="option in state.shippingStatus" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-descriptions-item>
      </a-descriptions>

  </a-modal>

</template>



<script setup>

import {onMounted, reactive, ref} from 'vue'
import {useMarketApi} from '@/api/market'
import moment from "moment";
import {modal, message} from 'ant-design-vue'
import "vue-loading-overlay/dist/vue-loading.css";

import {
  DownloadOutlined,
  UploadOutlined,
  ExportOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import {useUserApi} from "@/api/user";
import {useCustomOrderApi} from "@/api/customOrder";
import Cookie from "js-cookie";
import Loading from "vue-loading-overlay";
import {cloneDeep} from "lodash";

const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    syncBridgeStatusLoading: false,
    params: {
      order_date: [moment().subtract(15, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      userinfo: [],
      search_type: 'order_no',
      search_value: '',
      order_status: '',
      shipping_status: '',
      scan_package_no: '',
      scan_barcode: '',
    },
  },
  orderStatus: [],
  orderStatusData: [],
  shippingStatus: [],
  shippingStatusData: [],

  // 구매상태 카운트
  paidCount: 0,
  receiptCompletedCount: 0,
  purchaseCompletedCount: 0,
  returnCount: 0,
  cancelCount: 0,
  completeCount: 0,

  // 입출고 상태 카운트
  shippingAddressCount: 0,
  waitWarehouseCount: 0,
  warehousingCount: 0,
  partiallyWarehousingCount: 0,
  shippingCount: 0,

  accountData: {},
  order_date: [moment().subtract(15, 'days'), moment()],
  marketDetailUrls: {},
  uploadCustomOrderPath: process.env.VUE_APP_API_URL + "/api/custom/order/excelUpload",
  fileList: [],
  headers: reactive({
    token: Cookie.get("token")
  }),

  checkedList: [],
  indicator: {
    upload: false,
    download: false,
    table: false,
    count: false,
    saveDetail: false,

  },
  editableData: {},
  editingKey: '',

  // 바코드 팝업에 데이타
  showPopupData: {
    barcode: '',
    prd_code: '',
    prd_option_name: '',
    prd_size_option: '',
  },

  showDetailModal: false,
  detailModalData: {},
  detailForm: ref(null),

});

// 검색기간
const onChangeDatePicker = (value, dateString) => {
  state.tableData.params.order_date = [dateString[0], dateString[1]];
}

const handleOrderStatusChange = (e) => {
  rowSelection.value.selectedRowKeys = [];

  getTableData()
}

const getCustomOrderStatusList = async () => {
  await useMarketApi().getCustomOrderStatusList({}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.orderStatusData = res.data.orderStatus;
    state.shippingStatusData = res.data.shippingStatus;
    state.orderStatus = Object.keys(state.orderStatusData).map((item, index) => {
      return {
        label: state.orderStatusData[item],
        value: item,
      }
    });
    state.shippingStatus = Object.keys(state.shippingStatusData).map((item, index) => {
      return {
        label: state.shippingStatusData[item],
        value: item,
      }
    });
  });
}


// 주문 리스트
const getTableData = async () => {
  state.tableData.loading = true;
  await useCustomOrderApi().getCustomOrderList(state.tableData.params).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.tableData.loading = false;
      return false;
    }

    state.tableData.data = res.data;
    state.tableData.total = res.data.length;
    state.tableData.loading = false;
  }).then(() => {
    getCountWithStatus();
  });
}


// 주문 선택
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    state.checkedList = [];
    state.checkedList.push(selectedRowKeys)
    rowSelection.value.selectedRowKeys = selectedRowKeys;

  },
});


// 엑셀 다운로드
const downloadCustomOrderExcel = () => {
  state.indicator.download = true;
  useCustomOrderApi().downloadCustomOrderExcel(state.tableData.data).then(res => {
    if (res === undefined || res.status !== "2000") {
      state.indicator.download = false;
      message.error("엑셀 다운에 실패하였습니다. \n오류가 지속될시 관리자에게 문의하시길 바랍니다");
      return false;
    }

    state.indicator.download = false;
    window.open(res.data.download_url, "_blank");
  });
}

// 엑셀 업로드
const excelUploadCustomOrder = (res) => {
  if (res.file.status === 'uploading') {
    state.indicator.upload = true;
    return false;
  }

  if (res.file.status === 'error') {
    state.indicator.upload = false;
    message.error(res.error.message);
    return false;
  }

  if (res.file.status === 'done') {
    state.indicator.upload = false;
    message.success(res.file.response.message);
    getTableData();
  }
}

const handleSearch = () => {
  if (!state.tableData.params.order_date) {
    message.error('검색기간을 선택해주세요.');
    return false;
  }

  // state.tableData.params.order_date 30일 이상 검색 불가
  if (moment(state.tableData.params.order_date[1]).diff(moment(state.tableData.params.order_date[0]), 'days') > 30) {
    message.error('검색기간은 30일 이상 설정할 수 없습니다.');
    return false;
  }

  getTableData();
}

const getMarketDetailUrls = async () => {
  await useMarketApi().getMarketDetailUrls({}).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.marketDetailUrls = res.data;
  });
}

const getUserInfoData = async () => {
  try {
    await useUserApi().getUserInfoData({}).then((res) => {
      if (res.status !== "2000") {
        message.error(res.message);
        return false;
      }
    });
  } catch (error) {
    message.error(error.message);
    return false;
  }
}

const edit = key => {
  state.editableData[key] = cloneDeep(state.tableData.data.filter(item => key === item.key)[0]);
};

const save = async key => {
  await useCustomOrderApi().updateCustomOrder(state.editableData[key]).then(res => {
    if (res.status !== "2000") {
      delete state.editableData[key];
      message.error(res.message);
      return false;
    }
    Object.assign(state.tableData.data.filter(item => key === item.key)[0], state.editableData[key]);
    message.success(`수정되었습니다.`);
  });

  delete state.editableData[key];
};

const cancel = key => {
  delete state.editableData[key];
};

const openBarcodePopup = async (record) => {
  await useCustomOrderApi().createQrcode({code: record.barcode}).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    state.showPopupData.prd_option_name = record.prd_option_name;
    state.showPopupData.prd_size_option = record.prd_size_option;
    const content = `
      <div style="display: flex;justify-content: space-between;gap: 10px;">
          <div  style="display: flex;flex-direction: column;gap: 5px;padding-top:10px;">
              <span style="font-size: 30pt;line-height: 35pt;font-weight: bold;">${record.prd_code}</span>
              <span style="font-size: 30pt;line-height: 40pt;font-weight: bold;">[${record.prd_option_name} ${record.prd_size_option}]</span>
          </div>
          <div class="qr-code">
              <img src="${res.data.qrCodeUrl}" alt="QR Code" style="width: 258px;height: 258px;">
          </div>
      </div>
      <div style="display: flex;justify-content: center">
          <h1 style="font-size: 40pt;line-height: 0;">${record.barcode}</h1>
      </div>
  `

    // process.env.VUE_APP_API_URL
    const printWindow = window.open('/print.html', '_blank');
    printWindow.onload = function () {
      printWindow.setPrintContent(content);
    };
  });
};

const deleteCustomOrder = async () => {

  // 체크된 주문 없을시 경고창 띄우기
  const checkedList = state.tableData.data.filter(item => item.checked === true)
  checkedList.length === 0 && message.error('삭제할 주문을 선택해주세요.');

  state.indicator.table = true;
  await useCustomOrderApi().deleteCustomOrder(checkedList).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.indicator.table = false;
      return false;
    }
    message.success(res.message);
    getTableData();
    state.indicator.table = false;
  });
}

const receiptCompleted = async () => {
  // 체크된 주문 없을시 경고창 띄우기
  const checkedList = state.tableData.data.filter(item => item.checked === true)
  checkedList.length === 0 && message.error('접수완료 처리할 주문을 선택해주세요.');
  state.indicator.table = true;
  await useCustomOrderApi().setReceiptCompleted(checkedList).then((res) => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.indicator.table = false;
      return false;
    }
    message.success(res.message);
    getTableData();
    state.indicator.table = false;
  });
}

const handleOrderChecked = (item) => {
  console.log(item)
  item.checked = !item.checked;
}

// 全选 全不选
const handleCheckAll = (e) => {
  state.tableData.data.forEach(item => {
    item.checked = e.target.checked;
  })
}

const getCountWithStatus = async () => {
  state.indicator.count = true;
  await useCustomOrderApi().getCountWithStatus(state.tableData.params).then(res => {
    if (res.status !== "2000") {
      state.indicator.count = false;
      message.error(res.message);
      return false;
    }

    state.paidCount = res.data.paidCount;
    state.receiptCompletedCount = res.data.receiptCompletedCount;
    state.purchaseCompletedCount = res.data.purchaseCompletedCount;
    state.returnCount = res.data.returnCount;
    state.cancelCount = res.data.cancelCount;
    state.completeCount = res.data.completeCount;

    state.shippingAddressCount = res.data.shippingAddressCount;
    state.waitWarehouseCount = res.data.waitWarehouseCount;
    state.warehousingCount = res.data.warehousingCount;
    state.partiallyWarehousingCount = res.data.partiallyWarehousingCount;
    state.shippingCount = res.data.shippingCount;
    state.indicator.count = false;
  });
}

const openPrdCodePopup = (item) => {
  window.open(item.prd_url, '_blank');
}

const updateStatus = async (item, what) => {
  const sendData = {
    id: item.id,
  }

  if (what === 'order_status') {
    sendData.order_status = item.order_status;
  } else if (what === 'shipping_status') {
    sendData.shipping_status = item.shipping_status;
  }
  await useCustomOrderApi().updateCustomOrder(sendData).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      return false;
    }
    message.success(`수정되었습니다.`);
  });
}

const openDetailPopup = async () => {
  state.indicator.table = true;
  const param = {
    'purchase_invoice_no': state.tableData.params.scan_package_no,
  };
  await useCustomOrderApi().getCustomOrderDetail(param).then(res => {
    if (res.status !== "2000") {
      message.error(res.message);
      state.indicator.table = false;
      return false;
    }

    console.log( res.data)
    state.detailModalData = res.data;
    state.showDetailModal = true;
    state.indicator.table = false;
  });
}

const saveDetail = async (detailData) => {
  state.indicator.saveDetail = true;

  if (detailData.arrival_quantity > detailData.purchase_quantity) {
    message.error('실도착수량은 구매수량보다 클 수 없습니다.');
    state.indicator.saveDetail = false;
    return false;
  }


  await useCustomOrderApi().updateCustomOrder(detailData).then(res => {
    if (res.status !== "2000") {
      state.indicator.saveDetail = false;
      message.error(res.message);
      return false;
    }

    Object.assign(state.tableData.data.filter(item => detailData.id === item.key)[0], detailData);
    message.success(`수정되었습니다.`);
    state.indicator.saveDetail = false;
    state.showDetailModal = false;
  });
}

const searchWithBarcode = async () => {
  state.tableData.params.search_type = 'barcode';
  state.tableData.params.search_value = state.tableData.params.scan_barcode;
  handleSearch();
}



onMounted(async () => {
  await Promise.all([getUserInfoData(), getMarketDetailUrls(), getCustomOrderStatusList()])
      .then(() => {
        getTableData()
      })
})

const isInPattern = (num) => {
  // 4로 나눈 나머지가 0, 1, 또는 2인지 확인
  if (num % 4 >= 0 && num % 4 <= 2) {
    // (num - 4)를 6으로 나눈 나머지가 0인지 확인
    return (num - 4) % 2 === 0;
  }
  return false;
}
</script>

<style>
#header .ant-picker-input input {
  text-align: center;
}

.editable-row-operations a {
  margin-right: 8px;
}

</style>
<style scoped>
.header-table {
  overflow: auto;
  width: 100%;
}

.header-table thead th, .header-table thead td {
  padding: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  background: #7273de;
}

.header-table tbody th, .header-table tbody td {
  padding: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  border: 1px solid #d9d9d9;
}

.header-table thead th {
  border: 1px solid #8c96a4;
  background-color: #284d77;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.header-table tbody tr:nth-child(6n+1),
.header-table tbody tr:nth-child(6n+2),
.header-table tbody tr:nth-child(6n+3) {
  background-color: #eeeeee; /* 원하는 색상 코드로 변경 */
}

.header-table tbody .bg-blue {
  background-color: #edf1fc;
}

.header-table tbody .bg-white {
  background-color: #ffffff;
}

</style>