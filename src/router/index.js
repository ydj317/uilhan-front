import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Main",
    component: () =>
      import(/* webpackChunkName: "Main" */ "../views/Template/Layout"),
    children: [
      {
        path: "/product",
        // meta: { authority: ["ROLE_USER"] },
        /* webpackChunkName: 'product' */
        // component: RenderRouterView,
        children: [
          // {
          //   path: "/product",
          //   redirect: "/product/list",
          // },
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
          // {
          //   path: "/user/Manager",
          //   name: "user_manager",
          //   /* webpackChunkName: 'user_manager' */
          //   component: () => import("../views/User/Manager"),
          // },
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

export default router;
