"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLinkLocale = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _link = _interopRequireDefault(require("next/link"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypesExact = _interopRequireDefault(require("prop-types-exact"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var globalLang = '';

var Link = function Link(_ref) {
  var className = _ref.className,
      children = _ref.children,
      lang = _ref.lang,
      props = _objectWithoutProperties(_ref, ["className", "children", "lang"]);

  var newProps = _objectSpread({}, props);

  var langToUse = lang || globalLang;

  if (langToUse !== '') {
    newProps.href = "/".concat(langToUse).concat(props.href);

    if (props.as) {
      newProps.as = "/".concat(langToUse).concat(props.as);
    }
  }

  return _react["default"].createElement(_link["default"], newProps, _react["default"].createElement("a", {
    href: newProps.href,
    className: className
  }, children));
};

Link.propTypes = (0, _propTypesExact["default"])(_objectSpread({}, _link["default"].propTypes, {
  lang: _propTypes["default"].string,
  className: _propTypes["default"].string,
  children: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].arrayOf(_propTypes["default"].node)]).isRequired
}));
Link.defaultProps = _objectSpread({}, _link["default"].defaultProps, {
  lang: undefined
});
var _default = Link;
exports["default"] = _default;

var setLinkLocale = function setLinkLocale(locale) {
  globalLang = locale;
};

exports.setLinkLocale = setLinkLocale;