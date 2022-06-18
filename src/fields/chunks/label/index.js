import React from 'react'

export default (props) => {
    const { label, hideLabel } = props.item
    if (hideLabel || !label) {
        return null
    }

    return <div className="mb-2">
        <h5>{label}</h5>
    </div>
}