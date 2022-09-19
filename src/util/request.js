import axios from 'axios';
// import { auth } from '@/Store';
import Cookie from "js-cookie";
import { JSEncrypt } from 'jsencrypt';
import {pub} from './encript';

// 로그인 등 인증이 필요없는 페이지에서 사용
function isLocalServer(config) {
    if (location.origin === 'http://192.168.56.68:8080' || location.origin === 'https://sym.s') {
        config.url = config.url.replace(process.env.VUE_APP_API_URL, 'https://sym.s');
    }

    return config;
}
function isDebug(config) {
    if (localStorage.debug === 'T') {
        config.url += '?XDEBUG_SESSION=PHPSTORM';
    }

    return config;
}

function systemErrorSetting(error) {
    let response = {
        status: error.response.status,
        message: "데이터 처리중 서버오류가 발생하습니다.\n관리자에게 문의하시길 바랍니다."
    };
    console.log('error', {code: error.response.status, message: error.response.message})

    return response;
}

// 로그인 등 인증이 필요없는 페이지에서 사용
export const NoAuthAjax = (function () {
    const NoAuthAjax = axios.create();

    NoAuthAjax.interceptors.request.use(function (config) {
        config = isLocalServer(config);
        config = isDebug(config);

        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        return config;
    });

    return NoAuthAjax;
})();

export const LoginRequest = (function () {
    const LoginRequest = axios.create();
    const jsencrypt = new JSEncrypt()
    LoginRequest.interceptors.request.use(function (config) {
        config = isLocalServer(config);
        config = isDebug(config);

        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        jsencrypt.setPublicKey(pub);
        config.data = JSON.stringify(config.data);
        config.data = jsencrypt.encrypt(config.data);

        return config;
    });

    LoginRequest.interceptors.response.use(function (res) {
        let response = res.data;
        if (response.status === '2000') {
            Cookie.set('token', response.data.token)
        }

        return response;
    }, function (error) {
        return Promise.reject(systemErrorSetting(error));
    });

    return LoginRequest;
})();

export const AuthRequest = (function () {
    const AuthRequest = axios.create()
    AuthRequest.interceptors.request.use(function (config) {
        config = isLocalServer(config);
        config = isDebug(config);

        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        let token = Cookie.get('token');
        if (token.length > 0) {
            config.headers['token'] = token;
        }

        return config;
    });

    AuthRequest.interceptors.response.use(function (res) {
        if (res.length > 0) {
            Cookie.set('token', res);
        }

        // DEBUG
        if (res.config.url.indexOf('?XDEBUG_SESSION=PHPSTORM') !== -1) {
            console.group(res.config.method.toUpperCase() + ': ' + res.config.url.replace('?XDEBUG_SESSION=PHPSTORM', ''));
            console.log('request', {
                data: res.config.data,
                params: res.config.params
            });
            console.log('response', res.data);
            console.groupEnd();
        }

        return res.data;
    }, function (error) {
        return Promise.reject(systemErrorSetting(error));
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
