import React from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import exact from 'prop-types-exact'

let globalLang = ''

const Link = ({ className, children, lang, ...props }) => {
  const newProps = { ...props }
  let langToUse = lang || globalLang

  if (langToUse !== '') {
    newProps.href = `/${langToUse}${props.href}`

    if (props.as) {
      newProps.as = `/${langToUse}${props.as}`
    }
  }

  return (
    <NextLink {...newProps}>
      <a href={newProps.href} className={className}>
        {children}
      </a>
    </NextLink>
  )
}

Link.propTypes = exact({
  ...NextLink.propTypes,
  lang: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
})

Link.defaultProps = {
  ...NextLink.defaultProps,
  lang: undefined,
}

export default Link

export const setLinkLocale = locale => {
  globalLang = locale
}
