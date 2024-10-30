import React from 'react'
import PlatformText from '../../../platform/text/index.js'
import PlatformContainer from '../../../platform/container/index.js'

const Caption = (props) => {
  const { caption, hideCaption } = props.item
  if (hideCaption || !caption) {
    return null
  }

  let Result = caption
  if (typeof caption === 'function') {
    Result = caption({ ...props })
  }

  return <React.Fragment>
    <PlatformContainer
      style={{
        marginBottom: "0.5rem",
      }}>
      {(typeof Result === 'string')
        ? <PlatformText style={{
          fontSize: 12,
        }}>{Result}</PlatformText>
        : null}
      {(typeof Result === 'function')
        ? <Result />
        : null}
    </PlatformContainer>
  </React.Fragment>
}

export default Caption
