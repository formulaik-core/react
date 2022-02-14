import React, { useCallback } from 'react'
import { Field, ErrorMessage, FastField } from 'formik'
import componentInLibraries from './componentInLibraries'
import { nanoid } from 'nanoid'

export default (props) => {
  const { item: { type, id, label, isDependant = false, forceLabel = false, className = "" }, onValuesChanged } = props
  const Component = componentInLibraries({ componentsLibraries: props.componentsLibraries, item: props.item })
  if (!Component) {
    return null
  }

  const _id = id ? id : nanoid()
  const Renderer = isDependant ? Field : FastField

  return <div className={`form-control mb-4 ${className}`}>
    {
      (label && forceLabel) &&
      <label className="label">
        <span>{label}</span>
      </label>
    }

    <Renderer type={type} name={_id} >
      {({ field, form }) => {

        const customOnValueChanged = (value) => {
          console.log('customOnValueChanged', value)
          if (!props.item.id) {
            return
          }
          const { item: { id }, setFieldValue, setFieldTouched, setValues } = props
          setFieldValue(id, value, false)
          setFieldTouched(id, true, false)
          const _values = { ...props.values }
          _values[id] = value
          //setValues(_values, false)
          onValuesChanged && onValuesChanged(_values)
        }

        return <Component
          {...props}
          value={props.values[id]}
          field={field}
          form={form}
          customOnValueChanged={customOnValueChanged} />
      }}
    </Renderer>
    <ErrorMessage
      name={_id}
      component="div"
      className="text-sm text-red-600 pt-2" />
  </div>
}
