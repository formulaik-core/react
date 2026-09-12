import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Formik } from 'formik'
import fields from '../fields'
import FormulaikCache from '../cache'
import yupFromSchema from '../lib/yupFromSchema.js'
import isEqual from '../lib/isEqual.js'
import PlatformContainer from '../platform/container/index.js'
import PlatformText from '../platform/text/index.js'
import PlatformLink from '../platform/link/index.js'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Reports Formik's state to the consumer after React has drawn the form, and only when that state
// changed. Calling it from Formik's render prop, as before, made every consumer that sets state in
// it (motif cells push their values to the page editor) update a parent in the middle of a render.
const FormPropsReporter = ({ formProps, onFormPropsChangedRef }) => {
  const formPropsRef = useRef(formProps)
  formPropsRef.current = formProps
  const {
    values,
    errors,
    touched,
    status,
    isSubmitting,
    isValidating,
    submitCount,
    isValid,
    dirty
  } = formProps

  useEffect(() => {
    onFormPropsChangedRef.current && onFormPropsChangedRef.current(formPropsRef.current)
  }, [values, errors, touched, status, isSubmitting, isValidating, submitCount, isValid, dirty])

  return null
}

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

  const computeInitialValues = () => {
    return (typeof _initialValues !== 'function') ? _initialValues : (props.initialValues && _initialValues())
  }
  const _initialValues = props.initialValues ? props.initialValues : props.values
  const [initialValues, setInitialValues] = useState(computeInitialValues())

  const validationSchema = useMemo(() => {
    if (props.validationSchema) {
      return (typeof props.validationSchema !== 'function')
        ? props.validationSchema
        : (props.validationSchema && props.validationSchema())
    }

    const inputs = Array.isArray(props.inputs) ? props.inputs : props.inputs()
    return yupFromSchema({ inputs })
  }, [props.validationSchema, props.inputs])

  const valuesRef = useRef(initialValues ? initialValues : {})
  const cacheRef = useRef(null)
  if (cacheRef.current === null) {
    cacheRef.current = new FormulaikCache()
  }
  const cache = disableCache ? null : (props.cache ? props.cache : cacheRef.current)

  // `props.values` reference changing is meant to signal "load a different
  // record, reinitialize the form" - but a consumer that (often
  // unintentionally) recomputes an equivalent `values` object literal on
  // every render was getting that same reinitialize on every single field
  // edit, silently discarding whichever field the form itself had already
  // accumulated since mount (Formik's own `initialValues` reinitialize has
  // the identical failure mode without `enableReinitialize`, which is off
  // by default for exactly this reason). The isEqual guard makes this only
  // fire for an actual data change, not merely a new reference - a
  // genuinely different `values` (e.g. switching which record is being
  // edited) still reinitializes exactly as before.
  const previousValuesRef = useRef(props.values)

  useEffect(() => {
    if (isEqual(previousValuesRef.current, props.values)) {
      return
    }
    previousValuesRef.current = props.values

    const next = computeInitialValues()
    setInitialValues(next)
    valuesRef.current = next ? next : {}
  }, [props.values])

  const containersProps = useRef({})

  const onFormPropsChangedRef = useRef(onFormPropsChanged)
  onFormPropsChangedRef.current = onFormPropsChanged

  // Fields holding input the form doesn't have yet: a value waiting out its debounce, or async
  // work such as an availability check. Each registers a flush that hands its value over now and
  // settles once it has. Every submit path flushes them first, so the form submits what the
  // fields show.
  const pendingInputsRef = useRef(new Set())
  const registerPendingInput = useCallback((flush) => {
    pendingInputsRef.current.add(flush)
    return () => {
      pendingInputsRef.current.delete(flush)
    }
  }, [])

  // Formik's submitForm and validateForm read the values of its last render, not the ones a flush
  // just set. After flushing, wait for a render to commit before calling them.
  const [, setCommitRequests] = useState(0)
  const commitWaitersRef = useRef([])
  useIsomorphicLayoutEffect(() => {
    if (!commitWaitersRef.current.length) {
      return
    }
    const waiters = commitWaitersRef.current
    commitWaitersRef.current = []
    waiters.forEach((resolve) => resolve())
  })
  const nextCommit = () => new Promise((resolve) => {
    commitWaitersRef.current.push(resolve)
    setCommitRequests((n) => n + 1)
  })

  const flushPendingInputs = async () => {
    const flushes = [...pendingInputsRef.current]
    if (!flushes.length) {
      return
    }
    await Promise.allSettled(flushes.map((flush) => {
      try {
        return Promise.resolve(flush())
      } catch (e) {
        return Promise.reject(e)
      }
    }))
    await nextCommit()
  }

  const formikRef = useRef(null)
  const submitInFlightRef = useRef(null)

  // One submit at a time: a click on a submit button also fires the form's native submit, and
  // while a flush is pending Formik hasn't yet disabled the button through isSubmitting.
  const submitForm = useCallback(() => {
    if (submitInFlightRef.current) {
      return submitInFlightRef.current
    }
    const run = pendingInputsRef.current.size
      ? flushPendingInputs().then(() => formikRef.current.submitForm())
      : formikRef.current.submitForm()
    const inFlight = Promise.resolve(run).finally(() => {
      submitInFlightRef.current = null
    })
    submitInFlightRef.current = inFlight
    return inFlight
  }, [])

  const handleSubmit = useCallback((e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    submitForm().catch((reason) => {
      console.warn('Warning: An unhandled error was caught from submitForm()', reason)
    })
  }, [submitForm])

  const validateForm = useCallback((...args) => {
    if (!pendingInputsRef.current.size) {
      return formikRef.current.validateForm(...args)
    }
    return flushPendingInputs().then(() => formikRef.current.validateForm(...args))
  }, [])

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
      {formikProps => {
        formikRef.current = formikProps
        const formProps = {
          ...formikProps,
          submitForm,
          handleSubmit,
          validateForm
        }
        return <React.Fragment>
          <FormPropsReporter
            formProps={formProps}
            onFormPropsChangedRef={onFormPropsChangedRef} />
          {fields({
          ...formProps,
          ...props,
          submitForm,
          handleSubmit,
          validateForm,
          registerPendingInput,
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
        })}
        </React.Fragment>
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
