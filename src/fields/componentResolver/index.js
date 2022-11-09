export default (props) => {
  const { componentsLibraries = [() => null], item, cache, index, entry } = props

  let type = null
  let typer = item.type
  if (typeof typer === 'function') {
    type = typer({ index, entry })
  } else {
    type = typer
  }

  if (!type) {
    return null
  }

  if (cache) {
    const _cached = cache.getComponent({ key: type })
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


    const component = library({
      ...item,
      type
    })
    if (component) {
      if (cache) {
        cache.addComponent({ component, key: type })
      }
      return component
    }
  }

  return null
}