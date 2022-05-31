import React from 'react'
import { Field, ErrorMessage as BaseErrorMesssage, getIn } from 'formik'

export default ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name)
      const touch = getIn(form.touched, name)
      return touch && error ? error : null
    }}
  />
)
