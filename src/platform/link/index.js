import React from 'react'

export default (props) => {
  const { children, } = props

  return <a {...props}>
    {children}
  </a>
}
