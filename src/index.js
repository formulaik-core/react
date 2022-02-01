import React from 'react'
import { Formik } from 'formik'
import { generate } from './content'
//import { useForceUpdate } from "react-custom-hook-use-force-update"

export default (props) => {
  const {
    onSubmit,
    error,
    onFormPropsChanged
  } = props

  const initialValues = (typeof props.initialValues !== 'function') ? props.initialValues : (props.initialValues && props.initialValues())
  const validationSchema = (typeof props.validationSchema !== 'function') ? props.validationSchema : (props.validationSchema && props.validationSchema())
  //const forceUpdate = useForceUpdate()

  const onValuesChanged = (values) => {
    props.onValuesChanged && props.onValuesChanged(values)
    console.log('onValuesChanged hook')
    //forceUpdate()
  }

  return (
    <div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {formProps => {
          onFormPropsChanged && onFormPropsChanged(formProps)
          return generate({ ...formProps, ...props, initialValues, validationSchema, onValuesChanged })
        }
        }
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
  )
}
