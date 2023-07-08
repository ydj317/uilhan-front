import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import findLast from "lodash/findLast";
import {cookieInit, isLogin} from "util/auth";
import Cookie from "js-cookie";
import {menus, notFoundAndNoPower, staticRoutes} from "@/router/menu";


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes:[...menus,...notFoundAndNoPower,...staticRoutes]
});

export function setFilterRouteList() {
  let userInfosRoles = Cookie.get('member_roles').split(',');
  return setFilterHasRolesMenu(menus[0].children, userInfosRoles);
}

/**
 * `meta.roles` 권환 검색
 * @param roles 권한속성
 * @param route
 * @returns boolean
 */
export function hasRoles(roles, route) {
  if (route.meta && route.meta.roles) return roles.some((role) => route.meta.roles.includes(role));
  else return true;
}

/**
 * 获取当前用户权限标识去比对路由表，设置递归过滤有权限的路由
 * @param routes 当前路由 children
 * @param roles 用户权限标识，在 userInfos（用户信息）的 roles（登录页登录时缓存到浏览器）数组
 * @returns 返回有权限的路由数组 `meta.roles` 中控制
 */
export function setFilterHasRolesMenu(routes, roles) {
  const menu = [];
  routes.forEach((route) => {
    const item = { ...route };
    if (hasRoles(roles, item)) {
      if (item.children) item.children = setFilterHasRolesMenu(item.children, roles);
      menu.push(item);
    }
  });
  return menu;
}

router.beforeEach((to, form, next) => {
  nProgress.start();
  let status = isLogin();
  if (to.path === '/user/login' && status === true) {
    next({ path: "/main" });
    return false;
  }

  const record = findLast(to.matched, (record) => record.meta.roles);

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

    let authority = roles.filter(role => record.meta.roles[0] === role);
    if (authority.length === 0) {
      alert('해당페이지에 접근하실 권한이 없습니다.');
      cookieInit();
      next({ path: "/user/login" });
      return false;
    }

    nProgress.done();
  }

  //initFrontEndControlRoutes();
  next();
});


router.afterEach(() => {
  nProgress.done();
});

export default router;
