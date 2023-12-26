<template>
  <div class="footer">
    <a-row :gutter="45">
      <a-col :span="7">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div class="first">월드링크크로스보더이커머스 주식회사</div>
            <div>사업장주소 : 인천광역시 연수구 송도과학로32, 제엠1404호</div>
            <div>사업자등록번호 : 741-87-02944</div>
            <div>통신판매업신고 : 2023-인천연수구-2438호</div>
            <div>대표자 : 양경명</div>
            <div>TEL : 1688-5980 (추후에 삭제 예정)</div>
          </div>
          <a-divider type="vertical" style="height: 160px;" />
        </div>
      </a-col>

      <a-col :span="7">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div class="first">안내</div>
            <div>고객지원/문의</div>
            <div>고객센터 : 010-9796-9198 (10:00 ~ 17:30 / 토, 일, 공휴일 휴무)</div>
          </div>
          <a-divider type="vertical" style="height: 160px;" />
        </div>
      </a-col>

      <a-col :span="7">
        <div class="first">정책</div>
        <div><a href="https://www.notion.so/worldlink/a4534e7ea9d346acb88d3963aba35d45">이용약관</a></div>
        <div><a href="https://www.notion.so/worldlink/298d6b1132d646dfa6bf4807910378e7">개인정보제공방침</a></div>
      </a-col>

      <a-col :span="3">
          <div class="logo">
            <img src="../../assets/img/logo-dark.png" alt="">
          </div>
      </a-col>
    </a-row>

    <div class="Copyright">Copyright ⓒ 2023 worldlink All Rights Reserved</div>
  </div>
</template>

<style scoped>

.footer {
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  padding: 50px 50px;
  position: relative;
  background: #fff;
  font-size: 12px;
  line-height: 26px;
  color: #666;
}

.footer .first {
  color: #333;
  font-weight: bold;
  padding-bottom: 5px;
}

.footer a {
  color: #666;
}

.footer .logo {
  text-align: right;
}
.footer .logo img {
  width: 150px;
}

.footer .Copyright {
  padding-top: 10px;
  color: #999;
}
</style>
