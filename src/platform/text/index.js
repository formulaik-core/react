import React from 'react'

export default (props) => {
  const { children, } = props

  return <p {...props}>
    {children}
  </p>
}
