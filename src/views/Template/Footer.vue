<template>
  <div class="footer">
    <div style="width: 400px;"></div>
    <div style="display: flex;flex-direction: column;gap: 10px;">
      <div style="font-size: 20px;font-weight: bold;color: black" class="mb30">유일</div>
      <div style="display: flex;flex-direction: row;gap: 80px;font-weight: bold">
        <div style="font-size: 14px;">
          <p style="line-height: 16px">사업장주소: 서울 금천구 가산디지털1로 70 호서대벤처타워 4층 409호</p>
          <p style="line-height: 16px">사업자등록번호: 738-87-02502</p>
          <p style="line-height: 16px">국제물류주선업: 등록번호 제1006호</p>
          <p style="line-height: 16px">통신판매신고: 2022-인천남동구-0662호</p>
        </div>
        <div style="font-size: 14px;">
          <p style="line-height: 16px">문의: 09:00~18:00 (토,일,공휴일 휴무)</p>
          <p style="line-height: 16px">TEL: 070-4766-1622</p>
          <p style="line-height: 16px">FAX: 032-226-1689</p>
          <p style="line-height: 16px">E-MAIL: solution@uilhan.co.kr</p>
        </div>
      </div>
      <div style="font-size: 14px;">
        <p style="color: black;font-weight: bold;">대표: 김성현</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    openPolicyModal() {
      this.$store.commit('setIsModalOpen', true);
    }
  }
}
</script>

<style scoped>

.footer {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  position: relative;
  font-size: 12px;
  line-height: 26px;
  color: #666;
}
</style>