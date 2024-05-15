import React from 'react'

import { View } from 'react-native'

export default (props) => {
  const { children, } = props

  return <View {...props}>
    {children}
  </View>
}
