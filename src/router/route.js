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
    FileExcelOutlined, NotificationOutlined,
    ShoppingOutlined,
    BarcodeOutlined,
    KeyOutlined
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
            component: () => import("@/views/Dashboard.vue"),
            meta: {
                title: "대시보드",
                isHide: false,
                roles: ["ROLE_USER"],
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
            path: "/order/list",
            name: "order_list",
            component: () => import("@/views/Order/order/List.vue"),
            meta: {
                title: "주문관리",
                isHide: false,
                roles: ["ROLE_ADMIN", "ROLE_USER"],
                icon: CalendarOutlined
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
            path: "/market/accounts/list",
            name: "market_accounts_list",
            component: () => import("@/views/MarketAccount/List.vue"),
            meta: {
                title: "마켓연동",
                isHide: false,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: ShoppingOutlined,
            },
        },
        {
            path: "/market/accounts/register/:id?",
            name: "market_accounts_register",
            component: () => import("@/views/MarketAccount/Register.vue"),
            meta: {
                title: "마켓연동관리-등록/수정",
                isHide: true,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: ShoppingOutlined,
            },
        },
        {
            path: "/board/list",
            name: "board_list",
            component: () => import("@/views/Board/List.vue"),
            meta: {
                title: "게시글관리",
                isHide: false,
                roles: ["ROLE_ADMIN"],
                icon: ProfileOutlined,
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
            path: "/setting",
            name: "setting",
            meta: {
                title: "기타설정",
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
                        title: "계정 정보",
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
                        title: "수익률 & 환율 설정",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                    }
                },
                {
                    path: "/user/FilterProductWords",
                    name: "user_filterProductWords",
                    component: () => import("@/views/User/FilterProductWords"),
                    meta: {
                        title: "금지어 관리",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
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
                {
                    path: "/setting/UserManage",
                    name: "setting_userManage",
                    component: () => import("@/views/Setting/UserManage.vue"),
                    meta: {
                        title: "고객 계정관리",
                        isHide: false,
                        roles: [],
                        ids: ["jwli"],
                        icon: ''
                    },
                }
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
                    path: "/user/servicePay",
                    name: "user_servicePay",
                    component: () => import("@/views/User/ServicePay.vue"),
                    meta: {
                        title: "서비스 결제",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: ''
                    },
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
            path: "/board/notice",
            name: "board_notice",
            component: () => import("@/views/Board/NoticeList.vue"),
            meta: {
                title: "공지사항",
                isHide: false,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: NotificationOutlined,
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
            path: "/blog",
            name: "blog",
            meta: {
                title: "커뮤니티",
                isHide: false,
                roles: ["ROLE_ADMIN", "ROLE_USER"],
                icon: MoneyCollectOutlined
            },
            "children": [
                {
                    path: "https://open.kakao.com/o/ggOPXdSf",
                    name: "app_chat",
                    meta: {
                        title: "오픈채팅방",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
                {
                    path: "https://blog.naver.com/worldlink_",
                    name: "app_blog",
                    meta: {
                        title: "블로그",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
            ]
        },
        {
            path: "/product/domeggook",
            name: "prd_domeggook",
            component: () => import("@/views/Product/Domeggook"),
            meta: {
                title: "도매꾹",
                isHide: false,
                roles: [],
                ids: ["jwli", "haeju"],
                icon: AppstoreOutlined,
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
                ids: ["jwli", "irunkorea", "haeju"],
                icon: GiftOutlined,
            },
        },
        {
            path: "/customOrder",
            name: "custom_order",
            meta: {
                title: "구매입출고관리",
                isHide: false,
                roles: [],
                ids: ["irunkorea", "jwli", "haeju"],
                icon: BarcodeOutlined
            },
            "children": [
                {
                    path: "/customOrder/list",
                    component: () => import("@/views/CustomOrder/List.vue"),
                    name: "custom_order_list",
                    meta: {
                        title: "구매관리",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
                {
                    path: "/customOrder/DeliveryReceipt",
                    component: () => import("@/views/CustomOrder/DeliveryReceipt.vue"),
                    name: "custom_order_delivery_receipt",
                    meta: {
                        title: "택배입고관리",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
                {
                    path: "/customOrder/shipmentManage",
                    component: () => import("@/views/CustomOrder/shipmentManage.vue"),
                    name: "custom_order_shipment_manage",
                    meta: {
                        title: "출고관리",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
            ]
        },
        {
            path: "/excel",
            name: "excel",
            component: () => import("@/components/Tools/excelConvertTools.vue"),
            meta: {
                title: "엑셀 컨버터 툴",
                isHide: false,
                ids: ["jwli", "irunkorea"],
                roles: [],
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
                ids: ["jwli", "irunkorea"],
                roles: [],
                icon: FileExcelOutlined,
            },
        },
    ]
}]


export const staticRoutes = [
    {
        path: "/user/login",
        name: "user_login",
        component: () => import("@/views/User/Login.vue"),
        meta: {
            title: "로그인",
        }
    },
    {
        path: "/user/register",
        name: "user_register",
        component: () => import("@/views/User/Register.vue"),
        meta: {
            title: "회원가입",
        }
    },
    {
        path: "/user/find/password",
        name: "user_find_password",
        component: () => import("@/views/User/FindPassword.vue"),
        meta: {
            title: "비밀번호 찾기",
        }
    }
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