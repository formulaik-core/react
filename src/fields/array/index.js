import React from 'react'
import { FieldArray, } from 'formik'
import render from './render'
import ErrorMessage from './errorMessage'
import LabelRenderer from '../chunks/label'

export default (props) => {
  const {
    item: {
      type,
      id,
      className = "",
    },
    hideErrors,
  } = props

  return <div className={`${className}`}>
    <LabelRenderer {...props} />
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
        className="text-sm text-pink-600 pt-2" /> : null}
  </div>
}