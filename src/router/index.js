import {createRouter, createWebHistory} from "vue-router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import findLast from "lodash/findLast";
import {cookieInit, isLogin} from "util/auth";
import Cookie from "js-cookie";
import {menus, notFoundAndNoPower, staticRoutes} from "@/router/route";

const menuList = setFilterRouteList();

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [...menuList,notFoundAndNoPower,...staticRoutes],
    scrollBehavior (to, from, savedPosition) {
        return { top: 0}
    }
});

export function setFilterRouteList() {
    const userInfosRoles = Cookie.get('member_roles') ? Cookie.get('member_roles').split(',') : [];
    const userInfosIds = Cookie.get('member_name') ? [Cookie.get('member_name')] : [];

    const FilterRoutes = setFilterHasRolesMenu(menus[0].children, userInfosRoles, userInfosIds);
    const defaultRoutes = [{
        path: "/",
        name: "main",
        meta: {roles: ["ROLE_USER"],},
        component: () => import("@/views/Template/Layout"),
        redirect: "/main",
        children: []
    }]
    defaultRoutes[0].children = [...FilterRoutes,...notFoundAndNoPower]
    return defaultRoutes
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
 * `meta.roles` 권환 검색
 * @param ids 권한속성
 * @param route
 * @returns boolean
 */
export function hasIds(ids, route) {
    if (route.meta && route.meta.ids) return ids.some((role) => route.meta.ids.includes(role));
    else return true;
}

/**
 * 获取当前用户权限标识去比对路由表，设置递归过滤有权限的路由
 * @param routes 当前路由 children
 * @param roles 用户权限标识，在 userInfos（用户信息）的 roles（登录页登录时缓存到浏览器）数组
 * @param ids
 * @returns 返回有权限的路由数组 `meta.roles` 中控制
 */
export function setFilterHasRolesMenu(routes, roles, ids = []) {
    const menu = [];
    routes.forEach((route) => {
        const item = {...route};
        if (hasRoles(roles, item) || ((item.meta && item.meta.ids) && hasIds(ids, item))) {
            if (item.children) item.children = setFilterHasRolesMenu(item.children, roles, ids);
            menu.push(item);
        }
    });
    return menu;
}

router.beforeEach((to, form, next) => {
    nProgress.start();
    let status = isLogin();
    if (to.path === '/user/login' && status === true) {
        next({path: "/main"});
        return false;
    }

    const record = findLast(to.matched, (record) => record.meta.roles);

    if (record) {
        if (status === false) {
            cookieInit();
            next({ path: "/user/login" });
            return false;
        }
        nProgress.done();
    }

    next()
});


router.afterEach(() => {
    nProgress.done();
});

export default router;
