import React from 'react'

import { Text } from 'react-native'

export default (props) => {
  const { children, } = props

  return <Text {...props}>
    {children}
  </Text>
}
