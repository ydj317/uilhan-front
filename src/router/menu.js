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

export const menus = {
    "code": 0,
    "type": "adminMenus",
    "data": [
        {
            "path": "/main",
            "name": "main",
            "component": "Product/Main",
            "meta": {
                "title": "메인",
                "isHide": false,
                "roles": ["ROLE_ADMIN"],
                "icon": DashboardOutlined
            }
        },
        {
            "path": "/product",
            "name": "product",
            "component": "Product/List",
            "meta": {
                "title": "상품관리",
                "isHide": false,
                "roles": ["ROLE_ADMIN"],
                "icon": GiftOutlined
            },
        },
        {
            "path": "/order/list",
            "name": "order_list",
            "component": "Order/List",
            "meta": {
                "title": "주문관리",
                "isHide": false,
                "roles": ["ROLE_ADMIN"],
                "icon": CalendarOutlined
            },
        },
        {
            "path": "/market/seller/list",
            "name": "market_seller_list",
            "component": "MarketSeller/List",
            "meta": {
                "title": "제휴사연동",
                "isHide": false,
                "roles": ["ROLE_ADMIN"],
                "icon": PayCircleOutlined
            },
        },
        {
            "path": "/board",
            "name": "board",
            "component": "Board/index",
            "redirect": "/board/list",
            "meta": {
                "title": "게시판관리",
                "isHide": false,
                "roles": ["ROLE_ADMIN"],
                "icon": ProfileOutlined
            },
            "children": [
                {
                    "path": "/board/list",
                    "name": "board_list",
                    "component": "Board/List",
                    "meta": {
                        "title": "게시글관리",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
                {
                    "path": "/board/notice",
                    "name": "board_notice",
                    "component": "Board/NoticeList",
                    "meta": {
                        "title": "공지사항",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
                {
                    "path": "/board/question",
                    "name": "board_question",
                    "component": "Board/QuestionList",
                    "meta": {
                        "title": "1:1 문의",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
            ]
        },
        {
            "path": "/setting",
            "name": "setting",
            "component": "Setting/index",
            "meta": {
                "title": "설정",
                "isHide": false,
                "roles": ["ROLE_ADMIN"],
                "icon": SettingOutlined
            },
            "children": [
                {
                    "path": "/setting/account",
                    "name": "setting_account",
                    "component": "Setting/Account",
                    "meta": {
                        "title": "계정정보",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
                {
                    "path": "/setting/margin",
                    "name": "setting_margin",
                    "component": "Setting/Margin",
                    "meta": {
                        "title": "마진 & 환율",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
                {
                    "path": "/setting/delivery",
                    "name": "setting_delivery",
                    "component": "Setting/DeliveryList",
                    "meta": {
                        "title": "배송정책",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
            ]
        },
        {
            "path": "/user",
            "name": "user",
            "component": "user/index",
            "meta": {
                "title": "회원충전",
                "isHide": false,
                "roles": ["ROLE_ADMIN"],
                "icon": MoneyCollectOutlined
            },
            "children": [
                {
                    "path": "/user/license",
                    "name": "user_license",
                    "component": "User/License",
                    "meta": {
                        "title": "서비스 관리",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
                {
                    "path": "/user/licensePay",
                    "name": "user_licensePay",
                    "component": "User/LicensePay",
                    "meta": {
                        "title": "서비스 결제",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
                {
                    "path": "/user/licenseHistory",
                    "name": "user_licenseHistory",
                    "component": "User/LicenseHistory",
                    "meta": {
                        "title": "서비스 이력",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
                {
                    "path": "/user/manage",
                    "name": "user_manage",
                    "component": "User/Manage",
                    "meta": {
                        "title": "이미지 번역 회수",
                        "isHide": false,
                        "roles": ["ROLE_ADMIN"],
                        "icon": '',
                    }
                },
            ]
        },
        {
            "path": "/user/FilterProductWords",
            "name": "user_filterProductWords",
            "component": "User/FilterProductWords",
            "meta": {
                "title": "금지어 관리",
                "isHide": false,
                "roles": ["ROLE_ADMIN"],
                "icon": CloseCircleOutlined,
            },
        },
        {
            "path": "/product/domeggook",
            "name": "prd_domeggook",
            "component": "Product/Domeggook",
            "meta": {
                "title": "도매꾹",
                "isHide": false,
                "roles": ["ROLE_ADMIN"],
                "icon": AppstoreOutlined,
            },
        },
    ]
}