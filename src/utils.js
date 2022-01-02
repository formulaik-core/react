import { Field, ErrorMessage } from 'formik'
import { Form } from 'formik'
import React from 'react'

export const generateFormContent = (props) => {
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
  const { item, componentsLibraries = [() => null] } = props
  if (item.hide) {
    return null
  }

  var Component = null
  for (var i = 0; i < componentsLibraries.length; i++) {
    Component = componentsLibraries[i](item)
    if (Component) {
      break
    }
  }

  if (!Component) {
    return null
  }

  return <Wrapper {...props} Component={Component} />
}

const Wrapper = (props) => {
  const { item: { type, id, label, forceLabel = false, className = "" }, Component, onValuesChanged } = props

  return <div className={`form-control mb-4 ${className}`}>
    {
      (label && forceLabel) ?
        <label className="label">
          <span>{label}</span>
        </label> : null
    }

    <Field type={type} name={id} >
      {({ field, form }) => {

        const customOnValueChanged = (value) => {
          const { item: { id }, setFieldValue, setFieldTouched } = props
          setFieldValue(id, value)
          setFieldTouched(id, true, false)
          const _values = { ...props.values }
          _values[id] = value
          onValuesChanged && onValuesChanged(_values)
        }

        return <Component
          {...props}
          field={field}
          form={form}
          customOnValueChanged={customOnValueChanged} />
      }}
    </Field>
    <ErrorMessage
      name={id}
      component="div"
      className="text-sm text-red-600 pt-2" />
  </div>
}
