import React from 'react'
import { Field, ErrorMessage, FastField } from 'formik'
import componentInLibraries from './componentInLibraries'
import { nanoid } from 'nanoid'

export default (props) => {
  const { item: { type, id, label, isDependant = false, forceLabel = false, className = "" },
    onValuesChanged, hideErrors } = props
  const Component = componentInLibraries({ componentsLibraries: props.componentsLibraries, item: props.item })
  if (!Component) {
    return null
  }

  const _id = id ? id : nanoid()
  const Renderer = isDependant ? Field : FastField

  return <div className={`mb-8 ${className}`}>
    {
      (label && forceLabel) &&
      <label className="label">
        <span>{label}</span>
      </label>
    }

    <Renderer type={type} name={_id} >
      {({ field, form }) => {

        const onValueChanged = (value) => {
          console.log('onValueChanged', value)
          if (!props.item.id) {
            return
          }
          const { item: { id }, setFieldValue, setFieldTouched } = props

          const _values = { ...props.values }
          _values[id] = value
          onValuesChanged && onValuesChanged(_values)

          setFieldValue(id, value, true)
          setFieldTouched(id, true, false)
        }

        const disabled = props.isSubmitting || props.disabled || (props.item && props.item.disabled)
        const readOnly = props.readOnly || (props.params && props.params.readOnly)
        return <div>
          <Component
            {...props}
            disabled={disabled}
            readOnly={readOnly}
            value={props.values[id]}
            error={props.errors[id]}
            field={field}
            form={form}
            onValueChanged={onValueChanged} />
          {(!hideErrors && id)
            ? <div className="
            my-2
            mb-4
            px-2
            rounded-b-lg">
              <ErrorMessage
                name={_id}
                component="div"
                className="text-sm text-red-500 " />
            </div>
            : null}
        </div>
      }}
    </Renderer>
  </div>
}
