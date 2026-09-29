import React, { useRef } from 'react'
import { Field, ErrorMessage, FastField } from 'formik'
import componentResolver from '../componentResolver'
import LabelRenderer from '../chunks/label'
import PlatformContainer from '../../platform/container/index.js'
import CaptionRenderer from '../chunks/caption'
import usePendingValue, { resolveDebounce } from './usePendingValue.js'

let generatedFieldId = 0

export default (props) => {
  const { item: {
    type,
    id,
    isDependant = false,
    className = "" },
    hideErrors } = props

  const _type = props.component ? props.component : type
  const Component = componentResolver({
    ...props,
    components: props.components,
    item: props.item
  })

  const fallbackIdRef = useRef(null)
  if (!fallbackIdRef.current) {
    generatedFieldId += 1
    fallbackIdRef.current = `formulaik-field-${generatedFieldId}`
  }

  const commit = (value, params) => {
    const {
      resetItems = false
    } = params ? params : {}
    const { item: { id }, setFieldValue, setFieldTouched } = props

    props._onValueChanged && props._onValueChanged({ id, value })

    !resetItems && setFieldValue(id, value, true)
    !resetItems && setFieldTouched(id, true, false)
  }

  const pending = usePendingValue({
    commit,
    registerPendingInput: props.registerPendingInput
  })

  // Focus leaving the field (not just moving inside it) hands a pending value over at once.
  const onBlur = (e) => {
    const next = e.relatedTarget
    if (next && e.currentTarget.contains(next)) {
      return
    }
    pending.flush()
  }

  if (!Component) {
    return null
  }

  const _id = id ? id : fallbackIdRef.current
  const Renderer = isDependant ? Field : FastField

  return <React.Fragment>
    <PlatformContainer
      style={{
        marginBottom: "1rem",
      }}
    >
      <LabelRenderer {...props} />
      <Renderer type={_type} name={_id} >
        {({ field, form }) => {

          // A component reports every change; the engine decides when the form gets it.
          const onValueChanged = (value, params) => {
            if (!props.item.id) {
              return
            }
            const { debounce, ...rest } = params ? params : {}
            pending.change(value, params ? rest : params, resolveDebounce({
              item: props.item.debounce,
              component: debounce,
              form: props.debounce
            }))
          }

          const disabled = props.isSubmitting || props.disabled || (props.item && props.item.disabled)
          const readOnly = props.readOnly || (props.props && props.props.readOnly)
          // While a value is pending, the component gets back what it shows, not the form's older one.
          const value = pending.pendingRef.current
            ? pending.pendingRef.current.value
            : props.values[id]
          return <div key={_id} onBlur={onBlur}>
            <Component
              {...props}
              disabled={disabled}
              readOnly={readOnly}
              value={value}
              error={props.errors[id]}
              field={field}
              form={form}
              onValueChanged={onValueChanged} />
            {(!hideErrors && id)
              && <PlatformContainer
                style={
                  {
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    marginTop: "0.5rem",
                    marginBottom: "1rem",
                    borderBottomRightRadius: "0.5rem",
                    borderBottomLeftRadius: "0.5rem"
                  }
                }
              >
                <ErrorMessage
                  name={_id}
                  component="div"
                  className={"error-message"} />
              </PlatformContainer>}
          </div>
        }}
      </Renderer>
      <CaptionRenderer {...props} />
    </PlatformContainer>
    <style jsx>{`
      .error-message {
        margin-top: 1.5rem;
        text-align: center;
        color: #DC2626;
      }
    `}</style>
  </React.Fragment>
}
