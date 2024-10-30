import React from 'react'
import PlatformText from '../../../platform/text/index.js'
import PlatformContainer from '../../../platform/container/index.js'

const Label = (props) => {
  const { label, hideLabel } = props.item
  if (hideLabel || !label) {
    return null
  }

  let Result = label
  if (typeof label === 'function') {
    Result = label({ ...props })
  }

  return <React.Fragment>
    <PlatformContainer
      style={{
        marginBottom: "0.5rem",
      }}>
      {(typeof Result === 'string')
        ? <PlatformText style={{

        }}>{Result}</PlatformText>
        : null}
      {(typeof Result === 'function')
        ? <Result />
        : null}
    </PlatformContainer>
  </React.Fragment>
}

export default Label
