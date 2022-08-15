export class lib {
  static #typeof(param) {
    return Object.prototype.toString.call(param).split(" ")[1].split("]")[0];
  }

  static isNull(param) {
    return this.#typeof(param) === "Null";
  }

  static isBoolean(param) {
    return this.#typeof(param) === "Boolean";
  }

  static isFunction(param) {
    return this.#typeof(param) === "Function";
  }

  static isUndefined(param) {
    return this.#typeof(param) === "Undefined";
  }

  static isString(param, bValid = false) {
    let bReturn = this.#typeof(param) === "String";
    if (bReturn && bValid) {
      return param.length > 0;
    }

    return bReturn;
  }

  static isNumeric(param, bValid = false) {
    try {
      let bReturn = this.#typeof(Number(param)) === "Number";
      if (bReturn && bValid) {
        return param.length > 0;
      }

      return bReturn;
    } catch (e) {
      return false;
    }
  }

  static isNumber(param, bValid = false) {
    let bReturn = this.#typeof(param) === "Number";
    if (bReturn && bValid) {
      return param.length > 0;
    }

    return bReturn;
  }

  static isObject(param, bValid = false) {
    let bReturn = this.#typeof(param) === "Object";
    if (bReturn && bValid) {
      return Object.keys(param).length > 0;
    }

    return bReturn;
  }

  static isArray(param, bValid = false) {
    let bReturn = this.#typeof(param) === "Array";
    if (bReturn && bValid) {
      return param.length > 0;
    }

    return bReturn;
  }

  static isEmpty(param) {
    let bResult = false;

    if (this.isNull(param)) {
      bResult = true;
    }
    if (this.isUndefined(param)) {
      bResult = true;
    }
    if (this.isString(param)) {
      bResult = !this.isString(param, true);
    }
    if (this.isObject(param)) {
      bResult = !this.isObject(param, true);
    }
    if (this.isArray(param)) {
      bResult = !this.isArray(param, true);
    }

    return bResult;
  }

  static isJson(param) {
    let res = null;
    try {
      res = JSON.parse(param);
    } catch (e) {
      return false;
    }

    return !this.isEmpty(res);
  }
}