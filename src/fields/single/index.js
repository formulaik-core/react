import React from 'react'
import { Field, ErrorMessage, FastField } from 'formik'
import componentResolver from '../componentResolver'
import { nanoid } from 'nanoid'
import LabelRenderer from '../chunks/label'
import * as ReactDOM from 'react-dom'

export default (props) => {
  const { item: {
    type,
    id,
    isDependant = false,
    className = "" },
    hideErrors } = props

  const Component = componentResolver({ ...props, componentsLibraries: props.componentsLibraries, item: props.item })
  if (!Component) {
    return null
  }

  const _id = id ? id : nanoid()
  const Renderer = isDependant ? Field : FastField

  return <div>
    <LabelRenderer {...props} />
    <Renderer type={type} name={_id} >
      {({ field, form }) => {

        const onValueChanged = (value, params) => {
          const {
            ignoreField = false
          } = params ? params : {}
          //console.log('onValueChanged', value)
          if (!props.item.id) {
            return
          }
          const { item: { id }, setFieldValue, setFieldTouched } = props

          props._onValueChanged && props._onValueChanged({ id, value })

          !ignoreField && setFieldValue(id, value, true)
          !ignoreField && setFieldTouched(id, true, false)
        }

        const disabled = props.isSubmitting || props.disabled || (props.item && props.item.disabled)
        const readOnly = props.readOnly || (props.props && props.props.readOnly)
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
                className="text-sm text-pink-600" />
            </div>
            : null}
        </div>
      }}
    </Renderer>
  </div>
}