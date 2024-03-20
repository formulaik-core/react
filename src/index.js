import React, { useRef } from 'react'
import { Formik } from 'formik'
import fields from './fields'
import FormulaikCache from './cache'
import yupFromSchema from './lib/yupFromSchema.js'

export default (props) => {
  const {
    error,
    onFormPropsChanged,
    disableCache = false,
    hideErrors = false,
    disabled = false,
    readOnly = false,
    children
  } = props

  //console.log("Solliciting formulaik", props)
  const initialValues = (typeof props.initialValues !== 'function') ? props.initialValues : (props.initialValues && props.initialValues())
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
    return props.onSubmit(valuesRef.current, actions)
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
    {error &&
      <div className="mt-6 text-customc-main text-center">
        <label>{error.message}</label>
      </div>}
  </React.Fragment>
} 