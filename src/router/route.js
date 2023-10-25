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
    DashboardOutlined,
    FileExcelOutlined
} from "@ant-design/icons-vue";

export const menus = [{
    path: "/",
    name: "dashboard",
    meta: {roles: ["ROLE_USER"]},
    component: () => import("@/views/Template/Layout"),
    redirect: "/dashboard",
    children: [
        {
            path: "/dashboard",
            name: "dashboard",
            component: () => import("@/views/Product/Dashboard"),
            meta: {
                title: "메인",
                isHide: false,
                roles: ["ROLE_USER"],
                icon: DashboardOutlined
            }
        },
        {
            path: "/market/accounts/list",
            name: "market_accounts_list",
            component: () => import("@/views/MarketAccount/List.vue"),
            meta: {
                title: "마켓계정관리",
                isHide: false,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: GiftOutlined,
            },
        },
        {
            path: "/market/accounts/register/:id?",
            name: "market_accounts_register",
            component: () => import("@/views/MarketAccount/Register.vue"),
            meta: {
                title: "마켓계정관리-등록/수정",
                isHide: true,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: GiftOutlined,
            },
        },
        {
            path: "/product",
            name: "product",
            component: () => import("@/views/Product/List"),
            meta: {
                title: "상품관리",
                isHide: false,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
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
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: PayCircleOutlined,
                active: "/product"
            },
        },
        {
            path: "/product/preview/:id",
            name: "prd_preview",
            component: () => import("@/views/Product/Preview"),
            meta: {
                title: "상품이미지",
                isHide: true,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: '',
                active: "/product"
            },
        },
        {
            path: "/order",
            name: "order",
            redirect: "/order/list",
            meta: {
                title: "주문관리",
                isHide: false,
                roles: ["ROLE_ADMIN", "ROLE_USER"],
                icon: CalendarOutlined
            },
            "children": [
                {
                    path: "/order/list",
                    name: "order_list",
                    component: () => import("@/views/Order/order/List.vue"),
                    meta: {
                        title: "주문관리",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                        active: "/order"
                    },
                },
                {
                    path: "/order/info/:id?",
                    name: "order_info",
                    component: () => import("@/views/Order/order/Info.vue"),
                    meta: {
                        title: "주문상세",
                        isHide: true,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                        active: "/order/list"
                    },
                },
                {
                    path: "/claim/list",
                    name: "claim_list",
                    component: () => import("@/views/Order/claim/List.vue"),
                    meta: {
                        title: "클레임관리",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                    },
                },
                {
                    path: "/claim/info/:id?",
                    name: "claim_info",
                    component: () => import("@/views/Order/claim/Info.vue"),
                    meta: {
                        title: "클레임상세",
                        isHide: true,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                        active: "/claim/list"
                    },
                },
            ]
        },
        {
            path: "/board",
            name: "board",
            redirect: "/board/list",
            meta: {
                title: "게시판관리",
                isHide: false,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
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
                    },
                },
                {
                    path: "/board/form/:id?",
                    name: "board_form",
                    component: () => import("@/views/Board/Form.vue"),
                    meta: {
                        title: "게시글 추가/수정",
                        isHide: true,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                        active: "/board/list"
                    },
                },
                {
                    path: "/board/view/:id?",
                    name: "board_view",
                    component: () => import("@/views/Board/View.vue"),
                    meta: {
                        title: "게시글 보기",
                        isHide: true,
                        roles: ["ROLE_ADMIN"],
                        icon: '',
                        active: "/board/list"
                    },
                },
                {
                    path: "/board/notice",
                    name: "board_notice",
                    component: () => import("@/views/Board/NoticeList.vue"),
                    meta: {
                        title: "공지사항",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
                {
                    path: "/board/notice/view/:id?",
                    name: "board_notice_view",
                    component: () => import("@/views/Board/NoticeView.vue"),
                    meta: {
                        title: "공지사항 - 보기",
                        isHide: true,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                        active: "/board/notice"
                    },
                },
                {
                    path: "/board/question",
                    name: "board_question",
                    component: () => import("@/views/Board/QuestionList.vue"),
                    meta: {
                        title: "1:1 문의",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
                {
                    path: "/board/question/form/:id?",
                    name: "board_question_form",
                    component: () => import("@/views/Board/QuestionForm.vue"),
                    meta: {
                        title: "1:1 문의 수정/삭제",
                        isHide: true,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                        active: "/board/question"
                    },
                },
                {
                    path: "/board/question/view/:id?",
                    name: "board_question_view",
                    component: () => import("@/views/Board/QuestionView.vue"),
                    meta: {
                        title: "1:1 문의 보기",
                        isHide: true,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                        active: "/board/question"
                    },
                },
            ]
        },
        {
            path: "/setting",
            name: "setting",
            meta: {
                title: "설정",
                isHide: false,
                roles: ["ROLE_ADMIN", "ROLE_USER"],
                icon: SettingOutlined
            },
            "children": [
                {
                    path: "/setting/updateDetail",
                    name: "setting_updateDetail",
                    component: () => import("@/views/Setting/UpdateDetail"),
                    meta: {
                        title: "사용자 정보 수정",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                    }
                },
                {
                    path: "/setting/password",
                    name: "setting_password",
                    component: () => import("@/views/Setting/Password"),
                    meta: {
                        title: "비밀번호 변경",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                    }
                },
                {
                    path: "/setting/account",
                    name: "setting_account",
                    component: () => import("@/views/Setting/Account"),
                    meta: {
                        title: "계정정보",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
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
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                    }
                },
                {
                    path: "/setting/guide",
                    name: "setting_guide",
                    component: () => import("@/views/Setting/Guide"),
                    meta: {
                        title: "안내정보",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                    }
                },
                {
                    path: "/setting/guideForm/:id?",
                    name: "setting_guideForm",
                    component: () => import("../views/Setting/GuideForm"),
                    meta: {
                        title: "안내정보 추가/수정",
                        isHide: true,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                        active: "/setting/template"
                    }
                },
            ]
        },
        {
            path: "/user",
            name: "user",
            meta: {
                title: "서비스 관리",
                isHide: false,
                roles: ["ROLE_ADMIN", "ROLE_USER"],
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
                    path: "/user/licenseForm/:id?",
                    name: "user_licenseForm",
                    component: () => import("../views/User/LicenseForm"),
                    meta: {
                        title: "서비스 추가/수정",
                        isHide: true,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                        active: "/user/license"
                    }
                },
                {
                    path: "/user/licensePay",
                    name: "user_licensePay",
                    component: () => import("@/views/User/LicensePay.vue"),
                    meta: {
                        title: "서비스 결제",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
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
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
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
                roles: ["ROLE_USER", "ROLE_ADMIN"],
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
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: AppstoreOutlined,
            },
        },
        {
            path: "/excel",
            name: "excel",
            component: () => import("@/components/Tools/excelConvertTools.vue"),
            meta: {
                title: "엑셀 컨버터 툴",
                isHide: false,
                roles: [],
                ids: ["irunkorea", "jwli"],
                icon: FileExcelOutlined,
            },
        },
        {
            path: "/excel2",
            name: "excel2",
            component: () => import("@/components/Tools/excelConvertTools2.vue"),
            meta: {
                title: "엑셀 컨버터 툴2",
                isHide: false,
                roles: [],
                ids: ["irunkorea", "jwli"],
                icon: FileExcelOutlined,
            },
        },
        {
            path: "/product/vvic",
            name: "product_vvic",
            component: () => import("@/views/Product/VvicList.vue"),
            meta: {
                title: "Vvic 상품관리",
                isHide: false,
                roles: [],
                ids: ["irunkorea", "jwli"],
                icon: GiftOutlined,
            },
        },
    ]
}]


export const staticRoutes = [
    {
        path: "/user/login",
        name: "user_login",
        component: () => import("@/views/User/Login.vue"),
    },
    {
        path: "/user/register",
        name: "user_register",
        component: () => import("@/views/User/Register.vue"),
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
            title: "404",
            isHide: true,
        }
    },
];