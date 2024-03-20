export default (props) => {
  const {
    item,
    cache,
    index,
    entry
  } = props
  let _components = props.components ? props.components : props.componentsLibraries
  if (!_components) {
    _components = [() => null]
  }
  let type = null
  let typer = item.component ? item.component : item.type
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

  for (var i = 0; i < _components.length; i++) {
    const library = _components[i]
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
