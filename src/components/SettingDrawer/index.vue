<template>
  <!--  <a-button type="primary" @click="showDrawer">Open</a-button>-->
  <loading v-model:active="indicator"
           :can-cancel="false"
           :is-full-page="true"/>
  <a-drawer
    width="450"
    title="계정 설정"
    placement="right"
    :closable="false"
  >
    <div style="margin-bottom: 20px">
      <UserOutlined style="font-size: 20px;margin-right: 10px" />
      <h2 style="display: inline-block; width: 63%">{{memberName}}</h2>
      <a-button type="dashed" @click="logout">로그아웃</a-button>
    </div>


    <div v-if="this.roles.length > 0 && this.roles.indexOf('ROLE_RELAKET') > -1">
      <h4>세션키 설정 :</h4>
      <div>
        <a-input class="" v-model:value="accessKey" placeholder="AccessKey" />
        <a-input style="margin-top: 10px" v-model:value="secretKey" placeholder="SecretKey" />
        <a-button @click="addKey" style="margin-top: 10px" type="primary">등록</a-button>
      </div>
      <a-divider />
    </div>

    <div>
      <h4>마진율 설정 :</h4>
      <div>
        <a-select
            ref="select"
            v-model:value="marginDefValue"
            style="width: 180px"
            :options="margin"
            @change="marginChange"
        >
        </a-select>
        <a-button @click="delFormula('margin')" class="acc_button_margin" type="primary">삭제</a-button>
      </div>

      <div class="acc_input_block">
        <a-input class="acc_input" v-model:value="marginName" placeholder="명" />
        <a-input class="acc_input" v-model:value="marginValue" placeholder="값" />
        <a-button @click="updateFormula('margin')" class="acc_button_margin" type="primary">등록</a-button>
      </div>
    </div>

    <div>
      <a-divider />
      <h4>환율 설정 :</h4>
      <div>
        <a-select
            ref="select"
            v-model:value="rateDefValue"
            style="width: 180px"
            :options="rate"
            @change="rateChange"
        >
        </a-select>
        <a-button @click="delFormula('rate')" class="acc_button_margin" type="primary">삭제</a-button>
      </div>
      <div class="acc_input_block">
        <a-input class="acc_input" v-model:value="rateName" placeholder="명" />
        <a-input class="acc_input" v-model:value="rateValue" placeholder="값" />
        <a-button  @click="updateFormula('rate')" class="acc_button_margin" type="primary">등록</a-button>
      </div>
    </div>

    <div>
      <a-divider />
      <h4>수집 가격 설정 :</h4>
      <div class="acc_input_block">
        <a-input class="price_input" v-model:value="priceRangeStart" placeholder="기준 시작" /> ~
        <a-input class="price_input" v-model:value="priceRangeEnd" placeholder="기준 마감" />
        <a-input style="margin-left: 5px" class="price_input" v-model:value="price" placeholder="가격" />
        <a-select
            ref="select"
            v-model:value="priceType"
            style="width: 80px;margin-right: 4px; margin-left: 4px;"
        >
          <a-select-option value="number">고정값</a-select-option>
          <a-select-option value="percent">백분율</a-select-option>
        </a-select>
        <br/>
        <a-button @click="addCollectionPrice" style="width: 44%; margin-top: 6px" type="primary">등록</a-button>
        <a-button @click="delCollectionPrice" style="width: 43%; margin-top: 6px; margin-left: 10px" type="primary">삭제</a-button>
      </div>
      <div style="margin-top: 10px;">
        <a-descriptions
            style="margin-top: 3px;"
            :class="`${item.checked === true ? 'checkedCollectionEl' : ''}`"
            @click="checkCollectionEl(index)"
            v-for="(item, index) in collectionPriceList"
            bordered>
          <a-descriptions-item
              style="width: 290px;"
              :label="`${item.priceRangeStart} ~ ${item.priceRangeEnd}원 범위내 포함될시`" >
            {{ item.price }} {{item.priceType === 'number' ? '원' : '%'}}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>

    <template v-slot:handle>
      <div class="handle" @click="visible = !visible">
        <SettingOutlined />
      </div>
    </template>

    <div v-if="this.roles.length > 0 && this.roles.indexOf('ROLE_RELAKET') > -1">
      <a-divider />
      <h4>배송정책 설정 :</h4>
      <div>
        <a-alert
            v-if="this.dlvError === true"
            message="릴라켓에 배송적책 얻기에 실패하였습니다.
            해당 오류는 세션키 입력이 잘못되었거나
            릴라켓에 배송정책을 등록하지 않은경우 발생할수있습니다."
                 type="error" /><br/>
      </div>

      <a-select
          style="width: 200px; float: left"
          :options="excelStyleDown"
          v-model:value="excelStyleVal"
      >
      </a-select>
      <a-button style="width: 120px; float: left; margin-left: 10px" @click="excelDown"><DownOutlined />양식따운</a-button>

      <a-select
          style="width: 200px; float: left; margin-top: 10px;"
          :options="excelStyleUp"
          v-model:value="excelStyleUpVal"
      >
      </a-select>
      <a-upload
          :showUploadList="false"
          name="file"
          :multiple="true"
          :customRequest="excelUpload"
          :beforeUpload="handleExcelBeforeUpload"
          :headers="headers"
      >
        <a-button style="width: 120px; float: left; margin-left: 10px; margin-top: 10px" ><UploadOutlined />엑셀 업로드</a-button>
      </a-upload>
    </div>

    <div v-if="this.roles.length > 0 && this.roles.indexOf('ROLE_RELAKET') > -1">
      <a-divider />
      <h4>아이콘 설정 :</h4>
      <div>
        <a-button style="width: 120px; float: left; margin-top: 10px;margin-bottom: 20px" @click="openIconModal" ><UploadOutlined />업로드</a-button>
      </div>
    </div>

    <div>
      <a-divider />
      <h4>로고 설정 :</h4>
      <a-upload
          :showUploadList="false"
          name="file"
          :multiple="true"
          :customRequest="customRequest"
          :beforeUpload="handleBeforeUpload"
          :headers="headers"
      >
        <a-button @click="setType('logo')"><UploadOutlined />로고 업로드</a-button>
      </a-upload>
      <a-button style="margin-left: 10px" @click="setLogo" type="primary"> 저장</a-button>
      <a-button v-if="isLogInDetail === false" style="margin-left: 10px" @click="setLogoInDetail" type="primary"> 상품상세 적용</a-button>
      <a-button v-else style="margin-left: 10px" @click="setLogoInDetail" type="primary"> 상품상세 적용 취소</a-button>
      <div class="logo" style="width: 100px;height: 100px;margin-top: 10px;">
        <img v-if="logoImg.length > 0" :src="logoImg" width="328" height="200" alt="">
      </div>
    </div>
    <a-modal width="600px" :maskClosable="false" v-model:visible="excelUploadVisible" title="엑셀업로드 결과" @ok="excelResultWindow">
      <p v-for="( message ) in excelUploadResult">{{ message }}</p>
    </a-modal>

    <a-modal width="600px" height="300px" :maskClosable="false" v-model:visible="iconUploadVisible" title="아이콘 업로드" @ok="closeIconModal">
      <img
          :class="`${item.checked ? 'checkedEl' : 'checkedNot'}`" v-for="(item, index) in icons"
          :src="item.src"
          width="120"
          height="118"
          @click="outElChecking(item, index)"
          :key="index"
          style="margin-top: 3px;"
      >
      <div v-if="icons.length === 0" style="text-align: center">추가된 아이콘이 없습니다.</div>
      <template v-slot:footer>
        <a-upload
            :showUploadList="false"
            name="file"
            :multiple="true"
            :customRequest="customRequest"
            :beforeUpload="handleBeforeUpload"
            :headers="headers"
        >
          <a-button @click="setType('icon')"><UploadOutlined />업로드</a-button>
        </a-upload>
        <a-button style="margin-left: 10px" @click="delIcon" >삭제</a-button>
        <a-button type="primary" @click="closeIconModal" >확인</a-button>
      </template>
    </a-modal>
  </a-drawer>
