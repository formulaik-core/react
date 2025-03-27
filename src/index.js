import React, { useRef, useState } from 'react'
import { Formik } from 'formik'
import fields from './fields'
import FormulaikCache from './cache'
import yupFromSchema from './lib/yupFromSchema.js'
import PlatformContainer from './platform/container/index.js'
import PlatformText from './platform/text/index.js'
import PlatformLink from './platform/link/index.js'

export default (props) => {
  const {
    onFormPropsChanged,
    disableCache = false,
    hideErrors = false,
    disabled = false,
    readOnly = false,
    children,
    hideBrand = false
  } = props

  const [error, setError] = useState(props.error)
  const [success, setSuccess] = useState(props.success)

  const _initialValues = props.initialValues ? props.initialValues : props.values
  const initialValues = (typeof _initialValues !== 'function') ? _initialValues : (props.initialValues && _initialValues())

  let validationSchema = null
  if (props.validationSchema) {
    validationSchema = (typeof props.validationSchema !== 'function') ? props.validationSchema : (props.validationSchema && props.validationSchema())
  }
  else {
    validationSchema = yupFromSchema({ inputs: props.inputs })
  }

  const valuesRef = useRef(initialValues ? initialValues : {})
  const cache = disableCache ? null : (props.cache ? props.cache : useRef(new FormulaikCache()).current)

  const containersProps = useRef({})

  const onContainerPropsChanged = ({ id, props: containerProps }) => {
    const data = {
      ...containersProps.current,
    }
    data[id] = containerProps
    containersProps.current = data
  }

  const onValuesChanged = (values, params) => {
    valuesRef.current = values
    props.onValuesChanged && props.onValuesChanged(values, params)
  }

  const onSubmit = async (values, actions) => {
    const { setValues } = actions
    setValues(valuesRef.current)

    setError(null)
    setSuccess(null)

    const { setSubmitting, } = actions
    setSubmitting(true)

    let result = null
    try {
      const result = await props.onSubmit(valuesRef.current, {
        ...actions,
        setError
      })
      const _success = (result && result.message) ? {
        message: result.message
      } : {}
      setSuccess(_success)
    } catch (e) {
      setError(e)
    }

    setSubmitting(false)
    return result
  }

  const _onValueChanged = ({ id, value }, params) => {
    const values = {
      ...valuesRef.current,
    }
    values[id] = value
    onValuesChanged(values, params)
  }

  return <React.Fragment>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
      onSubmit={onSubmit}>
      {formProps => {
        onFormPropsChanged && onFormPropsChanged(formProps)
        return fields({
          ...formProps,
          ...props,
          initialValues,
          validationSchema,
          onValuesChanged,
          _onValueChanged,
          containersProps: containersProps.current,
          onContainerPropsChanged,
          values: valuesRef.current,
          valuesRef,
          cache,
          disableCache,
          disabled,
          readOnly,
          hideErrors
        })
      }}
    </Formik>
    {children}
    <PlatformContainer style={{

      // textAlign: "center"
    }}>
      {(error || props.error) &&
        <PlatformText
          style={{
            marginTop: "0.5rem",
            fontWeight: 800,
            color: "red"
            // textAlign: "center"
          }}
        >{error ? error.message : (props.error ? props.error.message : "")}
        </PlatformText>
      }
      {(success && success.message) &&
        <PlatformText
          style={{
            marginTop: "0.5rem",
            fontWeight: 800,
            color: "green"
            // textAlign: "center"
          }}
        >{success.message}
        </PlatformText>
      }
    </PlatformContainer>
    {!hideBrand && <PlatformContainer style={{
      marginTop: "1.5rem"
    }}>
      <PlatformText
        style={{
          color: "#bababa",
          fontSize: 12,
        }}>
        {"Made with "}
        <PlatformLink href={'https://formulaik-core.github.io/documentation/'} target={'blank'}>
          {"Formulaik"}
        </PlatformLink>
      </PlatformText>
    </PlatformContainer>}
  </React.Fragment>
}
