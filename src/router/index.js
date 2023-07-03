import { createRouter, createWebHistory } from "vue-router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import findLast from "lodash/findLast";
import { isLogin, cookieInit } from "util/auth";
import Cookie from "js-cookie";
import { routes } from "@/router/route";
import {menus, notFoundAndNoPower, staticRoutes} from "@/router/menu";


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes:[...menus, ...notFoundAndNoPower, ...staticRoutes],
});

router.beforeEach((to, form, next) => {
  nProgress.start();
  let status = isLogin();
  if (to.path === '/user/login' && status === true) {
    next({ path: "/main" });
    return false;
  }

  const record = findLast(to.matched, (record) => {
    return record.meta.authority
  });

  if (record) {
    if (status === false) {
      cookieInit();
      next({ path: "/user/login" });
      return false;
    }

    let roles = Cookie.get('member_roles').split(',');
    if (Array.isArray(roles) === false || roles.length === 0) {
      alert('사용자 권한부여에 실패하였습니다. 시스템 관리자와 문의하시길 바랍니다.');
      cookieInit();
      next({ path: "/user/login" });
      return false;
    }

    let authority = roles.filter(role => record.meta.authority[0] === role);
    if (authority.length === 0) {
      alert('해당페이지에 접근하실 권한이 없습니다.');
      cookieInit();
      next({ path: "/user/login" });
      return false;
    }

    nProgress.done();
  }

  next();
});


router.afterEach(() => {
  nProgress.done();
});

export default router;
