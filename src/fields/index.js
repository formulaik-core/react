import React from 'react'
import { Form } from 'formik'
import ArrayField from './array'
import SingleField from './single'

export default (props) => {
  const { inputs } = props
  const items = Array.isArray(inputs) ? inputs : inputs()
  return <Form>
    {
      items.map(item => {
        const { isMulti } = item
        if (isMulti) {
          return renderMultiItems({ ...props, item })
        }

        return renderItem({ ...props, item, })
      })
    }
  </Form>
}

const renderMultiItems = (props) => {
  const { item: { className, items } } = props
  return <div className={className}>
    {items.map(_item => renderItem({ ...props, item: _item, }))}
  </div>
}

const renderItem = (props) => {
  const { item } = props
  if (item.hide) {
    return null
  }

  if (item.isList) {
    return <ArrayField {...props} />
  }

  return <SingleField {...props} />
}
