// Structural equality for form `values`/`initialValues` objects - used by
// Formulaik.js to decide whether a new `values` prop reference actually
// represents different data (a genuine "load a different record, reset the
// form" case) versus a consumer recomputing an equivalent object literal on
// every render, which used to reinitialize the form's accumulated state on
// every single field edit for any consumer that did so (confirmed live: it
// silently discarded whichever field was set first in a session, in
// downstream apps that rebuilt `values` inline instead of memoizing it).
const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === '[object Object]'

const isEqual = (a, b) => {
  if (a === b) {
    return true
  }

  if (typeof a !== typeof b) {
    return false
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false
    }
    return a.every((item, index) => isEqual(item, b[index]))
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) {
      return false
    }
    return keysA.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(b, key) &&
        isEqual(a[key], b[key])
    )
  }

  // Anything else (functions, class instances, File/Blob, React elements,
  // etc.) - reference equality was already checked above, so getting here
  // means they're genuinely different.
  return false
}

export default isEqual
