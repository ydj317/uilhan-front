import Cookie from "js-cookie";

export function getCurrentAuthority() {
  //let ca = document.cookie.split('=');
  return ['admin'];
}

export function check(authority) {
  //const current = getCurrentAuthority();

  //return current.some((item) => authority.includes(item));
}

export function isLogin() {
  //const current = getCurrentAuthority();
  let token = Cookie.get('token');
  let roles = Cookie.get('member_roles');
  let name = Cookie.get('member_name');
  if (token === undefined || token === 'null' || token === 'undefined') {
    return false;
  }

  if (token.length === 0) {
    return false;
  }

  roles = roles.split(',');
  if (Array.isArray(roles) === false || roles.length === 0) {
    return false;
  }

  if (name === undefined || name.length === 0) {
    return false;
  }

  return true;
}

export function cookieInit() {
  Cookie.remove('token');
  Cookie.remove('member_name');
  Cookie.remove('member_roles');
  Cookie.remove('ch-session');
}

export function getUserInfo() {
  return {member_name: Cookie.get('member_name'), member_roles: Cookie.get('member_roles')};
}

// export function setLoginCookie() {
//   let d = new Date();
//   d.setTime(d.getTime() + 60 * 3000);
//   document.cookie = "user=" + escape('admin') + ";expires=" + d.toGMTString();
// }

