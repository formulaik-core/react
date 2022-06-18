export default (props) => {
  const { componentsLibraries = [() => null], item, cache } = props

  if (cache) {
    const _cached = cache.getComponent({ key: item.type })
    if (_cached) {
      return _cached
    }
  }


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
      if (cache) {
        cache.addComponent({ component, key: item.type })
      }
      return component
    }
  }

  return null
}