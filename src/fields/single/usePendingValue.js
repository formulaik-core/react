import { useEffect, useRef } from 'react'

// How long a field waits before handing a value to the form: the input definition's `debounce`,
// else what the component asked for when it reported the value, else the form's `debounce`.
// A number of milliseconds, or 'blur' to wait until the field loses focus (or the form submits).
export const resolveDebounce = ({ item, component, form }) => {
  const debounce = [item, component, form].find((d) => d !== undefined && d !== null)
  if (debounce === 'blur') {
    return debounce
  }
  return typeof debounce === 'number' && debounce > 0 ? debounce : 0
}

// Holds a value a field has shown but not yet handed to the form. While something is pending it
// is registered with the form, so a submit flushes it first.
export default ({ commit, registerPendingInput }) => {
  const commitRef = useRef(commit)
  commitRef.current = commit
  const registerRef = useRef(registerPendingInput)
  registerRef.current = registerPendingInput

  const pendingRef = useRef(null)
  const timerRef = useRef(null)
  const unregisterRef = useRef(null)

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (unregisterRef.current) {
      unregisterRef.current()
      unregisterRef.current = null
    }
    pendingRef.current = null
  }

  const flushRef = useRef(null)
  flushRef.current = () => {
    const pending = pendingRef.current
    clear()
    if (pending) {
      commitRef.current(pending.value, pending.params)
    }
  }
  const flush = () => flushRef.current()

  // A field that goes away drops what it hadn't handed over, as the per-input debounces did.
  useEffect(() => clear, [])

  const change = (value, params, debounce) => {
    if (!debounce) {
      clear()
      commitRef.current(value, params)
      return
    }
    pendingRef.current = { value, params }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (debounce !== 'blur') {
      timerRef.current = setTimeout(flush, debounce)
    }
    if (!unregisterRef.current && registerRef.current) {
      unregisterRef.current = registerRef.current(flush)
    }
  }

  return { change, flush, pendingRef }
}
