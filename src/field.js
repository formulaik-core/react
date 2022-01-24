import React from 'react'
import { Field, ErrorMessage } from 'formik'
import componentInLibraries from './componentInLibraries'
import { nanoid } from 'nanoid'

export default (props) => {
  const { item: { type, id, label, forceLabel = false, className = "" }, onValuesChanged } = props
  const Component = componentInLibraries({ componentsLibraries: props.componentsLibraries, item: props.item })
  if (!Component) {
    return null
  }

  const _id = id ? id : nanoid()

  return <div className={`form-control mb-4 ${className}`}>
    {
      (label && forceLabel) &&
      <label className="label">
        <span>{label}</span>
      </label>
    }

    <Field type={type} name={_id} >
      {({ field, form }) => {

        const customOnValueChanged = (value) => {
          if (!props.item.id) {
            return
          }
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
      name={_id}
      component="div"
      className="text-sm text-red-600 pt-2" />
  </div>
}