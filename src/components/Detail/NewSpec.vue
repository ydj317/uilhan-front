<template>
  <div id="eModelTitle_2_1" class="mt20 p20 bg-white" v-if="product.item_option">
    <h1><strong>New 옵션설정</strong></h1>
    <div class="header-section">
      <!--세팅버튼-->
      <div class="setting header-button">
        <a-popconfirm
            title="현재 스팩설정대로 세팅하시겠습니까?"
            @confirm="setting"
        >
          <a-button class="floatRight" type="primary" danger>세팅</a-button>
        </a-popconfirm>
      </div>
      <a-button class="header-button" type="primary">추가</a-button>
    </div>
    <div class="body-section">
      <div class="spec-box">
        <table>
          <thead>
          <tr>
            <th style="background-color: #ebeff0;">
              <div class="spec-option-group">
                <span class="spec-font">옵션그룹1</span>
                <a-input class="spec-option-input-size" v-model:value="value" size="default" placeholder="small size" />
                <span class="spec-count">10 / 10</span>
                <a-button class="spec-grop-delete" type="primary" danger>삭제</a-button>
              </div>
            </th>
          </tr>
          <tr>
            <th>
              <div class="spec-option-header">
                <div class="spec-option-left">
                  <a-checkbox class="spec-checkbox" v-model:checked="checked"></a-checkbox>
                  <span class="spec-font">옵션명</span>
                </div>
                <div class="spec-option-button">
                  <a-button class="spec-right-button" type="primary">삭제</a-button>
                  <a-button class="spec-right-button" type="primary">빈칸</a-button>
                  <a-button class="spec-right-button" type="primary">특문</a-button>
                  <a-button class="spec-right-button" type="primary">25자</a-button>
                  <a-button class="spec-right-button" type="primary">순번</a-button>
                  <a-button class="spec-right-button" type="primary">A-Z</a-button>
                  <a-button type="primary">뒤로</a-button>
                </div>
              </div>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <div class="spec-option-name">
                <a-checkbox class="spec-checkbox" v-model:checked="checked"></a-checkbox>
                <a-input class="input-size" v-model:value="value" size="default" placeholder="small size" />
                <span class="spec-count">10 / 10</span>
                <a-button class="spec-add-option-name-button" type="primary">추가</a-button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "productDetailNewSpec",
  computed: {
    ...mapState(["product"]),
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>
<style lang="css" scoped>
.header-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60px;
  margin-top: 10px;
  border-radius: 0.275rem;
  background-color: #f4f8f9;
}

.header-button {
  margin-right: 10px;
}

.body-section {
  display: flex;
  justify-content:center;
  width: 100%;
  height: 90%;
  overflow: auto;
}

.spec-box {
  margin-top: 5px;
  margin-right: 5px;
  margin-left: 5px;
  width: 50%;
  min-width: 589px;
}

.spec-box table {
  border-radius: 5px;
  width: 100%;
}

.spec-box table tr {
  border: 1px solid #f0f0f0;
}

.spec-option-group {
  height: 50px;
  display: flex;
  align-items: center;
}

.spec-grop-delete {
  margin-left: auto;
  margin-right: 10px;
}

.spec-option-group .spec-font {
  margin-left: 10px;
  margin-right: 10px;
}
.spec-option-input-size {
  width: 50%;
}

.spec-option-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
}

.spec-option-name {
  display: flex;
  align-items: center;
  height: 45px;
}

.input-size {
  width: 70%;
}

.spec-checkbox {
  margin-left: 10px;
  margin-right: 10px;
}
.spec-font {
  font-weight: normal;
}
.spec-option-header .spec-font {
  margin-left: 10px;
}

.spec-count {
  margin-left: 5px;
  font-weight: bold;
  color: #808080;
}

.spec-option-button {
  margin-right: 10px;
}

.spec-option-left {
  margin-right: auto;
}

.spec-right-button {
  margin-right: 5px;
}

.spec-add-option-name-button {
  margin-left: 18px;
}
</style>
