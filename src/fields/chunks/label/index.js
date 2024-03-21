import React from 'react'
import PlatformText from '../../../platform/text'
import PlatformContainer from '../../../platform/container'

export default (props) => {
    const { label, hideLabel } = props.item
    if (hideLabel || !label) {
        return null
    }

    return <React.Fragment>
        <PlatformContainer
            style={{
                marginBottom: "0.5rem",
            }}
        >
            <PlatformText>{label}</PlatformText>
        </PlatformContainer>
    </React.Fragment>
}