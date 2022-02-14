import React, { useEffect } from 'react'
import { useFormikContext } from 'formik'
import { Form } from 'formik'
import FieldArray from './fieldArray'
import Field from './field'


const render = () => {
  const { values } = useFormikContext()
  useEffect(() => {
    console.log('-------------------- values', values)
  }, [values])
  return generate({ ...formProps, ...props, initialValues, validationSchema, onValuesChanged })
}

export const generate = (props) => {
  const { formItemsProvider } = props
  const items = Array.isArray(formItemsProvider) ? formItemsProvider : formItemsProvider()
  return <Form className="grid grid-flow-row">
    {
      items.map(item => {
        const { isMulti } = item
        if (isMulti) {
          return _generateItemsView({ ...props, item })
        }

        return _generateItemView({ ...props, item, })
      })
    }
  </Form>
}

const _generateItemsView = (props) => {
  const { item: { className, items } } = props

  return <div className={className}>
    {items.map(_item => _generateItemView({ ...props, item: _item, }))}
  </div>
}

const _generateItemView = (props) => {
  const { item } = props
  if (item.hide) {
    return null
  }

  if (item.isList) {
    return <FieldArray {...props} />
  }

  return <Field {...props} />
}
