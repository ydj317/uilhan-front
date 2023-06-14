import { createRouter, createWebHistory } from "vue-router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import findLast from "lodash/findLast";
import { isLogin, cookieInit } from "util/auth";
import Cookie from "js-cookie";


const routes = [
  {
    path: "/",
    name: "Main",
    meta: { authority: ["ROLE_USER"] },
    component: () =>
      import(/* webpackChunkName: "Main" */ "views/Template/Layout"),
    redirect: "/main",
    children: [
      {
        path: "/main",
        // meta: { authority: ["ROLE_USER"] },
        /* webpackChunkName: 'product' */
        // component: RenderRouterView,
        children: [
          // {
          //   path: "/product",
          //   redirect: "/product/list",
          // },

          {
            path: "/main",
            name: "main_page",
            /* webpackChunkName: 'user_register' */
            component: () => import("views/Product/Main"),
          },
          {
            path: "/product",
            name: "prd_list",
            /* webpackChunkName: '/prd_list' */
            component: () => import("views/Product/List"),
          },
          {
            path: "/product/detail/:id",
            name: "prd_detail",
            /* webpackChunkName: '/prd_detail' */
            component: () => import("views/Product/Detail"),
          },
          {
            path: "/market/seller/list",
            name: "market_seller_list",
            /* webpackChunkName: '/prd_list' */
            component: () => import("@/views/MarketSeller/List"),
          },
          {
            path: "/user/Manage",
            name: "user_manager",
            /* webpackChunkName: 'user_manager' */
            component: () => import("../views/User/Manage"),
          },

          {
            path: "/user/FilterProductWords",
            name: "user_filterProductWords",
            /* webpackChunkName: 'user_manager' */
            component: () => import("../views/User/FilterProductWords"),
          },
          {
            path: "/product/preview/:id",
            name: "prd_preview",
            /* webpackChunkName: 'user_register' */
            component: () => import("views/Product/Preview"),
          },
          {
            path: "/product/domeggook",
            name: "prd_domeggook",
            /* webpackChunkName: 'user_register' */
            component: () => import("views/Product/Domeggook"),
          },
          {
            path: "/order/list",
            name: "order_list",
            /* webpackChunkName: 'user_register' */
            component: () => import("views/Order/List.vue"),
          },
          // {
          //   path: "/user/register",
          //   name: "user_register",
          //   /* webpackChunkName: 'user_register' */
          //   component: () => import("../views/User/Register"),
          // },
        ],
      },
    ],
  },
  {
    path: "/user/register",
    name: "user_register",
    /* webpackChunkName: 'user_register' */
    component: () => import("views/User/Register"),
  },
  {
    path: "/user/login",
    name: "user_login",
    /* webpackChunkName: 'user_register' */
    component: () => import("views/User/Login"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "404",
    /* webpackChunkName: 'form' */
    component: () => import("views/Template/404"),
  },
  // {
  //   path: "/product",
  //   name: "product",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "views/Product/List.vue"),
  //
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, form, next) => {
  nProgress.start();
  let status = isLogin();
  if (to.path === '/user/login' && status === true) {
    next({ path: "/main" });
    return false;
  }

  const record = findLast(to.matched, (record) => record.meta.authority);

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
