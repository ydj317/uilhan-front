import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import findLast from "lodash/findLast";
import { isLogin, cookieInit } from "util/auth";
import Cookie from "js-cookie";
import { routes } from "@/router/route";
import {menus, notFoundAndNoPower, staticRoutes} from "@/router/menu";


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes:[...notFoundAndNoPower, ...staticRoutes],
});

export function setFilterRoute(chil) {
  let userInfosRoles = Cookie.get('member_roles').split(',');
  let filterRoute = [];
  chil.forEach((route) => {
    if (route.meta.roles) {
      route.meta.roles.forEach((metaRoles) => {
        userInfosRoles.forEach((roles) => {
          if (metaRoles === roles) filterRoute.push({ ...route });
        });
      });
    }
  });
  let defaultRoute = {
    path: "/",
    name: "/",
    meta: {authority: ["ROLE_USER"]},
    component: () => import("@/views/Template/Layout"),
    redirect: "/main",
    children:[]
  }
  defaultRoute.children.push(filterRoute)
  return defaultRoute;
}

function setAddRoute() {

  setFilterRoute(menus[0].children).forEach((route) => {
    console.log(route);
    router.addRoute(route);
  });
}
setAddRoute()
router.beforeEach(async (to, form, next) => {
  nProgress.start();
  let status = isLogin();
  if (to.path === '/user/login' && status === true) {
    next({path: "/main"});
    return false;
  }

  const record = findLast(to.matched, (record) => {
    return record.meta.authority
  });

  if (record) {
    if (status === false) {
      cookieInit();
      next({path: "/user/login"});
      return false;
    }

    let roles = Cookie.get('member_roles').split(',');
    if (Array.isArray(roles) === false || roles.length === 0) {
      alert('사용자 권한부여에 실패하였습니다. 시스템 관리자와 문의하시길 바랍니다.');
      cookieInit();
      next({path: "/user/login"});
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
