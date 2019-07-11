import React from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'

let lang = ''

const Link = ({ className, children, ...props }) => {
  const newProps = { ...props }
  let langToUse = props.lang || lang

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

Link.propTypes = {
  ...NextLink.propTypes,
  lang: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
}

Link.defaultProps = {
  ...NextLink.defaultProps,
  lang: undefined,
}

export default Link

export const setLinkLocale = locale => {
  lang = locale
}
