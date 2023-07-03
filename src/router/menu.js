import {
    GiftOutlined,
    CalendarOutlined,
    PayCircleOutlined,
    FileTextOutlined,
    ApiOutlined,
    SettingOutlined,
    GroupOutlined,
    AppstoreOutlined,
    MoneyCollectOutlined,
    CloseCircleOutlined,
    ProfileOutlined,
    DashboardOutlined
} from "@ant-design/icons-vue";

export const menus = [{
    path: "/",
    name: "/",
    meta: {authority: ["ROLE_USER"]},
    component: () => import("@/views/Template/Layout"),
    redirect: "/main",
    children: [
        {
            path: "/main",
            name: "main_page",
            component: () => import("@/views/Product/Main"),
            meta: {
                title: "메인",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: DashboardOutlined
            }
        },
        {
            path: "/product",
            name: "product",
            component: () => import("@/views/Product/List"),
            meta: {
                title: "상품관리",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: GiftOutlined
            },
        },
        {
            path: "/product/detail/:id",
            name: "prd_detail",
            component: () => import("@/views/Product/Detail"),
            meta: {
                title: "상품상세",
                isHide: true,
                roles: ["ROLE_ADMIN"],
                icon: PayCircleOutlined
            },
        },
        {
            path: "/order/list",
            name: "order_list",
            component: () => import("@/views/Order/List.vue"),
            meta: {
                title: "주문관리",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: CalendarOutlined
            },
        },
        {
            path: "/market/seller/list",
            name: "market_seller_list",
            component: () => import("@/views/MarketSeller/List"),
            meta: {
                title: "제휴사연동",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: PayCircleOutlined
            },
        },
        {
            path: "/board",
            name: "board",
            "redirect": "/board/list",
            meta: {
                title: "게시판관리",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: ProfileOutlined
            },
            "children": [
                {
                    path: "/board/list",
                    name: "board_list",
                    component: () => import("@/views/Board/List.vue"),
                    meta: {
                        title: "게시글관리",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
                {
                    path: "/board/notice",
                    name: "board_notice",
                    component: () => import("@/views/Board/NoticeList.vue"),
                    meta: {
                        title: "공지사항",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
                {
                    path: "/board/question",
                    name: "board_question",
                    component: () => import("@/views/Board/QuestionList.vue"),
                    meta: {
                        title: "1:1 문의",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
            ]
        },
        {
            path: "/setting",
            name: "setting",
            meta: {
                title: "설정",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: SettingOutlined
            },
            "children": [
                {
                    path: "/setting/account",
                    name: "setting_account",
                    component: () => import("@/views/Setting/Account"),
                    meta: {
                        title: "계정정보",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
                {
                    path: "/setting/margin",
                    name: "setting_margin",
                    component: () => import("@/views/Setting/Margin"),
                    meta: {
                        title: "마진 & 환율",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
                {
                    path: "/setting/delivery",
                    name: "setting_delivery",
                    component: () => import("@/views/Setting/DeliveryList.vue"),
                    meta: {
                        title: "배송정책",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
            ]
        },
        {
            path: "/user",
            name: "user",
            meta: {
                title: "회원충전",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: MoneyCollectOutlined
            },
            "children": [
                {
                    path: "/user/license",
                    name: "user_license",
                    component: () => import("@/views/User/License"),
                    meta: {
                        title: "서비스 관리",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
                {
                    path: "/user/licensePay",
                    name: "user_licensePay",
                    component: () => import("@/views/User/LicensePay.vue"),
                    meta: {
                        title: "서비스 결제",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
                {
                    path: "/user/licenseHistory",
                    name: "user_licenseHistory",
                    component: () => import("@/views/User/LicenseHistory"),
                    meta: {
                        title: "서비스 이력",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
                {
                    path: "/user/manage",
                    name: "user_manage",
                    component: () => import("@/views/User/Manage"),
                    meta: {
                        title: "이미지 번역 회수",
                        isHide: false,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                    }
                },
            ]
        },
        {
            path: "/user/FilterProductWords",
            name: "user_filterProductWords",
            component: () => import("@/views/User/FilterProductWords"),
            meta: {
                title: "금지어 관리",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: CloseCircleOutlined,
            },
        },
        {
            path: "/product/domeggook",
            name: "prd_domeggook",
            component: () => import("@/views/Product/Domeggook"),
            meta: {
                title: "도매꾹",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: AppstoreOutlined,
            },
        },
        {
            path: "/product/domeggook",
            name: "prd_domeggook",
            component: "Product/Domeggook",
            meta: {
                title: "예치금관리(준비중)",
                isHide: true,
                roles: ["ROLE_ADMIN"],
                icon: PayCircleOutlined,
            },
        },
        {
            path: "/product/domeggook",
            name: "prd_domeggook",
            component: "Product/Domeggook",
            meta: {
                title: "상세페이지 제작(준비중)",
                isHide: true,
                roles: ["ROLE_ADMIN"],
                icon: GroupOutlined,
            },
        },
        {
            path: "/product/domeggook",
            name: "prd_domeggook",
            component: "Product/Domeggook",
            meta: {
                title: "상품부가정보(준비중)",
                isHide: true,
                roles: ["ROLE_ADMIN"],
                icon: FileTextOutlined,
            },
        },
    ]
}]


export const staticRoutes = [
    {
        path: "/user/login",
        name: "user_login",
        /* webpackChunkName: 'user_register' */
        component: () => import("views/User/Login"),
    },
    {
        path: "/user/register",
        name: "user_register",
        /* webpackChunkName: 'user_register' */
        component: () => import("views/User/Register"),
    },
];

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
    {
        path: '/:path(.*)*',
        name: 'notFound',
        component: () => import("views/Template/404"),
        meta: {
            title: 'message.staticRoutes.notFound',
            isHide: true,
        },
    }
];