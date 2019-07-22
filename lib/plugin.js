"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var path = require('path');

var fs = require('fs');

var _require = require('next/constants'),
    PHASE_EXPORT = _require.PHASE_EXPORT;
/**
 * Builds a list of available locales from `/locales` content
 * @returns {[string]}
 */


function getLocales() {
  var localeDir = path.join(process.cwd(), 'locales');
  return fs.readdirSync(localeDir).filter(function (file) {
    return file !== '.' && file !== '..' && file !== 'index.js';
  }).map(function (file) {
    return file.replace(/\.m?jsx?/, '');
  });
}
/**
 * Utility to flatten an Array with inifite depth
 * @param {Array} nestedArray
 * @returns {Array}
 * @example
 * let nested = [1, [2, [3, 4], 3]]
 *
 * expect(flatten(nestedArray)).toMatchObject([1, 2, 3, 4, 3])
 */


function flatten(nestedArray) {
  return nestedArray.reduce(function (acc, e) {
    var flatE = e;

    if (Array.isArray(e)) {
      flatE = flatten(e);
      return [].concat(_toConsumableArray(acc), _toConsumableArray(flatE));
    }

    return [].concat(_toConsumableArray(acc), [flatE]);
  }, []);
} // Prepend a slash if path is not an empty tring and doesn's already have one

/** @param {string} pathString */


var prependSlash = function prependSlash(pathString) {
  return pathString !== '' && pathString.charAt(0) !== '/' ? "/".concat(pathString) : '';
};
/**
 * Traverses a directory recursively and returns a list of all files
 * relatively to `rootPath`
 * @param {string} rootPath absolute path to a directory
 * @param {string} [sub=""] a path to a sub directory relative `rootPath`
 * @returns {string[]}
 */


function traverseDir(rootPath) {
  var sub = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var dirPath = path.join(rootPath, sub);
  var pathTree = fs.readdirSync(dirPath).filter(function (file) {
    return file !== '.' && file !== '..';
  }).map(function (file) {
    var subPath = path.join(sub, file);
    var absPath = path.join(rootPath, subPath);

    if (fs.statSync(absPath).isDirectory()) {
      return traverseDir(rootPath, subPath);
    }

    return prependSlash(subPath.replace(/\\/g, '/').replace('index.js', '').replace(/\.m?jsx?/g, '').replace(/\/$/, ''));
  });
  return flatten(pathTree);
}
/**
 * Build PathMap object for a given locale (lang)
 * @typedef {Object<string, { page: string, query: { lang: string } }} PathMap
 * @param {string[]} paths A list of paths, relative to `/pages/[lang]`
 * @param {string} lang    The locale to apply to those paths
 * @return {PathMap}
 */


function buildPathMapForLang(paths, lang) {
  return paths.reduce(function (pathMap, pagePath) {
    return _objectSpread({}, pathMap, _defineProperty({}, "/".concat(lang).concat(pagePath), {
      page: "/[lang]".concat(pagePath),
      query: {
        lang: lang
      }
    }));
  }, {});
}
/**
 * Builds path maps according to locale files in `/locales`
 * @returns {PathMap}
 */


function localizedPathMaps() {
  var paths = traverseDir(path.join(process.cwd(), 'pages', '[lang]'));
  var locales = getLocales();
  return locales.reduce(function (acc, lang) {
    return _objectSpread({}, acc, {}, buildPathMapForLang(paths, lang));
  }, {});
}

function withI18nTagPlugin() {
  var nextConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var composePlugins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var nextComposePlugins = composePlugins.nextComposePlugins;

  var nextConfigMethod = function nextConfigMethod(phase, args) {
    var orginalConfig = nextConfig;

    if (typeof nextConfig === 'function') {
      orginalConfig = nextConfig(phase, args);
    }

    var newConfig = _objectSpread({}, orginalConfig);

    if (phase === PHASE_EXPORT) {
      Object.assign(newConfig, {
        exportTrailingSlash: true,
        exportPathMap: function exportPathMap(defaultPathMap) {
          return _objectSpread({}, defaultPathMap, {}, localizedPathMaps());
        }
      });
    }

    return newConfig;
  };

  var phase = composePlugins.phase;
  return nextComposePlugins ? nextConfigMethod(phase) : nextConfigMethod;
}

module.exports = {
  withI18nTagPlugin: withI18nTagPlugin
};