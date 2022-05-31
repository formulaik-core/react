import React, { useRef, } from 'react'
import { Formik } from 'formik'
import generate from './fields'
import FormulaikCache from './cache'

export default (props) => {
  const {
    error,
    onFormPropsChanged,
    disableCache = false,
    hideErrors = false,
    disabled = false,
    readOnly = false
  } = props

  console.log("Solliciting formulaik", props)
  const initialValues = (typeof props.initialValues !== 'function') ? props.initialValues : (props.initialValues && props.initialValues())
  const validationSchema = (typeof props.validationSchema !== 'function') ? props.validationSchema : (props.validationSchema && props.validationSchema())

  const _form = useRef()
  const valuesRef = useRef(initialValues ? initialValues : {})
  const cache = disableCache ? null : (props.cache ? props.cache : useRef(new FormulaikCache()).current)

  const onValuesChanged = (values) => {
    valuesRef.current = values
    props.onValuesChanged && props.onValuesChanged(values)
    console.log('onValuesChanged hook')
  }

  const onSubmit = async (values, actions) => {
    const { setValues } = actions
    setValues(valuesRef.current)
    return props.onSubmit(valuesRef.current, actions)
  }

  const _onValueChanged = ({ id, value }) => {
    const values = {
      ...valuesRef.current,
    }
    values[id] = value
    onValuesChanged(values)
  }

  return <div className=''>
    <Formik
      ref={_form}
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
      onSubmit={onSubmit}>
      {formProps => {
        onFormPropsChanged && onFormPropsChanged(formProps)
        return generate({
          ...formProps,
          ...props,
          initialValues,
          validationSchema,
          onValuesChanged,
          _onValueChanged,
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
    {error &&
      <div className="mt-6 text-pink-600 text-center">
        <label>{error.message}</label>
      </div>}
  </div>
}