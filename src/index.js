import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@wearedevx/i18n-tag-wrapper'
import { setLinkLocale } from './link'

export default i18n
export { default as Link } from './link'

let setLocale = false
let _configs = {
  locales: []
}

export const i18nSetup = (configs) => {
  _configs = configs
  setLocale = i18n.setup(configs)
}

// eslint-disable-next-line no-unused-vars
const useLocaleFromQuery = query => {
  // Next
  if (query.lang) {
    setLocale(query.lang)
  }
}

const hasLocale = localeName =>
  Object.keys(_configs.locales).includes(localeName)

export const useLocaleFromPathname = pathname => {
  // the locale will be at index 1 because pathname starts with /
  const localeName = pathname.split('/')[1]

  if (hasLocale(localeName)) {
    setLocale(localeName)

    return localeName
  }

  return ''
}

/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
export const withTranslation = configs => Page => {
  if (!setLocale) {
    i18nSetup(configs)
  }

  // Default function in case none is present
  let originalFunction = () => ({})

  // Backup the maybe-existing getInitialProps
  if (Page.hasOwnProperty('getInitialProps')) {
    originalFunction = Page.getInitialProps
  }

  // Override the getInitialProps
  Page.getInitialProps = params => {
    // params.asPath is the url shown in the browser
    // params.pathname is the path to the file: '/[lang]/...'
    const locale = useLocaleFromPathname(params.asPath)

    const props = originalFunction(params)
    props.lang = locale

    return props
  }

  const HOC = props => {
    const { lang } = props
    setLocale(lang)
    setLinkLocale(lang)

    return <Page {...props} lang={lang} />
  }

  HOC.getInitialProps = Page.getInitialProps

  HOC.propTypes = {
    ...Page.propTypes,
    lang: PropTypes.string,
  }

  HOC.defaultProps = {
    ...Page.defaultProps,
    lang: '',
  }

  return HOC
}
