"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Link", {
  enumerable: true,
  get: function get() {
    return _link["default"];
  }
});
exports.withTranslation = exports.getLocaleFromPathname = exports.useLocaleFromPathname = exports.i18nSetup = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _i18nTagWrapper = _interopRequireDefault(require("@wearedevx/i18n-tag-wrapper"));

var _link = _interopRequireWildcard(require("./link"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _default = _i18nTagWrapper["default"];
exports["default"] = _default;
var setLocale = false;
var _configs = {
  locales: []
};

var i18nSetup = function i18nSetup(configs) {
  _configs = configs;
  setLocale = _i18nTagWrapper["default"].setup(configs);
}; // eslint-disable-next-line no-unused-vars


exports.i18nSetup = i18nSetup;

var useLocaleFromQuery = function useLocaleFromQuery(query) {
  // Next
  if (query.lang) {
    setLocale(query.lang);
  }
};

var hasLocale = function hasLocale(localeName) {
  return Object.keys(_configs.locales).includes(localeName);
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

exports.useLocaleFromPathname = useLocaleFromPathname;

var getLocaleFromPathname = function getLocaleFromPathname(pathname) {
  // the locale will be at index 1 because pathname starts with /
  var localeName = pathname.split('/')[1];

  if (hasLocale(localeName)) {
    return localeName;
  }

  return '';
};
/* eslint-disable no-param-reassign */

/* eslint-disable no-prototype-builtins */


exports.getLocaleFromPathname = getLocaleFromPathname;

var withTranslation = function withTranslation(configs) {
  return function (Page) {
    if (!setLocale) {
      i18nSetup(configs);
    } // Default function in case none is present


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
      var lang = props.lang;
      setLocale(lang);
      (0, _link.setLinkLocale)(lang);
      return _react["default"].createElement(Page, _extends({}, props, {
        lang: lang
      }));
    };

    HOC.getInitialProps = Page.getInitialProps;
    HOC.propTypes = _objectSpread({}, Page.propTypes, {
      lang: _propTypes["default"].string
    });
    HOC.defaultProps = _objectSpread({}, Page.defaultProps, {
      lang: ''
    });
    return HOC;
  };
};

exports.withTranslation = withTranslation;