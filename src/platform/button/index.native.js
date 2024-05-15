import React from 'react'

import { Button } from 'react-native'

export default (props) => {
  const { children, } = props
  return <Button {...props}>
    {children}
  </Button>
}
