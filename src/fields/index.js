import React from 'react'
import ArrayField from './array'
import SingleField from './single'
import * as ReactDOM from 'react-dom'
import PlatformForm from '../platform/form/index.js'

export default (props) => {
  const { inputs } = props
  const items = Array.isArray(inputs) ? inputs : inputs()
  return <PlatformForm>
    {
      items.map(item => {
        const { isMulti } = item
        if (isMulti) {
          return renderMultiItems({ ...props, item })
        }

        return renderItem({ ...props, item, })
      })
    }
  </PlatformForm>
}

const renderMultiItems = (props) => {
  const { item: { className, items } } = props
  return <div className={`#TODO -mb-2 ${className}`}>
    {items.map(_item => renderItem({ ...props, item: _item, }))}
  </div>
}

const renderItem = (props) => {
  const { item } = props
  if (item.hide) {
    return null
  }

  const { portalContainer,
    className = "" } = item

  if (item.isList) {
    if (portalContainer) {
      if (!portalContainer.current) {
        return null
      }
      return ReactDOM.createPortal(
        <ArrayField {...props} />,
        portalContainer.current
      )
    }
    else {
      return <ArrayField {...props} />
    }
  }

  if (portalContainer) {
    if (!portalContainer.current) {
      return null
    }
    return ReactDOM.createPortal(
      <SingleField {...props} />,
      portalContainer.current
    )
  }
  else {
    return <SingleField {...props} />
  }
  // return <Shell><SingleField {...props} /></Shell>
}
