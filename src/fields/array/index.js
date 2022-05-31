import React from 'react'
import { FieldArray, } from 'formik'
import render from './render'
import ErrorMessage from './errorMessage'

export default (props) => {
  const {
    item: {
      type,
      id,
      label,
      forceLabel = false,
      className = "",
    },
    hideErrors,
  } = props

  return <div className={`${className}`}>
    {
      (label && forceLabel) &&
      <div className="label mb-3">
        <p>{label}</p>
      </div>
    }
    <FieldArray
      type={type}
      name={id}
      //validateOnChange
      component={(arrayHelpers) => render({ ...props, arrayHelpers })} />
    {/* <FieldArray
      type={type}
      name={id}
      render={(arrayHelpers) => render({ ...props, arrayHelpers })} /> */}
    {/* <FieldArray
      type={type}
      name={id}>
      {(arrayHelpers) => render({ ...props, arrayHelpers })}
    </FieldArray> */}
    {!hideErrors ?
      <ErrorMessage
        name={id}
        component="div"
        className="text-sm text-red-600 pt-2" /> : null}
  </div>
}
