import {
    GiftOutlined,
    CalendarOutlined,
    SettingOutlined,
    MoneyCollectOutlined,
    ProfileOutlined,
    ShoppingOutlined,
    LayoutOutlined,
    ShoppingCartOutlined,
    BellOutlined,
    ReadOutlined,
    AppstoreOutlined,
    UserOutlined,
    MenuUnfoldOutlined
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
                icon: LayoutOutlined
            }
        },
        {
            path: "/product",
            name: "product",
            component: () => import("@/views/Product/List/index.vue"),
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
                icon: ShoppingCartOutlined,
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
            path: "/order/list/express-detail",
            name: "order_list_express_detail",
            component: () => import("@/views/Express/components/BridgeExpressView.vue"),
            meta: {
                title: "주문관리",
                isHide: true,
                roles: ["ROLE_ADMIN", "ROLE_USER"],
                icon: CalendarOutlined
            },
        },
        {
            path: "/order/info/:orderNo?",
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
                    path: "/setting/updateDetail",
                    name: "setting_updateDetail",
                    component: () => import("@/views/Setting/UpdateDetail"),
                    meta: {
                        title: "계정설정",
                        isHide: false,
                        roles: ["ROLE_ADMIN", "ROLE_USER"],
                        icon: '',
                    }
                },
                // {
                //     path: "/setting/margin",
                //     name: "setting_margin",
                //     component: () => import("@/views/Setting/Margin"),
                //     meta: {
                //         title: "수익률 & 환율 설정",
                //         isHide: false,
                //         roles: ["ROLE_ADMIN", "ROLE_USER"],
                //         icon: '',
                //     }
                // },
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
                    path: "/setting/AccountManage",
                    name: "setting_accountManage",
                    component: () => import("@/views/Setting/AccountManage"),
                    meta: {
                        title: "계정관리",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                }

            ]
        },
        {
            path: "/user/servicesPay",
            name: "user_services_pay",
            component: () => import("@/views/User/ServicesPay.vue"),
            meta: {
                title: "서비스 결제",
                isHide: false,
                roles: ["ROLE_ADMIN", "ROLE_USER"],
                icon: MoneyCollectOutlined,
            },
        },
        {
            path: "/user/mypage",
            name: "user_my",
            component: () => import("@/views/User/my.vue"),
            meta: {
                title: "My Page",
                isHide: true,
                roles: ["ROLE_ADMIN", "ROLE_USER"],
                icon: '',
            },
        },
        {
            path: "/user",
            name: "user",
            meta: {
                title: "서비스 관리",
                isHide: false,
                roles: [],
                icon: MoneyCollectOutlined,
                ids: ["jwli"],
            },
            "children": [
                // {
                //     path: "/user/servicePay",
                //     name: "user_servicePay",
                //     component: () => import("@/views/User/ServicePay.vue"),
                //     meta: {
                //         title: "서비스 결제",
                //         isHide: false,
                //         roles: ["ROLE_ADMIN", "ROLE_USER"],
                //         icon: ''
                //     },
                // },

                {
                    path: "/user/UserQuotaOrder",
                    name: "user_userQuotaOrder",
                    component: () => import("@/views/Setting/UserQuotaOrder"),
                    meta: {
                        title: "결제관리",
                        isHide: false,
                        roles: [],
                        icon: '',
                        ids: ["jwli"],
                    },
                },
                {
                    path: "/user/UserQuotaControl",
                    name: "user_userQuotaControl",
                    component: () => import("@/views/Setting/UserQuotaControl"),
                    meta: {
                        title: "서비스 권한 관리",
                        isHide: false,
                        roles: [],
                        ids: ["jwli"],
                        icon: '',
                    },
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
                },
                {
                    path: "/setting/UserAccountManage",
                    name: "UserAccountManage",
                    component: () => import("@/views/Setting/UserAccountManage.vue"),
                    meta: {
                        title: "고객 마켓연동관리",
                        isHide: false,
                        roles: [],
                        ids: ["jwli"],
                        icon: ''
                    },
                },
                // {
                //     path: "/user/manage",
                //     name: "user_manage",
                //     component: () => import("@/views/User/Manage"),
                //     meta: {
                //         title: "이미지 번역 회수",
                //         isHide: false,
                //         roles: ["ROLE_ADMIN"],
                //         icon: '',
                //         ids: ["jwli"],
                //     }
                // },
                {
                    path: "/board/list",
                    name: "board_list",
                    component: () => import("@/views/Board/List.vue"),
                    meta: {
                        title: "공지사항 관리",
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
                    path: "/mqlist",
                    name: "mqlist",
                    component: () => import("@/views/Mqlist.vue"),
                    meta: {
                        title: "MQ리스트",
                        isHide: false,
                        roles: [],
                        ids: ["jwli"],
                    }
                },
                {
                    path: "/replacementManage",
                    name: "replacementManage",
                    component: () => import("@/views/ReplacementManage.vue"),
                    meta: {
                        title: "메세지치환 관리",
                        isHide: false,
                        roles: [],
                        ids: ["jwli"],
                    }
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
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: AppstoreOutlined,
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
                icon: BellOutlined,
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

        // {
        //     path: "/product/vvic",
        //     name: "product_vvic",
        //     component: () => import("@/views/Product/VvicList.vue"),
        //     meta: {
        //         title: "Vvic 상품관리",
        //         isHide: false,
        //         roles: [],
        //         ids: ["jwli", "irunkorea", "haeju"],
        //         icon: GiftOutlined,
        //     },
        // },
        // {
        //     path: "/customOrder",
        //     name: "custom_order",
        //     meta: {
        //         title: "구매입출고관리",
        //         isHide: false,
        //         roles: [],
        //         ids: ["irunkorea", "jwli", "haeju"],
        //         icon: BarcodeOutlined
        //     },
        //     "children": [
        //         {
        //             path: "/customOrder/list",
        //             component: () => import("@/views/CustomOrder/List.vue"),
        //             name: "custom_order_list",
        //             meta: {
        //                 title: "구매관리",
        //                 isHide: false,
        //                 roles: ["ROLE_USER", "ROLE_ADMIN"],
        //                 icon: '',
        //             },
        //         },
        //         {
        //             path: "/customOrder/DeliveryReceipt",
        //             component: () => import("@/views/CustomOrder/DeliveryReceipt.vue"),
        //             name: "custom_order_delivery_receipt",
        //             meta: {
        //                 title: "택배입고관리",
        //                 isHide: false,
        //                 roles: ["ROLE_USER", "ROLE_ADMIN"],
        //                 icon: '',
        //             },
        //         },
        //         {
        //             path: "/customOrder/shipmentManage",
        //             component: () => import("@/views/CustomOrder/shipmentManage.vue"),
        //             name: "custom_order_shipment_manage",
        //             meta: {
        //                 title: "출고관리",
        //                 isHide: false,
        //                 roles: ["ROLE_USER", "ROLE_ADMIN"],
        //                 icon: '',
        //             },
        //         },
        //     ]
        // },
        // {
        //     path: "/excel",
        //     name: "excel",
        //     component: () => import("@/components/Tools/excelConvertTools.vue"),
        //     meta: {
        //         title: "엑셀 컨버터 툴",
        //         isHide: false,
        //         ids: ["jwli", "irunkorea"],
        //         roles: [],
        //         icon: FileExcelOutlined,
        //     },
        // },
        // {
        //     path: "/excel2",
        //     name: "excel2",
        //     component: () => import("@/components/Tools/excelConvertTools2.vue"),
        //     meta: {
        //         title: "엑셀 컨버터 툴2",
        //         isHide: false,
        //         ids: ["jwli", "irunkorea"],
        //         roles: [],
        //         icon: FileExcelOutlined,
        //     },
        // },
        // {
        //     path: "/user/servicePayAi",
        //     name: "user_servicePayAi",
        //     component: () => import("@/views/User/ServicePayAi.vue"),
        //     meta: {
        //         title: "️AI 서비스 결제",
        //         isHide: false,
        //         roles: [],
        //         ids: ["haeju"],
        //         icon: RobotOutlined
        //     },
        // },
        {
            path: "/product/analytics",
            name: "product_analytics",
            component: () => import("@/views/Product/Analytics.vue"),
            meta: {
                title: "매출데이터",
                isHide: false,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: GiftOutlined
            },
        },
        {
            path: "/express",
            name: "express",
            meta: {
                title: "배송대행지",
                isHide: false,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: GiftOutlined
            },
            "children": [
                {
                    path: "/express/list",
                    name: "express_list",
                    component: () => import("@/views/Express/List"),
                    meta: {
                        title: "ListOne",
                        isHide: true,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
                {
                    path: "/express/listone",
                    name: "express_listone",
                    component: () => import("@/views/Express/ListOne"),
                    meta: {
                        title: "넥스트배송",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
                {
                    path: "/express/listtwo",
                    name: "express_listtwo",
                    component: () => import("@/views/Express/ListTwo"),
                    meta: {
                        title: "토스토스",
                        isHide: true,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: '',
                    },
                },
            ]
        },
        {
            path: "https://classic-radium-bbe.notion.site/AI-712da71f7fdb45a5a0b7b78e0215772d",
            name: "guide",
            meta: {
                title: "사용자 가이드",
                isHide: false,
                roles: ["ROLE_USER", "ROLE_ADMIN"],
                icon: ReadOutlined,
                active: false
            },
        },
        {
            path: "/coupang",
            name: "coupang",
            component: () => import("@/views/Coupang.vue"),
            meta: {
                title: "쿠팡",
                isHide: true,
                icon: ReadOutlined,
                roles: ["ROLE_USER"]
            }
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
    },
  //todo  模拟第三方支付 后期删除
    {
        path: "/user/thirdPartyPaymentPage",
        name: "user_thirdPartyPaymentPage",
        component: () => import("@/views/User/thirdPartyPaymentPage.vue"),
        meta: {
            title: "第三方支付",
            icon: '',
        },
    },
];
export const otherMenus = [{
    path: "/",
    name: "teacher",
    meta: {roles: ["ROLE_USER"]},
    component: () => import("@/views/Layout/Layout"),
    redirect: "/teacher/list",
    children: [
        {
            path: "/teacher",
            name: "teacher",
            meta: {
                title: "아카데미",
                isHide: false,
                roles: ["ROLE_ADMIN", "ROLE_USER"],
                icon: MenuUnfoldOutlined
            },
            "children": [
                {
                    path: "/teacher/list",
                    name: "teacher_list",
                    component: () => import("@/views/Teacher/List.vue"),
                    meta: {
                        title: "강사리스트",
                        isHide: false,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: UserOutlined,
                    },
                },
                {
                    path: "/teacher/detail",
                    name: "teacher_detail",
                    component: () => import("@/views/Teacher/Detail.vue"),
                    meta: {
                        title: "",
                        isHide: true,
                        roles: ["ROLE_USER", "ROLE_ADMIN"],
                        icon: UserOutlined,
                    },
                },
            ]
        },
    ]
}]

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