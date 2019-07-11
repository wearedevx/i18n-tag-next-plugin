"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTranslation = exports.useLocaleFromPathname = exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _i18nTagWrapper = _interopRequireDefault(require("i18n-tag-wrapper"));

var _locales = _interopRequireDefault(require("../../locales"));

var _link = require("./link");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var setLocale = (0, _i18nTagWrapper["default"])(_locales["default"]);
var _default = setLocale.T; // eslint-disable-next-line no-unused-vars

exports["default"] = _default;

var useLocaleFromQuery = function useLocaleFromQuery(query) {
  // Next
  if (query.lang) {
    setLocale(query.lang);
  }
};

var hasLocale = function hasLocale(localeName) {
  return Object.keys(_locales["default"].locales).includes(localeName);
};

var useLocaleFromPathname = function useLocaleFromPathname(pathname) {
  // the locale will be at index 1 because pathname starts with /
  var localeName = pathname.split('/')[1];

  if (hasLocale(localeName)) {
    setLocale(localeName);
    return localeName;
  }

  return '';
};
/* eslint-disable no-param-reassign */

/* eslint-disable no-prototype-builtins */


exports.useLocaleFromPathname = useLocaleFromPathname;

var withTranslation = function withTranslation(Page) {
  // Default function in case none is present
  var originalFunction = function originalFunction() {
    return {};
  }; // Backup the maybe-existing getInitialProps


  if (Page.hasOwnProperty('getInitialProps')) {
    originalFunction = Page.getInitialProps;
  } // Override the getInitialProps


  Page.getInitialProps = function (params) {
    // params.asPath is the url shown in the browser
    // params.pathname is the path to the file: '/[lang]/...'
    var locale = useLocaleFromPathname(params.asPath);
    var props = originalFunction(params);
    props.lang = locale;
    return props;
  };

  var HOC = function HOC(props) {
    var lang = props.query.lang;
    setLocale(lang);
    (0, _link.setLinkLocale)(lang);
    return React.createElement(Page, _extends({}, props, {
      lang: lang
    }));
  };

  HOC.propTypes = _objectSpread({}, Page.propTypes, {
    lang: _propTypes["default"].string
  });
  HOC.defaultProps = _objectSpread({}, Page.defaultProps, {
    lang: ''
  });
  return HOC;
};

exports.withTranslation = withTranslation;