'use strict';

class Enumeration {
  constructor(obj) {
    for (const key in obj) {
      this[key] = obj[key];
    }
    return Object.freeze(this);
  }
  has(key){
    return this.hasOwnProperty(key);
  }
}

module.exports = Enumeration;