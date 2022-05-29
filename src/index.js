import React, { useRef, } from 'react'
import { Formik } from 'formik'
import { generate } from './content'
import FormulaikCache from './cache'

export default (props) => {
  const {
    onSubmit,
    error,
    onFormPropsChanged,
    disableCache = false,
    hideErrors = false,
    disabled = false,
    readOnly = false
  } = props

  const initialValues = (typeof props.initialValues !== 'function') ? props.initialValues : (props.initialValues && props.initialValues())
  const validationSchema = (typeof props.validationSchema !== 'function') ? props.validationSchema : (props.validationSchema && props.validationSchema())

  const changedValues = useRef(initialValues)
  const cache = disableCache ? null : (props.cache ? props.cache : useRef(new FormulaikCache()).current)
  const onValuesChanged = (values) => {
    changedValues.current = values
    props.onValuesChanged && props.onValuesChanged(values)
    console.log('onValuesChanged hook')
  }

  const _onValueChanged = ({ id, value }) => {
    const values = {
      ...changedValues.current,
    }
    values[id] = value
    onValuesChanged(values)
  }

  return <div className=''>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
      onSubmit={onSubmit}>
      {formProps => {
        onFormPropsChanged && onFormPropsChanged(formProps)
        return generate({ ...formProps, ...props, initialValues, validationSchema, onValuesChanged, _onValueChanged, cache, disableCache, disabled, readOnly, hideErrors })
      }}
    </Formik>
    {error &&
      <div className="alert alert-error mb-4">
        <div className="flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
          </svg>
          <label>{error.message}</label>
        </div>
      </div>}
  </div>
}
