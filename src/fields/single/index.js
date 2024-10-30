import React from 'react'
import { Field, ErrorMessage, FastField } from 'formik'
import componentResolver from '../componentResolver'
import { nanoid } from 'nanoid'
import LabelRenderer from '../chunks/label'
import PlatformContainer from '../../platform/container/index.js'
import CaptionRenderer from '../chunks/caption'

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

  if (!Component) {
    return null
  }

  const _id = id ? id : nanoid()
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

          const onValueChanged = (value, params) => {
            const {
              resetItems = false
            } = params ? params : {}
            //console.log('onValueChanged', value)
            if (!props.item.id) {
              return
            }
            const { item: { id }, setFieldValue, setFieldTouched } = props

            props._onValueChanged && props._onValueChanged({ id, value })

            !resetItems && setFieldValue(id, value, true)
            !resetItems && setFieldTouched(id, true, false)
          }

          const disabled = props.isSubmitting || props.disabled || (props.item && props.item.disabled)
          const readOnly = props.readOnly || (props.props && props.props.readOnly)
          return <div key={_id}>
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
