import axios from 'axios';
// import { auth } from '@/Store';
import Cookie from "js-cookie";
import { JSEncrypt } from 'jsencrypt';
import {pub} from './encript';
// const ajax = {
//     baseURL: URL.CATAF_API,
//     timeout: 5000
// };

// 로그인 등 인증이 필요없는 페이지에서 사용
export const NoAuthAjax = (function () {
    const NoAuthAjax = axios.create();

    NoAuthAjax.interceptors.request.use(function (config) {
        // config.url += '?XDEBUG_SESSION=PHPSTORM';
        config.headers['Accept'] = 'application/json';
        return config;
    });

    return NoAuthAjax;
})();

export const LoginRequest = (function () {
    const LoginRequest = axios.create();
    const jsencrypt = new JSEncrypt()
    LoginRequest.interceptors.request.use(function (config) {
        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        jsencrypt.setPublicKey(pub);
        config.data = JSON.stringify(config.data);
        config.data = jsencrypt.encrypt(config.data);

        return config;
    });

    LoginRequest.interceptors.response.use(function (res) {
        if (res.status === 200) {
            Cookie.set('token', res.data.token)
        }

        return res;
    }, function () {
        return {status: 401};
    });

    return LoginRequest;
})();

export const AuthRequest = (function () {
    const AuthRequest = axios.create()
    AuthRequest.interceptors.request.use(function (config) {
        // config.url += '?XDEBUG_SESSION=PHPSTORM';
        config.headers['Accept'] = 'application/json';
        let token = Cookie.get('token');
        if (token.length > 0) {
            //config.headers['token'] = `Bearer ${token}`;
            config.headers['token'] = token;
        }

        return config;
    });

    AuthRequest.interceptors.response.use(function (res) {
        if (res.length > 0) {
            Cookie.set('token', res);
        }

        return res;
    }, function (error) {
        let status = error.response.status;
        let msg = '';
        if (status > 399 && status < 500) {
            msg = '요청하신 데이터가 옳바르지 않습니다.';
        } else if (status > 499 && status < 600) {
            msg = "데이터 처리중 서버오류가 발생하습니다. \n관리자에게 문의하시길 바랍니다.";
        }

        return Promise.reject({status: error.response.status, message: msg});
    });

    return AuthRequest;
})();


// 인증이 필요한 페이지에서 Token 자동으로 삽입하거나 갱신함
// export const AuthAjax = (function () {
//     const AuthAjax = axios.create(ajax);
//
//     let onLogout = () => undefined;
//
//     // 자동으로 Token 삽입
//     AuthAjax.interceptors.request.use(function (config) {
//         config.headers['Accept'] = 'application/json';
//         // config.headers['Accept-Language'] = i18n.language;
//
//         const token = Cookie.get('token');
//
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//
//         return config;
//     });
//
//     // 자동으로 Token 갱신
//     AuthAjax.interceptors.response.use(function (response) {
//         const token = response['headers']['refresh-token'];
//
//         if (token) {
//             auth.refreshToken(token);
//         }
//
//         return response;
//     }, function (error) {
//         if (error.message) {
//             if (error.message === 'Network Error') {
//                 return Promise.reject(error);
//             }
//
//             if (error.message.indexOf('timeout') !== -1) {
//                 return Promise.reject(error);
//             }
//         }
//
//         const errorCode = error.response.data.error;
//         const errorMessage = error.response.data.message;
//
//         if (errorCode > 9000) {
//             onLogout();
//             return Promise.reject(new Error(errorMessage));
//         }
//
//         return Promise.reject(error);
//     });
//
//     AuthAjax.onLogout = function (callback) {
//         onLogout = typeof callback === 'function' ? callback : () => undefined;
//     };
//
//     return AuthAjax;
// })();
