import React from 'react'

export default (props) => {
  const { children, } = props

  return <button {...props}>
    {children}
  </button>
}
