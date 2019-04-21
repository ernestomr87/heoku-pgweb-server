'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Enumeration =
/*#__PURE__*/
function () {
  function Enumeration(obj) {
    _classCallCheck(this, Enumeration);

    for (var key in obj) {
      this[key] = obj[key];
    }

    return Object.freeze(this);
  }

  _createClass(Enumeration, [{
    key: "has",
    value: function has(key) {
      return this.hasOwnProperty(key);
    }
  }]);

  return Enumeration;
}();

module.exports = Enumeration;