</template>
<script>
//<UserOutlined />
import { UserOutlined } from '@ant-design/icons-vue';
import { AuthRequest } from '../../util/request'
import { SettingOutlined, UploadOutlined, DownOutlined } from '@ant-design/icons-vue';
import Cookie from "js-cookie";
import { cookieInit } from "../../util/auth";
import router from "../../router/index.js";
import Loading from 'vue-loading-overlay';
import { cloneDeep } from "lodash-es";
export default {
  components: {
    SettingOutlined,
    UploadOutlined,
    UserOutlined,
    DownOutlined,
    Loading
  },

  data() {
    const selectEmptyDefault = [{
      value: 'please select',
      label: 'please select',
    }];
    const rateName = '';
    const rateValue = '';
    const rateDefValue = 'please select';
    const rate = selectEmptyDefault;
    const original_margin = [];

    const marginName = '';
    const marginValue = '';
    const marginDefValue = 'please select';
    const margin = selectEmptyDefault;
    const original_rate = [];

    const userData = {};
    const logoImg = '';
    const roles = [];

    const excelStyleDown = [
      {'label': '배송정책 양식', 'value': 'delivery'},
      {'label': '교환/반품지 양식(한국주소)', 'value': 'change_kr'},
      {'label': '교환/반품지 양식(해외주소)', 'value': 'change_sea'},
      {'label': '출고지 양식(한국주소)', 'value': 'shipment_kr'},
      {'label': '출고지 양식(해외주소)', 'value': 'shipment_sea'},
    ];
    const excelStyleVal = 'delivery';

    const excelStyleUp = [
      {'label': '배송정책 등록', 'value': 'delivery'},
      {'label': '교환/반품지(한국주소)', 'value': 'change_kr'},
      {'label': '교환/반품지(해외주소)', 'value': 'change_sea'},
      {'label': '출고지(한국주소)', 'value': 'shipment_kr'},
      {'label': '출고지(해외주소)', 'value': 'shipment_sea'},
    ];
    const excelStyleUpVal = 'delivery';
    const excelUploadVisible = false;
    const iconUploadVisible = false;
    const excelUploadResult = [];
    const accessKey = '';
    const secretKey = '';
    const rateSelectedKey = null;
    const marginSelectedKey = null;
    const imageUploadType = '';
    const icons = [];
    const isLogInDetail = false;
    const dlvError = false;
    const priceType = 'number';
    const symbolType = 'less';
    const price = '';
    const collectionPriceList = [];
    const priceRangeStart = '';
    const priceRangeEnd = '';
    const indicator = false;
    return {
      rateName,
      rateValue,
      rateDefValue,
      selectEmptyDefault,
      margin,
      marginName,
      marginValue,
      marginDefValue,
      rate,
      userData,
      logoImg,
      roles,
      excelStyleDown,
      excelStyleVal,
      excelStyleUp,
      excelStyleUpVal,
      excelUploadVisible,
      excelUploadResult,
      original_margin,
      original_rate,
      rateSelectedKey,
      marginSelectedKey,
      iconUploadVisible,
      imageUploadType,
      isLogInDetail,
      icons,
      dlvError,
      priceType,
      symbolType,
      collectionPriceList,
      headers: {
        'token' : Cookie.get('token'),
        'Content-Type': 'multipart/form-data'
      },
      memberName: '',
      accessKey,
      secretKey,
      price,
      priceRangeStart,
      priceRangeEnd,
      indicator
    }
  },
  methods: {
    addCollectionPrice() {
      if (this.priceRangeStart === undefined || this.priceRangeStart.length === 0) {
        alert('기준가 시작범위는 필수로 입력해주십시오');
        return false;
      }

      if (this.priceRangeEnd === undefined || this.priceRangeEnd.length === 0) {
        alert('기준가 마감범위는 필수로 입력해주십시오');
        return false;
      }

      if (this.price === undefined || this.price.length === 0) {
        alert('가격은 필수로 입력해주십시오');
        return false;
      }

      let regPos = /^[0-9]+$/;
      if(!regPos.test(this.price) || !regPos.test(this.priceRangeStart) || !regPos.test(this.priceRangeEnd)){
        alert('기준 값과 가격 값은 숫자만 입력가능합니다.');
        return false;
      }

      if (parseInt(this.priceRangeStart) > parseInt(this.priceRangeEnd)) {
        alert('시작 가격은 마감 가격보다 작아야합니다.');
        return false;
      }

      if (this.collectionPriceList.length === 3) {
        alert('상품수집 가격설정은 최대 3개까지 등록하실수 있습니다.');
        return false;
      }

      for (let i=0; i < this.collectionPriceList.length; i++) {
        let item = this.collectionPriceList[i];
        if ((parseInt(this.priceRangeStart) >= parseInt(item.priceRangeStart) &&
            parseInt(this.priceRangeStart) <= parseInt(item.priceRangeEnd) ||
            (parseInt(this.priceRangeEnd) >= parseInt(item.priceRangeStart)) &&
            parseInt(this.priceRangeEnd) <= parseInt(item.priceRangeEnd))) {
          alert('요청하신 가격범위는 기존에 등록하신 가격범위에 포함되여있습니다.');
          return false;
        }
      }

      let data = this.collectionPriceList.concat({
        priceType: this.priceType,
        priceRangeStart: this.priceRangeStart,
        priceRangeEnd: this.priceRangeEnd,
        price: this.price,
        checked: false,
      });
      this.indicator = true;
      this.sendCollectionData(data);
      //this.collectionPriceList.push(data);
    },

    delCollectionPrice() {
      if (this.collectionPriceList.length === 0) {
        alert('등록된 가격 설정이 없습니다.');
        return false;
      }

      let index = null;
      this.collectionPriceList.filter((item, i) => {
        if (item.checked === true) index = i;
      });

      if (index === null) {
        alert("삭제하실 데이터를 선택해주십시오.");
        return false;
      }

      let data = this.collectionPriceList.filter((item, i) => parseInt(index) !== parseInt(i));
      this.indicator = true;
      this.sendCollectionData(data);
    },

    sendCollectionData(data) {
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/userup', {
        data: data,
        type: 'collection'
      }).then((res) => {
        let returnData = res.data;
        if (returnData.status === undefined) {
          return false;
        }

        if (returnData.status !== 2000) {
          alert(returnData.msg);
          return false;
        }

        this.collectionPriceList = data;
        alert('처리성공');
        this.indicator = false;
      });
    },

    checkCollectionEl(index) {
      for (let i=0; i < this.collectionPriceList.length; i++) {
        this.collectionPriceList[i].checked = false;
      }
      this.collectionPriceList[index].checked = true;
    },

    setType(type) {
      this.imageUploadType = type;
    },

    cancelCheckedEl() {
      for (let i=0; i < this.icons.length; i++) {
        this.icons[i].checked = false;
      }
    },

    delIcon() {
      if (this.icons.length === 0) {
        alert('삭제할 이미지가 없습니다.');
        return false;
      }

      let delData = [];
      for (let i=0; i < this.icons.length; i++) {
        if (this.icons[i].checked === true) {
          delData.push({src: this.icons[i].src});
          this.icons[i].checked = false;
        }
      }

      if (delData.length === 0) {
        alert('삭제할 이미지를 선택해주십시오.');
        return false;
      }
      this.indicator = true;
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/delicon', {
        data: delData,
        type: 'icon',
      }).then((res) => {
        if (res.data.status !== 2000) {
          alert(res.data.msg);
        }

        for (let i=0; i < delData.length; i++) {
          this.icons = this.icons.filter(item => item.src !== delData[i].src);
        }

        alert('삭제 성공');
        this.indicator = false;
      });
    },

    closeIconModal() {
      this.iconUploadVisible = false;
      this.cancelCheckedEl();
    },

    outElChecking(element, index) {
      this.icons[index].checked = !element.checked;
    },

    openIconModal() {
      this.iconUploadVisible = !this.iconUploadVisible;
    },

    excelResultWindow() {
      this.excelUploadVisible = false;
    },

    rateChange(val, item, key) {
      if (item.label.indexOf('please select') > -1 && item.value === 'please select') {
        return false;
      }

      for (let i=0; i < this.rate.length; i++) {
        let currentItem = this.rate[i];
        if (currentItem.label === item.label && currentItem.value === item.value) {
          this.rateSelectedKey = i;
        }
      }

      if (key !== undefined && key !== null) {
        this.marginSelectedKey = key;
      }

      if (this.rateSelectedKey === null) {
        alert("데이터 처리과정에서 오류가 발생했습니다.\n오류가 지속될경우 관리자에게 문의하시길 바랍니다.");
        return false;
      }
    },

    marginChange(val, item, key) {
      if (item.label.indexOf('please select') > -1 && item.value === 'please select') {
        return false;
      }

      for (let i=0; i < this.margin.length; i++) {
        let currentItem = this.margin[i];
        if (currentItem.label === item.label && currentItem.value === item.value) {
          this.marginSelectedKey = i;
        }
      }

      if (key !== undefined && key !== null) {
        this.marginSelectedKey = key;
      }

      if (this.marginSelectedKey === null) {
        alert("데이터 처리과정에서 오류가 발생했습니다.\n오류가 지속될경우 관리자에게 문의하시길 바랍니다.");
        return false;
      }
    },

    excelDown() {
      this.indicator = true;
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/deliveryexceldown', {
        filetype: this.excelStyleVal
      }).then((res) => {
        let response = res.data;
        if (response === undefined) {
          alert('엑셀양식 다운이 실패하였습니다.');
          return false;
        }
        window.open(response.path);
        this.indicator = false;
      });
    },

    addKey() {
      if (this.accessKey.length === undefined || this.accessKey.length === 0) {
        alert('accessKey는 필수로 입력해주십시오');
        return false;
      }

      if (this.secretKey.length === undefined || this.secretKey.length === 0) {
        alert('secretKey는 필수로 입력해주십시오');
        return false;
      }

      this.indicator = true;
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/userup', {
        access_key: this.accessKey,
        secret_key: this.secretKey,
        type: 'key'
      }).then((res) => {
        let returnData = res.data;
        if (returnData.status === undefined) {
          return false;
        }

        if (returnData.status !== 2000) {
          alert(returnData.msg);
          return false;
        }

        alert('등록성공');
        this.indicator = false;
      });
    },

    excelUpload(option) {
      const formData = new FormData();
      formData.append('file', option.file);
      formData.append('filetype', this.excelStyleUpVal);

      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/updeliveryexcel', formData).then((res) => {
        let response = res.data;
        if (response === undefined) {
          alert('엑셀 업로드에 실패하였습니다.');
          return false;
        }

        if (response.status !== 200) {
          alert(response.msg);
          return false;
        }

        if (response.data.length === 0) {
          alert('배송정책 등록요청에 성공하였습니다.');
        }

        let failedLen = response.data.failed.length;
        if (failedLen > 0) {
          this.excelUploadResult = response.data.failed
          this.excelUploadVisible = true;
        } else {
          alert('배송정책 등록요청에 성공하였습니다.');
        }
      });
    },

    handleExcelBeforeUpload(file) {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!(isExcel)) {
        alert('허용되는 이미지 격식이 아닙니다.');
        return false;
      }

      return true;
    },

    updateFormula(type) {
      if (this[type + 'Name'].length === undefined || this[type + 'Name'].length === 0) {
        alert(type + '명은 필수로 입력해주십시오.');
        return false;
      }

      if (this[type + 'Value'].length === undefined || this[type + 'Value'].length === 0) {
        alert(type + '값은 필수로 입력해주십시오.');
        return false;
      }

      let regPos = /^[0-9]+/;
      if(!regPos.test(this[type + 'Value'])){
        alert(type + '값은 숫자로 입력해주십시오.');
        return false;
      }

      let inputData = {
        label: this[type + 'Name'],
        value: this[type + 'Value'],
      };
      let key = this['original_' + type].length;
      let data = this['original_' + type];

      for (let i=0; i < key; i++) {
        if (parseInt(data[i].value) === parseInt(this[type + 'Value'])) {
          alert('동일유형에 같은 값을 중복으로 등록할수없습니다.');
          return false
        }
      }

      data.push(inputData);

      this.indicator = true;
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/userup', {
        type: type,
        data: data,
      }).then((res) => {
        let returnData = res.data;
        if (returnData.status !== 2000) {
          alert(returnData.msg);
          this.indicator = false;
          return false;
        }

        this[type] = returnData.data;
        this[type] = this.setLabel(this[type], type);
        this[type + 'DefValue'] = this[type + 'Value'];
        key = key.length === 1 ? 0 : key;
        this[type + 'Change'](this[type + 'Value'], inputData, key)
        this['original_' + type] = data;
        this[type + 'Name'] = '';
        this[type + 'Value'] = '';
        alert('등록성공');
        this.indicator = false;
      });
    },
    customRequest(option) {
      const formData = new FormData();
      formData.append('file', option.file);
      formData.append('relation_type', 'user');
      if (this.imageUploadType === '') {
        alert("이미지 저장에 실패하였습니다.\n오류가 지속될경우 관리자에게 문의하시길바랍니다.");
        return false;
      }
      formData.append('image_type', this.imageUploadType);
      this.indicator = true;
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/image', formData).then((res) => {
        let response = res.data;
        if (response === undefined) {
          alert('upload failed');
          return false;
        }

        if (response.status !== 'success') {
          alert('upload failed');
          return false;
        }

        if (this.imageUploadType === 'logo') {
          this.logoImg = response.img_url;
        } else {
          this.icons.push({src: response.img_url, checked: false});
        }

        this.indicator = false;
      });
    },
    handleBeforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isJPEG = file.type === 'image/jpeg';
      const isGIF = file.type === 'image/gif';
      const isPNG = file.type === 'image/png';

      if (!(isJPG || isJPEG || isPNG || isGIF)) {
        alert('허용되는 이미지 격식이 아닙니다.');
        return false;
      }

      return true;
    },

    setLogoInDetail()
    {
      this.isLogInDetail = !this.isLogInDetail;

      let type = this.isLogInDetail === true ? '적용' : '취소';
      this.indicator = true;
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/userup', {
        value: this.isLogInDetail,
        type: 'logoindetail'
      }).then((res) => {
        let returnData = res.data;
        if (returnData.status !== 2000) {
          alert('상품상세 상세 ' + type + ' 실패')
          return false;
        }

        this.isLogInDetail = returnData.data;
        alert('상품상세 ' + type + " 성공하였습니다.\n페이지를 갱신하시면 상품상세 편집창에서 효과를 확인하실수있습니다.");
        this.indicator = false;
      });
    },

    setLogo() {
      if (this.logoImg.length === 0) {
        alert('업로드한 이미지가 없습니다');
        return false;
      }
      this.indicator = true;
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/userup', {
        value: this.logoImg,
        type: 'logo'
      }).then((res) => {
        let returnVal = res.data;
        if (returnVal.status !== 2000) {
          alert('로고 업로드 실패')
          return false;
        }

        if (returnVal.data === undefined || res.data === 0) {
          alert('로고 업로드 실패')
          return false;
        }

        this.logoImg = returnVal.data;
        alert('로고이미지 저장 성공');
        this.indicator = false;
      });
    },
    delFormula(type) {
      if (this[type + 'SelectedKey'] === null) {
        alert('삭제실패 선택된 ' + type + ' 데이터가 없습니다.');
        return false;
      }

      let data = this['original_' + type].filter((item, index) => parseInt(this[type + 'SelectedKey']) !== parseInt(index));
      this.indicator = true;
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/userup', {
        type: type,
        data: data,
      }).then((res) => {
        let returnData = res.data;
        if (returnData.status !== 2000) {
          alert(returnData.msg);
          return false;
        }

        if (returnData.data.length === 0) {
          this[type] = this.selectEmptyDefault;
          this[type + 'DefValue'] = this.selectEmptyDefault[0].value;
          alert('삭제성공');
          this.indicator = false;
          return false;
        }

        this[type] = returnData.data;
        this[type] = this.setLabel(this[type], 'margin');
        this[type + 'DefValue'] = this[type][0].value;
        this[type + 'Change'](this[type + 'DefValue'], this[type][0], 0);
        this['original_' + type] = data;
        alert('삭제성공');
        this.indicator = false;
      });
    },

    setLabel(items, type) {
      let labelAddInfo = '';
      for (let i=0; i < items.length; i++) {
        let symble = '';
        if (type === 'margin') {
          symble = '%';
        }

        if (items[i].label.indexOf('(') === -1 && items[i].label.indexOf('%') === -1) {
          labelAddInfo = ' ( ' + items[i].value + symble +' )';
        }

        items[i].label += labelAddInfo;
      }

      return items;
    },

    getUser() {
      AuthRequest.post(process.env.VUE_APP_API_URL  + '/api/user', {}).then((res) => {
        this.userData = res.data.data;
        this.memberName = this.userData.member_name;
        if (this.userData.margin !== undefined && this.userData.margin.length > 0) {
          this.original_margin = this.userData.margin;
          this.margin = this.setLabel(this.userData.margin, 'margin');
          this.marginDefValue = this.userData.margin[0].value
          this.marginChange(this.marginDefValue, this.userData.margin[0], 0);
        }

        if (this.userData.rate !== undefined && this.userData.rate.length > 0) {
          this.original_rate = this.userData.rate;
          this.rate = this.setLabel(this.userData.rate, 'rate');
          this.rateDefValue = this.userData.rate[0].value
          this.rateChange(this.rateDefValue, this.userData.rate[0], 0);
        }

        if (this.userData.logo !== undefined && this.userData.logo.length > 0) {
          this.logoImg = this.userData.logo
        }

        if (this.userData.icons !== undefined && this.userData.icons.length > 0) {
          this.icons = this.userData.icons;
          for (let i=0; i < this.icons.length; i++) {
            this.icons[i].checked = false;
          }
        }

        if (this.userData.error === true) {
          this.dlvError = this.userData.error;
        }

        this.accessKey = this.userData.key.access_key;
        this.secretKey = this.userData.key.secret_key;
        this.isLogInDetail = this.userData.logoindetail;
        this.collectionPriceList = this.userData.collection;
        for (let i=0; i < this.collectionPriceList.length; i++) {
          this.collectionPriceList[i].checked = false;
        }
      });
    },

    logout() {
      cookieInit();
      router.push("/user/login");
      return false;
    },
    setPrivilege() {
      this.roles = Cookie.get('member_roles');
    },
  },
  mounted() {
    this.getUser();
    this.setPrivilege();
  }
};
</script>

<style>
.handle {
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 450px;
  z-index: 9;
  font-size: 20px;
  background: #1890ff;
  color: #fff;
  border-radius: 3px 0 0 3px;
  line-height: 48px;
  text-align: center;
  width: 48px;
  height: 48px;
}

.acc_input_block {
  margin-top: 10px;
}

.acc_input {
  width: 140px;
}

.price_input {
  width: 80px;
}

.handle:hover {
  background: #eeeeee;
}

.acc_button_margin {
  margin-left: 5px;
}

.checkedCollectionEl {
  border: 1px solid #7093DB
}

.checkedEl{
  border: 3px solid  #7093DB
}
.checkedNot{
  border: 3px solid  white;
}

.list-group-item {
  margin-left: 4px;
  float: left;
  cursor: move;
  width: 94px;
  list-style: none;
}
</style>
