export default (props) => {
  const { componentsLibraries = [() => null], item } = props

  for (var i = 0; i < componentsLibraries.length; i++) {
    const library = componentsLibraries[i]
    if (!library) {
      continue
    }
    if (typeof library !== 'function') {
      console.log('is not function', library)
      continue
    }
    const component = library(item)
    if (component) {
      return component
    }
  }

  return null
}
