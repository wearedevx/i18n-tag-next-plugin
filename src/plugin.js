const path = require('path')
const fs = require('fs')
const { PHASE_EXPORT } = require('next/constants')

/**
 * Builds a list of available locales from `/locales` content
 * @returns {[string]}
 */
function getLocales() {
  const localeDir = path.join(process.cwd(), 'locales')

  return fs
    .readdirSync(localeDir)
    .filter(file => file !== '.' && file !== '..' && file !== 'index.js')
    .map(file => file.replace(/\.m?jsx?/, ''))
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
  return nestedArray.reduce((acc, e) => {
    let flatE = e

    if (Array.isArray(e)) {
      flatE = flatten(e)
      return [...acc, ...flatE]
    }

    return [...acc, flatE]
  }, [])
}

// Prepend a slash if path is not an empty tring and doesn's already have one
/** @param {string} pathString */
const prependSlash = pathString =>
  pathString !== '' && pathString.charAt(0) !== '/' ? `/${pathString}` : ''

/**
 * Traverses a directory recursively and returns a list of all files
 * relatively to `rootPath`
 * @param {string} rootPath absolute path to a directory
 * @param {string} [sub=""] a path to a sub directory relative `rootPath`
 * @returns {string[]}
 */
function traverseDir(rootPath, sub = '') {
  const dirPath = path.join(rootPath, sub)

  const pathTree = fs
    .readdirSync(dirPath)
    .filter(file => file !== '.' && file !== '..')
    .map(file => {
      const subPath = path.join(sub, file)
      const absPath = path.join(rootPath, subPath)

      if (fs.statSync(absPath).isDirectory()) {
        return traverseDir(rootPath, subPath)
      }

      return prependSlash(
        subPath
          .replace(/\\/g, '/')
          .replace('index.js', '')
          .replace(/\.m?jsx?/g, '')
          .replace(/\/$/, '')
      )
    })

  return flatten(pathTree)
}

/**
 * Build PathMap object for a given locale (lang)
 * @typedef {Object<string, { page: string, query: { lang: string } }} PathMap
 * @param {string[]} paths A list of paths, relative to `/pages/[lang]`
 * @param {string} lang    The locale to apply to those paths
 * @return {PathMap}
 */
function buildPathMapForLang(paths, lang) {
  return paths.reduce(
    (pathMap, pagePath) => ({
      ...pathMap,
      [`/${lang}${pagePath}`]: {
        page: `/[lang]${pagePath}`,
        query: { lang },
      },
    }),
    {}
  )
}

/**
 * Builds path maps according to locale files in `/locales`
 * @returns {PathMap}
 */
function localizedPathMaps() {
  const paths = traverseDir(path.join(process.cwd(), 'pages', '[lang]'))
  const locales = getLocales()

  return locales.reduce(
    (acc, lang) => ({
      ...acc,
      ...buildPathMapForLang(paths, lang),
    }),
    {}
  )
}

function withI18nTagPlugin(nextConfig = {}, composePlugins = {}) {
  const { nextComposePlugins } = composePlugins

  const nextConfigMethod = (phase, args) => {
    let orginalConfig = nextConfig

    if (typeof nextConfig === 'function') {
      orginalConfig = nextConfig(phase, args)
    }

    const newConfig = {
      ...orginalConfig,
    }

    if (phase === PHASE_EXPORT) {
      Object.assign(newConfig, {
        exportTrailingSlash: true,
        exportPathMap: defaultPathMap => ({
          ...defaultPathMap,
          ...localizedPathMaps(),
        }),
      })
    }

    return newConfig
  }

  const { phase } = composePlugins

  return nextComposePlugins ? nextConfigMethod(phase) : nextConfigMethod
}

module.exports = { withI18nTagPlugin }
